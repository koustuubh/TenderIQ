from typing import Any, Dict, Iterable, List

from ai_engine.compliance.compliance_engine import ComplianceEngine
from ai_engine.integration.document_adapter import DocumentProcessingAdapter
from ai_engine.llm.gemini_service import GeminiService
from ai_engine.schemas.models import (
    BidderData,
    TenderRequirement,
)


class TenderIQAIService:
    """
    Main entry point for TenderIQ's AI/compliance layer.

    Flow:
        Document Processing
                ↓
        DocumentProcessingAdapter
                ↓
            BidderData
                ↓
        Deterministic Compliance Engine
                ↓
        Gemini Supporting Analysis
                ↓
        Frontend-compatible result

    Important:
        The deterministic compliance engine remains
        authoritative for compliance status.

        Gemini provides supporting analysis only.

        The procurement officer makes the final decision.
    """

    def __init__(
        self,
        use_gemini: bool = True,
    ) -> None:
        self.adapter = DocumentProcessingAdapter()
        self.compliance_engine = ComplianceEngine()

        self.use_gemini = use_gemini
        self.gemini = None

        if use_gemini:
            try:
                self.gemini = GeminiService()
            except Exception:
                # Gemini is optional. The deterministic
                # compliance engine must continue working.
                self.gemini = None

    def build_bidder(
        self,
        bidder_id: str,
        company_name: str,
        document_results: List[Dict[str, Any]],
    ) -> BidderData:
        """
        Convert document-processing results into BidderData.
        """

        return self.adapter.build_bidder_data(
            bidder_id=bidder_id,
            company_name=company_name,
            document_results=document_results,
        )

    def build_requirements(
        self,
        requirement_results: List[Dict[str, Any]],
    ) -> List[TenderRequirement]:
        """
        Convert document-processing requirement results
        into TenderRequirement objects.
        """

        return self.adapter.build_requirements(
            requirement_results=requirement_results,
        )

    def verify_bidder(
        self,
        bidder: BidderData,
        requirements: Iterable[TenderRequirement],
    ) -> Dict[str, Any]:
        """
        Run deterministic compliance verification and then
        optionally enrich each clause with Gemini analysis.

        The deterministic result is never replaced by Gemini.
        """

        requirements = list(requirements)

        verification = self.compliance_engine.evaluate_bidder(
            requirements=requirements,
            bidder=bidder,
        )

        result = verification.to_frontend_dict()

        if not self.gemini:
            return result

        for clause_result, frontend_clause in zip(
            verification.clauses,
            result["clauses"],
        ):
            evidence = clause_result.evidence

            if not evidence:
                continue

            requirement = next(
                (
                    req
                    for req in requirements
                    if req.id == clause_result.requirement_id
                ),
                None,
            )

            if requirement is None:
                continue

            requirement_data = {
                "id": requirement.id,
                "category": requirement.category,
                "clause_title": requirement.clause_title,
                "mandatory": requirement.mandatory,
                "requirement_type": requirement.requirement_type,
                "tender_requirement": requirement.tender_requirement,
                "minimum_value": requirement.minimum_value,
                "maximum_value": requirement.maximum_value,
                "required_value": requirement.required_value,
                "unit": requirement.unit,
                "parameters": requirement.parameters,
            }

            evidence_data = {
                "document_name": evidence.document_name,
                "page_number": evidence.page_number,
                "field_name": evidence.field_name,
                "value": evidence.value,
                "ocr_snippet": evidence.ocr_snippet,
                "extraction_confidence": evidence.extraction_confidence,
            }

            try:
                ai_analysis = self.gemini.analyze_compliance_evidence(
                    requirement=requirement_data,
                    evidence=evidence_data,
                    rule_status=clause_result.status,
                    rule_reasoning=clause_result.reasoning,
                )

                frontend_clause["bidderEvidence"][
                    "aiAnalysis"
                ] = ai_analysis

                # Keep the deterministic reasoning as the
                # authoritative compliance reasoning.
                frontend_clause["bidderEvidence"][
                    "aiReasoning"
                ] = clause_result.reasoning

            except Exception as exc:
                # Gemini failure must not break compliance
                # verification.

                frontend_clause["bidderEvidence"][
                    "aiAnalysis"
                ] = {
                    "assessment": "UNAVAILABLE",
                    "explanation": (
                        "Gemini analysis was unavailable. "
                        "The deterministic compliance result "
                        "remains authoritative."
                    ),
                    "risk_flag": "NONE",
                    "review_reason": "",
                }

        return result

    def verify_from_documents(
        self,
        bidder_id: str,
        company_name: str,
        document_results: List[Dict[str, Any]],
        requirement_results: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Complete TenderIQ verification flow.

        Input:
            document_results:
                Output from document_processing.

            requirement_results:
                Extracted tender requirements.

        Output:
            Frontend-compatible bidder verification result
            enriched with Gemini analysis when available.
        """

        bidder = self.build_bidder(
            bidder_id=bidder_id,
            company_name=company_name,
            document_results=document_results,
        )

        requirements = self.build_requirements(
            requirement_results=requirement_results,
        )

        return self.verify_bidder(
            bidder=bidder,
            requirements=requirements,
        )


def verify_bidder_from_documents(
    bidder_id: str,
    company_name: str,
    document_results: List[Dict[str, Any]],
    requirement_results: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Convenience function for backend/integration code.
    """

    service = TenderIQAIService()

    return service.verify_from_documents(
        bidder_id=bidder_id,
        company_name=company_name,
        document_results=document_results,
        requirement_results=requirement_results,
    )