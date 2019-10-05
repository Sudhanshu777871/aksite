import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Photo {
    _id: string;
    thumbnailId: string;
    sqThumbnailId: string;
    fileId: string;
    name: string;
    width: number;
    height: number;
}

@Injectable()
export class PhotoService {
    constructor(private readonly http: HttpClient) {}

    handleError(err) {
        throw err;
    }

    query() {
        return this.http.get<Photo[]>('/api/photos/')
            .toPromise()
            .catch(this.handleError);
    }
    get(photo: {id: string}) {
        return this.http.get<Photo>(`/api/photos/${photo.id}`)
            .toPromise()
            .catch(this.handleError);
    }
    create(photo) {
        return this.http.post<Photo>('/api/photos/', photo)
            .toPromise()
            .catch(this.handleError);
    }
    remove(photo: {id: string}) {
        return this.http.delete(`/api/photos/${photo.id}`)
            .toPromise()
            .catch(this.handleError);
    }
}
