from __future__ import annotations

import re
from typing import Dict, List, Tuple


class DocumentClassifier:
    """Simple rule-based document classifier for the hackathon prototype."""

    CATEGORY_RULES: Dict[str, List[str]] = {
        "tender_document": [
            "tender",
            "tender document",
            "request for proposal",
            "rfp",
            "bid document",
            "bidder eligibility",
            "notice inviting tender",
            "nit",
            "e-tender",
        ],
        "experience_certificate": [
            "experience certificate",
            "experience",
            "work experience",
            "project experience",
            "completion certificate",
        ],
        "gst_certificate": [
            "gst certificate",
            "gst registration",
            "gstin",
            "goods and services tax",
        ],
        "company_registration": [
            "company registration",
            "certificate of incorporation",
            "cin",
            "incorporation",
            "registration certificate",
        ],
        "financial_turnover_document": [
            "annual turnover",
            "turnover",
            "financial statement",
            "balance sheet",
            "profit and loss",
            "audited financials",
        ],
        "project_completion_certificate": [
            "project completion certificate",
            "project completed",
            "completion date",
            "date of completion",
        ],
        "work_order": [
            "work order",
            "execution order",
            "job order",
        ],
        "purchase_order": [
            "purchase order",
            "po number",
            "purchase order no",
        ],
        "technical_certificate": [
            "technical certificate",
            "technical capability",
            "technical qualification",
        ],
        "eligibility_certificate": [
            "eligibility certificate",
            "eligibility criteria",
            "pre-qualifying criteria",
        ],
    }

    @staticmethod
    def normalize_text(text: str) -> str:
        text = text.lower()
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    @classmethod
    def classify(cls, text: str) -> Dict[str, object]:
        normalized = cls.normalize_text(text)
        if not normalized:
            return {
                "document_type": "unknown",
                "confidence": 0.0,
                "needs_review": True,
            }

        scores: List[Tuple[str, float]] = []
        for category, keywords in cls.CATEGORY_RULES.items():
            score = 0.0
            for keyword in keywords:
                if keyword in normalized:
                    score += 1.0
            if score > 0:
                scores.append((category, score))

        if not scores:
            return {
                "document_type": "unknown",
                "confidence": 0.35,
                "needs_review": True,
            }

        best_category, best_score = max(scores, key=lambda item: item[1])
        confidence = min(0.99, 0.5 + (best_score / max(1, len(cls.CATEGORY_RULES[best_category])) * 0.5))

        if confidence < 0.6:
            return {
                "document_type": "unknown",
                "confidence": round(confidence, 2),
                "needs_review": True,
            }

        return {
            "document_type": best_category,
            "confidence": round(confidence, 2),
            "needs_review": False,
        }
