import argparse
import sys
import json
import os
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local') # Prioritize local env
load_dotenv()

def enrich_lead(domain: Optional[str] = None, linkedin_url: Optional[str] = None) -> Dict[str, Any]:
    """
    Enrich a lead using Apify or fallback to mock data.
    """
    api_token = os.getenv('APIFY_API_TOKEN')

    if not api_token:
        print("WARNING: APIFY_API_TOKEN not found. Returning mock data.", file=sys.stderr)
        return get_mock_data(domain, linkedin_url)

    # TODO: Implement actual Apify call here
    # For now, we'll use a placeholder logic that *would* call Apify
    # In a real scenario, you'd use the Apify Client or requests to call a specific Actor
    try:
        # Example: Calling a hypothetical "company-enrichment" actor
        # output = call_apify_actor(api_token, domain, linkedin_url)
        # return output
        
        # valid token present, simulating a successfull API call response for now 
        # to confirm integration works. 
        # We can implement specific actor logic next (e.g. Google Maps Scraper or LinkedIn Scraper)
        print(f"INFO: API Token found. Simulating enrichment for {domain or linkedin_url}", file=sys.stderr)
        return get_mock_data(domain, linkedin_url, is_mock=False)
        
    except Exception as e:
        print(f"ERROR: Apify call failed: {e}", file=sys.stderr)
        return {"error": str(e)}

def get_mock_data(domain: Optional[str], linkedin_url: Optional[str], is_mock: bool = True) -> Dict[str, Any]:
    """
    Returns mock data for testing purposes.
    """
    base_name = "Example Company"
    if domain:
        base_name = domain.split('.')[0].capitalize()
    
    return {
        "company_name": base_name,
        "industry": "Technology",
        "employee_count": "100-500",
        "revenue": "$5M-$10M",
        "linkedin_url": linkedin_url or f"https://www.linkedin.com/company/{base_name.lower()}",
        "website": "https://" + (domain or f"{base_name.lower()}.com"),
        "source": "mock" if is_mock else "apify_simulation"
    }

def main():
    parser = argparse.ArgumentParser(description='Enrich lead data.')
    parser.add_argument('--domain', help='Company domain')
    parser.add_argument('--linkedin_url', help='LinkedIn URL')
    
    args = parser.parse_args()
    
    if not args.domain and not args.linkedin_url:
        print("ERROR: Either --domain or --linkedin_url is required.", file=sys.stderr)
        sys.exit(1)

    result = enrich_lead(args.domain, args.linkedin_url)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
