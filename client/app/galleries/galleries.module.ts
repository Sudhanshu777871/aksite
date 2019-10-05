import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../../components/directives.module';

import { GalleryListComponent } from './galleryList.component';
import { GalleryComponent } from './gallery/gallery.component';
import {GalleriesRoutingModule} from './galleries-routing.module';

import { GalleryService } from '../../components/gallery/gallery.service';
import { PhotoService } from '../../components/photo/photo.service';

@NgModule({
    imports: [
        CommonModule,
        DirectivesModule,
        GalleriesRoutingModule,
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
