import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjeDXQCFPbWxJ4ponPGEBSoxExpw8a2So",
  authDomain: "tasks-2829d.firebaseapp.com",
  projectId: "tasks-2829d",
  storageBucket: "tasks-2829d.firebasestorage.app",
  messagingSenderId: "999328231877",
  appId: "1:999328231877:web:29c7eaf1ad800e1c379bac"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db };