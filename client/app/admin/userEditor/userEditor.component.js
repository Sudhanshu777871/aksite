'use strict';
import { Component } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../../../components/auth/auth.service';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'user-editor',
    template: require('./userEditor.html'),
    styles: [require('./userEditor.scss')]
})
export class UserEditorComponent {
    loadingUser = true;
    submitted = false;

    static parameters = [AuthHttp, AuthService, ActivatedRoute];
    constructor(http: AuthHttp, authService: AuthService, route: ActivatedRoute) {
        this.http = http;
        this.authService = authService;
        this.route = route;
    }

    async ngOnInit() {
        this.id = await new Promise(resolve => this.route.params.subscribe(params => resolve(params.id)));

        this.currentUser = await this.authService.getCurrentUser();

        if(!this.id) {
            this.user = {
                name: 'New User',
                email: 'test@example.com'
            };
            this.loadingUser = false;
        } else {
            await this.http.get(`/api/users/${this.id}`)
                .toPromise()
                .then(extractData)
                .then(data => {
                    console.log(data);
                    this.user = data;
                    this.filename = this.user.imageId;
                    this.loadingUser = false;
                })
                .catch(res => {
                    this.error = res;
                    this.loadingUser = false;
                });
        }
    }

    onFileSelect($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var file = $files[0];

        if(!file) {
            this.filename = null;
            this.fileToUpload = null;
        } else {
            this.filename = file.name;
            this.fileToUpload = file;
        }
    }

    saveUser(form) {
        if(!form.$valid) return;

        this.submitted = true;

        let options = {
            url: `api/users/${this.user._id}`,
            method: 'PUT',
            fields: this.user
        };

        if(this.filename !== this.user.imageId && this.filename !== null) {
            options.fields.newImage = true;
            options.file = this.fileToUpload;
            options.headers = {
                'Content-Type': this.fileToUpload.type
            };
        }

        this.upload = this.Upload.upload(options);

        this.upload
            .progress(evt => {
                this.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
            })
            .then(({data, status}) => {
                this.progress = undefined;
                console.log(status);
                console.log(data);
                this.$state.go('admin.users');
            })
            .catch(({data, status}) => {
                this.progress = undefined;
                console.log(status);
                console.log(data);
            });

        this.upload
            .xhr(xhr => {
                this.abort = function() {
                    xhr.abort();
                };
            });
    }

    cancel() {
        if(this.upload) {
            this.upload.abort();
        }
        this.$state.go('admin.users');
    }
}

function extractData(res: Response) {
    if(!res.text()) return {};
    return res.json() || { };
}
