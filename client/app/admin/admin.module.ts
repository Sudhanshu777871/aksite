import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule, MatSelectModule, MatSlideToggleModule, MatSidenavModule, MatIconModule, MatButtonModule, MatListModule, MatToolbarModule } from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
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
import {AdminRoutingModule} from './admin-routing.module';

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
        DirectivesModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatToolbarModule,
        ReactiveFormsModule,
        // FileUploadModule,
        // RouterModule.forChild(routes),
        AdminRoutingModule,
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
