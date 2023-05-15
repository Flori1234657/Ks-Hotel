// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgDUOxek05sY_lacScX-c-VL1g4raNbWc",
  authDomain: "ks-hotel.firebaseapp.com",
  projectId: "ks-hotel",
  storageBucket: "ks-hotel.appspot.com",
  messagingSenderId: "30329614883",
  appId: "1:30329614883:web:69d4f795979e7097a47796",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
