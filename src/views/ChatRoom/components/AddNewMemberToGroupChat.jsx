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
        <form className='form-control'>
            <div className=" flex">
                <button className="btn" onClick={addNewMember}>Add new member</button>
                <input className="input input-bordered text-black" value={newUID} onChange={(e) => setNewUID(e.target.value)} placeholder='Member ID' />
            </div>
        </form>
    )
}
