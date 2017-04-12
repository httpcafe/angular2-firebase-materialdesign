import {Inject, Injectable} from '@angular/core';
import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';
import {MdSnackBar} from '@angular/material';
import {SnackbarComponent} from '../components/snackbar/snackbar.component';

@Injectable()
export class MessagingService {

  private _messaging: firebase.messaging.Messaging;

  constructor(@Inject(FirebaseApp) private _firebaseApp: firebase.app.App, public snackBar: MdSnackBar) {
    const self = this;

    this._messaging = firebase.messaging(this._firebaseApp);
    this._messaging.requestPermission()
      .then(() => {
        this.sendTokenToServer('test');
        this._messaging.getToken()
          .then(function (currentToken) {
            if (currentToken) {
              self.sendTokenToServer(currentToken);
              self.updateUIForPushEnabled(currentToken);
            } else {
              // Show permission request.
              console.log('No Instance ID token available. Request permission to generate one.');
              // Show permission UI.
              self.updateUIForPushPermissionRequired();
              self.setTokenSentToServer(false);
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      })
      .catch(function (err) {
        console.log('An error occurred while retrieving token. ', err);
      });

    this._messaging.onMessage(function (payload) {
      console.log('Message received.', payload);
      snackBar.openFromComponent(SnackbarComponent, {duration: 1000});
    });
  }

  sendTokenToServer(token) {
    console.log('sendTokenToServer', token);
  }

  updateUIForPushEnabled(token) {
    console.log('updateUIForPushEnabled', token);
  }

  setTokenSentToServer(test) {
    console.log('setTokenSentToServer', test);
  }

  updateUIForPushPermissionRequired() {
    console.log('updateUIForPushPermissionRequired');
  }
}

// '<h1>' + payload.data.title + '</h1>' + payload.data.body
