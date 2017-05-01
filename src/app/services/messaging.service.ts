import {Inject, Injectable} from '@angular/core';
import {FirebaseApp, AngularFire, FirebaseObjectObservable} from 'angularfire2';
import * as firebase from 'firebase';
import {MdSnackBar} from '@angular/material';
import {SnackbarComponent} from '../components/snackbar/snackbar.component';
import {AuthService} from './auth.service';

@Injectable()
export class MessagingService {


  private uid: string;
  private _messaging: firebase.messaging.Messaging;
  private stream: FirebaseObjectObservable<any>;

  constructor(@Inject(FirebaseApp) private _firebaseApp: firebase.app.App,
              public snackBar: MdSnackBar,
              public af: AngularFire,
              public authService: AuthService) {
    const self = this;

    this.uid = this.authService.getAuthid();

    this._messaging = firebase.messaging(this._firebaseApp);
    this._messaging.requestPermission()
      .then(() => {
        this._messaging.getToken()
          .then(function (currentToken) {
            if (currentToken) {
              self.sendTokenToServer(currentToken);
              self.updateUIForPushEnabled(currentToken);
            } else {
              // Show permission request.
              console.log('No Instance ID token available. Request permission to generate one.');
              self.updateUIForPushPermissionRequired();
            }
          })
          .catch(function (err) {
            // console.log(err);
          });
      })
      .catch(function (err) {
        // console.log('An error occurred while retrieving token. ', err);
      });

    this._messaging.onMessage(function (payload) {
      // console.log('Message received.', payload);
     // snackBar.openFromComponent(SnackbarComponent, {duration: 1000});
    });
  }

  sendTokenToServer(token) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.stream = this.af.database.object('messaging/' + auth.uid);
        const toSave = {};
        toSave[token] = true;
        this.stream.update(toSave);
        // console.log('sendTokenToServer', token);
      }
    });
  }

  updateUIForPushEnabled(token) {
    //console.log('updateUIForPushEnabled', token);
  }


  updateUIForPushPermissionRequired() {
    //console.log('updateUIForPushPermissionRequired');
  }
}

// '<h1>' + payload.data.title + '</h1>' + payload.data.body
