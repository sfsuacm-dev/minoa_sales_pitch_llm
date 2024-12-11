from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Dict, Optional, Generator, Union
import os
import textwrap

load_dotenv()

# Will keep this file for testing purposes—I think it's better to generate perplexity response directly in generation folder

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
        model: str = "llama-3.1-sonar-small-128k-online",
        max_tokens: Optional[int] = None,
        temperature: float = 0.2,
        top_p: float = 0.9,
        frequency_penalty: float = 1.0,
        stream: bool = False,
        search_recency_filter: Optional[str] = None
    ) -> Union[dict, Generator]:
        """Get completion from Perplexity AI"""
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

def format_output(text: str) -> str:
    """Format the output for better readability"""
    lines = text.split('\n')
    formatted_lines = []
    for line in lines:
        if line.strip().startswith('-'):
            formatted_lines.append(line)
        else:
            wrapped = textwrap.wrap(line, width=80, initial_indent='  ', subsequent_indent='    ')
            formatted_lines.extend(wrapped)
    return '\n'.join(formatted_lines)

def handle_private_investigation():
    """Handle private investigation request"""
    client = PerplexityClient()
    print("\nPlease provide the subject of your investigation (person, place, event, etc.):")
    subject = input("Subject: ").strip()
    print("\nPlease provide any additional context or specific areas of interest:")
    context = input("Context: ").strip()
    
    prompt = f"""As a highly skilled investigator, I need you to conduct a comprehensive investigation on the following subject:

Subject: {subject}
Additional Context: {context}

Please provide an extensive report with all available information you can find. Be thorough and creative in your research, exploring all possible angles and sources. Organize the information in a clear and structured manner, using bullet points for easy readability. Include, but don't limit yourself to, the following types of information:

- Basic facts and background information
- Historical context and development
- Key individuals or entities involved
- Significant events or milestones
- Current status or recent developments
- Controversies or debates surrounding the subject
- Impact on society, industry, or relevant fields
- Future projections or potential developments
- Any other relevant or interesting information

For each piece of information, provide the source where you found it. Ensure the information is factual and from reliable sources. If you cannot find information for a particular aspect, state that it's not available or requires further investigation.

Be objective in your reporting and avoid speculation. If there are conflicting reports or opinions, present them fairly. Your goal is to provide a comprehensive, fact-based overview of the subject."""
    
    messages = [
        client.create_message("system", "You are a highly skilled and meticulous investigator. Provide detailed, factual information organized clearly with sources for each piece of information."),
        client.create_message("user", prompt)
    ]
    
    try:
        response = client.get_completion(messages, stream=False)
        
        investigation_report = response.choices[0].message.content
        formatted_report = format_output(investigation_report)
        
        os.makedirs('outputs', exist_ok=True)
        with open('outputs/investigation_report.txt', 'w') as f:
            f.write(formatted_report)
        
        print("\nInvestigation report generated and saved!")
        print(f"Report saved at: {os.path.abspath('outputs/investigation_report.txt')}")
        print("\nHere's the report:\n")
        print(formatted_report)
        
    except Exception as e:
        print(f"\nError: {str(e)}\n")

def run_interactive_chat():
    """Run an interactive chat session with Perplexity AI"""
    client = PerplexityClient()
    messages = [
        client.create_message("system", 
            "You are a helpful AI assistant. Provide clear and comprehensive responses. Always cite your sources when possible.")
    ]
    
    print("\nWelcome to the AI Investigation Assistant!")
    print("Type 'investigate' to start a new investigation.")
    print("Type 'quit' or 'exit' to end the conversation.\n")
    
    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ['quit', 'exit']:
            print("\nGoodbye!\n")
            break
        
        if user_input.lower() == 'investigate':
            handle_private_investigation()
            continue
            
        messages.append(client.create_message("user", user_input))
        
        try:
            response_text = ""
            response_stream = client.get_completion(messages, stream=True)
            
            print("\nAI: ", end='', flush=True)
            for chunk in response_stream:
                if chunk.choices[0].delta.content is not None:
                    content_chunk = chunk.choices[0].delta.content
                    print(content_chunk, end='', flush=True)
                    response_text += content_chunk
            
            print("\n")
            messages.append(client.create_message("assistant", response_text))
            
        except Exception as e:
            print(f"\nError: {str(e)}\n")

if __name__ == "__main__":
    run_interactive_chat()