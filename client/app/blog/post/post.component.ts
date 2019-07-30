import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operator/switchMap';
// import Raven from 'raven-js';

// @ts-ignore
import moment from 'moment';
import { Converter } from 'showdown';
const converter = new Converter({tables: true});

interface Post {
    content: string;
    date: string;
}

@Component({
    selector: 'post',
    template: require('./post.html'),
    styles: [require('./post.scss'), require('../blog.scss')],
    encapsulation: ViewEncapsulation.None
})
export class PostComponent {
    error;
    post: Post;

    constructor(private readonly route: ActivatedRoute,
                private readonly http: HttpClient) {}

    ngOnInit() {
        switchMap.call(this.route.params, (params: {id: string}) => this.http.get(`api/posts/${params.id}`))
            .subscribe(res => {
                this.post = res;
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
