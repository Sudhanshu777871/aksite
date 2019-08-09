import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule, MatSidenavModule, MatIconModule, MatButtonModule, MatListModule } from '@angular/material';
import { ProgressbarModule } from 'ngx-bootstrap';
import { RouterModule, Routes } from '@angular/router';
// import { FileUploadModule } from 'ng2-file-upload';

import {AdminComponent} from './admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {BlogManagerComponent} from './blog/blogManager.component';
import {PostEditorComponent} from './postEditor/postEditor.component';
import {UserManagerComponent} from './userManager/userManager.component';
import {UserEditorComponent} from './userEditor/userEditor.component';
import {ProjectManagerComponent} from './projectManager/projectManager.component';
import {ProjectEditorComponent} from './projectEditor/projectEditor.component';
import {GalleryManagerComponent} from './galleryManager/galleryManager.component';
import {GalleryEditorComponent} from './galleryEditor/galleryEditor.component';
import {DirectivesModule} from '../../components/directives.module';
import {SiteSettingsComponent} from './siteSettings/siteSettings.component';
import {FileManagerComponent} from './fileManager/fileManager.component';

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
        path: 'files',
        component: FileManagerComponent,
    }, {
        path: 'blog/:id',
        component: PostEditorComponent,
    }, {
        path: 'galleries',
        component: GalleryManagerComponent,
    }, {
        path: 'galleries/:id',
        component: GalleryEditorComponent,
    }, {
        path: 'projects',
        component: ProjectManagerComponent,
    }, {
        path: 'projects/:id',
        component: ProjectEditorComponent,
    }, {
        path: 'users',
        component: UserManagerComponent,
    }, {
        path: 'users/:id',
        component: UserEditorComponent,
    }, {
        path: 'settings',
        component: SiteSettingsComponent,
    }]
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
        DirectivesModule,
    ],
    declarations: [
        AdminComponent,
        DashboardComponent,
        BlogManagerComponent,
        GalleryManagerComponent,
        GalleryEditorComponent,
        PostEditorComponent,
        ProjectEditorComponent,
        ProjectManagerComponent,
        UserManagerComponent,
        UserEditorComponent,
        SiteSettingsComponent,
        FileManagerComponent,
    ]
})
export class AdminModule {}
