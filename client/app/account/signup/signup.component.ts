import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SignupInfo } from '../../../components/auth/auth.service';

@Component({
    selector: 'signup',
    templateUrl: './signup.html',
    styleUrls: ['./signup.scss'],
})
export class SignupComponent {
    user: SignupInfo;
    errors = {};
    submitted = false;

    constructor(private readonly authService: AuthService,
                private readonly router: Router) {}

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
