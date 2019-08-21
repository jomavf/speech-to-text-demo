// src/firebase.js
import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyDqtu2-TTb8rzIcpPcg0uuXfuvgs-IYSa4",
    authDomain: "speech-to-text-6aea0.firebaseapp.com",
    databaseURL: "https://speech-to-text-6aea0.firebaseio.com",
    projectId: "speech-to-text-6aea0",
    storageBucket: "speech-to-text-6aea0.appspot.com",
    messagingSenderId: "441615207940",
    appId: "1:441615207940:web:6579e1829ee600a6"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;