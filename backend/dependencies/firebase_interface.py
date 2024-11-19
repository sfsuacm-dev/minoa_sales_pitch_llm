import firebase_admin
from firebase_admin import credentials, firestore
from .embedder import Embedder
from google.cloud.firestore_v1.vector import Vector
import os

class FirestoreWorker:
    def __init__(self):
        
        if not firebase_admin._apps:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            credentials_path = os.path.join(script_dir, "../minoa-llm-firebase-adminsdk-km1gz-04fc7e35be.json" )
            cred = credentials.Certificate(credentials_path)
            firebase_admin.initialize_app(cred)

        self.db_engine = firestore.client()

    def write_rag_document_chunk(self, document_title : str, document_chunk : str, source_classification_id : int):
        """
        firestore schema
        {
            text_chunk_id : int or uuid,
            text : str,
            embedding : [],
            document_title : str,
            source_classification_id : int
        }
        """
        embedder_obj = Embedder()
        text_to_embed = document_title + " " + document_chunk
        embedding = embedder_obj.create_embedding(text_to_embed)

        if embedding is None:
            return
        
        text_embedding = Vector(embedding)

        firestore_text_chunk = {
            "title" : document_title,
            "text" : document_chunk,
            "embedding" : text_embedding,
            "source_classification" : source_classification_id
        }

        self.db_engine.collection("text_chunks").document().set(firestore_text_chunk)

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