import React from 'react';
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from '../config/firebase-config';
import { signInWithPopup } from "firebase/auth";
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function LogIn({ setIsAuth }) {

    let navigate = useNavigate();
    let userCollectionRef = collection(db, 'users');


    // Create a user on login if user does not exist based on userId
    const createUser = async (userId, userName, userEmail) => {
        let arr = [];
        const querySnapshot = await getDocs(collection(db, 'users'));
        
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().id)
        });
        
        if(arr.indexOf(userId) <= -1){
            addDoc(userCollectionRef, {
                id: userId, 
                name: userName,
                email: userEmail,
                alias: ''
            });
        };
    };


    // Checks db if user alias is empty/filled and navigates to correct page on login
    const checkUserAlias = async (userId) => {
        const q = query(collection(db, "users"), where("id", "==", userId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {

            localStorage.setItem('alias', doc.data().alias);

            if(doc.data().alias === ''){
                navigate('/personalDetails');
            } else {
                navigate('/');
            }
        });
    };


    const loginWithGoogle = () => {

        signInWithPopup (auth, provider)
        .then((result) => {
            // console.log(result)

            // Variables of users details
            let id = result.user.uid;
            let name = result.user.displayName;
            let emailAddress = result.user.email;
            let splitname = name.split(' ');
            let fName = splitname[0];
            let lName = splitname[1];

            // Creates the user account
            createUser(id, name, emailAddress);

            // Adds user details to local storage
            localStorage.setItem('isAuth', true);
            localStorage.setItem('firstName', fName);
            localStorage.setItem('lastName', lName);
            localStorage.setItem('email', emailAddress);

            // Set authstate to true
            setIsAuth(true);

            // Checks users alias and navigates to requested page
            checkUserAlias(id);

        }).catch((error) => {
            console.log(error.code, error.message)
        });
    }

    
    return (
        <button onClick={loginWithGoogle}>Login with Google</button>
    )
}
