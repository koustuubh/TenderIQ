from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class Evidence:
    """
    Evidence extracted from a bidder document.
    This is the bridge between document_processing and ai_engine.
    """

    document_name: str
    page_number: int
    ocr_snippet: str
    field_name: Optional[str] = None
    value: Any = None
    extraction_confidence: float = 0.0

    def to_frontend_dict(self) -> Dict[str, Any]:
        return {
            "documentName": self.document_name,
            "pageNumber": self.page_number,
            "ocrSnippet": self.ocr_snippet,
        }


@dataclass
class TenderRequirement:
    """
    One requirement/clause extracted from a tender document.
    """

    id: str
    category: str
    clause_title: str
    mandatory: bool
    requirement_type: str
    tender_requirement: str

    # Optional values used by specific rules.
    minimum_value: Optional[float] = None
    maximum_value: Optional[float] = None
    required_value: Optional[Any] = None
    unit: Optional[str] = None

    # Additional rule-specific configuration.
    parameters: Dict[str, Any] = field(default_factory=dict)


@dataclass
class BidderData:
    """
    Structured information extracted from bidder documents.
    """

    bidder_id: str
    company_name: str

    # Flexible because different tenders require different fields.
    fields: Dict[str, Any] = field(default_factory=dict)

    # Evidence grouped by field/requirement.
    evidence: Dict[str, List[Evidence]] = field(default_factory=dict)


@dataclass
class ComplianceResult:
    """
    Result of evaluating one tender requirement against bidder evidence.
    """

    requirement_id: str
    category: str
    clause_title: str
    mandatory: bool
    tender_requirement: str

    status: str
    rule_check: str

    confidence: float
    reasoning: str

    evidence: Optional[Evidence] = None

    def to_frontend_dict(self) -> Dict[str, Any]:
        evidence_data = (
            self.evidence.to_frontend_dict()
            if self.evidence
            else {
                "documentName": "",
                "pageNumber": 0,
                "ocrSnippet": "",
            }
        )

        return {
            "id": self.requirement_id,
            "category": self.category,
            "clauseTitle": self.clause_title,
            "mandatory": self.mandatory,
            "tenderRequirement": self.tender_requirement,
            "bidderEvidence": {
                **evidence_data,
                "ruleCheck": self.rule_check,
                "aiConfidence": round(self.confidence * 100),
                "status": self.status.replace("_", " ").title(),
                "aiReasoning": self.reasoning,
            },
        }


@dataclass
class BidderVerificationResult:
    """
    Complete verification result for one bidder.
    Designed to match the existing TenderIQ frontend.
    """

    bidder_id: str
    company_name: str

    clauses: List[ComplianceResult] = field(default_factory=list)

    compliance_score: float = 0.0
    risk_level: str = "High"

    passed: int = 0
    review_needed: int = 0
    failed: int = 0
    missing: int = 0

    recommendation: str = "NEEDS_REVIEW"

    def to_frontend_dict(self) -> Dict[str, Any]:
        return {
            "bidderId": self.bidder_id,
            "companyName": self.company_name,
            "complianceScore": round(self.compliance_score),
            "riskLevel": self.risk_level,
            "passed": self.passed,
            "reviewNeeded": self.review_needed,
            "failed": self.failed,
            "missing": self.missing,
            "recommendation": self.recommendation,
            "clauses": [
                clause.to_frontend_dict()
                for clause in self.clauses
            ],
        }