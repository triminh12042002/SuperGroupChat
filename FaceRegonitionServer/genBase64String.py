import os
import base64
import json

# Define the folder path containing the images
folder_path = 'static/faces/admin_1/'

# Initialize an empty list to store the base64-encoded strings
base64_images = []

# Iterate through the files in the folder
for filename in os.listdir(folder_path):
    if filename.endswith('.jpg'):
        file_path = os.path.join(folder_path, filename)
        with open(file_path, 'rb') as image_file:
            # Read the image file as bytes
            image_bytes = image_file.read()
            # Encode the image bytes as base64
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            base64_images.append(base64_image)

# Now, base64_images contains a list of base64-encoded image strings

# Define the output file path
output_file = 'base64_images.txt'

# Serialize the base64_images list to a JSON array
json_data = json.dumps(base64_images, indent=4)

# Write the JSON data to a text file
with open(output_file, 'w') as file:
    file.write(json_data)

print(f'Base64 images exported to {output_file}')