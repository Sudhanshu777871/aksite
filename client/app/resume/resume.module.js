import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@Component({
    selector: 'resume',
    template: 'REDIRECTING',
})
class ResumeComponent {
    constructor() {
        window.location = 'https://www.linkedin.com/in/koroluka';
    }
}

const routes: Routes = [{
    path: 'resume',
    component: ResumeComponent,
}];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    providers: [],
    declarations: [
        ResumeComponent
    ],
})
export class ResumeModule {}
