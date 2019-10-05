import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';

import {
    wrapperLodash as _,
    mixin,
    map,
    trim
} from 'lodash-es';
mixin(_, {
    map,
    trim
});
import { Converter } from 'showdown';
import {User} from '../../../components/auth/user.service';

const converter = new Converter({tables: true});

interface AuthorInfo {
    name: string;
    id: string;
    imageId: string;
    smallImageId: string;
}

interface Post {
    _id: string;
    title: string;
    subheader: string;
    alias: string;
    hidden: boolean;
    author: AuthorInfo;
    date: Date;
    imageId: string;
    content: string;
    categories: string[];
}

@Component({
    selector: 'post-editor',
    templateUrl: './postEditor.html',
    styleUrls: ['../../blog/post/post.scss', './postEditor.scss'],
})
export class PostEditorComponent {
    loadingPost = true;
    submitted = false;
    post: Post;
    categories = '';
    newPost: boolean;
    currentUser: User;
    id: string;
    filename?: string;
    fileToUpload?: File;

    constructor(private readonly http: HttpClient,
                private readonly route: ActivatedRoute,
                private readonly router: Router,
                private readonly authService: AuthService
                /*, fileUploader: FileUploader*/) {}

    async ngOnInit() {
        this.id = await new Promise(resolve => {
            this.route.params.subscribe(params => {
                resolve(params.id);
            });
        });

        this.currentUser = await this.authService.currentUserObservable.toPromise();

        if(!this.id || this.id === 'new') {
            this.post = {
                _id: '',
                title: 'Untitled Post',
                subheader: undefined,
                alias: undefined,
                hidden: false,
                author: {
                    name: this.currentUser.name,
                    id: this.currentUser._id,
                    imageId: this.currentUser.imageId,
                    smallImageId: this.currentUser.smallImageId
                },
                date: new Date(),
                imageId: undefined,
                content: undefined,
                categories: []
            };
            this.loadingPost = false;
            this.newPost = true;
        } else {
            await this.http.get<Post>(`/api/posts/${this.id}`)
                .toPromise()
                .then(data => {
                    console.log(data);
                    this.post = data;
                    this.categories = this.post.categories.join(', ');
                    this.filename = this.post.imageId;
                    if(this.post.hidden !== true && this.post.hidden !== false) {
                        this.post.hidden = false;
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }

        this.loadingPost = false;
        // this.fileUploadService.setOptions({
        //     autoUpload: false
        // });
    }

    markedContent() {
        try {
            return converter.makeHtml(this.post.content || '');
        } catch(e) {
            return '<h1 class=\"text-danger\">Parsing Error</h1>';
        }
    }

    cancel() {
        // if(this.upload) this.upload.abort();
        this.router.navigate(['/admin/blog']);
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

    savePost() {
        this.submitted = true;

        const options: any = {
            url: this.newPost ? 'api/posts/' : `api/posts/${this.post._id}`,
            method: this.newPost ? 'POST' : 'PUT',
            fields: {
                title: this.post.title,
                subheader: this.post.subheader,
                alias: this.post.alias,
                author: this.post.author,
                date: this.post.date,
                content: this.post.content,
                categories: this.post.categories,
                hidden: this.post.hidden,
                newImage: false,
            }
        };

        this.http.request(options.method, options.url, {
            body: options.fields,
        })
            .toPromise()
            .then(console.log);

        return;

        // Uploading image
        if(this.fileToUpload && !(this.filename === this.post.imageId || this.filename === null)) {
            if(!this.newPost) {
                options.fields.newImage = true;
            }

            options.file = this.fileToUpload;
            options.headers = {
                'Content-Type': this.fileToUpload.type
            };
        }

        // convert categories string to array of strings
        if(typeof options.fields.categories === 'string') {
            options.fields.categories = _.map(options.fields.categories.split(','), _.trim);
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
        //         this.$state.go('admin.blog');
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
}
