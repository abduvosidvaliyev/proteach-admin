import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  get,
  set,
  update,
  remove,
  push
} from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCmB2bXTAyxXVEvumcTE97RpYKMKu94LBA",
    authDomain: "proteach-card.firebaseapp.com",
    databaseURL: "https://proteach-card-default-rtdb.firebaseio.com",
    projectId: "proteach-card",
    storageBucket: "proteach-card.firebasestorage.app",
    messagingSenderId: "848976516816",
    appId: "1:848976516816:web:3088b2817e732a57bff0d5",
    measurementId: "G-LWNLCB13Q6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, get, set, update, remove, push };
