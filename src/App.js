import './App.css';

// firebase SDK
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
// firebase hooks
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';

// You are probably invoking firebase before the app is initialized. All calls to firebase must come after .initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyD_0piJdGASKHrru9duoOBGuo0VsR5Ur7A",
  authDomain: "superchat-8ec17.firebaseapp.com",
  projectId: "superchat-8ec17",
  storageBucket: "superchat-8ec17.appspot.com",
  messagingSenderId: "1079196000441",
  appId: "1:1079196000441:web:13d1a255dcc10986037b68",
  measurementId: "G-4FWDK5FZJW"
};

const app = firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  // window.HTMLElement.prototype.scrollIntoView = function () { };

  const [user] = useAuthState(auth);
  // console.log(user)

  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/groups/:id' element={<ChatRoom />} />
    </Routes>

  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button className='bg-gray-500 text-2xl' onClick={signInWithGoogle} >Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <div className="">
      <button className='bg-gray-200 text-2xl grow m-2 ' onClick={() => auth.signOut()} >Sign Out</button>
    </div>
  )
}
function Homepage() {
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

function CreateNewGroupChat() {
  // 
  const [groupName, setGroupName] = useState('');

  const currentUserUid = firebase.auth().currentUser.uid;
  console.log(currentUserUid);
  //fetch list of user group chat
  const groupRef = firestore.collection('groups');
  // console.log(groupRef);
  const query = groupRef.where('users','array-contains', currentUserUid.toString());
  // const query = groupRef.where('admin', '==', currentUserUid.toString());
  // const [groups, loadingMessages, error] = useCollectionData(query, { idField: 'id' });
  // const [groups, loadingMessages, error] = useCollection(query, { idField: 'id' });
  const [snapshot] = useCollection(query);
  console.log(query);

  const groups = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log('groups');
  console.log(groups);
  // useEffect (); 

  if (!auth.currentUser) {
    return <SignIn />
  }

  const { uid, photoURL } = auth?.currentUser;

  async function createNewGroupChat(e) {
    e.preventDefault();
    // a ref to group collection
    const groupRef = firestore.collection('groups');
    // console.log(groupRef); 
    // add new group data
    const res = await groupRef.add({
      name: groupName,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      admin: uid,
      photoURL,
      users: [uid],
    })
    console.log('res');
    console.log(res);
    console.log(res.id);
    setGroupName('');
  }

  return (
    <div>
      <form>
        <input onChange={(e) => setGroupName(e.target.value)} placeholder='your group name' value={groupName} />
        <button onClick={createNewGroupChat}>Create new group chat</button>
      </form>
      <div>
        {groups?.length > 0 && groups.map((group) => (
          <GroupChatRow group={group} key={group.id} />
        ))}
      </div>
    </div>
  )
}

function GroupChatRow({ group }) {
  // console.log('group')
  // console.log(group)
  function selectGroupChat(e) {
    e.preventDefault();
    <Link />
  }
  return (
    <Link to={'/groups/' + group.id} className='flex bg-gray-400 p-4 my-4 gap-2 cursor-pointer'>
      {'Group:'}
      <h1 className='text-2xl'>{group?.name}</h1>
      {/* <h4>{group?.admin}</h4> */}
    </Link>
  )
}
function AddNewMemberToGroupChat({groupID}) {
  // go into a group chat, add other user to the group chat list users by their uid
  const [newUID, setNewUID] = useState('');
  const groupRef = firestore.collection('groups').doc(groupID);

  async function addNewMember(e){
    e.preventDefault();
    await groupRef.update({
      users: firebase.firestore.FieldValue.arrayUnion(newUID),
    })
    setNewUID('');
  }
  return (
    <div>
      <form className='m-2 flex flex-col'>
        <input value={newUID} onChange={(e) => setNewUID(e.target.value)} placeholder='member uid' /> 
        <button onClick={addNewMember}>Add new member</button>
      </form>
    </div>
  )
}


function ChatRoom() {
  const { id: groupID } = useParams();
  // console.log('groupID')
  // console.log(groupID)
  const dummy = useRef();
  const messageRef = firestore.collection('groups').doc(groupID).collection('messages');
  // console.log(messageRef);
  const query = messageRef.orderBy('createAt');
  const [messages, loadingMessages, error] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  // console.log(messages);
  // console.log(error);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    })

    setFormValue('');
    // console.log(dummy.current);
    // window.HTMLElement.prototype.scrollIntoView = function () { };
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }
  return (
    <div className='min-h-screen relative grid grid-cols-1s gap-2 md:grid-cols-[3fr_1fr] '>
      <div className='relative border'>
        <div  >
          {messages && messages.map(msg => {
            // console.log(msg);
            return <ChatMessage key={msg.id} message={msg} />;
          })}
          <div className='dum' ref={dummy}></div>
        </div>
        {/* <div className='p-8'>_</div> */}
        <form className='absolute bottom-0' onSubmit={sendMessage} >
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          <button>Send</button>
        </form>
      </div>
      <div className='border'>
        <SignOut />
        < AddNewMemberToGroupChat groupID={groupID}/>
      </div>
    </div>

  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  if (!auth.currentUser) {
    return (
      <div>unknown user</div>
    )
  }
  const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received';

  return (<div className={`message ${messageClass}`}>
    <img src={photoURL} />
    <p>{text}</p>
  </div>)
}
export default App;
