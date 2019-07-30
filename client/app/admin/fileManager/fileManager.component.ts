import {Component} from '@angular/core';
import {AuthHttp} from "angular2-jwt";

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

    constructor(private readonly http: AuthHttp) {
        this.http.get('/api/upload')
            .toPromise()
            .then((res: any) => {
                const data = res.json();
                this.files = data.items;
                this.page = data.page;
                this.pages = data.pages;
                this.numItems = data.numItems;
            }, console.log.bind(console));
    }

    openFile(file) {
        console.log(file);
    }

    deleteFile(file) {
        console.log(file);
    }
}
