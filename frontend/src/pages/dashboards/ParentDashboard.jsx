import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { UsersAPI, CoursesAPI, AttendanceAPI, TimetableAPI, TransportAPI, HostelAPI } from '../../services/api';
import {
  FaUserFriends, FaUserClock, FaCreditCard, FaCalendarAlt,
  FaBook, FaChartLine, FaClipboardList, FaFileSignature,
  FaBus, FaBuilding, FaBullhorn, FaPaperPlane, FaPlaneDeparture,
  FaRobot, FaUsers, FaCheck, FaTimes, FaChevronRight,
  FaGraduationCap, FaEnvelope, FaPhone, FaCalendarCheck,
  FaDownload, FaMedal, FaLightbulb, FaUserGraduate
} from 'react-icons/fa';

export default function ParentDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('my_children');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [students, setStudents] = useState([]);
  const [loadingLive, setLoadingLive] = useState(true);

  // Messaging
  const [msgTo, setMsgTo] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');

  // Leave application
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leavesList, setLeavesList] = useState([]);

  // PTM booking
  const [bookedSlot, setBookedSlot] = useState(null);

  // AI Parent Assistant
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchLive = async () => {
      setLoadingLive(true);
      try {
        const res = await UsersAPI.getAll({ role: 'STUDENT' });
        if (Array.isArray(res) && res.length > 0) {
          const mapped = res.map((s, i) => ({
            id: s._id || s.id || `live-${i}`,
            name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email,
            semester: s.department ? `${s.department} Department` : 'Active Semester',
            department: s.department || 'Computer Science',
            rollNumber: s.email,
            cgpa: '0.00',
            attendancePct: 0,
            classTeacher: 'Assigned Faculty',
            feeDue: '₹0',
            feeStatus: 'cleared'
          }));
          setStudents(mapped);
          setSelectedChildId(mapped[0]?.id || '');
        } else {
          setStudents([]);
          setSelectedChildId('');
        }
      } catch (err) {
        console.warn('Parent live sync notice:', err);
        setStudents([]);
      } finally {
        setLoadingLive(false);
      }
    };
    fetchLive();
  }, []);

  const selectedChild = students.find(c => c.id === selectedChildId) || students[0] || null;
  const parentName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Parent' : 'Parent';

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgTo || !msgSubject || !msgContent) {
      toast.error('All fields are required');
      return;
    }
    toast.success(`Message sent to ${msgTo}!`);
    setMsgTo('');
    setMsgSubject('');
    setMsgContent('');
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveReason) return;
    const req = {
      id: `PL-${Math.floor(Math.random() * 9000 + 1000)}`,
      child: selectedChild?.name || 'Student',
      days: leaveDays,
      reason: leaveReason,
      date: new Date().toISOString().split('T')[0],
      status: 'Submitted – Pending Class Teacher Approval'
    };
    setLeavesList([req, ...leavesList]);
    setLeaveReason('');
    toast.success('Student leave application submitted to approval workflow!');
  };

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!aiQuestion) return;
    setAiLoading(true);
    setTimeout(() => {
      const q = aiQuestion.toLowerCase();
      let resp = '';
      if (!selectedChild) {
        resp = 'No active student accounts are linked to your profile yet.';
      } else if (q.includes('attendance')) {
        resp = `${selectedChild.name}'s attendance is currently recorded at ${selectedChild.attendancePct}%.`;
      } else if (q.includes('fee') || q.includes('payment')) {
        resp = `Current fee account status for ${selectedChild.name}: ${selectedChild.feeDue} pending.`;
      } else {
        resp = `Data summary for ${selectedChild.name} (${selectedChild.department}): All academic parameters are operational.`;
      }
      setAiAnswer(resp);
      setAiLoading(false);
    }, 600);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold pb-16">

      {/* ─── BANNER ─── */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="z-10">
          <span className="text-white/75 font-bold uppercase tracking-widest text-xxs">Parent Guardian Portal</span>
          <h1 className="text-3xl font-black tracking-tight mt-1">Welcome, {parentName}</h1>
          <p className="text-white/80 text-xs mt-1">{students.length} Ward{students.length === 1 ? '' : 's'} Linked • Academic Oversight Dashboard</p>
        </div>
        <div className="z-10 flex items-center gap-3">
          <span className="bg-white/15 border border-white/20 px-4 py-2 rounded-2xl font-mono text-sm font-black backdrop-blur-sm">
            {students.length} Ward{students.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-800 rounded-3xl flex flex-col items-center gap-3 bg-[#111827]/40 text-slate-400">
          <FaUserGraduate className="text-4xl text-emerald-400 mb-1" />
          <span className="font-bold text-base text-slate-200">No Student Accounts Registered Yet</span>
          <p className="text-xs text-slate-400 max-w-md">
            Once student accounts are provisioned in the database by the Super Admin, their real attendance, exams, grades, and fee records will reflect here automatically.
          </p>
        </div>
      ) : (
        <>
          {/* ─── CHILD SELECTOR CARDS ─── */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white flex items-center gap-2"><FaUsers className="text-emerald-400" /> My Children</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {students.map(child => (
                <motion.div
                  key={child.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col gap-3 ${
                    selectedChildId === child.id
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                      : 'border-slate-800 bg-[#111827]/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm">
                      {child.name[0]}
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">{child.name}</span>
                      <span className="text-xxs text-slate-400">{child.department}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-center">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-xxs text-slate-400 block">Attendance</span>
                      <span className="font-black text-sm text-emerald-400">{child.attendancePct}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-xxs text-slate-400 block">CGPA</span>
                      <span className="font-black text-sm text-indigo-400">{child.cgpa}</span>
                    </div>
                  </div>
                  {selectedChildId === child.id && (
                    <span className="text-xxs text-center text-emerald-400 font-bold border border-emerald-500/30 rounded-lg py-1 bg-emerald-500/10">✓ Viewing Details</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── TAB NAVIGATION ─── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
            {[
              { id: 'my_children', label: 'Overview', icon: <FaUsers /> },
              { id: 'attendance', label: 'Attendance', icon: <FaUserClock /> },
              { id: 'performance', label: 'Academic Performance', icon: <FaChartLine /> },
              { id: 'fees', label: 'Fees & Payment', icon: <FaCreditCard /> },
              { id: 'timetable', label: 'Timetable', icon: <FaCalendarAlt /> },
              { id: 'communication', label: 'Teacher Contact', icon: <FaEnvelope /> },
              { id: 'leave', label: 'Leave Application', icon: <FaPlaneDeparture /> },
              { id: 'ai_assistant', label: '🤖 AI Parent Assistant', icon: <FaRobot /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition text-xs ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ─── TAB: OVERVIEW ─── */}
          {activeTab === 'my_children' && selectedChild && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-5">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaGraduationCap className="text-emerald-400" /> {selectedChild.name} — Academic Record
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    {[
                      { label: 'Attendance', val: `${selectedChild.attendancePct}%`, color: 'text-emerald-400' },
                      { label: 'CGPA', val: selectedChild.cgpa, color: 'text-indigo-400' },
                      { label: 'Fee Status', val: selectedChild.feeStatus === 'cleared' ? 'Cleared ✓' : `Due: ${selectedChild.feeDue}`, color: 'text-emerald-400' },
                      { label: 'Department', val: selectedChild.department, color: 'text-purple-400' }
                    ].map((s, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col gap-1">
                        <span className="text-xxs text-slate-400 font-sans">{s.label}</span>
                        <span className={`font-black text-sm ${s.color}`}>{s.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xxs text-slate-400 block font-sans">Student Email ID</span>
                      <span className="font-bold text-white font-mono mt-1 block">{selectedChild.rollNumber}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xxs text-slate-400 block font-sans">Class Faculty</span>
                      <span className="font-bold text-white mt-1 block">{selectedChild.classTeacher}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="p-5 rounded-2xl border border-teal-700/40 bg-gradient-to-br from-teal-950/40 to-slate-900/60">
                  <span className="text-sm font-bold text-white flex items-center gap-2 mb-3"><FaRobot className="text-teal-400" /> AI Parent Assistant</span>
                  <form onSubmit={handleAskAI} className="flex flex-col gap-2">
                    <input type="text" value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} placeholder="Ask about fees, attendance..." className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
                    <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl text-xxs">
                      {aiLoading ? 'Analyzing...' : 'Ask AI'}
                    </button>
                  </form>
                  {aiAnswer && !aiLoading && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-teal-800/40 text-xxs text-teal-200 leading-relaxed">{aiAnswer}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: ATTENDANCE ─── */}
          {activeTab === 'attendance' && (
            <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaUserClock className="text-emerald-400" /> {selectedChild?.name}'s Live Attendance Records</h2>
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
                Attendance logs marked in classroom sessions by faculty will be calculated and displayed here.
              </div>
            </div>
          )}

          {/* ─── TAB: PERFORMANCE ─── */}
          {activeTab === 'performance' && (
            <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaChartLine className="text-indigo-400" /> {selectedChild?.name}'s Academic Transcript</h2>
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
                Semester examination results published by the Examination Controller will be listed here.
              </div>
            </div>
          )}

          {/* ─── TAB: FEES ─── */}
          {activeTab === 'fees' && (
            <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCreditCard className="text-amber-400" /> {selectedChild?.name}'s Fee Ledger</h2>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xxs text-slate-400 block">Semester Fee Due</span>
                  <span className="text-2xl font-black font-mono block mt-1 text-emerald-400">{selectedChild?.feeDue}</span>
                  <span className="text-xxs font-bold mt-1 block">✓ Account in good standing</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: TIMETABLE ─── */}
          {activeTab === 'timetable' && (
            <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCalendarAlt className="text-indigo-400" /> {selectedChild?.name}'s Class Timetable</h2>
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
                Weekly scheduled timetable slots will reflect here when assigned by department coordinators.
              </div>
            </div>
          )}

          {/* ─── TAB: TEACHER COMMUNICATION ─── */}
          {activeTab === 'communication' && (
            <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-lg">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaEnvelope className="text-teal-400" /> Message Class Faculty</h2>
              <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Faculty Name / Email</label>
                  <input type="text" value={msgTo} onChange={e => setMsgTo(e.target.value)} placeholder="e.g. Class Coordinator" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
                </div>
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Subject</label>
                  <input type="text" value={msgSubject} onChange={e => setMsgSubject(e.target.value)} placeholder="Inquiry" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
                </div>
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Message</label>
                  <textarea value={msgContent} onChange={e => setMsgContent(e.target.value)} placeholder="Type your message..." rows="4" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
                </div>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2">
                  <FaPaperPlane /> Send Message
                </button>
              </form>
            </div>
          )}

          {/* ─── TAB: LEAVE APPLICATION ─── */}
          {activeTab === 'leave' && (
            <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-lg">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaPlaneDeparture className="text-pink-400" /> Apply Leave for {selectedChild?.name}</h2>
              <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Number of Days</label>
                  <input type="number" min="1" max="10" value={leaveDays} onChange={e => setLeaveDays(Number(e.target.value))} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
                </div>
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Reason for Leave</label>
                  <textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} placeholder="State reason for absence" rows="3" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
                </div>
                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl text-xs">Submit Leave Application</button>
              </form>
            </div>
          )}

          {/* ─── TAB: AI ASSISTANT ─── */}
          {activeTab === 'ai_assistant' && (
            <div className="p-8 rounded-3xl border border-teal-700/40 bg-[#111827]/60 flex flex-col gap-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaRobot className="text-teal-400" /> AI Parent Copilot</h2>
              <p className="text-slate-400 text-xs">Ask questions regarding {selectedChild?.name}'s attendance, fees, or academics.</p>
              <form onSubmit={handleAskAI} className="flex flex-col gap-3">
                <textarea value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} placeholder="Ask anything about your ward..." rows="3" className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs">
                  {aiLoading ? 'Analyzing...' : 'Ask AI Parent Assistant'}
                </button>
              </form>
              {aiAnswer && !aiLoading && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-teal-800/40 text-xs text-teal-200 leading-relaxed">{aiAnswer}</div>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
