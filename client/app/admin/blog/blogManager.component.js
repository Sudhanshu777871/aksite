'use strict';
import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
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

@Component({
    selector: 'blog-manager',
    template: require('./blogManager.html'),
    styles: [require('./blogManager.scss')]
})
export class BlogManagerComponent {
    errors = [];
    loadingPosts = true;
    posts = [];
    postDeletions = [];
    postChanges = [];
    dirty = false;

    static parameters = [Http, Router];
    constructor(http: Http, router: Router) {
        this.Http = http;
        this.router = router;
    }

    ngOnInit() {
        return this.Http.get('/api/posts')
            .toPromise()
            .then(extractData)
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
            this.Http.delete(`/api/posts/${post._id}`)
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

function extractData(res: Response) {
    if(!res.text()) return {};
    return res.json() || { };
}
