import {wrapperLodash as _, mixin} from 'lodash-es';
import {
    remove,
    forEach
} from 'lodash-es';
mixin(_, {
    remove,
    forEach
});

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import moment from 'moment';

@Component({
    selector: 'project-manger',
    templateUrl: './projectManager.html',
    styleUrls: ['./projectManager.scss'],
})
export class ProjectManagerComponent {
    errors = [];
    loadingProjects = true;
    projects: any[] = [];
    projectDeletions = [];
    projectChanges = [];
    dirty = false;

    /*@ngInject*/
    constructor(private readonly http: HttpClient) {
        this.http.get('/api/projects/')
            .toPromise()
            .then(res => {
                console.log(res);
                this.projects = res as any/*.json()*/;
                // this.post.content = converter.makeHtml(this.post.content);
                // this.post.date = moment(this.post.date).format('LL');
                this.loadingProjects = false;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    toggleProjectDeletion(project) {
        if(!project.deleted) {
            project.deleted = true;
            this.dirty = true;
            this.projectDeletions.push(project);
        } else {
            project.deleted = false;
            _.remove(this.projectDeletions, thisProject => thisProject._id === project._id);
            if(this.projectDeletions.length === 0) {
                this.dirty = false;
            }
        }
    }

    saveChanges() {
        // Delete projects
        // _.forEach(this.projectDeletions, project => {
        //     this.$http.delete(`/api/projects/${project._id}`)
        //         .then(({data, status}) => {
        //             _.remove(this.projects, project);
        //             this.dirty = false;
        //             console.log(data);
        //             console.log(status);
        //         })
        //         .catch(res => {
        //             console.log(res);
        //         });
        // });
    }
}
