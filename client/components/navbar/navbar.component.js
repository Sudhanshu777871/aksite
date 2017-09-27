'use strict';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

//import './navbar.scss';

@Component({
    selector: 'navbar',
    template: require('./navbar.html'),
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

    static parameters = [AuthService, Router];
    constructor(authService: AuthService, router: Router) {
        this.AuthService = authService;
        this.router = router;

        this.isLoggedIn = (...args) => authService.isLoggedInSync(...args);
        this.isAdmin = (...args) => authService.isAdmin(...args);
        this.getCurrentUser = (...args) => authService.getCurrentUser(...args);
        this.authLogout = () => authService.logout();
    }

    logout() {
        let promise = this.authLogout();
        this.router.navigateByUrl('/home');
        return promise;
    }
}
