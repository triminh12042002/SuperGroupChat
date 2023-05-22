import firebase from 'firebase/compat/app'

import React, { useState } from 'react';
import { auth, firestore } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
const videos = []

function Playlist({roomId}) {
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
      <h2>Playlist</h2>
      <ul>
        {videos && videos.map((video) => (
          <Video key={video.videoId} video={video} onRemove={handleRemoveVideo} />
        ))}
      </ul>
      <AddVideoForm onAdd={handleAddVideo} />
    </div>
  );
}

function Video({ video, onRemove }) {
  const handleRemoveClick = () => {
    onRemove(video);
  };
  const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/0.jpg`;
  return (
    <li>
      <div>
        <img src={thumbnailUrl} alt={video.title} />
        <h3>{video.title}</h3>
        <button onClick={handleRemoveClick}>Remove</button>
      </div>
    </li>
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
    <form onSubmit={handleSubmit}>
      <input type="text" value={url} onChange={handleUrlChange} placeholder="Enter video url" />
      <input type="text" value={title} onChange={handleTitleChange} placeholder="Enter video title" />
      <button type="submit">Add Video</button>
    </form>
  );
}

export default Playlist;