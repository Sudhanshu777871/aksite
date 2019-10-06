import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { UserComponent } from './user.component';
import { UserService } from '../../components/auth/user.service';
import {UserRoutingModule} from './user-routing.module';

@NgModule({
    imports: [
        CommonModule,
        UserRoutingModule,
    ],
    declarations: [
        UserComponent
    ],
    providers: [
        UserService
    ]
})
export class UserModule {}
