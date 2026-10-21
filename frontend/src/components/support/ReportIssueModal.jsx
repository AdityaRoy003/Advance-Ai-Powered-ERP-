import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaExclamationTriangle, FaTimes, FaBug, FaCheckCircle, 
  FaClock, FaSearch, FaCopy, FaPaperPlane, FaShieldAlt, FaComments
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { IssuesAPI } from '../../services/api';

export default function ReportIssueModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'track'

  // Report Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bug');
  const [severity, setSeverity] = useState('Medium');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Track Ticket state
  const [searchTicketId, setSearchTicketId] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedIssue, setTrackedIssue] = useState(null);

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (user) {
      setName(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '');
      setEmail(user.email || '');
    }
  }, [user, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !name.trim() || !email.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        name: name.trim(),
        email: email.trim(),
        role: user?.roleName || user?.role || 'Visitor'
      };

      const res = await IssuesAPI.reportIssue(payload);
      setSubmittedTicket(res);
      toast.success('Issue reported successfully! Ticket generated.');
      setTitle('');
      setDescription('');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to submit issue report.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackTicket = async (e) => {
    e.preventDefault();
    if (!searchTicketId.trim()) return;

    setTrackingLoading(true);
    setTrackedIssue(null);
    try {
      const res = await IssuesAPI.track(searchTicketId.trim().toUpperCase());
      setTrackedIssue(res);
    } catch (err) {
      toast.error('Ticket not found. Please verify the Ticket Reference ID.');
    } finally {
      setTrackingLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10003] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-issue-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-[#0a0f1d] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white text-xs font-sans"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 text-lg border border-rose-500/30">
                <FaExclamationTriangle />
              </span>
              <div>
                <h2 id="report-issue-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight">
                  EduVerse AI ERP — Help Desk & Issue Resolution
                </h2>
                <span className="text-xxs font-mono text-slate-400 mt-0.5 block">
                  Report bugs, system anomalies, or track your existing support ticket
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close modal"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2 gap-4">
            <button
              onClick={() => { setActiveTab('report'); setSubmittedTicket(null); }}
              className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                activeTab === 'report'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FaBug /> Report New Issue
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                activeTab === 'track'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FaSearch /> Track Issue Status
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin text-slate-300">
            {activeTab === 'report' ? (
              submittedTicket ? (
                /* Success Confirmation State */
                <div className="flex flex-col items-center text-center p-6 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl border border-emerald-500/30">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Issue Logged with Engineering Team</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      Your report has been routed to the Super Admin and platform engineers. You can track updates anytime with your ticket reference ID.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-xl border border-indigo-500/30">
                    <span className="font-mono text-sm font-bold text-indigo-400">
                      {submittedTicket.ticketId}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(submittedTicket.ticketId);
                        toast.success('Ticket ID copied to clipboard!');
                      }}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                      title="Copy Ticket ID"
                    >
                      <FaCopy />
                    </button>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setSubmittedTicket(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                    >
                      Report Another Issue
                    </button>
                    <button
                      onClick={() => {
                        setSearchTicketId(submittedTicket.ticketId);
                        setActiveTab('track');
                        setSubmittedTicket(null);
                        IssuesAPI.track(submittedTicket.ticketId).then(setTrackedIssue);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
                    >
                      Track Updates Now
                    </button>
                  </div>
                </div>
              ) : (
                /* Report Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aditya Raj"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-indigo-500 focus:outline-none text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xxs font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. aditya@eduverse.ai"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-indigo-500 focus:outline-none text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-indigo-500 focus:outline-none text-white text-xs"
                      >
                        <option value="Bug">Software Bug / Error</option>
                        <option value="UI/UX">UI / Display & Styling</option>
                        <option value="Performance">System Latency & Performance</option>
                        <option value="Account & Access">Account, Permissions & Access</option>
                        <option value="Feature Request">Feature Request / Enhancement</option>
                        <option value="Other">Other Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xxs font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Severity Level
                      </label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-indigo-500 focus:outline-none text-white text-xs"
                      >
                        <option value="Low">Low — Minor visual glitch or question</option>
                        <option value="Medium">Medium — Workaround available</option>
                        <option value="High">High — Important workflow impaired</option>
                        <option value="Critical">Critical — Service block / blocker</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Issue Summary / Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Timetable conflict solver false positive in Room 302"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-indigo-500 focus:outline-none text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Detailed Description & Steps to Reproduce *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what occurred, what you expected, browser/device details, or any error messages displayed..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-indigo-500 focus:outline-none text-white text-xs resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting Report...' : <><FaPaperPlane /> Submit Issue Report</>}
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* Ticket Tracking View */
              <div className="space-y-4">
                <form onSubmit={handleTrackTicket} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchTicketId}
                      onChange={(e) => setSearchTicketId(e.target.value)}
                      placeholder="Enter Ticket ID (e.g. ISS-2026-1042)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-indigo-500 focus:outline-none text-white text-xs font-mono uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={trackingLoading || !searchTicketId.trim()}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition text-xs disabled:opacity-50 flex items-center gap-2"
                  >
                    {trackingLoading ? 'Searching...' : <><FaSearch /> Check Status</>}
                  </button>
                </form>

                {trackedIssue && (
                  <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-indigo-400">
                            {trackedIssue.ticketId}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider ${
                            trackedIssue.status === 'Resolved' || trackedIssue.status === 'Closed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : trackedIssue.status === 'In Progress'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          }`}>
                            ● {trackedIssue.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{trackedIssue.title}</h4>
                      </div>

                      <div className="text-right text-xxs font-mono text-slate-400">
                        <span>Reported {new Date(trackedIssue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xxs font-mono uppercase text-slate-400 block mb-1">Issue Details</span>
                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-850">
                        {trackedIssue.description}
                      </p>
                    </div>

                    {trackedIssue.resolutionNotes && (
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                        <span className="text-xxs font-bold font-mono uppercase block mb-1">Official Resolution Note</span>
                        <p className="text-xs">{trackedIssue.resolutionNotes}</p>
                      </div>
                    )}

                    {/* Timeline of updates */}
                    <div>
                      <span className="text-xxs font-mono uppercase text-slate-400 block mb-2">Resolution Progress Updates</span>
                      <div className="space-y-2">
                        {(trackedIssue.updates || []).map((upd, idx) => (
                          <div key={idx} className="flex gap-3 text-xxs p-2.5 rounded-xl bg-slate-950/60 border border-slate-850">
                            <span className="text-indigo-400 mt-0.5"><FaComments /></span>
                            <div className="flex-1">
                              <div className="flex justify-between items-center text-slate-400 font-mono mb-0.5">
                                <span className="font-bold text-slate-300">{upd.updatedBy}</span>
                                <span>{new Date(upd.timestamp).toLocaleDateString()} {new Date(upd.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-slate-300 font-sans">{upd.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
