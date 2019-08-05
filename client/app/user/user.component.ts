import {Component} from '@angular/core';
import {User, UserService} from '../../components/auth/user.service';
import {Router} from '@angular/router';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
    selector: 'user',
    templateUrl: './user.html',
    styleUrls: ['./user.scss']
})
export class UserComponent {
    user: User;

    constructor(private readonly router: Router,
                private readonly userService: UserService,
                private readonly route: ActivatedRoute) {}

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.userService.get({id: params.get('id')} as User))
        ).subscribe((user?: User) => {
            if(!user) throw new Error('User not found');
            this.user = user;
        });
    }
}
