from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, List, Tuple


@dataclass
class ClassificationResult:
    """Result of classifying one TenderIQ document."""

    document_type: str
    confidence: float
    matched_keywords: List[str]

    def to_dict(self) -> Dict[str, object]:
        return {
            "document_type": self.document_type,
            "confidence": self.confidence,
            "matched_keywords": self.matched_keywords,
        }


class DocumentClassifier:
    """
    TenderIQ document classifier.

    Identifies common bidder documents required for
    GeM procurement compliance verification.

    Classification is rule-based at this stage.
    AI/LLM assistance can be added later for ambiguous documents.
    """

    DOCUMENT_RULES: Dict[str, List[str]] = {
        "gst_certificate": [
            "gst",
            "gstin",
            "goods and services tax",
            "gst registration",
            "gst registration certificate",
            "gstr",
        ],

        "pan_document": [
            "permanent account number",
            "pan",
            "income tax department",
            "income tax",
        ],

        "udyam_msme_certificate": [
            "udyam",
            "udyam registration",
            "msme",
            "micro small and medium",
            "msme registration",
        ],

        "company_registration": [
            "certificate of incorporation",
            "incorporation certificate",
            "company registration",
            "registrar of companies",
            "roc",
            "cin",
        ],

        "financial_turnover_document": [
            "annual turnover",
            "average annual turnover",
            "turnover",
            "audited financial statements",
            "financial statements",
            "profit and loss",
            "balance sheet",
            "chartered accountant",
            "ca certificate",
            "udin",
        ],

        "technical_experience": [
            "technical experience",
            "similar work",
            "similar project",
            "similar works",
            "experience certificate",
            "experience",
            "past experience",
            "work experience",
            "hydrocracker",
            "piping work",
            "indian psu",
        ],

        "project_completion_certificate": [
            "completion certificate",
            "project completion",
            "work completion",
            "completed work",
            "successful completion",
            "certificate of completion",
        ],

        "work_order": [
            "work order",
            "purchase order",
            "order value",
            "contract value",
            "letter of award",
            "loa",
        ],

        "oem_authorization": [
            "oem authorization",
            "manufacturer authorization",
            "authorized dealer",
            "authorized distributor",
            "manufacturer's authorization",
            "authorization letter",
        ],

        "blacklisting_declaration": [
            "blacklisted",
            "blacklisting",
            "debarred",
            "debarment",
            "not blacklisted",
            "not debarred",
            "declaration of non-blacklisting",
        ],

        "make_in_india_declaration": [
            "make in india",
            "local content",
            "class-i local supplier",
            "class ii local supplier",
            "local supplier",
            "local value addition",
        ],

        "gfr_144_xi_declaration": [
            "gfr 144",
            "rule 144",
            "land border",
            "land border sharing",
            "country sharing land border",
        ],

        "bid_security_emd": [
            "bid security",
            "earnest money deposit",
            "emd",
            "bid security declaration",
            "security deposit",
        ],

        "technical_certificate": [
            "technical certificate",
            "quality certificate",
            "iso certificate",
            "asme",
            "asme certificate",
            "quality management",
            "welding certification",
        ],

        "safety_certificate": [
            "safety certificate",
            "safety certification",
            "occupational safety",
            "health and safety",
            "ohsas",
            "iso 45001",
        ],
    }

    def __init__(self, minimum_confidence: float = 0.30):
        self.minimum_confidence = minimum_confidence

    @staticmethod
    def _normalize_text(text: str) -> str:
        """Normalize document text for keyword matching."""

        if not text:
            return ""

        text = text.lower()
        text = re.sub(r"\s+", " ", text)

        return text.strip()

    def _find_matches(
        self,
        text: str,
        keywords: List[str],
    ) -> List[str]:
        """
        Find keywords using whole-word matching.

        This prevents false matches such as:
        'roc' matching inside 'hydrocracker'.
        """

        matches = []

        for keyword in keywords:
            keyword_normalized = self._normalize_text(keyword)

            if re.search(
                rf"\b{re.escape(keyword_normalized)}\b",
                text,
            ):
                matches.append(keyword)

        return matches

    @staticmethod
    def _calculate_confidence(
        match_count: int,
        total_keywords: int,
    ) -> float:
        """
        Calculate rule-based classification confidence.
        """

        if match_count == 0 or total_keywords == 0:
            return 0.0

        confidence = min(
            1.0,
            0.40 + ((match_count - 1) * 0.15),
        )

        return round(confidence, 2)

    def classify(self, text: str) -> ClassificationResult:
        """
        Classify a document using extracted or OCR text.
        """

        normalized_text = self._normalize_text(text)

        if not normalized_text:
            return ClassificationResult(
                document_type="unknown",
                confidence=0.0,
                matched_keywords=[],
            )

        candidates: List[Tuple[str, float, List[str]]] = []

        for document_type, keywords in self.DOCUMENT_RULES.items():

            matches = self._find_matches(
                normalized_text,
                keywords,
            )

            if matches:

                confidence = self._calculate_confidence(
                    len(matches),
                    len(keywords),
                )

                candidates.append(
                    (
                        document_type,
                        confidence,
                        matches,
                    )
                )

        if not candidates:
            return ClassificationResult(
                document_type="unknown",
                confidence=0.0,
                matched_keywords=[],
            )

        candidates.sort(
            key=lambda item: (
                item[1],
                len(item[2]),
            ),
            reverse=True,
        )

        document_type, confidence, matches = candidates[0]

        if confidence < self.minimum_confidence:
            return ClassificationResult(
                document_type="unknown",
                confidence=confidence,
                matched_keywords=matches,
            )

        return ClassificationResult(
            document_type=document_type,
            confidence=confidence,
            matched_keywords=matches,
        )

    def classify_pages(
        self,
        pages: List[Dict[str, object]],
    ) -> List[Dict[str, object]]:
        """
        Classify each extracted/OCR page independently.
        """

        results = []

        for page in pages:

            page_number = int(
                page.get("page_number", 0)
            )

            text = str(
                page.get("text", "")
            )

            result = self.classify(text)

            results.append(
                {
                    "page_number": page_number,
                    **result.to_dict(),
                }
            )

        return results


def classify_document(
    text: str,
) -> Dict[str, object]:
    """
    Convenience function for document classification.
    """

    return DocumentClassifier().classify(text).to_dict()