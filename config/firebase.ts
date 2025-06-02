// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3Z6OsiD0qTNqsvEtP2sN5gpJ69bUnfiE",
  authDomain: "expense-tracker-app-378ce.firebaseapp.com",
  projectId: "expense-tracker-app-378ce",
  storageBucket: "expense-tracker-app-378ce.firebasestorage.app",
  messagingSenderId: "817444963253",
  appId: "1:817444963253:web:29a81ff2f008b98c4d8ffc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

//db

export const firestore = getFirestore(app);