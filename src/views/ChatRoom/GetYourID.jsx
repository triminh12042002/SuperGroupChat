import { useEffect, useState } from "react"
import firebase from 'firebase/compat/app'

export default function GetYourID() {
    const [userID, setUserID] = useState('');
    const currentUserUid = firebase.auth().currentUser?.uid;
    console.log(currentUserUid);

    // useEffect(() => {

    // }, [])

    return (
        <div className="p-2">
            <button onClick={() => setUserID(currentUserUid)} className="">Get my ID</button>
            <div className="mt-2 p-2 bg-gray-200">{userID}</div>
        </div>
    )
}