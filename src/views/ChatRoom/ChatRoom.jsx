// firebase SDK
import firebase from 'firebase/compat/app'

// firebase hooks
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddNewMemberToGroupChat from './components/AddNewMemberToGroupChat';
import ChatMessage from './components/ChatMessage';
import SignOut from '../SignOut/SignOut';
import Watch from './Watch';
import { auth, firestore } from '../../firebase'
import GetYourID from './GetYourID';

import { storage } from '../../firebase'
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
// import { upload } from '@testing-library/user-event/dist/upload';

export default function ChatRoom() {
    const [mode, setMode] = useState(null)
    const { id: roomId } = useParams();
    const {uid, displayName, photoURL} = auth.currentUser;
    const socket = new WebSocket("ws://localhost:8080")
    useEffect(() => {
        socket.onopen = () => {

            if(mode != null && mode == false) {
                socket.send(JSON.stringify({event: 'room', action: 'leave', roomId: roomId, 
                userId: uid}))
            }
        }
    }, [mode]);

    const dummy = useRef();
    const messageRef = firestore.collection('groups').doc(roomId).collection('messages');

    const query = messageRef.orderBy('createAt');
    const [messages, loadingMessages, error] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

    // upload image
    const [imageUpload, setImageUpload] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();
        
        const { uid, photoURL } = auth.currentUser;

        const downloadUrl = await uploadImage()

        await messageRef.add({
            text: formValue,
            createAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            imageURL: downloadUrl
        })

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    // useEffect(() => {
    //     dummy.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    //   }, [messages]);

    const uploadImage = async() => {
        if (imageUpload) {
            let imageLongName = imageUpload.name + v4();
            const imageRef = ref(storage, `images/${imageLongName}`);
            await uploadBytes(imageRef, imageUpload)

            const downloadURL = await getDownloadURL(imageRef);
            console.log('downloadURL', downloadURL)
            return downloadURL
        }
        return ''
    }

    const handleWatchMode = (event)=>{
        event.preventDefault()
        if(mode == null || mode == false){
            setMode(true)
            return
        }
        setMode(false)
    }

    return (
        <div >
            {/* nav bar */}
            <div className="navbar bg-neutral text-neutral-content">
                <div className="flex-1">
                    <a href="http://localhost:3000/" className="btn btn-ghost normal-case text-xl">Super Chat App</a>
                </div>

                <div className="flex-none gap-2">
                    <div  className="cursor-pointer tooltip tooltip-bottom" data-tip="Watch2Gether" onClick={handleWatchMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`${mode ? 'text-green-500' : ''} w-6 h-6`}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                    </div>

                    <AddNewMemberToGroupChat groupID={roomId} />

                    <div className="dropdown dropdown-end dropdown-hover">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                            <img src={photoURL} />
                            </div>
                        </label>    
                        <ul tabIndex={0} className="text-black mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-100">
                            <li> <GetYourID /></li>
                            <li><SignOut /></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='pb-44 pt-10 flex flex-row'>
                {/* chat box */}

                <div className={`${mode ? 'basis-1/4' : 'containerWrap'} overflow-auto h-[65vh]`}>
                    {messages && messages.map(msg => {
                        return <ChatMessage key={msg.id} message={msg} />;
                    })}
                    <div className='dum' ref={dummy}></div>
                </div>

                {/* send */}
                <div className="bg-gray-200 fixed bottom-0 w-full py-10 shadow-lg">
                    <form className="input-group containerWrap" onSubmit={sendMessage}>
                        <input  type="text" placeholder="Send" className="input input-bordered focus:outline-none w-full mx-30" value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
                        <button className="btn btn-square" onClick={uploadImage}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        </button>
                        <input type="file" className='file-input file-input-ghost' onChange={e => setImageUpload(e.target.files[0])}/>

                    </form>
                </div>
                
                {/* Watch */}
                {(mode && uid) && <Watch roomId={roomId} userId={uid} userName={displayName} photoURL={photoURL} socket={socket} mode={mode}></Watch>}


            </div>
        </div>

    )
}