import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRobot, FaShieldAlt, FaGithub, FaLinkedin, FaTwitter, 
  FaQuestionCircle, FaFileContract, FaCookieBite, FaUniversalAccess, 
  FaBug, FaEnvelope, FaExternalLinkAlt, FaCheckCircle
} from 'react-icons/fa';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { useSupportModals } from '../../context/SupportModalContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const appVersion = 'v2.4.0 (Enterprise)';
  
  const { openPreferences, openPolicyDrawer } = useCookieConsent();
  const { openReportIssueModal, openTermsModal } = useSupportModals();
  const { toggleHighContrast, toggleLargeText } = useAccessibility();

  return (
    <footer 
      className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#070b14] text-slate-600 dark:text-slate-400 transition-colors duration-300"
      role="contentinfo"
      aria-label="EduVerse AI Public Footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2.5 font-black text-lg text-slate-900 dark:text-white group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <FaRobot className="text-base" />
              </div>
              <span className="tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 dark:from-white dark:via-indigo-200 dark:to-cyan-200 bg-clip-text text-transparent font-black">
                EduVerse AI ERP
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Next-generation autonomous AI ERP unifying higher education governance, dynamic CP-SAT scheduling, SIEM cybersecurity, and verifiable blockchain credentials.
            </p>

            {/* Platform Operational Status Badge */}
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xxs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-xxs font-mono text-slate-400">
                SLA: 99.98%
              </span>
            </div>
          </div>

          {/* Column 2: Platform & Solutions */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:underline">
                  Core AI Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:underline">
                  Institutions & Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:underline">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:underline">
                  Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:underline">
                  Institutional Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Support Desk */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Help & Support
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  type="button"
                  onClick={openReportIssueModal}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 text-left focus:outline-none focus:underline"
                >
                  <FaBug className="text-rose-500 text-xxs shrink-0" />
                  <span>Report an Issue</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openReportIssueModal}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 text-left focus:outline-none focus:underline"
                >
                  <FaQuestionCircle className="text-indigo-400 text-xxs shrink-0" />
                  <span>Help Desk & Ticket Tracker</span>
                </button>
              </li>
              <li>
                <a 
                  href="mailto:support@eduverse.ai" 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 focus:outline-none focus:underline"
                >
                  <FaEnvelope className="text-xxs shrink-0 text-slate-400" />
                  <span>Contact Support Desk</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 focus:outline-none focus:underline text-left"
                >
                  <FaUniversalAccess className="text-cyan-400 text-xxs shrink-0" />
                  <span>Accessibility Mode Toggle</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Legal */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Governance & Legal
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  type="button"
                  onClick={openTermsModal}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 focus:outline-none focus:underline text-left"
                >
                  <FaFileContract className="text-xxs shrink-0 text-indigo-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openPolicyDrawer}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 focus:outline-none focus:underline text-left"
                >
                  <FaShieldAlt className="text-xxs shrink-0 text-emerald-400" />
                  <span>Privacy Policy (DPDP & GDPR)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openPolicyDrawer}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 focus:outline-none focus:underline text-left"
                >
                  <FaCookieBite className="text-xxs shrink-0 text-amber-400" />
                  <span>Cookie Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openPreferences}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-semibold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:underline text-left"
                >
                  ⚙️ Cookie Preferences
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Sub-Footer Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-center sm:text-left">
            <span>
              © {currentYear} EduVerse AI Platform. All rights reserved.
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-xxs text-slate-400 dark:text-slate-500">
              Build {appVersion}
            </span>
          </div>

          {/* Social Links (Matching LandingPage.jsx official socials) */}
          <div className="flex items-center gap-4 text-base text-slate-400">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-900 dark:hover:text-white transition p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
              aria-label="EduVerse GitHub"
            >
              <FaGithub />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
              aria-label="EduVerse LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-500 transition p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
              aria-label="EduVerse Twitter / X"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
