import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';

@Component({
    selector: 'signup',
    template: require('./signup.html'),
    styles: [require('./signup.scss')],
})
export class SignupComponent {
    user = {};
    errors = {};
    submitted = false;

    static parameters = [AuthService, Router];
    constructor(authService: AuthService, router: Router) {
        this.authService = authService;
        this.router = router;
    }

    register() {
        this.submitted = true;

        this.authService.createUser({
            name: this.user.name,
            email: this.user.email,
            password: this.user.password
        }).then(() => {
            this.router.navigateByUrl('/home');
        }).catch(err => {
            this.errors = err;
        });
    }

    loginOauth(provider) {
        window.location.href = `/auth/${provider}`;
    }

    sref(state) {
        console.warn(state);
    }
}
