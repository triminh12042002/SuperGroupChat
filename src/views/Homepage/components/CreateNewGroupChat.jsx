import { useState } from "react";
import { auth, app, firestore } from "../../../firebase";
import GroupChatRow from "./GroupChatRow";

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
// firebase hooks
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import SignIn from "../../SignIn/SignIn";
export default function CreateNewGroupChat() {
    // 
    const [groupName, setGroupName] = useState('');

    const currentUserUid = firebase.auth().currentUser.uid;
    console.log(currentUserUid);
    //fetch list of user group chat
    const groupRef = firestore.collection('groups');
    // console.log(groupRef);
    const query = groupRef.where('users', 'array-contains', currentUserUid.toString());
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