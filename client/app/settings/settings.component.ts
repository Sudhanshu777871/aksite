import { Component } from '@angular/core';
import { AuthService } from '../../components/auth/auth.service';
import {User} from "../../components/auth/user.service";

@Component({
    selector: 'user-settings',
    template: require('./settings.html'),
    // styles: [require('./settings.scss')]
})
export class SettingsComponent {
    sections = [{
        title: 'Dashboard',
        icon: 'fa-home',
        link: 'dashboard'
    }, {
        title: 'Profile',
        icon: 'fa-user',
        link: 'profile'
    }];

    static parameters = [AuthService];
    // heightStyle: CSSStyleDeclaration;
    currentUser: User;
    constructor(private readonly authService: AuthService) {
        // this.heightStyle = {
        //     height: `${window.innerHeight - 70 - 66}`;
        // };
    }

    async ngOnInit() {
        this.currentUser = await this.authService.getCurrentUser();
    }
}
