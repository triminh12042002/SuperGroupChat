import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const SignInFaceId = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleCloseClick() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const video = document.getElementById('video');
    function startVideo() {
      navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
      )
    }

    // load models
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(startVideo).catch((err) => console.log(err))

    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video)
      const videoContainer = document.querySelector('.modal-action'); 
      videoContainer.appendChild(canvas); 
      const displaySize = { width: video.width, height: video.height }
      faceapi.matchDimensions(canvas, displaySize)
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
      }, 100);
    })
  }, []);

  return (
    <div>
      <label htmlFor="faceid" className="btn btn-primary" onClick={handleCloseClick}>
        Sign In With FaceID
      </label>
      <input type="checkbox" id="faceid" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box" style={{ overflow: 'hidden', position: 'relative' }}>
          <div className="modal-action" style={{ width: '720px', height: '560px' }}>
            <video id="video" width="720" height="560" autoPlay muted style={{ width: '100%', height: '100%' }}></video>
            <label
              htmlFor="faceid"
              className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0"
            >
              x
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInFaceId;