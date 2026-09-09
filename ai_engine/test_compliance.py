from ai_engine.compliance.compliance_engine import process_bidder
from ai_engine.schemas.models import (
    BidderData,
    Evidence,
    TenderRequirement,
)


requirements = [
    TenderRequirement(
        id="CLS-001",
        category="Statutory & Tax Compliance",
        clause_title="Valid GST Registration",
        mandatory=True,
        requirement_type="gst",
        tender_requirement="Bidder must have a valid GST registration.",
    ),
    TenderRequirement(
        id="CLS-002",
        category="Statutory & Tax Compliance",
        clause_title="Valid PAN",
        mandatory=True,
        requirement_type="pan",
        tender_requirement="Bidder must have a valid PAN.",
    ),
    TenderRequirement(
        id="CLS-003",
        category="Financial Capability & Turnover",
        clause_title="Minimum Annual Turnover",
        mandatory=True,
        requirement_type="turnover",
        tender_requirement="Average annual turnover must be at least ₹14.55 Cr.",
        minimum_value=145_500_000,
    ),
    TenderRequirement(
        id="CLS-004",
        category="Procurement",
        clause_title="OEM Authorization",
        mandatory=True,
        requirement_type="oem_authorization",
        tender_requirement="Valid OEM authorization is required.",
    ),
    TenderRequirement(
        id="CLS-005",
        category="Procurement",
        clause_title="Non-Blacklisting Declaration",
        mandatory=True,
        requirement_type="blacklisting",
        tender_requirement="Bidder must not be blacklisted or debarred.",
    ),
]


bidder = BidderData(
    bidder_id="BID-02",
    company_name="Example Engineering Ltd",
    fields={
        "gst": "29ABCDE1234F1Z5",
        "pan": "ABCDE1234F",
        "turnover": 420_300_000,
        "oem_authorization": True,
        "blacklisting": True,
    },
    evidence={
        "gst": [
            Evidence(
                document_name="GST_Certificate.pdf",
                page_number=2,
                ocr_snippet="GSTIN: 29ABCDE1234F1Z5",
                field_name="gst",
                value="29ABCDE1234F1Z5",
                extraction_confidence=0.98,
            )
        ],
        "pan": [
            Evidence(
                document_name="PAN_Card.pdf",
                page_number=1,
                ocr_snippet="Permanent Account Number: ABCDE1234F",
                field_name="pan",
                value="ABCDE1234F",
                extraction_confidence=0.99,
            )
        ],
        "turnover": [
            Evidence(
                document_name="Turnover_Certificate.pdf",
                page_number=3,
                ocr_snippet=(
                    "Average annual turnover for the relevant financial years "
                    "is Rs. 42.03 Crore."
                ),
                field_name="turnover",
                value=420_300_000,
                extraction_confidence=0.94,
            )
        ],
        "oem_authorization": [
            Evidence(
                document_name="OEM_Authorization.pdf",
                page_number=4,
                ocr_snippet="Authorized OEM partner certificate.",
                field_name="oem_authorization",
                value=True,
                extraction_confidence=0.93,
            )
        ],
        "blacklisting": [
            Evidence(
                document_name="Non_Blacklisting_Declaration.pdf",
                page_number=2,
                ocr_snippet=(
                    "The bidder declares that it has not been blacklisted "
                    "or debarred."
                ),
                field_name="blacklisting",
                value=True,
                extraction_confidence=0.96,
            )
        ],
    },
)


result = process_bidder(
    requirements=requirements,
    bidder=bidder,
)


print("\n========== TENDERIQ COMPLIANCE TEST ==========\n")
print(f"Bidder       : {result['companyName']}")
print(f"Score        : {result['complianceScore']}")
print(f"Risk         : {result['riskLevel']}")
print(f"Passed       : {result['passed']}")
print(f"Review       : {result['reviewNeeded']}")
print(f"Failed       : {result['failed']}")
print(f"Missing      : {result['missing']}")
print(f"Recommendation: {result['recommendation']}")

print("\n---------- Clauses ----------\n")

for clause in result["clauses"]:
    evidence = clause["bidderEvidence"]

    print(
        f"{clause['id']} | "
        f"{clause['clauseTitle']} | "
        f"{evidence['status']} | "
        f"{evidence['ruleCheck']} | "
        f"{evidence['aiConfidence']}%"
    )

print("\n==============================================\n")