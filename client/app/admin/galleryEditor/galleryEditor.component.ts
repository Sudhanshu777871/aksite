import {wrapperLodash as _, mixin} from 'lodash-es';
import {
    forEach
} from 'lodash-es';
mixin(_, {
    forEach
});

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Gallery, GalleryService} from '../../../components/gallery/gallery.service';
import {switchMap} from 'rxjs/operator/switchMap';

@Component({
    selector: 'gallery-editor',
    template: require('./galleryEditor.html'),
})
export class GalleryEditorComponent {
    photos = [];
    loadingGallery = true;
    nextPhoto = 0;
    id = '';
    newGallery: boolean;
    gallery: Gallery;

    /*@ngInject*/
    constructor(private readonly http: HttpClient,
                private readonly router: Router,
                private readonly route: ActivatedRoute,
                private readonly galleryService: GalleryService) {
        // this.Upload = Upload;

        // switchMap.call(this.route.params, (params: {id: string}) => {
        //     this.id = params.id;
        // });
    }

    async ngOnInit() {
        this.id = await new Promise(resolve => {
            this.route.params.subscribe(params => {
                resolve(params.id);
            });
        });

        if(!this.id || this.id === 'new') {
            this.gallery = {
                name: 'Untitled Gallery',
                info: '',
                photos: [],
                featuredId: '',
                _id: '',
                date: '',
                hidden: false,
            };
            this.loadingGallery = false;
            this.newGallery = true;
        } else {
            this.http.get<Gallery>(`/api/gallery/${this.id}`)
                .toPromise()
                .then(gallery => {
                    this.gallery = gallery;
                            this.nextPhoto = this.gallery.photos.length;
                            _.forEach(this.gallery.photos, photoId => {
                                this.http.get<Gallery>(`/api/photos/${photoId}`)
                                    .toPromise()
                                    .then(res => {
                                        this.photos.push(res);
                                    });
                            });

                    this.loadingGallery = false;
                });
        }
    }

    cancel() {
        // if(this.upload) {
        //     this.upload.abort();
        // }
        // this.$state.go('admin.galleries');
        this.router.navigate(['/admin/galleries']);
    }

    toggleSelect(photo) {
        photo.selected = !photo.selected;
    }

    // FIXME: works when first creating a gallery, but not when adding photos when we already have some
    onFileSelect(files) {
        if(!files || !files.length) return;

        _.forEach(files, file => {
            this.photos.push({
                name: file.name,
                filename: file.name,
                info: '',
                file,
                progress: 0
            });
        });

        // Kick off the first three uploads
        if(files.length > 0) {
            this.uploadPhoto(this.photos[this.nextPhoto]);
            this.nextPhoto++;
            if(files.length > 1) {
                this.uploadPhoto(this.photos[this.nextPhoto]);
                this.nextPhoto++;
                if(files.length > 2) {
                    this.uploadPhoto(this.photos[this.nextPhoto]);
                    this.nextPhoto++;
                }
            }
        }
    }

    uploadPhoto(photo) {
        // this.upload = this.Upload.upload({
        //     url: 'api/upload',
        //     method: 'POST',
        //     file: photo.file,
        //     fields: {
        //         name: photo.name,
        //         purpose: 'photo'
        //     },
        //     headers: {
        //         'Content-Type': photo.file.type
        //     }
        // })
        //     .progress(evt => {
        //         photo.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
        //     })
        //     .success(data => {
        //         photo.thumbnailId = data.thumbnailId;
        //
        //         if(this.photos[this.nextPhoto]) {
        //             this.uploadPhoto(this.photos[this.nextPhoto++]);
        //         }
        //
        //         this.gallery.photos.push(data._id);
        //     })
        //     .error((response, status) => {
        //         photo.err = {status, response};
        //         //TODO: retry, show error
        //     })
        //     .xhr(xhr => {
        //         photo.cancel = function() {
        //             xhr.abort();
        //         };
        //     });
    }

    saveGallery() {
        //TODO: also send requests to save $dirty photo names, info
        if(this.newGallery) {
            // this.$http.post('/api/gallery', this.gallery)
            //     .then(({data, status}) => {
            //         console.log(status);
            //         console.log(data);
            //         this.$state.go('admin.galleries');
            //     })
            //     .catch(({data, status}) => {
            //         console.log(status);
            //         console.log(data);
            //     });
        } else {
            // this.$http.put(`/api/gallery/${this.$stateParams.galleryId}`, this.gallery)
            //     .then(({data, status}) => {
            //         console.log(status);
            //         console.log(data);
            //         this.$state.go('admin.galleries');
            //     })
            //     .catch(({data, status}) => {
            //         console.log(status);
            //         console.log(data);
            //     });
        }
    }
}
