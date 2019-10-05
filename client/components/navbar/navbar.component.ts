import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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

    private authLogout = () => this.authService.logout();
    currentUserObservable = this.authService.currentUserObservable;
    isAdminObservable = this.authService.isAdminObservable;

    constructor(private readonly authService: AuthService,
                private readonly router: Router) {}

    logout() {
        let promise = this.authLogout();
        this.router.navigateByUrl('/home');
        return promise;
    }
}
