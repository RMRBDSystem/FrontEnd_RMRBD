import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCPn2OSvk7rHKjBFwe9Sa_v-aSUZUHxdM4",
    authDomain: "rmrbdfirebase.firebaseapp.com",
    databaseURL: "https://rmrbdfirebase-default-rtdb.firebaseio.com",
    projectId: "rmrbdfirebase",
    storageBucket: "rmrbdfirebase.appspot.com",
    messagingSenderId: "830949891935",
    appId: "1:830949891935:web:e30770569b65c9b204a0ea",
    measurementId: "G-SJJXKRSTZV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage
const storage = getStorage(app);

// Make sure to export storage as default
export default storage;