import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule, MatButtonModule, MatIconModule } from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';

import { SettingsComponent } from './settings.component';
import { SettingsDashboardComponent } from './dashboard/dashboard.component';
import {SettingsProfile} from './profile/profile.component';
import {SettingsRoutingModule} from './settings-routing.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        SettingsRoutingModule,
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
