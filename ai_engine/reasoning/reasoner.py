from typing import Any, Dict, Optional


COMPLIANT = "COMPLIANT"
NON_COMPLIANT = "NON_COMPLIANT"
NEEDS_REVIEW = "NEEDS_REVIEW"
MISSING = "MISSING"


class ComplianceReasoner:
    """
    Generates human-readable explanations for compliance results.

    This layer explains the result produced by deterministic rules.
    It does not make the final procurement decision.
    """

    def explain(
        self,
        status: str,
        requirement_title: str,
        reasoning: str,
        confidence: float = 0.0,
        evidence: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Generate a concise explanation for a compliance result.
        """

        confidence_percent = round(
            max(0.0, min(1.0, confidence)) * 100
        )

        if status == COMPLIANT:
            explanation = (
                f"{requirement_title} is compliant. "
                f"{reasoning}"
            )

        elif status == NON_COMPLIANT:
            explanation = (
                f"{requirement_title} is non-compliant. "
                f"{reasoning}"
            )

        elif status == MISSING:
            explanation = (
                f"{requirement_title} is missing. "
                f"{reasoning}"
            )

        elif status == NEEDS_REVIEW:
            explanation = (
                f"{requirement_title} requires officer review. "
                f"{reasoning}"
            )

        else:
            explanation = (
                f"{requirement_title} has an unrecognized compliance status. "
                f"Officer review is required."
            )

        if confidence_percent > 0:
            explanation += f" Evidence confidence: {confidence_percent}%."

        if evidence:
            document_name = evidence.get("document_name")

            if document_name:
                explanation += f" Source document: {document_name}."

        return explanation


def explain_result(
    status: str,
    requirement_title: str,
    reasoning: str,
    confidence: float = 0.0,
    evidence: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Convenience function for backend/integration code.
    """

    reasoner = ComplianceReasoner()

    return reasoner.explain(
        status=status,
        requirement_title=requirement_title,
        reasoning=reasoning,
        confidence=confidence,
        evidence=evidence,
    )