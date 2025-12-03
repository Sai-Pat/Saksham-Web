// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8KXtKY2qEaafDPIZX4uEwLDRpaYQVA6Y",
  authDomain: "saksham-72e96.firebaseapp.com",
  projectId: "saksham-72e96",
  storageBucket: "saksham-72e96.firebasestorage.app",
  messagingSenderId: "1016597323334",
  appId: "1:1016597323334:web:63cde1bac2bf259ef23447",
  measurementId: "G-LJK1YNNS0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);