import {Injectable} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AuthService {
    uid: string;
    auth;

    constructor(private af: AngularFire) {
        const self = this;

        self.af.auth.subscribe(auth => {
            if (auth) {

                self.uid = auth.uid;

                const publicUserdataStream = self.af.database.object('/users/public/' + self.uid);
                publicUserdataStream.take(1).subscribe(snapshot => {
                    if ((!snapshot.hasOwnProperty('avatar')) || (snapshot.avatar === '')) {
                        if (auth.hasOwnProperty('google')) {
                            publicUserdataStream.update({avatar: auth.google.photoURL});
                        } else if (auth.hasOwnProperty('twitter')) {
                            console.log(auth);
                            publicUserdataStream.update({avatar: auth.twitter.photoURL.replace('_normal', '')});
                        } else if (auth.hasOwnProperty('facebook')) {
                            publicUserdataStream.update({avatar: auth.facebook.photoURL});
                        } else if (auth.hasOwnProperty('github')) {
                            publicUserdataStream.update({avatar: auth.github.photoURL});
                        }
                    }
                    if (!snapshot.hasOwnProperty('voornaam')) {
                        publicUserdataStream.update({voornaam: ''});
                    }
                    if (!snapshot.hasOwnProperty('familienaam')) {
                        publicUserdataStream.update({familienaam: ''});
                    }
                    if (!snapshot.hasOwnProperty('twitter')) {
                        publicUserdataStream.update({twitter: ''});
                    }
                });


                const privateUserdataStream = self.af.database.object('/users/private/' + self.uid);
                privateUserdataStream.take(1).subscribe(snapshot => {
                    if (!snapshot.hasOwnProperty('email')) {
                        privateUserdataStream.update({email: ''});
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


    loginWithPassword(email: string, password: string): void {
        const creds: any = {email: email, password: password};
        console.log(creds);

        this.af.auth.login({
                email: email,
                password: password
            });
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
         case 'google':
         this.af.auth.login({
         provider: AuthProviders.Google,
         method: AuthMethods.Popup
         });
         break;
         default:
         this.af.auth.login({
         provider: AuthProviders.Google,
         method: AuthMethods.Password
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
