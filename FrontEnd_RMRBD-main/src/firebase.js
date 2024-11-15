import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCPn2OSvk7rHKjBFwe9Sa_v-aSUZUHxdM4",
  authDomain: "rmrbdfirebase.firebaseapp.com",
  databaseURL: "https://rmrbdfirebase-default-rtdb.firebaseio.com",
  projectId: "rmrbdfirebase",
  storageBucket: "rmrbdfirebase.appspot.com",
  messagingSenderId: "830949891935",
  appId: "1:830949891935:web:e30770569b65c9b204a0ea",
  measurementId: "G-SJJXKRSTZV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Connect to Firebase Authentication Emulator in development environment
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099", {
    disableWarnings: true, // Disable warning for emulator usage
  });
}

export { app, auth, firestore, storage };
