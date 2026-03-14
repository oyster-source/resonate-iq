import argparse
import sys
import json
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')
load_dotenv()

def generate_email(lead_data: Dict[str, Any]) -> Dict[str, str]:
    """
    Generate an email draft using Gemini, OpenAI, or Mock data.
    """
    google_key = os.getenv('GOOGLE_API_KEY')
    openai_key = os.getenv('OPENAI_API_KEY')

    if google_key:
        return generate_with_gemini(lead_data, google_key)
    elif openai_key:
        return generate_with_openai(lead_data, openai_key)
    else:
        print("WARNING: No LLM API key found (GOOGLE_API_KEY or OPENAI_API_KEY). Returning mock data.", file=sys.stderr)
        return get_mock_email(lead_data)

def generate_with_gemini(lead_data: Dict[str, Any], api_key: str) -> Dict[str, str]:
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = create_prompt(lead_data)
        response = model.generate_content(prompt)
        return parse_llm_response(response.text)
    except Exception as e:
        print(f"ERROR: Gemini generation failed: {e}", file=sys.stderr)
        return get_mock_email(lead_data)

def generate_with_openai(lead_data: Dict[str, Any], api_key: str) -> Dict[str, str]:
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        prompt = create_prompt(lead_data)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"ERROR: OpenAI generation failed: {e}", file=sys.stderr)
        return get_mock_email(lead_data)

def create_prompt(lead_data: Dict[str, Any]) -> str:
    return f"""
    You are a world-class B2B copywriter. Write a personalized cold email to the following lead.
    
    Lead Data:
    {json.dumps(lead_data, indent=2)}
    
    Requirements:
    - Tone: Professional, concise, intriguing.
    - Structure: Subject line and Body.
    - Output Format: JSON with keys "subject" and "body".
    - Do not include explanations, just the JSON.
    """

def parse_llm_response(text: str) -> Dict[str, str]:
    # Basic cleanup to extract JSON if markdown fences are used
    text = text.strip()
    if text.startswith('```json'):
        text = text[7:]
    if text.endswith('```'):
        text = text[:-3]
    try:
        return json.loads(text)
    except:
        return {
            "subject": "Error parsing response",
            "body": text
        }

def get_mock_email(lead_data: Dict[str, Any]) -> Dict[str, str]:
    name = lead_data.get('first_name', 'there')
    company = lead_data.get('company', 'your company')
    
    return {
        "subject": f"Question about {company}",
        "body": f"Hi {name},\n\nI noticed {company} is doing strict work in the industry. I'd love to chat about how we can help you scale.\n\nBest,\n[Your Name]"
    }

def main():
    parser = argparse.ArgumentParser(description='Generate personalized email.')
    parser.add_argument('--lead_json', help='JSON string of lead data')
    parser.add_argument('--lead_file', help='Path to JSON file containing lead data')
    
    args = parser.parse_args()
    
    if not args.lead_json and not args.lead_file:
        print("ERROR: Either --lead_json or --lead_file is required.", file=sys.stderr)
        sys.exit(1)

    try:
        if args.lead_file:
            with open(args.lead_file, 'r', encoding='utf-8') as f:
                lead_data = json.load(f)
        else:
            lead_data = json.loads(args.lead_json)
    except Exception as e:
        print(f"ERROR: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    result = generate_email(lead_data)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
