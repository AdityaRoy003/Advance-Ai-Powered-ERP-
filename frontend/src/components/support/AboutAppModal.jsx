import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaRobot, FaShieldAlt, FaServer, 
  FaCheckCircle, FaGraduationCap, FaBrain, FaExternalLinkAlt 
} from 'react-icons/fa';
import EduVerseEmblem from '../common/EduVerseEmblem';

export default function AboutAppModal({ isOpen, onClose }) {
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
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-app-modal-title"
      >
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#090f1d] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-200 z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <EduVerseEmblem size={36} />
              <div>
                <h2 id="about-app-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  About EduVerse AI ERP
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    v2.4.0 Enterprise
                  </span>
                </h2>
                <span className="text-xxs font-mono text-slate-400 mt-0.5 block">
                  Autonomous Multi-Tenant Higher Education Governance System
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close modal"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed scrollbar-thin">
            
            {/* Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <FaGraduationCap /> Executive Platform Overview
              </h3>
              <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                EduVerse AI ERP is an enterprise-grade cloud operating system designed for universities, colleges, and educational consortia. It unifies admissions pipelines, dynamic timetable scheduling, academic compliance, biometric telemetry, digital bursar ledgers, and tamper-proof blockchain credentials into a single unified platform.
              </p>
            </div>

            {/* Core Architectural Pillars */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <FaBrain /> AI & Computational Capabilities
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-white text-xs block">Dynamic CP-SAT Timetable Engine</span>
                  <p className="text-xxs text-slate-400 leading-normal">
                    Mathematical constraint solver for real-time conflict-free faculty, classroom, and lab scheduling.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-white text-xs block">AI Lecture Summarizer & Cards</span>
                  <p className="text-xxs text-slate-400 leading-normal">
                    Automated transcription, core concept extraction, and searchable video chapter generation.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-white text-xs block">Admissions Kanban CRM</span>
                  <p className="text-xxs text-slate-400 leading-normal">
                    End-to-end recruitment pipeline tracking inquiries, merit ranking, document verification, and enrollment.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-white text-xs block">Accreditation SSR Compiler</span>
                  <p className="text-xxs text-slate-400 leading-normal">
                    One-click audit-ready regulatory compilation for NAAC, NBA, and ABET regulatory bodies.
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance, Security & Data Protection */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <FaShieldAlt /> Enterprise Governance & Privacy Standards
              </h3>

              <div className="flex flex-wrap gap-2 text-xxs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <FaCheckCircle className="text-[10px]" /> ISO/IEC 27001:2025
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <FaCheckCircle className="text-[10px]" /> SOC2 Type II Certified
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <FaCheckCircle className="text-[10px]" /> FERPA Student Privacy
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <FaCheckCircle className="text-[10px]" /> GDPR / DPDP 2023 Compliant
                </span>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row justify-between gap-3 text-xxs font-mono text-slate-400">
              <div>
                <span className="text-slate-500 block">Version Architecture</span>
                <span className="text-white font-bold">EduVerse AI v2.4.0 (Enterprise Multi-Tenant)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Database Cluster</span>
                <span className="text-white font-bold">MongoDB Atlas Enterprise + Redis Cache</span>
              </div>
              <div>
                <span className="text-slate-500 block">Real-Time Core</span>
                <span className="text-cyan-400 font-bold">Socket.IO SIEM Telemetry</span>
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-900/50 flex justify-between items-center">
            <span className="text-xxs text-slate-400 font-mono">
              © {new Date().getFullYear()} EduVerse AI. All rights reserved.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/30"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

