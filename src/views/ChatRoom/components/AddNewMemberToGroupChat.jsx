// firebase SDK
import firebase from 'firebase/compat/app'

// firebase hooks
import { useState } from 'react';
import { firestore } from '../../../firebase';


export default function AddNewMemberToGroupChat({ groupID }) {
    // go into a group chat, add other user to the group chat list users by their uid
    const [newUID, setNewUID] = useState('');
    const groupRef = firestore.collection('groups').doc(groupID);

    async function addNewMember(e) {
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
