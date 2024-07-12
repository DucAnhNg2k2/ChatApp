import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2Q7-Y5FKVHO_b5C3CDK2oEw8pL9t-yps",
  authDomain: "chatapp-f0f95.firebaseapp.com",
  projectId: "chatapp-f0f95",
  storageBucket: "chatapp-f0f95.appspot.com",
  messagingSenderId: "441646885153",
  appId: "1:441646885153:web:0aaea04800dd997c61b660",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const GGProvider = new GoogleAuthProvider();
const FBProvider = new FacebookAuthProvider();

export { GGProvider, FBProvider };
