import re
from typing import Any, Dict, Optional, Tuple


COMPLIANT = "COMPLIANT"
NON_COMPLIANT = "NON_COMPLIANT"
NEEDS_REVIEW = "NEEDS_REVIEW"
MISSING = "MISSING"


def _is_empty(value: Any) -> bool:
    return value is None or str(value).strip() == ""


def _to_float(value: Any) -> Optional[float]:
    if value is None:
        return None

    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).replace(",", "").replace("₹", "").strip()

    # Handle Crore/Lakh values.
    crore_match = re.search(r"([\d.]+)\s*(?:crore|cr)", text, re.I)
    if crore_match:
        return float(crore_match.group(1)) * 10_000_000

    lakh_match = re.search(r"([\d.]+)\s*(?:lakh|lac)", text, re.I)
    if lakh_match:
        return float(lakh_match.group(1)) * 100_000

    number_match = re.search(r"-?[\d.]+", text)
    if number_match:
        return float(number_match.group())

    return None


def validate_gst(value: Any) -> Tuple[str, str]:
    if _is_empty(value):
        return MISSING, "GST registration evidence was not found."

    gstin = str(value).strip().upper()

    # Basic GSTIN structural validation.
    pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$"

    if re.match(pattern, gstin):
        return (
            COMPLIANT,
            "The extracted GSTIN matches the expected GST registration format."
        )

    return (
        NON_COMPLIANT,
        "The extracted GSTIN does not match the expected GST registration format."
    )


def validate_pan(value: Any) -> Tuple[str, str]:
    if _is_empty(value):
        return MISSING, "PAN evidence was not found."

    pan = str(value).strip().upper()

    if re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]$", pan):
        return (
            COMPLIANT,
            "The extracted PAN matches the expected PAN format."
        )

    return (
        NON_COMPLIANT,
        "The extracted PAN does not match the expected PAN format."
    )


def validate_turnover(
    value: Any,
    minimum_value: Optional[float],
) -> Tuple[str, str]:
    if _is_empty(value):
        return MISSING, "Turnover evidence was not found."

    actual = _to_float(value)

    if actual is None:
        return (
            NEEDS_REVIEW,
            "Turnover information was found, but the amount could not be reliably interpreted."
        )

    if minimum_value is None:
        return (
            NEEDS_REVIEW,
            "Turnover was extracted, but no minimum tender threshold was provided."
        )

    if actual >= minimum_value:
        return (
            COMPLIANT,
            f"The bidder's turnover ({actual:,.2f}) meets the minimum requirement of "
            f"{minimum_value:,.2f}."
        )

    return (
        NON_COMPLIANT,
        f"The bidder's turnover ({actual:,.2f}) is below the minimum requirement of "
        f"{minimum_value:,.2f}."
    )


def validate_technical_experience(
    value: Any,
    minimum_value: Optional[float],
) -> Tuple[str, str]:
    if _is_empty(value):
        return MISSING, "Technical experience evidence was not found."

    actual = _to_float(value)

    if actual is None:
        return (
            NEEDS_REVIEW,
            "Technical experience evidence exists but could not be quantitatively evaluated."
        )

    if minimum_value is None:
        return (
            NEEDS_REVIEW,
            "Technical experience was extracted, but no minimum requirement was provided."
        )

    if actual >= minimum_value:
        return (
            COMPLIANT,
            f"The bidder has {actual:g} qualifying experience units, meeting the "
            f"minimum requirement of {minimum_value:g}."
        )

    return (
        NON_COMPLIANT,
        f"The bidder has {actual:g} qualifying experience units, below the "
        f"minimum requirement of {minimum_value:g}."
    )


def validate_boolean_requirement(
    value: Any,
    requirement_name: str,
) -> Tuple[str, str]:
    if _is_empty(value):
        return MISSING, f"{requirement_name} evidence was not found."

    if isinstance(value, bool):
        if value:
            return COMPLIANT, f"{requirement_name} requirement is satisfied."
        return NON_COMPLIANT, f"{requirement_name} requirement is not satisfied."

    normalized = str(value).strip().lower()

    positive = {
        "yes",
        "true",
        "valid",
        "authorized",
        "authorised",
        "compliant",
        "present",
        "available",
        "not_blacklisted",
        "not debarred",
    }

    negative = {
        "no",
        "false",
        "invalid",
        "unauthorized",
        "unauthorised",
        "non_compliant",
        "blacklisted",
        "debarred",
        "expired",
    }

    if normalized in positive:
        return COMPLIANT, f"{requirement_name} requirement is satisfied."

    if normalized in negative:
        return NON_COMPLIANT, f"{requirement_name} requirement is not satisfied."

    return (
        NEEDS_REVIEW,
        f"{requirement_name} evidence was found but requires officer review."
    )


def validate_local_content(
    value: Any,
    minimum_value: Optional[float],
) -> Tuple[str, str]:
    if _is_empty(value):
        return MISSING, "Local content evidence was not found."

    actual = _to_float(value)

    if actual is None:
        return (
            NEEDS_REVIEW,
            "Local content information was found but could not be interpreted."
        )

    if minimum_value is None:
        return (
            NEEDS_REVIEW,
            "Local content was extracted but no minimum percentage was provided."
        )

    if actual >= minimum_value:
        return (
            COMPLIANT,
            f"Local content of {actual:g}% meets the minimum requirement of "
            f"{minimum_value:g}%."
        )

    return (
        NON_COMPLIANT,
        f"Local content of {actual:g}% is below the minimum requirement of "
        f"{minimum_value:g}%."
    )


def validate_certification(
    value: Any,
    requirement_name: str,
) -> Tuple[str, str]:
    if _is_empty(value):
        return MISSING, f"{requirement_name} certification evidence was not found."

    if isinstance(value, dict):
        valid = value.get("valid")
        expiry = value.get("expiry_date")

        if valid is False:
            return (
                NON_COMPLIANT,
                f"The {requirement_name} certification is marked as invalid."
            )

        if valid is True:
            return (
                COMPLIANT,
                f"The {requirement_name} certification is marked as valid."
                + (f" Expiry: {expiry}." if expiry else "")
            )

    return (
        NEEDS_REVIEW,
        f"{requirement_name} certification evidence was found and requires validation."
    )


def evaluate_requirement(
    requirement_type: str,
    value: Any,
    minimum_value: Optional[float] = None,
    parameters: Optional[Dict[str, Any]] = None,
) -> Tuple[str, str]:
    """
    Central dispatcher for deterministic compliance rules.
    """

    parameters = parameters or {}
    requirement_type = requirement_type.strip().lower()

    if requirement_type == "gst":
        return validate_gst(value)

    if requirement_type == "pan":
        return validate_pan(value)

    if requirement_type in {"turnover", "annual_turnover", "average_turnover"}:
        return validate_turnover(value, minimum_value)

    if requirement_type in {
        "technical_experience",
        "experience",
        "similar_projects",
    }:
        return validate_technical_experience(value, minimum_value)

    if requirement_type == "oem_authorization":
        return validate_boolean_requirement(
            value,
            "OEM authorization",
        )

    if requirement_type in {"blacklisting", "debarment"}:
        return validate_boolean_requirement(
            value,
            "Blacklisting/debarment declaration",
        )

    if requirement_type in {"make_in_india", "gfr_144_xi"}:
        return validate_boolean_requirement(
            value,
            "Make in India / GFR 144(xi)",
        )

    if requirement_type in {"local_content", "local_content_percentage"}:
        return validate_local_content(
            value,
            minimum_value,
        )

    if requirement_type in {
        "certification",
        "iso",
        "asme",
        "safety_certification",
        "quality_certification",
    }:
        name = parameters.get(
            "certification_name",
            "Required certification",
        )

        return validate_certification(value, name)

    if requirement_type in {"bid_security", "emd"}:
        return validate_boolean_requirement(
            value,
            "Bid security / EMD",
        )

    return (
        NEEDS_REVIEW,
        f"No deterministic rule is currently registered for requirement type "
        f"'{requirement_type}'. AI/officer review is required."
    )