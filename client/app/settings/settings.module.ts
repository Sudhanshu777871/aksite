import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule, MatButtonModule, MatIconModule } from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';

import { SettingsComponent } from './settings.component';
import { SettingsDashboardComponent } from './dashboard/dashboard.component';
import {SettingsProfile} from './profile/profile.component';

const routes: Routes = [{
    path: 'settings',
    component: SettingsComponent,
    children: [{
        path: '',
        component: SettingsDashboardComponent,
    }, {
        path: 'profile',
        component: SettingsProfile,
        // }, {
    //     path: 'blog',
    //     component: BlogManagerComponent,
    }]
}];

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SettingsComponent,
        SettingsDashboardComponent,
        SettingsProfile,
    ],
    exports: [
        SettingsComponent,
    ]
})
export class SettingsModule {}
