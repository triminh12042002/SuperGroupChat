import { useAuthState } from "react-firebase-hooks/auth";

import SignIn from "../SignIn/SignIn";
import { auth, } from "../../firebase";
import CreateNewGroupChat from "./components/CreateNewGroupChat";

export default function Homepage() {
    const [user] = useAuthState(auth);
    // console.log('user')
    // console.log(user)
    if (!user) {
      return <SignIn />
      // return <Navigate to={'/signin'} />
    }
    // console.log('auth');
    // console.log(auth?.currentUser);
    // const { uid, photoURL } = auth?.currentUser;
    const { uid, photoURL } = user;
  
    // display list of group chat that have this current user in side ( member or the host)
    return (
      <div>
        < CreateNewGroupChat />
      </div>
    )
  }
  