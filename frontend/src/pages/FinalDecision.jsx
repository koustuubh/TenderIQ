import React, { useState } from 'react';
import { ShieldCheck, Printer, Download, KeyRound, History, Send, CheckCircle2, Check } from 'lucide-react';
import { currentOfficer, biddersList, mockAuditLogs } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import confetti from 'canvas-confetti';

export const FinalDecision = ({ setActiveTab }) => {
  const [selectedBidderId, setSelectedBidderId] = useState('BID-02');
  const [decision, setDecision] = useState('clarification');
  const [remarks, setRemarks] = useState('CA certificate address mismatch noted. Bidder granted 48 hours to submit branch consolidation affidavit through GeM representation portal.');
  const [isSigned, setIsSigned] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeBidder = biddersList.find(b => b.id === selectedBidderId) || biddersList[1];

  const handleSubmitGeM = () => {
    setIsSubmitted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <span className="bg-[#FF9933] text-black px-2 py-0.5 rounded text-[10px] mr-2">Step 4 of 4</span>
            Procurement Officer Decision & Sign-off
          </div>
          <h2 className="text-xl font-black text-gray-900">Technical Evaluation Final Decision & Audit Log</h2>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => window.print()} className="text-xs font-semibold bg-gray-100 border px-3 py-2 rounded-lg flex items-center space-x-1"><Printer className="w-4 h-4" /><span>Print</span></button>
          <button onClick={() => alert("Downloading CPCL_GeM_Report.pdf")} className="text-xs font-semibold bg-blue-50 text-gov-navy border border-blue-200 px-3 py-2 rounded-lg flex items-center space-x-1"><Download className="w-4 h-4" /><span>PDF</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <select value={selectedBidderId} onChange={(e) => setSelectedBidderId(e.target.value)} className="w-full text-xs font-semibold border rounded-lg p-2.5 bg-gray-50">
            {biddersList.map(b => (
              <option key={b.id} value={b.id}>{b.companyName} — ({b.status} • {b.complianceScore}% Score)</option>
            ))}
          </select>

          {/* Verdict radio choices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['qualified', 'clarification', 'disqualified'].map(d => (
              <label key={d} className={`p-3 rounded-xl border cursor-pointer capitalize text-xs font-bold ${
                decision === d ? 'border-gov-navy bg-blue-50 ring-2 ring-gov-navy' : 'border-gray-200'
              }`}>
                <input type="radio" name="decision" checked={decision === d} onChange={() => setDecision(d)} className="mr-2" />
                {d.replace('-', ' ')}
              </label>
            ))}
          </div>

          <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full text-xs border rounded-lg p-3 bg-gray-50" placeholder="Committee rationale..." />

          {/* DSC token box */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/40 rounded-xl border flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <KeyRound className="w-6 h-6 text-[#FF9933]" />
              <div>
                <div className="text-xs font-bold">{currentOfficer.name}</div>
                <div className="text-[11px] text-gray-500">eMudhra Class 3 DSC • Valid till 2027</div>
              </div>
            </div>
            <button onClick={() => setIsSigned(true)} disabled={isSigned} className={`text-xs font-bold px-4 py-2 rounded-lg ${
              isSigned ? 'bg-emerald-600 text-white' : 'bg-gov-navy text-white'
            }`}>
              {isSigned ? 'DSC Cryptographically Signed' : 'Sign with DSC Token'}
            </button>
          </div>

          <button onClick={handleSubmitGeM} disabled={!isSigned || isSubmitted} className="w-full py-3 rounded-xl text-xs font-bold bg-[#D32F2F] text-white disabled:opacity-50 flex items-center justify-center space-x-2">
            <Send className="w-4 h-4" /><span>{isSubmitted ? 'Published to GeM Portal!' : 'Publish Decision to GeM Portal'}</span>
          </button>
        </div>

        {/* Central Audit Trail Timeline */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center">
            <History className="w-4 h-4 mr-1.5 text-gov-navy" /> Central Audit Trail (SIH Requirement)
          </h3>
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {mockAuditLogs.map(log => (
              <div key={log.id} className="relative">
                <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-gov-navy"></span>
                <div className="bg-gray-50 p-3 rounded-lg border text-xs space-y-1">
                  <div className="font-bold">{log.action}</div>
                  <p className="text-[11px] text-gray-600">{log.detail}</p>
                  <div className="text-[10px] text-gray-400">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FinalDecision;