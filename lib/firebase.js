/**
 * MizoApps Firebase Config - 2012 Style
 * Firestore database for posts, groups, members
 */
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemo-MizoApps-2012",
  authDomain: "mizoapps-2012.firebaseapp.com",
  projectId: "mizoapps-2012",
  storageBucket: "mizoapps-2012.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:mizoapps2012"
};

// Prevent re-initialization
const app = getApps().length === 0? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc };
