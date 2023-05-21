import { useEffect, useState, useRef} from 'react';
import firebase from 'firebase/compat/app'
import { useParams } from 'react-router-dom';

let player = null

function Watch(props) {
  const [videoId, setVideoId] = useState('00vnln25HBg')
  const [inputVideoId, setinputVideoId] = useState('')
  const [controller, setController] = useState('guest')
  const [onlineList, setOnlineList] = useState([])
  useEffect(()=>{

    // test code
    props.socket.onopen = () => {
      console.log("connection establish")
      props.socket.send(JSON.stringify({event: 'room', action: 'join', roomId: props.roomId, userId: props.userId, userName: 'huy'}));

      // receive response
        props.socket.addEventListener('message', event => {
          let res = JSON.parse(event.data);
          console.log('Incoming response', res)
          handleResponse(res)
          });
    }

    props.socket.onclose = () => {
      props.socket.send(JSON.stringify({event: 'close', action: 'leave', roomId: props.roomId, userId: props.userId, msg: 'close from client'}));
      console.log('props.Websocket Disconnected');
    }

    // 1. pause, play
    const onStateChange = event => {
      console.log("state change", controller)
      if(controller != 'guest'){
        if(event.data === 1)
          sync();
        else if(event.data === 2)
          syncPause();
      }
    };

    const onPlayerReady = event => {
      event.target.playVideo();
    }

    // Sync
    const loadVideo = () => {
      console.log('load video')
      player = new window.YT.Player('player', {
        videoId: videoId,
        playerVars: {
          'autoplay': 0,
          'mute': 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange' : onStateChange
        },
      });
    }

    if(!window.YT){
      const tag = document.createElement('script');
      tag.src = "http://www.youtube.com/iframe_api";

      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } 
    else {
      loadVideo()
    }

    return () => {
      if (player) {
        player.destroy()
        player = null
      }
    };
  }, [controller])

  // Handle all type of responses
  const handleResponse = res => {
    if(res.event == 'sync'){
      updateVideo(res)
    } else if(res.event == 'control'){
      // can be host/controller/guest
      // console.log('set new controller: ', res.action)
      setController(res.action)
    } else if (res.event == 'online'){
      setOnlineList(res.onlineList)
    }
  }

  const syncPause = () => {
    props.socket.send(JSON.stringify({
      event: "sync",
      action: "pause",
      roomId: props.roomId,
      userId: props.userId
      })
    )
  };
  const sync = () => {
    props.socket.send(currentStatus());
  }

  const currentStatus = () => {
    let currentTime = 0
    if(player) {
      currentTime = player.getCurrentTime()
    }

    return JSON.stringify({
      event: "sync", 
      action: "currenttime",
      roomId: props.roomId,
      userId: props.userId,
      currentTime
    })

  }

  const updateVideo = res => {
    if(player && typeof player.getPlayerState == 'function') {
      let videoStatus = player.getPlayerState();
      if(res.action === 'currenttime' && (videoStatus === 2 || videoStatus === -1)){
        playVideo();
        seekTo(res.currentTime);
      } else if (res.action === 'pause' && videoStatus !== 2) {
        pauseVideo();
      }  else if(res.action == 'changevideo' ){
        setVideoId(res.videoId)
        changeVideo(res.videoId)
      }
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
    
    if(controller != 'guest'  && match && match[2].length == 11){
        setVideoId(match[2])
        await changeVideo(match[2])
        // broadcast change videoId
        props.socket.send(JSON.stringify({event: 'sync', action: 'changevideo', roomId: props.roomId, userId: props.userId, videoId: match[2]}))

      }
  }

  // Online
  const handleAssignController = (event) =>{
    event.preventDefault()
    const req = {
      event: 'control',
      action: 'assign',
      roomId: props.roomId,
      userId: props.userId,
      targetUserId: event.target.getAttribute('targetUserId'),
      controller: event.target.getAttribute('controller')
    }

    props.socket.send(JSON.stringify(req))
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
          <li key={userId}>{`${userName} - ${control} - ${userId}`}</li>
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