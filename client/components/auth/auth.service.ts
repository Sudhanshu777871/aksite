import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User, UserService} from './user.service';
import {
    wrapperLodash as _,
    isFunction,
    noop,
    mixin
} from 'lodash-es';
import {ReplaySubject} from 'rxjs';
import { map } from 'rxjs/operators';
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

export interface Credentials {
    email: string;
    password: string;
}

export interface SignupInfo {
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    currentUser: User = {
        imageId: '',
    };
    currentUserObservable = new ReplaySubject<User|null>();

    constructor(
        private readonly http: HttpClient,
        private readonly userService: UserService) {}

    checkToken() {
        if(localStorage.getItem(AUTH_TOKEN_KEY)) {
            return this.userService.get().then((user: User) => {
                this.currentUser = user;
                this.currentUserObservable.next(user);
            }).catch(err => {
                console.log(err);

                localStorage.removeItem(AUTH_TOKEN_KEY);
            });
        } else {
            return Promise.resolve();
        }
    }

    /** Authenticate user and save token */
    login({email, password}: Credentials, callback?: (error, user) => void): Promise<User> {
        return this.http.post('/auth/local', {
            email,
            password
        })
            .toPromise()
            .then((res: {token: string}) => {
                localStorage.setItem(AUTH_TOKEN_KEY, res.token);
                return this.userService.get();
            })
            .then((user: User) => {
                this.currentUser = user;
                this.currentUserObservable.next(user);
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

    /** Delete access token and user info */
    logout(): Promise<void> {
        // this.$cookies.remove('token');
        localStorage.removeItem('user');
        localStorage.removeItem(AUTH_TOKEN_KEY);
        this.currentUser = {
            imageId: '',
        };
        this.currentUserObservable.next(null);
        return Promise.resolve();
    }

    createUser(user: SignupInfo) {
        return this.userService.create(user)
            .then((data: {token: string}) => {
                localStorage.setItem(AUTH_TOKEN_KEY, data.token);
                return this.userService.get();
            })
            .then((_user: User) => {
                this.currentUser = _user;
                this.currentUserObservable.next(_user);
            })
            .catch(err => {
                this.logout();
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
    // isLoggedIn(): boolean {
    //     return this.getCurrentUser().hasOwnProperty('role');
    // }

    /**
     * Waits for this.currentUser to resolve before checking if user is logged in
     */
    // isLoggedInAsync() {
    //     return Promise.resolve(this.currentUser.hasOwnProperty('role'));
    // }

    /**
     * Waits for this.currentUser to resolve before checking if user is logged in
     */
    // isLoggedInSync() {
    //     return this.currentUser.hasOwnProperty('role');
    // }

    /** Check if a user is an admin */
    isAdminObservable = this.currentUserObservable.pipe(map(user => user.role === 'admin'));

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }
}

export const AUTH_TOKEN_KEY = 'id_token';
