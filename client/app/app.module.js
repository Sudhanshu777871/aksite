import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
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
import { RouterModule, Routes } from '@angular/router';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
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
import { SettingsModule } from "./settings/settings.module";

import constants from './app.constants';
import Raven from 'raven-js';

if(process.env.NODE_ENV === 'production') {
    Raven
        .config(constants.sentry.publicDsn)
        .install();
}

class RavenErrorHandler implements ErrorHandler {
    handleError(err:any) : void {
        Raven.captureException(err.originalError);
    }
}

export function getAuthHttp(http) {
    return new AuthHttp(new AuthConfig({
        noJwtError: true,
        globalHeaders: [{Accept: 'application/json'}],
        tokenGetter: () => localStorage.getItem('id_token'),
    }), http);
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
    //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
    providers: [
        {
            provide: AuthHttp,
            useFactory: getAuthHttp,
            deps: [Http],
        },
        { provide: ErrorHandler, useClass: RavenErrorHandler }
    ],
    imports: [
        BrowserModule,
        HttpModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
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
