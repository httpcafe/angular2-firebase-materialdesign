import {Injectable} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AuthService {
  uid: string;

  constructor(private af: AngularFire) {
    const self = this;

    self.af.auth.subscribe(auth => {
      if (auth) {

        self.uid = auth.uid;

        const userStream = self.af.database.object('/users/' + self.uid);

        userStream.take(1).subscribe(snapshot => {

          if (!snapshot.hasOwnProperty('private')) {
            const privateData = {
              address: {
                street: '',
                number: '',
                zip: '',
                city: '',
                country: ''
              },
              job: {
                frontend: false,
                backend: false,
                webdesigner: false,
                devop: false,
                architect: false,
                pm: false,
                hr: false,
                commercial: false,
                amateur: false,
                other: '',
                technologies: ''
              },
              email: '',
              company: {
                name: '',
                id: ''
              }
            };
            userStream.update({private: privateData});
          }
          if ((!snapshot.hasOwnProperty('avatar')) || (snapshot.avatar === '')) {
            if (auth.hasOwnProperty('google')) {
              userStream.update({avatar: auth.google.photoURL});
            } else if (auth.hasOwnProperty('twitter')) {
              console.log(auth);
              userStream.update({avatar: auth.twitter.photoURL.replace('_normal', '')});
            } else if (auth.hasOwnProperty('facebook')) {
              userStream.update({avatar: auth.facebook.photoURL});
            } else if (auth.hasOwnProperty('github')) {
              userStream.update({avatar: auth.github.photoURL});
            }
          }
          if (!snapshot.hasOwnProperty('voornaam')) {
            userStream.update({voornaam: ''});
          }
          if (!snapshot.hasOwnProperty('familienaam')) {
            userStream.update({familienaam: ''});
          }
          if (!snapshot.hasOwnProperty('email')) {
            userStream.update({email: ''});
          }
          if (!snapshot.hasOwnProperty('twitter')) {
            userStream.update({twitter: ''});
          }

        });
      } else {
        console.log('You are not authenticated');
      }
    });


  }

  getAuthid() {
    return this.uid;
  }

  login(provider: string) {

    switch (provider) {
      case 'twitter':
        this.af.auth.login({
          provider: AuthProviders.Twitter,
          method: AuthMethods.Popup
        });
        break;
      case 'github':
        this.af.auth.login({
          provider: AuthProviders.Github,
          method: AuthMethods.Popup
        });
        break;
      case 'facebook':
        this.af.auth.login({
          provider: AuthProviders.Facebook,
          method: AuthMethods.Popup
        });
        break;
      default:
        this.af.auth.login({
          provider: AuthProviders.Google,
          method: AuthMethods.Popup
        });
    }
  }

  logout() {
    this.af.auth.logout();
  }

  isAuthenticated(): Observable<any> {
    return this.af.auth;
  }
}
