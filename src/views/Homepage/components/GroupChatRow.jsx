import { Link } from "react-router-dom";

export default function GroupChatRow({ group }) {
    // console.log('group')
    // console.log(group)
    function selectGroupChat(e) {
        e.preventDefault();
        <Link />
    }
    
    return (
        <Link to={'/groups/' + group.id} className='flex bg-gray-400 p-4 my-4 gap-2 w-2/5 m-auto cursor-pointer'>
            {'Group:'}
            <h1 className='text-2xl'>{group?.name}</h1>
            {/* <h4>{group?.admin}</h4> */}
        </Link>
    )
}