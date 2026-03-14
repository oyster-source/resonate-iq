
import argparse
import sys
import json
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')
load_dotenv()

# Check for API keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def score_leads(lead_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Scores a lead using an LLM (Gemini or OpenAI).
    """
    
    # Construct Prompt
    import pathlib
    directive_path = pathlib.Path(__file__).parent.parent / 'directives' / 'score_lead.md'
    
    try:
        with open(directive_path, 'r', encoding='utf-8') as f:
            directive_content = f.read()
    except Exception as e:
         # Fallback directive if file missing
         directive_content = "You are a lead scorer. Score this lead 0-100 for a B2B SaaS sales tool."

    prompt = f"""
{directive_content}

---
LEAD DATA:
{json.dumps(lead_data, indent=2)}
---

Recall the output format: JSON with 'score' (int) and 'reason' (string).
JSON:
"""

    # --- Call LLM ---
    response_text = ""
    
    if GOOGLE_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GOOGLE_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(prompt)
            response_text = response.text
        except Exception as e:
            return {"error": f"Gemini Error: {str(e)}", "score": 0, "reason": "AI Error"}

    elif OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": directive_content},
                    {"role": "user", "content": f"Lead Data: {json.dumps(lead_data)}"}
                ],
                response_format={"type": "json_object"}
            )
            response_text = response.choices[0].message.content
        except Exception as e:
             return {"error": f"OpenAI Error: {str(e)}", "score": 0, "reason": "AI Error"}
    else:
        # MOCK FALLBACK
        # Simple heuristic if no API key
        score = 50
        reason = "Mock Score (No API Key). Title contains 'Sales'?"
        
        title = lead_data.get('enrichment_data', {}).get('title', '') or lead_data.get('title', '')
        if 'sales' in title.lower() or 'founder' in title.lower():
            score = 85
            reason = "Mock: Title indicates decision maker."
            
        return {"score": score, "reason": reason}

    # --- Parse JSON ---
    try:
        # Clean markdown
        clean_text = response_text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)
    except Exception as e:
        return {"score": 0, "reason": "Failed to parse AI response", "raw": response_text}

def main():
    parser = argparse.ArgumentParser(description='Score a lead.')
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

    result = score_leads(lead_data)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
