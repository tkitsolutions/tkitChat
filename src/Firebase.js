
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUTZumMZIXeRY1ZUj1zO5zCddXIoQfagM",
  authDomain: "tkit-chat.firebaseapp.com",
  projectId: "tkit-chat",
  storageBucket: "tkit-chat.appspot.com",
  messagingSenderId: "101541624141",
  appId: "1:101541624141:web:36fcf6e3a27b6eaf349f04"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage=getStorage();
export const db=getFirestore();