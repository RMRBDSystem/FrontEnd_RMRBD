import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase settings (replace these with actual values)
const firebaseConfig = {
  apiKey: "AIzaSyCPn2OSvk7rHKjBFwe9Sa_v-aSUZUHxdM4",
  authDomain: "rmrbdfirebase.firebaseapp.com",  // You can find this in your Firebase console
  projectId: "rmrbdfirebase",                  // You can find this in your Firebase console
  storageBucket: "rmrbdfirebase.appspot.com",  // This is from your Firebase settings
  messagingSenderId: "your-sender-id",        // You can find this in your Firebase console
  appId: "your-app-id",                        // You can find this in your Firebase console
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);