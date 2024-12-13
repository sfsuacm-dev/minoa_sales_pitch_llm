from .model import pitch_generation_request, pitch_generation_response
import requests
import json
from ...dependencies.firebase_interface import *
from openai import OpenAI
from dotenv import load_dotenv
import os
from groq import Groq

firebase_worker = FirestoreWorker()
load_dotenv()


def call_paas_llm(prompt : str):
    llama_key = os.getenv("LLAMA_API_KEY")

    client = Groq(
        api_key=llama_key
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role" : "user",
                "content" : f"{prompt}"
            }
        ],
        model="llama-3.3-70b-versatile",
        stream=False
    )

    # print(chat_completion.choices[0].message.content)

    return chat_completion.choices[0].message.content


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
    rag_prompt = f"""
    Company name: {sales_information.company_name},
    Product name: {sales_information.product_name},
    Product description: {sales_information.product_description}
    """
    related_documents = firebase_worker.search_rag_similar_documents(rag_prompt, source_selection_ids)

    #process relevant docs into string
    retrieved_sources_str = ""

    source_names = set()

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

        source_names.add(document_title)
             
        retrieved_sources_str += combined_string
    
    return retrieved_sources_str, source_names

async def get_perplexity_response(prompt: str):
    """Get response from Perplexity AI for investigating a person"""
    client = OpenAI(
        api_key=os.getenv("PERPLEXITY_API_KEY"),
        base_url="https://api.perplexity.ai"
    )
    
    investigative_prompt = f"""You are a customer insights analyst collecting information about the following person or company:

{prompt}

Please provide a comprehensive summary covering all available information about this entity. Include:

- Background and basic information
- History and trajectory
- Public presence and reputation
- Relationships and associations to other entities
- Recent activities or developments
- Media coverage or public statements
- Social media presence and public profiles
- Any other relevant findings about the entity

For each piece of information discovered, please cite your sources. If certain information cannot be verified or found, indicate this clearly. Maintain objectivity and focus on factual, verifiable information. If there are conflicting reports about the person, present all perspectives fairly.
Write this content in a summarized paragraph form.
"""
    
    messages = [
        {"role": "system", "content": "You are a thorough and meticulous private investigator who specializes in background research on individuals. Provide detailed, factual information with sources while maintaining professional ethics and respect for privacy."},
        {"role": "user", "content": investigative_prompt}
    ]
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-sonar-small-128k-online",
            messages=messages,
            temperature=0.2,
            top_p=0.9,
            frequency_penalty=1.0,
            stream=False
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in Perplexity API call: {str(e)}")
        return ""


#should be a mix of the LINKEDIN information, 
#perplexity information
#and retrieved rag information
async def driver(sales_pitch_request : pitch_generation_request, source_selection_ids : list[int] | None=None):

    documents_embed_str, document_names = await vector_search_relevant_docs(sales_pitch_request, source_selection_ids)    

    perplexity_pre_prompt = f"""
    The person to investigate is named {sales_pitch_request.client_name}. Some basic info about them is {sales_pitch_request.client_additional_info}
    """
    if sales_pitch_request.client_name:
        perplexity_response = await get_perplexity_response(perplexity_pre_prompt)
        print("-----------------------------------------------")
        print(f"{perplexity_response}")
        print("-----------------------------------------------\n")

    llama_prompt = f"""
        You are a senior marketing associate.
        Create a sales pitch for a company named {sales_pitch_request.company_name}. 
        The product that needs to be pitched is called {sales_pitch_request.product_name}.
        Here is some information about the product that needs to be pitched: {sales_pitch_request.product_description}.

        Here are some documents that may help in the creation of a sales pitch:
        {documents_embed_str}

        Use ONLY the relevant information in the mentioned documents. Feel free to leave out information that is not related.
        When you use a document, cite the source TITLE NOT the document number. Give DIRECT quotes from the mentioned documents. Documents with statistics are better.
        When using a direct quote, put the citation directly after the quote.

        Discuss specifically how this product beats out other products on the market and why this product in general should be chosen.

        The structure of the sales pitch should be as so:
        1. Introducing the problem that the product potentially solves
        2. Introducing the product itself and its features
        3. Talk about how this product beats out other products on the market
        4. Talk about in general why this product should be chosen

        DO NOT HALLUCINATE and DO NOT makeup information likes sale codes. 
        ONLY respond with the sales pitch. Nothing more.
        """


    if perplexity_response:
        llama_prompt = f"""
        You are a senior marketing associate.
        Create a sales pitch for a company named {sales_pitch_request.company_name}. 
        The product that needs to be pitched is called {sales_pitch_request.product_name}.
        Here is some information about the product that needs to be pitched: {sales_pitch_request.product_description}.

        Here is some information about the client you will be making the sales pitch for:
        {perplexity_response}

        Tailor the sales pitch to the client's background based on this information.

        Here are some documents that may help in the creation of a sales pitch:
        {documents_embed_str}

        Use ONLY the relevant information in the mentioned documents. Feel free to leave out information that is not related.
        When you use a document, cite the source TITLE NOT the document number. Give DIRECT quotes from the mentioned documents. Documents with statistics are better.
        When using information from the documents, put the citation directly after that information block. 
        For example if I am using the fact that "Tinder is the leading dating app" (Statista Report on Dating Apps in 2023) 

        Discuss specifically how this product beats out other products on the market and why this product in general should be chosen.

        The structure of the sales pitch should be as so:
        1. Introducing the problem that the product potentially solves
        2. Introducing the product itself and its features
        3. Talk about how this product beats out other products on the market
        4. Talk about in general why this product should be chosen

        DO NOT HALLUCINATE and DO NOT makeup information likes sale codes. 
        ONLY respond with the sales pitch. Nothing more.
        """
    
    print(llama_prompt)

    sales_pitch_text = call_paas_llm(llama_prompt)

    return pitch_generation_response(
        generated_sales_pitch=sales_pitch_text,
        name_documents_used=list(document_names)
    )