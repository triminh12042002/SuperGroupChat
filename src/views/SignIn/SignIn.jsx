import firebase from 'firebase/compat/app';
import { auth } from '../../firebase';
import { SignInFaceId } from './FaceId';

export default function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Hello there</h1>
                    <p className="py-6">A chat app that support user with multiple tool as Watch Together, Stable Diffusion and more in futher</p>
                    <button className='btn btn-primary' onClick={signInWithGoogle} >Sign in with Google</button>
                    
                    {/* FaceID */}
                    <SignInFaceId/>

                </div>

            </div>
        </div>


    )
}