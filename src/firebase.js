import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFAXTBjnx15PZyacKqxT5LxPW-v3-rsFg",
  authDomain: "blog-app-be8e9.firebaseapp.com",
  projectId: "blog-app-be8e9",
  storageBucket: "blog-app-be8e9.appspot.com",
  messagingSenderId: "599233514822",
  appId: "1:599233514822:web:3d44345fda243d266ca947"
};
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = app.firestore()
export const db = getFirestore(app);
export const storage = getStorage()