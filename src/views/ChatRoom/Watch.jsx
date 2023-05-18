import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app'
import { useParams } from 'react-router-dom';

let player
let socket

function Watch(props) {
  const [videoId, setVideoId] = useState('00vnln25HBg')
  const [inputVideoId, setinputVideoId] = useState('')
  socket = new WebSocket("ws://localhost:8080")

  //test code
  const userId = Math.floor(Math.random() * 100);
  const { id: roomId } = useParams();
  console.log(userId, roomId)

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
      socket.send(JSON.stringify({event: 'room', action: 'join', roomId, userId, userName: 'huy'}));
        
        socket.addEventListener('message', event => {
          let res = JSON.parse(event.data);
          console.log('Incoming response', res)
          updateVideo(res)
          });
    }

    socket.onclose = () => {
      console.log('Websocket Disconnected');
      // socket.send(JSON.stringify({event: 'close', action: 'leave', roomId, userId, msg: 'close from client'}));
    }
  }, [])

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
      roomId,
      userId
      })
    )
  };
  const sync = () => socket.send(currentStatus());

  const currentStatus = () => (JSON.stringify({
    event: "sync", 
    action: "currenttime",
    roomId,
    userId,
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
        console.log('change video 1')
        socket.send(JSON.stringify({event: 'sync', action: 'changevideo', roomId, userId, videoId}))
        console.log('change video 2')

      }
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