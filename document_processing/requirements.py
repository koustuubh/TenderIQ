from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class TenderRequirement:
    """
    One structured requirement extracted from a tender document.
    """

    requirement_id: str
    category: str
    clause_title: str
    mandatory: bool
    requirement_type: str
    tender_requirement: str

    minimum_value: Optional[float] = None
    maximum_value: Optional[float] = None
    required_value: Optional[Any] = None
    unit: Optional[str] = None

    parameters: Dict[str, Any] = field(
        default_factory=dict
    )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.requirement_id,
            "category": self.category,
            "clauseTitle": self.clause_title,
            "mandatory": self.mandatory,
            "requirement_type": self.requirement_type,
            "tenderRequirement": self.tender_requirement,
            "minimum_value": self.minimum_value,
            "maximum_value": self.maximum_value,
            "required_value": self.required_value,
            "unit": self.unit,
            "parameters": self.parameters,
        }


class TenderRequirementExtractor:
    """
    TenderIQ tender requirement extractor.

    Extracts common procurement requirements from tender text.

    Supported requirement types include:
    - Turnover
    - Technical experience
    - Similar project value
    - Local content / Make in India
    - Bid security / EMD
    - GST
    - PAN
    - OEM authorization
    - Blacklisting / debarment
    - GFR 144(xi)
    - Certifications

    This module extracts requirements only.
    It does NOT evaluate bidder compliance.
    """

    CATEGORY_MAP = {
        "turnover": "Financial Capability & Turnover",
        "annual_turnover": "Financial Capability & Turnover",
        "average_turnover": "Financial Capability & Turnover",

        "technical_experience": "Technical Experience",
        "similar_project": "Technical Experience",
        "project_value": "Technical Experience",

        "gst": "Statutory & Tax Compliance",
        "pan": "Statutory & Tax Compliance",

        "make_in_india": "Make in India (MII) & GFR Rule 144(xi)",
        "local_content": "Make in India (MII) & GFR Rule 144(xi)",
        "gfr_144_xi": "Make in India (MII) & GFR Rule 144(xi)",

        "bid_security": "Financial Capability & Turnover",

        "oem_authorization": "Technical Experience",

        "blacklisting": "Statutory & Tax Compliance",
        "debarment": "Statutory & Tax Compliance",

        "certification": "Quality & Safety Certifications",
    }

    @staticmethod
    def normalize_text(text: str) -> str:
        """Normalize tender text."""

        if not text:
            return ""

        text = text.replace("\n", " ")
        text = re.sub(r"\s+", " ", text)

        return text.strip()

    @staticmethod
    def _convert_amount(
        value: str,
        unit: Optional[str],
    ) -> float:
        """Convert an amount into INR."""

        number = float(
            value.replace(",", "")
        )

        if not unit:
            return number

        unit = unit.lower()

        if unit in {"crore", "crores", "cr"}:
            return number * 10_000_000

        if unit in {"lakh", "lakhs"}:
            return number * 100_000

        if unit in {"million", "mn"}:
            return number * 1_000_000

        return number

    @staticmethod
    def _is_mandatory(text: str) -> bool:
        """Determine whether a clause appears mandatory."""

        mandatory_words = [
            "shall",
            "must",
            "mandatory",
            "required",
            "eligibility criteria",
            "minimum requirement",
            "bidder should",
            "bidder shall",
        ]

        text_lower = text.lower()

        return any(
            word in text_lower
            for word in mandatory_words
        )

    def _extract_turnover(
        self,
        text: str,
        requirement_id: str,
    ) -> Optional[TenderRequirement]:
        """
        Extract minimum annual/average turnover.
        """

        pattern = (
            r"(?:minimum\s+)?"
            r"(?:average\s+annual|annual)"
            r"\s+turnover"
            r".{0,80}?"
            r"(?:₹|rs\.?|inr)?\s*"
            r"([\d,]+(?:\.\d+)?)\s*"
            r"(crore|crores|cr|lakh|lakhs|million|mn)"
        )

        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if not match:
            return None

        value = self._convert_amount(
            match.group(1),
            match.group(2),
        )

        return TenderRequirement(
            requirement_id=requirement_id,
            category=self.CATEGORY_MAP["turnover"],
            clause_title="Financial Capability & Turnover",
            mandatory=self._is_mandatory(text),
            requirement_type="turnover",
            tender_requirement=text,
            minimum_value=value,
            unit="INR",
        )

    def _extract_project_value(
        self,
        text: str,
        requirement_id: str,
    ) -> Optional[TenderRequirement]:
        """
        Extract minimum similar-project value.
        """

        pattern = (
            r"(?:similar|similar\s+project|"
            r"similar\s+work|experience)"
            r".{0,150}?"
            r"(?:value|worth|valued\s+at)"
            r".{0,40}?"
            r"(?:₹|rs\.?|inr)?\s*"
            r"([\d,]+(?:\.\d+)?)\s*"
            r"(crore|crores|cr|lakh|lakhs|million|mn)"
        )

        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if not match:
            return None

        value = self._convert_amount(
            match.group(1),
            match.group(2),
        )

        return TenderRequirement(
            requirement_id=requirement_id,
            category=self.CATEGORY_MAP["project_value"],
            clause_title="Technical Experience",
            mandatory=self._is_mandatory(text),
            requirement_type="similar_project",
            tender_requirement=text,
            minimum_value=value,
            unit="INR",
        )

    def _extract_local_content(
        self,
        text: str,
        requirement_id: str,
    ) -> Optional[TenderRequirement]:
        """
        Extract minimum local-content percentage.
        """

        pattern = (
            r"(?:minimum\s+)?"
            r"(?:local\s+content|local\s+value\s+addition)"
            r".{0,50}?"
            r"(\d+(?:\.\d+)?)\s*%"
        )

        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if not match:
            return None

        value = float(
            match.group(1)
        )

        return TenderRequirement(
            requirement_id=requirement_id,
            category=self.CATEGORY_MAP["local_content"],
            clause_title="Make in India / Local Content",
            mandatory=self._is_mandatory(text),
            requirement_type="local_content",
            tender_requirement=text,
            minimum_value=value,
            unit="percentage",
        )

    def _extract_bid_security(
        self,
        text: str,
        requirement_id: str,
    ) -> Optional[TenderRequirement]:
        """
        Extract bid security / EMD amount.
        """

        pattern = (
            r"(?:bid\s+security|"
            r"earnest\s+money\s+deposit|"
            r"EMD)"
            r".{0,80}?"
            r"(?:₹|rs\.?|inr)?\s*"
            r"([\d,]+(?:\.\d+)?)\s*"
            r"(crore|crores|cr|lakh|lakhs|million|mn)?"
        )

        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if not match:
            return None

        value = self._convert_amount(
            match.group(1),
            match.group(2),
        )

        return TenderRequirement(
            requirement_id=requirement_id,
            category=self.CATEGORY_MAP["bid_security"],
            clause_title="Bid Security / EMD",
            mandatory=self._is_mandatory(text),
            requirement_type="bid_security",
            tender_requirement=text,
            minimum_value=value,
            unit="INR",
        )

    def _detect_boolean_requirement(
        self,
        text: str,
        requirement_id: str,
        requirement_type: str,
        category: str,
        clause_title: str,
        keywords: List[str],
    ) -> Optional[TenderRequirement]:
        """
        Detect requirements where compliance depends on
        presence of a declaration/document.
        """

        text_lower = text.lower()

        matched = any(
            keyword.lower() in text_lower
            for keyword in keywords
        )

        if not matched:
            return None

        return TenderRequirement(
            requirement_id=requirement_id,
            category=category,
            clause_title=clause_title,
            mandatory=self._is_mandatory(text),
            requirement_type=requirement_type,
            tender_requirement=text,
            required_value=True,
        )

    def extract_requirements(
        self,
        text: str,
    ) -> List[TenderRequirement]:
        """
        Extract all recognizable requirements from tender text.
        """

        normalized_text = self.normalize_text(text)

        if not normalized_text:
            return []

        requirements: List[TenderRequirement] = []

        counter = 1

        turnover = self._extract_turnover(
            normalized_text,
            f"REQ-{counter:03d}",
        )

        if turnover:
            requirements.append(turnover)
            counter += 1

        project_value = self._extract_project_value(
            normalized_text,
            f"REQ-{counter:03d}",
        )

        if project_value:
            requirements.append(project_value)
            counter += 1

        local_content = self._extract_local_content(
            normalized_text,
            f"REQ-{counter:03d}",
        )

        if local_content:
            requirements.append(local_content)
            counter += 1

        bid_security = self._extract_bid_security(
            normalized_text,
            f"REQ-{counter:03d}",
        )

        if bid_security:
            requirements.append(bid_security)
            counter += 1

        boolean_requirements = [
            (
                "gst",
                "Statutory & Tax Compliance",
                "Valid GST Registration",
                ["gst", "gstin", "gst registration"],
            ),
            (
                "pan",
                "Statutory & Tax Compliance",
                "Valid PAN",
                ["pan", "permanent account number"],
            ),
            (
                "oem_authorization",
                "Technical Experience",
                "OEM Authorization",
                [
                    "oem authorization",
                    "manufacturer authorization",
                    "authorized manufacturer",
                ],
            ),
            (
                "blacklisting",
                "Statutory & Tax Compliance",
                "Non-Blacklisting / Debarment Declaration",
                [
                    "not blacklisted",
                    "not debarred",
                    "blacklisting",
                    "debarment",
                ],
            ),
            (
                "gfr_144_xi",
                "Make in India (MII) & GFR Rule 144(xi)",
                "GFR Rule 144(xi) Declaration",
                [
                    "gfr 144",
                    "rule 144",
                    "land border",
                ],
            ),
        ]

        for (
            requirement_type,
            category,
            clause_title,
            keywords,
        ) in boolean_requirements:

            requirement = self._detect_boolean_requirement(
                normalized_text,
                f"REQ-{counter:03d}",
                requirement_type,
                category,
                clause_title,
                keywords,
            )

            if requirement:
                requirements.append(requirement)
                counter += 1

        return requirements

    def to_dict_list(
        self,
        requirements: List[TenderRequirement],
    ) -> List[Dict[str, Any]]:
        """Convert requirements into dictionaries."""

        return [
            requirement.to_dict()
            for requirement in requirements
        ]


def extract_requirements(
    text: str,
) -> List[Dict[str, Any]]:
    """
    Convenience function for tender requirement extraction.
    """

    extractor = TenderRequirementExtractor()

    requirements = extractor.extract_requirements(
        text
    )

    return extractor.to_dict_list(
        requirements
    )