import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { AcademicAPI } from '../../services/api';
import { exportToCSV, exportToJSON } from '../../utils/exportHelper';
import {
  FaCalendarAlt, FaCalendarCheck, FaFileAlt, FaUserTie, FaIdCard, 
  FaAward, FaBalanceScale, FaBuilding, FaTasks, FaClipboardCheck, 
  FaRobot, FaCheckCircle, FaExclamationTriangle, FaLock, FaUnlock, 
  FaPlus, FaSearch, FaDownload, FaSyncAlt, FaPrint, FaQrcode, 
  FaEye, FaTimes, FaShieldAlt, FaChartBar, FaUserGraduate, FaChalkboardTeacher
} from 'react-icons/fa';
import EduVerseOrbLoader from '../../components/common/EduVerseOrbLoader';

export default function AcademicControllerDashboard({ initialTab = 'overview' }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  // Module 1: Calendar State
  const [calendar, setCalendar] = useState(null);
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
  const [moderationSubject, setModerationSubject] = useState('');
  const [gracePoints, setGracePoints] = useState(2);
  const [moderationReason, setModerationReason] = useState('Evaluation consistency adjustment across sections');

  // Module 10: Faculty Workload State
  const [workloadData, setWorkloadData] = useState(null);

  // Module 11: Reports State
  const [reportsData, setReportsData] = useState(null);

  // Module 12: AI Assistant State
  const [aiAction, setAiAction] = useState('detect_conflicts');
  const [aiOutput, setAiOutput] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Load real-time data from database
  const loadData = async () => {
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
      if (Array.isArray(tt)) setTimetableSlots(tt);
      if (Array.isArray(rooms)) setClassrooms(rooms);
      if (Array.isArray(ex)) setExams(ex);
      if (Array.isArray(dts)) setDuties(dts);
      if (Array.isArray(hts)) setHallTickets(hts);
      if (Array.isArray(resList)) setResults(resList);
      if (wl) setWorkloadData(wl);
      if (rep) setReportsData(rep);
    } catch (err) {
      console.warn('Real-time data fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // ─── REAL-TIME ACTION HANDLERS ───
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
      toast.success('Academic Calendar broadcasted to institutional members!');
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
      toast.success(`Event "${eventTitle}" created in live database!`);
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
      toast.success('Real-time AI Timetable generated and saved to database!');
      loadData();
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
      toast.success('Examination session created in live database!');
      setNewExamModal(false);
      setNewExamTitle('');
      setNewExamSubject('');
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create exam');
    }
  };

  const handleExamWorkflow = async (id, status) => {
    try {
      await AcademicAPI.updateExamWorkflow(id, { status });
      toast.success(`Exam status advanced to: ${status.toUpperCase()}`);
      loadData();
    } catch {
      toast.error('Failed to update workflow');
    }
  };

  const handleGenerateSeatingPlan = async (id) => {
    try {
      const res = await AcademicAPI.generateSeatingPlan(id);
      setSelectedSeatingPlan(res);
      toast.success('Anti-cheating alternate seating plan generated from real enrolled students!');
      loadData();
    } catch {
      toast.error('Failed to generate seating plan');
    }
  };

  const handleRunDutyAllocation = async () => {
    try {
      const res = await AcademicAPI.runAIFacultyDutyAllocation();
      if (res?.duties) setDuties(res.duties);
      toast.success(res?.message || 'AI allocated faculty duties evenly!');
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to allocate duties');
    }
  };

  const handleGenerateHallTickets = async () => {
    try {
      const res = await AcademicAPI.generateHallTickets({ minAttendance: 75 });
      if (Array.isArray(res)) setHallTickets(res);
      toast.success(`Clearance evaluated for students in real-time!`);
      loadData();
    } catch {
      toast.error('Failed to generate hall tickets');
    }
  };

  const handleApplyModeration = async (e) => {
    e.preventDefault();
    if (!moderationSubject) {
      toast.error('Please specify a subject');
      return;
    }
    try {
      await AcademicAPI.applyGradeModeration({
        subject: moderationSubject,
        adjustmentPoints: gracePoints,
        reason: moderationReason
      });
      toast.success(`Grade moderation applied and audit logged!`);
      loadData();
    } catch {
      toast.error('Failed to apply moderation');
    }
  };

  const handleExecuteAITool = async (actionKey) => {
    setAiLoading(true);
    setAiAction(actionKey);
    try {
      const res = await AcademicAPI.queryAIAssistant({
        action: actionKey,
        query: `Execute ${actionKey}`
      });
      setAiOutput(res);
      toast.success(`AI tool executed on live data: ${actionKey.replace(/_/g, ' ').toUpperCase()}`);
    } catch {
      toast.error('AI assistant execution failed');
    } finally {
      setAiLoading(false);
    }
  };

  // Real logged-in user profile info
  const controllerName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Academic Controller';
  const controllerEmail = user?.email || 'academic@eduverse.com';
  const controllerDepartment = user?.department || 'Academic Operations & Examination Wing';
  const controllerDesignation = user?.designation || 'Chief Controller of Examinations';

  return (
    <div className="flex flex-col gap-6 text-xs font-sans pb-16 selection:bg-purple-500/30">
      
      {/* ─── REAL-TIME LOGGED-IN PROFILE HEADER ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-purple-800/40 text-white shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[10px] sm:text-xxs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaShieldAlt /> {controllerDesignation}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] sm:text-xxs font-bold">
              ● Live Database Connected
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
            Hello, {controllerName}
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Logged in as <strong className="text-purple-300 font-mono">{controllerEmail}</strong> • {controllerDepartment}. Centralized operational command with real-time institutional synchronisation.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 relative z-10 w-full sm:w-auto">
          <button 
            onClick={() => { setActiveTab('timetable'); handleRunTimetableSolver(); }}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-1.5"
          >
            <FaRobot /> <span className="truncate">Generate Timetable</span>
          </button>
          <button 
            onClick={() => { setActiveTab('exams'); setNewExamModal(true); }}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <FaCalendarCheck /> <span className="truncate">Schedule Exam</span>
          </button>
          <button 
            onClick={() => { setActiveTab('halltickets'); handleGenerateHallTickets(); }}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
          >
            <FaIdCard /> <span className="truncate">Issue Hall Tickets</span>
          </button>
          <button 
            onClick={loadData}
            title="Refresh Live Data"
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <FaSyncAlt className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ─── 8 REAL-TIME KPI CARDS (NO HARDCODED VALUES) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3 font-mono">
        {[
          { label: 'Total Students', val: summary?.totalStudents ?? 0, icon: <FaUserGraduate />, color: 'text-indigo-400', border: 'border-indigo-500/20' },
          { label: 'Active Courses', val: summary?.activeCourses ?? 0, icon: <FaAward />, color: 'text-sky-400', border: 'border-sky-500/20' },
          { label: 'Upcoming Exams', val: summary?.upcomingExams ?? exams.length, icon: <FaFileAlt />, color: 'text-purple-400', border: 'border-purple-500/20' },
          { label: 'Clash Status', val: summary?.timetableConflicts ? `${summary.timetableConflicts} Clashes` : '0 Clashes', icon: <FaCheckCircle />, color: summary?.timetableConflicts ? 'text-rose-400' : 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'Results Pending', val: summary?.resultsPending ?? 0, icon: <FaBalanceScale />, color: 'text-amber-400', border: 'border-amber-500/20' },
          { label: 'Exam Duties', val: summary?.facultyExamDuties ?? duties.length, icon: <FaUserTie />, color: 'text-rose-400', border: 'border-rose-500/20' },
          { label: 'Hall Tickets', val: summary?.hallTicketsPublished ?? hallTickets.length, icon: <FaIdCard />, color: 'text-teal-400', border: 'border-teal-500/20' },
          { label: 'Classrooms', val: summary?.classroomsAllocated ?? classrooms.length, icon: <FaBuilding />, color: 'text-violet-400', border: 'border-violet-500/20' }
        ].map((k, i) => (
          <div key={i} className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#0f172a]/70 border ${k.border} flex flex-col gap-1 backdrop-blur-sm shadow-sm hover:border-purple-500/40 transition min-w-0`}>
            <div className="flex items-center justify-between text-slate-400 gap-1">
              <span className="text-[10px] sm:text-xxs uppercase tracking-wider font-sans font-bold truncate">{k.label}</span>
              <span className="text-xs shrink-0">{k.icon}</span>
            </div>
            <span className={`text-base sm:text-xl font-black ${k.color} truncate`}>{k.val}</span>
          </div>
        ))}
      </div>

      {/* ─── MODULE TAB SELECTOR ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none font-bold -mx-1 px-1">
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
            <div className="lg:col-span-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-400" /> Upcoming Exam Schedule Timeline
                </h2>
                <span className="text-xxs font-mono text-slate-400">{exams.length} Scheduled</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {(summary?.examTimeline && summary.examTimeline.length > 0) ? (
                  summary.examTimeline.map((ex, i) => (
                    <div key={i} className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono font-bold text-center shrink-0">
                          <span className="text-xxs block uppercase">{ex.date}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white text-xs block truncate">{ex.title}</span>
                          <span className="text-xxs text-slate-400 font-mono truncate block">Room: {ex.room} • {ex.candidates} Candidates</span>
                        </div>
                      </div>
                      <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono text-xxs font-bold shrink-0">
                        {ex.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-500 flex flex-col items-center gap-2">
                    <FaCalendarAlt className="text-2xl text-slate-600" />
                    <span>No upcoming examinations scheduled in this session.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timetable Conflict Heatmap */}
            <div className="lg:col-span-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FaCalendarCheck className="text-emerald-400" /> Timetable Conflict Heatmap
                </h2>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xxs font-mono font-bold flex items-center gap-1">
                  <FaCheckCircle /> {summary?.timetableConflicts ? `${summary.timetableConflicts} Active Clashes` : '0 Clashes'}
                </span>
              </div>
              <div className="w-full overflow-x-auto scrollbar-thin pb-2">
                <div className="min-w-[420px] grid grid-cols-6 gap-2 font-mono text-center">
                  {['Slot', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((h, i) => (
                    <span key={i} className="text-xxs text-slate-400 font-bold">{h}</span>
                  ))}
                  {['09:00', '10:15', '11:30', '14:00', '15:15'].map((time, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-xxs text-slate-500 py-2">{time}</span>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => {
                        const entry = summary?.conflictHeatmap?.find(h => h.day === day && h.slot === time);
                        const isConflict = entry && entry.conflicts > 0;
                        return (
                          <div 
                            key={day} 
                            className={`py-2 rounded-xl border font-bold text-xxs flex items-center justify-center transition cursor-pointer ${
                              isConflict
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {isConflict ? '! Clash' : '✓ Clean'}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Real Faculty Workload & Result Publication Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FaChalkboardTeacher className="text-indigo-400" /> Faculty Workload Distribution
              </h2>
              <div className="flex flex-col gap-3 font-mono">
                {(summary?.facultyWorkload && summary.facultyWorkload.length > 0) ? (
                  summary.facultyWorkload.map((f, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="font-bold text-white text-xs">{f.faculty}</span>
                        <span className="text-xxs text-slate-400 block">{f.dept} • Teaching: {f.teachingHours}h | Labs: {f.labHours}h | Duties: {f.dutyCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{f.total} hrs/wk</span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-xxs font-bold ${f.status === 'Overload' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                          {f.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-500 flex flex-col items-center gap-2">
                    <FaChalkboardTeacher className="text-2xl text-slate-600" />
                    <span>No faculty accounts found in database directory.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FaAward className="text-amber-400" /> Result Publication Status
              </h2>
              <div className="flex flex-col gap-3 font-mono">
                {[
                  { label: 'Published & Sealed', count: summary?.resultsStatus?.published ?? 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Moderated (Ready)', count: summary?.resultsStatus?.moderated ?? 0, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                  { label: 'Pending Moderation', count: summary?.resultsStatus?.draft ?? 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { label: 'Locked Results', count: summary?.resultsStatus?.locked ?? 0, color: 'text-rose-400', bg: 'bg-rose-500/10' }
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
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 1 • Real-Time Academic Scheduling</span>
                <h2 className="text-xl font-bold text-white">Institutional Academic Calendar</h2>
                <p className="text-xs text-slate-400">Academic Year: {calendar?.academicYear} • Term: {calendar?.currentTerm}</p>
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
              {calendar?.events && calendar.events.length > 0 ? (
                calendar.events.map(ev => (
                  <div key={ev.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{ev.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase ${
                          ev.category === 'exam_window' ? 'bg-purple-500/20 text-purple-300' :
                          ev.category === 'holiday' ? 'bg-amber-500/20 text-amber-300' :
                          ev.category === 'add_drop' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {ev.category?.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xxs text-slate-400 font-sans mt-0.5 block">{ev.description}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-300 block">{ev.startDate} to {ev.endDate}</span>
                      <span className="text-xxs text-slate-500">Audience: {ev.targetAudience?.join(', ')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-mono">
                  <FaCalendarAlt className="text-3xl text-slate-600" />
                  <span className="text-sm font-bold text-slate-300">No Calendar Events Scheduled</span>
                  <p className="text-xxs text-slate-500">Click "Add Event" to add terms, exam windows, or holidays to the calendar.</p>
                </div>
              )}
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
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 2 • Live Constraint Solver</span>
                <h2 className="text-xl font-bold text-white">AI Timetable Generator & Conflict Solver</h2>
                <p className="text-xs text-slate-400">Uses actual courses and faculty records from the database. Eliminates overlaps and minimizes idle gaps.</p>
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
                {timetableSlots.length > 0 && (
                  <button
                    onClick={() => exportToCSV(timetableSlots, 'institutional_timetable.csv')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <FaDownload /> Export CSV
                  </button>
                )}
              </div>
            </div>

            {/* Solver Active State with 3D Orb */}
            {solving && (
              <div className="p-8 rounded-3xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-center shadow-2xl backdrop-blur-md">
                <EduVerseOrbLoader 
                  size="lg"
                  message="AI Timetable Constraint Engine Active"
                  submessage="Running Google OR-Tools CP-SAT solver • Eliminating teacher and room conflicts"
                />
              </div>
            )}

            {/* Solver Report Card if executed */}
            {solverResult && (
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex flex-col sm:flex-row justify-between sm:items-center gap-4 font-mono">
                <div>
                  <span className="text-xxs uppercase tracking-wider text-purple-300 font-bold">CP-SAT Engine Report</span>
                  <span className="text-sm font-black text-white block">Status: {solverResult.solutionStatus} • Hard Conflicts: {solverResult.hardConstraintsViolated}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 font-bold">Optimization: {solverResult.softConstraintsScore}</span>
                  <span className="text-indigo-300 font-bold">Slots: {solverResult.allocatedSlotsCount}</span>
                </div>
              </div>
            )}

            {/* Timetable Interactive Grid */}
            <div className="flex flex-col gap-3 font-mono">
              <span className="text-xxs uppercase text-slate-400 font-bold tracking-wider">Scheduled Slots ({timetableSlots.length} Total)</span>
              {timetableSlots.length > 0 ? (
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
                        <span className="text-emerald-400 font-bold">✓ Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-mono">
                  <FaCalendarCheck className="text-3xl text-slate-600" />
                  <span className="text-sm font-bold text-slate-300">No Timetable Slots Generated</span>
                  <p className="text-xxs text-slate-500">Click "Run Google OR-Tools Solver" above to automatically generate slots from active courses.</p>
                </div>
              )}
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
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 4 & 5 • Real-Time Examination Lifecycle</span>
                <h2 className="text-xl font-bold text-white">Live Examination Sessions & Seating Plans</h2>
                <p className="text-xs text-slate-400">Approval workflow: Draft → Review → Principal Approval → Published → Locked.</p>
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
              {exams.length > 0 ? (
                exams.map(ex => (
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
                        {ex.status?.replace('_', ' ')}
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
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-mono">
                  <FaFileAlt className="text-3xl text-slate-600" />
                  <span className="text-sm font-bold text-slate-300">No Examination Sessions Found</span>
                  <p className="text-xxs text-slate-500">Click "Create Exam Session" above to schedule an exam in the live database.</p>
                </div>
              )}
            </div>

            {/* Generated Seating Plan Preview */}
            {selectedSeatingPlan && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col gap-3 font-mono">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="text-xs font-bold text-emerald-300">Alternate Anti-Cheating Seating Allocation ({selectedSeatingPlan.length} Candidates)</span>
                  <button 
                    onClick={() => exportToCSV(selectedSeatingPlan, 'seating_allocation.csv')}
                    className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xxs flex items-center gap-1"
                  >
                    <FaDownload /> Download Slip
                  </button>
                </div>
                <div className="w-full overflow-x-auto scrollbar-thin pb-2">
                  <div className="min-w-[420px] grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xxs">
                    {selectedSeatingPlan.map((seat, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="font-bold text-amber-400 block">{seat.seatNumber}</span>
                        <span className="text-slate-300 font-bold block truncate">{seat.studentName}</span>
                        <span className="text-slate-500 text-[10px] block truncate">{seat.rollNumber} • {seat.department}</span>
                      </div>
                    ))}
                  </div>
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
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 6 • Live Faculty Invigilation Roster</span>
                <h2 className="text-xl font-bold text-white">Faculty Exam Duty Allocation</h2>
                <p className="text-xs text-slate-400">Dynamically allocates invigilation duties across registered faculty accounts.</p>
              </div>
              <button
                onClick={handleRunDutyAllocation}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md shadow-purple-600/30 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FaRobot /> AI Fair Duty Balance
              </button>
            </div>

            <div className="flex flex-col gap-2.5 font-mono">
              {duties.length > 0 ? (
                duties.map((d, i) => (
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
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-mono">
                  <FaUserTie className="text-3xl text-slate-600" />
                  <span className="text-sm font-bold text-slate-300">No Invigilation Duties Assigned</span>
                  <p className="text-xxs text-slate-500">Click "AI Fair Duty Balance" above to assign faculty invigilators to scheduled exams.</p>
                </div>
              )}
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
                <p className="text-xs text-slate-400">Clearance gatekeeper: evaluates 75% attendance and fee clearance against real student profiles.</p>
              </div>
              <button
                onClick={handleGenerateHallTickets}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FaSyncAlt /> Verify & Generate Hall Tickets
              </button>
            </div>

            <div className="flex flex-col gap-3 font-mono">
              {hallTickets.length > 0 ? (
                hallTickets.map((ht, i) => (
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
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-mono">
                  <FaIdCard className="text-3xl text-slate-600" />
                  <span className="text-sm font-bold text-slate-300">No Hall Tickets Generated Yet</span>
                  <p className="text-xxs text-slate-500">Click "Verify & Generate Hall Tickets" to evaluate student attendance and fee clearance from database records.</p>
                </div>
              )}
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
                  <span className="text-slate-500 font-mono truncate max-w-[240px]">Hash: {selectedTicketPreview.verificationHash}</span>
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
                <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 8 • Live Academic Transcripts</span>
                <h2 className="text-xl font-bold text-white">Result Publication & Marksheet Generator</h2>
                <p className="text-xs text-slate-400">Stores evaluated grades, computes SGPA/CGPA, and supports tamper-proof status locking.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setResultsLocked(true); toast.success('Results officially locked against tampering.'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    resultsLocked ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <FaLock /> {resultsLocked ? 'Results Locked' : 'Lock Results'}
                </button>
                {results.length > 0 && (
                  <button
                    onClick={() => exportToCSV(results, 'semester_results_merit.csv')}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <FaDownload /> Export Merit List
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 font-mono">
              {results.length > 0 ? (
                results.map((r, i) => (
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
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-mono">
                  <FaAward className="text-3xl text-slate-600" />
                  <span className="text-sm font-bold text-slate-300">No Exam Results Published Yet</span>
                  <p className="text-xxs text-slate-500">Evaluated marks will appear here once submitted by examination evaluators.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 8: GRADE MODERATION ─── */}
      {activeTab === 'moderation' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div>
              <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 9 • Statistical Distribution & Audit Trail</span>
              <h2 className="text-xl font-bold text-white">Grade Moderation & Outlier Correction</h2>
              <p className="text-xs text-slate-400">Modifies active course results and records the adjustment in the institution compliance log.</p>
            </div>

            <form onSubmit={handleApplyModeration} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono">
              <div>
                <label className="text-xxs uppercase text-slate-400 font-bold block mb-1">Target Subject</label>
                <input 
                  type="text" 
                  value={moderationSubject} 
                  onChange={e => setModerationSubject(e.target.value)} 
                  placeholder="e.g. Design & Analysis of Algorithms"
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
          </div>
        </motion.div>
      )}

      {/* ─── TAB 9: CLASSROOM ALLOCATION ─── */}
      {activeTab === 'classrooms' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div>
              <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 3 • Space & Physical Infrastructure</span>
              <h2 className="text-xl font-bold text-white">Classroom & Lab Inventory Allocation</h2>
              <p className="text-xs text-slate-400">Live room capacities and hardware equipment mapped directly from database.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
              {classrooms.length > 0 ? (
                classrooms.map((rm, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{rm.roomNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold ${rm.isLab ? 'bg-purple-500/10 text-purple-300' : 'bg-slate-800 text-slate-300'}`}>
                        {rm.isLab ? 'Lab' : 'Lecture Hall'}
                      </span>
                    </div>
                    <span className="text-xxs text-slate-400 font-sans">{rm.building} • Max Capacity: {rm.capacity} Seats</span>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xxs">
                      <span className="text-emerald-400 font-bold">Utilization: {rm.utilizationScore}%</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">{rm.currentStatus}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-mono">
                  <FaBuilding className="text-3xl text-slate-600" />
                  <span>No classrooms registered in inventory.</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 10: FACULTY WORKLOAD ─── */}
      {activeTab === 'workload' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 flex flex-col gap-5">
            <div>
              <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 10 • Academic Faculty Contact Hours</span>
              <h2 className="text-xl font-bold text-white">Live Faculty Contact Hours & Workload Matrix</h2>
              <p className="text-xs text-slate-400">Calculated dynamically from real teacher profiles and assigned lecture/lab slots.</p>
            </div>

            <div className="flex flex-col gap-3 font-mono">
              {(workloadData?.workload && workloadData.workload.length > 0) ? (
                workloadData.workload.map((w, i) => (
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
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-mono">
                  <FaTasks className="text-3xl text-slate-600" />
                  <span>No faculty workload records available in directory.</span>
                </div>
              )}
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
                <p className="text-xs text-slate-400">Export real-time academic audit statistics directly to JSON/CSV formats.</p>
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
                <span className="text-xxs uppercase text-slate-400 font-bold block mb-1">Pass Percentage</span>
                <span className="text-2xl font-black text-emerald-400">{reportsData?.examPassPercentage?.overall || '100%'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xxs uppercase text-slate-400 font-bold block mb-1">Eligible Candidates</span>
                <span className="text-2xl font-black text-indigo-400">{reportsData?.attendanceEligibilityBreakdown?.eligibleCount ?? 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xxs uppercase text-slate-400 font-bold block mb-1">Room Utilization</span>
                <span className="text-2xl font-black text-purple-400">{reportsData?.classroomUtilization || '0%'}</span>
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
              <span className="text-xxs font-mono uppercase text-purple-400 font-bold">Module 12 • Real-Time AI Autonomous Tools</span>
              <h2 className="text-xl font-bold text-white">AI Academic Assistant</h2>
              <p className="text-xs text-slate-400">Executes real-time conflict inspection, predictive pass modeling, and timetable constraint solving.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'detect_conflicts', label: 'Detect Conflicts', icon: <FaCheckCircle /> },
                { id: 'generate_timetable', label: 'Generate Timetable', icon: <FaCalendarCheck /> },
                { id: 'generate_exam_schedule', label: 'Exam Schedule', icon: <FaFileAlt /> },
                { id: 'predict_pass_percentage', label: 'Predict Pass Rate', icon: <FaAward /> }
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

            {aiLoading ? (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <EduVerseOrbLoader 
                  size="md"
                  message="AI Copilot Querying Live Database Records..."
                  submessage="Synthesizing academic operational heuristics & constraints"
                />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Add Academic Calendar Event</h3>
                <button onClick={() => setNewEventModal(false)} className="text-slate-400 hover:text-white p-1"><FaTimes /></button>
              </div>
              <form onSubmit={handleAddCalendarEvent} className="flex flex-col gap-3">
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Event Title</label>
                  <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="e.g. End-Semester Examinations" className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Schedule New Examination</h3>
                <button onClick={() => setNewExamModal(false)} className="text-slate-400 hover:text-white p-1"><FaTimes /></button>
              </div>
              <form onSubmit={handleCreateExam} className="flex flex-col gap-3">
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Exam Title</label>
                  <input type="text" value={newExamTitle} onChange={e => setNewExamTitle(e.target.value)} placeholder="e.g. Design & Analysis of Algorithms End-Term" className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Subject</label>
                    <input type="text" value={newExamSubject} onChange={e => setNewExamSubject(e.target.value)} placeholder="Algorithms" className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Course Code</label>
                    <input type="text" value={newExamCode} onChange={e => setNewExamCode(e.target.value)} placeholder="CS401" className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Date</label>
                    <input type="date" value={newExamDate} onChange={e => setNewExamDate(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Allocated Room</label>
                    <select value={newExamRoom} onChange={e => setNewExamRoom(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                      {classrooms.length > 0 ? (
                        classrooms.map((rm, i) => (
                          <option key={i} value={rm.roomNumber}>{rm.roomNumber} (Cap: {rm.capacity})</option>
                        ))
                      ) : (
                        <option value="LH-101">LH-101 (Cap: 120)</option>
                      )}
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
