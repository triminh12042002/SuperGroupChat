const {Rooms} = require('../models/roomModel')
const {broadcastMessage} = require('../utils')


const handleSyncEvent = (req, ws)=>{
    const {roomId, userId, action} = req
    if(Rooms.get(roomId)) {
        if(action == 'getvideo') {
            ws.send(JSON.stringify({...req, videoId: Rooms.get(roomId).videoId}))
        } else {
            broadcastMessage(req, roomId, userId)
            if(action == 'changevideo') Rooms.get(roomId).videoId = req.videoId
        }

    }

}

module.exports = handleSyncEvent