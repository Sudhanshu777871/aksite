import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {BlogManagerComponent} from './blog/blogManager.component';
import {FileManagerComponent} from './fileManager/fileManager.component';
import {PostEditorComponent} from './postEditor/postEditor.component';
import {GalleryManagerComponent} from './galleryManager/galleryManager.component';
import {GalleryEditorComponent} from './galleryEditor/galleryEditor.component';
import {ProjectManagerComponent} from './projectManager/projectManager.component';
import {ProjectEditorComponent} from './projectEditor/projectEditor.component';
import {UserManagerComponent} from './userManager/userManager.component';
import {UserEditorComponent} from './userEditor/userEditor.component';
import {SiteSettingsComponent} from './siteSettings/siteSettings.component';

const routes: Routes = [{
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
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
