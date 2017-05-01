/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.updateMessenger = functions.database.ref('/messenger/{receiver}/{sender}/{key}')
    .onWrite(function (event) {
        const receiver = event.params.receiver;
        const sender = event.params.sender;
        const key = event.params.key;

        if (receiver !== 'overview') {
            admin.database().ref('messenger/' + receiver + '/' + sender + '/' + key).once('value').then(function (snapshot) {

                const newReceveiverOverview = {};
                newReceveiverOverview[sender] = {
                    t: snapshot.child("t").val(),
                    m: snapshot.child("m").val()
                };
                admin.database().ref('messenger/' + receiver + '/overview').update(newReceveiverOverview);
            });
        }
    });


exports.sendFollowerNotification = functions.database.ref('/sandbox/news/{uid}/{textid}')
    .onWrite(function (event) {
        const uid = event.params.uid;
        const textid = event.params.textid;


        // Get the list of device notification tokens.
        const getDeviceTokensPromise = admin.database().ref(`/messaging/skfLy7Uhifgjg9rDEI1DJyvSKhM2`).once('value');

        // Get the follower profile.
        const getFollowerProfilePromise = admin.auth().getUser(uid);

        return Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]).then(function (results) {
            const tokensSnapshot = results[0];
            const follower = results[1];

            // console.log(results);


            // Check if there are any device tokens.
            if (!tokensSnapshot.hasChildren()) {
                return console.log('There are no notification tokens to send to.');
            }
            console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
            console.log('Fetched follower profile', follower);

            // Notification details.
            const payload = {
                notification: {
                    title: `${follower.displayName} heeft een tekst aangepast.`,
                    body: `Klik hier om feedback te geven.`,
                    icon: follower.photoURL,
                    click_action: 'https://httpcafemagazine.firebaseapp.com/mijn-artikelen/' + uid + '/' + textid
                }
            };

            // Listing all tokens.
            const tokens = Object.keys(tokensSnapshot.val());

            console.log(tokens);

            // Send notifications to all tokens.
            return admin.messaging().sendToDevice(tokens, payload).then(function (response) {
                // For each message check if there was an error.
                const tokensToRemove = [];
                response.results.forEach(function (result, index) {
                    const error = result.error;
                    if (error) {
                        console.error('Failure sending notification to', tokens[index], error);
                        // Cleanup the tokens who are not registered anymore.
                        if (error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered') {
                            tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
                        }
                    }
                });
                return Promise.all(tokensToRemove);
            });
        });
    });
