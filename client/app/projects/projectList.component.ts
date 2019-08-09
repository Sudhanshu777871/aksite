import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {ProjectService} from '../../components/Project/Project.service';

interface Project {
    _id: string;
    thumbnailId: string;
    name: string;
    info: string;
    content: string
    hidden?: boolean;
}

@Component({
    selector: 'project-list',
    templateUrl: './projectList.html',
    styleUrls: ['./projectList.scss'],
})
export class ProjectListComponent {
    projects = [];
    loadingProjects = true;
    errors = [];

    constructor(private readonly Project: ProjectService, private readonly router: Router) {}

    ngOnInit() {
        this.Project.query()
            .then(projects => {
                if(!projects) throw new Error('No projects found');
                this.loadingProjects = false;
                this.projects = projects;
            })
            .catch(res => {
                this.errors.push(res);
            });
    }

    goToProject(event) {
        this.router.navigate(['/projects', event.currentTarget.id]);
    }
}
