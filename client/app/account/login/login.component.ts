import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';

interface User {
    email: string;
    password: string;
}

@Component({
    selector: 'login',
    template: require('./login.html'),
    styles: [require('./login.scss')],
})
export class LoginComponent {
    user: User = {
        email: '',
        password: '',
    };
    errors: {
        login?: string;
    } = {};
    submitted = false;

    constructor(private readonly router: Router, private readonly authService: AuthService) {}

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
