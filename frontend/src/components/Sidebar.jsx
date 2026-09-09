import React from 'react';
import { 
  LayoutDashboard, 
  FileUp, 
  Files, 
  CheckCircle2, 
  FileCheck, 
  History, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Info
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, currentStep = 1 }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard & Overview',
      hiLabel: 'डैशबोर्ड एवं अवलोकन',
      icon: LayoutDashboard,
      badge: 'Home'
    },
    {
      id: 'tender-upload',
      stepNumber: 1,
      label: '1. Tender Ingestion',
      sublabel: 'Requirements Extracted',
      hiLabel: '1. निविदा दस्तावेज अपलोड',
      icon: FileUp,
      status: 'completed'
    },
    {
      id: 'bidder-docs',
      stepNumber: 2,
      label: '2. Bidder Dossiers',
      sublabel: 'OCR & Text Extraction',
      hiLabel: '2. बोलीदाता दस्तावेज व OCR',
      icon: Files,
      status: 'completed'
    },
    {
      id: 'verification',
      stepNumber: 3,
      label: '3. Cross-Verification',
      sublabel: 'Rules + AI Engine',
      hiLabel: '3. एआई अनुपालन सत्यापन',
      icon: CheckCircle2,
      status: 'active',
      highlight: true
    },
    {
      id: 'final-decision',
      stepNumber: 4,
      label: '4. Officer Final Decision',
      sublabel: 'Human-in-the-Loop Signoff',
      hiLabel: '4. अंतिम निर्णय एवं अनुमोदन',
      icon: FileCheck,
      status: 'pending'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] flex flex-col justify-between shadow-sm">
      <div className="p-4">
        {/* Tender Context Card */}
        <div className="mb-5 p-3 rounded-lg bg-gradient-to-br from-[#0B2545]/5 to-[#FF9933]/10 border border-gov-navy/15">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-gov-navy uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5 text-gov-saffron-dark" />
            <span>Active Tender Scope</span>
          </div>
          <p className="text-xs font-bold text-gray-900 line-clamp-2">
            CPCL Manali Refinery: Hydrocracker Loops Expansion
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600">
            <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border">
              GEM/2026/B/9821471
            </span>
            <span className="text-gov-green font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gov-green mr-1 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>

        {/* Navigation Step Header */}
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
          End-to-End Verification Pipeline
        </div>

        {/* Steps List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gov-navy text-white shadow-md font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gov-navy'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-md ${
                    isActive ? 'bg-[#FF9933] text-black' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="leading-tight">{item.label}</div>
                    {item.sublabel && (
                      <div className={`text-[10px] font-normal ${
                        isActive ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {item.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-ping"></span>
                )}
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-[#FF9933]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: SIH & GFR Compliance badge */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-[11px] text-gray-600">
        <div className="flex items-center space-x-2 text-gov-navy font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-gov-green" />
          <span>GFR 2017 & CVC Audited</span>
        </div>
        <p className="text-[10px] text-gray-500 leading-snug">
          Deterministic Rule Engine + Explainable AI Verification with 100% human-in-the-loop oversight.
        </p>
        <div className="mt-2 text-[9px] text-gray-400 font-mono">
          Engine Version: v2.4-SIH26100
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;