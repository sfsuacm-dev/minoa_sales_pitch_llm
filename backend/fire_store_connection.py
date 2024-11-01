import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./minoa-llm-firebase-adminsdk-km1gz-04fc7e35be.json")
firebase_admin.initialize_app(cred)

db_engine = firestore.client() #resulting files that depend on this should "from fire_store_connection import db_engine"

