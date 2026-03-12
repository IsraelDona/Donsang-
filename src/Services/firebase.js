// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOW8bqYrgbM6ewW40WtapRltR5Csymirc",
  authDomain: "don-de-sang-2367d.firebaseapp.com",
  projectId: "don-de-sang-2367d",
  storageBucket: "don-de-sang-2367d.firebasestorage.app",
  messagingSenderId: "465830585003",
  appId: "1:465830585003:web:c598b2b9a3eb456ab40dee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);