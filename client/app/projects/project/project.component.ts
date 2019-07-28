import { Component, OnInit } from '@angular/core';
import { Converter } from 'showdown';
const converter = new Converter();
import { ProjectService } from '../../../components/Project/Project.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operator/switchMap';

@Component({
    selector: 'project',
    template: require('./project.html'),
    styles: [require('./project.scss')],
})
export class ProjectComponent implements OnInit {
    error;
    project = {};
    content: string|undefined;

    constructor(private readonly projectService: ProjectService, private readonly route: ActivatedRoute) {
        // this.projectId = $stateParams.projectId;
    }

    ngOnInit() {
        switchMap.call(this.route.params, (params: ParamMap) => this.projectService.get({id: params.get('id')}))
            .subscribe(project => {
                this.project = project;
                this.content = converter.makeHtml(project.content);
            });
    }
}
