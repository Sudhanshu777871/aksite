import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
    wrapperLodash as _,
    mixin,
    forEach
} from 'lodash-es';
mixin(_, {
    forEach
});
// @ts-ignore
import moment from 'moment';
import { Converter } from 'showdown';
const converter = new Converter();

// @ts-ignore
import template from './blog.html';
// @ts-ignore
import blogCss from './blog.scss';

interface Page {
    imageId: string;
    _id: string;
    title: string;
    hidden: string;
    author: {
        id: string;
        name: string;
        imageId: string;
    };
    date: string;
}

interface BlogData {
    // pages
    numItems: number;
    items
}

@Component({
    selector: 'blog',
    template,
    styles: [blogCss]
})
export class BlogComponent {
    loadingItems = true;
    noItems = false;
    currentPage;
    pagesize = 10;
    collectionSize = 0;
    posts = [];
    // pages;

    constructor(private readonly http: HttpClient,
                private readonly router: Router) {
        this.currentPage = /*parseInt(this.$stateParams.page, 10) || */1;
        this.pagesize = /*this.$stateParams.pagesize || */10;
    }

    ngOnInit() {
        return this.getPageData();
    }

    pageChanged({page}) {
        this.currentPage = page;
        // this.router.navigate('blog', {page, pagesize: this.pagesize}, { notify: false, reload: false });
        // this.router.navigate(['blog', {page, pagesize: this.pagesize}]);

        return this.getPageData();
    }

    getPageData() {
        return this.http.get(`api/posts?page=${this.currentPage}&pagesize=${this.pagesize}`)
            .toPromise()
            .then((data: BlogData) => {
                // this.pages = data.pages;
                this.collectionSize = data.numItems;
                this.posts = data.items;
                for(const post of this.posts) {
                    post.date = moment(post.date).format('LL');
                    post.subheader = converter.makeHtml(post.subheader);
                }
                this.noItems = data.items.length <= 0;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            })
            .catch(function(err) {
                console.log(err);
            });
    }
}
