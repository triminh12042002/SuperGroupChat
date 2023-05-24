const {Rooms, ACTIONS, EVENTS} = require('./models/roomModel')

const broadcastMessage = (res, roomId, userId) => {
    for(const [uid, user] of Rooms.get(roomId).Users.entries()){
        if(userId != uid) {
            user.ws.send(JSON.stringify(res))
        }
    }
}

const broadcastOnlineList = (roomId)=>{
    if(Rooms.get(roomId)) {
        const broadcastRes = {
            event: EVENTS.ONLINE,
            action: ACTIONS.ONLINE_USERS_LIST,
            onlineList: [...Rooms.get(roomId).Users.values()].map( ({userName, userId, controller, photoURL}) => ({userName, userId, controller, photoURL}))
        }
        console.log(broadcastRes)
        broadcastMessage(broadcastRes, roomId, null)
    }
}

module.exports = {broadcastMessage, broadcastOnlineList}