import {Component} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent {
    title = 'Profile!';
    userdata: FirebaseObjectObservable<any[]>;

    constructor(public af: AngularFire) {

        this.af.auth.subscribe(auth => {
            if (auth) {
                console.log('You are authenticated', auth);

                this.userdata = af.database.object('/users/' + auth.uid);
                console.log(this.userdata);
            } else {
                console.log('You are not authenticated')
            }
        });
    }

    updateAdres(straat, huisnummer, postcode, gemeente, land) {

        this.userdata.update({
            adres: {
                straat: straat,
                huisnummer: huisnummer,
                postcode: postcode,
                gemeente: gemeente,
                land: land
            }
        })

    }
}
