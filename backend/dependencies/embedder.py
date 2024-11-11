from openai import OpenAI
import os
from dotenv import load_dotenv
from pathlib import Path
import logging

class Embedder:
    def __init__(self):
        env_path = Path("..") / 'secrets.env'
        load_dotenv(dotenv_path=env_path)
        openai_api_key = os.getenv("OPENAI_API_KEY") 
        
        self.openai_client = OpenAI(api_key=openai_api_key)

    def create_embedding(self, text_chunk):
        try:
            response = self.openai_client.embeddings.create(
                input=text_chunk,
                model="text-embedding-3-small",
                encoding_format="float"
            )

            print(response.data[0].embedding)
            embedded_text = response.data[0].embedding
            
        except Exception as error:
            print(f"{error}")
            logging.error(f"{error}")
            return None

        return embedded_text
    
embedding_obj = Embedder()
embedding_obj.create_embedding("Hello world")