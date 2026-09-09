import React, { useState, useEffect } from 'react';
import { IndianFlag } from '../assets/Emblem.jsx';
import { Calendar, Eye, Globe } from 'lucide-react';

export const GovTopBar = ({ currentLang, setLang, fontSize, setFontSize }) => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('en-IN', {
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
      }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#102A43] text-gray-200 text-xs border-b border-gray-700">
      <div className="tiranga-stripe"></div>
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <IndianFlag className="w-5 h-3.5" />
          <span className="font-semibold text-white tracking-wide">
            {currentLang === 'hi' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300 hidden sm:inline">
            Ministry of Petroleum & Natural Gas (CPCL)
          </span>
          <span className="text-gray-400 hidden md:inline">|</span>
          <span className="text-[#FF9933] font-medium hidden md:inline">
            GeM Procurement Portal
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <div className="hidden md:flex items-center space-x-1 text-gray-300">
            <Calendar className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>{currentDateTime}</span>
          </div>
          <span className="text-gray-500 hidden md:inline">|</span>
          <div className="flex items-center space-x-1 bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700">
            <button onClick={() => setFontSize('sm')} className={`px-1 rounded ${fontSize === 'sm' ? 'bg-[#FF9933] text-black font-bold' : 'text-gray-300'}`}>A-</button>
            <button onClick={() => setFontSize('md')} className={`px-1 rounded ${fontSize === 'md' ? 'bg-[#FF9933] text-black font-bold' : 'text-gray-300'}`}>A</button>
            <button onClick={() => setFontSize('lg')} className={`px-1 rounded ${fontSize === 'lg' ? 'bg-[#FF9933] text-black font-bold' : 'text-gray-300'}`}>A+</button>
          </div>
          <div className="flex items-center space-x-1 bg-[#000080]/80 px-2 py-0.5 rounded border border-blue-600">
            <Globe className="w-3 h-3 text-[#FF9933]" />
            <button onClick={() => setLang(currentLang === 'en' ? 'hi' : 'en')} className="text-white font-medium hover:text-[#FF9933]">
              {currentLang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default GovTopBar;