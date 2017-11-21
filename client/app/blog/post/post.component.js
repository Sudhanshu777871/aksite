import { Component, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operator/switchMap';
// import Raven from 'raven-js';

import moment from 'moment';
import { Converter } from 'showdown';
const converter = new Converter({tables: true});

@Component({
    selector: 'post',
    template: require('./post.html'),
    styles: [require('./post.scss'), require('../blog.scss')],
    encapsulation: ViewEncapsulation.None
})
export class PostComponent {
    error;
    post = {author: {}};

    static parameters = [ActivatedRoute, Http];
    constructor(route: ActivatedRoute, http: Http) {
        this.route = route;
        this.http = http;
    }

    ngOnInit() {
        switchMap.call(this.route.params, (params: ParamMap) => this.http.get(`api/posts/${params.id}`))
            .subscribe(res => {
                this.post = res.json();
                this.post.content = converter.makeHtml(this.post.content);
                this.post.date = moment(this.post.date).format('LL');
            });
            // .catch(err => {
            //     Raven.captureException(new Error(JSON.stringify(err)));
            //     console.log(err);
            //     this.error = err;
            // });
    }
}
