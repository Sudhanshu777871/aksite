import { Component } from '@angular/core';
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
import {autobind} from 'core-decorators';
import {Gallery, GalleryService} from '../../../components/gallery/gallery.service';
import {Photo, PhotoService} from '../../../components/photo/photo.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {switchMap} from 'rxjs/operators';

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUiDefault from 'photoswipe/dist/photoswipe-ui-default';

// import MiniDaemon from '../../../components/minidaemon';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSGrid, measureItems, makeResponsive, layout } from 'react-stonecutter';

const Grid = makeResponsive(measureItems(CSSGrid, { measureImages: true }), {
    maxWidth: 1200,
    minPadding: 50
});

import '../../../assets/scss/photoswipe.scss';
import {Project} from "../../../components/Project/Project.service";

@Component({
    selector: 'gallery',
    template: require('./gallery.html'),
    styles: [
        require('./gallery.scss'),
    ],
})
export class GalleryComponent {
    galleryId;
    gallery: Gallery;
    errors = [];
    photos = [];
    items = [];

    constructor(private readonly route: ActivatedRoute,
                private readonly photoService: PhotoService,
                private readonly galleryService: GalleryService) {
        this.galleryId = (this.route.params as unknown as {id: string}).id;
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.galleryService.get({id: params.get('id')}))
        ).subscribe((gallery?: Gallery) => {
            if(!gallery) throw new Error('Gallery not found');
            this.gallery = gallery;
            this.onGallery();
        });
    }

    async onGallery() {
        const photos = [];
        for(let i = 0; i < this.gallery.photos.length; i++) {
            const photo: Photo|void = await this.photoService.get({id: this.gallery.photos[i]});

            if(!photo) continue;

            this.photos[i] = photo;

            const img = React.createElement('img', {
                src: `/api/upload/${photo.thumbnailId}.jpg`,
                style: {
                    width: '300px'
                },
                alt: photo.name,
            });
            const li = React.createElement('li', {
                className: '',
                style: {
                    padding: 0,
                    margin: 0
                },
                key: i,
                'data-index': i,
                'data-size': `${photo.width}x${photo.height}`,
                onClick: this.onThumbnailsClick,
            }, img);

            photos.push(li);
        }

        ReactDOM.render(
            React.createElement(Grid, {
                className: 'grid',
                component: 'ul',
                columnWidth: 300,
                itemHeight: 340,
                gutterWidth: 0,
                gutterHeight: 0,
                layout: layout.pinterest,
                duration: 800,
                easing: 'ease-out',
            }, photos),
            document.getElementById('stonecutter'));
    }

    @autobind
    onThumbnailsClick(event) {
        // FIX: looks like photoswipe doesn't always make sure there's a start to the query parameters
        if(!window.location.href.includes('?')) window.location = `${window.location.href}?pswp` as unknown as Location;

        const index = Number(event.currentTarget.attributes['data-index'].value);

        let pswpElement = document.querySelectorAll('.pswp')[0];
        let vscroll = document.body.scrollTop;

        if(!this.items || this.items.length === 0) {
            this.items = this.parseThumbnailElements(document.getElementById('stonecutter').childNodes[0].childNodes[0].childNodes);
        }

        let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUiDefault, this.items, {
            index,
            getThumbBoundsFn: i => {
                // See Options->getThumbBoundsFn section of docs for more info
                let thumbnail = this.items[i].el.children[0];
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

    parseThumbnailElements(thumbElements) {
        return _.chain(thumbElements)
            .filter({nodeType: 1, localName: 'li'})
            .map((el, i) => {
                let childElements = el.children[0].children;
                let size = el.getAttribute('data-size').split('x');

                return {
                    src: `/api/upload/${this.photos[i].fileId}.jpg`,
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                    el, // save link to element for getThumbBoundsFn
                    msrc: childElements.length > 0 ? childElements[0].getAttribute('src') : undefined, // thumbnail url
                    title: childElements.length > 1 ? childElements[1].innerHTML : undefined    // caption (contents of figure)
                };
            })
            .value();
    }
}
