import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {SettingsComponent} from './settings.component';
import {SettingsDashboardComponent} from './dashboard/dashboard.component';
import {SettingsProfile} from './profile/profile.component';

const routes: Routes = [{
    path: '',
    component: SettingsComponent,
    children: [{
        path: '',
        component: SettingsDashboardComponent,
    }, {
        path: 'profile',
        component: SettingsProfile,
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
