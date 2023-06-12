import { Link } from "react-router-dom";

export default function GroupChatRow({ group }) {
    // console.log('group')
    // console.log(group)
    function selectGroupChat(e) {
        e.preventDefault();
        <Link />
    }
    
    return (
        <li className="hover-bordered bg-slate-400 text-white m-1 ">
            <Link to={'/groups/' + group.id}>
                {'Group:'}
                <h1 className='text-2xl text-white'>{group?.name}</h1>
            </Link>
        </li>
    )
}