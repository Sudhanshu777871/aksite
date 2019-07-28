import { Component } from '@angular/core';
import { StateService } from 'ui-router-ng2';
import { UserService } from '../../components/auth/user.service';

@Component({
    selector: 'user',
    template: require('./user.html'),
    styles: [require('./user.scss')]
})
export class UserComponent {
    user = {};

    static parameters = [StateService, UserService];
    constructor(stateService: StateService, userService: UserService) {
        this.StateService = stateService;
        this.UserService = userService;

        this.id = this.StateService.params.id;

        this.UserService.get({id: this.id}).then(_user => {
            this.user = _user;
        });
    }
}
