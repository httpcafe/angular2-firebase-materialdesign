import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-subscription',
  templateUrl: 'subscription.component.html',
  styleUrls: ['subscription.component.css']
})
export class SubscriptionComponent {

  uid: string;
  private sub: any;

  codesStream: FirebaseListObservable<any>;
  subscriptionStream: FirebaseObjectObservable<any>;
  userdataStream: FirebaseObjectObservable<any>;

  kortingscode: string;
  subscriptiontype: any;
  betaalplan;


  constructor(private authService: AuthService, public userService: UserService, private route: ActivatedRoute, private af: AngularFire) {
    const self = this;


    this.authService.isAuthenticated().subscribe(authData => {
      if (authData) {
        self.uid = authData.uid;
        self.userdataStream = this.userService.getUserdata(self.uid);

        self.codesStream = this.af.database.list('/administration/reductioncodes/');
        self.subscriptionStream = this.af.database.object('/administration/subscriptions/' + self.uid);
      } else {
        self.uid = '';
        self.userdataStream = this.userService.getUserdata(0);
      }
    });

    self.unsetPrice();
  }


  updateAddress(street, number, zip, city, country) {
    this.userService.updatePrivateUserdata(this.userdataStream, 'address', {
      street: street,
      number: number,
      zip: zip,
      city: city,
      country: country
    });
  }

  updateBedrijfNaam(name) {
    this.userService.updateCompany(this.userdataStream, 'name', name);
  }

  updateOndernemingsnummer(id) {
    this.userService.updateCompany(this.userdataStream, 'id', id);
  }

  unsetPrice() {
    this.betaalplan = {};
  }

  getPrice(type: string) {
    const self = this;

    switch (type) {

      case 'free':
        self.kortingscode = '';
        self.betaalplan = {
          price: 0
        };
        break;

      case 'reduction':
        this.codesStream.take(1).subscribe(snapshot => {
          const betaalplan = snapshot.filter(function (code) {
            return code.code === self.kortingscode;
          });

          if (betaalplan.length === 1) {
            self.betaalplan = betaalplan[0];
          } else {
            self.betaalplan = {
              error: 'Deze code is niet gekend.',
              price: 60
            };
          }
        });
        break;

      default:
        self.kortingscode = '';
        self.betaalplan = {
          price: 60
        };
    }
  }

  subscribe() {
    const self = this;

    if (self.kortingscode) {
      this.subscriptionStream.set({
        uid: this.uid,
        price: this.betaalplan.price,
        datetime: new Date().toDateString(),
        code: self.kortingscode,
        referentie: 'jaarabonnement HTTP Café ' + this.userService.getFirstname(this.uid) + ' ' + this.userService.getLastname(this.uid)
      });
    } else {
      this.subscriptionStream.set({
        uid: this.uid,
        price: this.betaalplan.price,
        datetime: new Date().toDateString(),
        referentie: 'jaarabonnement HTTP Café ' + this.userService.getFirstname(this.uid) + ' ' + this.userService.getLastname(this.uid)
      });
    }
  }
}

