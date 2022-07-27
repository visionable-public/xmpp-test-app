import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAN4UIo8mY9dz-YwvgJNCfP1zhUG5Qsi6o",
  authDomain: "visionable-1f7dd.firebaseapp.com",
  projectId: "visionable-1f7dd",
  storageBucket: "visionable-1f7dd.appspot.com",
  messagingSenderId: "1088765389745",
  appId: "1:1088765389745:web:d5d6d5f9dc6d9a6e4e2b90",
  measurementId: "G-09CNJKYZ9X"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = (setTokenFound) => {
  return getToken(messaging, {vapidKey: "BFE99JMfhMjIqTeYlSr4ig-XwEQC0lHobyNRZhWR1yuBk4RFbbajQxgJAAmAjZwWNMlVXWFIkRtpFo1meARvVd0" }).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});
