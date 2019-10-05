import {Component} from '@angular/core';
import {AuthService} from '../../../components/auth/auth.service';
import {User} from '../../../components/auth/user.service';
import {ReplaySubject} from 'rxjs';

@Component({
    selector: 'settings-profile',
    templateUrl: './profile.html',
    styleUrls: ['./profile.scss']
})
export class SettingsProfile {
    currentUser: ReplaySubject<User|null>;

    constructor(private readonly authService: AuthService) {}

    ngOnInit() {
        this.currentUser = this.authService.currentUserObservable;
    }
}
