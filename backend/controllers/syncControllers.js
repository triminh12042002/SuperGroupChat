const {Rooms} = require('../models/roomModel')
const {broadcastMessage} = require('../models/roomModel')


const handleSyncEvent = (req, ws)=>{
    if(Rooms.get(req.roomId)) {
        broadcastMessage(req, Rooms.get(req.roomId).Users, ws)
    }
}

module.exports = handleSyncEvent