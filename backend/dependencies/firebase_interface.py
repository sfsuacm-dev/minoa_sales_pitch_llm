import firebase_admin
from firebase_admin import credentials, firestore
import os

class FirestoreWorker:
    def __init__(self):
        
        if not firebase_admin._apps:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            credentials_path = os.path.join(script_dir, "../minoa-llm-firebase-adminsdk-km1gz-04fc7e35be.json" )
            cred = credentials.Certificate(credentials_path)
            firebase_admin.initialize_app(cred)

        self.db_engine = firestore.client()

    def write_rag_document_chunk(self, document_title : str, document_chunk : str, source_classification : str):
        pass

    def search_rag_similar_documents(self, query_embedding : list[float]):
        pass

    def get_rag_sources_types(self) -> dict:
        all_sources = self.db_engine.collection("sources").stream()
        sources_json = []

        for source in all_sources:
            old_source_dict = source.to_dict()
            new_source_dict = {
                "source_id" : source.id,
                "source_name" : old_source_dict["source_type"],
                "source_description" : old_source_dict["source_description"] 
            }

            sources_json.append(new_source_dict)

        return sources_json