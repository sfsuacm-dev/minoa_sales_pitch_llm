from openai import OpenAI
import os
from dotenv import load_dotenv
from pathlib import Path
import logging


class Embedder:
    def __init__(self):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.abspath(os.path.join(script_dir, '..'))
        env_path = os.path.join(backend_dir, "secrets.env")

        load_dotenv(dotenv_path=env_path)
        openai_api_key = os.getenv("OPENAI_API_KEY")
         
        print(openai_api_key)
        self.openai_client = OpenAI(api_key=openai_api_key)

    def create_embedding(self, text_chunk):
        try:
            response = self.openai_client.embeddings.create(
                input=text_chunk,
                model="text-embedding-3-small",
                encoding_format="float"
            )

            print(response.data[0].embedding)
            text_embedding = response.data[0].embedding

        except Exception as error:
            print(f"{error}")
            logging.error(f"{error}")
            return None

        return text_embedding