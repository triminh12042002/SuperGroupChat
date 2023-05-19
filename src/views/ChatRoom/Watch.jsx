import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app'
import { useParams } from 'react-router-dom';

let player
let socket

function Watch(props) {
  const [videoId, setVideoId] = useState('00vnln25HBg')
  const [inputVideoId, setinputVideoId] = useState('')
  const [controller, setController] = useState('guest')
  const [onlineList, setOnlineList] = useState([])


  socket = new WebSocket("ws://localhost:8080")

  useEffect(()=>{
    if(!window.YT){
      const tag = document.createElement('script');
      tag.src = "http://www.youtube.com/iframe_api";

      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      loadVideo();
    }

    // test code
    socket.onopen = () => {
      console.log("connection establish")
      socket.send(JSON.stringify({event: 'room', action: 'join', roomId: props.roomId, userId: props.userId, userName: 'huy'}));
        
      // receive response
        socket.addEventListener('message', event => {
          let res = JSON.parse(event.data);
          console.log('Incoming response', res)
          handleResponse(res)
          });
    }

    socket.onclose = () => {
      socket.send(JSON.stringify({event: 'close', action: 'leave', roomId: props.roomId, userId: props.userId, msg: 'close from client'}));
      console.log('Websocket Disconnected');
    }
  }, [])
  
  // Handle all type of responses
  const handleResponse = res => {
    if(res.event == 'sync'){
      updateVideo(res)
    } else if(res.event == 'control'){
      // can be host/controller/guest
      console.log('set controller')
      setController(res.action)
    } else if (res.event == 'online'){
      setOnlineList(res.onlineList)
    }
  }

  // Sync
  const loadVideo = () => {
    player = new window.YT.Player('player', {
      videoId: videoId,
      playerVars: {
        'autoplay': false,
        'mute': false
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange' : onStateChange
      },
    });
  }

  // 1. pause, play
  const onStateChange = event => {
    // if(props.controller){
      if(event.data === 1)
        sync();
      else if(event.data === 2)
        syncPause();
    // }
  };

  const onPlayerReady = event => {
    event.target.playVideo();
  }

  const syncPause = () => {
    socket.send(JSON.stringify({
      event: "sync",
      action: "pause",
      roomId: props.roomId,
      userId: props.userId
      })
    )
  };
  const sync = () => socket.send(currentStatus());

  const currentStatus = () => (JSON.stringify({
    event: "sync", 
    action: "currenttime",
    roomId: props.roomId,
    userId: props.userId,
    currentTime: player.getCurrentTime(),
  })
  );

  const updateVideo = res => {
    let videoStatus = player.getPlayerState();
    if(res.action === 'currenttime' && (videoStatus === 2 || videoStatus === -1)){
      playVideo();
      seekTo(res.currentTime);
    } else if (res.action === 'pause' && videoStatus !== 2) {
      pauseVideo();
    }  else if(res.action == 'changevideo' ){
      changeVideo(res.videoId)
    }
  }

  const handleOnChangeVideoId = event => {
    if(event)
      event.preventDefault();
    setinputVideoId(event.target.value)
  }

  const handleOnVideoIdSubmit = async event => {
    if(event)
      event.preventDefault();
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/, match = inputVideoId.match(regExp);
    
    // console.log('check', props.controller, match && match[2].length == 11)
    if(true && match && match[2].length == 11){
        setVideoId(match[2])
        await changeVideo(match[2])
        // broadcast change videoId
        socket.send(JSON.stringify({event: 'sync', action: 'changevideo', roomId: props.roomId, userId: props.userId, videoId}))

      }
  }

  // Online
  const handleAssignController = (event) =>{
    event.preventDefault()
    console.log('hello')
    const req = {
      event: 'control',
      action: 'assign',
      roomId: props.roomId,
      userId: props.userId,
      targetUserId: event.target.getAttribute('targetUserId'),
      controller: event.target.getAttribute('controller')
    }

    socket.send(JSON.stringify(req))
  }

  // api
  const changeVideo = id => player.loadVideoById(id);

  const pauseVideo = () => player.pauseVideo();

  const playVideo = () => player.playVideo();

  const seekTo = second => player.seekTo(second, true);

  return (
    <div class="container">
      <div>
        <div id="player"></div>
      </div>
    <div >
      {onlineList.map(({userName, userId, controller: control}) =>
        <div>
          <li key={userId}>{`${userName} - ${control}`}</li>
          { (controller == 'host' && control == 'guest') && <button targetUserId={userId} controller={'controller'} onClick={handleAssignController}>Assign controller</button>}
          { (controller == 'host' && control == 'controller') && <button targetUserId={userId} controller={'guest'} onClick={handleAssignController}>Assign guest</button>}

        </div>
      )}
    </div>

      <form onSubmit={handleOnVideoIdSubmit}>
        <div>
          <input placeholder="Video URL" onChange={handleOnChangeVideoId} value={inputVideoId} required />
          <button type="submit">Change Video</button>
        </div>
      </form>
      
    </div>
  )
}

export default Watch

// https://www.youtube.com/watch?v=UmIYanq5gH8