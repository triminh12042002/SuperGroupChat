const {EVENTS, Rooms} = require('../models/roomModel')
const handleRoomEvent = require('./roomControllers')
const handleSyncEvent = require('./syncControllers')
const handleControllerEvent = require('./controlController')
// {
//     event, action, roomID, userID, payload
// }

const handleMessage = (req, ws) => {
    // console.log('Incoming request',req)
    let event = req.event;
    if(event === EVENTS.ROOM)
        handleRoomEvent(req, ws);
    else if(event === EVENTS.SYNCHRONIZE)
        handleSyncEvent(req, ws);
    else if(event === EVENTS.VIDEO_CONTROLLER)
        handleControllerEvent(req, ws);
}

module.exports =  {handleMessage}