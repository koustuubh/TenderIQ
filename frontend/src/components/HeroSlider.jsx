import React, { useState, useEffect } from 'react';
import { IndianEmblem } from '../assets/Emblem.jsx';
import pmModiImg from '../assets/pm-modi.jpg';
import { Search, ChevronLeft, ChevronRight, Play, Pause, Award, ShieldCheck } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'India Gate & National War Memorial',
    location: 'Kartavya Path, New Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=80',
    fallbackBg: 'from-[#0B2545] via-[#102A43] to-[#0D3866]',
    caption: 'Honoring National Service & Public Trust'
  },
  {
    id: 2,
    title: 'Rashtrapati Bhavan & Central Vista',
    location: 'Raisina Hill, New Delhi',
    image: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1920&q=80',
    fallbackBg: 'from-[#1A1A2E] via-[#16213E] to-[#0F3460]',
    caption: 'Seat of Sovereign Governance & Constitutional Integrity'
  },
  {
    id: 3,
    title: 'Historic Red Fort (Lal Qila)',
    location: 'Old Delhi',
    image: 'https://images.unsplash.com/photo-1598556474034-70654817a030?auto=format&fit=crop&w=1920&q=80',
    fallbackBg: 'from-[#2C1810] via-[#1E1108] to-[#0D0704]',
    caption: 'Symbol of National Sovereignty & Heritage'
  },
  {
    id: 4,
    title: 'CPCL Manali Refinery & Critical Infrastructure',
    location: 'Chennai, Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    fallbackBg: 'from-[#0B2545] via-[#0D47A1] to-[#002171]',
    caption: 'Powering India\'s Industrial Growth & Energy Security'
  }
];

const TRENDING_SEARCHES = [
  'CPCL Manali Refinery',
  'High-Pressure Piping',
  'Disqualified Bidders',
  'AI OCR Pipeline',
  'GeM Bid No. 98214'
];

export const HeroSlider = ({ setActiveTab, setSelectedTenderId }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All Categories');

  // Auto-advance slides every 5.5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const handleSearch = (e) => {
    e.preventDefault();
    if (setSelectedTenderId) setSelectedTenderId('CPCL-2026-T890');
    if (setActiveTab) setActiveTab('verification');
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl mb-12 border border-gray-300/40">
      {/* Background Image Carousel with Cross-Fade */}
      <div className="relative h-[520px] sm:h-[540px] lg:h-[580px] w-full overflow-hidden bg-gray-900">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            } transition-transform duration-[6000ms]`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Fallback to elegant national gradient if image fails to load
                e.target.style.display = 'none';
              }}
            />
            {/* Fallback gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.fallbackBg} -z-10`} />
          </div>
        ))}

        {/* Multi-layered dark atmospheric overlays for readability (india.gov.in style) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/95 via-black/60 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-black/60" />

        {/* Top Floating Badge & Slide Controls */}
        <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <span className="bg-[#FF9933] text-black text-[11px] font-black px-2.5 py-1 rounded shadow uppercase tracking-wide">
              GeM Smart Automation
            </span>
            <span className="bg-white/15 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 hidden sm:inline-flex items-center">
              <Award className="w-3.5 h-3.5 text-[#FF9933] mr-1.5" />
              SIH 2026 • Problem Statement SIH26100
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs text-white">
            <span className="text-gray-300 hidden md:inline">{SLIDES[currentSlide].title}</span>
            <span className="text-gray-400 hidden md:inline">•</span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 hover:text-[#FF9933] transition"
              title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button onClick={prevSlide} className="p-1 hover:text-[#FF9933] transition" title="Previous Slide">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1">{currentSlide + 1} / {SLIDES.length}</span>
            <button onClick={nextSlide} className="p-1 hover:text-[#FF9933] transition" title="Next Slide">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Content: National Emblem + TenderIQ Branding + Centered Search */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-8 pb-20 sm:pb-24 max-w-4xl mx-auto">
          {/* Ashoka Lion Capital (Emblem) */}
          <div className="mb-2.5 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            <IndianEmblem className="w-16 h-20 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Tender<span className="text-[#FF9933]">IQ</span>
            <span className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-200 block sm:inline sm:ml-3">
              National Procurement Portal
            </span>
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-gray-300 font-medium tracking-wide max-w-2xl drop-shadow">
            Chennai Petroleum Corporation Limited (CPCL) & Government e-Marketplace (GeM)
          </p>

          <p className="mt-0.5 text-xs text-[#FF9933] font-semibold italic">
            Where Procurement Rigor Meets Artificial Intelligence
          </p>

          {/* Centered Large Search Bar (india.gov.in Style) */}
          <form onSubmit={handleSearch} className="mt-6 w-full max-w-2xl">
            <div className="relative flex flex-col sm:flex-row rounded-xl shadow-2xl overflow-hidden bg-white border-2 border-white/80 focus-within:ring-4 focus-within:ring-[#FF9933]/50">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Tenders, Bidder PAN/GSTIN, CPCL Clauses, Gem Bid..."
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center border-t sm:border-t-0 sm:border-l border-gray-200 bg-gray-50">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option>All Categories</option>
                  <option>Active CPCL Bids</option>
                  <option>Tender Clauses</option>
                  <option>Bidder Dossiers</option>
                  <option>Risk Flags</option>
                </select>

                <button
                  type="submit"
                  className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs sm:text-sm px-6 py-3 sm:py-3.5 flex items-center space-x-1.5 transition shadow-inner"
                >
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Trending Searches Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-300">
            <span className="font-semibold text-white/90">Trending Searches:</span>
            {TRENDING_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  if (setActiveTab) setActiveTab('verification');
                }}
                className="bg-black/30 hover:bg-[#FF9933]/30 hover:text-white backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/20 text-[11px] text-gray-200 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Slide Indicators (Dots) */}
          <div className="absolute bottom-16 sm:bottom-18 flex items-center space-x-2 z-20">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide ? 'w-7 h-2 bg-[#FF9933]' : 'w-2 h-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating PM Modi Quote Card (Overlapping bottom of banner like in india.gov.in) */}
      <div className="relative -mt-14 sm:-mt-16 mx-4 sm:mx-8 z-30">
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-2xl border border-gray-200 max-w-3xl mx-auto flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <img
            src={pmModiImg}
            alt="Hon'ble Prime Minister Shri Narendra Modi"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-[#FF9933] shadow-md shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <blockquote className="text-xs sm:text-sm text-gray-800 italic font-medium leading-relaxed">
              <span className="text-xl sm:text-2xl text-[#FF9933] font-serif font-black mr-1 leading-none">“</span>
              India's Digital Public Infrastructure has demonstrated how technology can expand opportunity, 
              improve governance, boost financial inclusion and deliver services for hundreds of millions of people.
              <span className="text-xl sm:text-2xl text-[#FF9933] font-serif font-black ml-1 leading-none">”</span>
            </blockquote>
            <div className="mt-2 text-xs font-bold text-gov-navy flex flex-wrap items-center justify-center sm:justify-start gap-1">
              <span>Shri Narendra Modi</span>
              <span className="text-gray-400 font-normal">• Hon'ble Prime Minister of India</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="text-[#138808] font-semibold text-[11px] flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Viksit Bharat @ 2047
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
