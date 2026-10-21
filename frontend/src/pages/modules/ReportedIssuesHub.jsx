import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaBug, FaSearch, FaFilter, FaSync, FaCheckCircle, 
  FaExclamationTriangle, FaClock, FaCheck, FaTimes, 
  FaPaperPlane, FaDownload, FaCopy, FaEdit, FaUser, 
  FaEnvelope, FaShieldAlt, FaComments, FaBell, FaCheckDouble
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { IssuesAPI } from '../../services/api';

export default function ReportedIssuesHub({ embedded = false }) {
  const { user } = useAuth();

  // State
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, critical: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution Modal State
  const [activeIssue, setActiveIssue] = useState(null);
  const [targetStatus, setTargetStatus] = useState('Resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [notifyUser, setNotifyUser] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch all issues & metrics
  const loadData = async () => {
    setLoading(true);
    try {
      const [list, metrics] = await Promise.all([
        IssuesAPI.getAll(),
        IssuesAPI.getStats()
      ]);
      setIssues(list || []);
      setStats(metrics || { total: 0, open: 0, inProgress: 0, resolved: 0, critical: 0 });
    } catch (err) {
      toast.error('Failed to load user issues queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick 1-click resolve
  const handleQuickResolve = async (issue) => {
    try {
      await IssuesAPI.update(issue._id, {
        status: 'Resolved',
        resolutionNotes: 'Verified and resolved by system administration team.',
        updateMessage: 'Your reported issue has been verified and resolved. All systems are operational.',
        notifyUser: true
      });
      toast.success(`Ticket ${issue.ticketId} marked as Resolved and user notified!`);
      loadData();
    } catch (err) {
      toast.error('Failed to resolve issue');
    }
  };

  // Detailed solve & notify modal submission
  const handleSolveAndNotify = async (e) => {
    e.preventDefault();
    if (!activeIssue) return;

    setUpdating(true);
    try {
      const res = await IssuesAPI.update(activeIssue._id, {
        status: targetStatus,
        resolutionNotes: resolutionNotes.trim(),
        updateMessage: resolutionNotes.trim() || `Status updated to ${targetStatus}`,
        notifyUser
      });

      const emailNote = res?.recipientEmail ? ` to ${res.recipientEmail}` : '';
      toast.success(
        `Ticket ${activeIssue.ticketId} updated to ${targetStatus}! ${
          notifyUser ? `Notification dispatched${emailNote}.` : ''
        }`
      );

      setActiveIssue(null);
      setResolutionNotes('');
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update issue');
    } finally {
      setUpdating(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (issues.length === 0) {
      toast.error('No issues to export');
      return;
    }

    const headers = 'Ticket ID,Title,Category,Severity,Status,Reporter Name,Reporter Email,Role,Date Reported\n';
    const rows = issues
      .map(
        (i) =>
          `"${i.ticketId}","${i.title.replace(/"/g, '""')}","${i.category}","${i.severity}","${i.status}","${i.reportedBy?.name || ''}","${i.reportedBy?.email || ''}","${i.reportedBy?.role || ''}","${new Date(i.createdAt).toISOString()}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reported_Issues_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Issues queue exported as CSV!');
  };

  // Filtered issues list
  const filteredIssues = issues.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.ticketId?.toLowerCase().includes(q) ||
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.reportedBy?.name?.toLowerCase().includes(q) ||
      item.reportedBy?.email?.toLowerCase().includes(q);

    return matchesStatus && matchesSeverity && matchesCategory && matchesQuery;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 text-xs font-semibold"
    >
      {/* ─── HEADER BANNER ─── */}
      {!embedded ? (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-sm">
                <FaBug />
              </span>
              <span className="text-xxs font-mono uppercase tracking-widest text-indigo-400 font-bold">
                Administration & Operations Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Reported Issues & Resolution Hub
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl leading-relaxed">
              Centralized triage queue for user-submitted bugs, performance issues, and inquiries. Solve problems, record solutions, and dispatch automated in-app and email resolution notifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-2 text-xs"
            >
              <FaDownload /> Export CSV
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-2 text-xs shadow-lg shadow-indigo-600/30"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs"><FaBug /></span>
              <h2 className="text-lg font-bold text-white">Reported Issues & Resolution Desk</h2>
            </div>
            <p className="text-slate-400 text-xxs">Review tickets submitted by students, faculty, and staff. Solve and notify user.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 text-xs"
            >
              <FaDownload size={11} /> CSV
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1.5 text-xs"
            >
              <FaSync size={11} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── KPI METRICS SUMMARY ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/60 shadow-sm flex flex-col gap-1">
          <span className="text-xxs font-mono uppercase text-slate-400 font-bold">Total Issues Logged</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats.total}</span>
          <span className="text-xxs text-slate-500">Across web & mobile portals</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-xxs font-mono uppercase text-rose-500 dark:text-rose-400 font-bold">Open / Pending</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-rose-500 dark:text-rose-400">{stats.open}</span>
          <span className="text-xxs text-rose-600/70 dark:text-rose-400/70">Awaiting engineering triage</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 shadow-sm flex flex-col gap-1">
          <span className="text-xxs font-mono uppercase text-amber-500 dark:text-amber-400 font-bold">In Progress</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">{stats.inProgress}</span>
          <span className="text-xxs text-amber-600/70 dark:text-amber-400/70">Under active investigation</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-xxs font-mono uppercase text-emerald-500 dark:text-emerald-400 font-bold">Resolved / Closed</span>
            <FaCheckCircle className="text-emerald-500 text-xs" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400">{stats.resolved}</span>
          <span className="text-xxs text-emerald-600/70 dark:text-emerald-400/70">
            {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% Resolution Rate
          </span>
        </div>
      </div>

      {/* ─── CONTROLS & SEARCH BAR ─── */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/60 shadow-sm flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xxs font-mono text-slate-400 uppercase mr-1 flex items-center gap-1">
            <FaFilter /> Status:
          </span>
          {['ALL', 'Open', 'In Progress', 'Under Review', 'Resolved', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity, Category & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Bug">Bug</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Performance">Performance</option>
            <option value="Account & Access">Account & Access</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xxs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, user, title..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ─── ISSUES LIST / QUEUE ─── */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-mono text-xs">
            Loading reported issues queue...
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <FaCheckCircle className="text-emerald-500 text-3xl mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No issues match the active filter</h3>
            <p className="text-xs text-slate-500 mt-1">All user reported items in this category have been processed or none were logged.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue._id || issue.ticketId}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#111827]/70 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                    {issue.ticketId}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider ${
                      issue.status === 'Resolved' || issue.status === 'Closed'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : issue.status === 'In Progress' || issue.status === 'Under Review'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    ● {issue.status}
                  </span>

                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xxs">
                    {issue.category}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-lg text-xxs font-mono font-bold ${
                      issue.severity === 'Critical'
                        ? 'bg-rose-500/15 text-rose-500 dark:bg-rose-900/50 dark:text-rose-300'
                        : issue.severity === 'High'
                        ? 'bg-amber-500/15 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {issue.severity} Priority
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>

                {/* Reporter & Metadata */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xxs text-slate-500 font-mono pt-1">
                  <span>
                    Reported by: <strong className="text-slate-700 dark:text-slate-300">{issue.reportedBy?.name}</strong>{' '}
                    ({issue.reportedBy?.email})
                  </span>
                  <span>
                    Role: <strong className="text-slate-700 dark:text-slate-300">{issue.reportedBy?.role}</strong>
                  </span>
                  <span>
                    Date: {new Date(issue.createdAt).toLocaleDateString()} at{' '}
                    {new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Display official resolution snippet if resolved */}
                {issue.resolutionNotes && (
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xxs flex items-start gap-2">
                    <FaCheck className="mt-0.5 shrink-0 text-emerald-500" />
                    <div>
                      <span className="font-bold uppercase font-mono block">Resolution Delivered:</span>
                      <span>{issue.resolutionNotes}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full lg:w-auto justify-end">
                {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
                  <button
                    onClick={() => handleQuickResolve(issue)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
                    title="Mark resolved and automatically notify user"
                  >
                    <FaCheck /> Quick Resolve
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveIssue(issue);
                    setTargetStatus(issue.status === 'Open' ? 'In Progress' : issue.status);
                    setResolutionNotes(issue.resolutionNotes || '');
                    setNotifyUser(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
                >
                  <FaEdit /> Manage & Solve
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── RESOLUTION & NOTIFICATION MODAL / DRAWER ─── */}
      {activeIssue && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10005] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0a0f1d] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-xs text-slate-300 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-indigo-400">
                    {activeIssue.ticketId}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xxs font-bold bg-slate-800 text-slate-300">
                    {activeIssue.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xxs font-bold uppercase bg-rose-500/20 text-rose-400">
                    {activeIssue.severity} Priority
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">{activeIssue.title}</h3>
              </div>
              <button
                onClick={() => setActiveIssue(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Reporter Information & Full Description */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
              <span className="text-xxs font-mono uppercase text-slate-400 font-bold block">
                User Issue Description & Environment
              </span>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {activeIssue.description}
              </p>
              <div className="pt-2 border-t border-slate-850 flex flex-wrap items-center justify-between text-xxs font-mono text-slate-400">
                <span>
                  Submitted by: <strong className="text-slate-200">{activeIssue.reportedBy?.name}</strong> (
                  {activeIssue.reportedBy?.email})
                </span>
                <span>Role: {activeIssue.reportedBy?.role}</span>
              </div>
            </div>

            {/* History of Previous Updates */}
            <div>
              <span className="text-xxs font-mono uppercase text-slate-400 font-bold block mb-2">
                Ticket Activity & Past Updates ({activeIssue.updates?.length || 0})
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {(activeIssue.updates || []).map((upd, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xxs flex justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{upd.updatedBy}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-indigo-300 font-mono">
                          {upd.status}
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans">{upd.message}</p>
                    </div>
                    <span className="font-mono text-slate-500 shrink-0 text-[10px]">
                      {new Date(upd.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Form */}
            <form onSubmit={handleSolveAndNotify} className="space-y-4 pt-3 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-mono uppercase text-slate-400 font-bold mb-1">
                    Update Lifecycle Status *
                  </label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Open">Open — Awaiting Engineering Triage</option>
                    <option value="In Progress">In Progress — Work Underway</option>
                    <option value="Under Review">Under Review — Testing Fix</option>
                    <option value="Resolved">Resolved — Solved & Verified</option>
                    <option value="Closed">Closed — Complete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xxs font-mono uppercase text-slate-400 font-bold mb-1">
                    Notification Channel
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <FaBell className="text-amber-400 text-xs" />
                      In-App Bell Alert + Email
                    </span>
                    <input
                      type="checkbox"
                      id="notifyToggle"
                      checked={notifyUser}
                      onChange={(e) => setNotifyUser(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xxs font-mono uppercase text-slate-400 font-bold">
                    Resolution Note & User Guidance Message *
                  </label>
                  <span className="text-xxs text-slate-500">
                    Sent directly to the user upon update
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail how the issue was resolved, technical fix applied, or steps the user should verify..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs resize-none focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Quick Preset Response Chips */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xxs font-mono text-slate-400 mr-1 self-center">
                  Quick Presets:
                </span>
                {[
                  'Issue resolved. Hotfix deployed to production module.',
                  'Under active investigation by infrastructure team.',
                  'Bug fixed and verified in release v2.4.0.',
                  'Database indexing and query cache optimized.',
                  'Please clear browser cache and retry operation.'
                ].map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setResolutionNotes(preset)}
                    className="px-2 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-xxs transition font-mono"
                  >
                    + {preset.slice(0, 22)}...
                  </button>
                ))}
              </div>

              {/* Notification Banner */}
              {notifyUser && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xxs flex items-center gap-2">
                  <FaPaperPlane className="text-indigo-400 shrink-0" />
                  <span>
                    When committed, an automated resolution alert will be dispatched to{' '}
                    <strong className="text-white">{activeIssue.reportedBy?.email}</strong> and emitted to their in-app notification center.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveIssue(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  {updating ? (
                    'Processing & Notifying...'
                  ) : (
                    <>
                      <FaCheckDouble /> Solve Issue & Notify User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
