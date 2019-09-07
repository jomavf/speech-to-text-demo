import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyDMnqvM4WmFaYmBH6aigxBlTv-_uHD2Bro",
    authDomain: "speech-to-text-web.firebaseapp.com",
    databaseURL: "https://speech-to-text-web.firebaseio.com",
    projectId: "speech-to-text-web",
    storageBucket: "speech-to-text-web.appspot.com",
    messagingSenderId: "480993530827",
    appId: "1:480993530827:web:2bc58fdba532100c"
  };
firebase.initializeApp(config);
export default firebase;