# [Directive Name]

## Goal
A clear, concise statement of what this directive achieves.

## Inputs
- List required inputs (e.g., specific URLs, file paths, user queries).
- **Format:** JSON, CSV, or raw text as appropriate.

## Tools / Scripts
- List the tools or scripts (`execution/*.py`) authorized for this directive.
- If a tool doesn't exist, check `execution/` first before creating a new one.

## Execution Steps
1.  **Step 1:** Describe the action.
    - Expected output: ...
    - Generic error handling: ...
2.  **Step 2:** ...

## Edge Cases & Error Handling
- What if the input is missing?
- What if the API fails?
- Specific retries or fallbacks.

## Output
- Define the final deliverable format and location.
- **Example:** `outputs/report.json`
