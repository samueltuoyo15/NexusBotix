// Import Firebase Admin SDK and environment variables
import admin from "firebase-admin"
//import fs from 'fs';
//import path from 'path';
import dotenv from "dotenv"

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY)

dotenv.config()
// Initialize the Firebase Admin SDK
// The Admin SDK is used for server-side operations like verifying tokens, managing users, etc.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Load service account credentials
})

// Export Firestore and Auth for use in other files
const db = admin.firestore() // Firestore database instance
const authAdmin = admin.auth() // Admin authentication instance

export { db, authAdmin }
