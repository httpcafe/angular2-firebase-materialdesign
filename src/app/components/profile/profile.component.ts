import {Component, Input, Inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {AngularFire, FirebaseObjectObservable, FirebaseApp} from 'angularfire2';


@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  providers: [UserService]
})
export class ProfileComponent {

  uid: string;
  error: string;
  privateUserdataStream: FirebaseObjectObservable<any>;
  publicUserdataStream: FirebaseObjectObservable<any>;
  subscriptionStream: FirebaseObjectObservable<any>;
  _storage_;

  @Input()
  short: boolean;

  constructor(@Inject(FirebaseApp) firebaseApp: any,
              private authService: AuthService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private af: AngularFire) {

    const self = this;
    this._storage_ = firebaseApp.storage();
    self.activatedRoute.params.subscribe(params => {
      self.uid = params['uid'];
    });

    self.authService.isAuthenticated().subscribe(authData => {

      if (authData) {
        if ((self.uid === undefined) || (self.uid === null) || (self.uid === '')) {
          self.uid = authData.uid;
        }
        try {
          self.privateUserdataStream = self.userService.getPrivateUserdata(self.uid);
          self.publicUserdataStream = self.userService.getPublicUserdata(self.uid);
          self.subscriptionStream = self.af.database.object('/administration/subscriptions/' + self.uid);
        } catch (err) {
          self.error = 'geen toegang';
        }
      } else {
        self.uid = '';
        delete self.privateUserdataStream;
      }
    });
  }


  updateAddress(street, number, zip, city, country) {
    this.userService.updateAddress(this.privateUserdataStream, street, number, zip, city, country);
  }


  updateFirstname(voornaam) {
    this.userService.updatePublicUserdata(this.publicUserdataStream, 'voornaam', voornaam);
  }

  updateFamilyname(familienaam) {
    this.userService.updatePublicUserdata(this.publicUserdataStream, 'familienaam', familienaam);
  }

  updateEmail(email) {
    this.userService.updateEmail(this.privateUserdataStream, email);
  }

  updateTwitter(twitter) {
    this.userService.updatePublicUserdata(this.publicUserdataStream, 'twitter', twitter);
  }

  updateCompanyName(name) {
    this.userService.updateCompany(this.privateUserdataStream, 'name', name);
  }

  updateCompanyId(id) {
    this.userService.updateCompany(this.privateUserdataStream, 'id', id);
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
    this.userService.updateJob(this.privateUserdataStream, key, value);
  }



  uploadImage(event) {
    const self = this;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const ref = this._storage_.ref().child('users/' + this.uid + '/' + file.name);

      ref.put(file).then(snapshot => {
        ref.getDownloadURL().then(url => {
          self.publicUserdataStream.update({'avatar': snapshot.downloadURL});
        });
      });
    }
  }
}

