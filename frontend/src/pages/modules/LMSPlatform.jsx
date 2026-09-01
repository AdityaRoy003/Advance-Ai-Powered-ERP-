import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBookOpen, FaPlayCircle, FaCheckCircle, FaAward, FaBrain,
  FaFilePdf, FaQuestionCircle, FaChartLine, FaArrowRight,
  FaGraduationCap, FaSyncAlt, FaChalkboardTeacher
} from 'react-icons/fa';
import { LMSAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function LMSPlatform() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [adaptiveData, setAdaptiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // courses | adaptive

  const fetchLMS = async () => {
    setLoading(true);
    try {
      const data = await LMSAPI.getCourses();
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
        setSelectedCourse(data[0]);
        if (data[0].modules?.[0]?.lessons?.[0]) {
          setSelectedLesson(data[0].modules[0].lessons[0]);
        }
      } else {
        // Create initial comprehensive LMS Course
        const initialCourse = await LMSAPI.createCourse({
          courseCode: 'CS-401',
          title: 'Advanced Machine Learning & Distributed Systems',
          description: 'A comprehensive curriculum covering Bayesian Inference, Transformer Architectures, Distributed Consensus, and Vector RAG pipelines.',
          instructorName: 'Prof. Dr. Arjun Mehta',
          department: 'Computer Science',
          modules: [
            {
              title: 'Unit 1: Probabilistic Graphical Models & Inference',
              order: 1,
              lessons: [
                {
                  title: '1.1 Bayesian Networks & Markov Random Fields',
                  duration: '22 mins',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  content: 'In this lecture, we formulate exact probabilistic inference over directed acyclic graphs and explore junction tree algorithms.'
                },
                {
                  title: '1.2 Variational Autoencoders & Latent Variable Models',
                  duration: '28 mins',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  content: 'Deriving the Evidence Lower Bound (ELBO) and optimizing latent distributions via the reparameterization trick.'
                }
              ],
              quiz: {
                title: 'Unit 1 Mastery Quiz',
                questions: [
                  { question: 'What does the ELBO objective optimize in VAEs?', options: ['Lower bound on log likelihood', 'Exact gradient divergence', 'Cross entropy loss only'], correctAnswer: 0, explanation: 'ELBO approximates intractable posterior distributions.' }
                ]
              }
            },
            {
              title: 'Unit 2: Transformer Architectures & Attention Mechanisms',
              order: 2,
              lessons: [
                {
                  title: '2.1 Scaled Dot-Product & Multi-Head Self-Attention',
                  duration: '35 mins',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  content: 'Mathematical breakdown of Query, Key, Value tensor projections and causal masking in decoder models.'
                }
              ]
            }
          ]
        });
        setCourses([initialCourse]);
        setSelectedCourse(initialCourse);
        setSelectedLesson(initialCourse.modules[0].lessons[0]);
      }

      // Fetch Adaptive Learning Analytics
      const adaptive = await LMSAPI.getAdaptiveRecommendations('STU-1029');
      setAdaptiveData(adaptive);
    } catch (err) {
      console.error('Error fetching LMS:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLMS();
  }, []);

  const handleMarkComplete = async () => {
    if (!selectedCourse || !selectedLesson) return;
    try {
      await LMSAPI.completeLesson(selectedCourse._id, 'STU-1029', selectedLesson.title);
      toast.success(`Lesson "${selectedLesson.title}" marked completed!`);
      fetchLMS();
    } catch {
      toast.error('Failed to update progress');
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 text-xl border border-indigo-500/30">
              <FaBookOpen />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Learning Management System (LMS)
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Curriculum Modules, Video Lectures, Quizzes, Verified Certificates & Adaptive Learning Paths
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'courses' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
          >
            Course Curriculum
          </button>
          <button
            onClick={() => setActiveTab('adaptive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'adaptive' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
          >
            <FaBrain className="text-pink-400" /> Adaptive Learning Path
          </button>
        </div>
      </div>

      {activeTab === 'courses' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Lecture & Lesson Content Viewer */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="aspect-video w-full bg-black relative flex items-center justify-center border-b border-slate-800">
                <iframe
                  className="w-full h-full"
                  src={selectedLesson?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                  title="Lecture Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xxs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      {selectedCourse?.courseCode} · Lesson Lecture
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">{selectedLesson?.title}</h2>
                  </div>
                  <button
                    onClick={handleMarkComplete}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-900/30 self-start sm:self-auto"
                  >
                    <FaCheckCircle /> Mark Lesson Completed
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  {selectedLesson?.content}
                </p>
              </div>
            </div>
          </div>

          {/* Module Syllabus & Lesson Index */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase text-slate-300">Course Curriculum</span>
                <span className="text-xxs font-mono text-indigo-400 font-bold">{selectedCourse?.courseCode}</span>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {selectedCourse?.modules?.map((mod, mIdx) => (
                  <div key={mIdx} className="space-y-2">
                    <span className="text-xxs font-bold text-indigo-300 uppercase tracking-wider block">{mod.title}</span>
                    <div className="space-y-1.5">
                      {mod.lessons.map((les, lIdx) => {
                        const isSelected = selectedLesson?.title === les.title;
                        return (
                          <div
                            key={lIdx}
                            onClick={() => setSelectedLesson(les)}
                            className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition border ${isSelected ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold' : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FaPlayCircle className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                              <span className="text-xs truncate">{les.title}</span>
                            </div>
                            <span className="text-xxs font-mono text-slate-500 ml-2 flex-shrink-0">{les.duration}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Adaptive Learning Engine Diagnostic Dashboard */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Diagnostics Summary */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 text-lg"><FaBrain /></span>
                <div>
                  <h3 className="font-bold text-white text-sm">Adaptive Diagnostic Matrix</h3>
                  <p className="text-xxs text-slate-400 font-mono">Student: Rahul Sharma (STU-1029)</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-xxs uppercase font-bold text-rose-400">Identified Knowledge Gaps:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {adaptiveData?.weakTopics?.map((t, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xxs font-bold">
                        ⚠ {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xxs uppercase font-bold text-emerald-400">Strong Mastery Concepts:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {adaptiveData?.strongTopics?.map((t, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xxs font-bold">
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Remedial Learning Paths */}
            <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
                AI-Engineered Personalized Learning Roadmap
              </span>

              <div className="space-y-3">
                {adaptiveData?.recommendedPaths?.map((path, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xxs font-bold">{path.difficulty}</span>
                        <span className="text-xxs text-slate-400 font-mono">Est: {path.estimatedHours} hrs · {path.modulesCount} modules</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{path.title}</h4>
                      <p className="text-xxs text-slate-400 italic">{path.matchReason}</p>
                    </div>

                    <button
                      onClick={() => toast.success(`Enrolled in remedial module: ${path.title}`)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 flex-shrink-0"
                    >
                      Start Remedial Path <FaArrowRight className="text-xxs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
