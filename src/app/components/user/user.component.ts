import {Component, Input, OnInit} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-user',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})
export class UserComponent implements OnInit {


    publicUserdataStream: FirebaseObjectObservable<any[]>;
    imageOnly: boolean;

    @Input()
    uid: string;
    @Input()
    imageonly: string;


    ngOnInit() {
        if (this.imageonly) {
            this.imageOnly = true;
        } else {
            this.imageOnly = false;
        }
        // console.log(this.imageonly, this.imageOnly, this.uid);
        this.publicUserdataStream = this.userService.getPublicUserdata(this.uid);


    }

    constructor(private userService: UserService, private authService: AuthService, private af: AngularFire) {
        const self = this;

        this.authService.isAuthenticated().subscribe(authData => {
            if (authData) {

                self.af.database.list('/messenger/' + authData.uid + '/skfLy7Uhifgjg9rDEI1DJyvSKhM2').subscribe(data => {
                    if (data.length === 0) {
                        self.af.database.list('/messenger/' + authData.uid + '/skfLy7Uhifgjg9rDEI1DJyvSKhM2').push({
                            't': 'Hey, welkom bij HTTP Café, fijn dat je erbij bent. Zin om eens mee te praten ' +
                            'in de podcast? Zoja, over welk onderwerp?',
                            'm': new Date().getTime(),
                            'a': 'you'
                        });
                        // console.log('welkomst boodschap verstuurd.');
                    }
                });
            }
        });
    }
}
