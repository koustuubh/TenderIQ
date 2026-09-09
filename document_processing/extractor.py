from __future__ import annotations

import re
from datetime import datetime
from typing import Any, Dict, List, Optional


class StructuredExtractor:
    """Simple deterministic extractor for common document fields."""

    @staticmethod
    def normalize_currency(value: str) -> str:
        value = value.strip().replace(",", "")
        if "₹" in value or "rs" in value.lower() or "inr" in value.lower():
            return "INR"
        return "INR"

    @staticmethod
    def parse_inr_amount(text: str) -> Optional[int]:
        match = re.search(
            r"(?:₹|Rs\.?|INR)\s*([0-9,]+(?:\.[0-9]+)?)\s*(crore|crores|lakh|lakhs|thousand|million|billion|hundred)?",
            text,
            re.IGNORECASE,
        )
        if not match:
            return None

        cleaned = match.group(1).replace(",", "")
        try:
            value = float(cleaned)
        except ValueError:
            return None

        unit = (match.group(2) or "").lower()
        multipliers = {
            "hundred": 100,
            "thousand": 1000,
            "lakh": 100000,
            "lakhs": 100000,
            "crore": 10000000,
            "crores": 10000000,
            "million": 1000000,
            "billion": 1000000000,
        }
        return int(value * multipliers.get(unit, 1))

    @staticmethod
    def parse_date(text: str) -> Optional[str]:
        for pattern in [
            r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})",
            r"(\d{1,2})[-/](\d{1,2})[-/](\d{4})",
            r"(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})",
        ]:
            match = re.search(pattern, text)
            if match:
                try:
                    if pattern.startswith(r"(\d{4})"):
                        year, month, day = match.groups()
                    elif pattern.startswith(r"(\d{1,2})[-/]"):
                        day, month, year = match.groups()
                    else:
                        day, month_name, year = match.groups()
                        month = datetime.strptime(month_name[:3], "%b").month

                    parsed = datetime.strptime(f"{year}-{int(month):02d}-{int(day):02d}", "%Y-%m-%d")
                    return parsed.strftime("%Y-%m-%d")
                except ValueError:
                    continue
        return None

    @staticmethod
    def extract_fields(text: str, document_name: str = "document.pdf", page_number: int = 1) -> Dict[str, Any]:
        normalized = text or ""
        result: Dict[str, Any] = {}

        company_match = re.search(r"([A-Z][A-Za-z0-9&.() ]{3,}(?:Pvt|Private|Ltd|Limited|LLP|LLP|Inc|Incorporated)?)",
                                  normalized)
        if company_match:
            name = company_match.group(1).strip()
            result["company_name"] = {
                "value": name,
                "page": page_number,
                "confidence": 0.85,
                "evidence_text": name,
            }

        amount = StructuredExtractor.parse_inr_amount(normalized)
        if amount is not None:
            result["project_value"] = {
                "value": amount,
                "currency": "INR",
                "page": page_number,
                "confidence": 0.9,
                "evidence_text": re.search(r"(?:₹|Rs\.?|INR)[^\n]{0,80}", normalized, re.IGNORECASE).group(0).strip() if re.search(r"(?:₹|Rs\.?|INR)[^\n]{0,80}", normalized, re.IGNORECASE) else str(amount),
            }

        date_value = StructuredExtractor.parse_date(normalized)
        if date_value:
            result["completion_date"] = {
                "value": date_value,
                "page": page_number,
                "confidence": 0.8,
                "evidence_text": date_value,
            }

        if "gst" in normalized.lower() or "gstin" in normalized.lower():
            gst_match = re.search(r"[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}", normalized, re.IGNORECASE)
            if gst_match:
                result["gst_number"] = {
                    "value": gst_match.group(0),
                    "page": page_number,
                    "confidence": 0.9,
                    "evidence_text": gst_match.group(0),
                }

        return result
