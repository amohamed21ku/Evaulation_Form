import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr5lq2m8IT6p_4M54_x5VfIfCl-3JztNc",
  authDomain: "self-evaulation.firebaseapp.com",
  projectId: "self-evaulation",
  storageBucket: "self-evaulation.firebasestorage.app",
  messagingSenderId: "972300697206",
  appId: "1:972300697206:web:968dab217bf3688481e957"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
