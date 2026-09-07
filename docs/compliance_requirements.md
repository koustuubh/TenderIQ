# TenderIQ Compliance Requirements

## 1. GST Registration

Requirement:
GST Registration

Required Document:
GST Certificate

Data to Extract:
- GSTIN
- Legal Name
- GST Status

Verification Rule:
- GSTIN must be present
- GST status must be Active

Possible Result:
- COMPLIANT
- NEEDS REVIEW
- NON-COMPLIANT
- MISSING

---

## 2. PAN

Requirement:
Valid PAN

Required Document:
PAN Card

Data to Extract:
- PAN Number
- Legal Name

Verification Rule:
- PAN must be present
- Name should match bidder details

Possible Result:
- COMPLIANT
- NEEDS REVIEW
- NON-COMPLIANT
- MISSING

---

## 3. Minimum Annual Turnover

Requirement:
Bidder must meet the minimum turnover specified in the tender.

Required Document:
Financial Statement / CA Certificate

Data to Extract:
- Annual Turnover
- Financial Year

Verification Rule:
- Extracted turnover must meet or exceed the tender requirement

Possible Result:
- COMPLIANT
- NEEDS REVIEW
- NON-COMPLIANT
- MISSING

---

## 4. OEM Authorization

Requirement:
OEM Authorization is required where specified by the tender.

Required Document:
OEM Authorization Letter

Data to Extract:
- OEM Name
- Bidder Name
- Authorization validity
- Product/category

Verification Rule:
- Authorization must be present
- Bidder should match the authorized entity
- Authorization should be valid

Possible Result:
- COMPLIANT
- NEEDS REVIEW
- NON-COMPLIANT
- MISSING

---

## 5. Non-Blacklisting Declaration

Requirement:
Bidder must not be blacklisted/debarred where required by the tender.

Required Document:
Non-Blacklisting Declaration

Data to Extract:
- Bidder Name
- Declaration
- Date
- Validity, if applicable

Verification Rule:
- Declaration must be present
- Bidder name should match
- Any conflicting information should be flagged

Possible Result:
- COMPLIANT
- NEEDS REVIEW
- NON-COMPLIANT
- MISSING
