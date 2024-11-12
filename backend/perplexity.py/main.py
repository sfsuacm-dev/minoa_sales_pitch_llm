from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Dict, Optional, Generator, Union
import os

load_dotenv()

class PerplexityClient:
    """Client for interacting with Perplexity AI API"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("PERPLEXITY_API_KEY")
        self.client = OpenAI(
            api_key=self.api_key,
            base_url="https://api.perplexity.ai"
        )

    def get_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "llama-3.1-sonar-large-128k-online",
        max_tokens: Optional[int] = None,
        temperature: float = 0.2,
        top_p: float = 0.9,
        frequency_penalty: float = 1.0,
        stream: bool = False,
        search_recency_filter: Optional[str] = None
    ) -> Union[dict, Generator]:
        """
        Get completion from Perplexity AI
        
        Args:
            messages: List of message dictionaries
            model: Model to use
            max_tokens: Maximum tokens to generate
            temperature: Randomness (0-2)
            top_p: Nucleus sampling threshold
            frequency_penalty: Repetition penalty
            stream: Whether to stream the response
            search_recency_filter: Time filter for search results
        """
        params = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "top_p": top_p,
            "frequency_penalty": frequency_penalty,
            "stream": stream
        }
        
        if max_tokens:
            params["max_tokens"] = max_tokens
            
        if search_recency_filter:
            params["search_recency_filter"] = search_recency_filter

        return self.client.chat.completions.create(**params)

    @staticmethod
    def create_message(role: str, content: str) -> Dict[str, str]:
        """Create a properly formatted message dictionary"""
        return {"role": role, "content": content}

def format_citations(citations: List[str]) -> str:
    """Format citations into a readable string"""
    if not citations:
        return ""
    return "\nSources:\n" + "\n".join(f"- {cite}" for cite in citations)

def run_interactive_chat():
    """Run an interactive chat session with Perplexity AI"""
    client = PerplexityClient()
    messages = [
        client.create_message("system", 
            "You are a helpful AI assistant. Keep responses concise and clear. Always cite your sources.")
    ]
    
    print("\nWelcome to Perplexity AI Chat!")
    print("Type 'quit' or 'exit' to end the conversation.\n")
    
    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ['quit', 'exit']:
            print("\nGoodbye!\n")
            break
            
        messages.append(client.create_message("user", user_input))
        print("\nAI: ", end='', flush=True)
        response_text = ""
        citations = []
        
        try:
            for chunk in client.get_completion(messages, stream=True):
                if hasattr(chunk.choices[0].delta, 'content'):
                    content = chunk.choices[0].delta.content
                    if content:
                        print(content, end='', flush=True)
                        response_text += content
                
                # Extract citations if available
                if hasattr(chunk, 'citations'):
                    citations = chunk.citations

            # Print citations after response
            if citations:
                print(format_citations(citations))
            print('\n')
            
            messages.append(client.create_message("assistant", response_text))
            
        except Exception as e:
            print(f"\nError: {str(e)}\n")

if __name__ == "__main__":
    run_interactive_chat()