import './App.css';

// firebase SDK
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState, } from 'react-firebase-hooks/auth'
// firebase hooks
import { Route, Routes,} from 'react-router-dom';

import Homepage from './views/Homepage/Homepage';
import { auth, app, firestore } from './firebase';
import SignIn from './views/SignIn/SignIn';
import ChatRoom from './views/ChatRoom/ChatRoom';


function App() {
  // window.HTMLElement.prototype.scrollIntoView = function () { };

  // const [user] = useAuthState(auth);
  // console.log(user)

  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/groups/:id' element={<ChatRoom />} />
    </Routes>

  );
}




export default App;
