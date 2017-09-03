import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap';

import { BrowserModule } from '@angular/platform-browser';
import { DirectivesModule } from '../../components/directives.module';

import { GalleryListComponent } from './galleryList.component';
import { GalleryComponent } from './gallery/gallery.component';

import { GalleryService } from '../../components/gallery/gallery.service';
import { PhotoService } from '../../components/photo/photo.service';

const routes: Routes = [{
    path: 'galleries',
    component: GalleryListComponent,
}, {
    path: 'galleries/:id',
    component: GalleryComponent,
}];

@NgModule({
    imports: [
        BrowserModule,
        AlertModule,
        BrowserModule,
        DirectivesModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        GalleryService,
        PhotoService,
    ],
    declarations: [
        GalleryListComponent,
        GalleryComponent,
    ],
})
export class GalleriesModule {}
