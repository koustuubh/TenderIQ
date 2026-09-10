import json
import os
from typing import Any, Dict

from google import genai


class GeminiService:
    """
    Gemini-powered reasoning service for TenderIQ.

    Gemini is used for:
    - Explaining ambiguous evidence
    - Identifying inconsistencies
    - Providing additional review context

    Gemini does NOT:
    - Replace deterministic compliance rules
    - Make the final procurement decision
    """

    DEFAULT_MODEL = "gemini-3.6-flash"

    RESPONSE_SCHEMA = {
        "type": "object",
        "properties": {
            "assessment": {
                "type": "string",
                "enum": [
                    "CLEAR",
                    "AMBIGUOUS",
                    "INCONSISTENT",
                ],
            },
            "explanation": {
                "type": "string",
            },
            "risk_flag": {
                "type": "string",
                "enum": [
                    "NONE",
                    "LOW",
                    "MEDIUM",
                    "HIGH",
                ],
            },
            "review_reason": {
                "type": "string",
            },
        },
        "required": [
            "assessment",
            "explanation",
            "risk_flag",
            "review_reason",
        ],
    }

    def __init__(self, model: str = DEFAULT_MODEL) -> None:
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key or api_key == "YOUR_API_KEY":
            raise RuntimeError(
                "GEMINI_API_KEY is not configured."
            )

        self.client = genai.Client(api_key=api_key)
        self.model = model

    def analyze_compliance_evidence(
        self,
        requirement: Dict[str, Any],
        evidence: Dict[str, Any],
        rule_status: str,
        rule_reasoning: str,
    ) -> Dict[str, Any]:
        """
        Analyze compliance evidence using Gemini.

        The deterministic rule result remains authoritative.
        Gemini only provides supporting analysis.
        """

        prompt = f"""
You are an AI assistant supporting TenderIQ, a government
procurement bid-compliance verification system.

The deterministic compliance engine has already evaluated
the requirement.

IMPORTANT:
- Do not override the deterministic rule result.
- Do not make a final procurement qualification decision.
- Do not invent information.
- Analyze only the supplied requirement and evidence.

Tender requirement:
{json.dumps(requirement, indent=2, default=str)}

Bidder evidence:
{json.dumps(evidence, indent=2, default=str)}

Deterministic rule status:
{rule_status}

Deterministic rule reasoning:
{rule_reasoning}

Analyze the evidence.

Classification:
- CLEAR: evidence clearly supports the requirement.
- AMBIGUOUS: evidence is incomplete or unclear.
- INCONSISTENT: supplied information conflicts.

Return a JSON object containing:
- assessment
- explanation
- risk_flag
- review_reason

The procurement officer makes the final decision.
"""

        interaction = self.client.interactions.create(
            model=self.model,
            input=prompt,
            response_format=[
                {
                    "type": "text",
                    "mime_type": "application/json",
                    "schema": self.RESPONSE_SCHEMA,
                }
            ],
        )

        output = interaction.output_text

        if not output:
            raise RuntimeError(
                "Gemini returned an empty response."
            )

        try:
            return json.loads(output)
        except json.JSONDecodeError as exc:
            raise RuntimeError(
                f"Gemini returned invalid JSON: {output}"
            ) from exc