'use strict';
import angular from 'angular';
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

import uirouter from 'angular-ui-router';
import {Component, ViewEncapsulation} from '@angular/core';
import {upgradeAdapter} from '../../app/upgrade_adapter';
import {autobind} from 'core-decorators';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSGrid, makeResponsive, layout } from 'react-stonecutter';

import galleryComponent from './gallery';
import routing from './galleryList.routes';
import GalleryService from '../../components/gallery/gallery.service';

const Grid = makeResponsive(CSSGrid, {
    maxWidth: 1920
});

upgradeAdapter.upgradeNg1Provider('Gallery');

@Component({
    selector: 'gallery-list',
    template: require('./galleryList.html'),
    styles: [require('!!raw!sass!./galleryList.scss')],
    encapsulation: ViewEncapsulation.None
})
export default class GalleryListComponent {
    galleries = [];
    loadingGalleries = true;

    static parameters = ['Gallery', '$http', '$state'];
    constructor(Gallery, $http, $state) {
        this.Gallery = Gallery;
        this.$http = $http;
        this.$state = $state;
    }

    async ngOnInit() {
        let galleries = await this.Gallery.query().$promise;

        this.loadingGalleries = false;
        Reflect.deleteProperty(galleries, '$promise');
        Reflect.deleteProperty(galleries, '$resolved');
        this.galleries = galleries;

        let galleryArray = await Promise.map(this.galleries, async (gallery, i) => {
            let {data} = await this.$http.get(`api/photos/${gallery.featuredId}`);

            return <li style={{padding: '10px'}} key={i} itemHeight={340}>
                <a className="card md-whiteframe-z1" style={{display: 'block'}} id={gallery._id} onClick={this.goToGallery}>
                    <div className="item">
                        <img src={`api/upload/${data.fileId}.jpg`} alt="" />
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
        this.$state.go('gallery', {galleryId: event.currentTarget.id});
    }
}

export default angular.module('aksiteApp.galleries', [uirouter, galleryComponent, GalleryService])
    .config(routing)
    .directive('galleryList', upgradeAdapter.downgradeNg2Component(GalleryListComponent))
    .name;