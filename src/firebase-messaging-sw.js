importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '203172250226'
});

const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(function (payload) {
  //console.log('[firebase-messaging-sw.js] Received background message ', payload.data);


  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body
  };

  console.log('[firebase-messaging-sw.js] Received background message ', notificationTitle, notificationOptions);
  return self.registration.showNotification(notificationTitle, notificationOptions);
});


