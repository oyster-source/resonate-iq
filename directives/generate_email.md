# Generate Email Directive

## Goal
Generate a personalized cold email draft for a lead based on their enriched data.

## Inputs
- `lead_json` (string): JSON string containing lead details (name, company, industry, etc.).
- OR `lead_file` (string): Path to a JSON file containing lead details.

## Tools / Scripts
- `execution/generate_email.py`

## Execution Steps
1.  **Parse Input**: Read the lead data from the JSON string or file.
2.  **Generate Output**: Run `python execution/generate_email.py --lead_json '<json_string>'`.
3.  **Parse Output**: The script returns a JSON object with `subject` and `body`.
4.  **Handle Errors**:
    - If the LLM API key is missing, the script returns a mock email for testing.
    - If the API fails, log the error.

## Output
- **Format**: JSON
- **Example**:
    ```json
    {
      "subject": "Quick question about [Company]",
      "body": "Hi [Name],\n\nI saw that [Company] is making waves in [Industry]..."
    }
    ```
