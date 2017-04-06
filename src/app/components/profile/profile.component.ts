import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';


@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  providers: [UserService]
})
export class ProfileComponent {

  userdataStream: any;
  uid: string;
  subscriptionStream: FirebaseObjectObservable<any>;
  private sub: any;


  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute, private af: AngularFire) {
    const self = this;
    self.sub = self.route.params.subscribe(params => {
      self.uid = params['uid'];
    });

    if (self.uid === undefined) {
      self.authService.isAuthenticated().subscribe(authData => {
        if (authData) {
          self.uid = authData.uid;
          self.userdataStream = self.userService.getUserdata(self.uid);
          self.subscriptionStream = self.af.database.object('/administration/subscriptions/' + self.uid);
        } else {
          self.uid = '';
          self.userdataStream = {};
        }
      });
    } else {
      self.userdataStream = self.userService.getUserdata(self.uid);
    }
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


  updateVoornaam(voornaam) {
    this.userService.updatePublicUserdata(this.userdataStream, 'voornaam', voornaam);
  }

  updateFamilienaam(familienaam) {
    this.userService.updatePublicUserdata(this.userdataStream, 'familienaam', familienaam);
  }

  updateEmail(email) {
    this.userService.updatePrivateUserdata(this.userdataStream, 'email', email);
  }

  updateTwitter(twitter) {
    this.userService.updatePublicUserdata(this.userdataStream, 'twitter', twitter);
  }

  updateBedrijfNaam(name) {
    this.userService.updateCompany(this.userdataStream, 'name', name);
  }

  updateOndernemingsnummer(id) {
    this.userService.updateCompany(this.userdataStream, 'id', id);
  }

  updateJob(key, value) {
    switch (key) {
      case 'frontend':
      case 'backend':
      case 'webdesigner':
      case 'devop':
      case 'architect':
      case 'pm':
      case 'hr':
      case 'commercial':
      case 'amateur':
        if (value === false) {
          value = true;
        } else {
          value = false;
        }
        break;
    }
    this.userService.updateJob(this.userdataStream, key, value);
  }
}

