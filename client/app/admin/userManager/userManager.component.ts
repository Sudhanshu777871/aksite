import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'user-manager',
    template: require('./userManager.html'),
    styles: [require('./userManager.scss')]
})
export class UserManagerComponent {
    users = [];

    constructor(private readonly http: HttpClient,
                private readonly router: Router) {}

    ngOnInit() {
        return this.http.get('/api/users')
            .toPromise()
            .then(users => {
                console.log(users);
                // TODO
                this.users = users as any;
                this.users.forEach(user => {
                    user.bgImg = `url("api/upload/${user.smallImageId}.jpg")`;
                });
                console.log(users);
            });
    }

    goToUser(id) {
        this.router.navigate(['/admin/users', id]);
    }

    deleteUser(user, ev) {
        // this.$mdDialog.show(this.$mdDialog.confirm()
        //     .title('Are you sure you would like to delete this user?')
        //     .ariaLabel('Delete User?')
        //     .ok('Delete')
        //     .cancel('Cancel')
        //     .targetEvent(ev))
        //     .then(() => {
        //         return this.User.remove({id: user._id})
        //             .then(() => {
        //                 this.users.splice(this.$index, 1);
        //             })
        //             .catch(err => {
        //                 console.log(err);
        //                 this.$mdToast.show(
        //                     this.$mdToast.simple()
        //                         .textContent('Deleting user failed')
        //                         .position('bottom right')
        //                         .hideDelay(10000)
        //                 );
        //             });
        //     });
    }
}
