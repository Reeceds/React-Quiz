// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// https://www.youtube.com/watch?v=jCY6DH8F4oc&ab_channel=PedroTech
// https://www.youtube.com/watch?v=zL0dKETbCNE&t=11s&ab_channel=PedroTech
// https://www.youtube.com/watch?v=PKwu15ldZ7k&t=2866s&ab_channel=WebDevSimplified

// https://www.youtube.com/watch?v=hUhWtYXgg0I&ab_channel=CodingWithAdam
// https://css-tricks.com/user-registration-authentication-firebase-react/

// https://cloud.google.com/firestore/docs/query-data/queries#in_and_array-contains-any
// https://stackoverflow.com/questions/48541270/how-to-add-document-with-custom-id-to-firestore
