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
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

import {Gallery, GalleryService} from '../../components/gallery/gallery.service';
import {Photo} from "../../components/photo/photo.service";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
    selector: 'gallery-list',
    templateUrl: './galleryList.html',
    styleUrls: ['./galleryList.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GalleryListComponent {
    galleries: Observable<Gallery[]>;
    loadingGalleries = true;
    featuredPhotos: Photo[] = [];

    constructor(private readonly Gallery: GalleryService,
                private readonly http: HttpClient,
                private readonly router: Router) {}

    ngOnInit() {
        // const galleryQueryResult = await this.Gallery.query();
        //
        // if(!galleryQueryResult) throw new Error('Gallery query returned nothing');

        this.galleries = this.http.get<Gallery[]>('/api/gallery/').pipe(tap((galleries => {
            let i = 0;
            for(const gallery of galleries) {
                let j = i;
                this.http.get<Photo>(`api/photos/${gallery.featuredId}`).subscribe((photo) => {
                    console.log(photo);
                    this.featuredPhotos[j] = photo;
                });
                i++;
            }
        })));

        this.loadingGalleries = false;
    }

    goToGallery(event) {
        this.router.navigate(['/galleries', event.currentTarget.id]);
    }
}
