import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOXePb5sxYIbnwaX5l2OvtaByub3Lia7I",
    authDomain: "oneapp-fdf43.firebaseapp.com",
    projectId: "oneapp-fdf43",
    storageBucket: "oneapp-fdf43.firebasestorage.app",
    messagingSenderId: "122958510308",
    appId: "1:122958510308:web:8849e8c850410eeeb154f1",
    measurementId: "G-13JSSW7LRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };