// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWF3zjk-29iYz87JuE3gwLnaGbdGN2fTM",
  authDomain: "react-f0464.firebaseapp.com",
  projectId: "react-f0464",
  storageBucket: "react-f0464.firebasestorage.app",
  messagingSenderId: "486194401527",
  appId: "1:486194401527:web:ea48c664688b6a98b983f2"
};


import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);