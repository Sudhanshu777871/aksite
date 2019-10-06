import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PaginationModule} from '../../components/pagination/pagination.module';

import { BlogComponent } from './blog.component';
import { PostComponent } from './post/post.component';
import {BlogRoutingModule} from './blog-routing.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        PaginationModule,
        BlogRoutingModule,
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
