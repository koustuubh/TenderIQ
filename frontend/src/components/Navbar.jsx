import React from 'react';
import { IndianEmblem } from '../assets/Emblem.jsx';
import { Search, Bell, ShieldCheck, Award } from 'lucide-react';
import { currentOfficer } from '../data/mockData';

// Tricolor Hamburger Icon (Indian Flag three stripes - saffron, white, green)
const TricolorHamburger = () => (
  <div className="flex flex-col space-y-1 w-6">
    <div className="h-[3.5px] rounded-full bg-[#FF9933]" />
    <div className="h-[3.5px] rounded-full bg-white border border-gray-200" />
    <div className="h-[3.5px] rounded-full bg-[#138808]" />
  </div>
);

export const Navbar = ({ activeTab, setActiveTab, onLogout, currentLang, onMenuOpen }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Left: Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <IndianEmblem className="w-10 h-12" />
            </div>
            <div className="border-l-2 border-gray-200 pl-3 py-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-[#0B2545] tracking-tight">
                  Tender<span className="text-[#FF9933]">IQ</span>
                </span>
                <span className="bg-[#FFF5EB] text-[#E67300] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FF9933]/30 uppercase hidden sm:inline">
                  GeM AI Suite
                </span>
                <span className="bg-blue-50 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200 hidden lg:inline-flex items-center">
                  <Award className="w-3 h-3 mr-1 text-[#FF9933]" />
                  SIH 2026 • Group Trinethra
                </span>
              </div>
              <div className="text-[10px] text-gray-500 font-medium hidden sm:block">
                Chennai Petroleum Corp. Ltd (CPCL) & GeM Bid Compliance Platform
              </div>
            </div>
          </div>

          {/* Center: Search Bar (hidden on small screens) */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
            <div className="w-full relative flex rounded-lg shadow-sm border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0B2545]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Tenders, PAN/GSTIN..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 focus:bg-white focus:outline-none"
                />
              </div>
              <button className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-semibold px-3 py-2 transition">
                Search
              </button>
            </div>
          </div>

          {/* Right: Officer Info + Tricolor Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Officer badge - hidden on small screens */}
            <div className="hidden sm:flex items-center space-x-2 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-[#0B2545] flex items-center justify-center text-white font-bold text-xs ring-1 ring-[#FF9933]">
                RK
              </div>
              <div className="text-left hidden md:block">
                <div className="text-[11px] font-bold text-gray-900 flex items-center">
                  <span>{currentOfficer.name}</span>
                  <ShieldCheck className="w-3 h-3 ml-1 text-[#138808]" />
                </div>
                <div className="text-[10px] text-gray-500">CGM (Contracts) • CPCL</div>
              </div>
            </div>

            {/* Tricolor Hamburger Menu Button */}
            <button
              onClick={onMenuOpen}
              title="Open Navigation Menu"
              className="bg-[#0B2545] hover:bg-[#133B6B] px-3 py-2.5 rounded-lg transition flex items-center justify-center shadow border border-[#0B2545]"
              aria-label="Open navigation menu"
            >
              <TricolorHamburger />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;