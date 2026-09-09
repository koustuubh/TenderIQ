import React, { useState } from 'react';
import { IndianEmblem, IndianFlag } from '../assets/Emblem';
import { ShieldCheck, Lock, User, KeyRound, Award, ArrowRight } from 'lucide-react';

export const Login = ({ onLoginSuccess }) => {
  const [authMethod, setAuthMethod] = useState('parichay'); // 'parichay' or 'dsc'
  const [officerId, setOfficerId] = useState('CPCL-OFF-40912');
  const [password, setPassword] = useState('••••••••••••');
  const [captcha, setCaptcha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F4F6F9] via-[#FAF9F6] to-white relative overflow-hidden">
      {/* Background Indian Flag Subtle Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#138808]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-2">
          <IndianEmblem className="w-16 h-20" />
        </div>
        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="text-xs font-bold text-gov-navy tracking-wider uppercase">
            भारत सरकार • Government of India
          </span>
        </div>
        <h2 className="text-2xl font-black text-gov-navy tracking-tight">
          Tender<span className="text-[#FF9933]">IQ</span> Portal
        </h2>
        <p className="mt-1 text-xs text-gray-600">
          GeM & CPCL Bid Compliance Verification Platform
        </p>
        <div className="mt-2 inline-flex items-center space-x-1 bg-blue-50 text-blue-900 text-[11px] px-2.5 py-1 rounded-full border border-blue-200 font-semibold">
          <Award className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>Smart India Hackathon 2026 • Group Trinethra</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-gov-card rounded-2xl border border-gray-200 sm:px-10">
          {/* SSO Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setAuthMethod('parichay')}
              className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
                authMethod === 'parichay'
                  ? 'border-gov-navy text-gov-navy'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Jan Parichay (Gov SSO)
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('dsc')}
              className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
                authMethod === 'dsc'
                  ? 'border-gov-navy text-gov-navy'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              e-Token / Class 3 DSC
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {authMethod === 'parichay' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Government Officer ID / Parichay Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-navy focus:border-gov-navy bg-gray-50"
                      placeholder="rajesh.kumar@cpcl.gov.in"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Password / PIN
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-navy focus:border-gov-navy bg-gray-50"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Security Captcha */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Security Verification (Captcha)
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 px-3 py-1.5 rounded border border-gray-400 font-mono font-black text-sm tracking-widest text-gov-navy select-none italic">
                      7 K 9 M P
                    </div>
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center space-y-3">
                <KeyRound className="w-8 h-8 text-blue-700 mx-auto" />
                <div className="text-xs font-bold text-blue-900">
                  Insert USB Cryptographic Token
                </div>
                <p className="text-[11px] text-blue-700">
                  Detected Token: <span className="font-mono font-semibold">eMudhra Class 3 DSC (CPCL-VALID-2027)</span>
                </p>
                <div className="text-[10px] text-gray-500">
                  Certified for electronic qualification sign-offs under IT Act 2000.
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-gov-navy hover:bg-gov-navy-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-navy transition-all"
            >
              <span>Authenticate & Access Evaluation Desk</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>

          {/* Quick Demo Login Preset Notice */}
          <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <span className="text-[11px] text-gray-500">
              Demo Environment: Click Authenticate to access with CPCL Senior Officer profile.
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] text-gray-500">
          <ShieldCheck className="w-4 h-4 text-gov-green" />
          <span>Secured with NIC Cyber Swachhta Kendra 256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
};
export default Login;