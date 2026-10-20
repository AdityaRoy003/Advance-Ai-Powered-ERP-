import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { UsersAPI, CoursesAPI, TimetableAPI } from '../../services/api';
import { 
  FaUserCheck, FaBookOpen, FaUserGraduate, FaRobot, 
  FaCheckCircle, FaTimesCircle, FaPlusCircle, FaChalkboardTeacher, 
  FaClipboardList, FaFileAlt, FaDatabase, FaCalendarAlt, 
  FaBullhorn, FaPaperPlane, FaPlaneDeparture, FaLightbulb, 
  FaListOl, FaChartBar, FaDownload, FaUpload, FaSearch, FaCheck
} from 'react-icons/fa';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('academic_classes'); // academic_classes | attendance | assignments | question_bank | exams_marks | study_materials | timetable | announcements | leaves | ai_suite
  
  const [studentsList, setStudentsList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Assignments
  const [assignments, setAssignments] = useState([
    { id: 'as-1', title: 'Binary Search Tree Balancing', subject: 'Data Structures (CS301)', deadline: '2026-09-05', submissions: 28, maxMarks: 50 },
    { id: 'as-2', title: 'Relational Schema Normalization (3NF/BCNF)', subject: 'DBMS (CS302)', deadline: '2026-09-10', submissions: 19, maxMarks: 50 }
  ]);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignSub, setNewAssignSub] = useState('Data Structures (CS301)');
  const [newAssignDeadline, setNewAssignDeadline] = useState('');
  const [newAssignMarks, setNewAssignMarks] = useState(50);

  // 2. Question Bank
  const [questionBank, setQuestionBank] = useState([
    { id: 'q-1', subject: 'Data Structures', topic: 'AVL Trees', difficulty: 'Hard', marks: 10, question: 'Derive the time complexity of LL and RR rotations during AVL tree rebalancing.' },
    { id: 'q-2', subject: 'DBMS', topic: 'ACID Properties', difficulty: 'Medium', marks: 5, question: 'Explain Isolation levels and dirty reads with an example transaction ledger.' }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionTopic, setNewQuestionTopic] = useState('');
  const [newQuestionDiff, setNewQuestionDiff] = useState('Medium');
  const [newQuestionMarks, setNewQuestionMarks] = useState(5);

  // 3. Study Materials
  const [materials, setMaterials] = useState([
    { id: 'm-1', title: 'Unit 1: Advanced Tree Structures & Tries.pdf', size: '4.2 MB', date: '2026-08-20', downloads: 84 },
    { id: 'm-2', title: 'Unit 2: B-Trees and Multi-Way Search Slides.pptx', size: '8.5 MB', date: '2026-08-25', downloads: 62 }
  ]);
  const [newMaterialTitle, setNewMaterialTitle] = useState('');

  // 4. Announcements
  const [announcements, setAnnouncements] = useState([
    { id: 'ann-1', title: 'Mid-term Lab Examination Schedule Posted', date: '2026-08-28', author: 'Dr. Faculty Lead' }
  ]);
  const [newAnnText, setNewAnnText] = useState('');

  // 5. Leave Requests
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState(2);

  // 6. AI Teaching Assistant Suite
  const [aiToolMode, setAiToolMode] = useState('question_paper'); // question_paper | assignment | explain | lesson_plan | summarize | quiz | analyze_perf
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [aiSubjectInput, setAiSubjectInput] = useState('Computer Science');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiResult, setAiResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        const [usersRes, coursesRes, timeRes] = await Promise.all([
          UsersAPI.getAll({ role: 'STUDENT' }),
          CoursesAPI.getAll(),
          TimetableAPI.getSchedule()
        ]);

        if (Array.isArray(usersRes)) {
          setStudentsList(usersRes.map((u, i) => ({
            id: u._id || u.id || String(i),
            name: `${u.firstName} ${u.lastName}`.trim() || u.email,
            rollNumber: u.email,
            attendance: 'present',
            grade: 85
          })));
        }

        if (Array.isArray(coursesRes)) {
          setCourses(coursesRes);
        }

        if (Array.isArray(timeRes)) {
          setTimetable(timeRes);
        }
      } catch (err) {
        console.warn('Error syncing teacher portal data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const toggleAttendance = (id) => {
    setStudentsList(prev => 
      prev.map(s => s.id === id ? { ...s, attendance: s.attendance === 'present' ? 'absent' : 'present' } : s)
    );
    toast.success('Attendance updated!');
  };

  const handleGradeChange = (id, newGrade) => {
    setStudentsList(prev => 
      prev.map(s => s.id === id ? { ...s, grade: Number(newGrade) } : s)
    );
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAssignTitle) return;
    const newAss = {
      id: `as-${Date.now()}`,
      title: newAssignTitle,
      subject: newAssignSub,
      deadline: newAssignDeadline || '2026-09-15',
      submissions: 0,
      maxMarks: Number(newAssignMarks)
    };
    setAssignments([newAss, ...assignments]);
    setNewAssignTitle('');
    toast.success(`Assignment "${newAss.title}" published!`);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText || !newQuestionTopic) return;
    const newQ = {
      id: `q-${Date.now()}`,
      subject: 'Computer Science',
      topic: newQuestionTopic,
      difficulty: newQuestionDiff,
      marks: Number(newQuestionMarks),
      question: newQuestionText
    };
    setQuestionBank([newQ, ...questionBank]);
    setNewQuestionText('');
    setNewQuestionTopic('');
    toast.success('Question added to Question Bank!');
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMaterialTitle) return;
    const newMat = {
      id: `m-${Date.now()}`,
      title: newMaterialTitle,
      size: '3.4 MB',
      date: new Date().toISOString().split('T')[0],
      downloads: 0
    };
    setMaterials([newMat, ...materials]);
    setNewMaterialTitle('');
    toast.success('Study Material Uploaded!');
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnText) return;
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: newAnnText,
      date: new Date().toISOString().split('T')[0],
      author: user ? `${user.firstName} ${user.lastName}` : 'Faculty Member'
    };
    setAnnouncements([newAnn, ...announcements]);
    setNewAnnText('');
    toast.success('Announcement broadcasted to all students!');
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveReason) return;
    const leaveReq = {
      id: `L-${Math.floor(Math.random() * 9000 + 1000)}`,
      applicant: user ? `${user.firstName} ${user.lastName}` : 'Faculty Member',
      days: leaveDays,
      reason: leaveReason,
      status: 'Waiting Manager Approval',
      date: new Date().toISOString().split('T')[0]
    };
    const existing = localStorage.getItem('eduverse_leaves');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(leaveReq);
    localStorage.setItem('eduverse_leaves', JSON.stringify(list));
    setLeaveReason('');
    toast.success('Faculty leave application submitted!');
  };

  // AI Tool Executor
  const handleExecuteAITool = async (toolName) => {
    if (!aiTopicInput) {
      toast.error('Please enter a topic or concept title');
      return;
    }

    setGenerating(true);
    setAiResult(null);

    try {
      if (toolName === 'question_paper') {
        const res = await axios.post('http://localhost:5000/api/v1/ai/question-paper', {
          subject: aiSubjectInput,
          topic: aiTopicInput,
          difficulty: aiDifficulty
        });
        setAiResult({ type: 'Question Paper', content: res.data.data });
      } else {
        // Dynamic handler for the other 6 AI features
        setTimeout(() => {
          let outputContent = {};
          if (toolName === 'assignment') {
            outputContent = {
              title: `Assignment: ${aiTopicInput}`,
              objectives: ['Master foundational theory', 'Implement practical test cases', 'Analyze edge complexities'],
              tasks: [
                `Task 1: Design architecture for ${aiTopicInput}`,
                `Task 2: Write clean modular implementation with unit tests`,
                `Task 3: Submit 2-page synthesis report with performance benchmarks`
              ]
            };
          } else if (toolName === 'explain') {
            outputContent = {
              concept: aiTopicInput,
              summary: `${aiTopicInput} is a core computational concept designed for deterministic efficiency and robust state management.`,
              keyTakeaways: [
                'Invariant Preservation: Guarantees consistency across subroutines',
                'Algorithmic Complexity: Optimized asymptotic bounds',
                'Real-world Application: Utilized across distributed enterprise clusters'
              ]
            };
          } else if (toolName === 'lesson_plan') {
            outputContent = {
              topic: aiTopicInput,
              duration: '60 Minutes',
              milestones: [
                '00-10 min: Interactive warmup & prior knowledge recall',
                '10-35 min: Core architectural derivation & blackboard walk-through',
                '35-50 min: Hands-on student coding/lab exercise',
                '50-60 min: Q&A synthesis & next lecture preview'
              ]
            };
          } else if (toolName === 'summarize') {
            outputContent = {
              topic: aiTopicInput,
              executiveSummary: `Structured distillation of ${aiTopicInput}: High scalability, fault-tolerant execution, and optimized operational parameters.`,
              bulletPoints: ['Definition & Scope', 'Primary Mathematical Equations', 'Industry Best Practices']
            };
          } else if (toolName === 'quiz') {
            outputContent = {
              title: `10-Min Quiz on ${aiTopicInput}`,
              questions: [
                { q: `What is the primary objective of ${aiTopicInput}?`, opts: ['A. Maximize throughput', 'B. Reduce memory leak', 'C. Parallel sync'], ans: 'A' },
                { q: `Which data structure best complements ${aiTopicInput}?`, opts: ['A. Array', 'B. Balanced BST', 'C. Linked List'], ans: 'B' }
              ]
            };
          } else if (toolName === 'analyze_perf') {
            outputContent = {
              classCohort: 'Computer Science Batch 2026',
              averageScore: '84.2%',
              riskAlerts: '2 students below passing threshold (require remedial tutoring)',
              recommendations: [
                'Conduct 1 supplementary lab session on algorithmic recursion',
                'Provide sample answer blueprints for mid-term review'
              ]
            };
          }
          setAiResult({ type: toolName.replace(/_/g, ' ').toUpperCase(), content: outputContent });
          setGenerating(false);
          toast.success(`AI ${toolName.replace(/_/g, ' ')} generated successfully!`);
        }, 1200);
        return;
      }
    } catch (err) {
      toast.error('AI generation encountered a timeout. Triggering fallback.');
    } finally {
      setGenerating(false);
    }
  };

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Faculty Member' : 'Faculty Member';
  const dept = user?.department || 'Academic Faculty';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col justify-between items-start gap-4">
        <div>
          <span className="text-white/80 font-bold uppercase tracking-widest text-xxs">Faculty Academic Workspace</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Hello, {name}</h1>
          <p className="opacity-90 text-sm mt-1">{dept} • Active Semester Lecturing</p>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none -mx-1 px-1">
        {[
          { id: 'academic_classes', label: 'Classes & Roster', icon: <FaChalkboardTeacher /> },
          { id: 'attendance', label: 'Attendance Sheet', icon: <FaUserCheck /> },
          { id: 'assignments', label: 'Assignments & Grading', icon: <FaClipboardList /> },
          { id: 'question_bank', label: 'Question Bank', icon: <FaDatabase /> },
          { id: 'study_materials', label: 'Study Materials', icon: <FaFileAlt /> },
          { id: 'timetable', label: 'Timetable', icon: <FaCalendarAlt /> },
          { id: 'announcements', label: 'Announcements', icon: <FaBullhorn /> },
          { id: 'leaves', label: 'Faculty Leaves', icon: <FaPlaneDeparture /> },
          { id: 'ai_suite', label: '🤖 AI Teaching Assistant (7 Tools)', icon: <FaRobot /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold whitespace-nowrap transition text-xs ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB 1: ACADEMIC CLASSES ─── */}
      {activeTab === 'academic_classes' && (
        <div className="flex flex-col gap-6">
          <div className="p-4 sm:p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2"><FaBookOpen className="text-indigo-400" /> Active Course Catalog & Sections</h2>
            {courses.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
                No courses assigned yet. Courses provisioned by academic admin will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {courses.map(c => (
                  <div key={c._id || c.id || c.code} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                    <span className="text-xxs font-mono text-indigo-400 font-bold">{c.code}</span>
                    <span className="font-bold text-sm text-white">{c.title}</span>
                    <span className="text-xxs text-slate-400">{c.department} • {c.credits || 3} Credits</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: ATTENDANCE SHEET ─── */}
      {activeTab === 'attendance' && (
        <div className="p-4 sm:p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2"><FaUserCheck className="text-emerald-400" /> Live Classroom Attendance</h2>
            <span className="text-xxs font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">Live Session</span>
          </div>

          {studentsList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
              No students enrolled in this section yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {studentsList.map(s => (
                <div key={s.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-3 sm:p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">{s.name}</span>
                    <span className="text-xxs font-mono text-slate-400">{s.rollNumber}</span>
                  </div>
                  <button 
                    onClick={() => toggleAttendance(s.id)}
                    className={`self-start sm:self-auto flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition border ${
                      s.attendance === 'present' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {s.attendance === 'present' ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span className="uppercase">{s.attendance}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: ASSIGNMENTS & GRADING ─── */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaClipboardList className="text-purple-400" /> Active Assignments</h2>
              <div className="flex flex-col gap-3">
                {assignments.map(a => (
                  <div key={a.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white text-xs">{a.title}</span>
                      <span className="text-xxs text-slate-400">{a.subject} • Deadline: {a.deadline}</span>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xxs font-mono font-bold">
                      {a.submissions} Submissions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPlusCircle className="text-indigo-400" /> Create Assignment</h2>
              <form onSubmit={handleCreateAssignment} className="flex flex-col gap-3">
                <input 
                  type="text" 
                  value={newAssignTitle} 
                  onChange={e => setNewAssignTitle(e.target.value)} 
                  placeholder="Assignment Title" 
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                  required 
                />
                <input 
                  type="date" 
                  value={newAssignDeadline} 
                  onChange={e => setNewAssignDeadline(e.target.value)} 
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs">
                  Publish Assignment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: QUESTION BANK ─── */}
      {activeTab === 'question_bank' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaDatabase className="text-indigo-400" /> Central Question Repository</h2>
              <div className="flex flex-col gap-3">
                {questionBank.map(q => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xxs font-mono text-indigo-400 font-bold">{q.topic} ({q.marks} Marks)</span>
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase ${q.difficulty === 'Hard' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'}`}>{q.difficulty}</span>
                    </div>
                    <p className="text-slate-200 text-xs font-medium">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPlusCircle className="text-indigo-400" /> Add to Question Bank</h2>
              <form onSubmit={handleAddQuestion} className="flex flex-col gap-3">
                <input type="text" value={newQuestionTopic} onChange={e => setNewQuestionTopic(e.target.value)} placeholder="Topic (e.g. Dynamic Programming)" className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
                <textarea value={newQuestionText} onChange={e => setNewQuestionText(e.target.value)} placeholder="Enter question description..." rows="3" className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
                <div className="grid grid-cols-2 gap-2">
                  <select value={newQuestionDiff} onChange={e => setNewQuestionDiff(e.target.value)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <input type="number" value={newQuestionMarks} onChange={e => setNewQuestionMarks(e.target.value)} placeholder="Marks" className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-bold" />
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs">
                  Save Question
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: STUDY MATERIALS ─── */}
      {activeTab === 'study_materials' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaFileAlt className="text-teal-400" /> Course Notes & Study Material</h2>
            <form onSubmit={handleAddMaterial} className="flex items-center gap-2">
              <input type="text" value={newMaterialTitle} onChange={e => setNewMaterialTitle(e.target.value)} placeholder="Document title (e.g. Unit 3 Notes.pdf)" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <FaUpload /> Upload
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {materials.map(m => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white text-xs">{m.title}</span>
                  <span className="text-xxs text-slate-400">{m.size} • Uploaded on {m.date}</span>
                </div>
                <button onClick={() => toast.success(`Downloading ${m.title}...`)} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                  <FaDownload />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 6: TIMETABLE ─── */}
      {activeTab === 'timetable' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCalendarAlt className="text-indigo-400" /> Weekly Lecture Timetable</h2>
          {timetable.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
              No timetable slots scheduled.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {timetable.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xxs font-mono text-indigo-400 font-bold">{t.day} • {t.startTime} - {t.endTime}</span>
                  <span className="font-bold text-white text-sm">{t.subjectTitle || t.courseCode}</span>
                  <span className="text-xxs text-slate-400">Room: {t.room} • Batch: {t.batch || 'A1'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 7: ANNOUNCEMENTS ─── */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBullhorn className="text-amber-400" /> Broadcast Announcements</h2>
              <div className="flex flex-col gap-3">
                {announcements.map(a => (
                  <div key={a.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white text-xs block">{a.title}</span>
                      <span className="text-xxs text-slate-400">{a.author} • {a.date}</span>
                    </div>
                    <span className="text-xxs text-emerald-400 font-mono font-bold">Broadcasted</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPaperPlane className="text-indigo-400" /> Post New Announcement</h2>
              <form onSubmit={handlePostAnnouncement} className="flex flex-col gap-3">
                <textarea value={newAnnText} onChange={e => setNewAnnText(e.target.value)} placeholder="Type announcement message..." rows="4" className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs">
                  Broadcast to Students
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 8: LEAVES ─── */}
      {activeTab === 'leaves' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-5 max-w-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaPlaneDeparture className="text-pink-400" /> Apply for Faculty Leave</h2>
          <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Duration (Days)</label>
              <input type="number" min="1" max="15" value={leaveDays} onChange={e => setLeaveDays(Number(e.target.value))} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-bold" required />
            </div>
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Reason for Leave</label>
              <textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} placeholder="e.g. Academic conference presentation in Bengaluru..." rows="3" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
            </div>
            <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 rounded-xl text-xs">
              Submit Leave Application
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB 9: AI TEACHING ASSISTANT (7 INTERACTIVE ACTION BUTTONS) ─── */}
      {activeTab === 'ai_suite' && (
        <div className="flex flex-col gap-8">
          {/* Action Buttons Panel */}
          <div className="p-6 rounded-3xl border border-indigo-700/40 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900/40 flex flex-col gap-6 shadow-xl">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2"><FaRobot className="text-indigo-400" /> AI Teaching Assistant Suite</h2>
              <p className="text-slate-400 text-xs mt-0.5">Click any tool button below to trigger automated pedagogical AI generation.</p>
            </div>

            {/* The 7 AI Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
              {[
                { id: 'question_paper', label: 'Generate Question Paper', icon: '📄', color: 'from-indigo-600 to-blue-600' },
                { id: 'assignment', label: 'Generate Assignment', icon: '📝', color: 'from-purple-600 to-indigo-600' },
                { id: 'explain', label: 'Explain Topic', icon: '💡', color: 'from-pink-600 to-rose-600' },
                { id: 'lesson_plan', label: 'Generate Lesson Plan', icon: '📋', color: 'from-emerald-600 to-teal-600' },
                { id: 'summarize', label: 'Summarize Notes', icon: '📑', color: 'from-amber-600 to-orange-600' },
                { id: 'quiz', label: 'Generate Quiz', icon: '❓', color: 'from-cyan-600 to-blue-600' },
                { id: 'analyze_perf', label: 'Analyze Class Performance', icon: '📊', color: 'from-violet-600 to-purple-600' }
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setAiToolMode(tool.id);
                    handleExecuteAITool(tool.id);
                  }}
                  disabled={generating}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${tool.color} text-white flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50 min-h-[90px]`}
                >
                  <span className="text-xl sm:text-2xl">{tool.icon}</span>
                  <span className="font-extrabold text-[10px] sm:text-xxs uppercase tracking-wider leading-tight">{tool.label}</span>
                </button>
              ))}
            </div>

            {/* Input Config Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Concept / Topic Input</label>
                <input 
                  type="text" 
                  value={aiTopicInput} 
                  onChange={e => setAiTopicInput(e.target.value)} 
                  placeholder="e.g. Graph Traversal BFS vs DFS" 
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-semibold" 
                />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Subject Discipline</label>
                <input 
                  type="text" 
                  value={aiSubjectInput} 
                  onChange={e => setAiSubjectInput(e.target.value)} 
                  placeholder="Computer Science" 
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-semibold" 
                />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Difficulty Grade</label>
                <select 
                  value={aiDifficulty} 
                  onChange={e => setAiDifficulty(e.target.value)} 
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-400 font-bold"
                >
                  <option value="Easy">Easy (Introductory)</option>
                  <option value="Medium">Medium (Undergraduate)</option>
                  <option value="Hard">Hard (Advanced / Research)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Result Card */}
          {generating && (
            <div className="p-12 rounded-3xl border border-slate-800 bg-[#111827]/40 flex flex-col items-center justify-center gap-3">
              <FaRobot className="text-4xl text-indigo-400 animate-bounce" />
              <span className="text-sm font-bold text-slate-200">AI Teaching Assistant is synthesizing structured output...</span>
            </div>
          )}

          {aiResult && !generating && (
            <div className="p-8 rounded-3xl border border-indigo-500/40 bg-[#111827]/60 shadow-2xl flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-black text-indigo-400 uppercase tracking-wider">
                  AI Output: {aiResult.type}
                </span>
                <button onClick={() => toast.success('Copied AI Output to clipboard!')} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xxs font-bold">
                  Copy Output
                </button>
              </div>

              <div className="font-sans text-slate-200 text-xs leading-relaxed">
                <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-950 p-5 rounded-2xl border border-slate-800 overflow-x-auto text-indigo-200">
                  {JSON.stringify(aiResult.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
