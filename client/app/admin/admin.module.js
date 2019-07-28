import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule, MatSidenavModule, MatIconModule, MatButtonModule, MatListModule } from '@angular/material';
import { ProgressbarModule } from 'ngx-bootstrap';
import { RouterModule, Routes } from '@angular/router';
// import { FileUploadModule } from 'ng2-file-upload';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BlogManagerComponent } from './blog/blogManager.component';
import { PostEditorComponent } from './postEditor/postEditor.component';
import { UserManagerComponent } from './userManager/userManager.component';
import { UserEditorComponent } from './userEditor/userEditor.component';

//import '!raw!sass!./admin.scss

const routes: Routes = [{
    path: 'admin',
    component: AdminComponent,
    children: [{
        path: '',
        component: DashboardComponent,
    }, {
        path: 'blog',
        component: BlogManagerComponent,
    }, {
        path: 'blog/:id',
        component: PostEditorComponent,
    }, {
        path: 'users',
        component: UserManagerComponent,
    }, {
        path: 'users/:id',
        component: UserEditorComponent,
    }]
// }, {
//     name: 'admin.dashboard',
//     url: '/dashboard',
//     views: {
//         body: {component: DashboardComponent}
//     }
// }, {
//     name: 'admin.blog',
//     url: '/blog',
//     views: {
//         body: {component: BlogManagerComponent}
//     }
// }, {
//     name: 'admin.post',
//     url: '/post/:postId',
//     views: {
//         body: {component: PostEditorComponent}
//     }
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        MatSlideToggleModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        ProgressbarModule.forRoot(),
        // FileUploadModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        AdminComponent,
        DashboardComponent,
        BlogManagerComponent,
        PostEditorComponent,
        UserManagerComponent,
        UserEditorComponent,
    ]
})
export class AdminModule {}
