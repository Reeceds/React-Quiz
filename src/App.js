import './App.css';
import _global from './partials/_global.scss';
import Quiz from './pages/Quiz';
import firebase from 'firebase/compat/app';
import { GoogleAuthProvider, getAuth, signInWithRedirect   } from "firebase/auth";


function App() {

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithRedirect (auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        console.log(result)
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
      }).catch((error) => {
        console.log(error.code, error.message)
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }
  

  return(
    <button onClick={loginWithGoogle}>Login with Google</button>
    // <Quiz/>

  )
}

export default App;

