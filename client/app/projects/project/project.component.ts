import { Component, OnInit } from '@angular/core';
import { Converter } from 'showdown';
const converter = new Converter();
import {Project, ProjectService} from '../../../components/Project/Project.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'project',
    templateUrl: './project.html',
    styleUrls: ['./project.scss'],
})
export class ProjectComponent implements OnInit {
    error;
    project: Project;
    content: string|undefined;

    constructor(private readonly projectService: ProjectService,
                private readonly route: ActivatedRoute) {}

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.projectService.get({id: params.get('id')}))
        ).subscribe((project?: Project) => {
            if(!project) throw new Error('Project not found');
            this.project = project;
            this.content = converter.makeHtml(this.project.content);
        });
    }
}
