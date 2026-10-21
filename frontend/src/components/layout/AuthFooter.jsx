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
      className="w-full mt-auto py-6 px-4 text-center text-xxs text-slate-500 dark:text-slate-400 select-none"
      role="contentinfo"
      aria-label="Authentication Page Footer"
    >
      <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-2">
        <span>© {currentYear} EduVerse AI</span>
        
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium">
          <button
            type="button"
            onClick={openPolicyDrawer}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:underline"
          >
            Privacy Policy
          </button>

          <span className="text-slate-300 dark:text-slate-700">•</span>

          <button
            type="button"
            onClick={openTermsModal}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:underline"
          >
            Terms of Service
          </button>

          <span className="text-slate-300 dark:text-slate-700">•</span>

          <button
            type="button"
            onClick={openPreferences}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:underline text-indigo-500"
          >
            Cookie Preferences
          </button>

          <span className="text-slate-300 dark:text-slate-700">•</span>

          <button
            type="button"
            onClick={openReportIssueModal}
            className="hover:text-rose-500 dark:hover:text-rose-400 transition focus:outline-none focus:underline text-slate-400"
          >
            Report Issue
          </button>
        </div>
      </div>
    </footer>
  );
}
