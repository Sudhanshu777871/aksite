import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'home', component: MainComponent },
];
// UIRouterModule.forChild({
//     states: [{
//         name: 'main',
//         url: '/',
//         component: MainComponent
//     }, {
//         name: 'none',
//         url: '',
//         redirectTo: 'main'
//     }]
// }),

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
    ],
    declarations: [
        MainComponent,
    ],
    providers: [
        SocketService,
    ],
    exports: [
        MainComponent,
    ],
})
export class MainModule {}
