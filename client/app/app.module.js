import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { UIRouterModule } from 'ui-router-ng2';
import { AUTH_PROVIDERS } from 'angular2-jwt';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { DirectivesModule } from '../components/directives.module';
// import { AuthModule } from '../components/auth/auth.ng2module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { ProjectsModule } from './projects/projects.module';
import { GalleriesModule } from './galleries/galleries.module';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { ResumeModule } from './resume/resume.module';

@NgModule({
    providers: [AUTH_PROVIDERS],
    imports: [
        BrowserModule,
        HttpModule,
        MaterialModule.forRoot(),
        UIRouterModule.forRoot({useHash: true}),
        MainModule,
        DirectivesModule,
        // AuthModule,
        AccountModule,
        AdminModule,
        ProjectsModule,
        GalleriesModule,
        BlogModule,
        UserModule,
        ResumeModule,
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
