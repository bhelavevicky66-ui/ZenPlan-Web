import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTkemxP-MP9nlV9CvClsCL5Gq4SJ-pJlE",
    authDomain: "zenplan-b7c14.firebaseapp.com",
    projectId: "zenplan-b7c14",
    storageBucket: "zenplan-b7c14.firebasestorage.app",
    messagingSenderId: "792385474118",
    appId: "1:792385474118:web:b936cf7b7c840c57eec447",
    measurementId: "G-8G4EMPFJWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
