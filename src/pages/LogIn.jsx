import React from 'react'
import { auth, provider } from '../config/firebase-config';
import { signInWithPopup } from "firebase/auth";

export default function LogIn() {

    const loginWithGoogle = ({ setIsAuth }) => {

        signInWithPopup (auth, provider)
        .then((result) => {
            console.log(result)
            localStorage.setItem('isAuth', true);
            setIsAuth(true);
        }).catch((error) => {
            console.log(error.code, error.message)
        });
    }

  return (
    <button onClick={loginWithGoogle}>Login with Google</button>
  )
}
