import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdInputModule, MdButtonModule, MdIconModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const accountRoutes: Routes = [{
    path: 'login',
    component: LoginComponent,
    //data: { title: 'Home' }
// }, {
//     path: 'settings',
//     component: SettingsComponent,
}, {
    path: 'signup',
    component: SignupComponent,
}];
// UIRouterModule.forChild({
//     states: [{
//         name: 'login',
//         url: '/login',
//         component: LoginComponent
//     }, {
//         name: 'signup',
//         url: '/signup',
//         component: SignupComponent
//     }]
// }),

@NgModule({
    imports: [
        FormsModule,
        MdInputModule,
        MdButtonModule,
        MdIconModule,
        RouterModule.forChild(accountRoutes),
    ],
    declarations: [
        LoginComponent,
        SignupComponent,
    ],
})
export class AccountModule {}
