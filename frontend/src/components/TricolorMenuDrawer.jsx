import React from 'react';
import {
  LayoutDashboard, FileUp, Files, CheckCircle2, FileCheck,
  X, ShieldCheck, Building2, User, LogOut, ChevronRight,
  AlertCircle, Clock
} from 'lucide-react';
import { currentOfficer } from '../data/mockData';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard & Overview',
    sublabel: 'Home & Statistics',
    icon: LayoutDashboard,
    status: 'home',
    badge: null
  },
  {
    id: 'tender-upload',
    label: '1. Tender Ingestion',
    sublabel: 'Requirements Extracted',
    icon: FileUp,
    status: 'completed',
    badge: 'Done'
  },
  {
    id: 'bidder-docs',
    label: '2. Bidder Dossiers',
    sublabel: 'OCR & Text Extraction',
    icon: Files,
    status: 'completed',
    badge: 'Done'
  },
  {
    id: 'verification',
    label: '3. Cross-Verification',
    sublabel: 'Rules + AI Engine',
    icon: CheckCircle2,
    status: 'active',
    badge: '1 Flag'
  },
  {
    id: 'final-decision',
    label: '4. Officer Final Decision',
    sublabel: 'Human-in-the-Loop Signoff',
    icon: FileCheck,
    status: 'pending',
    badge: null
  }
];

const statusColors = {
  completed: 'bg-[#138808] text-white',
  active: 'bg-[#FF9933] text-black',
  pending: 'bg-gray-300 text-gray-600',
  home: 'bg-[#000080] text-white'
};

export const TricolorMenuDrawer = ({ isOpen, onClose, activeTab, setActiveTab, onLogout }) => {
  const handleNav = (id) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] sm:w-[340px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Tricolor stripe at top */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white border-t border-b border-gray-200" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        {/* Header */}
        <div className="bg-[#0B2545] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-base font-black tracking-tight">
              Tender<span className="text-[#FF9933]">IQ</span> Menu
            </div>
            <div className="text-[11px] text-gray-300">End-to-End Verification Pipeline</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Tender Scope */}
        <div className="bg-[#FFF5EB] border-b border-orange-100 px-5 py-3">
          <div className="flex items-center space-x-2 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="text-[10px] font-bold uppercase text-[#FF9933] tracking-wider">Active Tender Scope</span>
            <span className="ml-auto bg-[#138808] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
              Live
            </span>
          </div>
          <div className="text-xs font-bold text-gray-900">CPCL Manali Refinery:</div>
          <div className="text-xs font-semibold text-gray-700">Hydrocracker Loops Expansion</div>
          <div className="text-[11px] text-gray-500 mt-0.5">GEM/2026/B/98214/1</div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-4 pb-2">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Navigation</span>
          </div>
          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-150 group ${
                      isActive
                        ? 'bg-[#0B2545] text-white shadow-md'
                        : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/15' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF9933]' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-gray-800'}`}>
                        {item.label}
                      </div>
                      <div className={`text-[11px] truncate ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                        {item.sublabel}
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive ? statusColors.home : statusColors[item.status]
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-gray-300' : 'text-gray-300'}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Officer Profile & Logout at bottom */}
        <div className="border-t border-gray-200 px-5 py-4 bg-gray-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#0B2545] flex items-center justify-center text-white font-bold text-sm ring-2 ring-[#FF9933] shrink-0">
              RK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate flex items-center">
                {currentOfficer.name}
                <ShieldCheck className="w-3.5 h-3.5 ml-1 text-[#138808]" />
              </div>
              <div className="text-[11px] text-gray-500">CGM (Contracts) • CPCL</div>
            </div>
          </div>
          <button
            onClick={() => { onLogout && onLogout(); onClose(); }}
            className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold py-2.5 px-4 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Tricolor stripe at bottom */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white border-t border-b border-gray-200" />
          <div className="flex-1 bg-[#138808]" />
        </div>
      </div>
    </>
  );
};

export default TricolorMenuDrawer;
