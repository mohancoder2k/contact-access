// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD9bN1xq-DXQq4jZZ3bTDTCGQgHCvnu0eE",
  authDomain: "contact-eecc0.firebaseapp.com",
  projectId: "contact-eecc0",
  storageBucket: "contact-eecc0.appspot.com",
  messagingSenderId: "481782403923",
  appId: "1:481782403923:web:a8774815023218c2bc87a6",
  databaseURL: "https://contact-eecc0-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
