const {Rooms, ACTIONS, EVENTS} = require('../models/roomModel')
const {broadcastOnlineList} = require('../utils')

const handleControllerEvent = (req, ws)=>{
    if(req.action == ACTIONS.ASSIGN) {
        assignController(req, ws)
    }
}

const assignController = (req, ws) => {
    const {roomId, targetUserId, controller} = req
    Rooms.get(roomId).Users.get(targetUserId).controller = controller

    // update at client
    Rooms.get(roomId).Users.get(targetUserId).ws.send(JSON.stringify({event: EVENTS.VIDEO_CONTROLLER, action: controller}))

    //broadcast
    broadcastOnlineList(roomId)
}

module.exports = handleControllerEvent