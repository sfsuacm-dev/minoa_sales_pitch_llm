from .model import pitch_generation_request
import requests
import json

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
async def vector_search_relevant_docs(source_selection_ids : list[int]):
    pass

#needs to return linkedin info 
async def get_linkedin_info(linkedin_link : str):
    pass

async def get_perplexity_response(prompt : str):
    pass

#should be a mix of the LINKEDIN information, 
#perplexity information
#and retrieved rag information
def create_prompt(pitch_request : pitch_generation_request=None, linkedin_info : dict=None, rag_context : list[str]=None, perplexity_info : dict=None):
    prompt = f"Create a sales pitch for a \
    company named {pitch_request.company_name}. The product name is {pitch_request.product_name}. \
    A description of the product is {pitch_request.product_description}"

    return prompt