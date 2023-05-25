import { useState } from "react";
import { auth, firestore } from "../../../firebase";

import firebase from 'firebase/compat/app'

// firebase hooks
import SignIn from "../../SignIn/SignIn";
export default function CreateNewGroupChat() {
    // 
    const [groupName, setGroupName] = useState('');

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
        // <div >
        //     <form className='mt-4 m-auto'>
        //         <input onChange={(e) => setGroupName(e.target.value)} placeholder='your group name' value={groupName} />
        //         <button onClick={createNewGroupChat}>Create new group chat</button>
        //     </form>
        // </div>

        <div className="form-control">
            <div className="input-group">
                <input type="text" placeholder="Your group name"  onChange={(e) => setGroupName(e.target.value)} value={groupName} className="input input-bordered" />
                <button className="btn" onClick={createNewGroupChat}>
                    Create new group chat
                </button>
            </div>
        </div>
    )
}