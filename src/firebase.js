// firebase SDK
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { getStorage } from 'firebase/storage'
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
// firebase hooks

// You are probably invoking firebase before the app is initialized. All calls to firebase must come after .initializeApp();

const firebaseConfig = {
  // apiKey: "AIzaSyD_0piJdGASKHrru9duoOBGuo0VsR5Ur7A",
  // authDomain: "superchat-8ec17.firebaseapp.com",
  // projectId: "superchat-8ec17",
  // storageBucket: "superchat-8ec17.appspot.com",
  // messagingSenderId: "1079196000441",
  // appId: "1:1079196000441:web:13d1a255dcc10986037b68",
  // measurementId: "G-4FWDK5FZJW"
  apiKey: "AIzaSyAxToHXp0WliqTvVER_S4oDueqkfU_C2_Y",
  authDomain: "uploadingfile-ca441.firebaseapp.com",
  projectId: "uploadingfile-ca441",
  storageBucket: "uploadingfile-ca441.appspot.com",
  messagingSenderId: "837378965040",
  appId: "1:837378965040:web:5bf1b35a22dc96877377f5"
};

const app = firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const firestore = firebase.firestore();

export {
  app,
  auth,
  firestore,
}

export const storage = getStorage(app);