import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

export const ScoreCard = ({ 
  score = 82, 
  riskLevel = "Medium", 
  passedCount = 11, 
  reviewCount = 2, 
  failedCount = 0, 
  missingCount = 1,
  companyName = "Bidder"
}) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">AI Compliance & Risk Engine</span>
          <h3 className="text-sm font-bold text-gray-900">{companyName}</h3>
        </div>
        <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border text-xs font-bold ${
          riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
          riskLevel === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-red-50 text-red-800 border-red-300'
        }`}>
          {riskLevel === 'Low' ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          <span>{riskLevel} Risk</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} strokeWidth="10" stroke="#f1f5f9" fill="transparent" />
              <circle
                cx="50" cy="50" r={radius}
                stroke={score >= 85 ? '#10B981' : score >= 65 ? '#F59E0B' : '#EF4444'}
                strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-gray-900">{score}%</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">Score</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-800">
              {score >= 85 ? 'High Probable Qualification' : 'Subject to Officer Clarification'}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 max-w-[200px]">
              Hybrid evaluation from tender requirements and bidder dossiers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2 text-center min-w-[70px]">
            <span className="text-xs font-black text-emerald-700 block">{passedCount}</span>
            <span className="text-[10px] text-emerald-800 font-medium">Compliant</span>
          </div>
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2 text-center min-w-[70px]">
            <span className="text-xs font-black text-amber-800 block">{reviewCount}</span>
            <span className="text-[10px] text-amber-900 font-medium">Review Req.</span>
          </div>
          <div className="bg-red-50/70 border border-red-200 rounded-lg p-2 text-center min-w-[70px]">
            <span className="text-xs font-black text-red-700 block">{failedCount}</span>
            <span className="text-[10px] text-red-800 font-medium">Failed</span>
          </div>
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-2 text-center min-w-[70px]">
            <span className="text-xs font-black text-slate-700 block">{missingCount}</span>
            <span className="text-[10px] text-slate-700 font-medium">Missing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScoreCard;