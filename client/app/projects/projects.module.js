import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';
import { DirectivesModule } from '../../components/directives.module';

import { ProjectListComponent } from './projectList.component';
import { ProjectComponent } from './project/project.component';

import { ProjectService } from '../../components/Project/Project.service';

const routes: Routes = [{
    path: 'projects',
    component: ProjectListComponent,
}, {
    path: 'projects/project/:id',
    component: ProjectComponent,
}];

@NgModule({
    imports: [
        BrowserModule,
        DirectivesModule,
        RouterModule.forChild(routes),
    ],
    providers: [ProjectService],
    declarations: [
        ProjectListComponent,
        ProjectComponent,
    ],
})
export class ProjectsModule {}
