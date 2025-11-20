
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// NOTE: In a real production build, these should be environment variables (VITE_FIREBASE_API_KEY, etc.)
// For this demo, we will try to read them from the LocalStorage Admin Config if not found in env.

const getFirebaseConfig = () => {
  // 1. Try Environment Variables (Standard) - SAFELY CHECK FOR PROCESS
  try {
    if (typeof process !== 'undefined' && process.env && process.env.FIREBASE_API_KEY) {
      return {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      };
    }
  } catch (e) {
    // Process is not defined, ignore and fall through to local storage
  }

  // 2. Fallback to LocalStorage (Admin Panel Config)
  if (typeof window !== 'undefined') {
    try {
      const storedConfig = localStorage.getItem('dg_firebase_config');
      if (storedConfig) {
        return JSON.parse(storedConfig);
      }
    } catch (e) {
      console.warn("Error reading firebase config from storage");
    }
  }
  
  return null;
};

const config = getFirebaseConfig();

let app;
let auth;
let db;
let storage;

if (config) {
  try {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (e) {
    console.error("Firebase Initialization Error:", e);
  }
} else {
  console.warn("Firebase not initialized. Missing Configuration.");
}

export { auth, db, storage };
export default app;
