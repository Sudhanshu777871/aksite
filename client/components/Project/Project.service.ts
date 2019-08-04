import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Project {
    _id: string;
    name: string;
    info: string;
    file: null;
    content: string;
    hidden: boolean;
    coverId: string;
}

@Injectable()
export class ProjectService {
    constructor(private readonly http: HttpClient) {}

    handleError(err) {
        throw err;
    }

    query() {
        return this.http.get<Project[]>('/api/projects/')
            .toPromise()
            .catch(this.handleError);
    }
    get(project: {id: string}) {
        return this.http.get<Project>(`/api/projects/${project.id}`)
            .toPromise()
            .catch(this.handleError);
    }
    create(project) {
        return this.http.post<Project>('/api/projects/', project)
            .toPromise()
            .catch(this.handleError);
    }
    remove(project) {
        return this.http.delete<Project>(`/api/projects/${project.id}`)
            .toPromise()
            .catch(this.handleError);
    }
}
