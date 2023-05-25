
import { firestore } from "../../../firebase";

import firebase from 'firebase/compat/app'
import { useCollection } from 'react-firebase-hooks/firestore'
import GroupChatRow from "./GroupChatRow";

export default function ListGroupChat() {
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
    // console.log(query);

    const groups = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // console.log('groups');
    // console.log(groups);
    // useEffect (); 

    return (
        <ul className="menu bg-base-100 w-80">
            {groups?.length > 0 && groups.map((group) => (
                <GroupChatRow group={group} key={group.id} />
            ))}
        </ul>

    )
}