import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmGIhaIM5IdyhJog2WkhpjaUg3SSnuAHU",
  authDomain: "chatapp-4f052.firebaseapp.com",
  projectId: "chatapp-4f052",
  storageBucket: "chatapp-4f052.appspot.com",
  messagingSenderId: "999460386293",
  appId: "1:999460386293:web:3a582681ca3f1d73e0dcbc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

