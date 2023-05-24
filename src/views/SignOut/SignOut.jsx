import { auth } from "../../firebase"

export default function SignOut() {
    return auth.currentUser && (
        <a className="normal-case text-xl" onClick={() => auth.signOut()}>Sign Out</a>
    )
}