import { Component } from '@angular/core';
import { AuthService } from '../../components/auth/auth.service';
import {User} from '../../components/auth/user.service';

@Component({
    selector: 'user-settings',
    templateUrl: './settings.html',
    styleUrls: ['./settings.scss']
})
export class SettingsComponent {
    sections = [{
        title: 'Dashboard',
        icon: 'fa-home',
        link: '/settings'
    }, {
        title: 'Profile',
        icon: 'fa-user',
        link: '/settings/profile'
    }];

    // heightStyle: CSSStyleDeclaration;
    currentUser: User;
    constructor(private readonly authService: AuthService) {
        // this.heightStyle = {
        //     height: `${window.innerHeight - 70 - 66}`;
        // };
    }

    ngOnInit() {
        this.authService.currentUserObservable.subscribe(user => {
            this.currentUser = user;
        });
    }
}
