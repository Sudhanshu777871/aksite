import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ng2-bootstrap';

import { AuthModule } from './auth/auth.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PreloaderComponent } from './preloader/preloader.component';

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
    ],
    exports: [
        NavbarComponent,
        FooterComponent,
        PreloaderComponent,
    ]
})
export class DirectivesModule {}
