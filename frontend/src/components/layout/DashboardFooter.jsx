import React from 'react';
import { 
  FaShieldAlt, FaFileContract, FaCookieBite, FaBug, 
  FaQuestionCircle, FaCheckCircle, FaTerminal 
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
      className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-[#090d16]/60 backdrop-blur-sm text-xxs text-slate-500 dark:text-slate-400 py-3 px-3 sm:px-6 transition-colors duration-300 pb-24 md:pb-3"
      role="contentinfo"
      aria-label="EduVerse ERP Dashboard Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left: Copyright & System Status */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left">
          <span>
            © {currentYear} EduVerse AI ERP
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Systems Normal (42ms)</span>
          </div>

          <span className="hidden lg:inline text-slate-300 dark:text-slate-700">•</span>
          <div className="hidden lg:flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">SOC2 Type II</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">FERPA</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">GDPR</span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            {appVersion}
          </span>
        </div>

        {/* Right: Compact Legal & Support Actions */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium">
          <button
            type="button"
            onClick={openReportIssueModal}
            className="hover:text-rose-500 dark:hover:text-rose-400 transition flex items-center gap-1 focus:outline-none focus:underline"
            title="Report a bug or unexpected system behavior"
          >
            <FaBug className="text-rose-400 text-[9px]" />
            <span>Report Issue</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">•</span>

          <button
            type="button"
            onClick={openPolicyDrawer}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1 focus:outline-none focus:underline"
            title="View Institutional Privacy Policy"
          >
            <FaShieldAlt className="text-emerald-400 text-[9px]" />
            <span>Privacy</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">•</span>

          <button
            type="button"
            onClick={openTermsModal}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1 focus:outline-none focus:underline"
            title="View Terms of Service"
          >
            <FaFileContract className="text-indigo-400 text-[9px]" />
            <span>Terms</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">•</span>

          <button
            type="button"
            onClick={openPreferences}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1 focus:outline-none focus:underline font-semibold text-indigo-500 dark:text-indigo-400"
            title="Manage Cookie and Telemetry Preferences"
          >
            <FaCookieBite className="text-amber-400 text-[9px]" />
            <span>Cookies</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
