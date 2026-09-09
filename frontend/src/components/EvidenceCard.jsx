import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { FileText, ExternalLink, Cpu, Check, MessageSquare, Edit3, Bookmark } from 'lucide-react';

export const EvidenceCard = ({ clause, onOverrideStatus, onAddNote }) => {
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [officerNote, setOfficerNote] = useState('');
  const [localStatus, setLocalStatus] = useState(clause.bidderEvidence.status);

  const handleStatusChange = (newStatus) => {
    setLocalStatus(newStatus);
    if (onOverrideStatus) onOverrideStatus(clause.id, newStatus, officerNote);
    setShowOverrideInput(false);
  };

  return (
    <div className={`bg-white rounded-xl border p-4 space-y-4 shadow-sm ${
      localStatus === 'Needs Review' ? 'border-amber-300' :
      localStatus === 'Non-Compliant' ? 'border-red-300' : 'border-gray-200'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-gov-navy bg-gov-navy/10 px-2 py-0.5 rounded">
            {clause.id}
          </span>
          <span className="text-xs font-semibold text-gray-500">{clause.category}</span>
          {clause.mandatory && (
            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
              MANDATORY
            </span>
          )}
        </div>
        <StatusBadge status={localStatus} size="sm" />
      </div>

      <h4 className="text-sm font-bold text-gray-900">{clause.clauseTitle}</h4>

      {/* 2-Column Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Column 1: Tender Requirement */}
        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gov-navy mb-1">
            <Bookmark className="w-3.5 h-3.5 text-gov-saffron-dark" />
            <span>Extracted Tender Requirement</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{clause.tenderRequirement}</p>
        </div>

        {/* Column 2: Bidder Evidence */}
        <div className="bg-blue-50/40 rounded-lg p-3.5 border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-900 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Bidder Evidence (OCR Extracted)
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              {clause.bidderEvidence.documentName} • Pg {clause.bidderEvidence.pageNumber}
            </span>
          </div>
          <blockquote className="text-xs text-gray-800 bg-white p-2.5 rounded border border-blue-100 font-mono">
            "{clause.bidderEvidence.ocrSnippet}"
          </blockquote>
          <div className="mt-2 text-[11px] flex justify-between">
            <span className="text-gray-500 font-semibold">Rule Result:</span>
            <span className="font-mono text-emerald-700 font-bold">{clause.bidderEvidence.ruleCheck}</span>
          </div>
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs">
        <div className="flex justify-between font-bold text-gray-800 mb-1">
          <span className="flex items-center"><Cpu className="w-3.5 h-3.5 mr-1" /> AI Reasoning:</span>
          <span>Confidence: {clause.bidderEvidence.aiConfidence}%</span>
        </div>
        <p className="text-gray-600">{clause.bidderEvidence.aiReasoning}</p>
      </div>

      {/* Officer Oversight Buttons */}
      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
        <button onClick={() => handleStatusChange('Compliant')} className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
          Accept AI
        </button>
        <button onClick={() => setShowOverrideInput(!showOverrideInput)} className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded border">
          Override Status
        </button>
      </div>
    </div>
  );
};
export default EvidenceCard;