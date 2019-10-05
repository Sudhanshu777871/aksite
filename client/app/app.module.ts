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
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { ProjectsModule } from './projects/projects.module';
import { BlogModule } from './blog/blog.module';
// import { UserModule } from './user/user.module';
import { ResumeModule } from './resume/resume.module';
import { SettingsModule } from './settings/settings.module';

import {constants} from './app.constants';
import * as Sentry from '@sentry/browser';
import {AUTH_TOKEN_KEY, AuthService} from '../components/auth/auth.service';

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
            path: 'galleries',
            loadChildren: () => import('./galleries/galleries.module').then(m => m.GalleriesModule),
        }]
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
        AccountModule,
        AdminModule,
        ProjectsModule,
        BlogModule,
        // UserModule,
        ResumeModule,
        SettingsModule,
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
