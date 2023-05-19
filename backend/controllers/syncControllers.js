const {Rooms} = require('../models/roomModel')
const {broadcastMessage} = require('../utils')


const handleSyncEvent = (req, ws)=>{
    const {roomId, userId} = req
    if(Rooms.get(roomId)) {
        broadcastMessage(req, roomId, userId)
    }
}

module.exports = handleSyncEvent