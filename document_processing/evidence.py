from __future__ import annotations

from typing import Any, Dict, List, Optional


class EvidenceBuilder:
    """Build page-level evidence objects for extracted fields and findings."""

    @staticmethod
    def build_evidence(document_name: str, page_number: int, field_name: str, value: Any, evidence_text: str, confidence: float = 1.0) -> Dict[str, Any]:
        return {
            "document": document_name,
            "page": page_number,
            "field": field_name,
            "value": value,
            "evidence_text": evidence_text,
            "confidence": confidence,
        }

    @staticmethod
    def build_page_snippet(document_name: str, page_number: int, snippet: str) -> Dict[str, Any]:
        return {
            "document": document_name,
            "page": page_number,
            "snippet": snippet,
        }

    @staticmethod
    def build_issue_evidence(document_name: str, page_number: int, value: Any) -> Dict[str, Any]:
        return {
            "document": document_name,
            "page": page_number,
            "value": value,
        }


class EvidenceTracker:
    """Stores page-level evidence and allows retrieval by field name."""

    def __init__(self):
        self.records: List[Dict[str, Any]] = []

    def add_record(self, record: Dict[str, Any]) -> None:
        self.records.append(record)

    def get_by_field(self, field_name: str) -> List[Dict[str, Any]]:
        return [r for r in self.records if r.get("field") == field_name]
