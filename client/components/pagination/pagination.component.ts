import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'pagination',
    templateUrl: './pagination.html',
    styleUrls: ['./pagination.scss']
})
export class PaginationComponent {
    @Input() page = 1;
    @Input() pages = 1;
    @Input() maxPages = 5;
    @Output() pageChange = new EventEmitter<number>();

    pageButtons = [];

    ngOnInit() {
        if(this.pages <= this.maxPages) {
            this.pageButtons = new Array(this.pages).fill(0).map((val, i) => i + 1);
        } else {
            // TODO
        }
    }

    previous() {
        this.page--;
        this.pageChange.emit(this.page);
    }
    go(page: number) {
        this.page = page;
        this.pageChange.emit(this.page);
    }
    next() {
        this.page++;
        this.pageChange.emit(this.page);
    }
}
