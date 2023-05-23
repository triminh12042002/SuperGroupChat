// firebase SDK
import firebase from 'firebase/compat/app'

// firebase hooks
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useRef, useState, useEffect } from 'react';
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
import { upload } from '@testing-library/user-event/dist/upload';

export default function ChatRoom() {
    const { id: roomId } = useParams();

    const fetchUserId = async () => {
        const user = firebase.auth().currentUser;
        if (user) {
          const uid = user.uid;
          return uid
        }
      };

    // const userId = firebase.auth().currentUser?.uid;
    const userId = fetchUserId()
    console.log('user id ',userId)
    const dummy = useRef();
    const messageRef = firestore.collection('groups').doc(roomId).collection('messages');

    const query = messageRef.orderBy('createAt');
    const [messages, loadingMessages, error] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

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

    // upload image
    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState([]);
    const uploadImage = () => {
        if (imageUpload) {
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
            uploadBytes(imageRef, imageUpload)
            .then(() => {
                alert("Image uploaded successfully!");
            })
            setImageUpload(null);
        }
    }
    const imageListRef = ref(storage, "images/");
    useEffect(() => {
        listAll(imageListRef)
        .then((response) => {
            // response.items.forEach((item) => {
            //     getDownloadURL(item)
            //     .then((url) => {
            //         setImageList(prev => [...prev, url]);
            //     })
            // })
        }) 
    })

    return (
        <div className='min-h-screen relative grid grid-cols-1s gap-2 md:grid-cols-[3fr_1fr] '>
            <div className='relative border'>
                
                <Watch roomId={roomId} userId={userId}></Watch>

                <div  >
                    {messages && messages.map(msg => {
                        // console.log(msg);
                        return <ChatMessage key={msg.id} message={msg} />;
                    })}
                    <div className='dum' ref={dummy}></div>
                </div>
                {/* <div className='p-8'>_</div> */}
                <form className='absolute bottom-0 flex' onSubmit={sendMessage}>
                    <input value={formValue} onChange={e => setFormValue(e.target.value)} />
                    <button onClick={uploadImage}>Send</button>
                    <input type="file" className='w-auto' onChange={e => setImageUpload(e.target.files[0])} />
                    <div>
                        {imageList.map(url => <img src={url} />)}
                    </div>
                </form>
            </div>
            <div className='border'>
                <SignOut />
                <AddNewMemberToGroupChat groupID={roomId} />
                <GetYourID />
            </div>
        </div>

    )
}