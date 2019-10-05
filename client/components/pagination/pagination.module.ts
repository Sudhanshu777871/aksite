import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {PaginationComponent} from './pagination.component';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
    ],
    declarations: [
        PaginationComponent,
    ],
    exports: [
        PaginationComponent,
    ]
})
export class PaginationModule {}
