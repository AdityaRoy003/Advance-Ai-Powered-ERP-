import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCreditCard, FaCrown, FaCheck, FaArrowUp, FaDownload,
  FaFileInvoiceDollar, FaBuilding, FaUsers, FaDatabase,
  FaShieldAlt, FaRocket, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaCalendarAlt, FaSyncAlt, FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { InstitutionsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function InstitutionalBilling({ institutionId = null }) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState(null);
  const [upgrading, setUpgrading] = useState(false);

  // Active target institution id (passed prop, user's institutionId, or 'current')
  const targetId = institutionId || user?.institutionId || 'current';

  const fetchBilling = useCallback(async () => {
    setLoading(true);
    try {
      const data = await InstitutionsAPI.getBilling(targetId);
      if (data) {
        setBillingData(data);
      }
    } catch (err) {
      toast.error('Failed to load institutional subscription data');
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const handleOpenUpgrade = (planKey) => {
    setSelectedUpgradePlan(planKey);
    setUpgradeModalOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedUpgradePlan) return;
    setUpgrading(true);
    try {
      const instId = billingData?.institution?._id || targetId;
      const res = await InstitutionsAPI.upgradeSubscription(instId, {
        plan: selectedUpgradePlan,
        billingCycle
      });
      toast.success(`Successfully upgraded to ${selectedUpgradePlan.toUpperCase()} tier!`);
      setUpgradeModalOpen(false);
      fetchBilling();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading && !billingData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold">Loading Institutional Subscription & Quotas...</p>
      </div>
    );
  }

  const inst = billingData?.institution || { name: 'Campus Workspace', code: 'CAMPUS', plan: 'professional' };
  const sub = billingData?.subscription || { plan: 'professional', billingCycle: 'monthly', status: 'active' };
  const usage = billingData?.usage || {
    students: { current: 142, max: 500, percentage: 28 },
    faculty: { current: 24, max: 50, percentage: 48 },
    storage: { currentGB: 4.3, maxGB: 50, percentage: 9 },
    courses: { current: 12, max: 100, percentage: 12 },
    administrators: 3
  };
  const invoices = billingData?.invoices || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* ─── HEADER / CURRENT SUBSCRIPTION BANNER ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {sub.plan?.toUpperCase()} TIER
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                sub.status === 'trialing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                ● {sub.status === 'trialing' ? 'Active 14-Day Free Trial' : 'Active Subscription'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Cycle: {sub.billingCycle?.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <FaBuilding className="text-indigo-400 text-2xl" />
              <span>{inst.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">[{inst.code}]</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Institutional enterprise license with dedicated compute cluster, automated SIEM security audits, and multi-tenant department isolation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => handleOpenUpgrade('enterprise')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <FaCrown className="text-amber-300" />
              <span>Upgrade Tier</span>
            </button>
            <button
              onClick={fetchBilling}
              className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
              title="Refresh Quota Metrics"
            >
              <FaSyncAlt />
              <span className="hidden sm:inline">Refresh Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── SAAS QUOTA GAUGES ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaRocket className="text-indigo-400" />
            <span>Campus Resource Quotas & Active Allocation</span>
          </h2>
          <span className="text-xxs font-mono text-slate-400">Real-time sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Student Quota Gauge */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Enrolled</span>
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><FaUsers /></span>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{usage.students.current}</span>
                <span className="text-xs font-mono text-slate-400">/ {usage.students.max} max</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${usage.students.percentage > 85 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min(100, usage.students.percentage)}%` }}
                />
              </div>
              <p className="text-xxs text-slate-500 mt-2 font-mono">{usage.students.percentage}% allocated</p>
            </div>
          </div>

          {/* Faculty Quota Gauge */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty & Staff</span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><FaUsers /></span>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{usage.faculty.current}</span>
                <span className="text-xs font-mono text-slate-400">/ {usage.faculty.max} max</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, usage.faculty.percentage)}%` }}
                />
              </div>
              <p className="text-xxs text-slate-500 mt-2 font-mono">{usage.faculty.percentage}% allocated</p>
            </div>
          </div>

          {/* Cloud Storage Gauge */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Document Vault Storage</span>
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><FaDatabase /></span>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{usage.storage.currentGB} GB</span>
                <span className="text-xs font-mono text-slate-400">/ {usage.storage.maxGB} GB</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, usage.storage.percentage)}%` }}
                />
              </div>
              <p className="text-xxs text-slate-500 mt-2 font-mono">{usage.storage.percentage}% of cloud storage used</p>
            </div>
          </div>

          {/* Active Courses & Departments */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Curriculum</span>
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><FaCrown /></span>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{usage.courses.current} Courses</span>
                <span className="text-xs font-mono text-slate-400">Active</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, usage.courses.percentage)}%` }}
                />
              </div>
              <p className="text-xxs text-slate-500 mt-2 font-mono">{usage.administrators} Master Administrators</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PLAN COMPARISON & UPGRADE MATRIX ─── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaCreditCard className="text-indigo-400" />
              <span>Available Subscription Tiers</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Switch or scale plans anytime without data loss.</p>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <span>Annual</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-extrabold">20% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'starter',
              name: 'Starter Campus',
              price: billingCycle === 'annual' ? '₹3,999' : '₹4,999',
              period: '/mo',
              limit: '50 Students • 10 Faculty',
              storage: '10 GB Cloud Vault',
              features: ['5 Core Academic Departments', 'Attendance & Timetable Engine', 'Student Gradebooks', 'Standard Email Support']
            },
            {
              id: 'professional',
              name: 'Professional',
              price: billingCycle === 'annual' ? '₹11,999' : '₹14,999',
              period: '/mo',
              badge: 'ACTIVE PLAN',
              limit: '500 Students • 50 Faculty',
              storage: '50 GB Cloud Vault',
              features: ['Unlimited Academic Departments', 'Natural Voice ERP Assistant', 'SIEM Cybersecurity Center', 'Approvals Multi-Stage Engine', '24/7 Priority SLA']
            },
            {
              id: 'enterprise',
              name: 'Enterprise Multi-Campus',
              price: billingCycle === 'annual' ? '₹39,999' : '₹49,999',
              period: '/mo',
              limit: '5,000+ Students • 500 Faculty',
              storage: '500 GB Dedicated Storage',
              features: ['Cross-Campus Multi-Tenancy', 'Custom LLM AI Fine-Tuning', 'Blockchain Verified Credentials', 'Dedicated Solutions Architect', '99.99% Uptime Guarantee']
            }
          ].map((plan) => {
            const isCurrent = sub.plan === plan.id;
            return (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                  isCurrent 
                    ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/20 shadow-xl shadow-indigo-500/10' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/70 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{plan.name}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-xxs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        CURRENT TIER
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>

                  <div className="text-xxs font-mono text-slate-400 space-y-1 py-2 border-y border-slate-100 dark:border-slate-800">
                    <p className="flex items-center gap-1.5"><FaUsers className="text-indigo-400" /> {plan.limit}</p>
                    <p className="flex items-center gap-1.5"><FaDatabase className="text-cyan-400" /> {plan.storage}</p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaCheck className="text-emerald-400 shrink-0" size={10} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold cursor-default"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenUpgrade(plan.id)}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                    >
                      <span>Switch to {plan.name}</span>
                      <FaArrowUp size={10} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── INVOICE HISTORY TABLE ─── */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FaFileInvoiceDollar className="text-indigo-400" />
          <span>Billing History & GST Invoices</span>
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/70">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-xxs">
              <tr>
                <th className="p-4">Invoice Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">{inv.id}</td>
                  <td className="p-4 text-slate-400">{inv.date}</td>
                  <td className="p-4 font-semibold text-slate-300">{inv.plan} ({inv.cycle})</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{inv.amount}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xxs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toast.success(`Downloading tax invoice ${inv.id}...`)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 ml-auto text-xs"
                    >
                      <FaDownload size={10} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── UPGRADE CONFIRMATION MODAL ─── */}
      <AnimatePresence>
        {upgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setUpgradeModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-lg">
                    <FaCrown />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Confirm Plan Change</h3>
                    <p className="text-xs text-slate-400">Upgrade {inst.name}</p>
                  </div>
                </div>
                <button onClick={() => setUpgradeModalOpen(false)} className="text-slate-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">New Tier:</span>
                  <span className="font-mono font-black text-indigo-400 uppercase text-sm">{selectedUpgradePlan}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Billing Frequency:</span>
                  <span className="font-semibold capitalize text-slate-200">{billingCycle}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                  <FaCheckCircle className="shrink-0" />
                  <span>Student quotas and storage capacity expand immediately upon confirmation.</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUpgradeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUpgrade}
                  disabled={upgrading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-2"
                >
                  {upgrading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm & Activate Tier</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
