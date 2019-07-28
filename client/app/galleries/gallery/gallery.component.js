import { Component, Inject, ViewEncapsulation } from '@angular/core';
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
import {GalleryService} from '../../../components/gallery/gallery.service';
import {PhotoService} from '../../../components/photo/photo.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operator/switchMap';

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

@Component({
    selector: 'gallery',
    template: require('./gallery.html'),
    styles: [
        require('./gallery.scss'),
        require('../../../assets/scss/photoswipe.scss'),
    ],
    encapsulation: ViewEncapsulation.None
})
export class GalleryComponent {
    galleryId;
    gallery = {};
    errors = [];
    photos = [];
    items = [];

    static parameters = [ActivatedRoute, PhotoService, GalleryService];
    constructor(route: ActivatedRoute, Photo: PhotoService, Gallery: GalleryService) {
        this.route = route;
        this.galleryId = this.route.params.id;
        this.Photo = Photo;
        this.Gallery = Gallery;

        // this.ngOnInit();
    }

    ngOnInit() {
        switchMap.call(this.route.params, (params: ParamMap) => this.Gallery.get({id: params.id}))
            .subscribe(gallery => {
                this.gallery = gallery;

                this.onGallery();
            });
    }

    async onGallery() {
        let photoArray = await Promise.map(this.gallery.photos, async (photo, i) => {
            photo = await this.Photo.get({id: photo});

            this.gallery.photos[i] = photo;

            return <li className="" style={{padding: 0, margin: 0}} key={i} data-index={i} data-size={`${photo.width}x${photo.height}`} onClick={this.onThumbnailsClick}>
                <img src={`/api/upload/${photo.thumbnailId}.jpg`} style={{width: '300px'}} alt={photo.name} />
            </li>;
        });

        ReactDOM.render(
            <Grid
                className="grid"
                component="ul"
                columnWidth={300}
                itemHeight={340}
                gutterWidth={0}
                gutterHeight={0}
                layout={layout.pinterest}
                duration={800}
                easing="ease-out">
                {photoArray}
            </Grid>,
            document.getElementById('stonecutter'));
    }

    @autobind
    onThumbnailsClick(event) {
        // FIX: looks like photoswipe doesn't always make sure there's a start to the query parameters
        if(!window.location.href.includes('?')) window.location = `${window.location.href}?pswp`;

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
                    src: `/api/upload/${this.gallery.photos[i].fileId}.jpg`,
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
