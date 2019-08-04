import {wrapperLodash as _, mixin} from 'lodash-es';
import {
    forEach,
    remove
} from 'lodash-es';
mixin(_, {
    forEach,
    remove
});

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {GalleryService} from "../../../components/gallery/gallery.service";

@Component({
    selector: 'gallery-manager',
    template: require('./galleryManager.html'),
})
export class GalleryManagerComponent {
    errors = [];
    loadingGalleries = true;
    galleries = [];
    galleryDeletions = [];
    galleryChanges = [];
    dirty = false;

    constructor(private readonly http: HttpClient,
                private readonly router: Router,
                private readonly galleryService: GalleryService) {}

    ngOnInit() {
        this.galleryService.query()
            .then(galleries => {
                if(!galleries) throw new Error('Gallery not found');
                this.galleries = galleries;
                _.forEach(this.galleries, gallery => {
                    this.http.get(`/api/photos/${gallery.featuredId}`)
                        .toPromise()
                        .then(res => {
                            gallery.featured = res;
                        });
                //     http.get(`/api/photos/${gallery.featuredId}`)
                //         .then(({data: featured}) => {
                //             gallery.featured = featured;
                //         })
                //         .catch(console.log.bind(console));
                });
                this.loadingGalleries = false;
            });
    }

    goToGallery(galleryId) {
        this.router.navigate(['/admin/galleries/', galleryId]);
    }

    toggleGalleryDeletion(gallery) {
        if(!gallery.deleted) {
            gallery.deleted = true;
            this.dirty = true;
            this.galleryDeletions.push(gallery);
        } else {
            gallery.deleted = false;
            _.remove(this.galleryDeletions, {_id: gallery._id});
            if(this.galleryDeletions.length === 0) {
                this.dirty = false;
            }
        }
    }

    saveChanges() {
        // Delete galleries
        _.forEach(this.galleryDeletions, gallery => {
            // this.http.delete(`/api/gallery/${gallery._id}`)
            //     .then(({data, status}) => {
            //         _.remove(this.galleries, gallery);
            //         this.dirty = false;
            //         console.log(data);
            //         console.log(status);
            //     })
            //     .catch(res => {
            //         console.log(res);
            //     });
        });
    }
}
