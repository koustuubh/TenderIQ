from __future__ import annotations

import re
from typing import Any, Dict, List, Optional


class FieldExtractor:
    """
    TenderIQ field extraction module.

    Extracts structured compliance-related fields from
    bidder documents using deterministic rules.

    This module does NOT:
    - Decide compliance.
    - Calculate risk.
    - Make procurement decisions.
    - Use an LLM.
    """

    FIELD_PATTERNS: Dict[str, List[str]] = {
        "gst_number": [
            r"\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b",
        ],

        "pan_number": [
            r"\b[A-Z]{5}\d{4}[A-Z]\b",
        ],

        "udyam_number": [
            r"\bUDYAM[-\s]?[A-Z]{2}[-\s]?\d{2}[-\s]?\d{7}\b",
        ],

        "cin_number": [
            r"\b[UL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b",
        ],

        "project_value": [
            r"(?:project|contract|work|order)\s+value"
            r"\s*(?:is|:|-)?\s*"
            r"(?:₹|rs\.?|inr)?\s*"
            r"([\d,]+(?:\.\d+)?)\s*"
            r"(crore|cr|lakh|lakhs|million)?",
        ],

        "turnover": [
            r"(?:annual|average\s+annual)?\s*turnover"
            r"\s*(?:is|:|-)?\s*"
            r"(?:₹|rs\.?|inr)?\s*"
            r"([\d,]+(?:\.\d+)?)\s*"
            r"(crore|cr|lakh|lakhs|million)?",
        ],

        "local_content_percentage": [
            r"(?:local\s+content|local\s+value\s+addition)"
            r"\s*(?:is|:|-)?\s*(\d+(?:\.\d+)?)\s*%",
        ],

        "completion_date": [
            r"(?:completion\s+date|date\s+of\s+completion)"
            r"\s*(?:is|:|-)?\s*"
            r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
        ],

        "validity_date": [
            r"(?:valid\s+(?:up\s+to|until)|validity|valid\s+till)"
            r"\s*(?:is|:|-)?\s*"
            r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
        ],

        "udin": [
            r"\bUDIN\s*[:\-]?\s*([A-Z0-9]{10,30})\b",
        ],

        "certificate_number": [
            r"(?:certificate\s+(?:no|number)|certificate\s+id)"
            r"\s*[:\-]?\s*([A-Z0-9][A-Z0-9/\-]{3,40})",
        ],
    }

    COMPANY_PATTERNS = [
        r"(?:company\s+name|name\s+of\s+company)"
        r"\s*[:\-]\s*(.*?)"
        r"(?=\s+(?:GSTIN|GST|PAN|UDYAM|CIN|"
        r"AVERAGE\s+ANNUAL\s+TURNOVER|ANNUAL\s+TURNOVER|"
        r"TURNOVER|PROJECT\s+VALUE|CONTRACT\s+VALUE|"
        r"WORK\s+VALUE|ORDER\s+VALUE|LOCAL\s+CONTENT|"
        r"LOCAL\s+VALUE\s+ADDITION|COMPLETION\s+DATE|"
        r"DATE\s+OF\s+COMPLETION|VALIDITY|VALID\s+TILL|"
        r"VALID\s+UP\s+TO|UDIN|CERTIFICATE\s+(?:NO|NUMBER|ID))"
        r"\s*[:\-]|\s*$)",

        r"(?:bidder\s+name|name\s+of\s+bidder)"
        r"\s*[:\-]\s*(.*?)"
        r"(?=\s+(?:GSTIN|GST|PAN|UDYAM|CIN|"
        r"AVERAGE\s+ANNUAL\s+TURNOVER|ANNUAL\s+TURNOVER|"
        r"TURNOVER|PROJECT\s+VALUE|CONTRACT\s+VALUE|"
        r"LOCAL\s+CONTENT|LOCAL\s+VALUE\s+ADDITION|"
        r"COMPLETION\s+DATE|DATE\s+OF\s+COMPLETION|"
        r"VALIDITY|UDIN|CERTIFICATE\s+(?:NO|NUMBER|ID))"
        r"\s*[:\-]|\s*$)",

        r"(?:legal\s+name)"
        r"\s*[:\-]\s*(.*?)"
        r"(?=\s+(?:GSTIN|GST|PAN|UDYAM|CIN|"
        r"AVERAGE\s+ANNUAL\s+TURNOVER|ANNUAL\s+TURNOVER|"
        r"TURNOVER|PROJECT\s+VALUE|CONTRACT\s+VALUE|"
        r"LOCAL\s+CONTENT|LOCAL\s+VALUE\s+ADDITION|"
        r"COMPLETION\s+DATE|DATE\s+OF\s+COMPLETION|"
        r"VALIDITY|UDIN|CERTIFICATE\s+(?:NO|NUMBER|ID))"
        r"\s*[:\-]|\s*$)",
    ]

    def __init__(self) -> None:
        pass

    @staticmethod
    def normalize_text(text: str) -> str:
        """Normalize extracted/OCR text."""

        if not text:
            return ""

        text = text.replace("\n", " ")
        text = re.sub(r"\s+", " ", text)

        return text.strip()

    @staticmethod
    def _clean_value(value: str) -> str:
        """Clean an extracted value."""

        value = value.strip()

        value = re.sub(
            r"\s+",
            " ",
            value,
        )

        return value.strip(" :,-.")

    @staticmethod
    def _convert_amount(
        value: str,
        unit: Optional[str],
    ) -> float:
        """Convert financial values into normalized numeric amounts."""

        number = float(value.replace(",", ""))

        if not unit:
            return number

        unit = unit.lower()

        if unit in {"crore", "cr"}:
            return number * 10_000_000

        if unit in {"lakh", "lakhs"}:
            return number * 100_000

        if unit == "million":
            return number * 1_000_000

        return number

    def extract_company_name(
        self,
        text: str,
    ) -> Optional[str]:
        """Extract bidder/company name."""

        normalized_text = self.normalize_text(text)

        for pattern in self.COMPANY_PATTERNS:
            match = re.search(
                pattern,
                normalized_text,
                flags=re.IGNORECASE,
            )

            if match:
                return self._clean_value(
                    match.group(1)
                )

        return None

    def extract_field(
        self,
        text: str,
        field_name: str,
    ) -> Optional[Any]:
        """Extract one known field."""

        normalized_text = self.normalize_text(text)

        patterns = self.FIELD_PATTERNS.get(
            field_name,
            [],
        )

        for pattern in patterns:
            match = re.search(
                pattern,
                normalized_text,
                flags=re.IGNORECASE,
            )

            if not match:
                continue

            if field_name in {
                "project_value",
                "turnover",
            }:
                value = match.group(1)
                unit = match.group(2)

                return {
                    "value": self._convert_amount(
                        value,
                        unit,
                    ),
                    "original_value": value,
                    "unit": unit,
                }

            if field_name == "local_content_percentage":
                return float(match.group(1))

            if field_name in {
                "gst_number",
                "pan_number",
                "udyam_number",
                "cin_number",
                "completion_date",
                "validity_date",
                "udin",
                "certificate_number",
            }:
                return self._clean_value(
                    match.group(1)
                    if match.lastindex
                    else match.group(0)
                )

            return self._clean_value(
                match.group(0)
            )

        return None

    def extract_all(
        self,
        text: str,
    ) -> Dict[str, Any]:
        """
        Extract all supported fields from a document.
        """

        normalized_text = self.normalize_text(text)

        if not normalized_text:
            return {
                "company_name": None,
                "fields": {},
            }

        fields: Dict[str, Any] = {}

        company_name = self.extract_company_name(
            normalized_text
        )

        if company_name:
            fields["company_name"] = company_name

        for field_name in self.FIELD_PATTERNS:
            value = self.extract_field(
                normalized_text,
                field_name,
            )

            if value is not None:
                fields[field_name] = value

        company_name = fields.pop(
            "company_name",
            None,
        )

        return {
            "company_name": company_name,
            "fields": fields,
        }

    def extract_from_pages(
        self,
        pages: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Extract fields from each page independently.

        Page numbers are preserved so the evidence layer can
        later point back to the exact source page.
        """

        results = []

        for page in pages:
            page_number = int(
                page.get("page_number", 0)
            )

            text = str(
                page.get("text", "")
            )

            extraction = self.extract_all(text)

            results.append(
                {
                    "page_number": page_number,
                    "company_name": extraction["company_name"],
                    "fields": extraction["fields"],
                }
            )

        return results


def extract_fields(
    text: str,
) -> Dict[str, Any]:
    """Convenience function for field extraction."""

    return FieldExtractor().extract_all(text)