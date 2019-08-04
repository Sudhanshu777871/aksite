import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule, AlertModule } from 'ngx-bootstrap';

import { BlogComponent } from './blog.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [{
    path: 'blog',
    component: BlogComponent,
}, {
    path: 'blog/:id',
    component: PostComponent,
}];

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        PaginationModule.forRoot(),
        AlertModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        BlogComponent,
        PostComponent,
    ],
    exports: [
        BlogComponent,
        PostComponent,
    ]
})
export class BlogModule {}
