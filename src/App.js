import './App.css';

// firebase SDK


// firebase hooks
import { Route, Routes,} from 'react-router-dom';

import Homepage from './views/Homepage/Homepage';
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
