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
        <a className="normal-case text-xl" onClick={handleOnClick}>Sign Out</a>
    )
}