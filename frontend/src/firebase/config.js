// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNXUioLcR46LZaJ-xO83SSeYXJ0LSaaYE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fooddel-90887.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fooddel-90887",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fooddel-90887.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "333251753831",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:333251753831:web:3e58d3bd762988b64f61c2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QME6VTQJE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Facebook provider
facebookProvider.setCustomParameters({
  display: 'popup'
});

export default app;
export { analytics };
