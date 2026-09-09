import React, { useState } from 'react';
import { 
  FileUp, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  AlertCircle,
  FileCheck,
  RefreshCw,
  Building,
  Check
} from 'lucide-react';
import { selectedTenderDetails } from '../data/mockData';

export const TenderUpload = ({ setActiveTab }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parsingComplete, setParsingComplete] = useState(true);
  const [selectedFile, setSelectedFile] = useState(selectedTenderDetails.tenderDocumentName);

  const simulateExtraction = () => {
    setIsParsing(true);
    setParsingComplete(false);
    setTimeout(() => {
      setIsParsing(false);
      setParsingComplete(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <span className="bg-[#FF9933] text-black px-2 py-0.5 rounded text-[10px]">
              Pipeline Step 1 of 4
            </span>
            <span>Tender Ingestion & Clause Extraction</span>
          </div>
          <h2 className="text-xl font-black text-gray-900">
            Tender Document Ingestion & AI Clause Parser
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Upload Notice Inviting Tender (NIT) or GeM RFP document to automatically extract technical, financial & statutory compliance rules.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('bidder-docs')}
          className="bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-sm transition-all"
        >
          <span>Proceed to Bidder Dossiers</span>
          <ArrowRight className="w-4 h-4 text-[#FF9933]" />
        </button>
      </div>

      {/* Upload Box / Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <FileUp className="w-4 h-4 mr-2 text-gov-navy" />
            Upload Tender RFP Document
          </h3>

          <div 
            onClick={simulateExtraction}
            className="border-2 border-dashed border-gov-navy/30 rounded-xl p-6 text-center hover:border-gov-navy hover:bg-blue-50/20 cursor-pointer transition-all bg-gray-50"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-gov-navy flex items-center justify-center mx-auto mb-3">
              <FileUp className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-gray-800">
              Drag & Drop Tender PDF
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Supports CPCL / GeM NIT formats (PDF up to 100MB)
            </p>
            <div className="mt-3 inline-block bg-white text-gov-navy border border-gray-300 text-[11px] font-semibold px-3 py-1 rounded shadow-xs">
              Browse Local Files
            </div>
          </div>

          {/* Pre-loaded sample info */}
          <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-gray-600 font-medium">
              <span>Active File:</span>
              <span className="font-mono text-[11px] text-gov-navy font-bold truncate max-w-[170px]">
                {selectedFile}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-600 font-medium">
              <span>GeM Bid No:</span>
              <span className="font-mono text-[11px] font-bold text-gray-800">GEM/2026/B/9821471</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 font-medium">
              <span>Organization:</span>
              <span className="font-semibold text-gray-800">CPCL Manali Refinery</span>
            </div>
          </div>

          <button
            onClick={simulateExtraction}
            disabled={isParsing}
            className="w-full bg-gov-saffron text-black hover:bg-gov-saffron-dark font-bold text-xs py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            {isParsing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running AI Clause Extraction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Re-Extract Requirements</span>
              </>
            )}
          </button>
        </div>

        {/* Extracted Criteria & Categories Overview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <Cpu className="w-4 h-4 mr-2 text-gov-navy" />
                AI-Extracted Compliance Schema
              </h3>
              <p className="text-xs text-gray-500">
                14 Mandatory & Optional Verification Clauses Generated from CPCL Tender
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center">
                <Check className="w-3.5 h-3.5 mr-1" />
                Extraction 100% Complete
              </span>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedTenderDetails.criteriaCategories.map((cat, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-800 flex items-center">
                    <span>{cat.name}</span>
                    {cat.mandatory && (
                      <span className="ml-2 text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">
                        MANDATORY
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {cat.count} clauses formulated for automated verification
                  </p>
                </div>
                <span className="font-mono font-black text-gov-navy text-sm bg-white px-2 py-0.5 rounded border">
                  0{cat.count}
                </span>
              </div>
            ))}
          </div>

          {/* Sample Clauses Table Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>Extracted Clause Summary Preview</span>
              <span className="text-[11px] font-mono text-gray-500">Target: All 4 Submitted Bidders</span>
            </div>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="p-3 hover:bg-gray-50 flex items-start space-x-3">
                <span className="font-mono text-xs font-bold text-gov-navy bg-gray-200 px-1.5 py-0.5 rounded">
                  CLS-001
                </span>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">Hydrocracker Piping Commissioning Experience</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    Completed at least 1 similar hydrocracker piping work worth &gt;= ₹ 38.80 Crore in PSU refinery within 7 years.
                  </div>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                  Technical
                </span>
              </div>

              <div className="p-3 hover:bg-gray-50 flex items-start space-x-3">
                <span className="font-mono text-xs font-bold text-gov-navy bg-gray-200 px-1.5 py-0.5 rounded">
                  CLS-002
                </span>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">Minimum Average Annual Turnover (FY23, FY24, FY25)</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    Average annual turnover &gt;= ₹ 14.55 Crore with valid CA UDIN certification.
                  </div>
                </div>
                <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded">
                  Financial
                </span>
              </div>

              <div className="p-3 hover:bg-gray-50 flex items-start space-x-3">
                <span className="font-mono text-xs font-bold text-gov-navy bg-gray-200 px-1.5 py-0.5 rounded">
                  CLS-003
                </span>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">Class-I Local Supplier (Make in India Order 2017)</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    Local content requirement &gt;= 50% with manufacturing location declaration.
                  </div>
                </div>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded">
                  MII Statutory
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TenderUpload;