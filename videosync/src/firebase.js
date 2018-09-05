import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyARAG6FAYBkv-eDzcPfhKS4Z_c9H-XCRzY",
  authDomain: "videosyncs.firebaseapp.com",
  databaseURL: "https://videosyncs.firebaseio.com",
  projectId: "videosyncs",
  storageBucket: "videosyncs.appspot.com",
  messagingSenderId: "842103517331"
};

firebase.initializeApp(config);

const database = firebase.database();

export default database;