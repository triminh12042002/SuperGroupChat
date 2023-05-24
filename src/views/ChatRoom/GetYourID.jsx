import { useEffect, useState } from "react"
import firebase from 'firebase/compat/app'

export default function GetYourID() {
    const [userID, setUserID] = useState('');
    const currentUserUid = firebase.auth().currentUser?.uid;

    // useEffect(() => {

    // }, [])

    return (
        <a className="normal-case text-xl">
            {currentUserUid && `uid: ${currentUserUid}`}
        </a>
    )
}