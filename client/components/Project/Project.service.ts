import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthHttp} from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProjectService {
    constructor(private readonly http: HttpClient, private readonly authHttp: AuthHttp) {}

    handleError(err) {
        throw err;
    }

    query() {
        return this.http.get('/api/projects/')
            .toPromise()
            .catch(this.handleError);
    }
    get(project: {id: string}) {
        return this.http.get(`/api/projects/${project.id}`)
            .toPromise()
            .catch(this.handleError);
    }
    create(project) {
        return this.http.post('/api/projects/', project)
            .toPromise()
            .catch(this.handleError);
    }
    remove(project) {
        return this.authHttp.delete(`/api/projects/${project.id}`)
            .toPromise()
            .catch(this.handleError);
    }
}
