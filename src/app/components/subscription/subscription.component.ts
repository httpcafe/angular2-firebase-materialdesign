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
  privateUserdataStream: FirebaseObjectObservable<any>;
  publicUserdataStream: FirebaseObjectObservable<any>;

  kortingscode: string;
  subscriptiontype: any;
  betaalplan;


  constructor(private authService: AuthService,
              public userService: UserService,
              private route: ActivatedRoute,
              private af: AngularFire) {
    const self = this;


    this.authService.isAuthenticated().subscribe(authData => {
      if (authData) {
        console.log(authData.uid);
        self.uid = authData.uid;
        self.privateUserdataStream = this.userService.getPrivateUserdata(self.uid);
        self.publicUserdataStream = this.userService.getPublicUserdata(self.uid);

        self.codesStream = this.af.database.list('/administration/reductioncodes/');
        self.subscriptionStream = this.af.database.object('/administration/subscriptions/' + self.uid);
      } else {
        self.uid = '';
        self.privateUserdataStream = this.userService.getPrivateUserdata(0);
        self.publicUserdataStream = this.userService.getPublicUserdata(0);
      }
    });

    self.unsetPrice();
  }


  updateAddress(street, number, zip, city, country) {
    this.userService.updateAddress(this.privateUserdataStream, street, number, zip, city, country);
  }


  updateCompanyName(name) {
    this.userService.updateCompany(this.privateUserdataStream, 'name', name);
  }

  updateCompanyId(id) {
    this.userService.updateCompany(this.privateUserdataStream, 'id', id);
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
    const publicData = this.userService.getPublicDataAsObject(self.uid);

    if (self.kortingscode) {
      this.subscriptionStream.set({
        price: this.betaalplan.price,
        datetime: new Date().toDateString(),
        code: self.kortingscode,
        referentie: 'jaarabonnement HTTP Café ' + publicData.voornaam + ' ' + publicData.familienaam
      });
    } else {
      this.subscriptionStream.set({
        price: this.betaalplan.price,
        datetime: new Date().toDateString(),
        referentie: 'jaarabonnement HTTP Café ' + publicData.voornaam + ' ' + publicData.familienaam
      });
    }
    self.unsetPrice();
  }
}

