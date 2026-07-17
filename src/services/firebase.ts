import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw5R0qE5BSY_BIQ9P1txbR6rhNHuEPmc",
  authDomain: "mairin-5d08b.firebaseapp.com",
  projectId: "mairin-5d08b",
  storageBucket: "mairin-5d08b.firebasestorage.app",
  messagingSenderId: "791674234088",
  appId: "1:791674234088:web:f1906e3e639318678c955d",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

