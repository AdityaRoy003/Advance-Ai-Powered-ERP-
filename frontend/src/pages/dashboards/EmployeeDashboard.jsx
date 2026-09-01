import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { 
  FaUser, FaCalendarCheck, FaPlaneDeparture, FaFileDownload, 
  FaArrowRight, FaClipboardList, FaCheckCircle, FaUserTag 
} from 'react-icons/fa';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { addNotification } = useSocket();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveDays, setLeaveDays] = useState(3);
  const [leaveReason, setLeaveReason] = useState('');

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveReason) {
      toast.error('Please specify a reason for leave request');
      return;
    }

    toast.success('Leave application submitted to workflow managers!');
    
    // Dispatch mock notification to coordinator
    addNotification(
      'Leave Request Logged',
      `Leave request of ${leaveDays} days logged by ${user.firstName} ${user.lastName}.`,
      'approval'
    );

    // Save mock leave request in local storage for the approvals module
    const mockRequest = {
      id: 'L-' + Math.floor(Math.random() * 9000 + 1000),
      applicant: `${user.firstName} ${user.lastName}`,
      days: leaveDays,
      reason: leaveReason,
      status: 'Waiting Manager Approval',
      date: new Date().toLocaleDateString()
    };
    
    const existing = localStorage.getItem('eduverse_leaves');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(mockRequest);
    localStorage.setItem('eduverse_leaves', JSON.stringify(list));

    setLeaveReason('');
    setShowLeaveModal(false);
  };

  const handleDownloadPayslip = () => {
    toast.success('Dispatched download pipeline! Downloading PaySlip_July_2026.pdf...');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 text-xs font-semibold"
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between items-start gap-4">
        <div>
          <span className="text-indigo-200 font-bold uppercase tracking-widest text-xxs">Employee Workspace</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Hello {user.firstName}</h1>
          <p className="opacity-90 text-sm mt-1">{user.designation || 'Employee'} • {user.department || 'Engineering'} Department</p>
        </div>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance dial */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xxs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Attendance Rate</span>
            <span className="text-2xl font-black text-white">89%</span>
            <span className="text-xxs text-slate-400">Target: &gt;85% required</span>
          </div>
          {/* Custom SVG ring indicator */}
          <div className="w-14 h-14 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-850" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-indigo-500" strokeWidth="4" strokeDasharray="89, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xxs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Leave Balance</span>
            <span className="text-2xl font-black text-white">12 Days</span>
            <span className="text-xxs text-emerald-400 font-bold">18 days allocated total</span>
          </div>
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-lg text-emerald-400"><FaPlaneDeparture /></div>
        </div>

        {/* Access level */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xxs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Profile Access Status</span>
            <span className="text-2xl font-black text-white">{user.accessLevel}</span>
            <span className="text-xxs text-slate-400">Group permissions active</span>
          </div>
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-lg text-pink-400"><FaUserTag /></div>
        </div>
      </div>

      {/* Roster splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Profile overview */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <FaUser /> Roster Profile Overview
            </h2>
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Full Name</span>
                <span className="font-bold text-slate-100">{user.firstName} {user.lastName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Designation Role</span>
                <span className="font-bold text-indigo-400">{user.designation || 'Staff'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Department Group</span>
                <span className="font-bold text-slate-100">{user.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Assigned Email</span>
                <span className="font-bold text-slate-100 font-mono">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action shortcuts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-5">
            <span className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5"><FaClipboardList /> Workspace Actions</span>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowLeaveModal(true)}
                className="w-full flex items-center justify-between p-3.5 border border-slate-800 hover:border-indigo-500/30 hover:bg-slate-850 rounded-xl text-left transition group text-slate-250"
              >
                <div className="flex items-center gap-3">
                  <FaPlaneDeparture className="text-indigo-400" />
                  <span>Apply for Leaves</span>
                </div>
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transition text-indigo-450" />
              </button>

              <button 
                onClick={handleDownloadPayslip}
                className="w-full flex items-center justify-between p-3.5 border border-slate-800 hover:border-indigo-500/30 hover:bg-slate-850 rounded-xl text-left transition group text-slate-250"
              >
                <div className="flex items-center gap-3">
                  <FaFileDownload className="text-emerald-400" />
                  <span>Download July Pay slip</span>
                </div>
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transition text-emerald-450" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Modal Overlay */}
      <AnimatePresence>
        {showLeaveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-850 p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
            >
              <div className="text-center">
                <span className="text-indigo-400 font-bold text-xxs uppercase tracking-widest">Workflow Application</span>
                <h3 className="text-2xl font-black text-white mt-1">Apply for Leaves</h3>
                <p className="text-slate-400 text-xs mt-1">Specify parameters to submit to manager verification.</p>
              </div>

              <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Leave duration (Days)</label>
                  <input 
                    type="number" 
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(Number(e.target.value))}
                    max="12"
                    min="1"
                    className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 text-xs font-semibold text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Specify Reason</label>
                  <textarea 
                    placeholder="e.g. Medical checkup appointment or family event..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    rows="3"
                    className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 text-xs font-semibold text-white"
                  />
                </div>

                <div className="flex gap-3 mt-4 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setShowLeaveModal(false)}
                    className="flex-1 border border-slate-850 hover:bg-slate-850 text-slate-300 font-bold py-3 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
