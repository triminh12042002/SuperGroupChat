import { useEffect, useState, useRef} from 'react';
import firebase from 'firebase/compat/app'
import { useParams } from 'react-router-dom';
import Playlist from './Playlist';

let player = null

function Watch(props) {
  const [videoId, setVideoId] = useState('Yw6u6YkTgQ4')
  const [inputVideoId, setinputVideoId] = useState('')
  const [controller, setController] = useState('guest')
  const [onlineList, setOnlineList] = useState([])
  useEffect(()=>{

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

    // test code
    props.socket.onopen = () => {
      if(props.mode != null) {
          if (props.mode) {
              props.socket.send(JSON.stringify({event: 'room', action: 'join', roomId: props.roomId, 
              userId: props.userId, userName: props.userName, photoURL: props.photoURL, videoId}));

              props.socket.send(JSON.stringify({event: 'sync', action: 'getvideo', roomId: props.roomId}))
          }
      }

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

    return () => {
      if (player) {
        player.destroy()
        player = null
      }
    };
  }, [controller, props.mode, videoId])

  // Handle all type of responses
  const handleResponse = res => {
    if(res.event == 'sync'){
      console.log('handle res', res)
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
    console.log(JSON.stringify({
      event: "sync", 
      action: "currenttime",
      roomId: props.roomId,
      userId: props.userId,
      currentTime,
      videoId
    }))
    return JSON.stringify({
      event: "sync", 
      action: "currenttime",
      roomId: props.roomId,
      userId: props.userId,
      currentTime,
      videoId
    })

  }

  const updateVideo = res => {
    if(res.action == 'getvideo'){
      console.log('in there',res.action)
      setVideoId(res.videoId)
    }
    if(player && typeof player.getPlayerState == 'function') {
      let videoStatus = player.getPlayerState();

      if(res.action === 'currenttime' && (videoStatus === 2 || videoStatus === -1)){
        playVideo();
        seekTo(res.currentTime);
      } else if (res.action === 'pause' && videoStatus !== 2) {
        pauseVideo();
      }  else if(res.action == 'changevideo'){
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

  const handleSyncChangeVideo = async (id) => {
    if(controller != 'guest' && id && id.length == 11){
      setVideoId(id)
      await changeVideo(id)
      props.socket.send(JSON.stringify({event: 'sync', action: 'changevideo', roomId: props.roomId, userId: props.userId, videoId: id}))
    }
    }

  const handleOnVideoIdSubmit = async event => {
    if(event)
      event.preventDefault();
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/, match = inputVideoId.match(regExp);
    
    handleSyncChangeVideo(match[2])
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
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-2 mx-auto' >

          <div id="player" className="z-[0]"></div>
      </div>

        <Playlist className='' roomId={props.roomId} changeVideo={handleSyncChangeVideo}/>

        <div className='col-start-1 col-span-2 mx-auto'>
        <form className="form-control w-full" onSubmit={handleOnVideoIdSubmit}>
            <div className="input-group">
              <input className="input input-bordered w-full" type='text' placeholder="Video URL" onChange={handleOnChangeVideoId} value={inputVideoId} required />
              <button type="submit" className='btn'>Change Video</button>
            </div>
          </form>
      </div>

        <div className="col-start-1 col-span-2 mx-auto carousel carousel-center w-64 p-4 space-x-4 bg-slate-300 rounded-box">
          {onlineList.map(({userName, userId, controller: control, photoURL}) =>
            <div className="carousel-item tooltip tooltip-right flex flex-col" data-tip={`${userName}-${control}`}>
              <div className="avatar">
                <div class="w-20 rounded">
                  <img src={photoURL} />
                </div>
              </div>
              { (controller == 'host' && control == 'guest') && <button className='btn w-20 text-xs' targetUserId={userId} controller={'controller'} onClick={handleAssignController}>Assign controller</button>}
              { (controller == 'host' && control == 'controller') && <button className='btn w-20 text-xs' targetUserId={userId} controller={'guest'} onClick={handleAssignController}>Assign guest</button>}
            </div>
          )}
        </div>
        
      </div>
  )
}

export default Watch

// https://www.youtube.com/watch?v=UmIYanq5gH8