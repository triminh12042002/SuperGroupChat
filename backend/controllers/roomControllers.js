const {ACTIONS, Rooms, EVENTS} = require('../models/roomModel')
const {broadcastOnlineList} = require('../utils')

setInterval(()=>{
    for(const [RoomId,Room] of Rooms){
        console.log(RoomId, [...Room.Users.values()].map( ({userName, userId, controller}) => ({userName, userId, controller})))
    }
}, 10000)

const handleRoomEvent = (req, ws) => {
    const {action} = req
    if(action === ACTIONS.JOIN)
        joinRoom(req, ws);
    else if(action === ACTIONS.LEAVE)
        leaveRoom(ws)
}

const joinRoom = (req, ws) => {
    const {userId, roomId, userName} = req
    // If room not exist -> host
    const newUser = {
        userName: userName,
        userId: userId,
        controller: 'host',
        ws
    }

    if(!Rooms.get(roomId)){
        Rooms.set(roomId, {
            Users: new Map(),
        })
    }else {
        newUser.controller = 'guest'
    }
    Rooms.get(req.roomId).Users.set(userId, newUser)

    // update the controller of this ws
    const res = {
        event: EVENTS.VIDEO_CONTROLLER,
        action: newUser.controller == 'host' ? ACTIONS.HOST : ACTIONS.GUEST
    }

    // broadcast new online list to other ws
    ws.send(JSON.stringify(res))
    broadcastOnlineList(req.roomId)
}


const leaveRoom = (ws)=>{
    console.log('leave room')
    // check if leaved user has the controller ?
    let roomId = null, userId = null
    for(let [Id, Room] of Rooms){
        for (let [key, User] of Room.Users.entries()){
            if(User.ws == ws){
                roomId = Id
                userId = key
                break
            }
        }
        if(!roomId) break
    }

    // if room not exist 
    if(!roomId) return;

    const isHost = Rooms.get(roomId).Users.get(userId).controller == ACTIONS.HOST
    Rooms.get(roomId).Users.delete(userId)

    // if no one in room, remove the room
    if(Rooms.get(roomId).Users.size == 0) Rooms.delete(roomId)
    else{ // still have users in room
        if(isHost) { // delete user has control
            const user = [...Rooms.get(roomId).Users.values()][0]
            user.controller = ACTIONS.HOST // assign host to new user
            user.ws.send(JSON.stringify({
                event: EVENTS.VIDEO_CONTROLLER,
                action: ACTIONS.HOST
            }))
        }
    }

    // update the online section & new controller
    broadcastOnlineList(roomId)
    ws.close()
    console.log('leave room completely')
}

module.exports = handleRoomEvent