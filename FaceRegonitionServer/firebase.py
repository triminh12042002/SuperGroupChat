import firebase_admin
from firebase_admin import credentials, auth
# firebase-adminsdk-fnmxn@superchat-8ec17.iam.gserviceaccount.com

# SET UP


cred = credentials.Certificate("./superchat-8ec17-firebase-adminsdk-fnmxn-1dc8f668bc.json")
firebase_admin.initialize_app(cred)

def generate_custom_token(email):
    user = auth.get_user_by_email(email)
    custom_token = auth.create_custom_token(user.uid)
    print(custom_token)
    return user.uid

generate_custom_token('huydh.tech@gmail.com')