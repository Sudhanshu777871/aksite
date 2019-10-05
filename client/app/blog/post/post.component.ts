import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {switchMap} from 'rxjs/operators';
// import Raven from 'raven-js';

// @ts-ignore
import moment from 'moment';
import { Converter } from 'showdown';
import {Gallery} from '../../../components/gallery/gallery.service';
const converter = new Converter({tables: true});

interface Post {
    content: string;
    date: string;
}

@Component({
    selector: 'post',
    templateUrl: './post.html',
    styleUrls: ['./post.scss', '../blog.scss'],
})
export class PostComponent {
    error;
    post: Post;

    constructor(private readonly route: ActivatedRoute,
                private readonly http: HttpClient) {}

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.http.get(`api/posts/${params.get('id')}`))
        ).subscribe((post?: Post) => {
            if(!post) throw new Error('Post not found');
            this.post = post;
            this.post.content = converter.makeHtml(this.post.content);
            this.post.date = moment(this.post.date).format('LL');
        });
    }

    getPost(id: string) {
        return this.http.get(`api/posts/${id}`);
    }
}
