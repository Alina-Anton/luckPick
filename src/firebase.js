// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSs0XM0YuRJsfkXp2O0yDkx-vxdY7Q3qQ",
  authDomain: "luckpickapp.firebaseapp.com",
  projectId: "luckpickapp",
  storageBucket: "luckpickapp.firebasestorage.app",
  messagingSenderId: "777145821461",
  appId: "1:777145821461:web:cdd7ec2654b9aef300611c",
  measurementId: "G-RZV2X8SQH7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
