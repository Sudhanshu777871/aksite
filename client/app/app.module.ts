import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import {
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { DirectivesModule } from '../components/directives.module';
import { ProjectsModule } from './projects/projects.module';
import { BlogModule } from './blog/blog.module';
// import { UserModule } from './user/user.module';
import { ResumeModule } from './resume/resume.module';
import { SettingsModule } from './settings/settings.module';

import {constants} from './app.constants';
import * as Sentry from '@sentry/browser';
import {AUTH_TOKEN_KEY, AuthService} from '../components/auth/auth.service';
import {AdminComponent} from './admin/admin.component';

if(process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: constants.sentry.publicDsn,
    });
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
    handleError(error) {
        const eventId = Sentry.captureException(error.originalError || error);
        Sentry.showReportDialog({ eventId });
    }
}

export function tokenGetter() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

const appRoutes: Routes = [
    {
        path: '',
        children: [{
            path: '',
            pathMatch: 'full',
            redirectTo: '/home',
        }, {
            path: 'account',
            loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        }, {
            path: 'admin',
            component: AdminComponent,
            loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        }, {
            path: 'blog',
            loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
        }, {
            path: 'galleries',
            loadChildren: () => import('./galleries/galleries.module').then(m => m.GalleriesModule),
        }, {
            path: 'projects',
            loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
        }, {
            path: 'settings',
            loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        }, {
            path: 'user',
            loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        }],
    },
];

@NgModule({
    providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }],
    imports: [
        BrowserModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter,
                whitelistedDomains: ['andrewk.me'],
                // blacklistedRoutes: ["example.com/examplebadroute/"]
            }
        }),
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, { enableTracing: true }),
        MainModule,
        DirectivesModule,
        ResumeModule,
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private readonly authService: AuthService) {
        this.authService.checkToken();
    }
}
