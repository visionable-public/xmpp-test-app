// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAN4UIo8mY9dz-YwvgJNCfP1zhUG5Qsi6o",
  authDomain: "visionable-1f7dd.firebaseapp.com",
  projectId: "visionable-1f7dd",
  storageBucket: "visionable-1f7dd.appspot.com",
  messagingSenderId: "1088765389745",
  appId: "1:1088765389745:web:d5d6d5f9dc6d9a6e4e2b90",
  measurementId: "G-09CNJKYZ9X"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
