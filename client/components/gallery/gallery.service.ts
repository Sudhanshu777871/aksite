import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
    constructor(private readonly http: HttpClient) {}

    handleError(err) {
        throw err;
    }

    query() {
        return this.http.get<Gallery[]>('/api/gallery/')
            .toPromise()
            .catch(this.handleError);
    }
    get(gallery: {id: string}) {
        return this.http.get<Gallery>(`/api/gallery/${gallery.id}`)
            .toPromise()
            .catch(this.handleError);
    }
    create(gallery) {
        return this.http.post('/api/gallery/', gallery)
            .toPromise()
            .catch(this.handleError);
    }
    remove(gallery: {id: string}) {
        return this.http.delete(`/api/gallery/${gallery.id}`)
            .toPromise()
            .catch(this.handleError);
    }
}
