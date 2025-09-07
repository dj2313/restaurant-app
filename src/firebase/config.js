import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyAP-Rn2USEWkqybNL6vDE8yKpG9gPYBv9Q",
  authDomain: "pro1-76ebc.firebaseapp.com",
  projectId: "pro1-76ebc",
  storageBucket: "pro1-76ebc.firebasestorage.app",
  messagingSenderId: "270761821379",
  appId: "1:270761821379:web:9bf907f23a439daab38e76",
  measurementId: "G-441BQNWGWW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export initialized services
export { db, auth, storage };