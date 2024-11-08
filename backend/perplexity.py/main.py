from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
# Load the API key from the .env file
YOUR_API_KEY = os.getenv("PERPLEXITY_API_KEY")

messages = [
    {
        "role": "system",
        "content": (
            "You are an artificial intelligence assistant and you need to "
            "engage in a helpful, detailed, polite conversation with a user."
        ),
    },
    {
        "role": "user",
        "content": (
            "How many stars are in the universe?"
        ),
    },
]

client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

# # chat completion without streaming
# response = client.chat.completions.create(
#     model="llama-3.1-sonar-large-128k-online",
#     messages=messages,
#      max_tokens=1  # Limit the response to 100 tokens
# )
# print(response)

# chat completion with streaming
response_stream = client.chat.completions.create(
    model="llama-3.1-sonar-large-128k-online",
    messages=messages,
    stream=True,
     max_tokens=10  
)
for response in response_stream:
    print(response)