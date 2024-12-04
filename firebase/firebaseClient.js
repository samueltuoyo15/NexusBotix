import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider, // google auth provider
  signInWithRedirect,
  getRedirectResult,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import dotenv from "dotenv"

dotenv.config() // Load Environment Variables

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig)

// Initialize Firebase Auth and Firestore
const auth = getAuth(app)
const db = getFirestore(app)
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} // Export auth , db , createUserWithEmailAndPassword , signInWithEmailAndPassword and GoogleAuthProvider
