import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';
// import {GallerySchema} from '../../../server/api/gallery/gallery.model';

export interface Gallery {
    _id: '';
    name: string;
    info: string;
    date: Date;
    hidden: boolean;
    photos: string[];
    featuredId: string;
    metadata: {};
}

@Injectable()
export class GalleryService {
    constructor(private readonly http: Http,
                private readonly authHttp: AuthHttp) {}

    handleError(err) {
        throw err;
    }

    query() {
        return this.http.get('/api/gallery/')
            .toPromise()
            .then(extractData)
            .catch(this.handleError);
    }
    get(gallery: {id: string}) {
        return this.http.get(`/api/gallery/${gallery.id}`)
            .toPromise()
            .then(extractData)
            .catch(this.handleError);
    }
    create(gallery) {
        return this.http.post('/api/gallery/', gallery)
            .toPromise()
            .then(extractData)
            .catch(this.handleError);
    }
    remove(gallery: {id: string}) {
        return this.authHttp.delete(`/api/gallery/${gallery.id}`)
            .toPromise()
            .then(extractData)
            .catch(this.handleError);
    }
}

function extractData(res: Response) {
    if(!res.text()) return {};
    return res.json() || { };
}
