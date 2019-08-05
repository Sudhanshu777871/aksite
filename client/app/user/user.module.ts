import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UserComponent } from './user.component';
import { UserService } from '../../components/auth/user.service';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
    { path: 'user/:id', component: UserComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild(ROUTES),
    ],
    declarations: [
        UserComponent
    ],
    providers: [
        UserService
    ]
})
export class UserModule {}
