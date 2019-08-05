import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'site-settings',
    templateUrl: './siteSettings.html',
    styleUrls: ['./siteSettings.scss']
})
export class SiteSettingsComponent {
    constructor(private readonly http: HttpClient) {}

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
