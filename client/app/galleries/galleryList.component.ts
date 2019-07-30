import {
    wrapperLodash as _,
    mixin,
    noop,
    forEach
} from 'lodash-es';
mixin(_, {
    noop,
    forEach
});

import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { autobind } from 'core-decorators';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSGrid, makeResponsive, layout } from 'react-stonecutter';

import {GalleryService} from '../../components/gallery/gallery.service';

const Grid = makeResponsive(CSSGrid, {
    maxWidth: 1920
});

@Component({
    selector: 'gallery-list',
    template: require('./galleryList.html'),
    styles: [require('./galleryList.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class GalleryListComponent {
    galleries = [];
    loadingGalleries = true;

    constructor(private readonly Gallery: GalleryService,
                private readonly http: Http,
                private readonly router: Router) {}

    async ngOnInit() {
        this.galleries = await this.Gallery.query();

        this.loadingGalleries = false;

        const galleries = [];

        for(let i = 0; i < this.galleries.length; i++) {
            const gallery = this.galleries[i];

            let data = await this.http.get(`api/photos/${gallery.featuredId}`).toPromise().then(extractData);

            const galleryEl = React.createElement("li", {
                style: {
                    padding: '10px'
                },
                key: i,
                itemHeight: 340
            }, React.createElement("a", {
                className: "card md-whiteframe-z1",
                style: {
                    display: 'block'
                },
                id: gallery._id,
                onClick: this.goToGallery,
            }, React.createElement("div", {
                className: "item"
            }, React.createElement("img", {
                src: `api/upload/${data.sqThumbnailId}.jpg`,
                alt: ''
            })), React.createElement("div", {
                className: "card-content"
            }, React.createElement("h2", {
                className: "md-title"
            }, gallery.name), React.createElement("p", null, gallery.info))));

            galleries.push(galleryEl);
        }

        const grid = React.createElement(Grid, {
            className: "grid",
            component: "ul",
            columnWidth: 300,
            itemHeight: 340,
            gutterWidth: 15,
            gutterHeight: 15,
            layout: layout.pinterest,
            duration: 800,
            easing: "ease-out"
        }, galleries);

        ReactDOM.render(grid, document.getElementById('stonecutter'));
    }

    @autobind
    goToGallery(event) {
        this.router.navigate(['/galleries', event.currentTarget.id]);
    }
}

function extractData(res) {
    if(!res.text()) return {};
    return res.json() || { };
}
