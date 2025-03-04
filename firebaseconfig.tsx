// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBprRFyy5I9M8RLm5GjLzaeoKcmGwhep74",
  authDomain: "trolyai-a8394.firebaseapp.com",
  projectId: "trolyai-a8394",
  storageBucket: "trolyai-a8394.firebasestorage.app",
  messagingSenderId: "759317752188",
  appId: "1:759317752188:web:849324fd0795765cdd5cf9",
  measurementId: "G-0HT6EBJEQP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);