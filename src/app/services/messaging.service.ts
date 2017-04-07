import {Inject, Injectable} from '@angular/core';
import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';
import {MdSnackBar} from '@angular/material';
import {SnackbarComponent} from '../components/snackbar/snackbar.component';

@Injectable()
export class MessagingService {

  private _messaging: firebase.messaging.Messaging;

  constructor(@Inject(FirebaseApp) private _firebaseApp: firebase.app.App, public snackBar: MdSnackBar) {

    this._messaging = firebase.messaging(this._firebaseApp);
    this._messaging.requestPermission()
      .then(() => {
        return this._messaging.getToken();
      })
      .then((token) => {
        console.log(token);
      })
      .catch((error) => {
        console.log('nope');
      });

    this._messaging.onMessage(function (payload) {
      console.log('Message received.', payload);
      snackBar.openFromComponent(SnackbarComponent, {duration: 1000});
    });
  }
}

// '<h1>' + payload.data.title + '</h1>' + payload.data.body
