import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
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
import {ProjectService} from '../../components/Project/Project.service';
import {GalleryService} from '../../components/gallery/gallery.service';

@NgModule({
    imports: [
        CommonModule,
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
        AdminRoutingModule,
    ],
    providers: [
        ProjectService,
        GalleryService,
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
