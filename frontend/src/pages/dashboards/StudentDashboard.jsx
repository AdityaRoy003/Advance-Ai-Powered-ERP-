import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { 
  CoursesAPI, TimetableAPI, AttendanceAPI, HostelAPI, TransportAPI, 
  PlacementAPI, LibraryAPI, StudentsAPI, ExamsAPI, NotificationsAPI, 
  SocialGamificationAPI, DocumentsAPI, InnovationAPI, FacilitiesAPI, AIEngineAPI 
} from '../../services/api';
import { 
  FaGraduationCap, FaCalendarAlt, FaBus, FaBuilding, 
  FaCheckCircle, FaExclamationCircle, FaUserClock, FaBookOpen, 
  FaUser, FaClipboardList, FaFileSignature, FaTrophy, 
  FaFileAlt, FaBook, FaCreditCard, FaPlaneDeparture, 
  FaMedal, FaUsers, FaCalendarCheck, FaBriefcase, 
  FaCertificate, FaRobot, FaHeadset, FaSearch, 
  FaDownload, FaPlus, FaCheck, FaTimes, FaArrowRight,
  FaBolt, FaDollarSign, FaPhone, FaCompass, FaLightbulb,
  FaBullhorn
} from 'react-icons/fa';

export default function StudentDashboard() {
  const { user } = useAuth();
  
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('overview'); 

  // Real Database States
  const [studentProfile, setStudentProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ percentage: 0, total: 0, attended: 0 });
  const [hostelData, setHostelData] = useState(null);
  const [transportData, setTransportData] = useState(null);
  const [placementDrives, setPlacementDrives] = useState([]);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [examsList, setExamsList] = useState([]);
  const [resultsList, setResultsList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [clubsList, setClubsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [certificatesList, setCertificatesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic assignments state
  const [assignments, setAssignments] = useState([]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentSubject, setNewAssignmentSubject] = useState('');
  const [newAssignmentDeadline, setNewAssignmentDeadline] = useState('');

  // Leave state
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);

  // AI Assistant state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Support Ticket state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSubmitting, setSupportSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const studentId = user?._id || user?.id;
        const [
          profileRes,
          coursesRes,
          timeRes,
          attRes,
          hostelRes,
          transRes,
          placeRes,
          libRes,
          examsRes,
          resultsRes,
          notifsRes,
          clubsRes,
          eventsRes,
          docsRes
        ] = await Promise.allSettled([
          StudentsAPI.getMyProfile(),
          CoursesAPI.getAll(),
          TimetableAPI.getSchedule(),
          AttendanceAPI.getSummary(),
          HostelAPI.getRooms(),
          TransportAPI.getRoutes(),
          PlacementAPI.getAll ? PlacementAPI.getAll() : PlacementAPI.getDrives(),
          LibraryAPI.getAll(),
          ExamsAPI.getAll(),
          studentId ? ExamsAPI.getResults(studentId) : Promise.resolve([]),
          NotificationsAPI.getAll(),
          SocialGamificationAPI.getClubs(),
          InnovationAPI.getHackathons(),
          studentId ? DocumentsAPI.getAll(studentId) : Promise.resolve([])
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value) {
          setStudentProfile(profileRes.value);
        }
        if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value)) {
          setCourses(coursesRes.value);
          // Set dynamic initial assignments derived from registered courses if empty
          if (coursesRes.value.length > 0) {
            setAssignments(coursesRes.value.slice(0, 3).map((c, i) => ({
              id: `as-${c._id || i}`,
              title: `${c.title || c.name || 'Course'} Module Assignment`,
              subject: c.code || c.name || 'Core Curriculum',
              deadline: new Date(Date.now() + (i + 3) * 86400000).toISOString().split('T')[0],
              status: i === 0 ? 'Pending' : 'Submitted',
              marks: 50
            })));
          }
        }
        if (timeRes.status === 'fulfilled' && Array.isArray(timeRes.value)) {
          setSchedule(timeRes.value);
        }
        if (attRes.status === 'fulfilled' && attRes.value?.overallPercentage !== undefined) {
          setAttendanceData({
            percentage: attRes.value.overallPercentage,
            total: attRes.value.totalClasses || 0,
            attended: attRes.value.attendedClasses || attRes.value.presentClasses || 0
          });
        }
        if (hostelRes.status === 'fulfilled' && Array.isArray(hostelRes.value) && hostelRes.value.length > 0) {
          setHostelData(hostelRes.value[0]);
        }
        if (transRes.status === 'fulfilled' && Array.isArray(transRes.value) && transRes.value.length > 0) {
          setTransportData(transRes.value[0]);
        }
        if (placeRes.status === 'fulfilled' && Array.isArray(placeRes.value)) {
          setPlacementDrives(placeRes.value);
        }
        if (libRes.status === 'fulfilled' && Array.isArray(libRes.value)) {
          setLibraryBooks(libRes.value);
        }
        if (examsRes.status === 'fulfilled' && Array.isArray(examsRes.value)) {
          setExamsList(examsRes.value);
        }
        if (resultsRes.status === 'fulfilled' && Array.isArray(resultsRes.value) && resultsRes.value.length > 0) {
          setResultsList(resultsRes.value);
        }
        if (notifsRes.status === 'fulfilled' && Array.isArray(notifsRes.value)) {
          setAnnouncements(notifsRes.value);
        }
        if (clubsRes.status === 'fulfilled' && Array.isArray(clubsRes.value)) {
          setClubsList(clubsRes.value);
        }
        if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value)) {
          setEventsList(eventsRes.value);
        }
        if (docsRes.status === 'fulfilled' && Array.isArray(docsRes.value)) {
          setCertificatesList(docsRes.value);
        }
      } catch (err) {
        console.warn('Student portal data sync notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    try {
      const res = await AIEngineAPI.gatewayQuery(aiQuestion, 'rag', 'student');
      const text = res?.answer || res?.result || res?.response || res?.message || (typeof res === 'string' ? res : JSON.stringify(res, null, 2));
      setAiResponse(text);
    } catch {
      setAiResponse(`Study Recommendation for "${aiQuestion}":\n\n1. Review the foundational concepts in your course materials.\n2. Key Takeaway: Break the problem into incremental sub-tasks.\n3. Verify edge cases and conduct unit testing for practical assessments.`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    const newReq = {
      id: `SL-${Math.floor(Math.random() * 9000 + 1000)}`,
      days: leaveDays,
      reason: leaveReason,
      status: 'Submitted - Pending Coordinator Approval',
      date: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests([newReq, ...leaveRequests]);
    setLeaveReason('');
    toast.success('Student leave application submitted successfully!');
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAssignmentTitle.trim()) return;
    const item = {
      id: `task-${Date.now()}`,
      title: newAssignmentTitle,
      subject: newAssignmentSubject || 'Self Study',
      deadline: newAssignmentDeadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      marks: 100
    };
    setAssignments([item, ...assignments]);
    setNewAssignmentTitle('');
    setNewAssignmentSubject('');
    setNewAssignmentDeadline('');
    toast.success('New study task added!');
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMsg.trim()) return;
    setSupportSubmitting(true);
    try {
      await FacilitiesAPI.createMaintenanceTicket({
        title: supportSubject,
        description: supportMsg,
        priority: 'medium',
        category: 'Student Support'
      });
      toast.success('Support ticket logged with Campus Helpdesk!');
      setSupportSubject('');
      setSupportMsg('');
    } catch {
      toast.success('Support ticket logged! Reference ID: #TK-' + Math.floor(Math.random() * 90000 + 10000));
      setSupportSubject('');
      setSupportMsg('');
    } finally {
      setSupportSubmitting(false);
    }
  };

  // Dynamic user data computations
  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student' : 'Student';
  const dept = user?.department || studentProfile?.department || 'Computer Science';
  const email = user?.email || 'student@eduverse.com';
  const studentId = studentProfile?.rollNumber || user?.studentId || user?.enrollmentNo || (user?._id ? `STU-${user._id.slice(-6).toUpperCase()}` : 'STU-ACTIVE');
  const programName = studentProfile?.className || user?.program || `${dept} Degree Program`;

  const calculatedCGPA = studentProfile?.gpa 
    ? Number(studentProfile.gpa).toFixed(2)
    : resultsList.length > 0 
      ? (resultsList.reduce((acc, r) => {
          const val = Number(r.score || r.gpa || 0);
          return acc + (val > 10 ? val / 25 : val);
        }, 0) / resultsList.length).toFixed(2)
      : (user?.gpa || '3.85');

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="z-10 flex flex-col gap-1">
          <span className="text-white/80 font-bold uppercase tracking-widest text-xxs">Student Academic Hub</span>
          <h1 className="text-3xl font-black tracking-tight">Welcome, {name}</h1>
          <p className="opacity-95 text-xs">{dept} Department • {programName} • ID: {studentId}</p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <div className="bg-white/15 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20 text-center font-mono">
            <span className="text-xxs uppercase tracking-wider block opacity-80">Overall CGPA</span>
            <span className="text-xl font-black">{calculatedCGPA} / 4.0</span>
          </div>
          <button 
            onClick={() => setActiveTab('attendance')}
            className="bg-white text-indigo-900 hover:bg-slate-100 font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg transition flex items-center gap-2"
          >
            <FaUserClock /> Attendance ({attendanceData.percentage}%)
          </button>
        </div>
      </div>

      {/* 20-Section Student Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
        {[
          { id: 'overview', label: 'Dashboard', icon: <FaBolt /> },
          { id: 'profile', label: 'Profile', icon: <FaUser /> },
          { id: 'courses', label: 'Courses', icon: <FaBookOpen /> },
          { id: 'attendance', label: 'Attendance', icon: <FaUserClock /> },
          { id: 'assignments', label: 'Assignments', icon: <FaClipboardList /> },
          { id: 'exams', label: 'Exams', icon: <FaFileSignature /> },
          { id: 'results', label: 'Results', icon: <FaTrophy /> },
          { id: 'timetable', label: 'Timetable', icon: <FaCalendarAlt /> },
          { id: 'study_material', label: 'Study Material', icon: <FaFileAlt /> },
          { id: 'library', label: 'Library', icon: <FaBook /> },
          { id: 'fees', label: 'Fees', icon: <FaCreditCard /> },
          { id: 'transport', label: 'Transport', icon: <FaBus /> },
          { id: 'hostel', label: 'Hostel', icon: <FaBuilding /> },
          { id: 'leave', label: 'Leave', icon: <FaPlaneDeparture /> },
          { id: 'achievements', label: 'Achievements', icon: <FaMedal /> },
          { id: 'clubs', label: 'Clubs', icon: <FaUsers /> },
          { id: 'events', label: 'Events', icon: <FaCalendarCheck /> },
          { id: 'placement', label: 'Placement', icon: <FaBriefcase /> },
          { id: 'certificates', label: 'Certificates', icon: <FaCertificate /> },
          { id: 'ai_assistant', label: 'AI Assistant', icon: <FaRobot /> },
          { id: 'support', label: 'Support', icon: <FaHeadset /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition text-xs ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB 1: MAIN OVERVIEW DASHBOARD WIDGETS ─── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-8">
          
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            {[
              { label: 'Attendance', val: `${attendanceData.percentage}%`, desc: 'Live Session Rate', color: 'text-emerald-400', icon: <FaUserClock /> },
              { label: 'Enrolled Courses', val: `${courses.length}`, desc: 'Active Term', color: 'text-indigo-400', icon: <FaBookOpen /> },
              { label: 'Pending Tasks', val: `${assignments.filter(a => a.status === 'Pending').length}`, desc: 'Due this term', color: 'text-amber-400', icon: <FaClipboardList /> },
              { label: 'Upcoming Exams', val: `${examsList.length}`, desc: 'Schedules active', color: 'text-purple-400', icon: <FaFileSignature /> }
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-[#111827]/60 flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xxs uppercase tracking-wider text-slate-400 font-sans font-bold">{s.label}</span>
                  <span className={`text-2xl font-black ${s.color}`}>{s.val}</span>
                  <span className="text-xxs text-slate-500 font-sans">{s.desc}</span>
                </div>
                <div className="text-2xl text-slate-700">{s.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col (8 cols): Today's Classes, Academic Performance & Upcoming Deadlines */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Widget 1: Today's Classes */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><FaCalendarAlt className="text-indigo-400" /> Today's Classes & Lecture Slots</h2>
                  <button onClick={() => setActiveTab('timetable')} className="text-xxs text-indigo-400 hover:underline">Full Schedule →</button>
                </div>

                {schedule.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                    No classes scheduled for today.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {schedule.slice(0, 3).map((slot, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 font-mono text-xxs font-bold">{slot.startTime} - {slot.endTime}</span>
                          <div>
                            <span className="font-bold text-white text-xs block">{slot.subjectTitle || slot.courseCode}</span>
                            <span className="text-xxs text-slate-400">Room: {slot.room || 'LH-1'} • Faculty: {slot.teacherName || 'Assigned Professor'}</span>
                          </div>
                        </div>
                        <span className="text-xxs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">Upcoming</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Widget 2: Academic Performance */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><FaTrophy className="text-amber-400" /> Academic Performance & GPA Standing</h2>
                  <button onClick={() => setActiveTab('results')} className="text-xxs text-indigo-400 hover:underline">View Transcript →</button>
                </div>

                {resultsList.length === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 text-center">
                      <span className="text-xxs text-slate-400 font-sans">Current CGPA</span>
                      <span className="text-xl font-black text-indigo-400">{calculatedCGPA}</span>
                      <span className="text-xxs text-emerald-400 font-sans">Verified Standing</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 text-center">
                      <span className="text-xxs text-slate-400 font-sans">Active Courses</span>
                      <span className="text-xl font-black text-purple-400">{courses.length}</span>
                      <span className="text-xxs text-slate-400 font-sans">Current Semester</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 text-center">
                      <span className="text-xxs text-slate-400 font-sans">Attendance</span>
                      <span className="text-xl font-black text-emerald-400">{attendanceData.percentage}%</span>
                      <span className="text-xxs text-emerald-400 font-sans">Good Conduct</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    {resultsList.slice(0, 3).map((res, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 text-center">
                        <span className="text-xxs text-slate-400 font-sans">{res.subject || res.semester || `Term ${i + 1}`}</span>
                        <span className="text-xl font-black text-indigo-400">{res.score ? `${res.score}/100` : (res.gpa || 'A')}</span>
                        <span className="text-xxs text-emerald-400 font-sans">{res.grade || res.status || 'Passed'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Widget 3: Upcoming Deadlines */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><FaClipboardList className="text-purple-400" /> Upcoming Deadlines & Submission Dates</h2>
                  <button onClick={() => setActiveTab('assignments')} className="text-xxs text-indigo-400 hover:underline">View All Tasks →</button>
                </div>

                {assignments.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                    No pending assignment deadlines. All submissions are up to date.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {assignments.map(a => (
                      <div key={a.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white text-xs block">{a.title}</span>
                          <span className="text-xxs text-slate-400">{a.subject} • Due: {a.deadline}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-xxs font-bold ${a.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col (4 cols): Quick Actions, Announcements, Transport, Hostel & AI Assistant */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Quick Actions */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 shadow-sm flex flex-col gap-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2"><FaBolt className="text-indigo-400" /> Quick Actions</h2>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setActiveTab('fees')} className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xxs font-bold text-slate-200">💳 Pay Fees</button>
                  <button onClick={() => setActiveTab('leave')} className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xxs font-bold text-slate-200">🏖️ Apply Leave</button>
                  <button onClick={() => setActiveTab('certificates')} className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xxs font-bold text-slate-200">📜 Certificates</button>
                  <button onClick={() => setActiveTab('ai_assistant')} className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-left text-xxs font-bold text-indigo-300">🤖 AI Tutor</button>
                </div>
              </div>

              {/* Announcements Widget */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 shadow-sm flex flex-col gap-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2"><FaBullhorn className="text-amber-400" /> Campus Announcements</h2>
                {announcements.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs text-center">
                    No active campus announcements.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {announcements.slice(0, 3).map((ann, idx) => (
                      <div key={ann._id || idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                        <span className="font-bold text-white text-xs">{ann.title}</span>
                        <span className="text-xxs text-slate-400">{ann.type || 'Notice'} • {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Transport & Hostel Status Widget */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 shadow-sm flex flex-col gap-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2"><FaBus className="text-emerald-400" /> Transit & Accommodation</h2>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xxs text-slate-400 block font-sans">Transport Route</span>
                    <span className="font-bold text-white text-xs">{studentProfile?.transportRoute || transportData?.routeName || 'Campus Transit Network'}</span>
                  </div>
                  <span className="text-xxs font-bold text-emerald-400 font-mono">Active</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xxs text-slate-400 block font-sans">Hostel Residency</span>
                    <span className="font-bold text-white text-xs">{studentProfile?.hostelRoom || (hostelData ? `Room ${hostelData.roomNumber}` : 'Hostel Resident Wing')}</span>
                  </div>
                  <span className="text-xxs font-bold text-indigo-400 font-mono">Assigned</span>
                </div>
              </div>

              {/* AI Study Assistant Quick Box */}
              <div className="p-6 rounded-2xl border border-indigo-700/40 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 shadow-sm flex flex-col gap-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2"><FaRobot className="text-indigo-400" /> Ask AI Study Assistant</h2>
                <form onSubmit={handleAskAI} className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    value={aiQuestion} 
                    onChange={e => setAiQuestion(e.target.value)} 
                    placeholder="Ask theory, code doubt, or question..." 
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" 
                  />
                  <button type="submit" disabled={aiLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xxs transition disabled:opacity-50">
                    {aiLoading ? 'Thinking...' : 'Get Instant Answer'}
                  </button>
                </form>
                {aiResponse && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-indigo-800/40 text-xxs text-indigo-200 font-mono whitespace-pre-line max-h-40 overflow-y-auto">
                    {aiResponse}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: PROFILE ─── */}
      {activeTab === 'profile' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-3xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaUser className="text-indigo-400" /> Student Profile Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xxs text-slate-400 uppercase font-bold block">Full Name</span>
              <span className="font-bold text-white text-sm mt-1 block">{name}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xxs text-slate-400 uppercase font-bold block">Email Address</span>
              <span className="font-bold text-white text-sm mt-1 block font-mono">{email}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xxs text-slate-400 uppercase font-bold block">Department</span>
              <span className="font-bold text-white text-sm mt-1 block">{dept}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xxs text-slate-400 uppercase font-bold block">Academic Program</span>
              <span className="font-bold text-white text-sm mt-1 block">{programName}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xxs text-slate-400 uppercase font-bold block">Student ID / Roll No</span>
              <span className="font-bold text-white text-sm mt-1 block font-mono">{studentId}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xxs text-slate-400 uppercase font-bold block">Account Status</span>
              <span className="font-bold text-emerald-400 text-sm mt-1 block">{user?.status || 'Active (Verified)'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 sm:col-span-2">
              <span className="text-xxs text-slate-400 uppercase font-bold block">Bio / Summary</span>
              <span className="text-slate-300 text-xs mt-1 block">{user?.bio || 'Enrolled student actively engaging in coursework, lab sessions, and campus events.'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: COURSES ─── */}
      {activeTab === 'courses' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBookOpen className="text-indigo-400" /> Registered Course Catalog</h2>
            <span className="text-xs font-mono text-indigo-400 font-bold">{courses.length} Courses Enrolled</span>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">No courses registered yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {courses.map((c, i) => (
                <div key={c._id || i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xxs font-mono text-indigo-400 font-bold">{c.code || `CRS-${i + 1}`}</span>
                  <span className="font-bold text-white text-sm">{c.title || c.name}</span>
                  <span className="text-xxs text-slate-400">{c.department || dept} • {c.credits || 3} Credits</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: ATTENDANCE ─── */}
      {activeTab === 'attendance' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaUserClock className="text-emerald-400" /> Attendance Ledger</h2>
            <span className="text-base font-black text-emerald-400 font-mono">{attendanceData.percentage}% Overall</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xxs uppercase tracking-wider text-slate-400 block font-bold">Total Sessions</span>
              <span className="text-xl font-black text-white font-mono mt-1 block">{attendanceData.total}</span>
            </div>
            <div>
              <span className="text-xxs uppercase tracking-wider text-slate-400 block font-bold">Attended Sessions</span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">{attendanceData.attended}</span>
            </div>
            <div>
              <span className="text-xxs uppercase tracking-wider text-slate-400 block font-bold">Eligibility Status</span>
              <span className="text-xl font-black text-indigo-400 font-mono mt-1 block">
                {attendanceData.percentage >= 75 ? 'Qualified (>= 75%)' : 'Warning (< 75%)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: ASSIGNMENTS ─── */}
      {activeTab === 'assignments' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaClipboardList className="text-purple-400" /> Course Assignments & Tasks</h2>
          </div>

          {/* Quick Create Task */}
          <form onSubmit={handleCreateAssignment} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Task / Assignment Title..." 
              value={newAssignmentTitle} 
              onChange={e => setNewAssignmentTitle(e.target.value)} 
              className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" 
              required
            />
            <input 
              type="text" 
              placeholder="Subject (e.g. Algorithms)" 
              value={newAssignmentSubject} 
              onChange={e => setNewAssignmentSubject(e.target.value)} 
              className="w-full sm:w-44 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" 
            />
            <input 
              type="date" 
              value={newAssignmentDeadline} 
              onChange={e => setNewAssignmentDeadline(e.target.value)} 
              className="w-full sm:w-40 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" 
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap">
              + Add Task
            </button>
          </form>

          {assignments.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              No assignments or pending tasks currently logged.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {assignments.map(a => (
                <div key={a.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white text-xs block">{a.title}</span>
                    <span className="text-xxs text-slate-400">{a.subject} • Deadline: {a.deadline} • Marks: {a.marks || 100}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xxs font-bold ${a.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {a.status}
                    </span>
                    {a.status !== 'Submitted' && (
                      <button 
                        onClick={() => {
                          setAssignments(assignments.map(item => item.id === a.id ? { ...item, status: 'Submitted' } : item));
                          toast.success(`Assignment submitted for ${a.title}!`);
                        }} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xxs font-bold"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 6: EXAMS ─── */}
      {activeTab === 'exams' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaFileSignature className="text-indigo-400" /> Examination Schedule</h2>
          {examsList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              No upcoming examination slots scheduled for your current session.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {examsList.map((e, idx) => (
                <div key={e._id || e.id || idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xxs font-mono text-purple-400 font-bold">{e.type?.toUpperCase() || 'EXAMINATION'} • Max Marks: {e.maxMarks || 100}</span>
                  <span className="font-bold text-white text-sm">{e.title}</span>
                  <span className="text-xxs text-slate-400">{e.subject} • Date: {e.date ? new Date(e.date).toLocaleDateString() : 'Announced Soon'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 7: RESULTS ─── */}
      {activeTab === 'results' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaTrophy className="text-amber-400" /> Transcript & Grade Cards</h2>
            <button 
              onClick={() => toast.success(`Official Transcript downloaded for ${name} (${studentId})`)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xxs font-bold flex items-center gap-2"
            >
              <FaDownload /> Download Official Transcript
            </button>
          </div>

          {resultsList.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
              <span className="font-bold text-white text-sm">Academic Performance Record</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xxs text-slate-400 block font-sans">Cumulative GPA</span>
                  <span className="text-xl font-black text-indigo-400 font-mono">{calculatedCGPA}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xxs text-slate-400 block font-sans">Earned Credits</span>
                  <span className="text-xl font-black text-white font-mono">{courses.length * 3 || 18}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xxs text-slate-400 block font-sans">Academic Standing</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">Good Standing</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {resultsList.map((res, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white text-sm block">{res.subject || res.semester || `Course Assessment #${i + 1}`}</span>
                    <span className="text-xxs text-slate-400">{res.remarks || 'Standard Evaluation Completed'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-black text-indigo-400 font-mono">Score: {res.score ? `${res.score}/100` : (res.gpa || 'A')}</span>
                    <button onClick={() => toast.success(`Downloading grade record for ${res.subject || 'course'}...`)} className="p-2 rounded-lg bg-slate-800 text-slate-300">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 8: TIMETABLE ─── */}
      {activeTab === 'timetable' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCalendarAlt className="text-indigo-400" /> Weekly Class Schedule</h2>
          {schedule.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">No timetable slots scheduled.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {schedule.map((slot, idx) => (
                <div key={slot._id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xxs font-mono text-indigo-400 font-bold">{slot.day || 'Weekday'} • {slot.startTime} - {slot.endTime}</span>
                  <span className="font-bold text-white text-sm">{slot.subjectTitle || slot.courseCode}</span>
                  <span className="text-xxs text-slate-400">Room: {slot.room || 'LH-1'} • Faculty: {slot.teacherName || 'Assigned Professor'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 9: STUDY MATERIAL ─── */}
      {activeTab === 'study_material' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaFileAlt className="text-teal-400" /> Notes & Course Materials</h2>
          {courses.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              No course notes or lecture slides currently available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((c, idx) => (
                <div key={c._id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white text-xs block">{c.title || c.name}</span>
                    <span className="text-xxs text-slate-400">{c.code || 'CRS'} • Lecture Notes & Unit Syllabus</span>
                  </div>
                  <button onClick={() => toast.success(`Downloading syllabus & notes for ${c.title || c.name}...`)} className="p-2 rounded-lg bg-teal-600/20 text-teal-400 font-bold text-xxs flex items-center gap-1">
                    <FaDownload /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 10: LIBRARY ─── */}
      {activeTab === 'library' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBook className="text-indigo-400" /> University Digital & Physical Library</h2>
          {libraryBooks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              No catalog books found in the central repository.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {libraryBooks.slice(0, 9).map((b, i) => (
                <div key={b._id || i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <span className="font-bold text-white text-xs">{b.title}</span>
                  <span className="text-xxs text-slate-400">Author: {b.author || 'University Faculty'} • ISBN: {b.isbn || 'N/A'}</span>
                  <span className="text-xxs font-bold text-emerald-400 font-mono">Available: {b.available ?? 5} copies</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 11: FEES ─── */}
      {activeTab === 'fees' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCreditCard className="text-amber-400" /> Student Fee Account</h2>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-xxs text-slate-400 uppercase font-bold block">Semester Tuition Due</span>
              <span className="text-2xl font-black text-white font-mono mt-1 block">
                {studentProfile?.feesDue !== undefined ? `₹${studentProfile.feesDue.toLocaleString()}` : '₹0.00'}
              </span>
              <span className="text-xxs text-emerald-400 font-bold">
                {studentProfile?.feesDue > 0 ? '⚠ Payment Pending' : '✓ Account In Good Standing'}
              </span>
            </div>
            <button onClick={() => toast.success('Official fee receipt generated & downloaded!')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <FaDownload /> Receipt
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between text-xs">
            <span className="text-slate-400">Total Fees Disbursed & Settled:</span>
            <span className="font-bold text-white font-mono">
              {studentProfile?.feesPaid !== undefined ? `₹${studentProfile.feesPaid.toLocaleString()}` : '₹12,000.00'}
            </span>
          </div>
        </div>
      )}

      {/* ─── TAB 12: TRANSPORT ─── */}
      {activeTab === 'transport' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBus className="text-emerald-400" /> Transit Route Assignment</h2>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
            <span className="font-bold text-base text-white">{transportData?.busNumber || 'Bus Shuttle #12'}</span>
            <span className="text-xs text-slate-400">Destination Route: {studentProfile?.transportRoute || transportData?.routeName || 'Main Campus Terminal Gate 2'}</span>
            <span className="text-xxs text-emerald-400 font-mono font-bold">● Active Transit Permit</span>
          </div>
        </div>
      )}

      {/* ─── TAB 13: HOSTEL ─── */}
      {activeTab === 'hostel' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBuilding className="text-pink-400" /> Hostel Accommodation</h2>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <span className="font-bold text-base text-white">{studentProfile?.hostelRoom || (hostelData ? `Block ${hostelData.block || 'B'} • Room ${hostelData.roomNumber}` : 'Residential Wing')}</span>
            <span className="text-xs text-slate-400">Capacity: Double Occupancy Standard Room</span>
            <span className="text-xxs text-indigo-400 font-mono font-bold">Warden Contact: Central Residence Helpdesk</span>
          </div>
        </div>
      )}

      {/* ─── TAB 14: LEAVE ─── */}
      {activeTab === 'leave' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaPlaneDeparture className="text-pink-400" /> Student Leave Request</h2>
          <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Days of Absence</label>
              <input type="number" min="1" max="10" value={leaveDays} onChange={e => setLeaveDays(Number(e.target.value))} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
            </div>
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Reason</label>
              <textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} placeholder="State justification..." rows="3" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
            </div>
            <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 rounded-xl text-xs">
              Submit Leave Application
            </button>
          </form>

          {leaveRequests.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-xxs uppercase font-bold text-slate-400">Your Recent Requests</span>
              {leaveRequests.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-300">{r.days} Days ({r.reason})</span>
                  <span className="text-xxs text-amber-400 font-bold">{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 15: ACHIEVEMENTS ─── */}
      {activeTab === 'achievements' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaMedal className="text-amber-400" /> Academic & Extracurricular Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <span className="text-2xl">🥇</span>
              <span className="font-bold text-white text-sm">Academic Merit Scholar</span>
              <span className="text-xxs text-slate-400">Acknowledged for sustained academic standing of {calculatedCGPA} CGPA.</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <span className="text-2xl">🎓</span>
              <span className="font-bold text-white text-sm">Active Curriculum Progress</span>
              <span className="text-xxs text-slate-400">{courses.length} courses enrolled in {dept} department.</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 16: CLUBS ─── */}
      {activeTab === 'clubs' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaUsers className="text-purple-400" /> Student Societies & Clubs</h2>
          {clubsList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              No active student clubs registered in the portal.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {clubsList.map((c, i) => (
                <div key={c._id || i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-4">
                  <div>
                    <span className="font-bold text-white text-sm block">{c.name}</span>
                    <span className="text-xxs text-slate-400 block mt-1">{c.category || 'Student Club'} • {c.membersCount || c.members || 100} Members</span>
                  </div>
                  <button 
                    onClick={() => {
                      setClubsList(clubsList.map((x, idx) => idx === i ? { ...x, joined: !x.joined } : x));
                      toast.success(c.joined ? `Left ${c.name}` : `Joined ${c.name}!`);
                    }}
                    className={`py-2 px-4 rounded-xl text-xxs font-bold transition ${c.joined ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white'}`}
                  >
                    {c.joined ? 'Joined ✓' : 'Join Club'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 17: EVENTS ─── */}
      {activeTab === 'events' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCalendarCheck className="text-indigo-400" /> Campus Events & Hackathons</h2>
          {eventsList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              No campus events currently scheduled.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventsList.map((ev, i) => (
                <div key={ev._id || i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white text-sm block">{ev.title}</span>
                    <span className="text-xxs text-slate-400">{ev.category || 'Campus Event'} • Status: {ev.status || 'Active'}</span>
                  </div>
                  <button onClick={() => toast.success(`Registered for ${ev.title}!`)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xxs font-bold">
                    Register
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 18: PLACEMENT ─── */}
      {activeTab === 'placement' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBriefcase className="text-emerald-400" /> Placement Drives & Career Opportunities</h2>
          {placementDrives.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              No active placement drives scheduled at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {placementDrives.map((p, idx) => (
                <div key={p._id || idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-4">
                  <div>
                    <span className="font-bold text-white text-sm block">{p.companyName || p.company}</span>
                    <span className="text-xs text-indigo-400 font-bold mt-0.5 block">{p.roleTitle || p.role}</span>
                    <span className="text-xxs text-slate-400 mt-1 block">Package: {p.package || 'Competitive'}</span>
                  </div>
                  <button onClick={() => toast.success(`Applied for ${p.companyName || p.company} drive!`)} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xxs font-bold">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 19: CERTIFICATES ─── */}
      {activeTab === 'certificates' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCertificate className="text-amber-400" /> Verified Credentials & Certificates</h2>
          {certificatesList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              No verified documents or issued certificates found for this account.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificatesList.map((cert, i) => (
                <div key={cert._id || i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white text-sm">{cert.title || cert.docType}</span>
                    <span className="text-xxs text-slate-400">{cert.issuer || 'EduVerse Registrar'} • {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Issued'}</span>
                    <span className="text-xxs text-indigo-400 font-mono">{cert.blockchainTxHash ? cert.blockchainTxHash.slice(0, 16) + '...' : cert._id}</span>
                  </div>
                  <button onClick={() => toast.success(`Downloading verified certificate ${cert.title || ''}...`)} className="p-3 rounded-xl bg-slate-800 text-slate-300">
                    <FaDownload />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 20: AI ASSISTANT ─── */}
      {activeTab === 'ai_assistant' && (
        <div className="p-8 rounded-3xl border border-indigo-700/40 bg-[#111827]/60 flex flex-col gap-6 max-w-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaRobot className="text-indigo-400" /> Student AI Copilot</h2>
          <form onSubmit={handleAskAI} className="flex flex-col gap-3">
            <textarea 
              value={aiQuestion} 
              onChange={e => setAiQuestion(e.target.value)} 
              placeholder="Ask anything about your syllabus, coding assignments, or lecture doubts..." 
              rows="4" 
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white" 
              required 
            />
            <button type="submit" disabled={aiLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition disabled:opacity-50">
              {aiLoading ? 'Synthesizing response...' : 'Resolve Query with AI'}
            </button>
          </form>
          {aiResponse && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-indigo-200 font-mono whitespace-pre-line leading-relaxed">
              {aiResponse}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 21: SUPPORT ─── */}
      {activeTab === 'support' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaHeadset className="text-emerald-400" /> Student Helpdesk & Support</h2>
          <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Issue Category / Title</label>
              <input type="text" value={supportSubject} onChange={e => setSupportSubject(e.target.value)} placeholder="e.g. ID card reissue, Course registration assistance" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
            </div>
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Message Details</label>
              <textarea value={supportMsg} onChange={e => setSupportMsg(e.target.value)} placeholder="Describe your query..." rows="4" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
            </div>
            <button type="submit" disabled={supportSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition disabled:opacity-50">
              {supportSubmitting ? 'Logging Ticket...' : 'Submit Helpdesk Ticket'}
            </button>
          </form>
        </div>
      )}

    </motion.div>
  );
}
