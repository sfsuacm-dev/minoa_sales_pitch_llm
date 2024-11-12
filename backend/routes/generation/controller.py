from fastapi import APIRouter
import requests
import json
from .model import pitch_generation_request, pitch_generation_response
from .services import *
router = APIRouter(
    prefix="/generation"
)

@router.post("/generate_sales_pitch")
async def generate_pitch(user_info : pitch_generation_request) -> pitch_generation_response:
    prompt = create_prompt(user_info)
    
    llm_response = call_llm(prompt)
    sales_pitch = llm_response["message"]["content"]

    return {"generated_sales_pitch" : sales_pitch}


