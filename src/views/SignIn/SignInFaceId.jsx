import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const SignInFaceId = () => {
  const webcamRef = useRef(null);

  return (
    <div>
        <label htmlFor="faceid" className="btn btn-primary">Sign In With FaceID</label>
        <input type="checkbox" id="faceid" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box">
                {/* <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">This modal works with a hidden checkbox!</p> */}
                <div className="modal-action">
                <Webcam ref={webcamRef} />

                <label htmlFor="faceid" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</label>
                </div>
            </div> 
        </div>
    </div>

  );
};

export default SignInFaceId;
