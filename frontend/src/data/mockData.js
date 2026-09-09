// Mock Data for TenderIQ - SIH 2026 GeM Bid Compliance Verification Platform
// Problem Statement: SIH26100 | CPCL / Ministry of Petroleum & Natural Gas

export const currentOfficer = {
  name: "Shri Rajesh Kumar Verma",
  designation: "Chief General Manager (Materials & Contracts)",
  department: "Chennai Petroleum Corporation Limited (CPCL)",
  ministry: "Ministry of Petroleum & Natural Gas",
  officerId: "CPCL-OFF-40912",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  lastLogin: "08 Sep 2026, 09:30 AM IST",
  ipAddress: "10.144.22.84 (NIC Secure Network)"
};

export const nationalPortalStats = {
  tendersEvaluated: 13957,
  activeCPCLBids: 5731,
  verifiedBidders: 2322,
  complianceRate: "92.4%",
  avgTimeReduction: "76.5%",
  disqualifiedFlagged: 418
};

export const sampleTenders = [
  {
    id: "CPCL-2026-T890",
    gemBidNumber: "GEM/2026/B/9821471",
    title: "Supply, Fabrication & Erection of High-Pressure Hydrocracker Piping & Reactor Loops",
    category: "Works & Engineering",
    department: "CPCL Manali Refinery, Chennai",
    estimatedValue: "₹ 48.50 Crore",
    publishDate: "15 Aug 2026",
    closingDate: "12 Sep 2026",
    status: "Verification In-Progress",
    totalBidders: 4,
    evaluatedCount: 3,
    criticalRequirementsCount: 14
  },
  {
    id: "CPCL-2026-T884",
    gemBidNumber: "GEM/2026/B/8710294",
    title: "Annual Maintenance Contract for DCS Automation, SCADA Systems & Field Instrumentation",
    category: "Services",
    department: "CPCL Instrumentation Dept",
    estimatedValue: "₹ 12.80 Crore",
    publishDate: "02 Aug 2026",
    closingDate: "05 Sep 2026",
    status: "Decision Pending",
    totalBidders: 3,
    evaluatedCount: 3,
    criticalRequirementsCount: 11
  },
  {
    id: "CPCL-2026-T879",
    gemBidNumber: "GEM/2026/B/7641203",
    title: "Procurement of Severe Service Anti-Surge Control Valves with Smart Positioners",
    category: "Goods & Machinery",
    department: "CPCL Refinery II Division",
    estimatedValue: "₹ 24.30 Crore",
    publishDate: "20 Jul 2026",
    closingDate: "28 Aug 2026",
    status: "Awarded & Audited",
    totalBidders: 5,
    evaluatedCount: 5,
    criticalRequirementsCount: 16
  }
];

export const selectedTenderDetails = {
  id: "CPCL-2026-T890",
  gemBidNumber: "GEM/2026/B/9821471",
  title: "Supply, Fabrication & Erection of High-Pressure Hydrocracker Piping & Reactor Loops",
  ministry: "Ministry of Petroleum & Natural Gas",
  organization: "Chennai Petroleum Corporation Limited (CPCL)",
  tenderDocumentName: "Tender_Document_CPCL_HCU_Piping_2026_Rev2.pdf",
  uploadTimestamp: "2026-08-25 14:22:10 IST",
  extractedClausesCount: 14,
  biddersCount: 4,
  criteriaCategories: [
    { name: "Technical Experience", count: 4, mandatory: true },
    { name: "Financial Capability & Turnover", count: 3, mandatory: true },
    { name: "Statutory & Tax Compliance", count: 4, mandatory: true },
    { name: "Make in India (MII) & GFR Rule 144(xi)", count: 2, mandatory: true },
    { name: "Quality & Safety Certifications", count: 1, mandatory: false }
  ]
};

export const biddersList = [
  {
    id: "BID-01",
    companyName: "Larsen & Toubro Heavy Engineering Ltd",
    gemSellerId: "GEM-SLR-904128",
    bidSubmitDate: "01 Sep 2026, 11:20 AM",
    complianceScore: 96,
    riskLevel: "Low",
    status: "Compliant",
    summary: "All technical parameters, past CPCL/IOCL work orders, UDIN certified balance sheets, and Make in India 78% local content verified.",
    totalClauses: 14,
    passed: 14,
    reviewNeeded: 0,
    failed: 0,
    missing: 0,
    documentsSubmitted: [
      { name: "Technical_Bid_Document_LT.pdf", pages: 142, ocrStatus: "Indexed 100%" },
      { name: "Audited_Financials_FY23_25_UDIN.pdf", pages: 58, ocrStatus: "Indexed 100%" },
      { name: "CPCL_Past_Experience_Certs.pdf", pages: 24, ocrStatus: "Indexed 100%" },
      { name: "Class1_Local_Supplier_MII_Affidavit.pdf", pages: 6, ocrStatus: "Indexed 100%" }
    ]
  },
  {
    id: "BID-02",
    companyName: "Bharat Forge Energy & Infrastructure Systems",
    gemSellerId: "GEM-SLR-772183",
    bidSubmitDate: "03 Sep 2026, 04:45 PM",
    complianceScore: 82,
    riskLevel: "Medium",
    status: "Needs Review",
    summary: "Financial net worth meets criteria. However, FY24 Turnover certificate UDIN validation flagged an address mismatch with GST portal.",
    totalClauses: 14,
    passed: 11,
    reviewNeeded: 2,
    failed: 0,
    missing: 1,
    documentsSubmitted: [
      { name: "Technical_Eligibility_BF.pdf", pages: 98, ocrStatus: "Indexed 100%" },
      { name: "Turnover_CA_Certificate_FY24.pdf", pages: 12, ocrStatus: "OCR Warning" },
      { name: "GST_Filings_GSTR3B_Recent.pdf", pages: 36, ocrStatus: "Indexed 100%" },
      { name: "Integrity_Pact_Form_Signed.pdf", pages: 8, ocrStatus: "Indexed 100%" }
    ]
  },
  {
    id: "BID-03",
    companyName: "PetroTech Global Engineering Ltd",
    gemSellerId: "GEM-SLR-441920",
    bidSubmitDate: "04 Sep 2026, 06:15 PM",
    complianceScore: 48,
    riskLevel: "High",
    status: "Non-Compliant",
    summary: "Non-compliant on Local Content requirement (Declared 38%, Tender requires Min 50% Class-1). ISO 9001 certificate expired on July 2026.",
    totalClauses: 14,
    passed: 6,
    reviewNeeded: 2,
    failed: 4,
    missing: 2,
    documentsSubmitted: [
      { name: "PetroTech_Bid_Dossier_PartA.pdf", pages: 64, ocrStatus: "Indexed 100%" },
      { name: "Annual_Accounts_2024.pdf", pages: 40, ocrStatus: "Indexed 100%" },
      { name: "Local_Content_Self_Cert.pdf", pages: 4, ocrStatus: "Indexed 100%" }
    ]
  },
  {
    id: "BID-04",
    companyName: "Kalyani Industrial Solutions Pvt Ltd",
    gemSellerId: "GEM-SLR-119382",
    bidSubmitDate: "05 Sep 2026, 09:10 AM",
    complianceScore: 54,
    riskLevel: "High",
    status: "Missing",
    summary: "Critical statutory filings missing: Audited Balance sheet for FY24-25 and EMD Bank Guarantee document not attached.",
    totalClauses: 14,
    passed: 7,
    reviewNeeded: 1,
    failed: 1,
    missing: 5,
    documentsSubmitted: [
      { name: "Bid_Submission_Form.pdf", pages: 18, ocrStatus: "Indexed 100%" },
      { name: "Experience_Letters_IOCL.pdf", pages: 12, ocrStatus: "Indexed 100%" }
    ]
  }
];

// Clause-by-clause detailed verification matrix for Bharat Forge (BID-02) and Larsen & Toubro (BID-01)
export const verificationClauses = [
  {
    id: "CLS-001",
    category: "Technical Experience",
    clauseTitle: "Prior Experience in Hydrocracker Piping Installation",
    mandatory: true,
    tenderRequirement: "Bidder must have completed at least 1 similar high-pressure hydrocracker or delayed coker piping work worth not less than ₹ 38.80 Crore in any Indian PSU refinery during the last 7 years.",
    bidderEvidence: {
      documentName: "Technical_Eligibility_BF.pdf",
      pageNumber: 42,
      ocrSnippet: "Work Completion Certificate Ref: IOCL/PR/P-4299. Successfully commissioned High Pressure Reactor Piping at Paradip Refinery on 14/03/2023. Total invoiced and settled amount: INR 44,20,50,000/- (Forty-Four Crore Twenty Lakhs).",
      ruleCheck: "PASS (Value ₹44.20 Cr >= ₹38.80 Cr; PSU: Indian Oil Corporation Ltd)",
      aiConfidence: 98,
      status: "Compliant",
      aiReasoning: "The completion certificate clearly satisfies value threshold (114% of required benchmark) and PSU scope criteria with verified IOCL reference number."
    }
  },
  {
    id: "CLS-002",
    category: "Financial Capability & Turnover",
    clauseTitle: "Minimum Average Annual Turnover (3 Financial Years)",
    mandatory: true,
    tenderRequirement: "Average annual financial turnover during the immediate last 3 financial years (FY 2022-23, 2023-24, 2024-25) must be at least ₹ 14.55 Crore certified by a registered Chartered Accountant with valid UDIN.",
    bidderEvidence: {
      documentName: "Turnover_CA_Certificate_FY24.pdf",
      pageNumber: 3,
      ocrSnippet: "Turnover declared: FY23: ₹38.2 Cr, FY24: ₹42.1 Cr, FY25: ₹45.8 Cr. Average: ₹42.03 Cr. CA Membership: 084920, UDIN: 26084920BKX9281. Note: Registered address on CA stamp shows Pune Branch whereas GeM portal profile shows Mumbai Corporate HQ.",
      ruleCheck: "NEEDS_REVIEW (Average ₹42.03 Cr meets criteria; Branch address mismatch with GeM Master)",
      aiConfidence: 84,
      status: "Needs Review",
      aiReasoning: "Financial value passes the turnover threshold easily (₹42.03 Cr vs ₹14.55 Cr required). However, the registered GSTIN address on CA certification differs from bidder's primary GeM profile address. Verification officer should confirm branch consolidation certificate."
    }
  },
  {
    id: "CLS-003",
    category: "Make in India (MII) & GFR Rule 144(xi)",
    clauseTitle: "Class-I Local Supplier Minimum 50% Local Content",
    mandatory: true,
    tenderRequirement: "Purchase preference as per Public Procurement (Preference to Make in India) Order 2017: Only Class-I Local Suppliers with local value addition >= 50% are eligible.",
    bidderEvidence: {
      documentName: "Class1_Local_Supplier_MII_Affidavit.pdf",
      pageNumber: 5,
      ocrSnippet: "We hereby solemnly affirm that our manufactured piping spools and high pressure fittings contain 64.2% local value addition calculated in compliance with DPIIT Order P-45021/2/2017-PP (BE-II). Location of value addition: Chakan, Pune Facility.",
      ruleCheck: "PASS (Declared 64.2% >= Mandatory 50.0%)",
      aiConfidence: 96,
      status: "Compliant",
      aiReasoning: "Affidavit conforms to DPIIT standard template. Local content declared at 64.2% exceeds the 50% threshold for Class-I designation."
    }
  },
  {
    id: "CLS-004",
    category: "Statutory & Tax Compliance",
    clauseTitle: "Land Border Sharing Declaration (GFR Rule 144(xi))",
    mandatory: true,
    tenderRequirement: "Mandatory compliance certificate regarding restrictions on procurement from bidders of countries sharing land borders with India as per MoF DoE OM F.No.6/18/2019-PPD.",
    bidderEvidence: {
      documentName: "Integrity_Pact_Form_Signed.pdf",
      pageNumber: 7,
      ocrSnippet: "Undertaking as per Clause 144(xi): We do not have any beneficial ownership or parent entity incorporated in any country sharing a land border with the Republic of India.",
      ruleCheck: "PASS (Legal Undertaking Provided and Authorized Signatory verified)",
      aiConfidence: 95,
      status: "Compliant",
      aiReasoning: "Declaration fully signed by authorized signatory with digital DSC verification matching GeM seller credentials."
    }
  },
  {
    id: "CLS-005",
    category: "Statutory & Tax Compliance",
    clauseTitle: "Valid GST Registration & Up-to-date GSTR-3B Filings",
    mandatory: true,
    tenderRequirement: "Active GSTIN in Tamil Nadu or state of manufacturing, with no default in GSTR-3B returns for the preceding 6 consecutive months.",
    bidderEvidence: {
      documentName: "GST_Filings_GSTR3B_Recent.pdf",
      pageNumber: 18,
      ocrSnippet: "GSTIN: 27AAACB2948R1ZX. Returns filed through July 2026. Status: Active / Regular. No pending recovery proceedings recorded.",
      ruleCheck: "PASS (Active Status confirmed against GSTN mock API)",
      aiConfidence: 99,
      status: "Compliant",
      aiReasoning: "GSTIN is active, return filing record is consecutive without delinquency, and tax compliance score is pristine."
    }
  },
  {
    id: "CLS-006",
    category: "Quality & Safety Certifications",
    clauseTitle: "ASME 'U' Stamp / ISO 3834-2 Welding Certification",
    mandatory: true,
    tenderRequirement: "Fabricator must possess valid ASME Section VIII Div 1 'U' Stamp or ISO 3834-2 Comprehensive Quality Requirements for Fusion Welding certification valid till tender execution.",
    bidderEvidence: {
      documentName: "Technical_Eligibility_BF.pdf",
      pageNumber: 72,
      ocrSnippet: "Certificate: ISO 3834-2:2021 by TÜV NORD. Valid from 12-Nov-2023 to 11-Nov-2026. Scope: Manufacture of high integrity pressure vessels and hydrocracker pipe spools.",
      ruleCheck: "PASS (Certificate active until Nov 2026)",
      aiConfidence: 97,
      status: "Compliant",
      aiReasoning: "TÜV NORD accredited ISO 3834-2 certificate is currently active and covers the entire tender execution timeline."
    }
  },
  {
    id: "CLS-007",
    category: "Technical Experience",
    clauseTitle: "Dedicated Hydrocracker Spool Fabrication Shop Facility",
    mandatory: true,
    tenderRequirement: "The bidder must own or have an exclusive lease of a clean-room bay dedicated for exotic alloys (Inconel, Monel, Duplex Stainless Steel) with automated GTAW/SAW welding machines.",
    bidderEvidence: {
      documentName: "Technical_Eligibility_BF.pdf",
      pageNumber: 88,
      ocrSnippet: "Machinery schedule lists 6 SAW machines, 18 GTAW stations. Clean room bay dimensions: 40m x 15m. Factory license attached. Note: Calibration certificate for 4 orbital welding machines is pending renewal.",
      ruleCheck: "NEEDS_REVIEW (Clean bay exists; Calibration for 4 orbital welding units expired June 2026)",
      aiConfidence: 86,
      status: "Needs Review",
      aiReasoning: "Workshop facility meets the capacity requirements, but the orbital welding machine calibration certificates must be re-submitted prior to technical committee final approval."
    }
  },
  {
    id: "CLS-008",
    category: "Statutory & Tax Compliance",
    clauseTitle: "Non-Blacklisting / Debarment Undertaking",
    mandatory: true,
    tenderRequirement: "Bidder must submit a non-judicial stamp paper notarized affidavit declaring that the firm has not been blacklisted, banned, or delisted by GeM, CPCL, or any CPSE.",
    bidderEvidence: {
      documentName: "Integrity_Pact_Form_Signed.pdf",
      pageNumber: 11,
      ocrSnippet: "Affidavit executed on ₹100 e-stamp paper IN-MH299104. 'The company has never been debarred or blacklisted by any Government Ministry or CPSE as of date.'",
      ruleCheck: "PASS (Verified against GeM Debarment Watchlist & CVC Central database)",
      aiConfidence: 99,
      status: "Compliant",
      aiReasoning: "Clean record verified on CVC blacklist database and GeM central seller registry."
    }
  }
];

export const mockAuditLogs = [
  {
    id: "AUD-1082",
    timestamp: "2026-09-08 14:15:22 IST",
    officer: "Rajesh Kumar Verma (CPCL-CGM)",
    action: "Initiated AI Clause Cross-Verification",
    bidder: "Bharat Forge Energy Systems",
    detail: "Extracted 14 tender requirements and compared against 4 submitted PDFs (154 pages total)."
  },
  {
    id: "AUD-1081",
    timestamp: "2026-09-08 14:18:04 IST",
    officer: "TenderIQ Automated Rule Engine",
    action: "Rule Check Flagged Address Discrepancy",
    bidder: "Bharat Forge Energy Systems",
    detail: "CLS-002: CA Stamp branch address (Pune) differed from GeM profile address (Mumbai HQ)."
  },
  {
    id: "AUD-1080",
    timestamp: "2026-09-08 14:32:40 IST",
    officer: "Rajesh Kumar Verma (CPCL-CGM)",
    action: "Officer Manual Note Appended",
    bidder: "Bharat Forge Energy Systems",
    detail: "Requested bidder to submit branch consolidation letter under GeM Representation window."
  }
];