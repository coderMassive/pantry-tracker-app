// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4WwCNOO5xqIUK5SpUAhqLpqGuQ7lYOXc",
  authDomain: "pantry-tracker-c0404.firebaseapp.com",
  projectId: "pantry-tracker-c0404",
  storageBucket: "pantry-tracker-c0404.appspot.com",
  messagingSenderId: "117262941947",
  appId: "1:117262941947:web:355abe6f7d86a99be87a5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };