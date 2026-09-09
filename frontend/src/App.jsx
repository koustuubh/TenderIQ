import React, { useState, useEffect } from 'react';
import { GovTopBar } from './components/GovTopBar';
import { Navbar } from './components/Navbar';
import { TricolorMenuDrawer } from './components/TricolorMenuDrawer';
import { Footer } from './components/Footer';

import { Dashboard } from './pages/Dashboard';
import { TenderUpload } from './pages/TenderUpload';
import { BidderDocuments } from './pages/BidderDocuments';
import { Verification } from './pages/Verification';
import { FinalDecision } from './pages/FinalDecision';
import { Login } from './pages/Login';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTenderId, setSelectedTenderId] = useState('CPCL-2026-T890');
  const [selectedBidderId, setSelectedBidderId] = useState('BID-02');
  const [currentLang, setCurrentLang] = useState('en');
  const [fontSize, setFontSize] = useState('md');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('font-sm', 'font-md', 'font-lg');
    document.documentElement.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('login');
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-gray-800">
      {/* Government Top Bar */}
      <GovTopBar
        currentLang={currentLang}
        setLang={setCurrentLang}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Main Navbar with Tricolor Hamburger */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        currentLang={currentLang}
        onMenuOpen={() => setIsDrawerOpen(true)}
      />

      {/* Tricolor Slide-over Drawer */}
      <TricolorMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area — full width, no persistent sidebar */}
      {!isAuthenticated || activeTab === 'login' ? (
        <main className="flex-1">
          <Login onLoginSuccess={() => { setIsAuthenticated(true); setActiveTab('dashboard'); }} />
        </main>
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="main-content">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              setSelectedTenderId={setSelectedTenderId}
            />
          )}
          {activeTab === 'tender-upload' && <TenderUpload setActiveTab={setActiveTab} />}
          {activeTab === 'bidder-docs' && (
            <BidderDocuments setActiveTab={setActiveTab} setSelectedBidderId={setSelectedBidderId} />
          )}
          {activeTab === 'verification' && (
            <Verification setActiveTab={setActiveTab} selectedBidderId={selectedBidderId} />
          )}
          {activeTab === 'final-decision' && <FinalDecision setActiveTab={setActiveTab} />}
        </main>
      )}

      <Footer />
    </div>
  );
}

export default App;