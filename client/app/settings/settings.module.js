import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule } from '@angular/material';

import { SettingsComponent } from './settings.component';
import { SettingsDashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
    path: 'settings',
    component: SettingsComponent,
    children: [{
        path: '',
        component: SettingsDashboardComponent,
    // }, {
    //     path: 'blog',
    //     component: BlogManagerComponent,
    }]
}];

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        HttpModule,
        MatSidenavModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SettingsComponent,
        SettingsDashboardComponent,
    ],
    exports: [
        SettingsComponent,
    ]
})
export class SettingsModule {}
