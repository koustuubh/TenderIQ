import React from 'react';
import { IndianEmblem, IndianFlag } from '../assets/Emblem';
import { ShieldCheck, ExternalLink, Phone, Mail, Award, Lock, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#081B30] text-gray-300 pt-1 border-t border-gray-700 mt-12">
      <div className="tiranga-stripe"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <IndianEmblem className="w-10 h-12 brightness-200" />
              <div>
                <h4 className="text-white font-bold text-sm">Tender<span className="text-[#FF9933]">IQ</span></h4>
                <p className="text-[11px] text-gray-400">Integrated Bid Compliance Engine</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              AI-assisted bid compliance platform built for GeM procurement under <strong>Smart India Hackathon 2026</strong>.
            </p>
            <div className="bg-[#102A43] p-2.5 rounded-md border border-gray-700 text-[11px]">
              <div className="font-semibold text-white flex items-center mb-1">
                <Award className="w-3.5 h-3.5 mr-1.5 text-[#FF9933]" />
                SIH 2026 • Group Trinethra
              </div>
              <div className="text-[10px] text-gray-400">
                Problem Statement ID: SIH26100 • Ministry of Petroleum & Natural Gas / CPCL
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 border-b border-gray-700 pb-1.5 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#FF9933] mr-2"></span>
              Government Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center"><ExternalLink className="w-3 h-3 mr-1.5" />National Portal of India</a></li>
              <li><a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center"><ExternalLink className="w-3 h-3 mr-1.5" />Government e-Marketplace (GeM)</a></li>
              <li><a href="https://cpcl.co.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center"><ExternalLink className="w-3 h-3 mr-1.5" />Chennai Petroleum Corp. Ltd</a></li>
              <li><a href="https://cvc.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center"><ExternalLink className="w-3 h-3 mr-1.5" />Central Vigilance Commission</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 border-b border-gray-700 pb-1.5 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#138808] mr-2"></span>
              Regulatory & Helpdesk
            </h4>
            <ul className="space-y-2 text-xs">
              <li>GFR 2017: General Financial Rules</li>
              <li>MII Order 2017: Public Procurement Policy</li>
              <li>Rule 144(xi): Land Border Restrictions</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
              <div className="flex items-center space-x-1.5 text-gray-300"><Phone className="w-3.5 h-3.5 text-[#FF9933]" /><span>Toll Free: 1800-419-3436</span></div>
              <div className="flex items-center space-x-1.5 mt-1"><Mail className="w-3.5 h-3.5" /><span>support-gem@nic.in</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 border-b border-gray-700 pb-1.5 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              Security & Accreditations
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="bg-[#102A43] p-2 rounded border border-gray-700 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div><div className="text-white font-semibold">NIC MeghRaj Cloud</div><div className="text-[10px] text-gray-400">Certified Architecture</div></div>
              </div>
              <div className="bg-[#102A43] p-2 rounded border border-gray-700 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-[#FF9933] shrink-0" />
                <div><div className="text-white font-semibold">256-bit DSC Signatures</div><div className="text-[10px] text-gray-400">Class 3 Verified</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Government of India. Designed for <strong>Smart India Hackathon 2026 (Group Trinethra)</strong>.</p>
          <div className="flex space-x-3 text-gray-400">
            <a href="#terms">Terms</a><span>•</span><a href="#privacy">Privacy</a><span>•</span><a href="#accessibility">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;