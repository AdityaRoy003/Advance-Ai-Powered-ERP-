import React from 'react';
import { FaShieldAlt, FaFileContract, FaCookieBite, FaBug } from 'react-icons/fa';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { useSupportModals } from '../../context/SupportModalContext';

export default function AuthFooter() {
  const currentYear = new Date().getFullYear();
  const { openPreferences, openPolicyDrawer } = useCookieConsent();
  const { openReportIssueModal, openTermsModal } = useSupportModals();

  return (
    <footer 
      className="w-full mt-auto py-5 px-4 text-center text-xxs text-slate-500 dark:text-slate-400 select-none"
      role="contentinfo"
      aria-label="Authentication Page Footer"
    >
      <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
        <span className="font-semibold text-slate-600 dark:text-slate-400">© {currentYear} EduVerse AI</span>
        
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-medium">
          <button
            type="button"
            onClick={openPolicyDrawer}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none"
          >
            <FaShieldAlt className="text-emerald-500 text-[10px]" />
            <span>Privacy</span>
          </button>

          <button
            type="button"
            onClick={openTermsModal}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none"
          >
            <FaFileContract className="text-indigo-500 text-[10px]" />
            <span>Terms</span>
          </button>

          <button
            type="button"
            onClick={openPreferences}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 font-semibold transition focus:outline-none"
          >
            <FaCookieBite className="text-amber-500 text-[10px]" />
            <span>Cookies</span>
          </button>

          <button
            type="button"
            onClick={openReportIssueModal}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 transition focus:outline-none"
          >
            <FaBug className="text-rose-400 text-[10px]" />
            <span>Report</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
