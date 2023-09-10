import { useAuthState } from "react-firebase-hooks/auth";

import SignIn from "../SignIn/SignIn";
import { auth, } from "../../firebase";
import CreateNewGroupChat from "./components/CreateNewGroupChat";
import ListGroupChat from "./components/ListGroupChat";
import GetYourID from "../ChatRoom/components/GetYourID";
import SignOut from "../SignOut/SignOut";
import {SignUpFaceId} from "../SignIn/FaceId";

export default function Homepage() {
  const [user] = useAuthState(auth);
  // const user = auth.currentUser;
  let uid, displayName, photoURL;

  if (user) {
    // User is authenticated, destructure the properties
    ({ uid, displayName, photoURL } = user);
  } else {
    // User is not authenticated, handle the error or set default values
    // For example, you can set default values like:
    uid = null;
    displayName = 'Guest';
    photoURL = null;
  }
  // console.log('user')
  // console.log(user)
  if (!user) {
    return <SignIn />
    // return <Navigate to={'/signin'} />
  }
  // console.log('auth');
  // console.log(auth?.currentUser);
  // const { uid, photoURL } = auth?.currentUser;
  // const { uid, photoURL } = user;
  // display list of group chat that have this current user in side ( member or the host)
  return (
    <div className="flex flex-row justify-center h-screen bg-gray-200">

      <SignUpFaceId />
      <div className="px-20 py-10 bg-white">
        <div className="my-4">
          <CreateNewGroupChat />
        </div>
        <div className="my-8 flex justify-center items-center ">
          <ListGroupChat />
        </div>
      </div>
      {/* profile */}
      <div className="dropdown ">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={photoURL} alt='your image' />
          </div>
        </label>
        <ul tabIndex={0} className="text-black mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-100 justify-items items-center">
          <div> <GetYourID /></div>
          <div><SignOut /></div>
        </ul>
      </div>
    </div>

  )
}
