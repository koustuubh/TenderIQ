import React from 'react';

// National Emblem of India (Lion Capital of Ashoka) stylized SVG for Government portal branding
export const IndianEmblem = ({ className = "w-12 h-12" }) => (
  <svg 
    viewBox="0 0 100 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="National Emblem of India"
  >
    {/* Ashoka Lion Silhouette Base in Gov Navy */}
    <path d="M50 15 C45 10, 35 12, 35 22 C35 28, 40 32, 45 34 C42 36, 38 40, 38 48 C38 56, 44 62, 50 64 C56 62, 62 56, 62 48 C62 40, 58 36, 55 34 C60 32, 65 28, 65 22 C65 12, 55 10, 50 15 Z" fill="#0B2545" />
    {/* Left Lion Head */}
    <path d="M34 25 C30 20, 22 23, 22 32 C22 38, 27 42, 32 44 C28 48, 26 53, 27 60 C32 62, 37 62, 40 59 C37 54, 36 48, 35 44 C34 40, 34 30, 34 25 Z" fill="#0B2545" opacity="0.85" />
    {/* Right Lion Head */}
    <path d="M66 25 C70 20, 78 23, 78 32 C78 38, 73 42, 68 44 C72 48, 74 53, 73 60 C68 62, 63 62, 60 59 C63 54, 64 48, 65 44 C66 40, 66 30, 66 25 Z" fill="#0B2545" opacity="0.85" />
    {/* Pedestal with Ashoka Chakra */}
    <rect x="20" y="66" width="60" height="12" rx="3" fill="#0B2545" />
    {/* Ashoka Chakra in Center of Pedestal */}
    <circle cx="50" cy="72" r="4.5" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    <circle cx="50" cy="72" r="1" fill="#FFFFFF" />
    {/* Ashoka Chakra Spokes */}
    <line x1="50" y1="67.5" x2="50" y2="76.5" stroke="#FFFFFF" strokeWidth="0.8" />
    <line x1="45.5" y1="72" x2="54.5" y2="72" stroke="#FFFFFF" strokeWidth="0.8" />
    <line x1="46.8" y1="68.8" x2="53.2" y2="75.2" stroke="#FFFFFF" strokeWidth="0.8" />
    <line x1="46.8" y1="75.2" x2="53.2" y2="68.8" stroke="#FFFFFF" strokeWidth="0.8" />
    {/* Base Plinth */}
    <path d="M25 82 L75 82 L70 90 L30 90 Z" fill="#0B2545" />
    <rect x="15" y="91" width="70" height="4" rx="1" fill="#0B2545" />
    {/* Satyameva Jayate Inscription */}
    <text x="50" y="105" textAnchor="middle" fill="#0B2545" fontSize="8" fontWeight="bold" fontFamily="serif">सत्यमेव जयते</text>
  </svg>
);

// Indian National Flag (Tiranga) Icon
export const IndianFlag = ({ className = "w-6 h-4" }) => (
  <svg viewBox="0 0 30 20" className={`rounded-sm shadow-sm overflow-hidden inline-block ${className}`}>
    <rect width="30" height="6.66" fill="#FF9933" />
    <rect y="6.66" width="30" height="6.66" fill="#FFFFFF" />
    <rect y="13.33" width="30" height="6.66" fill="#138808" />
    <circle cx="15" cy="10" r="2.8" stroke="#000080" strokeWidth="0.6" fill="none" />
    <circle cx="15" cy="10" r="0.7" fill="#000080" />
    {/* Simplified 24 spokes */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
      <line 
        key={deg}
        x1="15" y1="10" 
        x2={15 + 2.6 * Math.cos(deg * Math.PI / 180)} 
        y2={10 + 2.6 * Math.sin(deg * Math.PI / 180)} 
        stroke="#000080" 
        strokeWidth="0.3" 
      />
    ))}
  </svg>
);