import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { auth } from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";

const authenticateAccount = (customToken) => {
  auth.signInWithCustomToken(customToken)
    .then((userCredential) => {
      // User is authenticated with Firebase
      const user = userCredential.user;
      console.log('Firebase user:', user);
      window.location.reload();
    })
    .catch((error) => {
      console.error('Firebase custom authentication error:', error);
    });
}

// API & Constants
const API_VERIFY_EMAIL_EXIST = 'http://127.0.0.1:5000/login/start';
const API_REGISTER_FACEID = 'http://127.0.0.1:5000/register';

const LOGIN_TIMEOUT = 10000
const API_LOGIN_FACEID = 'http://127.0.0.1:5000/login';

const TOTAL_REGISTER_IMAGES = 10
const INTERVAL = 500
const WAIT_WEBCAM_SETUP = 3000
// const BATCH_LOGIN_IMAGES = 5

export const SignUpFaceId = () => {
  const webcamRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState(false)
  const [user] = useAuthState(auth);
  const email = user.email
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
    if (imageSrc && imageCount < TOTAL_REGISTER_IMAGES) {
      const image = imageSrc.split(',')[1]
      console.log("capture image ", image)
      imageArray.push(image)
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
    try {
      console.log('image array length', imageArray.length)
      console.log('data send', { username: email,  
        images: imageArray })
      const response = await axios.post(API_REGISTER_FACEID,
        { username: email,  
          images: imageArray });
      // Handle the response as needed
      console.log('Images uploaded:', response.data);
      
      setSignUpStatus(true)

    } catch (err) {
      console.log('Error while uploading images:', err);
    }
  };

  // Register  
  useEffect(()=>{
    if(isModalOpen) {
      console.log("email", email)
      setTimeout(() => {
        startImageCapture()
      }, WAIT_WEBCAM_SETUP);
    }
  }, [isModalOpen])

  // Modal

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSignUpStatus(false)
  };

  return (
  <div className="indicator mt-4 mr-6">
    <span className="indicator-item badge badge-primary">new</span> 
    <div  className="mt-2">
      <label onClick={openModal} htmlFor="faceid" className="btn btn-secondary">
        Sign Up With FaceID
      </label>
      <input type="checkbox" id="faceid" className="modal-toggle" checked={isModalOpen} />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-box">
            <div className="modal-action">
              
              <div>
                <div className="text-center">
                   {!signUpStatus ? 
                   <span className="btn btn-ghost loading loading-spinner loading-lg">position your face in the webcam</span>
                   : <h3>REGISTER SUCCESSFULLY</h3>
                    }
                </div>
                <Webcam 
                // height={256}
                screenshotFormat="image/jpeg"
                // width={256}
                ref={webcamRef} />
              </div>

              <label onClick={closeModal} htmlFor="faceid" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                x
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export const SignInFaceId = () => {
  const webcamRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountExist, setIsAccountExist] = useState(null)
  const [email, setEmail] = useState('');
  const [signInStatus, setSignInStatus] = useState(null)

  // Image
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc
    },
    [webcamRef]
  );

  const startImageCapture = () => {
    captureImage(Date.now());
  };

  const captureImage = (start) => {
    if(Date.now() - start < LOGIN_TIMEOUT) {
      const imageSrc = capture();
      const image = imageSrc.split(',')[1]
      console.log("capture image", image)
      // post to login api
      postImages(image)
      // logic verify

      setTimeout(() => {
        captureImage(start)
      }, INTERVAL);
    } else {
      console.log("LOGIN TIMEOUT, TRY AGAIN")
      setSignInStatus("LOGIN TIMEOUT, PLEASE TRY AGAIN")
    }
  };

  const postImages = async (image) => {
    try {
      const images = []
      images.push(image)
      console.log({ username: email,  
        images: images })
      const response = await axios.post(
        API_LOGIN_FACEID,
        { username: email,  
          images: images });
      
      console.log('Login:', response.data);
        
      const code = response.data.code
      if(code == 1) {
        const token = response.data.token
        authenticateAccount(token)
      }
    } catch (err) {
      console.log('Error while uploading images:', err)
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
    setSignInStatus(null)
  };

  // Email

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmitEmail = async () => {
    const res = await axios.post(API_VERIFY_EMAIL_EXIST, {
      username: email
    });
    // Account not exist
    console.log(res.data)
    // Account registerd

    // Success
    if(res.data.code == "1") setIsAccountExist(true)
    else setIsAccountExist(false)
  };

  return (
  <div className="indicator ml-4">
    <span className="indicator-item badge badge-primary">new</span> 
    <div  className="mt-2">
      <label onClick={openModal} htmlFor="faceid" className="btn btn-secondary">
        Sign In With FaceID
      </label>
      <input type="checkbox" id="faceid" className="modal-toggle" checked={isModalOpen} />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-box">
              {signInStatus && <p>{signInStatus}</p>}
              {isAccountExist == false && <p className="text-red">Invalid email</p>}
            <div className="modal-action">
              {!isAccountExist && 
              <div className="form-control w-full max-w-xs mx-auto">
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder='Your email'
                  className="input input-bordered input-secondary w-full max-w-xs" />
                <button className='btn btn-wide btn-secondary mx-auto mt-4' onClick={handleSubmitEmail}>
                  Continue
                </button>
              </div>
              }
              {isAccountExist &&
              <Webcam 
              // height={256}
              screenshotFormat="image/jpeg"
              // width={256}
              ref={webcamRef} />
              }
              <label onClick={closeModal} htmlFor="faceid" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                x
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
