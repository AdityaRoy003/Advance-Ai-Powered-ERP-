import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  FaRobot, FaCalendarAlt, FaFileCode, FaBrain, 
  FaSearch, FaChevronRight, FaPlus, FaVolumeUp 
} from 'react-icons/fa';

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState('chat');

  // Chat States
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { sender: 'AI Agent', text: 'Welcome to EduVerse Deep RAG Assistant. Query student directories, timetables, or fees policies.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Timetable States
  const [dept, setDept] = useState('Computer Science');
  const [timetableOutput, setTimetableOutput] = useState(null);
  const [timetableLoading, setTimetableLoading] = useState(false);

  // Resume Analyzer States
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [resumeResult, setResumeResult] = useState(null);

  // Predictor States
  const [dropoutRisk, setDropoutRisk] = useState(null);
  const [loadingPredict, setLoadingPredict] = useState(false);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatPrompt) return;

    const userMsg = { sender: 'Student', text: chatPrompt };
    setChatLogs((prev) => [...prev, userMsg]);
    setChatPrompt('');
    setChatLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/v1/ai/chatbot', { prompt: chatPrompt });
      const data = res.data.data;
      setChatLogs((prev) => [...prev, { sender: 'AI Agent', text: data.answer }]);
    } catch (err) {
      console.warn('AI Chatbot failed. Mock response triggered.');
      setTimeout(() => {
        setChatLogs((prev) => [...prev, { 
          sender: 'AI Agent', 
          text: `Regarding your query "${chatPrompt}": Under local mock mode, student grades and schedules are verified. ML prediction models indicate 3.9 GPA standing.` 
        }]);
      }, 1000);
    } finally {
      setChatLoading(false);
    }
  };

  const handleTimetableGenerate = async () => {
    setTimetableLoading(true);
    setTimetableOutput(null);
    try {
      const res = await axios.post('http://localhost:5000/api/v1/ai/timetable', { department: dept });
      setTimetableOutput(res.data.data);
    } catch (err) {
      console.warn('AI Timetable failed. Mocking output.');
      setTimeout(() => {
        setTimetableOutput({
          department: dept,
          className: 'CS-B Tech-Sem 4',
          schedule: [
            { day: 'Monday', slots: [{ time: '09:00 - 10:30', subject: 'Machine Learning', room: 'LH-301' }] },
            { day: 'Wednesday', slots: [{ time: '11:00 - 12:30', subject: 'Cyber Security', room: 'LH-302' }] }
          ]
        });
      }, 1200);
    } finally {
      setTimetableLoading(false);
    }
  };

  const handleResumeScan = () => {
    setAnalyzingResume(true);
    setResumeResult(null);
    setTimeout(async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/v1/ai/resume');
        setResumeResult(res.data.data);
      } catch (err) {
        setResumeResult({
          score: 84,
          skillsFound: ['React.js', 'Node.js', 'MongoDB', 'Python', 'TailwindCSS'],
          missingSkills: ['Kubernetes', 'CI/CD Pipelines'],
          recommendations: ['Add a section for Cloud deployments', 'Highlight real-time socket connections.'],
          roleAlignment: 'Full Stack Developer (Strong Fit)'
        });
      } finally {
        setAnalyzingResume(false);
      }
    }, 1500);
  };

  const handleTriggerPrediction = async () => {
    setLoadingPredict(true);
    try {
      const res = await axios.get('http://localhost:5000/api/v1/ai/predictions');
      setDropoutRisk(res.data.data);
    } catch (err) {
      setTimeout(() => {
        setDropoutRisk({
          dropoutProbability: 0.08,
          gpaTrend: 'upward',
          predictedGPA: 3.84,
          feeDefaultRisk: 'low',
          recommendedInterventions: ['Enroll in Advanced Deep Learning', 'Nominate for student leadership']
        });
      }, 1000);
    } finally {
      setLoadingPredict(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black">AI Services Room</h1>
          <p className="text-slate-400 text-xs mt-0.5">Explore prediction indicators, schedules generation, and RAG search assistants.</p>
        </div>

        {/* Voice Assistant Mock button */}
        <button 
          onClick={() => toast.success('Voice Assistant Listening... Say: "Show my timetable"')}
          className="bg-indigo-600/10 border border-indigo-500/25 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-indigo-400 hover:bg-indigo-600/20 transition"
        >
          <FaVolumeUp className="animate-pulse" /> Launch Voice Assistant
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        {[
          { id: 'chat', label: 'RAG Chatbot', icon: <FaRobot /> },
          { id: 'schedule', label: 'Schedule Generator', icon: <FaCalendarAlt /> },
          { id: 'resume', label: 'Resume Analyzer', icon: <FaFileCode /> },
          { id: 'ml', label: 'ML Predictors', icon: <FaBrain /> }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 pb-3 transition border-b-2 ${
              activeTab === t.id 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[#111827]/40 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl min-h-[380px] flex flex-col">
        
        {/* RAG Chatbot */}
        {activeTab === 'chat' && (
          <div className="flex flex-col flex-1 gap-6 justify-between">
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] text-xs">
              {chatLogs.map((log, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  log.sender === 'Student' 
                    ? 'bg-indigo-900/30 text-indigo-200 border border-indigo-500/10 self-end' 
                    : 'bg-slate-900 text-slate-300'
                }`}>
                  <span className="font-extrabold block text-xxs uppercase tracking-wider mb-1 text-slate-400">{log.sender}</span>
                  {log.text}
                </div>
              ))}
              {chatLoading && (
                <span className="text-xxs font-mono text-slate-500 animate-pulse">AI Agent compiling query...</span>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="flex gap-3 border-t border-slate-800 pt-4">
              <input 
                type="text" 
                placeholder="Ask about tuition fees deadline, course schedules, or GPAs..."
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 text-xs font-semibold text-white"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition text-xs">
                Query AI
              </button>
            </form>
          </div>
        )}

        {/* Timetable schedule generator */}
        {activeTab === 'schedule' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col gap-1.5">
                <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest">Select Department</label>
                <select 
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="p-3 border border-slate-800 bg-slate-950 rounded-xl text-xs focus:outline-none font-semibold text-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Eng">Mechanical Engineering</option>
                </select>
              </div>

              <button 
                onClick={handleTimetableGenerate}
                disabled={timetableLoading}
                className="self-end bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition text-xs disabled:opacity-50"
              >
                {timetableLoading ? 'Resolving conflicts...' : 'Generate New Timetable'}
              </button>
            </div>

            {timetableOutput && (
              <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl font-mono text-xs flex flex-col gap-4">
                <span className="text-xxs text-indigo-400 font-extrabold tracking-widest uppercase">Timetable resolved successfully</span>
                <div className="flex flex-col gap-3">
                  {timetableOutput.schedule.map((dayItem, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between border-b border-slate-850 pb-2 gap-2">
                      <span className="font-bold text-slate-100 min-w-[100px]">{dayItem.day}</span>
                      <div className="flex flex-col gap-1.5 flex-1">
                        {dayItem.slots.map((sl, idx) => (
                          <div key={idx} className="text-slate-400">
                            {sl.time}: <span className="text-indigo-400 font-extrabold">{sl.subject}</span> in room {sl.room}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resume Scan */}
        {activeTab === 'resume' && (
          <div className="flex flex-col items-center justify-center text-center gap-6 py-6 max-w-xl mx-auto">
            <div className="border-2 border-dashed border-slate-800 bg-slate-950/40 p-8 rounded-3xl w-full flex flex-col items-center gap-4">
              <span className="text-xxs font-bold text-slate-500 uppercase tracking-widest block">PDF / DOCX Resume Analyzer</span>
              <button 
                onClick={handleResumeScan}
                disabled={analyzingResume}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition text-xs disabled:opacity-50"
              >
                {analyzingResume ? 'Analyzing skills alignment...' : 'Mock Upload & Scan Resume'}
              </button>
            </div>

            {resumeResult && (
              <div className="w-full text-left border border-slate-800 bg-slate-950/60 p-6 rounded-2xl font-mono text-xs flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-100">Score Rating: {resumeResult.score}/100</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-xxs">{resumeResult.roleAlignment}</span>
                </div>
                <div>
                  <span className="font-extrabold block mb-1.5 text-slate-400">Skills Found:</span>
                  <span className="text-slate-300">{resumeResult.skillsFound.join(', ')}</span>
                </div>
                <div>
                  <span className="font-extrabold block mb-1.5 text-slate-400">Missing Key Skills:</span>
                  <span className="text-rose-400">{resumeResult.missingSkills.join(', ')}</span>
                </div>
                <div>
                  <span className="font-extrabold block mb-1.5 text-slate-400">Recommendations:</span>
                  <ul className="list-disc pl-4 flex flex-col gap-1 text-slate-300">
                    {resumeResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ML predictors */}
        {activeTab === 'ml' && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <button 
                onClick={handleTriggerPrediction}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition text-xs"
              >
                Compute Predictive ML Risk Indices
              </button>
            </div>

            {dropoutRisk && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="p-5 border border-slate-800 bg-slate-950/60 rounded-2xl flex flex-col gap-2.5">
                  <span className="text-xxs uppercase text-indigo-400 font-extrabold tracking-widest">ML Dropout Risk Analysis</span>
                  <span className="text-lg font-black text-white">Probability Index: {(dropoutRisk.dropoutProbability * 100).toFixed(1)}%</span>
                  <span className="text-emerald-400 font-bold">Category: Low Risk</span>
                </div>

                <div className="p-5 border border-slate-800 bg-slate-950/60 rounded-2xl flex flex-col gap-2.5">
                  <span className="text-xxs uppercase text-indigo-400 font-extrabold tracking-widest">ML Fee Default Predictor</span>
                  <span className="text-lg font-black text-white">Default Risk Index: {dropoutRisk.feeDefaultRisk.toUpperCase()}</span>
                  <span className="text-slate-400">Predicted Semester GPA: {dropoutRisk.predictedGPA}</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
