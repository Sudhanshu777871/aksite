import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignupInfo} from './auth.service';

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
    constructor(private readonly http: HttpClient) {}

    query() {
        return this.http.get('/api/users/')
            .toPromise()
            .catch(handleError);
    }
    get(user?: User): Promise<User&{token: string}> {
        return this.http.get(`/api/users/${user ? user.id : 'me'}`)
            .toPromise()
            .catch(handleError) as Promise<User&{token: string}>;
    }
    create(user: SignupInfo): Promise<{token: string}> {
        return this.http.post('/api/users/', user)
            .toPromise()
            .catch(handleError) as Promise<{token: string}>;
    }
    changePassword(id: string, oldPassword: string, newPassword: string): Promise<User> {
        return this.http.put(`/api/users/${id}/password`, {oldPassword, newPassword})
            .toPromise()
            .catch(handleError) as Promise<User>;
    }
    remove(user: User): Promise<User> {
        return this.http.delete(`/api/users/${user.id}`)
            .toPromise()
            .catch(handleError) as Promise<User>;
    }
}

function handleError(err) {
    throw err;
}
