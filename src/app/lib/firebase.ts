// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb54fsYS5FPVrq73sexiGXEAc3W8kwfns",
  authDomain: "careercatalyst-a6a21.firebaseapp.com",
  projectId: "careercatalyst-a6a21",
  storageBucket: "careercatalyst-a6a21.firebasestorage.app",
  messagingSenderId: "561831437444",
  appId: "1:561831437444:web:d91e056cb8929f7cc10ed1",
  measurementId: "G-8D6396JRVR"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };