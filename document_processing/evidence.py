from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class EvidenceItem:
    """
    Evidence supporting an extracted bidder field.
    """

    document_name: str
    page_number: int
    field_name: str
    value: Any
    evidence_text: str
    confidence: float

    def to_dict(self) -> Dict[str, Any]:
        return {
            "document_name": self.document_name,
            "page_number": self.page_number,
            "field_name": self.field_name,
            "value": self.value,
            "evidence_text": self.evidence_text,
            "confidence": self.confidence,
        }


class EvidenceBuilder:
    """
    TenderIQ evidence builder.

    Converts document-processing results into traceable
    evidence objects that can later be consumed by the
    AI Compliance Engine.

    Every extracted value should retain:
    - Source document
    - Page number
    - Extracted field
    - Extracted value
    - Supporting text
    - Extraction confidence
    """

    DEFAULT_CONFIDENCE = 0.80

    def __init__(
        self,
        default_confidence: float = DEFAULT_CONFIDENCE,
    ) -> None:
        self.default_confidence = max(
            0.0,
            min(1.0, default_confidence),
        )

    @staticmethod
    def _get_page_text(
        page: Dict[str, Any],
    ) -> str:
        """
        Get the original text associated with a page.
        """

        text = page.get("text", "")

        if not text:
            text = page.get("ocr_text", "")

        return str(text).strip()

    @staticmethod
    def _find_field_context(
        text: str,
        value: Any,
    ) -> str:
        """
        Find a useful text snippet around an extracted value.

        If the exact value cannot be found, return the complete
        page text as a fallback.
        """

        if not text:
            return ""

        value_text = str(value)

        position = text.lower().find(
            value_text.lower()
        )

        if position == -1:
            return text

        start = max(
            0,
            position - 100,
        )

        end = min(
            len(text),
            position + len(value_text) + 100,
        )

        return text[start:end].strip()

    def build_evidence(
        self,
        document_name: str,
        page_number: int,
        field_name: str,
        value: Any,
        evidence_text: str,
        confidence: Optional[float] = None,
    ) -> EvidenceItem:
        """
        Build one evidence item.
        """

        if confidence is None:
            confidence = self.default_confidence

        confidence = max(
            0.0,
            min(1.0, float(confidence)),
        )

        return EvidenceItem(
            document_name=document_name,
            page_number=page_number,
            field_name=field_name,
            value=value,
            evidence_text=evidence_text,
            confidence=round(confidence, 2),
        )

    def build_from_pages(
        self,
        document_name: str,
        pages: List[Dict[str, Any]],
        extraction_results: List[Dict[str, Any]],
    ) -> List[EvidenceItem]:
        """
        Build evidence from page-level extraction results.
        """

        evidence_items: List[EvidenceItem] = []

        page_text_map = {
            int(page.get("page_number", 0)): self._get_page_text(page)
            for page in pages
        }

        for extraction in extraction_results:

            page_number = int(
                extraction.get("page_number", 0)
            )

            page_text = page_text_map.get(
                page_number,
                "",
            )

            fields = extraction.get(
                "fields",
                {},
            )

            for field_name, value in fields.items():

                if value is None:
                    continue

                # Financial fields contain additional metadata.
                if isinstance(value, dict) and "value" in value:
                    extracted_value = value["value"]
                    original_value = value.get(
                        "original_value",
                        extracted_value,
                    )
                else:
                    extracted_value = value
                    original_value = value

                snippet = self._find_field_context(
                    page_text,
                    original_value,
                )

                evidence_items.append(
                    self.build_evidence(
                        document_name=document_name,
                        page_number=page_number,
                        field_name=field_name,
                        value=extracted_value,
                        evidence_text=snippet,
                        confidence=self.default_confidence,
                    )
                )

        return evidence_items

    @staticmethod
    def group_by_field(
        evidence_items: List[EvidenceItem],
    ) -> Dict[str, List[EvidenceItem]]:
        """
        Group evidence by extracted field name.
        """

        grouped: Dict[str, List[EvidenceItem]] = {}

        for item in evidence_items:
            grouped.setdefault(
                item.field_name,
                [],
            ).append(item)

        return grouped

    @staticmethod
    def to_dict_list(
        evidence_items: List[EvidenceItem],
    ) -> List[Dict[str, Any]]:
        """
        Convert evidence objects into dictionaries.
        """

        return [
            item.to_dict()
            for item in evidence_items
        ]


def build_evidence(
    document_name: str,
    page_number: int,
    field_name: str,
    value: Any,
    evidence_text: str,
    confidence: float = 0.80,
) -> Dict[str, Any]:
    """
    Convenience function for creating one evidence item.
    """

    return EvidenceBuilder().build_evidence(
        document_name=document_name,
        page_number=page_number,
        field_name=field_name,
        value=value,
        evidence_text=evidence_text,
        confidence=confidence,
    ).to_dict()
