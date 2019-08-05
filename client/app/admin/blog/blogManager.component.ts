import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import {
    wrapperLodash as _,
    mixin,
    forEach,
    remove
} from 'lodash-es';
mixin(_, {
    forEach,
    remove
});

interface PostQueryData {
    items: {}[];
    page: number;
    pages: number;
    numItems: number;
}

@Component({
    selector: 'blog-manager',
    templateUrl: './blogManager.html',
    styleUrls: ['./blogManager.scss']
})
export class BlogManagerComponent {
    errors = [];
    loadingPosts = true;
    posts = [];
    postDeletions = [];
    postChanges = [];
    dirty = false;
    page: {};
    pages: number;
    items: number;

    constructor(private readonly http: HttpClient,
                private readonly router: Router) {}

    ngOnInit() {
        return this.http.get<PostQueryData>('/api/posts')
            .toPromise()
            .then(data => {
                this.posts = data.items;
                this.posts.forEach(post => {
                    post.bgImg = `api/upload/${post.thumbnailId}.jpg`;
                });
                this.page = data.page;
                this.pages = data.pages;
                this.items = data.numItems;
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
            .then(() => {
                this.loadingPosts = false;
            });
    }

    goToPost(id) {
        this.router.navigate(['admin/blog', id]);
    }

    //TODO: remove strange toggling, change to immediately delete, but show a 'Post Deleted' toast with an 'UNDO' button
    togglePostDeletion(post) {
        if(!post.deleted) {
            post.deleted = true;
            this.dirty = true;
            this.postDeletions.push(post);
        } else {
            post.deleted = false;
            _.remove(this.postDeletions, thisPost => {
                return thisPost._id === post._id;
            });
            if(this.postDeletions.length === 0) {
                this.dirty = false;
            }
        }
    }

    saveChanges() {
        // Delete posts
        _.forEach(this.postDeletions, post => {
            this.http.delete(`/api/posts/${post._id}`)
                .toPromise()
                .then(res => {
                    _.remove(this.posts, post);
                    this.dirty = false;
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }
}
