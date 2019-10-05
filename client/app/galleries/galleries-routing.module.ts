import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GalleryListComponent } from './galleryList.component';
import { GalleryComponent } from './gallery/gallery.component';
import {GalleryService} from '../../components/gallery/gallery.service';
import {PhotoService} from '../../components/photo/photo.service';

const routes: Routes = [{
    path: '',
    component: GalleryListComponent,
}, {
    path: ':id',
    component: GalleryComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [
        GalleryService,
        PhotoService,
    ],
    exports: [RouterModule],
})
export class GalleriesRoutingModule {}
