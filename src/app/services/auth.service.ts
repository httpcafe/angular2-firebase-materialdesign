import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
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
          if (!snapshot.hasOwnProperty('avatar')) {
            userStream.update({avatar: auth.google.photoURL});
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

  login() {
    return this.af.auth.login();
  }

  loginUserObservable(email, password) {
    return Observable.fromPromise(<Promise<any>> this.af.auth.login({email, password}));
  }

  logout() {
    this.af.auth.logout();
  }

  isAuthenticated(): Observable<any> {
    return this.af.auth;
  }
}
