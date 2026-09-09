import React from 'react';
import { Building2, FileText, Users, CheckCircle, Clock, AlertTriangle, ArrowRight, ChevronRight, Flame, FileUp, Files, CheckCircle2, FileCheck } from 'lucide-react';
import { sampleTenders, nationalPortalStats } from '../data/mockData';
import { HeroSlider } from '../components/HeroSlider.jsx';

// Horizontal pipeline stepper
const PIPELINE_STEPS = [
  { id: 'tender-upload', label: 'Tender Ingestion', sublabel: 'Requirements Extracted', icon: FileUp, status: 'completed' },
  { id: 'bidder-docs', label: 'Bidder Dossiers', sublabel: 'OCR & Text Extraction', icon: Files, status: 'completed' },
  { id: 'verification', label: 'Cross-Verification', sublabel: 'Rules + AI Engine', icon: CheckCircle2, status: 'active' },
  { id: 'final-decision', label: 'Officer Decision', sublabel: 'Human-in-the-Loop', icon: FileCheck, status: 'pending' },
];

const stepColor = {
  completed: 'bg-[#138808] text-white border-[#138808]',
  active: 'bg-[#FF9933] text-black border-[#FF9933]',
  pending: 'bg-white text-gray-400 border-gray-300',
};

const stepConnector = {
  completed: 'bg-[#138808]',
  active: 'bg-gradient-to-r from-[#138808] to-[#FF9933]',
  pending: 'bg-gray-200',
};

const STATS = [
  { label: 'Tenders Evaluated', value: nationalPortalStats?.tendersEvaluated?.toLocaleString?.() || '1,240', color: 'text-gray-900' },
  { label: 'Active CPCL Bids', value: nationalPortalStats?.activeCPCLBids?.toLocaleString?.() || '18', color: 'text-gray-900' },
  { label: 'Verified Bidders', value: nationalPortalStats?.verifiedBidders?.toLocaleString?.() || '96', color: 'text-gray-900' },
  { label: 'Avg Compliance', value: nationalPortalStats?.complianceRate || '94.2%', color: 'text-emerald-600' },
  { label: 'Time Saved', value: nationalPortalStats?.avgTimeReduction || '72%', color: 'text-purple-700' },
  { label: 'Risk Flags Averted', value: nationalPortalStats?.disqualifiedFlagged || '31', color: 'text-red-600' },
];

export const Dashboard = ({ setActiveTab, setSelectedTenderId }) => {
  return (
    <div className="space-y-8 pb-10" id="main-content">

      {/* 1. Animated National Monument Hero Slider with centered search & PM quote */}
      <HeroSlider setActiveTab={setActiveTab} setSelectedTenderId={setSelectedTenderId} />

      {/* 2. Horizontal Pipeline Stepper */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 sm:px-6 py-5">
        <div className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-4">
          End-to-End Verification Pipeline
        </div>
        <div className="flex items-center">
          {PIPELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === PIPELINE_STEPS.length - 1;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveTab(step.id)}
                  className="flex flex-col items-center group min-w-0"
                  style={{ flex: '0 0 auto' }}
                >
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${stepColor[step.status]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="mt-1.5 text-center hidden sm:block max-w-[80px]">
                    <div className={`text-[11px] font-bold truncate ${step.status === 'active' ? 'text-[#FF9933]' : step.status === 'completed' ? 'text-[#138808]' : 'text-gray-400'}`}>
                      {step.label}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">{step.sublabel}</div>
                  </div>
                  <div className="mt-1.5 sm:hidden text-center max-w-[52px]">
                    <div className={`text-[9px] font-bold truncate ${step.status === 'active' ? 'text-[#FF9933]' : step.status === 'completed' ? 'text-[#138808]' : 'text-gray-400'}`}>
                      {step.label.split(' ')[0]}
                    </div>
                  </div>
                </button>
                {!isLast && (
                  <div className={`flex-1 h-1 rounded-full mx-2 transition-all ${stepConnector[step.status]}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 4. High Priority Action Card */}
      <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            <span>High Priority Tender Evaluation</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black">CPCL High-Pressure Hydrocracker Piping Tender (₹ 48.50 Cr)</h2>
          <p className="text-xs text-red-100">4 Bidders submitted. 14 clauses extracted. AI cross-verification flagged 1 review and 1 non-compliant bidder.</p>
        </div>
        <button
          onClick={() => { if (setSelectedTenderId) setSelectedTenderId('CPCL-2026-T890'); setActiveTab('verification'); }}
          className="shrink-0 bg-white text-[#D32F2F] hover:bg-gray-100 px-5 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center space-x-2 transition"
        >
          <span>Open AI Verification Matrix</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Active Tenders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Active GeM Tenders Under Technical Verification (CPCL)</h3>
          <span className="text-[11px] text-gray-400 font-medium">Click "Verify" to open AI audit matrix</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-600 uppercase border-b tracking-wide">
              <tr>
                <th className="py-3 px-4">Tender ID & GeM Bid</th>
                <th className="py-3 px-4">Work / Title</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Bidders</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(sampleTenders || []).map(tender => (
                <tr key={tender.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0B2545]">
                    {tender.id}
                    <div className="text-gray-500 font-normal">{tender.gemBidNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{tender.title}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">{tender.estimatedValue}</td>
                  <td className="py-3.5 px-4 text-gray-700">{tender.totalBidders} Bidders</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      {tender.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => { if (setSelectedTenderId) setSelectedTenderId(tender.id); setActiveTab('verification'); }}
                      className="font-bold text-[#0B2545] hover:text-[#FF9933] inline-flex items-center transition"
                    >
                      <span>Verify</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;