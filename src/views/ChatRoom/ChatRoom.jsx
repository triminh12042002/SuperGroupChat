// firebase SDK
import firebase from 'firebase/compat/app'

// firebase hooks
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddNewMemberToGroupChat from './components/AddNewMemberToGroupChat';
import ChatMessage from './components/ChatMessage';
import SignOut from '../SignOut/SignOut';

import { auth, firestore } from '../../firebase'
import GetYourID from './GetYourID';

export default function ChatRoom() {
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
                <AddNewMemberToGroupChat groupID={groupID} />
                <GetYourID />
            </div>
        </div>

    )
}