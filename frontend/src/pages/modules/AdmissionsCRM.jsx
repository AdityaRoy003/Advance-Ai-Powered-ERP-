import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserGraduate, FaFilter, FaSearch, FaPlus, FaCheckCircle,
  FaClock, FaTimes, FaArrowRight, FaArrowLeft, FaIdCard,
  FaFileAlt, FaCheck, FaPhone, FaEnvelope, FaBuilding,
  FaGraduationCap, FaChevronRight, FaRegSmileBeam, FaExclamationTriangle
} from 'react-icons/fa';
import { AdmissionsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STAGES = [
  { id: 'lead', title: 'Leads & Inquiries', color: 'from-blue-600 to-cyan-600', pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'applied', title: 'Applied', color: 'from-indigo-600 to-purple-600', pill: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { id: 'verification', title: 'Doc Verification', color: 'from-amber-600 to-orange-600', pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'interview', title: 'Interview / Exam', color: 'from-purple-600 to-pink-600', pill: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'merit_list', title: 'Merit Offer Letter', color: 'from-teal-600 to-emerald-600', pill: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  { id: 'fee_deposit', title: 'Fee Deposit Due', color: 'from-rose-600 to-red-600', pill: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { id: 'enrolled', title: 'Enrolled & Active', color: 'from-emerald-600 to-green-600', pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
];

export default function AdmissionsCRM() {
  const [applications, setApplications] = useState([]);
  const [stageCounts, setStageCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedRecord, setTrackedRecord] = useState(null);

  // New applicant form
  const [newForm, setNewForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: 'B.Tech Computer Science & Engineering',
    entranceScore: 88,
    highSchoolGPA: 3.8
  });

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AdmissionsAPI.getAll({ search, program: filterProgram });
      if (data) {
        setApplications(data.applications || []);
        setStageCounts(data.stageCounts || {});
      }
    } catch (err) {
      toast.error('Failed to load admissions pipeline');
    } finally {
      setLoading(false);
    }
  }, [search, filterProgram]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleMoveStage = async (appId, nextStage) => {
    try {
      await AdmissionsAPI.updateStage(appId, nextStage, `Moved to ${nextStage.toUpperCase()} by admissions team.`);
      toast.success(`Applicant moved to ${nextStage.replace('_', ' ').toUpperCase()}`);
      fetchApplications();
      if (selectedApp && selectedApp._id === appId) {
        setSelectedApp(prev => ({ ...prev, stage: nextStage }));
      }
    } catch (err) {
      toast.error('Failed to update stage');
    }
  };

  const handleCreateApplicant = async (e) => {
    e.preventDefault();
    try {
      await AdmissionsAPI.create(newForm);
      toast.success('New applicant enrolled into pipeline!');
      setShowNewModal(false);
      setNewForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        program: 'B.Tech Computer Science & Engineering',
        entranceScore: 88,
        highSchoolGPA: 3.8
      });
      fetchApplications();
    } catch (err) {
      toast.error('Failed to create applicant');
    }
  };

  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    try {
      const res = await AdmissionsAPI.track(trackQuery.trim());
      setTrackedRecord(res);
    } catch (err) {
      toast.error('Application not found');
      setTrackedRecord(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* ─── HEADER & CRM METRICS ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 text-lg">
              <FaUserGraduate />
            </span>
            <span className="text-xxs font-mono font-bold uppercase tracking-wider text-indigo-400">
              ADMISSIONS & ENROLLMENT FUNNEL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Candidate Pipeline & Enrollment CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual recruitment Kanban tracking prospective leads from application to matriculation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowTrackModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-2"
          >
            <FaSearch /> Track Application
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25 flex items-center gap-2"
          >
            <FaPlus /> + New Applicant
          </button>
        </div>
      </div>

      {/* ─── STAGE COUNTERS BAR ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {STAGES.map(s => {
          const count = applications.filter(a => a.stage === s.id).length;
          return (
            <div key={s.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/60 shadow-sm flex flex-col justify-between">
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider truncate">{s.title}</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl font-black text-slate-900 dark:text-white">{count}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${s.pill}`}>
                  {count > 0 ? `${count} Active` : '0'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── CONTROLS: SEARCH & DEGREE FILTER ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaSearch /></span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates by name, email, app #..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">Program:</span>
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Academic Programs</option>
            <option value="Computer Science">B.Tech Computer Science & Eng</option>
            <option value="Artificial Intelligence">B.Tech AI & ML</option>
            <option value="Electronics">B.Tech Electronics & Comm</option>
            <option value="Management">MBA Tech Strategy</option>
            <option value="Design">B.Des User Experience</option>
          </select>
        </div>
      </div>

      {/* ─── KANBAN PIPELINE BOARD ─── */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {STAGES.map(s => {
            const stageApps = applications.filter(a => a.stage === s.id);
            return (
              <div key={s.id} className="w-80 flex-shrink-0 flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0f172a]/60 p-4 shadow-sm">
                
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.title}</span>
                  </div>
                  <span className="text-xxs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400">
                    {stageApps.length}
                  </span>
                </div>

                {/* Candidate Cards in Stage */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {stageApps.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                      No candidates in this stage
                    </div>
                  ) : (
                    stageApps.map(app => (
                      <motion.div
                        key={app._id || app.applicationNumber}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedApp(app)}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500/50 transition cursor-pointer shadow-sm group space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md">
                            {app.applicationNumber}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 font-mono">
                            GPA: {app.highSchoolGPA || 3.8}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition">
                            {app.firstName} {app.lastName}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {app.program}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800/80">
                          <span>Score: {app.entranceScore || 85}%</span>
                          <span className={`px-1.5 py-0.2 rounded font-bold ${
                            app.feeStatus === 'paid' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                          }`}>
                            Fee: {app.feeStatus}
                          </span>
                        </div>

                        {/* Fast Move Buttons */}
                        <div className="flex items-center justify-between pt-1 gap-1" onClick={e => e.stopPropagation()}>
                          {s.id !== 'lead' && (
                            <button
                              onClick={() => {
                                const currentIndex = STAGES.findIndex(st => st.id === s.id);
                                if (currentIndex > 0) handleMoveStage(app._id, STAGES[currentIndex - 1].id);
                              }}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 text-xxs"
                              title="Move Backward"
                            >
                              <FaArrowLeft size={9} />
                            </button>
                          )}
                          <span className="text-[9px] text-slate-500">Counselor: {app.assignedCounselor?.split(' ')[1] || 'Assigned'}</span>
                          {s.id !== 'enrolled' && (
                            <button
                              onClick={() => {
                                const currentIndex = STAGES.findIndex(st => st.id === s.id);
                                if (currentIndex < STAGES.length - 1) handleMoveStage(app._id, STAGES[currentIndex + 1].id);
                              }}
                              className="p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-400 text-xxs ml-auto font-bold flex items-center gap-1"
                              title="Advance Candidate"
                            >
                              <span>Next</span>
                              <FaArrowRight size={9} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ─── CANDIDATE DETAIL DRAWER ─── */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-[#0f172a] border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xxs font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                    {selectedApp.applicationNumber}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedApp.firstName} {selectedApp.lastName}
                  </h3>
                </div>
                <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>

              {/* Status & Degree Details */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Current Pipeline Stage:</span>
                  <span className="font-bold text-indigo-400 uppercase">{selectedApp.stage.replace('_', ' ')}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Target Program:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{selectedApp.program}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-300 font-mono">{selectedApp.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-300 font-mono">{selectedApp.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Entrance Percentile:</span>
                  <span className="font-bold text-emerald-400">{selectedApp.entranceScore}%</span>
                </div>
                {selectedApp.scholarshipGranted && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <p className="font-bold text-xs">Awarded Scholarship:</p>
                    <p className="text-xxs">{selectedApp.scholarshipGranted}</p>
                  </div>
                )}
              </div>

              {/* Advance Action Buttons */}
              <div>
                <p className="text-xxs font-bold uppercase tracking-wider text-slate-400 mb-2">Advance Candidate</p>
                <div className="grid grid-cols-2 gap-2">
                  {STAGES.map(st => (
                    <button
                      key={st.id}
                      onClick={() => handleMoveStage(selectedApp._id, st.id)}
                      className={`px-3 py-2 rounded-xl text-xxs font-bold transition border ${
                        selectedApp.stage === st.id
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500/40'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── NEW APPLICANT MODAL ─── */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowNewModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FaPlus className="text-indigo-400" /> New Candidate Application
                </h3>
                <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white"><FaTimes /></button>
              </div>

              <form onSubmit={handleCreateApplicant} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">First Name *</label>
                    <input
                      type="text" required
                      value={newForm.firstName}
                      onChange={e => setNewForm(f => ({ ...f, firstName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Last Name *</label>
                    <input
                      type="text" required
                      value={newForm.lastName}
                      onChange={e => setNewForm(f => ({ ...f, lastName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Email *</label>
                    <input
                      type="email" required
                      value={newForm.email}
                      onChange={e => setNewForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newForm.phone}
                      onChange={e => setNewForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Academic Program</label>
                  <select
                    value={newForm.program}
                    onChange={e => setNewForm(f => ({ ...f, program: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science & Engineering</option>
                    <option value="B.Tech Artificial Intelligence & ML">B.Tech Artificial Intelligence & ML</option>
                    <option value="B.Tech Electronics & Communication">B.Tech Electronics & Communication</option>
                    <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                    <option value="B.Des User Experience Design">B.Des User Experience Design</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-bold">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold">Enroll into Pipeline</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CANDIDATE TRACKING PORTAL MODAL ─── */}
      <AnimatePresence>
        {showTrackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowTrackModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FaSearch className="text-indigo-400" /> Candidate Application Lookup
                </h3>
                <button onClick={() => setShowTrackModal(false)} className="text-slate-400 hover:text-white"><FaTimes /></button>
              </div>

              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="Enter Application Number or Email..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">Track</button>
              </form>

              {trackedRecord && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{trackedRecord.firstName} {trackedRecord.lastName}</span>
                    <span className="text-xxs font-mono font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
                      {trackedRecord.applicationNumber}
                    </span>
                  </div>
                  <p className="text-slate-400">{trackedRecord.program}</p>
                  <div className="p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center gap-2 text-indigo-300">
                    <FaCheckCircle className="text-indigo-400" />
                    <span>Current Status: <strong>{trackedRecord.stage.replace('_', ' ').toUpperCase()}</strong></span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
