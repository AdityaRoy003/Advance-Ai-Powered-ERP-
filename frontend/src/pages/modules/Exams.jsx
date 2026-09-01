import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaFileSignature, FaListAlt, FaFileCode, FaHourglassHalf } from 'react-icons/fa';
import { ExamsAPI } from '../../services/api';

export default function Exams() {
  const [activeExam, setActiveExam] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState('');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      try {
        const data = await ExamsAPI.getAll();
        const formatted = (data || []).map((e, idx) => ({
          id: e.id || e._id || String(idx + 1),
          title: e.title || `${e.subject || 'Academic'} Final Exam`,
          subject: e.subject || 'Computer Science',
          date: e.date || '2026-08-15',
          maxMarks: e.totalMarks || e.maxMarks || 100,
          questions: e.questions || []
        }));
        setExams(formatted);
      } catch (err) {
        console.error('Failed to load exams', err);
      } finally {
        setLoading(false);
      }
    }
    loadExams();
  }, []);

  const handleLaunchExam = (ex) => {
    if (ex.questions.length === 0) {
      toast.error('No online questions available for this exam yet.');
      return;
    }
    setActiveExam(ex);
    setCurrentQuestionIdx(0);
    setSelectedAns('');
  };

  const handleNextQuestion = () => {
    if (!selectedAns) {
      toast.error('Please select an option');
      return;
    }
    if (currentQuestionIdx < activeExam.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAns('');
    } else {
      toast.success('Online testing complete! Submitting responses to grading pipeline...');
      setActiveExam(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-black">Examination & Testing Center</h1>
        <p className="text-slate-400 text-xs mt-0.5">Access schedules, download report cards, or take online assessments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Exam scheduler */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaListAlt className="text-indigo-400" /> Exam Schedule
          </h2>

          <div className="flex flex-col gap-4">
            {exams.map((ex) => (
              <div key={ex.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex justify-between items-center gap-4 text-xs">
                <div>
                  <span className="font-extrabold text-sm block">{ex.title}</span>
                  <span className="text-xxs text-slate-400 block mt-0.5">Subject: {ex.subject} • Date: {ex.date}</span>
                  <span className="text-xxs text-slate-500 block mt-1 font-mono">Max Marks: {ex.maxMarks}</span>
                </div>
                {ex.questions.length > 0 && (
                  <button 
                    onClick={() => handleLaunchExam(ex)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xxs transition flex items-center gap-1.5"
                  >
                    <FaFileSignature /> Take Exam
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grades summary sheet */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <h2 className="text-lg font-bold">Past Academic Results</h2>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-3 font-semibold text-xs">
            {[
              { subject: 'Machine Learning', score: '88/100', grade: 'A' },
              { subject: 'Cyber Security', score: '46/50', grade: 'A+' },
              { subject: 'Database Systems', score: '19/20', grade: 'O' }
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center pb-2.5 border-b border-slate-800/80">
                <span className="text-slate-300">{r.subject}</span>
                <span className="font-bold font-mono text-indigo-400">{r.score} (Grade: {r.grade})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Online Assessment taking console overlay */}
      <AnimatePresence>
        {activeExam && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#111827] border border-slate-850 p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-indigo-400 font-extrabold text-xxs uppercase tracking-widest">{activeExam.subject}</span>
                  <h3 className="text-xl font-black text-white mt-0.5">Online Exam Console</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xxs text-amber-400 font-mono font-bold">
                  <FaHourglassHalf className="animate-spin" /> Time Remaining: 44:12
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-xxs text-slate-500 font-mono uppercase tracking-widest font-bold">Question {currentQuestionIdx + 1} of {activeExam.questions.length}</span>
                <p className="text-sm font-bold text-slate-100 leading-relaxed">
                  {activeExam.questions[currentQuestionIdx].q}
                </p>

                <div className="flex flex-col gap-2.5 mt-2">
                  {activeExam.questions[currentQuestionIdx].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAns(opt)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition ${
                        selectedAns === opt 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                          : 'border-slate-800 hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center gap-4 mt-4 border-t border-slate-800 pt-4">
                <button 
                  onClick={() => setActiveExam(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-300 transition"
                >
                  Quit Exam
                </button>
                <button 
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition text-xs"
                >
                  {currentQuestionIdx === activeExam.questions.length - 1 ? 'Finish & Submit' : 'Next Question'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
