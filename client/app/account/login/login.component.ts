import { Component } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';

interface User {
    email: string;
    password: string;
}

@Component({
    selector: 'login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
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

    email = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
    password = new FormControl('', [
        Validators.required,
        Validators.min(8),
        Validators.max(128),
    ]);

    constructor(private readonly router: Router,
                private readonly authService: AuthService) {}

    login() {
        this.submitted = true;

        return this.authService.login({
            email: this.email.value,
            password: this.password.value,
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
