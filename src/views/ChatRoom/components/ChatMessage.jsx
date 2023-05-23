import { auth } from "../../../firebase";

export default function ChatMessage(props) {
    const { text, uid, photoURL, imageURL } = props.message;
    if (!auth.currentUser) {
        return (
            <div>Unknown User</div>
        )
    }
    const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received';

    return (<div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
        <img src={imageURL} className="w-auto" />
    </div>)
}