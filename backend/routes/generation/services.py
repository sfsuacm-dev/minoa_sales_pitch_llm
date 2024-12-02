from .model import pitch_generation_request
import requests
import json
from ...dependencies.firebase_interface import *

def call_llm(prompt : str):
    r = requests.post(
       "http://127.0.0.1:11434/api/chat",
        json={"model" : "llama3.2", "messages" : [{"role" : "user", "content" : prompt, "stream" : True}]},
        stream=True
    )
    r.raise_for_status()
    output = ""

    for line in r.iter_lines():
        body = json.loads(line)
        if "error" in body:
            raise Exception(body["error"])
        if body.get("done") is False:
            message = body.get("message", "")
            content = message.get("content", "")
            output += content
            # the response streams one token at a time, print that as we receive it
            print(content, end="", flush=True)

        if body.get("done", False):
            message["content"] = output
            return {"message" : message}
        
#return relevant document names and content
async def vector_search_relevant_docs(sales_information : pitch_generation_request, source_selection_ids : list[int]):
    firebase_worker = FirestoreWorker()
    rag_prompt = f"""
    Company name: {sales_information.company_name},
    Product name: {sales_information.product_name},
    Product description: {sales_information.product_description}
    """
    related_documents = firebase_worker.search_rag_similar_documents(rag_prompt, source_selection_ids)

    #process relevant docs into string
    retrieved_sources_str = ""

    for i in range(len(related_documents)):
        document_as_dict = related_documents[i].to_dict()
        
        document_number = str(i + 1)
        document_title = document_as_dict["title"]
        document_text_chunk = document_as_dict["text"]

        combined_string = (
            f"DOCUMENT: {document_number}\n" 
            + f"Document Title: {document_title}\n" 
            + f"Document Chunk: {document_text_chunk}\n\n"
        )
             
        retrieved_sources_str += combined_string
    
    return retrieved_sources_str

async def get_perplexity_response(prompt : str):
    pass

#should be a mix of the LINKEDIN information, 
#perplexity information
#and retrieved rag information
async def create_prompt(sales_pitch_request : pitch_generation_request, source_selection_ids : list[int] | None=None):

    documents_embed_str = await vector_search_relevant_docs(sales_pitch_request, source_selection_ids)    

    prompt = f"""
    Create a sales pitch for a company named {sales_pitch_request.company_name}. 
    The product that needs to be pitched is called {sales_pitch_request.product_name}.
    Here is some information about the product that needs to be pitched: {sales_pitch_request.product_description}.

    From a RAG system, we retrieved some text chunks from various documents. Here is the information that was retrieved:
    {documents_embed_str}

    Use ONLY the relevant information returned by the mentioned RAG system. Feel free to leave out information that is not related.
    When you use a document that is returned from the RAG system, cite the source TITLE NOT the document number.

    Discuss specifically how this product beats out other products on the market.

    DO NOT HALLUCINATE and DO NOT makeup information likes sale codes. 
    """ 

    return prompt