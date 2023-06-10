import { auth } from "../../../firebase";

export default function ChatMessage(props) {
    const { text, uid, photoURL, imageURL, promptImageBase64 } = props.message;
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
            {imageURL && <img src={imageURL} className="w-auto h-80 m-2 card" />}
            {promptImageBase64 && <img src={`data:image/png;base64,${promptImageBase64}`} className="w-auto h-80 m-2 card" />}
            
        </div>
    )
}