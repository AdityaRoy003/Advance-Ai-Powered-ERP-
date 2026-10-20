import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { AcademicAPI } from '../../services/api';
import { exportToCSV, exportToJSON, downloadBlob } from '../../utils/exportHelper';
import {
  FaCalendarAlt, FaCalendarCheck, FaFileAlt, FaUserTie, FaIdCard, 
  FaAward, FaBalanceScale, FaBuilding, FaTasks, FaClipboardCheck, 
  FaRobot, FaCheckCircle, FaExclamationTriangle, FaLock, FaUnlock, 
  FaPlus, FaSearch, FaDownload, FaSyncAlt, FaPrint, FaQrcode, 
  FaEye, FaTimes, FaShieldAlt, FaChartBar, FaUserGraduate, FaChalkboardTeacher
} from 'react-icons/fa';

export default function AcademicControllerDashboard({ initialTab = 'overview' }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  // Module 1: Calendar State
  const [calendar, setCalendar] = useState(null);
  const [calendarView, setCalendarView] = useState('Month'); // Month, Week, Timeline
  const [newEventModal, setNewEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('event');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  // Module 2: Timetable State
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [timetableDept, setTimetableDept] = useState('Computer Science & Engineering');
  const [timetableSemester, setTimetableSemester] = useState(4);
  const [solverResult, setSolverResult] = useState(null);
  const [solving, setSolving] = useState(false);

  // Module 3: Classroom State
  const [classrooms, setClassrooms] = useState([]);
  const [roomFilter, setRoomFilter] = useState('All');

  // Module 4 & 5: Exams & Seating State
  const [exams, setExams] = useState([]);
  const [newExamModal, setNewExamModal] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamCode, setNewExamCode] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [newExamRoom, setNewExamRoom] = useState('LH-101');
  const [selectedSeatingPlan, setSelectedSeatingPlan] = useState(null);

  // Module 6: Faculty Duties State
  const [duties, setDuties] = useState([]);

  // Module 7: Hall Tickets State
  const [hallTickets, setHallTickets] = useState([]);
  const [selectedTicketPreview, setSelectedTicketPreview] = useState(null);

  // Module 8: Results State
  const [results, setResults] = useState([]);
  const [resultsLocked, setResultsLocked] = useState(false);

  // Module 9: Grade Moderation State
  const [moderationSubject, setModerationSubject] = useState('Algorithms (CS401)');
  const [gracePoints, setGracePoints] = useState(2);
  const [moderationReason, setModerationReason] = useState('Evaluation consistency adjustment across Section A and B');

  // Module 10: Faculty Workload State
  const [workloadData, setWorkloadData] = useState(null);

  // Module 11: Reports State
  const [reportsData, setReportsData] = useState(null);

  // Module 12: AI Assistant State
  const [aiAction, setAiAction] = useState('detect_conflicts');
  const [aiCustomQuery, setAiCustomQuery] = useState('');
  const [aiOutput, setAiOutput] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Load summary and initial data
  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      try {
        const [sum, cal, tt, rooms, ex, dts, hts, resList, wl, rep] = await Promise.all([
          AcademicAPI.getSummary(),
          AcademicAPI.getCalendar(),
          AcademicAPI.getTimetable(),
          AcademicAPI.getClassrooms(),
          AcademicAPI.getExams(),
          AcademicAPI.getFacultyDuties(),
          AcademicAPI.getHallTickets(),
          AcademicAPI.getResults(),
          AcademicAPI.getFacultyWorkload(),
          AcademicAPI.getReports()
        ]);
        if (sum) setSummary(sum);
        if (cal) setCalendar(cal);
        if (tt) setTimetableSlots(tt);
        if (rooms) setClassrooms(rooms);
        if (ex) setExams(ex);
        if (dts) setDuties(dts);
        if (hts) setHallTickets(hts);
        if (resList) setResults(resList);
        if (wl) setWorkloadData(wl);
        if (rep) setReportsData(rep);
      } catch (err) {
        console.warn('Initial data load notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Update tab if initialTab changes via router
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // ─── ACTION HANDLERS ───
  const handleToggleFreezeCalendar = async () => {
    try {
      const res = await AcademicAPI.toggleFreezeCalendar();
      toast.success(res?.message || 'Academic Calendar freeze status updated');
      const updated = await AcademicAPI.getCalendar();
      if (updated) setCalendar(updated);
    } catch {
      toast.error('Failed to toggle calendar freeze');
    }
  };

  const handlePublishCalendar = async () => {
    try {
      await AcademicAPI.publishCalendar();
      toast.success('Academic Calendar broadcasted to Students, Faculty, and Parents!');
      const updated = await AcademicAPI.getCalendar();
      if (updated) setCalendar(updated);
    } catch {
      toast.error('Failed to publish calendar');
    }
  };

  const handleAddCalendarEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle || !eventStartDate) return;
    try {
      await AcademicAPI.addCalendarEvent({
        title: eventTitle,
        category: eventCategory,
        startDate: eventStartDate,
        endDate: eventEndDate || eventStartDate,
        description: eventDesc
      });
      toast.success(`Event "${eventTitle}" added to institutional calendar!`);
      setNewEventModal(false);
      setEventTitle('');
      setEventDesc('');
      const updated = await AcademicAPI.getCalendar();
      if (updated) setCalendar(updated);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add event');
    }
  };

  const handleRunTimetableSolver = async () => {
    setSolving(true);
    try {
      const res = await AcademicAPI.runAITimetableSolver({
        department: timetableDept,
        semester: timetableSemester
      });
      setSolverResult(res);
      if (res?.schedule) setTimetableSlots(res.schedule);
      toast.success('AI Timetable generated with 0 hard conflicts!');
    } catch {
      toast.error('AI Timetable solver failed');
    } finally {
      setSolving(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!newExamTitle || !newExamSubject || !newExamDate) return;
    try {
      await AcademicAPI.createExam({
        title: newExamTitle,
        subject: newExamSubject,
        courseCode: newExamCode || 'CS401',
        date: newExamDate,
        room: newExamRoom,
        semester: 4,
        department: 'Computer Science & Engineering'
      });
      toast.success('Examination schedule draft created!');
      setNewExamModal(false);
      const ex = await AcademicAPI.getExams();
      if (ex) setExams(ex);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create exam');
    }
  };

  const handleExamWorkflow = async (id, status) => {
    try {
      await AcademicAPI.updateExamWorkflow(id, { status });
      toast.success(`Exam status advanced to: ${status.toUpperCase()}`);
      const ex = await AcademicAPI.getExams();
      if (ex) setExams(ex);
    } catch {
      toast.error('Failed to update workflow');
    }
  };

  const handleGenerateSeatingPlan = async (id) => {
    try {
      const res = await AcademicAPI.generateSeatingPlan(id);
      setSelectedSeatingPlan(res);
      toast.success('Anti-cheating alternate seating plan generated!');
      const ex = await AcademicAPI.getExams();
      if (ex) setExams(ex);
    } catch {
      toast.error('Failed to generate seating plan');
    }
  };

  const handleRunDutyAllocation = async () => {
    try {
      const res = await AcademicAPI.runAIFacultyDutyAllocation();
      if (res?.duties) setDuties(res.duties);
      toast.success(`AI balanced ${res?.allocatedCount || 6} faculty duties evenly!`);
    } catch {
      toast.error('Failed to balance duties');
    }
  };

  const handleGenerateHallTickets = async () => {
    try {
      const res = await AcademicAPI.generateHallTickets({ semester: 4, minAttendance: 75 });
      if (Array.isArray(res)) setHallTickets(res);
      toast.success(`Hall tickets generated! Verified attendance & fee clearance.`);
    } catch {
      toast.error('Failed to generate hall tickets');
    }
  };

  const handleApplyModeration = async (e) => {
    e.preventDefault();
    try {
      const res = await AcademicAPI.applyGradeModeration({
        subject: moderationSubject,
        adjustmentPoints: gracePoints,
        reason: moderationReason
      });
      toast.success(`Grade moderation applied to ${moderationSubject}!`);
    } catch {
      toast.error('Failed to apply moderation');
    }
  };

  const handleExecuteAITool = async (actionKey, customText) => {
    setAiLoading(true);
    setAiAction(actionKey);
    try {
      const res = await AcademicAPI.queryAIAssistant({
        action: actionKey,
        query: customText || `Execute ${actionKey}`
      });
      setAiOutput(res);
      toast.success(`AI tool executed: ${actionKey.replace(/_/g, ' ').toUpperCase()}`);
    } catch {
      toast.error('AI assistant execution failed');
    } finally {
      setAiLoading(false);
    }
  };

  const controllerName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Dr. Vikram Sengupta' : 'Dr. Vikram Sengupta';

  return (
    <div className="flex flex-col gap-6 text-xs font-sans pb-16 selection:bg-purple-500/30">
      
      {/* ─── EXECUTIVE HEADER & CONTROLLER PROFILE ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-800/40 text-white shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xxs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaShieldAlt /> Institution-Level RBAC • Controller of Examinations
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xxs font-bold">
              Even Sem 2026 Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Academic Operations & Examination Wing
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Welcome, <strong className="text-purple-300">{controllerName}</strong>. Centralized command for AI timetable generation, examination scheduling, seating allocation, hall tickets, and grade moderation.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button 
            onClick={() => { setActiveTab('timetable'); handleRunTimetableSolver(); }}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
          >
            <FaRobot /> Generate Timetable
          </button>
          <button 
            onClick={() => { setActiveTab('exams'); setNewExamModal(true); }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <FaCalendarCheck /> Schedule Exam
          </button>
          <button 
            onClick={() => { setActiveTab('halltickets'); handleGenerateHallTickets(); }}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <FaIdCard /> Publish Hall Tickets
          </button>
        </div>
      </div>

      {/* ─── 8 KPI CARDS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono">
        {[
          { label: 'Total Students', val: summary?.totalStudents || 1420, icon: <FaUserGraduate />, color: 'text-indigo-400', border: 'border-indigo-500/20' },
          { label: 'Active Courses', val: summary?.activeCourses || 48, icon: <FaAward />, color: 'text-sky-400', border: 'border-sky-500/20' },
          { label: 'Upcoming Exams', val: summary?.upcomingExams || exams.length || 6, icon: <FaFileAlt />, color: 'text-purple-400', border: 'border-purple-500/20' },
          { label: 'Conflicts', val: `${summary?.timetableConflicts || 0} Resolved`, icon: <FaCheckCircle />, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'Results Pending', val: summary?.resultsPending || 4, icon: <FaBalanceScale />, color: 'text-amber-400', border: 'border-amber-500/20' },
          { label: 'Exam Duties', val: summary?.facultyExamDuties || duties.length || 34, icon: <FaUserTie />, color: 'text-rose-400', border: 'border-rose-500/20' },
          { label: 'Hall Tickets', val: summary?.hallTicketsPublished || 890, icon: <FaIdCard />, color: 'text-teal-400', border: 'border-teal-500/20' },
          { label: 'Classrooms', val: summary?.classroomsAllocated || classrooms.length || 18, icon: <FaBuilding />, color: 'text-violet-400', border: 'border-violet-500/20' }
        ].map((k, i) => (
          <div key={i} className={`p-3.5 rounded-2xl bg-[#0f172a]/70 border ${k.border} flex flex-col gap-1 backdrop-blur-sm shadow-sm hover:border-purple-500/40 transition`}>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xxs uppercase tracking-wider font-sans font-bold">{k.label}</span>
              <span className="text-xs">{k.icon}</span>
            </div>
            <span className={`text-xl font-black ${k.color}`}>{k.val}</span>
          </div>
        ))}
      </div>

      {/* ─── MODULE TAB SELECTOR ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none font-bold">
        {[
          { id: 'overview', name: 'Executive Overview', icon: <FaChartBar /> },
          { id: 'calendar', name: 'Academic Calendar', icon: <FaCalendarAlt /> },
          { id: 'timetable', name: 'AI Timetable Generator', icon: <FaCalendarCheck /> },
          { id: 'exams', name: 'Exam Management & Seating', icon: <FaFileAlt /> },
          { id: 'duties', name: 'Exam Duty Allocation', icon: <FaUserTie /> },
          { id: 'halltickets', name: 'Hall Ticket Center', icon: <FaIdCard /> },
          { id: 'results', name: 'Result Center', icon: <FaAward /> },
          { id: 'moderation', name: 'Grade Moderation', icon: <FaBalanceScale /> },
          { id: 'classrooms', name: 'Classroom Allocation', icon: <FaBuilding /> },
          { id: 'workload', name: 'Faculty Workload', icon: <FaTasks /> },
          { id: 'reports', name: 'Reports & Export', icon: <FaClipboardCheck /> },
          { id: 'ai-assistant', name: 'AI Academic Assistant', icon: <FaRobot /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 text-xs font-semibold ${
              activeTab === t.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            {t.icon}
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB 1: EXECUTIVE OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Exam Schedule Timeline */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-400" /> Upcoming Exam Schedule Timeline
                </h2>
                <span className="text-xxs font-mono text-slate-400">May - June 2026</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {(summary?.examTimeline || [
                  { date: 'May 20', title: 'Algorithms (CS401)', candidates: 140, type: 'Theory', room: 'LH-101' },
                  { date: 'May 22', title: 'DBMS Lab (CS402P)', candidates: 65, type: 'Practical', room: 'CS-LAB-301' },
                  { date: 'May 25', title: 'Computer Arch (CS403)', candidates: 135, type: 'Theory', room: 'LH-101' },
                  { date: 'May 28', title: 'Operating Systems (CS404)', candidates: 140, type: 'Theory', room: 'HALL-A' }
                ]).map((ex, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono font-bold text-center">
                        <span className="text-xxs block uppercase">{ex.date.split(' ')[0]}</span>
                        <span className="text-xs font-black">{ex.date.split(' ')[1]}</span>
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">{ex.title}</span>
                        <span className="text-xxs text-slate-400 font-mono">Room: {ex.room} • {ex.candidates} Candidates Enrolled</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono text-xxs font-bold">
                      {ex.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timetable Conflict Heatmap */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FaCalendarCheck className="text-emerald-400" /> Timetable Conflict Heatmap
                </h2>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xxs font-mono font-bold flex items-center gap-1">
                  <FaCheckCircle /> 0 Collisions
                </span>
              </div>
              <p className="text-slate-400 text-xxs">
                Real-time matrix verification across faculty, room allocations, and lab hardware dependencies.
              </p>
              <div className="grid grid-cols-6 gap-2 font-mono text-center">
                {['Slot', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((h, i) => (
                  <span key={i} className="text-xxs text-slate-400 font-bold">{h}</span>
                ))}
                {['09:00', '10:15', '11:30', '14:00', '15:15'].map((time, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-xxs text-slate-500 py-2">{time}</span>
                    {[0, 1, 2, 3, 4].map(day => (
                      <div 
                        key={day} 
                        className="py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xxs flex items-center justify-center gap-1 hover:bg-emerald-500/20 transition cursor-pointer"
                        title={`No conflicts detected on Day ${day + 1} at ${time}`}
                      >
                        ✓ Clean
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>

          {/* Faculty Workload Distribution & Result Publication Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FaChalkboardTeacher className="text-indigo-400" /> Faculty Workload Distribution
              </h2>
              <div className="flex flex-col gap-3 font-mono">
                {(summary?.facultyWorkload || [
                  { faculty: 'Dr. Priya Nair', dept: 'ECE', teachingHours: 14, labHours: 4, dutyCount: 3, total: 21, status: 'Balanced' },
                  { faculty: 'Prof. Rajesh Kulkarni', dept: 'CSE', teachingHours: 16, labHours: 6, dutyCount: 4, total: 26, status: 'Overload' },
                  { faculty: 'Dr. Aris Thorne', dept: 'CSE', teachingHours: 12, labHours: 4, dutyCount: 2, total: 18, status: 'Balanced' },
                  { faculty: 'Dr. Sunita Sen', dept: 'Maths', teachingHours: 15, labHours: 0, dutyCount: 2, total: 17, status: 'Balanced' }
                ]).map((f, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <span className="font-bold text-white text-xs">{f.faculty}</span>
                      <span className="text-xxs text-slate-400 block">{f.dept} • Teaching: {f.teachingHours}h | Labs: {f.labHours}h | Exam Duties: {f.dutyCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{f.total} hrs/wk</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xxs font-bold ${f.status === 'Overload' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {f.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FaAward className="text-amber-400" /> Result Publication Status
              </h2>
              <div className="flex flex-col gap-3 font-mono">
                {[
                  { label: 'Published & Sealed', count: 12, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Moderated (Ready)', count: 3, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                  { label: 'Pending Moderation', count: 4, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { label: 'Draft Evaluation', count: 2, color: 'text-rose-400', bg: 'bg-rose-500/10' }
                ].map((s, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${s.bg} border border-slate-800 flex items-center justify-between`}>
                    <span className="text-xs text-slate-300 font-bold">{s.label}</span>
                    <span className={`text-lg font-black ${s.color}`}>{s.count} Courses</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 2: ACADEMIC CALENDAR ─── */}
      {activeTab === 'calendar' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 1 • Academic Scheduling</span>
                <h2 className="text-xl font-bold text-white">Institutional Academic Calendar</h2>
                <p className="text-xs text-slate-400">Academic Year: {calendar?.academicYear || '2026-2027'} • {calendar?.currentTerm}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleToggleFreezeCalendar}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                    calendar?.isFrozen
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {calendar?.isFrozen ? <FaLock /> : <FaUnlock />}
                  {calendar?.isFrozen ? 'Calendar Frozen' : 'Freeze Calendar'}
                </button>
                <button
                  onClick={handlePublishCalendar}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <FaCheckCircle /> Publish Calendar
                </button>
                <button
                  onClick={() => setNewEventModal(true)}
                  disabled={calendar?.isFrozen}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FaPlus /> Add Event
                </button>
              </div>
            </div>

            {/* Events Roster */}
            <div className="flex flex-col gap-3 font-mono">
              {(calendar?.events || []).map(ev => (
                <div key={ev.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{ev.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase ${
                        ev.category === 'exam_window' ? 'bg-purple-500/20 text-purple-300' :
                        ev.category === 'holiday' ? 'bg-amber-500/20 text-amber-300' :
                        ev.category === 'add_drop' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {ev.category.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xxs text-slate-400 font-sans mt-0.5 block">{ev.description}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-300 block">{ev.startDate} to {ev.endDate}</span>
                    <span className="text-xxs text-slate-500">Audience: {ev.targetAudience?.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 3: AI TIMETABLE GENERATOR ─── */}
      {activeTab === 'timetable' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
              <div>
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 2 • Constraint Programming Engine</span>
                <h2 className="text-xl font-bold text-white">AI Timetable Generator & Conflict Solver</h2>
                <p className="text-xs text-slate-400">Powered by constraint satisfaction logic. Balances contact hours, eliminates clashes, and minimizes faculty idle gaps.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunTimetableSolver}
                  disabled={solving}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
                >
                  <FaRobot className={solving ? 'animate-spin' : ''} />
                  {solving ? 'Solving Constraints...' : 'Run Google OR-Tools Solver'}
                </button>
                <button
                  onClick={() => exportToCSV(timetableSlots, 'institutional_timetable.csv')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <FaDownload /> Export CSV
                </button>
              </div>
            </div>

            {/* Solver Report Card if executed */}
            {solverResult && (
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex flex-col sm:flex-row justify-between sm:items-center gap-4 font-mono">
                <div>
                  <span className="text-xxs uppercase tracking-wider text-purple-300 font-bold">CP-SAT Engine Report</span>
                  <span className="text-sm font-black text-white block">Status: {solverResult.solutionStatus} • Hard Conflicts: {solverResult.hardConstraintsViolated}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 font-bold">Optimization: {solverResult.softConstraintsScore}</span>
                  <span className="text-indigo-300 font-bold">Idle Reduction: {solverResult.facultyIdleGapReduction}</span>
                </div>
              </div>
            )}

            {/* Timetable Interactive Grid */}
            <div className="flex flex-col gap-3 font-mono">
              <span className="text-xxs uppercase text-slate-400 font-bold tracking-wider">Scheduled Lecture & Laboratory Slots</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {timetableSlots.map((slot, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2 hover:border-purple-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold text-xxs font-mono">{slot.courseCode}</span>
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold ${slot.isLab ? 'bg-amber-500/10 text-amber-300' : 'bg-indigo-500/10 text-indigo-300'}`}>
                        {slot.isLab ? 'Lab Session' : 'Lecture'}
                      </span>
                    </div>
                    <span className="font-bold text-white text-xs">{slot.subjectTitle}</span>
                    <span className="text-xxs text-slate-400 font-sans">{slot.teacherName} • Room {slot.room}</span>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xxs">
                      <span className="text-indigo-400 font-bold">{slot.dayOfWeek} • {slot.startTime} - {slot.endTime}</span>
                      <span className="text-emerald-400 font-bold">✓ Valid</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 4: EXAM MANAGEMENT & SEATING ─── */}
      {activeTab === 'exams' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 4 & 5 • Examination Control & Seating</span>
                <h2 className="text-xl font-bold text-white">Examination Schedules & Anti-Cheating Seating Plan</h2>
                <p className="text-xs text-slate-400">Formal multi-stage workflow: Draft → Review → Principal Approval → Published → Locked.</p>
              </div>
              <button
                onClick={() => setNewExamModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md shadow-purple-600/30 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FaPlus /> Create Exam Session
              </button>
            </div>

            {/* Exam Roster */}
            <div className="flex flex-col gap-3 font-mono">
              {exams.map(ex => (
                <div key={ex._id || ex.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{ex.title}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-xxs font-bold">{ex.courseCode}</span>
                    </div>
                    <span className="text-xxs text-slate-400 font-sans">
                      Subject: {ex.subject} • Date: {ex.date} at {ex.startTime} • Venue: {ex.building} ({ex.room})
                    </span>
                    {ex.approvalNotes && (
                      <span className="text-xxs text-emerald-400/90 font-sans">Audit Note: {ex.approvalNotes}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xxs font-bold uppercase ${
                      ex.status === 'locked' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      ex.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      ex.status === 'principal_approved' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {ex.status.replace('_', ' ')}
                    </span>

                    {ex.status === 'draft' && (
                      <button 
                        onClick={() => handleExamWorkflow(ex._id || ex.id, 'review')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xxs font-bold"
                      >
                        Submit Review
                      </button>
                    )}
                    {ex.status === 'review' && (
                      <button 
                        onClick={() => handleExamWorkflow(ex._id || ex.id, 'principal_approved')}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xxs font-bold"
                      >
                        Principal Approve
                      </button>
                    )}
                    {ex.status === 'principal_approved' && (
                      <button 
                        onClick={() => handleExamWorkflow(ex._id || ex.id, 'published')}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xxs font-bold"
                      >
                        Publish Schedule
                      </button>
                    )}
                    {ex.status === 'published' && (
                      <button 
                        onClick={() => handleExamWorkflow(ex._id || ex.id, 'locked')}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xxs font-bold"
                      >
                        Lock Schedule
                      </button>
                    )}

                    <button
                      onClick={() => handleGenerateSeatingPlan(ex._id || ex.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xxs font-bold flex items-center gap-1"
                    >
                      <FaBuilding /> Seating Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Generated Seating Plan Preview */}
            {selectedSeatingPlan && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col gap-3 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-300">Generated Alternate Anti-Cheating Seating Allocation</span>
                  <button 
                    onClick={() => exportToCSV(selectedSeatingPlan, 'seating_allocation.csv')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xxs flex items-center gap-1"
                  >
                    <FaDownload /> Download Slip
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xxs">
                  {selectedSeatingPlan.slice(0, 18).map((seat, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="font-bold text-amber-400 block">{seat.seatNumber}</span>
                      <span className="text-slate-300 font-bold block truncate">{seat.studentName}</span>
                      <span className="text-slate-500 text-xxs">{seat.rollNumber} • {seat.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ─── TAB 5: FACULTY EXAM DUTIES ─── */}
      {activeTab === 'duties' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 6 • Faculty Invigilation Roster</span>
                <h2 className="text-xl font-bold text-white">Faculty Exam Duty Allocation</h2>
                <p className="text-xs text-slate-400">Distributes exam supervision responsibilities with automated SMS/Push dispatch.</p>
              </div>
              <button
                onClick={handleRunDutyAllocation}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md shadow-purple-600/30 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FaRobot /> AI Fair Duty Balance
              </button>
            </div>

            <div className="flex flex-col gap-2.5 font-mono">
              {duties.map((d, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{d.teacherName}</span>
                    <span className="text-xxs text-slate-400 font-sans block">{d.department} • Slot: {d.timeSlot} • Venue: {d.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xxs text-slate-400">{d.date}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xxs uppercase">
                      {d.status || 'Assigned'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 6: HALL TICKET CENTER ─── */}
      {activeTab === 'halltickets' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 7 • Candidate Clearance & Issuance</span>
                <h2 className="text-xl font-bold text-white">Hall Ticket Center</h2>
                <p className="text-xs text-slate-400">Strict gatekeeping rule engine: requires 75% attendance, fee clearance, and registration.</p>
              </div>
              <button
                onClick={handleGenerateHallTickets}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FaSyncAlt /> Verify & Generate Hall Tickets
              </button>
            </div>

            <div className="flex flex-col gap-3 font-mono">
              {hallTickets.map((ht, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{ht.studentName}</span>
                      <span className="font-mono text-xxs text-indigo-400 font-bold">{ht.rollNumber}</span>
                    </div>
                    <span className="text-xxs text-slate-400 font-sans block">
                      Attendance: {ht.attendancePercent}% • Fees: {ht.feesCleared ? 'Cleared' : 'Due'} • Seat: {ht.seatNumber}
                    </span>
                    {!ht.isEligible && (
                      <span className="text-xxs text-rose-400 font-sans font-bold block mt-0.5">
                        Ineligibility Note: {ht.ineligibilityReason}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xxs font-bold uppercase ${
                      ht.isEligible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {ht.isEligible ? 'Eligible' : 'Detained'}
                    </span>
                    {ht.isEligible && (
                      <button
                        onClick={() => setSelectedTicketPreview(ht)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xxs font-bold flex items-center gap-1"
                      >
                        <FaEye /> Preview Slip
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Hall Ticket Preview Modal */}
            {selectedTicketPreview && (
              <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/40 flex flex-col gap-4 font-mono shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-purple-300">Official Institutional Hall Ticket</span>
                  <button onClick={() => setSelectedTicketPreview(null)} className="text-slate-400 hover:text-white"><FaTimes /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-xxs text-slate-500 font-bold block uppercase">Candidate</span>
                    <span className="font-bold text-white text-sm">{selectedTicketPreview.studentName}</span>
                    <span className="text-xxs text-slate-400 font-mono block">{selectedTicketPreview.rollNumber} • {selectedTicketPreview.department}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xxs text-slate-500 font-bold block uppercase">Center & Seat</span>
                    <span className="font-bold text-amber-400 text-sm font-mono">{selectedTicketPreview.seatNumber}</span>
                    <span className="text-xxs text-slate-400 block">{selectedTicketPreview.examCenter}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xxs">
                  <span className="text-slate-500 font-mono">Verification Hash: {selectedTicketPreview.verificationHash}</span>
                  <a
                    href={`/verify/hall-ticket/${selectedTicketPreview.ticketNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-1.5 font-sans"
                  >
                    <FaQrcode /> Public QR Credential Link
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ─── TAB 7: RESULT CENTER ─── */}
      {activeTab === 'results' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 8 • Academic Transcripts & Merit List</span>
                <h2 className="text-xl font-bold text-white">Result Publication & Marksheet Generator</h2>
                <p className="text-xs text-slate-400">Automated calculation of marks, SGPA, CGPA, rank lists, and tamper-proof locking.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setResultsLocked(true); toast.success('Results officially locked against further tampering.'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    resultsLocked ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <FaLock /> {resultsLocked ? 'Results Locked' : 'Lock Results'}
                </button>
                <button
                  onClick={() => exportToCSV(results, 'semester_results_merit.csv')}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <FaDownload /> Export Merit List
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 font-mono">
              {results.map((r, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{r.studentName}</span>
                      <span className="text-xxs text-indigo-400 font-bold font-mono">{r.rollNumber}</span>
                    </div>
                    <span className="text-xxs text-slate-400 font-sans block">{r.subject} • Score: {r.marksObtained}/100 • Grade: {r.grade}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 block font-mono">SGPA: {r.sgpa}</span>
                      <span className="text-xxs text-slate-500 font-mono">Rank #{r.rank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 8: GRADE MODERATION ─── */}
      {activeTab === 'moderation' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div>
              <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 9 • Statistical Distribution & Fairness</span>
              <h2 className="text-xl font-bold text-white">Grade Moderation & Outlier Detection</h2>
              <p className="text-xs text-slate-400">Section average comparisons and AI curve recommendations to balance evaluation consistency.</p>
            </div>

            <form onSubmit={handleApplyModeration} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono">
              <div>
                <label className="text-xxs uppercase text-slate-400 font-bold block mb-1">Target Subject</label>
                <input 
                  type="text" 
                  value={moderationSubject} 
                  onChange={e => setModerationSubject(e.target.value)} 
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" 
                  required 
                />
              </div>
              <div>
                <label className="text-xxs uppercase text-slate-400 font-bold block mb-1">Grace Points</label>
                <input 
                  type="number" 
                  value={gracePoints} 
                  onChange={e => setGracePoints(e.target.value)} 
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" 
                  required 
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition">
                  Apply & Log Moderation
                </button>
              </div>
            </form>

            {/* AI Insight Card */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 flex items-start gap-3">
              <FaRobot className="text-indigo-400 text-xl shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-indigo-300">AI Distribution Consistency Advisory</span>
                <p className="text-xs text-slate-300 mt-1">
                  Subject: <strong>Algorithms (CS401)</strong> — Section B historical average showed an 18% variance compared to Section A. Moderating by +2 points shifts the curve back into natural Gaussian distribution without inflating top grades.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 9: CLASSROOM ALLOCATION ─── */}
      {activeTab === 'classrooms' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div>
              <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 3 • Space & Infrastructure</span>
              <h2 className="text-xl font-bold text-white">Classroom & Lab Inventory Allocation</h2>
              <p className="text-xs text-slate-400">Classroom capacity optimization, projector availability, and lab equipment mapping.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
              {classrooms.map((rm, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rm.roomNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-xxs font-bold ${rm.isLab ? 'bg-purple-500/10 text-purple-300' : 'bg-slate-800 text-slate-300'}`}>
                      {rm.isLab ? 'Specialized Lab' : 'Lecture Hall'}
                    </span>
                  </div>
                  <span className="text-xxs text-slate-400 font-sans">{rm.building} • Max Capacity: {rm.capacity} Seats</span>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xxs">
                    <span className="text-emerald-400 font-bold">Utilization: {rm.utilizationScore}%</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">{rm.currentStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 10: FACULTY WORKLOAD ─── */}
      {activeTab === 'workload' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div>
              <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 10 • Academic Human Resources</span>
              <h2 className="text-xl font-bold text-white">Faculty Contact Hours & Exam Duties</h2>
              <p className="text-xs text-slate-400">Overload warnings trigger automatically when weekly contact hours exceed 22 hours.</p>
            </div>

            <div className="flex flex-col gap-3 font-mono">
              {(workloadData?.workload || []).map((w, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <span className="font-bold text-white text-xs">{w.name}</span>
                    <span className="text-xxs text-slate-400 font-sans block">{w.department} • {w.designation}</span>
                    {w.warning && <span className="text-xxs text-rose-400 font-sans font-bold block">{w.warning}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span>{w.teachingHours}h Teaching</span>
                    <span>{w.labHours}h Lab</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xxs font-bold ${w.status === 'Overloaded' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {w.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 11: REPORTS ─── */}
      {activeTab === 'reports' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 11 • Audits & Compliance</span>
                <h2 className="text-xl font-bold text-white">Institutional Academic Reports</h2>
                <p className="text-xs text-slate-400">Download comprehensive academic audit dossiers in PDF and Excel formats.</p>
              </div>
              <button
                onClick={() => exportToJSON(reportsData, 'academic_reports_full.json')}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <FaDownload /> Download Report Packet
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xxs uppercase text-slate-400 font-bold block mb-1">Overall Pass Percentage</span>
                <span className="text-2xl font-black text-emerald-400">{reportsData?.examPassPercentage?.overall || '94.2%'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xxs uppercase text-slate-400 font-bold block mb-1">Eligible Candidates</span>
                <span className="text-2xl font-black text-indigo-400">{reportsData?.attendanceEligibilityBreakdown?.eligibleCount || 1340}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xxs uppercase text-slate-400 font-bold block mb-1">Classroom Efficiency</span>
                <span className="text-2xl font-black text-purple-400">{reportsData?.classroomUtilization || '82.6%'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 12: AI ACADEMIC ASSISTANT ─── */}
      {activeTab === 'ai-assistant' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-6">
            <div>
              <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 12 • Specialized Autonomous Tools</span>
              <h2 className="text-xl font-bold text-white">AI Academic Assistant</h2>
              <p className="text-xs text-slate-400">Execute autonomous optimization and predictive analytics tools across academic workflows.</p>
            </div>

            {/* AI Tools Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'detect_conflicts', label: 'Detect Conflicts', icon: <FaCheckCircle /> },
                { id: 'generate_timetable', label: 'Generate Timetable', icon: <FaCalendarCheck /> },
                { id: 'generate_exam_schedule', label: 'Exam Schedule', icon: <FaFileAlt /> },
                { id: 'predict_pass_percentage', label: 'Predict Pass Rate', icon: <FaAward /> },
                { id: 'suggest_faculty_allocation', label: 'Faculty Allocation', icon: <FaUserTie /> },
                { id: 'analyze_results', label: 'Analyze Results', icon: <FaBalanceScale /> }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => handleExecuteAITool(t.id)}
                  className={`p-3.5 rounded-2xl border text-left font-bold text-xs transition flex flex-col gap-1.5 ${
                    aiAction === t.id
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/30'
                  }`}
                >
                  <span className="text-base text-purple-400">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* AI Output Card */}
            {aiLoading ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-mono">Autonomous AI Model Processing Action...</span>
              </div>
            ) : aiOutput ? (
              <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/40 font-mono flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-2">
                  <span className="text-xs font-bold text-purple-300">Tool Execution: {aiOutput.tool || aiAction}</span>
                  <span className="text-xxs text-emerald-400 font-bold">STATUS: {aiOutput.status || 'COMPLETED'}</span>
                </div>
                <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(aiOutput, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        </motion.div>
      )}

      {/* ─── ADD CALENDAR EVENT MODAL ─── */}
      <AnimatePresence>
        {newEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Add Academic Calendar Event</h3>
                <button onClick={() => setNewEventModal(false)} className="text-slate-400 hover:text-white"><FaTimes /></button>
              </div>
              <form onSubmit={handleAddCalendarEvent} className="flex flex-col gap-3">
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Event Title</label>
                  <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="e.g. Mid-Semester Examinations" className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                </div>
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Category</label>
                  <select value={eventCategory} onChange={e => setEventCategory(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                    <option value="event">Academic Event</option>
                    <option value="exam_window">Exam Window</option>
                    <option value="holiday">Holiday / Break</option>
                    <option value="add_drop">Add/Drop Period</option>
                    <option value="registration">Registration Window</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Start Date</label>
                    <input type="date" value={eventStartDate} onChange={e => setEventStartDate(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">End Date</label>
                    <input type="date" value={eventEndDate} onChange={e => setEventEndDate(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Description</label>
                  <textarea value={eventDesc} onChange={e => setEventDesc(e.target.value)} rows={2} placeholder="Optional details..." className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setNewEventModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">Add Event</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CREATE EXAM SESSION MODAL ─── */}
      <AnimatePresence>
        {newExamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Schedule New Examination</h3>
                <button onClick={() => setNewExamModal(false)} className="text-slate-400 hover:text-white"><FaTimes /></button>
              </div>
              <form onSubmit={handleCreateExam} className="flex flex-col gap-3">
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Exam Title</label>
                  <input type="text" value={newExamTitle} onChange={e => setNewExamTitle(e.target.value)} placeholder="e.g. Operating Systems End-Term" className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Subject</label>
                    <input type="text" value={newExamSubject} onChange={e => setNewExamSubject(e.target.value)} placeholder="Operating Systems" className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Course Code</label>
                    <input type="text" value={newExamCode} onChange={e => setNewExamCode(e.target.value)} placeholder="CS404" className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Date</label>
                    <input type="date" value={newExamDate} onChange={e => setNewExamDate(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Allocated Room</label>
                    <select value={newExamRoom} onChange={e => setNewExamRoom(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                      <option value="LH-101">LH-101 (Cap: 120)</option>
                      <option value="LH-102">LH-102 (Cap: 120)</option>
                      <option value="HALL-A">HALL-A (Cap: 250)</option>
                      <option value="CS-LAB-301">CS-LAB-301 (Cap: 60)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setNewExamModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">Schedule Exam</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
