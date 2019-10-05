import {Component, ViewChild} from '@angular/core';
import {
    wrapperLodash as _,
    mixin,
    chain,
    drop,
    filter,
    map,
    noop
} from 'lodash-es';
mixin(_, {
    chain,
    drop,
    filter,
    map,
    noop
});

import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {Gallery, GalleryService} from '../../../components/gallery/gallery.service';
import {Photo, PhotoService} from '../../../components/photo/photo.service';

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUiDefault from 'photoswipe/dist/photoswipe-ui-default';

import '../../../assets/scss/photoswipe.scss';

interface GalleryPhoto extends Photo {
    index?: number;
}

@Component({
    selector: 'gallery',
    templateUrl: './gallery.html',
    styleUrls: ['./gallery.scss'],
})
export class GalleryComponent {
    galleryId;
    gallery: Gallery;
    error?: Error;
    noPhotos = false;
    photos: GalleryPhoto[] = [];
    items = [];

    cols: GalleryPhoto[][] = [[], [], []];
    @ViewChild('columns', {static: false}) columnEls;

    constructor(private readonly route: ActivatedRoute,
                private readonly photoService: PhotoService,
                private readonly galleryService: GalleryService,
    ) {
        this.galleryId = (this.route.params as unknown as {id: string}).id;
    }

    ngOnInit() {
        this.route.paramMap
            .pipe(switchMap((params: ParamMap) => this.galleryService.get({id: params.get('id')})))
            .subscribe((gallery?: Gallery) => {
                if(!gallery) throw new Error('Gallery not found');
                this.gallery = gallery;
                this.onGallery();
            });
    }

    onLoad(event) {
        console.log(event.path[0].height);
    }

    onGallery() {
        let colIndex = 0;
        let addPhoto = (photo: GalleryPhoto, i: number) => {
            photo.index = i;

            this.cols[colIndex].push(photo);

            if(colIndex === this.cols.length - 1) colIndex = 0;
            else colIndex++;
        };

        const promises = [];
        let photoIndex = 0;
        for(let i = 0; i < this.gallery.photos.length; i++) {
            promises.push(this.photoService.get({id: this.gallery.photos[i]}).then(photo => {
                if(!photo) return;

                this.photos[i] = photo;

                _.delay(addPhoto(photo, photoIndex++), 50);
            }));
        }
    }

    onThumbnailsClick(event) {
        // FIX: looks like photoswipe doesn't always make sure there's a start to the query parameters
        if(!window.location.href.includes('?')) window.location = `${window.location.href}?pswp` as unknown as Location;

        const index = Number(event.currentTarget.attributes['id'].value);

        let pswpElement = document.querySelectorAll('.pswp')[0];
        let vscroll = document.body.scrollTop;

        let button = document.getElementById(String(index));

        let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUiDefault, this.parseThumbnailElements(), {
            index,
            getThumbBoundsFn: (i) => {
                // See Options->getThumbBoundsFn section of docs for more info
                let thumbnail = button.children[0];
                let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                let rect = thumbnail.getBoundingClientRect();
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
            },
            hideAnimationDuration: 300,
            showAnimationDuration: 300
        });
        gallery.init();
        gallery.listen('destroy', function() {
            // Temporary workaround for PhotoSwipe scroll-to-top on close bug
            setTimeout(function() {
                window.scrollTo(null, vscroll);
            }, 5);
        });
    }

    parseThumbnailElements() {
        return this.photos
            .sort((a, b) => a.index - b.index)
            .map(photo => ({
                title: photo.name,
                src: `/api/upload/${photo.fileId}.jpg`,
                msrc: `/api/upload/${photo.thumbnailId}.jpg`,
                w: photo.width,
                h: photo.height,
                el: document.getElementById((photo as any).index),
            }));
    }
}
