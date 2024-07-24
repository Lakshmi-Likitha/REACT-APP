// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchatapplication-ffd93.firebaseapp.com",
  projectId: "reactchatapplication-ffd93",
  storageBucket: "reactchatapplication-ffd93.appspot.com",
  messagingSenderId: "336828778799",
  appId: "1:336828778799:web:85d2e43bc5ac54b8e1b9da",
  measurementId: "G-NBV2XP3L6G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

