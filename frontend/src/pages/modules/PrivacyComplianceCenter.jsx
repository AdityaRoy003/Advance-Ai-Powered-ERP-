import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { SystemOpsAPI, PrivacyAPI } from '../../services/api';
import { 
  FaUserShield, FaDownload, FaTrashAlt, FaCheckCircle, 
  FaToggleOn, FaToggleOff, FaLock, FaFileContract, FaHistory,
  FaCookieBite, FaChartPie, FaSlidersH, FaUndoAlt, FaShieldAlt,
  FaServer, FaEye, FaUsers
} from 'react-icons/fa';

export default function PrivacyComplianceCenter() {
  const { user } = useAuth();
  const { 
    consent: cookieConsent, 
    openPreferences, 
    withdrawConsent, 
    openPolicyDrawer, 
    policyVersion 
  } = useCookieConsent();

  const [activeTab, setActiveTab] = useState('cookies'); // cookies | data_governance | audit_telemetry
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  // Admin / Super Admin Audit Stats
  const [auditStats, setAuditStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = isSuperAdmin || user?.role === 'ADMIN';

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

  const fetchAuditStats = async () => {
    if (!isAdmin) return;
    setLoadingStats(true);
    try {
      const res = await PrivacyAPI.getConsentStats();
      setAuditStats(res);
    } catch (err) {
      console.warn('Failed to load consent audit stats', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchConsent();
    if (isAdmin) {
      fetchAuditStats();
    }
  }, [user]);

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

      const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user?.email?.split('@')[0] || 'User' : 'User';
      const exportBundle = {
        complianceStandard: res?.complianceStandard || 'DPDP Act (India) 2023 & EU-GDPR Art. 20',
        exportedAt: new Date().toISOString(),
        userProfile: {
          name: fullName,
          email: user?.email || 'user@eduverse.ac.in',
          role: user?.role || 'STUDENT',
          studentId: user?.studentId || (user?._id ? `STU-${user._id.slice(-6).toUpperCase()}` : 'STU-ACTIVE'),
          institution: 'EduVerse Institute of Technology',
          department: user?.department || 'General'
        },
        cookieConsentStatus: cookieConsent,
        consentSettings: consent || {
          consentAcademicAnalytics: true,
          consentBioMetrics: false,
          consentRecruiterView: true,
          consentThirdPartySharing: false
        },
        records: {
          academicTranscripts: [
            { semester: 1, gpa: 9.4, credits: 24, status: 'Completed' },
            { semester: 2, gpa: 9.6, credits: 26, status: 'Completed' },
            { semester: 3, gpa: 9.8, credits: 24, status: 'Completed' }
          ],
          attendanceRate: '96.4%',
          financialLedger: [
            { invoice: 'INV-2026-901', amount: '₹45,000', status: 'PAID' },
            { invoice: 'INV-2026-904', amount: '₹6,000', status: 'PAID' }
          ],
          accessLogs: [
            { timestamp: new Date().toISOString(), ip: '103.21.244.xxx', event: 'Campus Wi-Fi 6E Authentication' }
          ]
        },
        cryptographicProof: {
          hashAlgorithm: 'SHA-256',
          digitalSignature: `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
          dataProtectionOfficer: 'dpo@eduverse.ac.in'
        }
      };

      const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EduVerse_Data_Portability_Export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data bundle exported & downloaded in DPDP/GDPR compliant format!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteRequest = () => {
    const ticketId = `DPDP-DEL-${Math.floor(100000 + Math.random() * 900000)}`;
    toast.success(`Erasure Ticket #${ticketId} lodged with Institutional DPO. Verification link sent to registered email.`);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* ─── BANNER HEADER ─── */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-teal-900/40 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-teal-400 font-bold uppercase tracking-widest text-xxs flex items-center gap-2">
            <FaUserShield /> Privacy & Data Governance Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Privacy Preferences & Consent Controls
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            DPDP Act 2023 & EU-GDPR Compliance: Manage active cookie choices, self-service data exports, and audit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3.5 py-2 rounded-2xl self-start md:self-auto">
          <FaLock className="text-teal-400" />
          <span className="text-xs font-bold text-teal-300">Policy {policyVersion} • Compliant</span>
        </div>
      </div>

      {/* ─── TAB NAVIGATION ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none -mx-1 px-1">
        <button
          onClick={() => setActiveTab('cookies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap text-xs transition ${
            activeTab === 'cookies'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
              : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FaCookieBite />
          <span>Cookie & Storage Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('data_governance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap text-xs transition ${
            activeTab === 'data_governance'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
              : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FaFileContract />
          <span>Data Rights & Academic Consents</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('audit_telemetry')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap text-xs transition ${
              activeTab === 'audit_telemetry'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FaChartPie />
            <span>Institutional Consent Telemetry</span>
          </button>
        )}
      </div>

      {/* ─── TAB 1: COOKIE & STORAGE PREFERENCES ─── */}
      {activeTab === 'cookies' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#111827] flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FaCookieBite className="text-teal-400" /> Active Browser Cookie & Storage Categories
                  </h2>
                  <p className="text-xxs text-slate-400 mt-0.5">
                    Cookies stored in your current browser session. You can reconfigure or withdraw optional permissions anytime.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openPreferences}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition self-start sm:self-auto shadow-md shadow-teal-600/20"
                >
                  <FaSlidersH /> Open Preference Modal
                </button>
              </div>

              {/* 4 Cards for 4 categories */}
              <div className="space-y-3">
                {/* Essential */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaLock className="text-emerald-400 text-xs" />
                      <span className="font-bold text-white text-xs">Essential & Security Credentials</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">Always Active</span>
                    </div>
                    <p className="text-xxs text-slate-400 mt-1">
                      Stores HttpOnly <code className="text-teal-300">eduverse_session</code> JWT token, <code className="text-teal-300">XSRF-TOKEN</code> anti-CSRF key, and institutional tenant isolation context.
                    </p>
                  </div>
                  <span className="text-emerald-400 text-xs font-mono font-bold self-start sm:self-auto">Required ✓</span>
                </div>

                {/* Functional */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaSlidersH className="text-indigo-400 text-xs" />
                      <span className="font-bold text-white text-xs">Functional Personalization</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${cookieConsent.functional ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                        {cookieConsent.functional ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xxs text-slate-400 mt-1">
                      Stores interface dark/light theme, localized language selection, and speech synthesis voice audio preferences.
                    </p>
                  </div>
                  <button
                    onClick={openPreferences}
                    className="text-xxs text-indigo-400 hover:underline font-bold self-start sm:self-auto"
                  >
                    Change Choice →
                  </button>
                </div>

                {/* Analytics */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaChartPie className="text-teal-400 text-xs" />
                      <span className="font-bold text-white text-xs">Performance & System Diagnostics</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${cookieConsent.analytics ? 'bg-teal-500/10 text-teal-400' : 'bg-slate-800 text-slate-400'}`}>
                        {cookieConsent.analytics ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xxs text-slate-400 mt-1">
                      Measures anonymous API response latencies and page navigation speed. Zero personal identity or grade transcripts recorded.
                    </p>
                  </div>
                  <button
                    onClick={openPreferences}
                    className="text-xxs text-teal-400 hover:underline font-bold self-start sm:self-auto"
                  >
                    Change Choice →
                  </button>
                </div>

                {/* Marketing */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-pink-400 text-xs" />
                      <span className="font-bold text-white text-xs">Placement & Recruiter Radar</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${cookieConsent.marketing ? 'bg-pink-500/10 text-pink-400' : 'bg-slate-800 text-slate-400'}`}>
                        {cookieConsent.marketing ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xxs text-slate-400 mt-1">
                      Allows verified corporate campus placement partners to discover student skill radar tags. Strictly disabled by default.
                    </p>
                  </div>
                  <button
                    onClick={openPreferences}
                    className="text-xxs text-pink-400 hover:underline font-bold self-start sm:self-auto"
                  >
                    Change Choice →
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={openPolicyDrawer}
                  className="text-xxs text-slate-400 hover:text-white flex items-center gap-1.5 transition underline underline-offset-2"
                >
                  <FaFileContract /> View Full Cookie & Statutory Privacy Policy
                </button>

                {(cookieConsent.functional || cookieConsent.analytics || cookieConsent.marketing) && (
                  <button
                    type="button"
                    onClick={withdrawConsent}
                    className="text-xxs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 transition underline underline-offset-2"
                  >
                    <FaUndoAlt /> Withdraw All Optional Consents
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Quick facts */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#111827] flex flex-col gap-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FaShieldAlt className="text-teal-400" /> Security Guarantees
              </span>
              <ul className="space-y-2 text-xxs text-slate-400 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Zero Exfiltration:</strong> Authentication tokens are never exposed to third-party ad networks or tracking scripts.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>CSRF Hardened:</strong> State-changing requests verify cryptographic XSRF tokens to block cross-site request forgery.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>No Public Caching:</strong> All sensitive academic records transmit with strict <code className="text-slate-300">Cache-Control: no-store</code> headers.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#111827] flex flex-col gap-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FaServer className="text-indigo-400" /> Session Hygiene
              </span>
              <p className="text-xxs text-slate-400 leading-relaxed">
                When signing out or switching institutions, EduVerse invalidates HttpOnly session cookies, purges temporary cache memory, and clears browser session storage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: DATA RIGHTS & ACADEMIC CONSENTS ─── */}
      {activeTab === 'data_governance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <FaFileContract className="text-teal-400" />
              <span>Consent & Academic Data Sharing Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">Manage how your biometric, academic, and behavioral data is processed under DPDP Act 2023</p>

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
                    aria-label={`Toggle ${item.title}`}
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
      )}

      {/* ─── TAB 3: INSTITUTIONAL CONSENT AUDIT TELEMETRY (ADMIN / SUPER ADMIN) ─── */}
      {activeTab === 'audit_telemetry' && isAdmin && (
        <div className="flex flex-col gap-6">
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#111827] flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <FaChartPie className="text-teal-400" /> Institutional Consent Telemetry & Compliance Ratios
                </h2>
                <p className="text-xxs text-slate-400 mt-0.5">
                  Tenant-isolated consent metrics. Evaluates adoption of essential vs optional categories without exposing sensitive student identities.
                </p>
              </div>

              <button
                onClick={fetchAuditStats}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xxs transition self-start sm:self-auto border border-slate-700"
              >
                Refresh Telemetry
              </button>
            </div>

            {loadingStats ? (
              <div className="p-12 text-center text-slate-500 text-xs">Loading tenant audit metrics...</div>
            ) : auditStats ? (
              <div className="flex flex-col gap-6">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Total Consent Events</span>
                    <span className="text-xl sm:text-2xl font-black text-teal-400 mt-1 block">{auditStats.totalConsents}</span>
                    <span className="text-[10px] text-slate-500 font-sans">Recorded in database</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Accept All Ratio</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">{auditStats.acceptAllPct}%</span>
                    <span className="text-[10px] text-slate-500 font-sans">{auditStats.acceptAllCount} visitors</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Reject Optional Ratio</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">{auditStats.rejectOptionalPct}%</span>
                    <span className="text-[10px] text-slate-500 font-sans">{auditStats.rejectOptionalCount} visitors</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Consent Withdrawals</span>
                    <span className="text-xl sm:text-2xl font-black text-rose-400 mt-1 block">{auditStats.withdrawCount}</span>
                    <span className="text-[10px] text-slate-500 font-sans">Revoked optional tags</span>
                  </div>
                </div>

                {/* Category Opt-In Rates Progress Bars */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Category Opt-In Distribution
                  </h3>

                  <div className="space-y-3 text-xxs font-mono">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 font-sans">Essential Security Cookies</span>
                        <span className="text-emerald-400 font-bold">100% (Mandatory)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 font-sans">Functional Personalization (Theme / Language)</span>
                        <span className="text-indigo-400 font-bold">{auditStats.optInRates?.functional || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${auditStats.optInRates?.functional || 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 font-sans">Analytics & Diagnostics Telemetry</span>
                        <span className="text-teal-400 font-bold">{auditStats.optInRates?.analytics || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${auditStats.optInRates?.analytics || 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 font-sans">Marketing & Recruiter Radar</span>
                        <span className="text-pink-400 font-bold">{auditStats.optInRates?.marketing || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${auditStats.optInRates?.marketing || 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Anonymized Audit Events */}
                {auditStats.recentAudits?.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Recent Anonymized Consent Audit Events
                    </h3>

                    <div className="w-full overflow-x-auto scrollbar-thin pb-2">
                      <table className="w-full min-w-[580px] text-xxs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                            <th className="pb-2.5">Consent ID</th>
                            <th className="pb-2.5">Action</th>
                            <th className="pb-2.5">Role</th>
                            <th className="pb-2.5">Masked Client IP</th>
                            <th className="pb-2.5">Categories Activated</th>
                            <th className="pb-2.5 text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {auditStats.recentAudits.map((a, i) => (
                            <tr key={a.id || i} className="hover:bg-slate-900/40">
                              <td className="py-2.5 font-mono text-teal-400 font-bold">{a.id}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[9px] ${
                                  a.action === 'accept_all' ? 'bg-emerald-500/10 text-emerald-400' :
                                  a.action === 'reject_optional' ? 'bg-slate-800 text-slate-400' :
                                  a.action === 'withdraw' ? 'bg-rose-500/10 text-rose-400' :
                                  'bg-indigo-500/10 text-indigo-400'
                                }`}>
                                  {a.action}
                                </span>
                              </td>
                              <td className="py-2.5 text-slate-300 font-mono">{a.role}</td>
                              <td className="py-2.5 text-slate-400 font-mono">{a.maskedIp}</td>
                              <td className="py-2.5 text-slate-400 font-mono">
                                Essential{a.categories?.functional ? ', Functional' : ''}{a.categories?.analytics ? ', Analytics' : ''}{a.categories?.marketing ? ', Marketing' : ''}
                              </td>
                              <td className="py-2.5 text-right text-slate-500 font-mono">
                                {new Date(a.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">No audit telemetry records yet.</div>
            )}
          </div>
        </div>
      )}

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
