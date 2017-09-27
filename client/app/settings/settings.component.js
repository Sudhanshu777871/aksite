'use strict';
import { Component } from '@angular/core';
import { AuthService } from '../../components/auth/auth.service';

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
    constructor(authService: AuthService) {
        this.authService = authService;

        this.heightStyle = {
            height: window.innerHeight - 70 - 66
        };
    }

    async ngOnInit() {
        this.currentUser = await this.authService.getCurrentUser();
    }
}
