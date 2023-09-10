import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const SignInFaceId = () => {
  const webcamRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountExist, setIsAccountExist] = useState(null)
  const [email, setEmail] = useState('');

  const INTERVAL = 500
  const TOTAL_LOGIN_IMAGES = 10
  const WAIT_WEBCAM_SETUP = 3000

  // Image
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc
    },
    [webcamRef]
  );

  const startImageCapture = () => {
    captureImage(0, []);
  };

  const captureImage = (imageCount, imageArray) => {
    const imageSrc = capture();
    if (imageSrc && imageCount < TOTAL_LOGIN_IMAGES) {
      console.log("capture image ", imageCount)
      imageArray.push(imageSrc)
      // Schedule the next image capture at the specified interval
      setTimeout(() => {
        captureImage(imageCount+1, imageArray)
      }, INTERVAL);
    } else {
      // When all images are captured, post them to the endpoint
      postImages(imageArray);
    }
  };

  const postImages = async (imageArray) => {
    const endpointUrl = 'https://example.com/uploadImages'; // Replace with your image upload endpoint

    try {
      console.log('image array length', imageArray.length)
      // const response = await axios.post(endpointUrl, { images: imageArray });

      // // Handle the response as needed
      // console.log('Images uploaded:', response.data);

      closeModal();
    } catch (err) {
      console.log('Error while uploading images:', err);
    }
  };

  // Register  
  useEffect(()=>{
    if(isAccountExist) {
      setTimeout(() => {
        startImageCapture()
      }, WAIT_WEBCAM_SETUP);
    }
  }, [isAccountExist])

  // Modal

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAccountExist(null)
    setEmail('')
  };

  // Email

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmitEmail = async () => {
    const endpointUrl = 'https://example.com/subscribe';
    const url = `${endpointUrl}?email=${encodeURIComponent(email)}`;

    try {
      // const res = await axios.get(url);
      const res = true
      if(res) setIsAccountExist(true)
      else setIsAccountExist(false)
    } catch(err) {
      console.log('error while submit email')
    }
  };

  return (
    <div>
      <label onClick={openModal} htmlFor="faceid" className="btn btn-primary">
        Sign In With FaceID
      </label>
      <input type="checkbox" id="faceid" className="modal-toggle" checked={isModalOpen} />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-box">
            <p>Look at the webcam</p>
            <div className="modal-action">
              {!isAccountExist && 
                <form>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <button type="button" onClick={handleSubmitEmail}>
                    Subscribe
                  </button>
                </form>
              }
              {isAccountExist == false && <p>Account does not exist</p>}
              {isAccountExist && <Webcam ref={webcamRef} />}
              <label onClick={closeModal} htmlFor="faceid" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                x
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInFaceId;