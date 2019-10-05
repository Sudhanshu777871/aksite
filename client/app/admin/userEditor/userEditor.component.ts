import { Component } from '@angular/core';
import { AuthService } from '../../../components/auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../components/auth/user.service';
import {FormControl, Validators} from '@angular/forms';
import {constants} from '../../app.constants';

@Component({
    selector: 'user-editor',
    templateUrl: './userEditor.html',
    styleUrls: ['./userEditor.scss'],
})
export class UserEditorComponent {
    loadingUser = true;
    submitted = false;
    id: string;
    user: User;
    filename: string;
    fileToUpload?: File;

    userRoles: string[] = constants.userRoles;

    email = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
    name = new FormControl('', [
        Validators.required,
        Validators.min(3),
        Validators.max(60),
    ]);
    role = new FormControl('');

    constructor(private readonly http: HttpClient,
                private readonly authService: AuthService,
                private readonly route: ActivatedRoute,
                private readonly router: Router) {}

    ngOnInit() {
        this.route.params.subscribe(({id}) => {
            this.id = id;

            if(!this.id) {
                this.user = {
                    name: 'New User',
                    email: 'test@example.com',
                    imageId: '',
                };
                this.set();
            } else {
                this.http.get(`/api/users/${this.id}`)
                    .toPromise()
                    .then(data => {
                        console.log(data);
                        // TODO
                        this.user = data as any;
                        this.filename = this.user.imageId;
                        this.set();
                    })
                    .catch(res => {
                        console.error(res);
                    });
            }
        });
    }

    set() {
        this.name.setValue(this.user.name);
        this.email.setValue(this.user.email);
        this.role.setValue(this.user.role);

        this.loadingUser = false;
    }

    onFileSelect($files) {
        //$files: an array of files selected, each file has name, size, and type.
        const file = $files[0];

        if(!file) {
            this.filename = null;
            this.fileToUpload = null;
        } else {
            this.filename = file.name;
            this.fileToUpload = file;
        }
    }

    saveUser() {
        // if(!form.$valid) return;

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
