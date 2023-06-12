import { auth } from "../../firebase"
import { useNavigate } from 'react-router-dom';

export default function SignOut() {
    const navigate = useNavigate();

    const handleOnClick = async ()=>{
        await auth.signOut()
        navigate('/')
        // return <Redirect to="/" />
    }

    return auth.currentUser && (
        <button className="normal-case text-xl bg-gray-200 p-2 rounded-full m-2" onClick={handleOnClick}>Sign Out</button>
    )
}