// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBYrn51FQ7M4zoTOU3wfCsd7DJIX8piz8c",
  authDomain: "responsi-69fb9.firebaseapp.com",
  projectId: "responsi-69fb9",
  storageBucket: "responsi-69fb9.firebasestorage.app",
  messagingSenderId: "21271480241",
  appId: "1:21271480241:web:b18e386184e09e847f9f90"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };