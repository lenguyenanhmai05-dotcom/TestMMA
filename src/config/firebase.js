import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Check if credentials are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId
);

if (!isFirebaseConfigured) {
  console.warn(
    '[BookShelf Warning] Firebase environment variables (EXPO_PUBLIC_FIREBASE_*) are missing. Please create a .env file based on .env.example with your Firebase credentials.'
  );
}

// Initialize Firebase App
const app = getApps().length === 0 
  ? initializeApp(
      isFirebaseConfigured 
        ? firebaseConfig 
        : {
            apiKey: 'temp_placeholder_key',
            authDomain: 'temp.firebaseapp.com',
            projectId: 'temp-project',
            storageBucket: 'temp.appspot.com',
            messagingSenderId: '1234567890',
            appId: '1:1234567890:web:temp',
          }
    ) 
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
