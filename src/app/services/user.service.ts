import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {AuthService} from './auth.service';

@Injectable()
export class UserService {

  constructor(public af: AngularFire, private authService: AuthService) {
  }

  login(provider: string) {
    this.authService.login(provider);
  }

  logout() {
    this.authService.logout();
  }

  /*
   Get
   */

  getPublicUserdata(uid): FirebaseObjectObservable<any[]> {
    if (uid !== '') {
      try {
        const stream = this.af.database.object('/users/public/' + uid);
        stream.take(1).subscribe(snapshot => {
          if (!snapshot.hasOwnProperty('avatar')) {
            stream.update({avatar: ''});
          }
        });

        return stream;
      } catch (err) {
        return new FirebaseObjectObservable;
      }
    }
  }

  getPublicDataAsObject(uid) {
    let publicData;
    this.af.database.object('/users/public/' + uid).take(1).subscribe(snapshot => {
      publicData = snapshot;
    });
    return publicData;
  }

  getPrivateUserdata(uid): FirebaseObjectObservable<any[]> {
    if (uid !== '') {
      try {
        const stream = this.af.database.object('/users/private/' + uid);

        stream.take(1).subscribe(snapshot => {

          if (!snapshot.hasOwnProperty('job')) {
            stream.update({
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
              }
            });
          }
          if (!snapshot.hasOwnProperty('company')) {
            stream.update({
              company: {
                name: '',
                id: ''
              }
            });
          }
          if (!snapshot.hasOwnProperty('address')) {
            stream.update({
              address: {
                street: '',
                number: '',
                zip: '',
                city: '',
                country: ''
              }
            });
          }
          if (!snapshot.hasOwnProperty('email')) {
            stream.update({email: ''});
          }
        })
        return stream;
      } catch (err) {
        return new FirebaseObjectObservable;
      }
    }
  }

  getPrivateDataAsObject(privateUserdataStream) {
    let privateData;
    privateUserdataStream.take(1).subscribe(snapshot => {
      privateData = snapshot;
    });
    return privateData;
  }

  /*
   Update
   */

  updatePublicUserdata(publicUserdataStream, key, value) {
    switch (key) {
      case 'twitter':
        publicUserdataStream.update({twitter: value});
        break;
      case 'voornaam':
        publicUserdataStream.update({voornaam: value});
        break;
      case 'familienaam':
        publicUserdataStream.update({familienaam: value});
        break;
    }
  }

  updatePrivateUserdata(privateUserdataStream, key, value) {
    const privateData = this.getPrivateDataAsObject(privateUserdataStream);
    privateData[key] = value;
    console.log(key, value);
    privateUserdataStream.update(key, value);
  }


  updateEmail(privateUserdataStream, value) {
    privateUserdataStream.update({'email': value});
  }


  updateAddress(privateUserdataStream, street, number, zip, city, country) {
    console.log(privateUserdataStream, street, number, zip, city, country);
    privateUserdataStream.update({
      'address': {
        street: street,
        number: number,
        zip: zip,
        city: city,
        country: country
      }
    });
  }


  updateJob(privateUserdataStream, key, value) {
    const privateData = this.getPrivateDataAsObject(privateUserdataStream);
    console.log(privateData);
    privateData['job'][key] = value;
    privateUserdataStream.update({'job': privateData['job']});
  }

  updateCompany(privateUserdataStream, key, value) {
    const privateData = this.getPrivateDataAsObject(privateUserdataStream);
    privateData['company'][key] = value;
    privateUserdataStream.update({'company': privateData['company']});
  }


}
