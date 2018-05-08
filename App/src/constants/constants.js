import firebase from 'firebase'

var config = {
  apiKey: "",
   authDomain: "",
   databaseURL: "",
   projectId: "",
   storageBucket: "",
   messagingSenderId: ""
  };
  firebase.initializeApp(config);
  var paypal = require('paypal-rest-sdk');
  
  paypal.configure({
    mode: 'sandbox', // Sandbox or live
    client_id: '',
    client_secret: ''
  });

export const ref = firebase.database().ref()
export const firebaseRef = firebase.database();
export const firebaseAuth = firebase.auth;
export const firebaseStorage = firebase.storage();
