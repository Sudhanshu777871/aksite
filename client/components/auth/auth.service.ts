import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import {User, UserService} from './user.service';
import 'rxjs/add/operator/toPromise';
import {
    wrapperLodash as _,
    isFunction,
    noop,
    mixin
} from 'lodash-es';
mixin(_, {
    isFunction,
    noop
});

/**
 * Return a callback or noop function
 *
 * @param  {Function|*} cb - a 'potential' function
 * @return {Function}
 */
function safeCb(cb) {
    return _.isFunction(cb) ? cb : noop;
}

interface Credentials {
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    currentUser: User = {
        imageId: '',
    };

    constructor(
        private readonly http: Http,
        private readonly authHttp: AuthHttp,
        private readonly userService: UserService) {
        if(localStorage.getItem('id_token')) {
            this.userService.get().then((user: User) => {
                this.currentUser = user;
            }).catch(err => {
                console.log(err);

                localStorage.removeItem('id_token');
            });
        }
    }

    /**
     * Authenticate user and save token
     */
    login({email, password}: Credentials, callback?: (error, user) => void): Promise<User> {
        return this.http.post('/auth/local', {
            email,
            password
        })
            .toPromise()
            .then(extractData)
            .then(res => {
                localStorage.setItem('id_token', res.token);
                return this.userService.get();
            })
            .then((user: User) => {
                this.currentUser = user;
                localStorage.setItem('user', JSON.stringify(user));
                console.log(this.currentUser);
                safeCb(callback)(null, user);
                return user;
            })
            .catch(err => {
                this.logout();
                safeCb(callback)(err);
                return Promise.reject(err);
            });
    }

    /**
     * Delete access token and user info
     */
    logout(): Promise<void> {
        // this.$cookies.remove('token');
        localStorage.removeItem('user');
        localStorage.removeItem('id_token');
        this.currentUser = {
            imageId: '',
        };
        return Promise.resolve();
    }

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    createUser(user: User, callback?: (error, user: User) => void) {
        return this.userService.create(user)
            .then((data: {token: string}) => {
                localStorage.setItem('id_token', data.token);
                return this.userService.get();
            })
            .then((_user: User) => {
                this.currentUser = _user;
                return safeCb(callback)(null, _user);
            })
            .catch(err => {
                this.logout();
                return safeCb(callback)(err);
            });
    }

    changePassword(oldPassword: string, newPassword: string, callback?: (error, user) => void): Promise<void> {
        return this.userService.changePassword(this.currentUser._id, oldPassword, newPassword)
            .then(() => safeCb(callback)(null))
            .catch(err => safeCb(callback)(err));
    }

    /**
     * Gets all available info on a user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if a user is logged in
     */
    isLoggedIn(): boolean {
        return this.getCurrentUser().hasOwnProperty('role');
    }

    /**
     * Waits for this.currentUser to resolve before checking if user is logged in
     */
    isLoggedInAsync() {
        return Promise.resolve(this.currentUser.hasOwnProperty('role'));
    }

    /**
     * Waits for this.currentUser to resolve before checking if user is logged in
     */
    isLoggedInSync() {
        return this.currentUser.hasOwnProperty('role');
    }

    /**
     * Check if a user is an admin
     */
    isAdmin() {
        return this.currentUser.role === 'admin';
    }

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
        return localStorage.getItem('id_token');
    }
}

function extractData(res: Response) {
    if(!res.text()) return {};
    return res.json() || { };
}
