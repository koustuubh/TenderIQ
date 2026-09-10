from typing import Iterable


COMPLIANT = "COMPLIANT"
NEEDS_REVIEW = "NEEDS_REVIEW"
NON_COMPLIANT = "NON_COMPLIANT"
MISSING = "MISSING"


def calculate_compliance_score(statuses: Iterable[str]) -> float:
    """
    Calculate a transparent compliance score from clause statuses.

    Scoring:
        COMPLIANT       = 1.0
        NEEDS_REVIEW    = 0.5
        NON_COMPLIANT   = 0.0
        MISSING         = 0.0
    """

    statuses = list(statuses)

    if not statuses:
        return 0.0

    points = 0.0

    for status in statuses:
        if status == COMPLIANT:
            points += 1.0
        elif status == NEEDS_REVIEW:
            points += 0.5

    return round((points / len(statuses)) * 100, 2)


def get_risk_level(
    score: float,
    failed: int,
    missing: int,
    review_needed: int,
) -> str:
    """
    Determine bidder risk level.

    High:
        - Any failed requirement
        - Two or more missing requirements
        - Score below 60

    Medium:
        - Any requirement needs review
        - Score below 85

    Low:
        - Otherwise
    """

    if failed > 0:
        return "High"

    if missing >= 2:
        return "High"

    if score < 60:
        return "High"

    if review_needed > 0:
        return "Medium"

    if score < 85:
        return "Medium"

    return "Low"