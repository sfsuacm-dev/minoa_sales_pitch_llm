from fastapi import APIRouter
import requests
import json
from .model import pitch_generation_request, pitch_generation_response

router = APIRouter(
    prefix="/generation"
)

@router.post("/generate_sales_pitch")
def generate_pitch(user_info : pitch_generation_request) -> pitch_generation_response:
    r = requests.post(
       "http://127.0.0.1:11434/api/chat",
        json={"model" : "llama3.2", "messages" : [{"role" : "user", "content" : "generate a sales pitch for a health tech company specializing in automating the RCM process", "stream" : True}]},
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
