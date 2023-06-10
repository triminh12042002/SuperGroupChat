import firebase from 'firebase/compat/app'

import React, { useState } from 'react';
import { auth, firestore } from '../../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
const videos = []

function Playlist({roomId, changeVideo}) {
  const videoRef = firestore.collection('groups').doc(roomId).collection('videos');
  const query = videoRef.orderBy('createAt');
  const [videos, loadingVideos, error] = useCollectionData(query);

  const handleAddVideo = async (video) => {
    await videoRef.add({
        createAt: firebase.firestore.FieldValue.serverTimestamp(),
        videoId: video.videoId,
        title: video.title
    })
  }

  const handleRemoveVideo = async (video) => {
    const querySnapshot = await videoRef
                                .where('videoId', '==', video.videoId)
                                .where('title', '==', video.title)
                                .get();
    querySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
      console.log('delete sucess')
    });
  };

  return (
    <div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Playlist</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          
          <tbody>
            {videos && videos.map((video) => (
              <Video key={video.videoId} video={video} onRemove={handleRemoveVideo} onChangeVideo={changeVideo}/>
            ))}
            </tbody>
          </table>
        </div>
        <AddVideoForm onAdd={handleAddVideo} />

      </div>

  );
}

function Video({ video, onRemove, onChangeVideo }) {
  const handleRemoveClick = () => {
    onRemove(video);
  };

  const handleChangeVideo = () => {
    if(video){
      onChangeVideo(video.videoId)
      onRemove(video)
    }
  }
  const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/0.jpg`;
  return (
      <tr>
            <td>
              <div className="flex items-center space-x-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={thumbnailUrl} alt={video.title} />
                  </div>
                </div>
              </div>
            </td>
            <td>
              <a className='link' onClick={handleChangeVideo}>{video.title}</a>
            </td>
            <th>
              <button className="btn btn-ghost btn-xs" onClick={handleRemoveClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
              </button>
            </th>
          </tr>

    
  );
}

function AddVideoForm({ onAdd }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/, match = url.match(regExp);
    console.log(match)
    if(match && match[2].length == 11){
      const newVideo = {
        videoId: match[2],
        title
        // Other video properties (e.g., URL, thumbnail, etc.)
      };
      onAdd(newVideo);
      setTitle('');
      setUrl('');
    }
  };

  return (
    <form className="form-control w-full" onSubmit={handleSubmit}>
      <div className="input-group">
        <input className="input input-bordered w-full" type="text" value={url} onChange={handleUrlChange} placeholder="Enter video url" />
        <input className="input input-bordered w-full" type="text" value={title} onChange={handleTitleChange} placeholder="Enter video title" />
        <button type="submit" className='btn btn-square'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        </button>
        
      </div>
    </form>
  );
}

export default Playlist;