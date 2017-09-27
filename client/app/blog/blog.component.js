import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import {
    wrapperLodash as _,
    mixin,
    forEach
} from 'lodash-es';
mixin(_, {
    forEach
});
import moment from 'moment';
import { Converter } from 'showdown';
const converter = new Converter();

@Component({
    selector: 'blog',
    template: require('./blog.html'),
    styles: [require('./blog.scss')]
})
export class BlogComponent {
    loadingItems = true;
    noItems = false;
    currentPage;
    pagesize = 10;
    collectionSize = 0;
    posts = [];

    static parameters = [Http, Router];
    constructor(http: Http, router: Router) {
        this.Http = http;
        this.router = router;
        this.$stateParams = {};
        this.$state = {};

        this.currentPage = parseInt(this.$stateParams.page, 10) || 1;
        this.pagesize = this.$stateParams.pagesize || 10;
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
        return this.Http.get(`api/posts?page=${this.currentPage}&pagesize=${this.pagesize}`)
            .toPromise()
            .then(extractData)
            .then(data => {
                this.pages = data.pages;
                this.collectionSize = data.numItems;
                this.posts = data.items;
                _.forEach(this.posts, post => {
                    post.date = moment(post.date).format('LL');
                    post.subheader = converter.makeHtml(post.subheader);
                });
                this.noItems = data.items.length <= 0;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            })
            .catch(function(err) {
                console.log(err);
            });
    }
}

function extractData(res) {
    if(!res.text()) return {};
    return res.json() || { };
}
