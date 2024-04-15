import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCFAXTBjnx15PZyacKqxT5LxPW-v3-rsFg",
    authDomain: "blog-app-be8e9.firebaseapp.com",
    projectId: "blog-app-be8e9",
    storageBucket: "blog-app-be8e9.appspot.com",
    messagingSenderId: "599233514822",
    appId: "1:599233514822:web:3d44345fda243d266ca947"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app)