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
    pitch_response = await driver(user_info)


    return pitch_response
