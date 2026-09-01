import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  FaStream, FaCheck, FaTimes, FaClock, FaPlus, FaArrowDown,
  FaUser, FaUserTie, FaUserShield, FaDollarSign, FaShoppingCart,
  FaFileSignature, FaChevronRight, FaFilter, FaHistory
} from 'react-icons/fa';

// ─── REUSABLE WORKFLOW ENGINE DEFINITIONS ───
const WORKFLOW_DEFINITIONS = {
  student_leave: {
    name: 'Student Leave Request',
    icon: '🏖️',
    color: 'indigo',
    stages: ['Student', 'Class Teacher', 'HOD (if >3 days)', 'Dean of Students', 'Approved']
  },
  faculty_leave: {
    name: 'Faculty Leave Request',
    icon: '✈️',
    color: 'purple',
    stages: ['Faculty Member', 'HOD', 'Principal', 'HR Manager', 'Approved']
  },
  expense_request: {
    name: 'Expense Reimbursement',
    icon: '💸',
    color: 'amber',
    stages: ['Employee', 'HOD', 'Finance Department', 'Admin', 'Payment Released']
  },
  purchase_request: {
    name: 'Purchase / Procurement',
    icon: '🛒',
    color: 'emerald',
    stages: ['Department Requestor', 'HOD', 'Finance', 'Principal', 'Vendor Purchase']
  },
  grade_moderation: {
    name: 'Grade Moderation',
    icon: '📝',
    color: 'teal',
    stages: ['Examiner', 'External Moderator', 'Controller of Examinations', 'Published']
  }
};

// ─── SAMPLE ACTIVE WORKFLOW INSTANCES ───
const INITIAL_REQUESTS = [
  {
    id: 'WF-0091', type: 'student_leave', applicant: 'Aditya Roy', date: '2026-08-29',
    details: '2 days leave — Medical appointment and follow-up tests',
    currentStage: 1, status: 'In Progress', priority: 'Normal'
  },
  {
    id: 'WF-0090', type: 'expense_request', applicant: 'Prof. Arjun Mehta', date: '2026-08-28',
    details: 'Conference travel reimbursement — IIT Delhi Workshop ₹8,200',
    currentStage: 2, status: 'In Progress', priority: 'Normal'
  },
  {
    id: 'WF-0089', type: 'purchase_request', applicant: 'Lab Coordinator CSE', date: '2026-08-27',
    details: 'Purchase 10 Raspberry Pi 5 units for IoT Lab — ₹45,000',
    currentStage: 1, status: 'In Progress', priority: 'High'
  },
  {
    id: 'WF-0085', type: 'student_leave', applicant: 'Priya Sharma', date: '2026-08-20',
    details: '1 day leave — Family function',
    currentStage: 4, status: 'Approved', priority: 'Normal'
  },
  {
    id: 'WF-0082', type: 'faculty_leave', applicant: 'Dr. Nair', date: '2026-08-15',
    details: '3 days leave — Research paper presentation at NIT Trichy',
    currentStage: 4, status: 'Approved', priority: 'Low'
  }
];

export default function ApprovalsWorkflow() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active'); // active | history | new_request | workflow_defs
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // New request form
  const [newType, setNewType] = useState('student_leave');
  const [newDetails, setNewDetails] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');

  const roleUpper = user?.role?.toUpperCase() || 'EMPLOYEE';
  const isApprover = ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'TEACHER'].includes(roleUpper);

  const getWorkflowDef = (type) => WORKFLOW_DEFINITIONS[type] || WORKFLOW_DEFINITIONS.student_leave;

  const getColorClasses = (color) => {
    const map = {
      indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' }
    };
    return map[color] || map.indigo;
  };

  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const def = getWorkflowDef(r.type);
      const nextStage = r.currentStage + 1;
      const isComplete = nextStage >= def.stages.length - 1;
      return { ...r, currentStage: nextStage, status: isComplete ? 'Approved' : 'In Progress' };
    }));
    toast.success(`Approval action recorded — workflow advanced!`);
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    toast.error(`Request ${id} rejected and returned to applicant.`);
  };

  const handleSubmitNewRequest = (e) => {
    e.preventDefault();
    if (!newDetails) return;
    const def = getWorkflowDef(newType);
    const req = {
      id: `WF-${Math.floor(Math.random() * 9000 + 1000)}`,
      type: newType,
      applicant: `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim(),
      date: new Date().toISOString().split('T')[0],
      details: newDetails,
      currentStage: 0,
      status: 'In Progress',
      priority: newPriority
    };
    setRequests([req, ...requests]);
    setNewDetails('');
    toast.success(`${def.name} workflow initiated — ID: ${req.id}`);
    setActiveTab('active');
  };

  const filtered = requests.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  const active = filtered.filter(r => r.status === 'In Progress');
  const history = filtered.filter(r => ['Approved', 'Rejected'].includes(r.status));

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-8 border border-slate-800 shadow-xl">
        <span className="text-purple-400 font-bold uppercase tracking-widest text-xxs">Reusable Workflow Engine</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Approval Workflow Center</h1>
        <p className="text-slate-400 text-sm mt-1">Multi-stage configurable approval engine for leave, expenses, purchases, and grade moderation.</p>
      </div>

      {/* Stat Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Pending Approvals', val: requests.filter(r => r.status === 'In Progress').length, color: 'text-amber-400' },
          { label: 'Approved', val: requests.filter(r => r.status === 'Approved').length, color: 'text-emerald-400' },
          { label: 'Rejected', val: requests.filter(r => r.status === 'Rejected').length, color: 'text-rose-400' },
          { label: 'Total Workflows', val: requests.length, color: 'text-indigo-400' }
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl border border-slate-800 bg-[#111827]/60 text-center">
            <span className={`text-2xl font-black block ${s.color}`}>{s.val}</span>
            <span className="text-xxs text-slate-400 font-sans">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 flex-wrap">
        {[
          { id: 'active', label: 'Active Workflows', icon: <FaStream /> },
          { id: 'history', label: 'History & Archives', icon: <FaHistory /> },
          { id: 'new_request', label: 'Submit New Request', icon: <FaPlus /> },
          { id: 'workflow_defs', label: 'Workflow Definitions', icon: <FaChevronRight /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {(activeTab === 'active' || activeTab === 'history') && (
        <div className="flex items-center gap-3 flex-wrap">
          <FaFilter className="text-slate-500" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-bold">
            <option value="all">All Types</option>
            {Object.entries(WORKFLOW_DEFINITIONS).map(([key, def]) => <option key={key} value={key}>{def.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-bold">
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      )}

      {/* ─── ACTIVE WORKFLOWS ─── */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-5">
          {active.length === 0 && (
            <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">No active workflows to display.</div>
          )}
          {active.map(req => {
            const def = getWorkflowDef(req.type);
            const colors = getColorClasses(def.color);
            return (
              <div key={req.id} className={`p-6 rounded-2xl border ${colors.border} bg-[#111827]/60 flex flex-col gap-5 shadow-sm`}>
                {/* Header row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{def.icon}</span>
                    <div>
                      <span className={`font-black text-sm text-white block`}>{def.name}</span>
                      <span className="text-xxs text-slate-400">{req.applicant} • {req.date} • ID: {req.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xxs font-bold ${req.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>{req.priority}</span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xxs font-bold">In Progress</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">{req.details}</p>

                {/* Visual stage pipeline */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {def.stages.map((stage, i) => {
                    const done = i < req.currentStage;
                    const current = i === req.currentStage;
                    return (
                      <React.Fragment key={i}>
                        <div className={`flex flex-col items-center gap-1 flex-shrink-0 ${done ? colors.text : current ? 'text-white' : 'text-slate-600'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 ${done ? `${colors.bg} border-current` : current ? 'bg-white text-indigo-900 border-white' : 'bg-slate-900 border-slate-700'}`}>
                            {done ? <FaCheck size={10} /> : i + 1}
                          </div>
                          <span className="text-xxs text-center max-w-[80px] leading-tight">{stage}</span>
                        </div>
                        {i < def.stages.length - 1 && (
                          <div className={`flex-1 h-0.5 min-w-4 ${i < req.currentStage ? colors.bg.replace('/10', '/50') : 'bg-slate-800'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Approve / Reject (for approvers) */}
                {isApprover && (
                  <div className="flex gap-3 pt-2 border-t border-slate-800">
                    <button onClick={() => handleApprove(req.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                      <FaCheck /> Approve & Advance
                    </button>
                    <button onClick={() => handleReject(req.id)} className="flex-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-rose-500/30">
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── HISTORY ─── */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-3">
          {history.length === 0 && (
            <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">No archived workflows.</div>
          )}
          {history.map(req => {
            const def = getWorkflowDef(req.type);
            return (
              <div key={req.id} className="p-4 rounded-xl border border-slate-800 bg-[#111827]/60 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{def.icon}</span>
                  <div>
                    <span className="font-bold text-white text-xs block">{def.name} — {req.applicant}</span>
                    <span className="text-xxs text-slate-400">{req.date} • {req.details.slice(0, 60)}…</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xxs font-bold ${req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{req.status}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── NEW REQUEST ─── */}
      {activeTab === 'new_request' && (
        <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-5 max-w-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaPlus className="text-indigo-400" /> Submit New Workflow Request</h2>
          <form onSubmit={handleSubmitNewRequest} className="flex flex-col gap-4">
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Request Type</label>
              <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold">
                {Object.entries(WORKFLOW_DEFINITIONS).map(([key, def]) => (
                  <option key={key} value={key}>{def.icon} {def.name}</option>
                ))}
              </select>
            </div>

            {/* Workflow preview */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <span className="text-xxs text-slate-400 uppercase font-bold">Approval Path</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {getWorkflowDef(newType).stages.map((stage, i) => (
                  <React.Fragment key={i}>
                    <span className="text-xxs text-slate-300 font-semibold">{stage}</span>
                    {i < getWorkflowDef(newType).stages.length - 1 && <FaChevronRight className="text-slate-600" size={8} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Request Details / Justification</label>
              <textarea value={newDetails} onChange={e => setNewDetails(e.target.value)} placeholder="Describe the request with any supporting context…" rows="3" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
            </div>
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Priority</label>
              <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold">
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High — Urgent</option>
              </select>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs">
              Submit to Approval Workflow
            </button>
          </form>
        </div>
      )}

      {/* ─── WORKFLOW DEFINITIONS ─── */}
      {activeTab === 'workflow_defs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Object.entries(WORKFLOW_DEFINITIONS).map(([key, def]) => {
            const colors = getColorClasses(def.color);
            return (
              <div key={key} className={`p-6 rounded-2xl border ${colors.border} bg-[#111827]/60 flex flex-col gap-4`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{def.icon}</span>
                  <div>
                    <span className={`font-black text-sm ${colors.text}`}>{def.name}</span>
                    <span className="text-xxs text-slate-400 block">{def.stages.length} stages</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {def.stages.map((stage, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xxs font-bold ${colors.bg} ${colors.text} flex-shrink-0`}>{i + 1}</div>
                      <span className="text-xs text-slate-200 font-semibold">{stage}</span>
                      {i < def.stages.length - 1 && <FaArrowDown className="text-slate-700 ml-auto flex-shrink-0" size={10} />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
