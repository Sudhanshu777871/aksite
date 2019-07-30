import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
// import {Observable} from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export interface User {
    // TODO: use Mongoose model
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    imageId: string;
    smallImageId?: string;
}

@Injectable()
export class UserService {
    constructor(private readonly authHttp: AuthHttp) {}

    query() {
        return this.authHttp.get('/api/users/')
            .toPromise()
            .then(extractData)
            .catch(handleError);
    }
    get(user?: User): Promise<User&{token: string}> {
        return this.authHttp.get(`/api/users/${user ? user.id : 'me'}`)
            .toPromise()
            .then(extractData)
            .catch(handleError) as Promise<User&{token: string}>;
    }
    create(user: User): Promise<{token: string}> {
        return this.authHttp.post('/api/users/', user)
            .toPromise()
            .then(extractData)
            .catch(handleError) as Promise<{token: string}>;
    }
    changePassword(id: string, oldPassword: string, newPassword: string): Promise<User> {
        return this.authHttp.put(`/api/users/${id}/password`, {oldPassword, newPassword})
            .toPromise()
            .then(extractData)
            .catch(handleError) as Promise<User>;
    }
    remove(user: User): Promise<User> {
        return this.authHttp.delete(`/api/users/${user.id}`)
            .toPromise()
            .then(extractData)
            .catch(handleError) as Promise<User>;
    }
}

function handleError(err) {
    throw err;
}

function extractData(res: Response): {} {
    if(!res.text()) return {};
    return res.json() || {};
}
