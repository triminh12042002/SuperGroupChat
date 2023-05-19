
const ACTIONS = Object.freeze({
    JOIN: 'join',
    LEAVE: 'leave',

    HOST: 'host',
    CONTROLLER: 'controller',
    GUEST: 'guest',

    ONLINE_USERS_LIST: 'onlineuserslist',
    ASSIGN: 'assign',
    REMOVE: 'remove'
    // NEW_CONTROLLER: 'newcontroller'
});

const EVENTS = Object.freeze({
    ROOM: 'room',
    SYNCHRONIZE: 'sync',
    VIDEO_CONTROLLER: 'control',
    ONLINE: 'online'
});

const Rooms = new Map()

module.exports = {ACTIONS, EVENTS, Rooms}