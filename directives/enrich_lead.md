# Enrich Lead Directive

## Goal
Enrich a lead using their domain or LinkedIn URL to gather company details like industry, employee count, and revenue.

## Inputs
- `domain` (string): The company domain (e.g., `openai.com`).
- `linkedin_url` (string, optional): The company's LinkedIn URL (e.g., `https://www.linkedin.com/company/openai`).

## Tools / Scripts
- `execution/enrich_lead.py`

## Execution Steps
1.  **Validate Input**: Ensure at least one of `domain` or `linkedin_url` is provided.
2.  **Execute Enrichment**: Run `python execution/enrich_lead.py --domain <domain> --linkedin_url <linkedin_url>`.
3.  **Parse Output**: The script returns a JSON object with the enriched data.
4.  **Handle Errors**:
    - If the script fails (non-zero exit code), log the error and return a failure status.
    - If the API key is missing, the script will return mock data (this is expected behavior for testing).

## Output
- **Format**: JSON
- **Example**:
    ```json
    {
      "company_name": "OpenAI",
      "industry": "Artificial Intelligence",
      "employee_count": "501-1000",
      "revenue": "$10M-$50M",
      "linkedin_url": "https://www.linkedin.com/company/openai",
      "website": "https://openai.com"
    }
    ```
