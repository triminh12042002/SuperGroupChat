import firebase from 'firebase/compat/app';
import { auth } from '../../firebase';

export default function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }
    return (
        <button className='bg-gray-500 text-2xl' onClick={signInWithGoogle} >Sign in with Google</button>
    )
}