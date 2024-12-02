import firebase_admin
from firebase_admin import credentials, firestore
from .embedder import Embedder
from google.cloud.firestore_v1.vector import Vector
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
import os

class FirestoreWorker:
    def __init__(self):
        
        if not firebase_admin._apps:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            credentials_path = os.path.join(script_dir, "../inspired-muse-440603-a1-firebase-adminsdk-86yaj-24fd1a2487.json" )
            cred = credentials.Certificate(credentials_path)
            app = firebase_admin.initialize_app(cred, name="minoa-llm-vector-store")
            print(app.name)
        self.db_engine = firestore.client(app=app)
        self.db_engine._database_string_internal=(
            "projects/inspired-muse-440603-a1/databases/minoa-llm-vector-store"
        )

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

    def search_rag_similar_documents(self, textual_info : str, source_ids : list[int] | None=None):
        embedder_obj = Embedder()
        text_info_embedding = embedder_obj.create_embedding(textual_info)

        if text_info_embedding is None:
            return None
        
        collection = self.db_engine.collection("text_chunks")

        if source_ids:
            collection = collection.where(filter=firestore.FieldFilter("source_classification", "in", source_ids))

        vector_query = collection.find_nearest(
            vector_field="embedding",
            query_vector=Vector(text_info_embedding),
            distance_measure=DistanceMeasure.COSINE,
            limit=5,
        )

        documents = vector_query.get()

        return documents

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
    
# client = FirestoreWorker()
# related_documents = client.search_rag_similar_documents("Our product aims to revolutionize online dating which has been steadily falling in recent years.", [1])
# for doc in related_documents:
#     doc_as_dict = doc.to_dict()
#     print(f"Document Title : {doc_as_dict["title"]}")
#     print(f"Document Text : {doc_as_dict["text"]}")

#     print("\n")
# # print(related_documents)