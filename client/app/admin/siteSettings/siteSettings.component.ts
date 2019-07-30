import {Component} from '@angular/core';
import {AuthHttp} from "angular2-jwt";

@Component({
    selector: 'site-settings',
    template: require('./siteSettings.html'),
    styles: [require('./siteSettings.scss')]
})
export class SiteSettingsComponent {
    constructor(private readonly http: AuthHttp) {}

    cleanOrphans() {
        this.http.get('/api/upload/clean')
            .toPromise()
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            });
    }
}
