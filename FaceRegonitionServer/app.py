import cv2
import os
from flask import Flask,request,render_template
from datetime import date
from datetime import datetime
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import pandas as pd
import joblib
from flask_cors import CORS

#### Defining Flask App
app = Flask(__name__)
CORS(app)

############# ROUTING FUNCTIONS ##################
def train_model_from_base64(username, base64_images):
    faces = []
    labels = []

    for base64_image in base64_images:
        try:
            # Decode the base64 image string
            image_bytes = base64.b64decode(base64_image)
            image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), -1)
            
            # Check if decoding was successful
            if image is not None:
                # Resize the image
                resized_face = cv2.resize(image, (50, 50))
                
                # Display the resized image
                # cv2.imshow('Resized Image', resized_face)
                # cv2.waitKey(0)  # Wait until a key is pressed to close the window

                # Extract user information from the filename or another source
                # For example, you can extract the username from the image filename
                # username = extract_username_from_filename(filename)

                faces.append(resized_face.ravel())
                labels.append(username)
            else:
                print("Error: Decoding image failed.")

        except Exception as e:
            # Handle any decoding errors
            print(f"Error decoding image: {str(e)}")

    if len(faces) != len(labels):
        print("Error: Number of faces and labels do not match.")
        return
    
    print("Error: Number of faces and labels do not match.", len(faces), "-----", len(labels) )

    faces = np.array(faces)
    # faces = faces.reshape(-1, 2500)  # Reshape to 2D array with 2500 features (50x50)
    
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(faces, labels)

    # Save the trained model
    joblib.dump(knn, 'static/face_recognition_model.pkl')

    # Close all OpenCV windows
    # cv2.destroyAllWindows()


import os, base64
from flask import Flask, request, jsonify

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400

        username = data.get("username")
        images = data.get("images")

        if not username or not images:
            return jsonify({"status": "error", "message": "Incomplete data provided"}), 400

        # Your image processing code here
         # Define the path to save the text file (adjust the path as needed)
        text_file_path = f'static/faces/{username}.txt'

        # Write the base64 images to the text file
        with open(text_file_path, 'w') as file:
            for base64_image in images:
                file.write(base64_image + '\n')

        # Training the model
        train_model_from_base64(username, images)

        return jsonify({"status": "success", "message": "User registered and model trained"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/login/start', methods=['POST'])
def login_start():
    username = request.json['username']

    # Define the path to the user's text file
    text_file_path = f'static/faces/{username}.txt'

    # Check if the user's text file exists
    if os.path.isfile(text_file_path):
        return jsonify({"message": "User has registered with face recognition", "status": "success","code": "1"})
    else:
        return jsonify({"message": "User has not registered with face recognition", "status": "error","code": "2"})

from firebase import generate_custom_token

@app.route('/login', methods=['POST'])
def login_user():
    try:
        if 'face_recognition_model.pkl' not in os.listdir('static'):
            return jsonify({"status": "error", "message": str(e)}), 500

        data = request.get_json()
        print(124, data)
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400

        username = data.get("username")
        images = data.get("images")
        print("Len faces", len(images))
        print(1)
        if not username or not images:
            return jsonify({"status": "error", "message": "Incomplete data provided"}), 400
        
        faces = []

        for base64_image in images:
            print(138)
            # Your image processing code here
            image_bytes = base64.b64decode(base64_image)
            image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), -1)
            
            # Check if decoding was successful
            if image is not None:
                print(145)
                # Resize the image
                resized_face = cv2.resize(image, (50, 50))
                # predict the image by fucntion identify_face and logic
                # cv2.imshow('Resized Image', resized_face)
                # cv2.waitKey(0)  # Wait until a key is pressed to close the window
                flattened_face = resized_face.ravel()
                faces.append(flattened_face)

                identified_person = identify_face(resized_face.reshape(1,-1))[0]
                # predictedUser = identify_face(faces)
                print(156)
                if identified_person == username:
                    print(158)
                    token = generate_custom_token(identified_person)
                    token = token.decode('utf-8')

                    return jsonify({"status": "success", "message": "Login with face success", "code":1, "token":token}), 200
                return jsonify({"status": "fail", "message": "Login with face failed","code":2}), 400

            else:
                print("Error: Decoding image failed.")
        print("Len faces", len(faces))
        # identified_person = identify_face(face.reshape(1,-1))[0]
        # predictedUser = identify_face(faces)
        # print(predictedUser)
        # if predictedUser == username:
        #     return jsonify({"status": "success", "message": "Login with face success"}), 200
        return jsonify({"status": "fail", "message": "Login with face failed"}), 400

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
#### Identify face using ML model
def identify_face(facearray):
    print("Len facearray", len(facearray))
    model = joblib.load('static/face_recognition_model.pkl')
    return model.predict(facearray)

def identify_faces(facearray):
    print("Len facearray", len(facearray))
    model = joblib.load('static/face_recognition_model.pkl')
    top_n_predictions = model.kneighbors(facearray, n_neighbors=5, return_distance=False)
    return [model.classes_[top_n] for top_n in top_n_predictions]

#### Our main function which runs the Flask App
if __name__ == '__main__':
    app.run(debug=True)
