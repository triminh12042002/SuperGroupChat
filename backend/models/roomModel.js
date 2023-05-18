
const ACTIONS = Object.freeze({
    JOIN: 'join',
    LEAVE: 'leave',
    CONTROLLER: 'controller',
    GUEST: 'guest',
    ONLINE_USERS_LIST: 'onlineuserslist',
    ASSIGN: 'assign',
    NEW_CONTROLLER: 'newcontroller'
});

const EVENTS = Object.freeze({
    ROOM: 'room',
    SYNCHRONIZE: 'sync',
    // VIDEO_CONTROLLER: 'control',
    // ONLINE: 'online'
});

const Rooms = new Map()

const broadcastMessage = (res, Users, ws) => {
    console.log(Users.get(ws))
    Users.forEach((User, userWs) => {
        if(userWs != ws) {
            userWs.send(JSON.stringify(res))
        } else {
            console.log('match')
        }
    });
}

module.exports = {ACTIONS, EVENTS, Rooms, broadcastMessage}