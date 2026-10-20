import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaTimes, FaLock, FaFileContract, FaEnvelope, FaBuilding } from 'react-icons/fa';
import { useCookieConsent } from '../../context/CookieConsentContext';

export default function PrivacyPolicyModal() {
  const { showPolicyDrawer, closePolicyDrawer, policyVersion, openPreferences } = useCookieConsent();

  if (!showPolicyDrawer) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10001] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl bg-[#0a0f1d] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white text-xs font-sans"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 text-lg border border-indigo-500/30">
                <FaFileContract />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  EduVerse AI ERP — Cookie & Privacy Governance Policy
                </h2>
                <span className="text-xxs font-mono text-slate-400 mt-0.5 block">
                  Version {policyVersion} • Effective January 2026 • Statutory Compliance Notice
                </span>
              </div>
            </div>

            <button
              onClick={closePolicyDrawer}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close policy"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin text-slate-300 leading-relaxed">
            {/* Section 1: Introduction */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                1. Statutory Privacy Framework & Scope
              </h3>
              <p>
                EduVerse AI ERP operates as a multi-tenant institutional enterprise resource planning platform. This Policy is formulated in strict accordance with the <strong>Digital Personal Data Protection (DPDP) Act 2023 (India)</strong>, the <strong>General Data Protection Regulation (EU-GDPR)</strong>, and higher education statutory guidelines issued by the University Grants Commission (UGC).
              </p>
            </div>

            {/* Section 2: Essential Cookies vs Optional Technologies */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                2. Categories of Storage & Cookies Used
              </h3>
              <p>
                EduVerse classifies all client-side tokens, browser cookies, and local storage into four unambiguous categories:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">A. Strictly Essential Cookies</span>
                  <p className="text-xxs text-slate-400">
                    Encrypted <code className="text-slate-300">eduverse_session</code> HttpOnly cookies, <code className="text-slate-300">XSRF-TOKEN</code> anti-tampering keys, and tenant identification headers. Required for authentication and cannot be disabled.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-indigo-400 block mb-1">B. Functional Personalization</span>
                  <p className="text-xxs text-slate-400">
                    Local storage keys for UI theme mode, language localization preferences, and accessibility dials. Disabled until user consent is given.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-teal-400 block mb-1">C. Performance & Analytics</span>
                  <p className="text-xxs text-slate-400">
                    Diagnostic telemetry measuring API latency, WebSocket heartbeat health, and navigation performance. Anonymized; no grades, PII or passwords recorded.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-pink-400 block mb-1">D. Placement Recruiter Tracking</span>
                  <p className="text-xxs text-slate-400">
                    Allows verified corporate recruiters to access student skill radar maps. Disabled by default; activated only upon explicit consent.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Data Rights & Portability */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                3. Your Data Rights & Consent Withdrawal
              </h3>
              <p>
                You retain full sovereignty over your data. Under Section 11 of the DPDP Act and Article 7 of the GDPR:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xxs text-slate-400 pl-2">
                <li>You may withdraw your consent at any time via the Privacy Preferences manager.</li>
                <li>You can export a cryptographically signed copy of your entire academic transcript, attendance, and fee history.</li>
                <li>You may request account erasure (subject to statutory 7-year UGC academic audit retention guidelines).</li>
              </ul>
            </div>

            {/* Section 4: Data Protection Officer Contact */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/20 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <span className="text-xxs font-mono uppercase text-indigo-400 font-bold tracking-wider block">Grievance Redressal</span>
                <span className="font-extrabold text-white text-xs block mt-0.5">Data Protection Officer (DPO)</span>
                <span className="text-xxs text-slate-400">EduVerse Central Directorate of Security & Privacy Compliance</span>
              </div>
              <a
                href="mailto:dpo@eduverse.ac.in"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xxs border border-indigo-500/30 transition self-start sm:self-auto"
              >
                <FaEnvelope /> Contact DPO
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/60 flex justify-between items-center">
            <button
              onClick={() => {
                closePolicyDrawer();
                openPreferences();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
            >
              Open Preference Manager
            </button>
            <button
              onClick={closePolicyDrawer}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
            >
              Close Policy
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
