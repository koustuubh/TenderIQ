import React, { useState } from 'react';
import { 
  Files, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  FileSearch, 
  ArrowRight, 
  Search, 
  RefreshCw,
  Building,
  Upload,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { biddersList } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';

export const BidderDocuments = ({ setActiveTab, setSelectedBidderId }) => {
  const [activeBidder, setActiveBidder] = useState(biddersList[1]); // Default to Bharat Forge
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBidders = biddersList.filter(b => 
    b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.gemSellerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <span className="bg-[#FF9933] text-black px-2 py-0.5 rounded text-[10px]">
              Pipeline Step 2 of 4
            </span>
            <span>Multi-Bidder Dossier & OCR Pipeline</span>
          </div>
          <h2 className="text-xl font-black text-gray-900">
            Bidder Submissions & OCR Document Ingestion
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            4 Vendor bids received for CPCL Hydrocracker Piping Tender. Documents ingested, parsed, and indexed with page citations.
          </p>
        </div>

        <button
          onClick={() => {
            if (setSelectedBidderId) setSelectedBidderId(activeBidder.id);
            setActiveTab('verification');
          }}
          className="bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-sm transition-all"
        >
          <span>Proceed to Cross-Verification</span>
          <ArrowRight className="w-4 h-4 text-[#FF9933]" />
        </button>
      </div>

      {/* Main Grid: Bidders List (Left) & Document Inspection (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bidders Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filter bidders by name or GeM Seller ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
              />
            </div>

            <div className="space-y-2.5">
              {filteredBidders.map((bidder) => {
                const isSelected = activeBidder.id === bidder.id;
                return (
                  <div
                    key={bidder.id}
                    onClick={() => setActiveBidder(bidder)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-gov-navy bg-blue-50/50 shadow-sm ring-1 ring-gov-navy' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-gray-900 leading-tight">
                          {bidder.companyName}
                        </div>
                        <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                          {bidder.gemSellerId} • {bidder.documentsSubmitted.length} PDFs
                        </div>
                      </div>
                      <StatusBadge status={bidder.status} size="sm" />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-gray-600 pt-2 border-t border-gray-100">
                      <span>Score: <strong className="text-gov-navy font-bold">{bidder.complianceScore}%</strong></span>
                      <span className="text-[10px] text-gray-400">{bidder.bidSubmitDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Bidder Dossier Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Selected Bidder Dossier
                </span>
                <h3 className="text-base font-black text-gray-900">
                  {activeBidder.companyName}
                </h3>
                <div className="text-xs text-gray-500 mt-0.5">
                  GeM Seller Account: <span className="font-mono font-semibold text-gray-700">{activeBidder.gemSellerId}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (setSelectedBidderId) setSelectedBidderId(activeBidder.id);
                  setActiveTab('verification');
                }}
                className="bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm"
              >
                <span>Launch Cross-Verification</span>
                <ChevronRight className="w-4 h-4 text-[#FF9933]" />
              </button>
            </div>

            {/* Ingestion & OCR Status Card */}
            <div className="bg-gradient-to-r from-blue-50/80 to-slate-50 p-4 rounded-xl border border-blue-200/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gov-navy flex items-center">
                  <FileSearch className="w-4 h-4 mr-1.5 text-blue-700" />
                  OCR Text Extraction Engine
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Status: Pipeline Healthy
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                All submitted PDFs have undergone dual-pass OCR (Tesseract + LayoutLM) to extract tabular financial data,
                stamps, signatures, and technical clauses with page-accurate indexing.
              </p>
            </div>

            {/* Documents Submitted List */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                Submitted Documents & Verification Status
              </h4>

              <div className="space-y-2.5">
                {activeBidder.documentsSubmitted.map((doc, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-100/70 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded border border-gray-200 text-red-600 shadow-2xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 line-clamp-1">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {doc.pages} Pages • Dual OCR Layer • PDF/A Format
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        doc.ocrStatus.includes('Warning') 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}>
                        {doc.ocrStatus}
                      </span>
                      <button 
                        onClick={() => alert(`Opening document preview for ${doc.name}`)}
                        className="text-gray-400 hover:text-gov-navy p-1"
                        title="View Document"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bidder Pre-Verification Findings Summary */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-gray-700 space-y-1">
              <div className="font-bold text-gray-900">Automated Dossier Audit Note:</div>
              <p className="text-[11.5px] leading-relaxed text-gray-600">
                {activeBidder.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BidderDocuments;