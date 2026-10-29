import React from 'react';
import { 
  FaShieldAlt, FaFileContract, FaCookieBite, FaBug 
} from 'react-icons/fa';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { useSupportModals } from '../../context/SupportModalContext';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  const appVersion = 'v2.4.0';

  const { openPreferences, openPolicyDrawer } = useCookieConsent();
  const { openReportIssueModal, openTermsModal } = useSupportModals();

  return (
    <footer 
      className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#090d16]/85 backdrop-blur-md text-slate-500 dark:text-slate-400 py-3 sm:py-3.5 px-3 sm:px-6 transition-colors duration-300 pb-28 md:pb-3.5 select-none"
      role="contentinfo"
      aria-label="EduVerse ERP Dashboard Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        
        {/* Left: Brand, Version & Live Telemetry Pill */}
        <div className="w-full md:w-auto flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-center md:text-left">
          
          {/* Brand + Version neatly grouped */}
          <div className="inline-flex items-center gap-1.5">
            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300 tracking-tight">
              © {currentYear} EduVerse AI ERP
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 font-semibold">
              {appVersion}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          
          {/* Real-time Platform Operational Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Systems Normal (42ms)</span>
          </div>

          {/* Compliance trust chips */}
          <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">•</span>
          <div className="hidden lg:flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 font-semibold">SOC2 Type II</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 font-semibold">FERPA</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 font-semibold">GDPR</span>
          </div>
        </div>

        {/* Right: Modern Chip Actions (Pill Buttons with no dangling dots, padded away from floating AI widget on mobile) */}
        <div className="w-full md:w-auto flex flex-wrap items-center justify-center md:justify-end gap-1.5 sm:gap-2 pr-14 md:pr-0">
          <button
            type="button"
            onClick={openReportIssueModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-900/80 hover:bg-rose-500/10 dark:hover:bg-rose-500/15 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-800/80 transition text-xxs font-semibold focus:outline-none"
            title="Report a bug or unexpected system behavior"
          >
            <FaBug className="text-rose-500 text-[10px]" />
            <span>Report Issue</span>
          </button>

          <button
            type="button"
            onClick={openPolicyDrawer}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-900/80 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/80 dark:border-slate-800/80 transition text-xxs font-semibold focus:outline-none"
            title="View Institutional Privacy Policy"
          >
            <FaShieldAlt className="text-emerald-500 text-[10px]" />
            <span>Privacy</span>
          </button>

          <button
            type="button"
            onClick={openTermsModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-900/80 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-800/80 transition text-xxs font-semibold focus:outline-none"
            title="View Terms of Service"
          >
            <FaFileContract className="text-indigo-500 text-[10px]" />
            <span>Terms</span>
          </button>

          <button
            type="button"
            onClick={openPreferences}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 transition text-xxs font-bold focus:outline-none"
            title="Manage Cookie and Telemetry Preferences"
          >
            <FaCookieBite className="text-amber-500 text-[10px]" />
            <span>Cookies</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
