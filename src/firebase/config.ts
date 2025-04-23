import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJSEAWssnwFNVAGRlhM6hxP7IJXLKdN04",
  authDomain: "stellar-a0f58.firebaseapp.com",
  projectId: "stellar-a0f58",
  storageBucket: "stellar-a0f58.firebasestorage.app",
  messagingSenderId: "850623372300",
  appId: "1:850623372300:web:87f612b27998a4048da229",
  measurementId: "G-WXYDRNN5MG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 