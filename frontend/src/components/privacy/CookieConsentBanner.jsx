import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaCookieBite, FaTimes, FaSlidersH, FaExternalLinkAlt, FaLock } from 'react-icons/fa';
import { useCookieConsent } from '../../context/CookieConsentContext';

export default function CookieConsentBanner() {
  const { 
    showBanner, 
    acceptAll, 
    rejectOptional, 
    dismissBanner,
    openPreferences, 
    openPolicyDrawer, 
    policyVersion 
  } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-3 sm:bottom-6 left-3 sm:left-auto sm:right-6 right-3 sm:max-w-md w-auto z-[9999] bg-[#0c1220]/95 dark:bg-[#0b101d]/95 border border-slate-700/60 dark:border-slate-800 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white font-sans text-xs select-none"
        role="dialog"
        aria-label="Cookie consent banner"
      >
        {/* Top bar: Icon, Title, and Close Button */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
              <FaCookieBite className="text-sm" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white tracking-tight truncate">
                Privacy & Cookie Choices
              </h3>
              <span className="text-[10px] text-slate-400 font-medium block truncate">
                Policy {policyVersion} • DPDP Act & GDPR
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissBanner}
            title="Decline optional cookies & close"
            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition shrink-0 -mr-1"
            aria-label="Close banner without allowing optional cookies"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Concise Description */}
        <p className="text-slate-300 text-xs leading-relaxed mb-3">
          We use essential cookies to maintain secure authentication and system integrity. Optional performance diagnostics and preference cookies are <strong className="text-white font-semibold">blocked by default</strong> until you choose to enable them.
        </p>

        {/* Category Status Chips & Policy Link */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4 pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Essential Active
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50 text-[10px] font-medium">
              Optional Blocked
            </span>
          </div>

          <button
            type="button"
            onClick={openPolicyDrawer}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition underline-offset-2 hover:underline ml-auto"
          >
            Cookie Policy <FaExternalLinkAlt className="text-[8px]" />
          </button>
        </div>

        {/* Action Buttons: Clean balanced 2-column on mobile, sleek flex on web */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={rejectOptional}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-900 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs transition text-center shadow-sm"
            >
              Reject Optional
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs transition text-center shadow-md shadow-indigo-600/25"
            >
              Accept All
            </button>
          </div>

          <button
            type="button"
            onClick={openPreferences}
            className="w-full py-1.5 px-3 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 font-medium text-xs transition flex items-center justify-center gap-1.5"
          >
            <FaSlidersH className="text-[10px]" /> Customize Preferences
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
