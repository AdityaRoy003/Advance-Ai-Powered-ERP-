import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaCheck, FaTimes, FaSlidersH, FaFileAlt, FaLock } from 'react-icons/fa';
import { useCookieConsent } from '../../context/CookieConsentContext';

export default function CookieConsentBanner() {
  const { 
    showBanner, 
    acceptAll, 
    rejectOptional, 
    openPreferences, 
    openPolicyDrawer, 
    policyVersion 
  } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 max-w-5xl mx-auto z-[9999] p-4 sm:p-6 bg-[#0a0f1d]/95 border border-indigo-500/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl text-white font-sans text-xs"
        role="region"
        aria-label="Cookie consent banner"
      >
        <div className="flex flex-col gap-4">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">
                <FaShieldAlt />
              </span>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                  EduVerse Privacy & Cookie Choices
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xxs font-mono text-slate-400 self-start sm:self-auto">
              <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-emerald-400 font-bold">
                <FaLock className="text-[10px]" /> Policy {policyVersion}
              </span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-slate-400 font-bold">
                DPDP 2023 & GDPR
              </span>
            </div>
          </div>

          {/* Description Text */}
          <div className="text-slate-300 text-xs leading-relaxed flex flex-col gap-1.5">
            <p>
              We use <strong className="text-white">Essential cookies</strong> to authenticate your institutional session, maintain anti-CSRF security, and route multi-tenant university data. Essential security cookies cannot be disabled.
            </p>
            <p className="text-slate-400 text-xxs">
              Optional <strong className="text-slate-300">Functional</strong> (theme/language), <strong className="text-slate-300">Analytics</strong> (system latency diagnostics), and <strong className="text-slate-300">Marketing</strong> (placement recruiter radars) cookies remain <span className="text-amber-400 font-bold">disabled by default</span> until you give your consent. You may accept, reject, or customize your choices at any time.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Policy Links */}
            <div className="flex items-center gap-3 text-xxs text-slate-400 order-2 sm:order-1">
              <button
                type="button"
                onClick={openPolicyDrawer}
                className="hover:text-indigo-400 underline underline-offset-2 flex items-center gap-1 transition"
              >
                <FaFileAlt /> Cookie & Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={openPreferences}
                className="hover:text-indigo-400 underline underline-offset-2 transition"
              >
                Manage Storage
              </button>
            </div>

            {/* Buttons (Equal visual prominence for Accept and Reject) */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap order-1 sm:order-2">
              <button
                type="button"
                onClick={openPreferences}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 font-bold text-xs transition"
              >
                <FaSlidersH /> Customize Preferences
              </button>
              <button
                type="button"
                onClick={rejectOptional}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition shadow-md"
              >
                <FaTimes /> Reject Optional
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-lg shadow-emerald-600/25"
              >
                <FaCheck /> Accept All
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
