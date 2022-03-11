// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfdKc9Ki_YZS-N2mnUmTFEK-Ge0_j_qHo",
  authDomain: "quiz-b31e2.firebaseapp.com",
  projectId: "quiz-b31e2",
  storageBucket: "quiz-b31e2.appspot.com",
  messagingSenderId: "1008361483573",
  appId: "1:1008361483573:web:3dfaec3532ab7f3ceeb07c",
  measurementId: "G-3KVLS9W4DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// https://www.youtube.com/watch?v=jCY6DH8F4oc&ab_channel=PedroTech
// https://www.youtube.com/watch?v=zL0dKETbCNE&t=11s&ab_channel=PedroTech