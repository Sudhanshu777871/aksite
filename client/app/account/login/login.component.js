'use strict';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';

@Component({
    selector: 'login',
    template: require('./login.html'),
    style: [require('./login.scss')],
})
export class LoginComponent {
    user = {};
    errors = {};
    submitted = false;

    static parameters = [Router, AuthService];
    constructor(router: Router, authService: AuthService) {
        this.router = router;
        this.authService = authService;
    }

    login() {
        this.submitted = true;

        return this.authService.login({
            email: this.user.email,
            password: this.user.password,
        })
            .then(() => {
                // Logged in, redirect to home
                this.router.navigateByUrl('/home');
            })
            .catch(err => {
                this.errors.login = err.message;
            });
    }

    loginOauth(provider) {
        window.location.href = `/auth/${provider}`;
    }
}
