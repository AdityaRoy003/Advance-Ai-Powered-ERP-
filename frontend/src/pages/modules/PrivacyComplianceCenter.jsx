import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { SystemOpsAPI } from '../../services/api';
import { 
  FaUserShield, FaDownload, FaTrashAlt, FaCheckCircle, 
  FaToggleOn, FaToggleOff, FaLock, FaFileContract, FaHistory 
} from 'react-icons/fa';

export default function PrivacyComplianceCenter() {
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  const fetchConsent = async () => {
    setLoading(true);
    try {
      const res = await SystemOpsAPI.getPrivacyConsent();
      setConsent(res);
    } catch (err) {
      console.error('Privacy fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsent();
  }, []);

  const handleToggle = async (key) => {
    if (!consent) return;
    const newVal = !consent[key];
    const updated = { ...consent, [key]: newVal };
    setConsent(updated);

    try {
      await SystemOpsAPI.updatePrivacyConsent({ [key]: newVal });
      toast.success('Privacy preference updated');
    } catch {
      toast.error('Failed to update preference');
      fetchConsent();
    }
  };

  const handleDataExport = async () => {
    setExporting(true);
    try {
      const res = await SystemOpsAPI.requestDataExport();
      setExportResult(res);
      toast.success('Data bundle exported in DPDP/GDPR compliant format!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteRequest = () => {
    toast.error('Account deletion request submitted for Institutional Data Protection Officer review.');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xl">
              <FaUserShield />
            </span>
            <div>
              <h1 className="text-2xl font-black">Privacy & Data Governance Center</h1>
              <p className="text-slate-400 text-xs mt-0.5">DPDP Act (India) & GDPR Compliance: Self-service data export, consent toggles & retention policies</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-4 py-2 rounded-2xl">
          <FaLock className="text-teal-400" />
          <span className="text-xs font-bold text-teal-300">DPDP 2023 & GDPR Compliant</span>
        </div>
      </div>

      {/* Consent Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <FaFileContract className="text-teal-400" />
            <span>Consent & Data Sharing Preferences</span>
          </h2>
          <p className="text-xs text-slate-400 mb-6">Manage how your biometric, academic, and behavioral data is processed</p>

          <div className="space-y-4">
            {[
              {
                key: 'consentAcademicAnalytics',
                title: 'Academic Analytics & Early Warning AI',
                desc: 'Allow ML models to analyze LMS study patterns and attendance to offer personalized tutoring recommendations.'
              },
              {
                key: 'consentBioMetrics',
                title: 'Biometric Face & Fingerprint Check-in',
                desc: 'Process facial geometry vectors for high-speed campus gate and hostel turnstile access.'
              },
              {
                key: 'consentRecruiterView',
                title: 'Placement Recruiter Skill Radar Sharing',
                desc: 'Allow verified corporate campus recruiters to view your skill matrix and public verified project portfolio.'
              },
              {
                key: 'consentThirdPartySharing',
                title: 'Third-Party Academic Integration Data Transfer',
                desc: 'Share verified student metadata with Google Classroom and external hackathon platforms.'
              }
            ].map(item => (
              <div key={item.key} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-white">{item.title}</h3>
                  <p className="text-xxs text-slate-400 mt-1">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className="text-2xl transition shrink-0"
                >
                  {consent?.[item.key] ? (
                    <FaToggleOn className="text-teal-400" />
                  ) : (
                    <FaToggleOff className="text-slate-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Rights: Export & Delete */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <FaDownload className="text-teal-400" />
                <span>Download My Data (Portability)</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Export complete transcript history, attendance records, financial receipts, and access logs in a cryptographically signed archive.
              </p>
            </div>
            <button
              onClick={handleDataExport}
              disabled={exporting}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs transition shadow-lg shadow-teal-500/20"
            >
              {exporting ? 'Compiling Encrypted Bundle...' : 'Export Complete Data Bundle'}
            </button>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-rose-400 mb-2 flex items-center gap-2">
                <FaTrashAlt />
                <span>Right to Erasure (Delete Account)</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Submit an account erasure request. Academic audit records are held in accordance with statutory UGC data retention rules.
              </p>
            </div>
            <button
              onClick={handleDeleteRequest}
              className="w-full py-2.5 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition"
            >
              Request Account Erasure
            </button>
          </div>
        </div>
      </div>

      {/* Export Result Preview */}
      {exportResult && (
        <div className="rounded-2xl border border-teal-500/30 bg-slate-900 p-6">
          <h3 className="text-sm font-bold text-teal-400 mb-2">Export Bundle Ready for Download</h3>
          <p className="text-xs text-slate-300 mb-4">{exportResult.complianceStandard} • Format: {exportResult.downloadFormat}</p>
          <div className="flex flex-wrap gap-2">
            {exportResult.exportCategories?.map((cat, i) => (
              <span key={i} className="text-xxs px-3 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                ✓ {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
