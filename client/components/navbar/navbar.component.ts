import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

//import './navbar.scss';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
    isCollapsed = true;
    menu = [{
        title: 'Home',
        link: '/home',
    }, {
        title: 'Résumé',
        link: '/resume',
    }, {
        title: 'Projects',
        link: '/projects',
    }, {
        title: 'Photography',
        link: '/galleries',
    }, {
        title: 'Blog',
        link: '/blog',
    }];

    isLoggedIn = () => this.authService.isLoggedInSync();
    isAdmin = () => this.authService.isAdmin();
    getCurrentUser = () => this.authService.getCurrentUser();
    authLogout = () => this.authService.logout();

    constructor(private readonly authService: AuthService,
                private readonly router: Router) {}

    logout() {
        let promise = this.authLogout();
        this.router.navigateByUrl('/home');
        return promise;
    }
}
