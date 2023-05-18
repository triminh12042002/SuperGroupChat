const {ACTIONS, Rooms} = require('../models/roomModel')
const {broadcastMessage} = require('../models/roomModel')

setInterval(()=>{
    for(const [RoomId,Room] of Rooms){
        console.log(RoomId, Room.Users.values())
    }
}, 10000)

const handleRoomEvent = (req, ws) => {
    let action = req.action;
    if(action === ACTIONS.JOIN)
        joinRoom(req, ws);
    else if(action === ACTIONS.LEAVE)
        leaveRoom(ws)
}

const joinRoom = (req, ws) => {
    // If room not exist -> host
    const newUser = {
        userName: req.userName,
        controller: true
    }

    if(!Rooms.get(req.roomId)){
        Rooms.set(req.roomId, {
            Users: new Map(),
        })
    }else {
        newUser.controller = false
    }
    Rooms.get(req.roomId).Users.set(ws, newUser)

    // Broadcast response
    const res = {
        event: "join successfully"
    }
    console.log('hello', Rooms.get(req.roomId).Users.get(ws))
    broadcastMessage(res, Rooms.get(req.roomId).Users, ws)
}

const leaveRoom = (ws)=>{
    console.log('leave room')
    // check if leaved user has the controller ?
    let roomId
    for(let [Id, Room] of Rooms){
        if(Room.Users.size != 0 && Room.Users.get(ws)) {
            roomId = Id
            break
        }
    }

    // if room not exist 
    if(!roomId) return;
    
    const hasControl = Rooms.get(roomId).Users.get(ws).controller == true
    Rooms.get(roomId).Users.delete(ws)

    // if no one in room, remove the room
    if(Rooms.get(roomId).Users.size == 0) Rooms.delete(roomId)
    else{ // still have users in room
        if(hasControl) // delete user has control
            Rooms.get(roomId).Users.values[0].controller = true // assign controller to new user
    }

    // update the online section & new controller
}

module.exports = handleRoomEvent