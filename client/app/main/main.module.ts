import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { SocketService } from '../../components/socket/socket.service';
import { CommonModule } from '@angular/common';

export const ROUTES: Routes = [
    { path: 'home', component: MainComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        CommonModule,
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
