// Firebase init — loaded as ES modules straight from the CDN, so this file
// works on a plain static site with no bundler/npm build step required.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBya6x4c-9GkTnJhr19x1AN1_ne6zAdu8E",
  authDomain: "darkk-9f5b9.firebaseapp.com",
  projectId: "darkk-9f5b9",
  storageBucket: "darkk-9f5b9.firebasestorage.app",
  messagingSenderId: "584663716195",
  appId: "1:584663716195:web:834beee837f9326ffb8356",
  measurementId: "G-K4L3VR8L2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore — this is what index.js uses to store leads
export const db = getFirestore(app);

// Analytics only works in supported browser contexts (blocked by some
// privacy browsers/extensions), so guard it instead of letting it throw.
isSupported()
  .then((supported) => { if (supported) getAnalytics(app); })
  .catch(() => {});