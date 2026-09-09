from typing import Any, Dict, Iterable, Optional

from ai_engine.compliance.rules import (
    COMPLIANT,
    MISSING,
    NEEDS_REVIEW,
    NON_COMPLIANT,
    evaluate_requirement,
)
from ai_engine.schemas.models import (
    BidderData,
    BidderVerificationResult,
    ComplianceResult,
    TenderRequirement,
)


class ComplianceEngine:
    """
    TenderIQ's deterministic compliance engine.

    Responsibilities:
    - Receive tender requirements.
    - Receive structured bidder data/evidence.
    - Evaluate each requirement.
    - Produce frontend-compatible verification results.

    It does NOT:
    - Read PDFs.
    - Perform OCR.
    - Make final procurement decisions.
    """

    def evaluate_requirement(
        self,
        requirement: TenderRequirement,
        bidder: BidderData,
    ) -> ComplianceResult:

        value = bidder.fields.get(requirement.requirement_type)

        evidence_list = bidder.evidence.get(
            requirement.requirement_type,
            [],
        )

        evidence = evidence_list[0] if evidence_list else None

        status, reasoning = evaluate_requirement(
            requirement_type=requirement.requirement_type,
            value=value,
            minimum_value=requirement.minimum_value,
            parameters=requirement.parameters,
        )

        confidence = 0.0

        if evidence:
            confidence = max(
                0.0,
                min(1.0, evidence.extraction_confidence),
            )

        # If there is evidence but no extraction confidence,
        # don't pretend that confidence is 100%.
        if evidence and confidence == 0.0:
            confidence = 0.50

        # Missing evidence should have low confidence.
        if status == MISSING:
            confidence = 0.0

        return ComplianceResult(
            requirement_id=requirement.id,
            category=requirement.category,
            clause_title=requirement.clause_title,
            mandatory=requirement.mandatory,
            tender_requirement=requirement.tender_requirement,
            status=status,
            rule_check=self._rule_check(status),
            confidence=confidence,
            reasoning=reasoning,
            evidence=evidence,
        )

    def evaluate_bidder(
        self,
        requirements: Iterable[TenderRequirement],
        bidder: BidderData,
    ) -> BidderVerificationResult:

        results = []

        for requirement in requirements:
            result = self.evaluate_requirement(
                requirement=requirement,
                bidder=bidder,
            )
            results.append(result)

        passed = sum(
            1 for result in results
            if result.status == COMPLIANT
        )

        review_needed = sum(
            1 for result in results
            if result.status == NEEDS_REVIEW
        )

        failed = sum(
            1 for result in results
            if result.status == NON_COMPLIANT
        )

        missing = sum(
            1 for result in results
            if result.status == MISSING
        )

        score = self._calculate_basic_score(
            passed=passed,
            review_needed=review_needed,
            failed=failed,
            missing=missing,
            total=len(results),
        )

        risk_level = self._calculate_risk(
            score=score,
            failed=failed,
            missing=missing,
            review_needed=review_needed,
        )

        recommendation = self._recommendation(
            failed=failed,
            missing=missing,
            review_needed=review_needed,
        )

        return BidderVerificationResult(
            bidder_id=bidder.bidder_id,
            company_name=bidder.company_name,
            clauses=results,
            compliance_score=score,
            risk_level=risk_level,
            passed=passed,
            review_needed=review_needed,
            failed=failed,
            missing=missing,
            recommendation=recommendation,
        )

    @staticmethod
    def _rule_check(status: str) -> str:
        if status == COMPLIANT:
            return "PASS"

        if status == NON_COMPLIANT:
            return "FAIL"

        if status == MISSING:
            return "MISSING"

        return "REVIEW"

    @staticmethod
    def _calculate_basic_score(
        passed: int,
        review_needed: int,
        failed: int,
        missing: int,
        total: int,
    ) -> float:

        if total == 0:
            return 0.0

        # Initial transparent scoring model.
        #
        # Compliant       = 100% weight
        # Needs Review    = 50% weight
        # Missing         = 0%
        # Non-Compliant   = 0%
        #
        # This is only the foundation.
        # The dedicated scoring module will later contain
        # the production scoring strategy.

        weighted_points = (
            passed
            + (review_needed * 0.5)
        )

        return round(
            (weighted_points / total) * 100,
            2,
        )

    @staticmethod
    def _calculate_risk(
        score: float,
        failed: int,
        missing: int,
        review_needed: int,
    ) -> str:

        if failed > 0:
            return "High"

        if missing >= 2:
            return "High"

        if score < 60:
            return "High"

        if review_needed > 0:
            return "Medium"

        if score < 85:
            return "Medium"

        return "Low"

    @staticmethod
    def _recommendation(
        failed: int,
        missing: int,
        review_needed: int,
    ) -> str:

        if failed > 0:
            return "DISQUALIFY"

        if missing > 0 or review_needed > 0:
            return "NEEDS_REVIEW"

        return "QUALIFY"


def process_bidder(
    requirements: Iterable[TenderRequirement],
    bidder: BidderData,
) -> Dict[str, Any]:
    """
    Convenience function for backend/integration code.
    """

    engine = ComplianceEngine()

    result = engine.evaluate_bidder(
        requirements=requirements,
        bidder=bidder,
    )

    return result.to_frontend_dict()