import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-subscription',
  templateUrl: 'subscription.component.html',
  styleUrls: ['subscription.component.css']
})
export class SubscriptionComponent {

  userdataStream: any;
  uid: string;
  private sub: any;


  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute) {
    const self = this;
    this.sub = this.route.params.subscribe(params => {
      self.uid = params['uid'];
    });

    if (self.uid === undefined) {
      this.authService.isAuthenticated().subscribe(authData => {
        if (authData) {
          self.uid = authData.uid;
          this.userdataStream = this.userService.getUserdata(self.uid);
        } else {
          self.uid = '';
          this.userdataStream = {};
        }
      });
    } else {
      this.userdataStream = this.userService.getUserdata(self.uid);
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

