import { Component } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

@Component({
    selector: 'user-manager',
    template: require('./userManager.html'),
    styles: [require('./userManager.scss')]
})
export class UserManagerComponent {
    users = [];

    static parameters = [AuthHttp, Router];
    constructor(http: AuthHttp, router: Router) {
        this.http = http;
        this.router = router;
    }

    ngOnInit() {
        return this.http.get('/api/users')
            .toPromise()
            .then(function(res: Response) {
                if(!res.text()) return {};
                return res.json() || {};
            })
            .then(users => {
                console.log(users);
                this.users = users;
                this.users.forEach(user => {
                    user.bgImg = `url("api/upload/${user.smallImageId}.jpg")`;
                });
                console.log(users);
            })
            .catch(({data, status}) => {
                this.error = {data, status};
            });
    }

    goToUser(id) {
        this.router.navigate(['/admin/users', id]);
    }

    deleteUser(user, ev) {
        this.$mdDialog.show(this.$mdDialog.confirm()
            .title('Are you sure you would like to delete this user?')
            .ariaLabel('Delete User?')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev))
            .then(() => {
                return this.User.remove({id: user._id})
                    .then(() => {
                        this.users.splice(this.$index, 1);
                    })
                    .catch(err => {
                        console.log(err);
                        this.$mdToast.show(
                            this.$mdToast.simple()
                                .textContent('Deleting user failed')
                                .position('bottom right')
                                .hideDelay(10000)
                        );
                    });
            });
    }
}
