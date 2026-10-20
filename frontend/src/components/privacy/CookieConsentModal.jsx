import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, FaLock, FaCheck, FaTimes, FaToggleOn, 
  FaToggleOff, FaInfoCircle, FaFileAlt, FaDatabase, FaHistory,
  FaChevronDown, FaChevronUp, FaUndoAlt
} from 'react-icons/fa';
import { useCookieConsent } from '../../context/CookieConsentContext';

export default function CookieConsentModal() {
  const { 
    consent, 
    showModal, 
    closePreferences, 
    saveCustomPreferences, 
    acceptAll, 
    rejectOptional,
    withdrawConsent,
    showPolicyDrawer,
    closePolicyDrawer,
    policyVersion,
    hasDecided
  } = useCookieConsent();

  // Local state for the 3 optional categories inside the modal
  const [localChoices, setLocalChoices] = useState({
    functional: false,
    analytics: false,
    marketing: false
  });

  const [expandedSection, setExpandedSection] = useState(null);
  const [viewCookieTable, setViewCookieTable] = useState(false);

  // Sync modal state whenever it opens
  useEffect(() => {
    if (showModal) {
      setLocalChoices({
        functional: Boolean(consent.functional),
        analytics: Boolean(consent.analytics),
        marketing: Boolean(consent.marketing)
      });
    }
  }, [showModal, consent]);

  if (!showModal && !showPolicyDrawer) return null;

  const handleToggle = (cat) => {
    setLocalChoices(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleSave = () => {
    saveCustomPreferences(localChoices);
  };

  const toggleAccordion = (sec) => {
    setExpandedSection(prev => prev === sec ? null : sec);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[10000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl bg-[#0b1120] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white text-xs font-sans"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 text-lg border border-indigo-500/30">
                <FaShieldAlt />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Privacy Preferences & Storage Management
                </h2>
                <span className="text-xxs font-mono text-slate-400 mt-0.5 block">
                  Policy Version {policyVersion} • Compliant with DPDP Act 2023 & GDPR
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                closePreferences();
                closePolicyDrawer();
              }}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close modal"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
            {/* Context Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-slate-300 text-xs leading-relaxed flex items-start gap-3">
              <FaInfoCircle className="text-indigo-400 text-base shrink-0 mt-0.5" />
              <p>
                EduVerse respects your digital autonomy. You have the right to know why data is processed, choose which categories to activate, and withdraw consent at any time without penalty. Essential security cookies are required to operate the platform and prevent cross-site request forgery.
              </p>
            </div>

            {/* Category 1: Essential Cookies */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 text-sm"><FaLock /></span>
                  <span className="font-extrabold text-sm text-white">Essential & Security Cookies</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xxs font-bold border border-emerald-500/30">
                  Always Active • Required
                </span>
              </div>
              <p className="text-slate-400 text-xxs leading-relaxed">
                Necessary for user authentication, cryptographic session integrity (<code className="text-indigo-300">eduverse_session</code>), anti-CSRF tokens (<code className="text-indigo-300">XSRF-TOKEN</code>), and institutional multi-tenant routing. Cannot be deactivated as the platform cannot function securely without them.
              </p>
            </div>

            {/* Category 2: Functional Cookies */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-indigo-400 text-sm"><FaDatabase /></span>
                  <div>
                    <span className="font-extrabold text-sm text-white block">Functional & Personalization</span>
                    <span className="text-xxs text-slate-500 font-mono">UI Themes, Language & A11y Dials</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('functional')}
                  className="text-2xl transition shrink-0"
                  aria-label="Toggle Functional cookies"
                >
                  {localChoices.functional ? (
                    <FaToggleOn className="text-indigo-400" />
                  ) : (
                    <FaToggleOff className="text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-slate-400 text-xxs leading-relaxed">
                Remembers your custom dark/light theme, language preferences (e.g. English, Hindi, Bengali), voice audio assistant settings, and accessible high-contrast display parameters across sessions.
              </p>
            </div>

            {/* Category 3: Analytics Cookies */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-teal-400 text-sm"><FaHistory /></span>
                  <div>
                    <span className="font-extrabold text-sm text-white block">Analytics & Performance</span>
                    <span className="text-xxs text-slate-500 font-mono">Anonymous Diagnostics & Latency Metrics</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('analytics')}
                  className="text-2xl transition shrink-0"
                  aria-label="Toggle Analytics cookies"
                >
                  {localChoices.analytics ? (
                    <FaToggleOn className="text-teal-400" />
                  ) : (
                    <FaToggleOff className="text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-slate-400 text-xxs leading-relaxed">
                Helps our engineering team measure page load speeds, API latency diagnostics, and platform navigation workflows. Never records exam scores, grades, student personal identities, or financial transactions.
              </p>
            </div>

            {/* Category 4: Marketing & Placement Radars */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-pink-400 text-sm"><FaFileAlt /></span>
                  <div>
                    <span className="font-extrabold text-sm text-white block">Placement & Recruiter Radars</span>
                    <span className="text-xxs text-slate-500 font-mono">Corporate Campus Hiring Integration</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('marketing')}
                  className="text-2xl transition shrink-0"
                  aria-label="Toggle Marketing cookies"
                >
                  {localChoices.marketing ? (
                    <FaToggleOn className="text-pink-400" />
                  ) : (
                    <FaToggleOff className="text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-slate-400 text-xxs leading-relaxed">
                Allows verified corporate recruiters to discover student skill radar tags and public hackathon portfolios. Strictly disabled by default.
              </p>
            </div>

            {/* Cookie Inventory Details Accordion */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setViewCookieTable(!viewCookieTable)}
                className="w-full p-4 bg-slate-900/80 hover:bg-slate-850 flex items-center justify-between text-xs font-bold text-slate-300 transition"
              >
                <span className="flex items-center gap-2">
                  <FaDatabase className="text-indigo-400" /> Detailed Cookie & Storage Inventory
                </span>
                {viewCookieTable ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {viewCookieTable && (
                <div className="p-4 bg-slate-950 overflow-x-auto scrollbar-thin">
                  <table className="w-full min-w-[540px] text-xxs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                        <th className="pb-2">Cookie / Key</th>
                        <th className="pb-2">Type & Security</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2">Lifespan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      <tr>
                        <td className="py-2 font-mono font-bold text-white">eduverse_session</td>
                        <td className="py-2 text-indigo-400 font-mono">HttpOnly, Secure, SameSite=Lax</td>
                        <td className="py-2 text-emerald-400 font-bold">Essential</td>
                        <td className="py-2 text-slate-400">24 Hours</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono font-bold text-white">XSRF-TOKEN</td>
                        <td className="py-2 text-indigo-400 font-mono">Secure, SameSite=Lax</td>
                        <td className="py-2 text-emerald-400 font-bold">Essential</td>
                        <td className="py-2 text-slate-400">24 Hours</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono font-bold text-white">eduverse_consent_status</td>
                        <td className="py-2 text-slate-300 font-mono">First-Party Cookie</td>
                        <td className="py-2 text-emerald-400 font-bold">Essential</td>
                        <td className="py-2 text-slate-400">1 Year</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono font-bold text-white">eduverse_theme</td>
                        <td className="py-2 text-slate-300 font-mono">Local Storage</td>
                        <td className="py-2 text-indigo-400 font-bold">Functional</td>
                        <td className="py-2 text-slate-400">Persistent</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono font-bold text-white">eduverse_lang</td>
                        <td className="py-2 text-slate-300 font-mono">Local Storage</td>
                        <td className="py-2 text-indigo-400 font-bold">Functional</td>
                        <td className="py-2 text-slate-400">Persistent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Withdraw Button (if user has previously consented to optional items) */}
            <div>
              {(consent.functional || consent.analytics || consent.marketing) && (
                <button
                  type="button"
                  onClick={withdrawConsent}
                  className="text-xxs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 transition underline underline-offset-2"
                >
                  <FaUndoAlt /> Withdraw All Optional Consent
                </button>
              )}
            </div>

            {/* Buttons: Reject, Accept, Save */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-end">
              <button
                type="button"
                onClick={rejectOptional}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition"
              >
                Save My Preferences
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
