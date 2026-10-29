import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, FaBug, FaShieldAlt, FaFileContract, 
  FaCookieBite, FaLinkedin, FaTwitter, FaGithub, 
  FaInstagram, FaInfoCircle, FaExternalLinkAlt, FaBookOpen 
} from 'react-icons/fa';
import EduVerseEmblem from '../common/EduVerseEmblem';
import AboutAppModal from '../support/AboutAppModal';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { useSupportModals } from '../../context/SupportModalContext';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  const appVersion = 'v2.4.0 (Enterprise)';

  const [showAboutModal, setShowAboutModal] = useState(false);
  const { openPreferences, openPolicyDrawer } = useCookieConsent();
  const { openReportIssueModal, openTermsModal } = useSupportModals();

  // Genuine live health & measured network latency state
  const [telemetry, setTelemetry] = useState({
    status: 'checking',
    latency: null,
    label: 'Systems Operational'
  });

  useEffect(() => {
    let isMounted = true;

    const measureHealth = async () => {
      const startTime = performance.now();
      try {
        const res = await fetch('/health', { 
          method: 'GET',
          cache: 'no-store',
          headers: { 'Accept': 'application/json' }
        });
        const duration = Math.round(performance.now() - startTime);

        if (isMounted) {
          if (res.ok) {
            setTelemetry({
              status: 'operational',
              latency: duration,
              label: 'Systems Operational'
            });
          } else {
            setTelemetry({
              status: 'degraded',
              latency: duration,
              label: 'Partial Degradation'
            });
          }
        }
      } catch {
        try {
          const altStart = performance.now();
          const altRes = await fetch('http://localhost:5000/api/v1/health', {
            method: 'GET',
            cache: 'no-store'
          });
          const altDuration = Math.round(performance.now() - altStart);
          if (isMounted) {
            setTelemetry({
              status: altRes.ok ? 'operational' : 'degraded',
              latency: altDuration,
              label: altRes.ok ? 'Systems Operational' : 'Partial Degradation'
            });
          }
        } catch {
          if (isMounted) {
            setTelemetry({
              status: 'offline',
              latency: null,
              label: 'Service Unreachable'
            });
          }
        }
      }
    };

    measureHealth();
    const interval = setInterval(measureHealth, 45000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <footer 
        className="mt-auto w-full shrink-0 border-t border-[#1a386b] dark:border-slate-800 bg-[#0e254d] dark:bg-[#071329] text-slate-200 dark:text-slate-200 pt-8 sm:pt-12 pb-32 sm:pb-20 px-4 sm:px-6 lg:px-10 transition-colors select-none shadow-[0_-8px_30px_rgba(0,0,0,0.25)]"
        role="contentinfo"
        aria-label="EduVerse ERP Corporate Footer"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* ─── MAIN FOOTER GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            
            {/* Column 1 & 2: Brand & Platform Overview (Location & Phone Removed) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <EduVerseEmblem size={32} />
                <div>
                  <span className="font-extrabold text-base sm:text-lg text-white tracking-tight block">
                    EduVerse AI ERP
                  </span>
                  <span className="text-[11px] text-cyan-300 font-mono">
                    Autonomous Higher Education Governance
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Cloud-native operating system unifying admissions pipelines, automated CP-SAT scheduling, zero-trust SIEM security, and verifiable academic records.
              </p>

              <div className="pt-1 flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <FaEnvelope className="text-cyan-400 shrink-0 text-sm" />
                  <a 
                    href="mailto:contactus@eduverse.ai" 
                    className="text-slate-200 hover:text-white hover:underline transition font-mono text-xs"
                  >
                    contactus@eduverse.ai
                  </a>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xxs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SOC2 Type II • FERPA • GDPR Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-white tracking-wide">
                Company
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <button 
                    type="button" 
                    onClick={() => setShowAboutModal(true)} 
                    className="hover:text-white hover:underline transition text-left flex items-center gap-1.5 font-medium text-cyan-300"
                  >
                    <FaInfoCircle className="text-cyan-400 text-xs shrink-0" />
                    <span>About EduVerse</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={openPolicyDrawer} 
                    className="hover:text-white hover:underline transition text-left flex items-center gap-1.5"
                  >
                    <FaShieldAlt className="text-emerald-400 text-xs shrink-0" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={openTermsModal} 
                    className="hover:text-white hover:underline transition text-left flex items-center gap-1.5"
                  >
                    <FaFileContract className="text-indigo-400 text-xs shrink-0" />
                    <span>Terms & Conditions</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowAboutModal(true)}
                    className="hover:text-white hover:underline transition text-left"
                  >
                    Institutional Consortium
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Resources & Issue Resolution */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-white tracking-wide">
                Resources
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  {/* Dedicated Report an Issue Link */}
                  <button 
                    type="button" 
                    onClick={openReportIssueModal} 
                    className="hover:text-white hover:underline transition text-left flex items-center gap-1.5 text-rose-300 hover:text-rose-200 font-bold"
                  >
                    <FaBug className="text-rose-400 text-xs shrink-0" />
                    <span>Report an Issue</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={openReportIssueModal} 
                    className="hover:text-white hover:underline transition text-left"
                  >
                    Support & Ticket Tracker
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowAboutModal(true)}
                    className="hover:text-white hover:underline transition text-left flex items-center gap-1.5"
                  >
                    <FaBookOpen className="text-slate-400 text-xs shrink-0" />
                    <span>Guides & Documentation</span>
                  </button>
                </li>
                <li className="pt-1">
                  <span className="inline-block px-2.5 py-1 rounded bg-blue-900/60 border border-blue-600/40 text-[11px] font-mono text-cyan-300 font-bold">
                    ISO/IEC 27001:2025
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 5: Get in touch & Socials */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-white tracking-wide">
                Get in touch
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <button 
                    type="button" 
                    onClick={openReportIssueModal} 
                    className="hover:text-white hover:underline transition text-left"
                  >
                    Contact Engineering Desk
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={openPreferences} 
                    className="hover:text-cyan-300 hover:underline transition text-left font-semibold text-cyan-300 flex items-center gap-1.5"
                  >
                    <FaCookieBite className="text-amber-400 text-xs shrink-0" />
                    <span>Cookie Preferences</span>
                  </button>
                </li>
                <li className="pt-2">
                  <p className="font-bold text-xs text-white mb-2.5">Official Socials</p>
                  <div className="flex items-center gap-4 text-base text-slate-300">
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-pink-400 transition" 
                      aria-label="EduVerse Instagram"
                    >
                      <FaInstagram />
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-cyan-400 transition" 
                      aria-label="EduVerse Twitter / X"
                    >
                      <FaTwitter />
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-blue-400 transition" 
                      aria-label="EduVerse LinkedIn"
                    >
                      <FaLinkedin />
                    </a>
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-white transition" 
                      aria-label="EduVerse GitHub"
                    >
                      <FaGithub />
                    </a>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* ─── BOTTOM SUB-FOOTER ROW ─── */}
          <div className="mt-10 pt-6 border-t border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
              <span>© {currentYear} EduVerse AI ERP. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-mono text-[10px] text-cyan-300 font-semibold">{appVersion}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono text-[10px] font-medium transition-colors ${
                telemetry.status === 'operational'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                <span className="relative flex h-1.5 w-1.5">
                  {telemetry.status === 'operational' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
                <span>{telemetry.label}</span>
              </div>
              {telemetry.latency !== null && (
                <span className="text-[10px] font-mono text-cyan-300">
                  {telemetry.latency}ms
                </span>
              )}
            </div>
          </div>

        </div>
      </footer>

      {/* About Application Modal */}
      <AboutAppModal 
        isOpen={showAboutModal} 
        onClose={() => setShowAboutModal(false)} 
      />
    </>
  );
}
