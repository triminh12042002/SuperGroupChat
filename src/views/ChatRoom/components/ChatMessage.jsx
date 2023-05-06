import { auth } from "../../../firebase";

export default function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    if (!auth.currentUser) {
        return (
            <div>unknown user</div>
        )
    }
    const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received';

    return (<div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
    </div>)
}