import React from 'react';
import { FaShieldAlt, FaFileContract, FaCookieBite, FaBug, FaLock } from 'react-icons/fa';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { useSupportModals } from '../../context/SupportModalContext';
import EduVerseEmblem from '../common/EduVerseEmblem';

export default function AuthFooter() {
  const currentYear = new Date().getFullYear();
  const { openPreferences, openPolicyDrawer } = useCookieConsent();
  const { openReportIssueModal, openTermsModal } = useSupportModals();

  return (
    <footer 
      className="w-full mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#070c18]/85 backdrop-blur-md py-3.5 px-4 sm:px-8 select-none z-20 transition-colors"
      role="contentinfo"
      aria-label="Authentication Page Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5 md:gap-4">
        {/* ─── Left: Brand Emblem & Status ─── */}
        <div className="flex items-center gap-2.5">
          <EduVerseEmblem size={24} />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs tracking-tight text-slate-800 dark:text-white">
                EduVerse AI ERP
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Systems Normal
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Autonomous Higher Education Governance
            </span>
          </div>
        </div>

        {/* ─── Center: Structured Navigation Pill Group ─── */}
        <nav 
          aria-label="Legal and support links"
          className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-xs"
        >
          <button
            type="button"
            onClick={openPolicyDrawer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/90 transition cursor-pointer"
          >
            <FaShieldAlt className="text-emerald-500 text-xs" />
            <span>Privacy Policy</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

          <button
            type="button"
            onClick={openTermsModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/90 transition cursor-pointer"
          >
            <FaFileContract className="text-indigo-500 text-xs" />
            <span>Terms of Service</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

          <button
            type="button"
            onClick={openPreferences}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800/90 transition cursor-pointer"
          >
            <FaCookieBite className="text-amber-500 text-xs" />
            <span>Cookie Preferences</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

          <button
            type="button"
            onClick={openReportIssueModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800/90 transition cursor-pointer"
          >
            <FaBug className="text-rose-400 text-xs" />
            <span>Report Issue</span>
          </button>
        </nav>

        {/* ─── Right: Security Status & Copyright ─── */}
        <div className="flex items-center gap-3 text-xxs font-mono text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
            <FaLock className="text-indigo-500 dark:text-indigo-400 text-[9px]" /> 256-Bit SSL Encrypted
          </span>
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            © {currentYear} EduVerse AI
          </span>
        </div>
      </div>
    </footer>
  );
}
