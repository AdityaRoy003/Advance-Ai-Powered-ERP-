import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileContract, FaTimes, FaShieldAlt, FaCheck, FaBuilding, FaGavel } from 'react-icons/fa';

export default function TermsOfServiceModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10002] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
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
                <h2 id="terms-modal-title" className="text-lg sm:text-xl font-black text-white tracking-tight">
                  EduVerse AI ERP — Institutional Terms of Service
                </h2>
                <span className="text-xxs font-mono text-slate-400 mt-0.5 block">
                  Version 2026.1 • Enterprise Master Services Agreement • Last Revised January 2026
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close Terms of Service"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin text-slate-300 leading-relaxed text-xs">
            {/* Section 1 */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                1. Acceptance & Enterprise Agreement
              </h3>
              <p>
                By accessing or utilizing the <strong>EduVerse AI ERP Platform</strong> (comprising core ERP services, AI copilot engines, academic controller solvers, SIEM cybersecurity modules, and mobile interfaces), educational institutions, faculty, students, parents, and corporate partners agree to be bound by these Master Terms of Service.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                2. Multi-Tenant Isolation & Institutional Data Ownership
              </h3>
              <p>
                Each university, college, or affiliated campus operates within an isolated tenant partition. All institutional academic records, attendance logs, examination outcomes, financial transactions, and personally identifiable information (PII) remain the <strong>exclusive property</strong> of the subscribing educational institution.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>EduVerse never sells student or faculty personal data to third-party commercial brokers.</li>
                <li>Tenant boundary controls enforce cryptographic partition separation across SQL/NoSQL stores.</li>
                <li>Institutions may export full database snapshots at any time in standardized JSON/CSV formats.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                3. Acceptable Use & Security Protocols
              </h3>
              <p>
                Users must access the platform exclusively through verified credentials. Actions prohibited include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xxs font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div>• Unauthorized penetration testing against production servers</div>
                <div>• Automated scraping of student directories or marks</div>
                <div>• Tampering with digital hall ticket QR cryptographic hashes</div>
                <div>• Reverse-engineering proprietary AI solver algorithms</div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                4. Service Level Agreement (SLA) & Operational Availability
              </h3>
              <p>
                EduVerse provides a <strong>99.9% scheduled monthly uptime SLA</strong> across mission-critical modules including Student Enrollment, Fee Gateway, Examinations, and Hall Ticket Verification. Automated failover and continuous SIEM telemetry guarantee data resilience.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                5. Statutory Compliance & Jurisdiction
              </h3>
              <p>
                These Terms conform to the Indian Information Technology Act (2000), Digital Personal Data Protection Act (2023), UGC Higher Education Technology Guidelines, and international standards including ISO/IEC 27001 and GDPR Article 28 data processor obligations.
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xxs text-slate-400">
              Questions regarding these Terms? Contact{' '}
              <a href="mailto:legal@eduverse.ai" className="text-indigo-400 font-bold hover:underline">
                legal@eduverse.ai
              </a>
            </span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition"
            >
              I Understand & Agree
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
