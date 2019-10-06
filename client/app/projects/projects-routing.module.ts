import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ProjectListComponent} from './projectList.component';
import {ProjectComponent} from './project/project.component';

const routes: Routes = [{
    path: '',
    component: ProjectListComponent,
}, {
    path: ':id',
    component: ProjectComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProjectsRoutingModule {}
