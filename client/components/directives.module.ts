import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

import {AuthModule} from './auth/auth.module';

import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {PreloaderComponent} from './preloader/preloader.component';
import {TimelineComponent} from './timeline/timeline.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        AuthModule,
        MatToolbarModule,
        MatIconModule,
    ],
    declarations: [
        NavbarComponent,
        FooterComponent,
        PreloaderComponent,
        TimelineComponent,
    ],
    exports: [
        NavbarComponent,
        FooterComponent,
        PreloaderComponent,
        TimelineComponent,
    ]
})
export class DirectivesModule {}
