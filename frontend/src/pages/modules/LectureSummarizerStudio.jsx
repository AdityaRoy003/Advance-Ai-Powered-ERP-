import React, { useState } from 'react';
import { 
  Video, Sparkles, Clock, BookOpen, Layers, Play, CheckCircle2, 
  HelpCircle, Search, Download, ChevronRight, FileText, Share2, Zap
} from 'lucide-react';
import { LectureSummarizerAPI } from '../../services/api';

const DEMO_LECTURE = {
  title: 'Distributed Systems & Byzantine Fault Tolerance',
  course: 'CS-601: Advanced Cloud Computing',
  lecturer: 'Prof. Arvind K. Swaminathan',
  duration: '52:14 min',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

export default function LectureSummarizerStudio() {
  const [videoUrl, setVideoUrl] = useState(DEMO_LECTURE.videoUrl);
  const [lectureTitle, setLectureTitle] = useState(DEMO_LECTURE.title);
  const [courseCode, setCourseCode] = useState(DEMO_LECTURE.course);
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'chapters' | 'transcript' | 'flashcards'
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedCard, setRevealedCard] = useState({});

  const handleProcess = async () => {
    setProcessing(true);
    try {
      const res = await LectureSummarizerAPI.process({
        title: lectureTitle,
        course: courseCode,
        videoUrl: videoUrl
      });
      if (res?.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to process lecture:', err);
    } finally {
      setProcessing(false);
    }
  };

  const toggleCard = (idx) => {
    setRevealedCard(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              AI Classroom Copilot v3.4
            </span>
            <span className="text-xs text-gray-400">Whisper & Gemini 1.5 Powered</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            AI Lecture Summarizer & Video Chapterizer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Automated acoustic speech-to-text, key concept extraction, video chapter markers, and student revision flashcards.
          </p>
        </div>

        {data && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-medium transition"
            >
              <Download className="w-4 h-4" />
              Export Study Guide
            </button>
          </div>
        )}
      </div>

      {/* Input / Control Ribbon */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Lecture Topic / Title</label>
            <input 
              type="text" 
              value={lectureTitle} 
              onChange={(e) => setLectureTitle(e.target.value)} 
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Course ID</label>
            <input 
              type="text" 
              value={courseCode} 
              onChange={(e) => setCourseCode(e.target.value)} 
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Classroom Video / Audio Link or MP4</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)} 
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleProcess}
                disabled={processing}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-sm disabled:opacity-50 transition"
              >
                {processing ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Generate AI Pack
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport */}
      {!data && !processing && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center shadow-sm space-y-4">
          <Video className="w-16 h-16 text-indigo-400 mx-auto opacity-70" />
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Transform Any Classroom Recording into an Interactive Study Pack
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Paste your lecture recording URL or click the button below to load an automated institutional demo analyzing 52 minutes of advanced computer science lecture.
            </p>
          </div>
          <button
            onClick={handleProcess}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-md transition"
          >
            Launch Interactive Demo Analysis
          </button>
        </div>
      )}

      {processing && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-16 text-center shadow-sm space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900 animate-ping opacity-25"></div>
            <div className="w-16 h-16 rounded-full border-4 border-t-indigo-600 border-indigo-200 dark:border-indigo-800 animate-spin"></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Neural Processing Lecture Stream...
            </h3>
            <p className="text-xs text-gray-500">
              Running acoustic diarization, generating video chapter markers, synthesizing flashcards...
            </p>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'summary' 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Executive AI Summary & Concepts
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'chapters' 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              Video Chapters ({data.chapters?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'flashcards' 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              Exam Flashcards ({data.flashcards?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'transcript' 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Interactive Transcript
            </button>
          </div>

          {/* Tab 1: Executive AI Summary */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      Comprehensive Lecture Synopsis
                    </h3>
                    <span className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md font-medium">
                      Estimated Read: 3 mins
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {data.summary?.overview}
                  </p>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Key Takeaways & Exam Highlights
                    </h4>
                    <ul className="space-y-2">
                      {data.summary?.takeaways?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Concepts Grid */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Essential Terminology & Conceptual Pillars
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.concepts?.map((c, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-1">
                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {c.term}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {c.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Info & Action Card */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Lecture Metadata
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Total Duration:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-200">{data.duration || '52:14 min'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Word Count:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-200">{data.wordCount || '6,480 words'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Speaking Cadence:</span>
                      <span className="font-semibold text-emerald-500">{data.speakingRate || '124 wpm (Optimal)'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>AI Model:</span>
                      <span className="font-semibold text-indigo-500">Whisper-Large-v3</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    Publish to Student Portal
                  </h4>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Instantly broadcast this summarized revision pack and flashcard deck to all 120 enrolled students in CS-601.
                  </p>
                  <button className="w-full py-2 bg-white text-indigo-700 font-semibold rounded-lg text-xs shadow hover:bg-indigo-50 transition">
                    Push to Course LMS Feed
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Video Chapters */}
          {activeTab === 'chapters' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.chapters?.map((ch, i) => (
                  <div 
                    key={i} 
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:border-indigo-500/50 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center gap-1">
                        <Play className="w-3 h-3 fill-current" />
                        {ch.timestamp}
                      </span>
                      <span className="text-[11px] text-gray-400">Chapter {i + 1}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {ch.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {ch.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Click on any card to flip and reveal the model answer. Great for pre-midterm preparation.
                </p>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {data.flashcards?.length} Active Study Cards
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.flashcards?.map((card, i) => {
                  const isRevealed = !!revealedCard[i];
                  return (
                    <div 
                      key={i}
                      onClick={() => toggleCard(i)}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/60 rounded-xl p-6 shadow-sm cursor-pointer min-h-[180px] flex flex-col justify-between transition-all transform hover:-translate-y-0.5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                            Card #{i + 1} • {card.category || 'Core Concept'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {isRevealed ? 'Tap to hide' : 'Tap to reveal'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {card.question}
                        </h4>
                      </div>

                      <div className={`mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 transition ${isRevealed ? 'opacity-100' : 'opacity-20 blur-[2px]'}`}>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {card.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Transcript */}
          {activeTab === 'transcript' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search inside lecture audio transcript..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {data.transcript?.length || 0} Synced Segments
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 divide-y divide-gray-100 dark:divide-gray-800">
                {data.transcript
                  ?.filter(t => !searchQuery || t.text.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((t, idx) => (
                    <div key={idx} className="pt-3 flex gap-4 text-xs">
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                        [{t.timestamp}]
                      </span>
                      <span className="font-semibold text-gray-600 dark:text-gray-300 shrink-0">
                        {t.speaker}:
                      </span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                        {t.text}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
