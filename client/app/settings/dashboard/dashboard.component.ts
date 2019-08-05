import { Component } from '@angular/core';
import { AuthService } from '../../../components/auth/auth.service';

@Component({
    selector: 'settings-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
})
export class SettingsDashboardComponent {
    submitted = false;
    user = {
        oldPassword: undefined,
        newPassword: undefined
    };

    constructor(private readonly authService: AuthService) {
        // un-mark password as wrong when changed
        // $scope.$watch(() => this.userForm.oldPassword.$modelValue, () => {
        //     this.userForm.oldPassword.$setValidity('wrongPassword', true);
        // });
    }

    changePassword() {
        this.submitted = true;

        this.authService.changePassword(this.user.oldPassword, this.user.newPassword)
            .then(res => {
                console.log(res);
                // this.showSimpleToast('Password Updated');
            })
            .catch(err => {
                console.error(err);
                // this.userForm.oldPassword.$setValidity('wrongPassword', false);
            });
    }

    showSimpleToast(text) {
        // this.$mdToast.show(
        //     this.$mdToast.simple()
        //         .textContent(text)
        //         .position('bottom right')
        //         .hideDelay(3000)
        // );
    }
}
