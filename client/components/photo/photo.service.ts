import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

export interface Photo {
    _id: string;
    thumbnailId: string;
    name: string;
    width: number;
    height: number;
}

@Injectable()
export class PhotoService {
    constructor(private readonly http: Http,
                private readonly authHttp: AuthHttp) {}

    handleError(err) {
        throw err;
    }

    query() {
        return this.http.get('/api/photos/')
            .toPromise()
            .then(extractData)
            .catch(this.handleError);
    }
    get(photo: {id: string}) {
        return this.http.get(`/api/photos/${photo.id}`)
            .toPromise()
            .then(extractData)
            .catch(this.handleError);
    }
    create(photo) {
        return this.http.post('/api/photos/', photo)
            .toPromise()
            .then(extractData)
            .catch(this.handleError);
    }
    remove(photo: {id: string}) {
        return this.authHttp.delete(`/api/photos/${photo.id}`)
            .toPromise()
            .then(extractData)
            .catch(this.handleError);
    }
}

function extractData(res: Response) {
    if(!res.text()) return {};
    return res.json() || { };
}
