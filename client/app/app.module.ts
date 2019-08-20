import { NgModule, ErrorHandler } from '@angular/core';
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
import { GalleriesModule } from './galleries/galleries.module';
import { BlogModule } from './blog/blog.module';
// import { UserModule } from './user/user.module';
import { ResumeModule } from './resume/resume.module';
import { SettingsModule } from './settings/settings.module';

import constants from './app.constants';
// @ts-ignore
import Raven from 'raven-js';
import {AUTH_TOKEN_KEY} from '../components/auth/auth.service';

if(process.env.NODE_ENV === 'production') {
    Raven
        .config(constants.sentry.publicDsn)
        .install();
}

class RavenErrorHandler implements ErrorHandler {
    handleError(err: Error) : void {
        Raven.captureException((err as any).originalError);
    }
}

export function tokenGetter() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

const appRoutes: Routes = [
    //{ path: 'crisis-center', component: CrisisListComponent },
    //{ path: 'hero/:id',      component: HeroDetailComponent },
    // {
    //   path: 'home',
    //   component: MainComponent,
    //   data: { title: 'Home' }
    // },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    // { path: '**', component: AppComponent }
];

@NgModule({
    providers: [
        { provide: ErrorHandler, useClass: RavenErrorHandler }
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: ["andrewk.me"],
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
        RouterModule.forRoot(appRoutes, { enableTracing: process.env.NODE_ENV === 'development' }),
        MainModule,
        DirectivesModule,
        AccountModule,
        AdminModule,
        ProjectsModule,
        GalleriesModule,
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
export class AppModule {}