import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap';

import { AuthModule } from './auth/auth.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PreloaderComponent } from './preloader/preloader.component';
import {TimelineComponent} from './timeline/timeline.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CollapseModule,
        AuthModule,
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
