'use strict';
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
    encapsulation: ViewEncapsulation.None
})
export class GalleryListComponent {
    galleries = [];
    loadingGalleries = true;

    static parameters = [GalleryService, Http, Router];
    constructor(Gallery: GalleryService, http: Http, router: Router) {
        this.Gallery = Gallery;
        this.Http = http;
        this.router = router;
    }

    async ngOnInit() {
        this.galleries = await this.Gallery.query();

        this.loadingGalleries = false;

        let galleryArray = await Promise.map(this.galleries, async (gallery, i) => {
            let data = await this.Http.get(`api/photos/${gallery.featuredId}`).toPromise().then(extractData);

            return <li style={{padding: '10px'}} key={i} itemHeight={340}>
                <a className="card md-whiteframe-z1" style={{display: 'block'}} id={gallery._id} onClick={this.goToGallery}>
                    <div className="item">
                        <img src={`api/upload/${data.sqThumbnailId}.jpg`} alt="" />
                    </div>
                    <div className="card-content">
                        <h2 className="md-title">{gallery.name}</h2>
                        <p>{gallery.info}</p>
                    </div>
                </a>
            </li>;
        });

        ReactDOM.render(
            <Grid
                className="grid"
                component="ul"
                columnWidth={300}
                itemHeight={340}
                gutterWidth={15}
                gutterHeight={15}
                layout={layout.pinterest}
                duration={800}
                easing="ease-out">
                {galleryArray}
            </Grid>,
            document.getElementById('stonecutter'));
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
