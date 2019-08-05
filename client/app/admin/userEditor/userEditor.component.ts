import { Component } from '@angular/core';
import { AuthService } from '../../../components/auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from "../../../components/auth/user.service";

@Component({
    selector: 'user-editor',
    templateUrl: './userEditor.html',
    // styleUrls: ['./userEditor.scss']
})
export class UserEditorComponent {
    loadingUser = true;
    submitted = false;
    id: string;
    currentUser: User;
    user: User;
    filename: string;
    fileToUpload?: File;

    constructor(private readonly http: HttpClient,
                private readonly authService: AuthService,
                private readonly route: ActivatedRoute,
                private readonly router: Router) {}

    async ngOnInit() {
        this.id = await new Promise(resolve => this.route.params.subscribe(params => resolve(params.id)));

        this.currentUser = await this.authService.getCurrentUser();

        if(!this.id) {
            this.user = {
                name: 'New User',
                email: 'test@example.com',
                imageId: '',
            };
        } else {
            await this.http.get(`/api/users/${this.id}`)
                .toPromise()
                .then(data => {
                    console.log(data);
                    // TODO
                    this.user = data as any;
                    this.filename = this.user.imageId;
                })
                .catch(res => {
                    console.error(res);
                });
        }

        this.loadingUser = false;
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

        let options: any = {
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

        // this.upload = this.Upload.upload(options);
        //
        // this.upload
        //     .progress(evt => {
        //         this.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
        //     })
        //     .then(({data, status}) => {
        //         this.progress = undefined;
        //         console.log(status);
        //         console.log(data);
        //         this.$state.go('admin.users');
        //     })
        //     .catch(({data, status}) => {
        //         this.progress = undefined;
        //         console.log(status);
        //         console.log(data);
        //     });
        //
        // this.upload
        //     .xhr(xhr => {
        //         this.abort = function() {
        //             xhr.abort();
        //         };
        //     });
    }

    cancel() {
        // if(this.upload) {
        //     this.upload.abort();
        // }
        this.router.navigate(['/admin/users']);
    }
}
