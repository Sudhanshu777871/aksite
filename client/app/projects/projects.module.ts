import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { DirectivesModule } from '../../components/directives.module';

import { ProjectListComponent } from './projectList.component';
import { ProjectComponent } from './project/project.component';

import { ProjectService } from '../../components/Project/Project.service';
import {ProjectsRoutingModule} from './projects-routing.module';

@NgModule({
    imports: [
        CommonModule,
        DirectivesModule,
        ProjectsRoutingModule,
    ],
    providers: [ProjectService],
    declarations: [
        ProjectListComponent,
        ProjectComponent,
    ],
})
export class ProjectsModule {}
