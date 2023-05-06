import { auth } from "../../firebase"

export default function SignOut() {
    return auth.currentUser && (
        <div className="">
            <button className='bg-gray-200 text-2xl grow m-2 ' onClick={() => auth.signOut()} >Sign Out</button>
        </div>
    )
}