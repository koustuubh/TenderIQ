from __future__ import annotations

import re
from typing import Any, Dict, List, Optional


class TenderRequirementExtractor:
    """Extract common tender eligibility requirements with source evidence."""

    @staticmethod
    def _match_number(text: str, patterns: List[str]) -> Optional[Dict[str, Any]]:
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                value = float(match.group(1).replace(",", ""))
                unit = (match.group(2) or "").lower()
                multiplier = {
                    "lakh": 100000,
                    "lakhs": 100000,
                    "crore": 10000000,
                    "crores": 10000000,
                    "million": 1000000,
                }.get(unit, 1)
                return {
                    "value": int(value * multiplier),
                    "currency": "INR",
                    "evidence_text": match.group(0).strip(),
                }
        return None

    @staticmethod
    def extract(text: str, page_number: int = 1) -> Dict[str, Any]:
        normalized = re.sub(r"[ \t]+", " ", text or "").strip()
        requirements: Dict[str, Any] = {}

        experience = re.search(
            r"(?:at least|min(?:imum)?|minimum of)\s+(\d+)\s+(?:years?|year)\s+(?:of\s+)?(?:similar\s+)?experience",
            normalized,
            re.IGNORECASE,
        )
        if experience:
            requirements["minimum_experience_years"] = {
                "value": int(experience.group(1)),
                "page": page_number,
                "evidence_text": experience.group(0),
                "confidence": 0.9,
            }

        turnover = TenderRequirementExtractor._match_number(
            normalized,
            [
                r"(?:average|min(?:imum)?|annual)\s+turnover.{0,30}?(?:₹|Rs\.?|INR)\s*([0-9,.]+)\s*(crores?|lakhs?|million)?",
                r"(?:₹|Rs\.?|INR)\s*([0-9,.]+)\s*(crores?|lakhs?|million)?[^.]{0,30}turnover",
            ],
        )
        if turnover:
            turnover.update({"page": page_number, "confidence": 0.85})
            requirements["minimum_annual_turnover"] = turnover

        bid_security = TenderRequirementExtractor._match_number(
            normalized,
            [
                r"(?:EMD|earnest money deposit|bid security)[^.]{0,60}(?:₹|Rs\.?|INR)\s*([0-9,.]+)\s*(lakhs?|crores?|million)?",
                r"(?:₹|Rs\.?|INR)\s*([0-9,.]+)\s*(lakhs?|crores?|million)?[^.]{0,30}(?:EMD|bid security)",
            ],
        )
        if bid_security:
            bid_security.update({"page": page_number, "confidence": 0.9})
            requirements["bid_security"] = bid_security

        project_count = re.search(
            r"(?:at least|min(?:imum)?|minimum of)\s+(\d+)\s+(?:similar\s+)?(?:projects?|works?|contracts?)",
            normalized,
            re.IGNORECASE,
        )
        if project_count:
            requirements["minimum_similar_projects"] = {
                "value": int(project_count.group(1)),
                "page": page_number,
                "evidence_text": project_count.group(0),
                "confidence": 0.82,
            }

        return {
            "requirement_count": len(requirements),
            "requirements": requirements,
            "status": "tender_requirements_extracted",
        }
