from typing import Any, Dict, List

from ai_engine.schemas.models import (
    BidderData,
    Evidence,
    TenderRequirement,
)


class DocumentProcessingAdapter:
    """
    Adapter between TenderIQ document_processing and ai_engine.

    Responsibilities:
    - Convert document_processing output into BidderData.
    - Convert document_processing requirements into
      TenderRequirement objects.
    - Normalize field names between both modules.
    - Preserve document/page/evidence traceability.

    This module does NOT:
    - Perform OCR.
    - Extract PDF text.
    - Make compliance decisions.
    """

    FIELD_ALIASES = {
        # Statutory / identity
        "gst_number": "gst",
        "gstin": "gst",
        "pan_number": "pan",

        # Financial
        "annual_turnover": "turnover",
        "average_turnover": "turnover",
        "average_annual_turnover": "turnover",

        # Technical experience
        "experience": "technical_experience",
        "similar_projects": "technical_experience",
        "similar_project": "technical_experience",

        # Procurement requirements
        "oem": "oem_authorization",
        "oem_authorisation": "oem_authorization",
        "manufacturer_authorization": "oem_authorization",

        "blacklisting_declaration": "blacklisting",
        "debarment_declaration": "debarment",

        # Make in India
        "make_in_india_declaration": "make_in_india",

        # Local content
        "local_content_percentage": "local_content",

        # Security
        "emd": "bid_security",
        "bid_security_declaration": "bid_security",
    }

    @classmethod
    def normalize_field_name(
        cls,
        field_name: str,
    ) -> str:
        """Convert document-processing field names to AI rule names."""

        normalized = str(
            field_name
        ).strip().lower()

        return cls.FIELD_ALIASES.get(
            normalized,
            normalized,
        )

    @staticmethod
    def _convert_evidence(
        evidence_item: Dict[str, Any],
    ) -> Evidence:
        """
        Convert document_processing evidence into
        ai_engine Evidence.
        """

        return Evidence(
            document_name=str(
                evidence_item.get(
                    "document_name",
                    "",
                )
            ),
            page_number=int(
                evidence_item.get(
                    "page_number",
                    0,
                )
            ),
            ocr_snippet=str(
                evidence_item.get(
                    "evidence_text",
                    "",
                )
            ),
            field_name=evidence_item.get(
                "field_name"
            ),
            value=evidence_item.get(
                "value"
            ),
            extraction_confidence=float(
                evidence_item.get(
                    "confidence",
                    0.0,
                )
            ),
        )

    def build_bidder_data(
        self,
        bidder_id: str,
        company_name: str,
        document_results: List[Dict[str, Any]],
    ) -> BidderData:
        """
        Convert document_processing results into BidderData.

        document_results should contain the output of
        DocumentProcessingPipeline.process().
        """

        fields: Dict[str, Any] = {}
        evidence: Dict[str, List[Evidence]] = {}

        for document in document_results:
            extraction = document.get(
                "extraction",
                {},
            )

            extracted_company_name = (
                extraction.get(
                    "company_name"
                )
            )

            if (
                not company_name
                and extracted_company_name
            ):
                company_name = extracted_company_name

            extracted_fields = extraction.get(
                "fields",
                {},
            )

            for field_name, value in extracted_fields.items():
                normalized_field = (
                    self.normalize_field_name(
                        field_name
                    )
                )

                fields[normalized_field] = value

            for evidence_item in document.get(
                "evidence",
                [],
            ):
                field_name = evidence_item.get(
                    "field_name"
                )

                if not field_name:
                    continue

                normalized_field = (
                    self.normalize_field_name(
                        field_name
                    )
                )

                converted_evidence = (
                    self._convert_evidence(
                        evidence_item
                    )
                )

                evidence.setdefault(
                    normalized_field,
                    [],
                ).append(
                    converted_evidence
                )

        return BidderData(
            bidder_id=bidder_id,
            company_name=company_name,
            fields=fields,
            evidence=evidence,
        )

    def build_requirements(
        self,
        requirement_results: List[Dict[str, Any]],
    ) -> List[TenderRequirement]:
        """
        Convert document_processing requirement extraction
        results into ai_engine TenderRequirement objects.
        """

        requirements: List[TenderRequirement] = []

        for item in requirement_results:
            requirement_type = item.get(
                "requirement_type",
                "unknown",
            )

            requirement_type = (
                self.normalize_field_name(
                    requirement_type
                )
            )

            requirements.append(
                TenderRequirement(
                    id=str(
                        item.get(
                            "requirement_id",
                            "",
                        )
                    ),
                    category=str(
                        item.get(
                            "category",
                            "General",
                        )
                    ),
                    clause_title=str(
                        item.get(
                            "clause_title",
                            "",
                        )
                    ),
                    mandatory=bool(
                        item.get(
                            "mandatory",
                            False,
                        )
                    ),
                    requirement_type=requirement_type,
                    tender_requirement=str(
                        item.get(
                            "tender_requirement",
                            "",
                        )
                    ),
                    minimum_value=item.get(
                        "minimum_value"
                    ),
                    maximum_value=item.get(
                        "maximum_value"
                    ),
                    required_value=item.get(
                        "required_value"
                    ),
                    unit=item.get(
                        "unit"
                    ),
                    parameters=item.get(
                        "parameters",
                        {},
                    ),
                )
            )

        return requirements


def build_bidder_data(
    bidder_id: str,
    company_name: str,
    document_results: List[Dict[str, Any]],
) -> BidderData:
    """Convenience function for building BidderData."""

    adapter = DocumentProcessingAdapter()

    return adapter.build_bidder_data(
        bidder_id=bidder_id,
        company_name=company_name,
        document_results=document_results,
    )


def build_requirements(
    requirement_results: List[Dict[str, Any]],
) -> List[TenderRequirement]:
    """Convenience function for building TenderRequirement objects."""

    adapter = DocumentProcessingAdapter()

    return adapter.build_requirements(
        requirement_results=requirement_results,
    )