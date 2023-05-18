const server = require('http').createServer()
const WebSocket = require('ws').Server
const wss = new WebSocket({ server: server })
const app = require('express')()
const PORT = 8080

const {handleMessage} = require('./controllers/watchControllers')

server.on('request', app);

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(JSON.parse(message));
        handleMessage(JSON.parse(message), ws);
    });

    ws.on('close', message => {
        handleMessage({event: 'room', action: 'leave'}, ws);
    })
});


server.listen(PORT, ()=>{
    console.log(`Server listens on port ${PORT}`)
})