import React, { useState } from 'react';
import { Search, ArrowRight, ChevronRight } from 'lucide-react';
import { ScoreCard } from '../components/ScoreCard';
import { EvidenceCard } from '../components/EvidenceCard';
import { StatusBadge } from '../components/StatusBadge';
import { verificationClauses, biddersList } from '../data/mockData';

export const Verification = ({ setActiveTab, selectedBidderId = 'BID-02' }) => {
  const [currentBidderId, setCurrentBidderId] = useState(selectedBidderId);
  const activeBidder = biddersList.find(b => b.id === currentBidderId) || biddersList[1];
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [clauses, setClauses] = useState(verificationClauses);

  const handleOverrideStatus = (clauseId, newStatus, reason) => {
    setClauses(prev => prev.map(c => c.id === clauseId ? {
      ...c, bidderEvidence: { ...c.bidderEvidence, status: newStatus, officerOverride: true, officerNote: reason }
    } : c));
  };

  const filteredClauses = clauses.filter(c => {
    const status = c.bidderEvidence.status.toLowerCase();
    const matchesFilter = activeFilter === 'all' ? true :
      activeFilter === 'compliant' ? status === 'compliant' :
      activeFilter === 'review' ? status.includes('review') :
      activeFilter === 'non-compliant' ? status.includes('non') : true;
    return matchesFilter && c.clauseTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <span className="bg-[#FF9933] text-black px-2 py-0.5 rounded text-[10px] mr-2">Step 3 of 4</span>
            Deterministic Rules & AI Cross-Verification
          </div>
          <h2 className="text-xl font-black text-gray-900">Bid Compliance Verification Matrix</h2>
        </div>
        <button onClick={() => setActiveTab('final-decision')} className="bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2">
          <span>Proceed to Final Decision</span><ArrowRight className="w-4 h-4 text-[#FF9933]" />
        </button>
      </div>

      {/* Bidder Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {biddersList.map(bidder => (
          <button
            key={bidder.id}
            onClick={() => setCurrentBidderId(bidder.id)}
            className={`text-left p-3 rounded-lg border transition-all ${
              bidder.id === currentBidderId ? 'border-gov-navy bg-blue-50/60 ring-2 ring-gov-navy' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs truncate">{bidder.companyName}</span>
              <StatusBadge status={bidder.status} size="sm" showIcon={false} />
            </div>
            <div className="text-[11px] text-gray-500 flex justify-between">
              <span>{bidder.gemSellerId}</span>
              <span className="font-bold text-gov-navy">{bidder.complianceScore}%</span>
            </div>
          </button>
        ))}
      </div>

      <ScoreCard
        score={activeBidder.complianceScore}
        riskLevel={activeBidder.riskLevel}
        companyName={activeBidder.companyName}
        passedCount={activeBidder.passed}
        reviewCount={activeBidder.reviewNeeded}
        failedCount={activeBidder.failed}
        missingCount={activeBidder.missing}
      />

      {/* Filter toolbar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1">
          {['all', 'compliant', 'review', 'non-compliant'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold capitalize ${
                activeFilter === f ? 'bg-gov-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Filter clauses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-xs border rounded-lg px-3 py-1.5 bg-gray-50"
        />
      </div>

      {/* List of Evidence Cards */}
      <div className="space-y-4">
        {filteredClauses.map(clause => (
          <EvidenceCard key={clause.id} clause={clause} onOverrideStatus={handleOverrideStatus} />
        ))}
      </div>
    </div>
  );
};
export default Verification;