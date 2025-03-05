import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBprRFyy5I9M8RLm5GjLzaeoKcmGwhep74",
  authDomain: "trolyai-a8394.firebaseapp.com",
  projectId: "trolyai-a8394",
  storageBucket: "trolyai-a8394.firebasestorage.app",
  messagingSenderId: "759317752188",
  appId: "1:759317752188:web:849324fd0795765cdd5cf9",
  measurementId: "G-0HT6EBJEQP"
};
export const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const auth = getAuth(app);
export const db = getFirestore(app);