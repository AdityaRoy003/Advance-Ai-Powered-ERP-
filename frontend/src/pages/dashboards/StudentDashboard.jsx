import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { CoursesAPI, TimetableAPI, AttendanceAPI, HostelAPI, TransportAPI, PlacementAPI, LibraryAPI } from '../../services/api';
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
  // overview | profile | courses | attendance | assignments | exams | results | timetable | study_material | library | fees | transport | hostel | leave | achievements | clubs | events | placement | certificates | ai_assistant | support

  // Real Database States
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ percentage: 0, total: 0, attended: 0 });
  const [hostelData, setHostelData] = useState(null);
  const [transportData, setTransportData] = useState(null);
  const [placementDrives, setPlacementDrives] = useState([]);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Student specific mock/local dynamic entries
  const [assignments, setAssignments] = useState([
    { id: 'as-1', title: 'Data Structures Lab 4: AVL Trees', subject: 'Data Structures', deadline: '2026-09-08', status: 'Pending', marks: 50 },
    { id: 'as-2', title: 'DBMS ER-Diagram & Relational Normalization', subject: 'Database Systems', deadline: '2026-09-12', status: 'Submitted', marks: 50 }
  ]);

  const [examsList, setExamsList] = useState([
    { id: 'ex-1', title: 'Mid-Term Theory Examination', date: '2026-09-20', time: '10:00 AM - 01:00 PM', room: 'LH-301', subject: 'Data Structures & Algorithms' },
    { id: 'ex-2', title: 'DBMS Practical Lab Assessment', date: '2026-09-24', time: '02:00 PM - 05:00 PM', room: 'Lab 3', subject: 'Database Management Systems' }
  ]);

  const [resultsList, setResultsList] = useState([
    { semester: 'Semester 1', gpa: '3.82', credits: 24, status: 'Passed (Distinction)' },
    { semester: 'Semester 2', gpa: '3.88', credits: 24, status: 'Passed (Distinction)' },
    { semester: 'Semester 3', gpa: '3.92', credits: 24, status: 'Passed (Distinction)' }
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 'ann-1', title: 'University Hackathon 2026 Registrations Open', date: 'Today', priority: 'High', author: 'Dean of Student Affairs' },
    { id: 'ann-2', title: 'Library extended weekend hours during midterm week', date: 'Yesterday', priority: 'Normal', author: 'Chief Librarian' }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);

  const [clubsList, setClubsList] = useState([
    { name: 'Google Developer Student Club (GDSC)', members: 180, category: 'Technology', joined: true },
    { name: 'Robotics & Autonomous Systems Club', members: 120, category: 'Hardware/AI', joined: false },
    { name: 'Literary & Debating Society', members: 95, category: 'Cultural', joined: true }
  ]);

  const [eventsList, setEventsList] = useState([
    { title: 'TechVerse National Hackathon', date: '2026-09-15', location: 'Main Auditorium', category: 'Competition' },
    { title: 'AI in Cloud Infrastructure Guest Keynote', date: '2026-09-18', location: 'Seminar Hall B', category: 'Academic' }
  ]);

  const [certificatesList, setCertificatesList] = useState([
    { title: 'Academic Excellence Dean List (Sem 3)', issuer: 'EduVerse Academic Council', date: 'July 2026', certId: 'EDV-CERT-9981' },
    { title: 'Full-Stack Development Certification', issuer: 'EduVerse Center for Innovation', date: 'May 2026', certId: 'EDV-CERT-8812' }
  ]);

  // AI Assistant in Student Dashboard
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Quick Support Ticket
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMsg, setSupportMsg] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const [coursesRes, timeRes, attRes, hostelRes, transRes, placeRes, libRes] = await Promise.all([
          CoursesAPI.getAll(),
          TimetableAPI.getSchedule(),
          AttendanceAPI.getSummary(),
          HostelAPI.getRooms(),
          TransportAPI.getRoutes(),
          PlacementAPI.getAll(),
          LibraryAPI.getAll()
        ]);

        if (Array.isArray(coursesRes)) setCourses(coursesRes);
        if (Array.isArray(timeRes)) setSchedule(timeRes);
        if (attRes?.overallPercentage !== undefined) {
          setAttendanceData({
            percentage: attRes.overallPercentage,
            total: attRes.totalClasses || 0,
            attended: attRes.attendedClasses || 0
          });
        }
        if (Array.isArray(hostelRes) && hostelRes.length > 0) setHostelData(hostelRes[0]);
        if (Array.isArray(transRes) && transRes.length > 0) setTransportData(transRes[0]);
        if (Array.isArray(placeRes)) setPlacementDrives(placeRes);
        if (Array.isArray(libRes)) setLibraryBooks(libRes);
      } catch (err) {
        console.warn('Student portal sync notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!aiQuestion) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiResponse(`Solution for "${aiQuestion}":\n\n1. Concept Overview: This computational problem requires structured algorithmic decomposition.\n2. Recommended Strategy: Utilize Divide and Conquer or Dynamic Programming to achieve O(N log N) complexity.\n3. Implementation Tip: Remember to handle boundary edge cases such as empty subsets.`);
      setAiLoading(false);
    }, 1000);
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveReason) return;
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

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportSubject || !supportMsg) return;
    toast.success('Support ticket logged! Reference ID: #TK-' + Math.floor(Math.random() * 90000 + 10000));
    setSupportSubject('');
    setSupportMsg('');
  };

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student' : 'Student';
  const dept = user?.department || 'Computer Science';
  const email = user?.email || 'student@eduverse.com';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="z-10 flex flex-col gap-1">
          <span className="text-white/80 font-bold uppercase tracking-widest text-xxs">Student Academic Hub</span>
          <h1 className="text-3xl font-black tracking-tight">Welcome, {name}</h1>
          <p className="opacity-95 text-xs">{dept} Department • B.Tech CSE • ID: {email}</p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <div className="bg-white/15 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20 text-center font-mono">
            <span className="text-xxs uppercase tracking-wider block opacity-80">Overall CGPA</span>
            <span className="text-xl font-black">3.92 / 4.0</span>
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
              { label: 'Pending Tasks', val: `${assignments.filter(a => a.status === 'Pending').length}`, desc: 'Due this week', color: 'text-amber-400', icon: <FaClipboardList /> },
              { label: 'Upcoming Exams', val: `${examsList.length}`, desc: 'Mid-term scheduled', color: 'text-purple-400', icon: <FaFileSignature /> }
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
                            <span className="text-xxs text-slate-400">Room: {slot.room} • Faculty: {slot.teacherName}</span>
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
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><FaTrophy className="text-amber-400" /> Academic Performance & GPA Growth</h2>
                  <button onClick={() => setActiveTab('results')} className="text-xxs text-indigo-400 hover:underline">View All Semesters →</button>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono">
                  {resultsList.map((res, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 text-center">
                      <span className="text-xxs text-slate-400 font-sans">{res.semester}</span>
                      <span className="text-xl font-black text-indigo-400">{res.gpa}</span>
                      <span className="text-xxs text-emerald-400 font-sans">{res.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 3: Upcoming Deadlines */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><FaClipboardList className="text-purple-400" /> Upcoming Deadlines & Submission Dates</h2>
                  <button onClick={() => setActiveTab('assignments')} className="text-xxs text-indigo-400 hover:underline">View Assignments →</button>
                </div>

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
              </div>
            </div>

            {/* Right Col (4 cols): Announcements, Transport, Hostel & AI Assistant */}
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
                <h2 className="text-sm font-bold text-white flex items-center gap-2"><FaBullhorn className="text-amber-400" /> Announcements</h2>
                <div className="flex flex-col gap-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                      <span className="font-bold text-white text-xs">{ann.title}</span>
                      <span className="text-xxs text-slate-400">{ann.author} • {ann.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport & Hostel Status Widget */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 shadow-sm flex flex-col gap-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2"><FaBus className="text-emerald-400" /> Transit & Accommodation</h2>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xxs text-slate-400 block font-sans">Transport Bus</span>
                    <span className="font-bold text-white text-xs">{transportData?.busNumber || 'Route Active (Bus #12)'}</span>
                  </div>
                  <span className="text-xxs font-bold text-emerald-400 font-mono">In Transit</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xxs text-slate-400 block font-sans">Hostel Residency</span>
                    <span className="font-bold text-white text-xs">{hostelData?.roomNumber ? `Room ${hostelData.roomNumber}` : 'Block B • Room 402'}</span>
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
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xxs">
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
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaUser className="text-indigo-400" /> Student Profile Data</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
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
              <span className="text-xxs text-slate-400 uppercase font-bold block">Program</span>
              <span className="font-bold text-white text-sm mt-1 block">B.Tech Computer Science</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: COURSES ─── */}
      {activeTab === 'courses' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBookOpen className="text-indigo-400" /> Registered Course Catalog</h2>
          {courses.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">No courses registered yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {courses.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xxs font-mono text-indigo-400 font-bold">{c.code}</span>
                  <span className="font-bold text-white text-sm">{c.title || c.name}</span>
                  <span className="text-xxs text-slate-400">{c.department} • {c.credits || 3} Credits</span>
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
          <p className="text-slate-400 text-xs">Total sessions logged: {attendanceData.total} ({attendanceData.attended} Attended)</p>
        </div>
      )}

      {/* ─── TAB 5: ASSIGNMENTS ─── */}
      {activeTab === 'assignments' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaClipboardList className="text-purple-400" /> Course Assignments</h2>
          <div className="flex flex-col gap-3">
            {assignments.map(a => (
              <div key={a.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-xs block">{a.title}</span>
                  <span className="text-xxs text-slate-400">{a.subject} • Deadline: {a.deadline} • Max Marks: {a.marks}</span>
                </div>
                <button onClick={() => toast.success(`Assignment submitted for ${a.title}!`)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xxs font-bold">
                  Submit Solution
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 6: EXAMS ─── */}
      {activeTab === 'exams' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaFileSignature className="text-indigo-400" /> Examination Schedule</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {examsList.map(e => (
              <div key={e.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                <span className="text-xxs font-mono text-purple-400 font-bold">{e.time} • Room {e.room}</span>
                <span className="font-bold text-white text-sm">{e.title}</span>
                <span className="text-xxs text-slate-400">{e.subject} • Date: {e.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 7: RESULTS ─── */}
      {activeTab === 'results' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaTrophy className="text-amber-400" /> Transcript & Semester Grade Cards</h2>
          <div className="flex flex-col gap-3">
            {resultsList.map((res, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-sm block">{res.semester}</span>
                  <span className="text-xxs text-slate-400">Total Credits Earned: {res.credits}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base font-black text-indigo-400 font-mono">GPA: {res.gpa}</span>
                  <button onClick={() => toast.success(`Downloading official transcript for ${res.semester}...`)} className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    <FaDownload />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xxs font-mono text-indigo-400 font-bold">{slot.day} • {slot.startTime} - {slot.endTime}</span>
                  <span className="font-bold text-white text-sm">{slot.subjectTitle || slot.courseCode}</span>
                  <span className="text-xxs text-slate-400">Room: {slot.room} • Faculty: {slot.teacherName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 9: STUDY MATERIAL ─── */}
      {activeTab === 'study_material' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaFileAlt className="text-teal-400" /> Notes & Lecture Materials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Unit 1: Advanced Data Structures.pdf', 'Unit 2: Relational Query Optimization.pptx', 'Unit 3: Distributed Concurrency Control.pdf'].map((doc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="font-bold text-white text-xs">{doc}</span>
                <button onClick={() => toast.success(`Downloading ${doc}...`)} className="p-2 rounded-lg bg-teal-600/20 text-teal-400 font-bold text-xxs flex items-center gap-1">
                  <FaDownload /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 10: LIBRARY ─── */}
      {activeTab === 'library' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBook className="text-indigo-400" /> University Digital & Physical Library</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {libraryBooks.slice(0, 6).map((b, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                <span className="font-bold text-white text-xs">{b.title}</span>
                <span className="text-xxs text-slate-400">Author: {b.author} • ISBN: {b.isbn}</span>
                <span className="text-xxs font-bold text-emerald-400 font-mono">Available: {b.available} copies</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 11: FEES ─── */}
      {activeTab === 'fees' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCreditCard className="text-amber-400" /> Student Fee Account</h2>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-xxs text-slate-400 uppercase font-bold block">Semester Tuition Due</span>
              <span className="text-2xl font-black text-white font-mono mt-1 block">₹0.00</span>
              <span className="text-xxs text-emerald-400 font-bold">✓ Account In Good Standing</span>
            </div>
            <button onClick={() => toast.success('Fee receipt downloaded!')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <FaDownload /> Receipt
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 12: TRANSPORT ─── */}
      {activeTab === 'transport' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBus className="text-emerald-400" /> Transit Route Assignment</h2>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
            <span className="font-bold text-base text-white">{transportData?.busNumber || 'Bus Shuttle #12'}</span>
            <span className="text-xs text-slate-400">Destination Terminal: {transportData?.routeName || 'Main Campus Terminal Gate 2'}</span>
            <span className="text-xxs text-emerald-400 font-mono font-bold">● Active Route Transit</span>
          </div>
        </div>
      )}

      {/* ─── TAB 13: HOSTEL ─── */}
      {activeTab === 'hostel' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6 max-w-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBuilding className="text-pink-400" /> Hostel Accommodation</h2>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <span className="font-bold text-base text-white">{hostelData?.roomNumber ? `Room ${hostelData.roomNumber}` : 'Block B • Room 402'}</span>
            <span className="text-xs text-slate-400">Capacity: Double Occupancy Standard</span>
            <span className="text-xxs text-indigo-400 font-mono font-bold">Warden Contact: Block B Reception (ext 9021)</span>
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
              <span className="font-bold text-white text-sm">1st Place — Smart City AI Hackathon 2026</span>
              <span className="text-xxs text-slate-400">Awarded for real-time sensor synchronization architecture.</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <span className="text-2xl">🏅</span>
              <span className="font-bold text-white text-sm">Dean Merit Scholar Award</span>
              <span className="text-xxs text-slate-400">Awarded for consistent 3.9+ GPA standing.</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 16: CLUBS ─── */}
      {activeTab === 'clubs' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaUsers className="text-purple-400" /> Student Societies & Clubs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {clubsList.map((c, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-4">
                <div>
                  <span className="font-bold text-white text-sm block">{c.name}</span>
                  <span className="text-xxs text-slate-400 block mt-1">{c.category} • {c.members} Members</span>
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
        </div>
      )}

      {/* ─── TAB 17: EVENTS ─── */}
      {activeTab === 'events' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCalendarCheck className="text-indigo-400" /> University Campus Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventsList.map((ev, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-sm block">{ev.title}</span>
                  <span className="text-xxs text-slate-400">{ev.location} • Date: {ev.date}</span>
                </div>
                <button onClick={() => toast.success(`Registered for ${ev.title}!`)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xxs font-bold">
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 18: PLACEMENT ─── */}
      {activeTab === 'placement' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBriefcase className="text-emerald-400" /> Placement Drives & Career Opportunities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {placementDrives.length === 0 ? (
              <div className="p-8 text-center text-slate-500 col-span-3 border border-dashed border-slate-800 rounded-2xl">
                No active placement drives scheduled at this time.
              </div>
            ) : (
              placementDrives.map((p, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-4">
                  <div>
                    <span className="font-bold text-white text-sm block">{p.companyName || p.company}</span>
                    <span className="text-xs text-indigo-400 font-bold mt-0.5 block">{p.roleTitle || p.role}</span>
                    <span className="text-xxs text-slate-400 mt-1 block">Package: {p.package || '₹12-18 LPA'}</span>
                  </div>
                  <button onClick={() => toast.success(`Applied for ${p.companyName || p.company} drive!`)} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xxs font-bold">
                    Apply Now
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 19: CERTIFICATES ─── */}
      {activeTab === 'certificates' && (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCertificate className="text-amber-400" /> Verified Credentials & Certificates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificatesList.map((cert, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white text-sm">{cert.title}</span>
                  <span className="text-xxs text-slate-400">{cert.issuer} • Issued {cert.date}</span>
                  <span className="text-xxs text-indigo-400 font-mono">{cert.certId}</span>
                </div>
                <button onClick={() => toast.success(`Downloading verified certificate ${cert.certId}...`)} className="p-3 rounded-xl bg-slate-800 text-slate-300">
                  <FaDownload />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 20: AI ASSISTANT & SUPPORT ─── */}
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
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs">
              {aiLoading ? 'Synthesizing...' : 'Resolve Query with AI'}
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
              <label className="text-xxs uppercase font-bold text-slate-400">Issue Category</label>
              <input type="text" value={supportSubject} onChange={e => setSupportSubject(e.target.value)} placeholder="e.g. ID card reissue, Hostel lock repair" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
            </div>
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Message</label>
              <textarea value={supportMsg} onChange={e => setSupportMsg(e.target.value)} placeholder="Describe your query..." rows="4" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs">
              Submit Helpdesk Ticket
            </button>
          </form>
        </div>
      )}

    </motion.div>
  );
}
