from typing import Any, Dict, Iterable, List

from ai_engine.compliance.compliance_engine import ComplianceEngine
from ai_engine.integration.document_adapter import DocumentProcessingAdapter
from ai_engine.schemas.models import BidderData, TenderRequirement


class TenderIQAIService:
    """
    Main entry point for TenderIQ's AI/compliance layer.

    Flow:
        Document Processing Result
                ↓
        DocumentProcessingAdapter
                ↓
            BidderData
                ↓
          ComplianceEngine
                ↓
        Frontend-compatible result

    This service does not:
        - Read PDFs directly
        - Perform OCR
        - Make the final procurement decision
    """

    def __init__(self) -> None:
        self.adapter = DocumentProcessingAdapter()
        self.compliance_engine = ComplianceEngine()

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
        Run TenderIQ compliance verification for one bidder.

        Returns a frontend-compatible dictionary.
        """

        result = self.compliance_engine.evaluate_bidder(
            requirements=requirements,
            bidder=bidder,
        )

        return result.to_frontend_dict()

    def verify_from_documents(
        self,
        bidder_id: str,
        company_name: str,
        document_results: List[Dict[str, Any]],
        requirement_results: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Complete AI verification flow.

        Input:
            document_results:
                Output from document_processing.

            requirement_results:
                Tender requirements extracted by
                document_processing.

        Output:
            Frontend-compatible bidder verification result.
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