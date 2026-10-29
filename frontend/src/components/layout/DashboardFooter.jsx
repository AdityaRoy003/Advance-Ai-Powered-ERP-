import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, FaFileContract, FaCookieBite, FaBug 
} from 'react-icons/fa';
import EduVerseEmblem from '../common/EduVerseEmblem';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { useSupportModals } from '../../context/SupportModalContext';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  const appVersion = 'v2.4.0';

  const { openPreferences, openPolicyDrawer } = useCookieConsent();
  const { openReportIssueModal, openTermsModal } = useSupportModals();

  // Genuine live health & measured network latency state
  const [telemetry, setTelemetry] = useState({
    status: 'checking', // 'operational' | 'degraded' | 'offline'
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
        // Fallback check to API endpoint
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
    <footer 
      className="relative mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-[#070b14]/92 backdrop-blur-xl text-slate-500 dark:text-slate-400 py-4 px-3 sm:px-6 transition-colors duration-300 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:pb-4 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.45)] select-none before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-cyan-500/25 dark:before:via-cyan-400/20 before:to-transparent"
      role="contentinfo"
      aria-label="EduVerse ERP Dashboard Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3.5">
        
        {/* ─── TIER 1: BRAND ROW & SUPPORT/LEGAL NAVIGATION ─── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
          
          {/* Brand Row: 3D Emblem, Brand Title & Subtitle */}
          <div className="flex items-center gap-2.5 text-center sm:text-left justify-center md:justify-start">
            <EduVerseEmblem size={26} />
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 tracking-tight">
                EduVerse AI
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden xs:inline">
                Your intelligent education platform
              </span>
            </div>
          </div>

          {/* Support and Legal Navigation: Ghost-style controls with consistent touch zones */}
          {/* On mobile: pr-14 ensures dedicated clearance for the floating AI assistant widget */}
          <nav 
            className="w-full md:w-auto grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center md:justify-end gap-1 sm:gap-1.5 pr-14 md:pr-0"
            aria-label="Footer navigation links"
          >
            <button
              type="button"
              onClick={openReportIssueModal}
              className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-xxs font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 min-h-[34px]"
              title="Report an issue or unexpected system behavior"
            >
              <FaBug className="text-rose-400/90 text-[10px] shrink-0" />
              <span>Report an Issue</span>
            </button>

            <button
              type="button"
              onClick={openPolicyDrawer}
              className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-xxs font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 min-h-[34px]"
              title="View Institutional Privacy Policy"
            >
              <FaShieldAlt className="text-emerald-400/90 text-[10px] shrink-0" />
              <span>Privacy</span>
            </button>

            <button
              type="button"
              onClick={openTermsModal}
              className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-400 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-xxs font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 min-h-[34px]"
              title="View Terms of Service"
            >
              <FaFileContract className="text-indigo-400/90 text-[10px] shrink-0" />
              <span>Terms</span>
            </button>

            <button
              type="button"
              onClick={openPreferences}
              className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-xxs font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 min-h-[34px]"
              title="Manage Cookie and Telemetry Preferences"
            >
              <FaCookieBite className="text-amber-400/90 text-[10px] shrink-0" />
              <span>Cookie Preferences</span>
            </button>
          </nav>

        </div>

        {/* ─── TIER 2: SYSTEM STATUS & COPYRIGHT ROW ─── */}
        <div className="pt-2.5 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xxs text-slate-400 dark:text-slate-500">
          
          {/* Copyright & Application Version */}
          <div className="flex items-center gap-2">
            <span>© {currentYear} EduVerse AI</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50">
              {appVersion}
            </span>
          </div>

          {/* Genuine Measured System Status & Latency Badge */}
          <div className="inline-flex items-center gap-2 pr-14 sm:pr-0">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono text-[10px] font-medium transition-colors ${
              telemetry.status === 'operational'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : telemetry.status === 'degraded'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}>
              <span className="relative flex h-1.5 w-1.5">
                {telemetry.status === 'operational' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  telemetry.status === 'operational' ? 'bg-emerald-500' : telemetry.status === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'
                }`}></span>
              </span>
              <span>{telemetry.label}</span>
            </div>

            {/* Measured Network Round-Trip Latency */}
            {telemetry.latency !== null && (
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                {telemetry.latency}ms
              </span>
            )}
          </div>

        </div>

      </div>
    </footer>
  );
}
