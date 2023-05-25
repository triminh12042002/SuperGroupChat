import { Link } from "react-router-dom";

export default function GroupChatRow({ group }) {
    // console.log('group')
    // console.log(group)
    function selectGroupChat(e) {
        e.preventDefault();
        <Link />
    }
    
    return (
        <li className="hover-bordered">
            <Link to={'/groups/' + group.id}>
                {'Group:'}
                <h1 className='text-2xl'>{group?.name}</h1>
            </Link>
        </li>
    )
}