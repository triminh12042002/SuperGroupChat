import { auth } from "../../../firebase";

export default function ChatMessage(props) {
    const { text, uid, photoURL, imageURL } = props.message;
    if (!auth.currentUser) {
        return (
            <div>unknown user</div>
        )
    }
    const messageClass = (uid == auth.currentUser.uid) ? 'chat-end' : 'chat-start';

    return (
        <div className={`chat ${messageClass}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img src={photoURL} />
                </div>
            </div>
            <div className="chat-bubble">{text}</div>
            <img src={imageURL} className="w-auto" />
        </div>
    )
}