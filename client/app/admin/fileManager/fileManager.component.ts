import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'file-manager',
    template: require('./fileManager.html'),
    styles: [require('./fileManager.scss')]
})
export default class FileManagerController {
    files: number;
    page: number;
    pages: number;
    numItems: number;

    constructor(private readonly http: HttpClient) {
        this.http.get('/api/upload')
            .toPromise()
            .then((res: any) => {
                this.files = res.items;
                this.page = res.page;
                this.pages = res.pages;
                this.numItems = res.numItems;
            }, console.log.bind(console));
    }

    openFile(file) {
        console.log(file);
    }

    deleteFile(file) {
        console.log(file);
    }
}
