import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMicrophone, FaMicrophoneSlash, FaTimes, FaVolumeUp, 
  FaVolumeMute, FaPaperPlane, FaBolt, FaExclamationTriangle,
  FaArrowRight, FaCheckCircle, FaCompass, FaTerminal
} from 'react-icons/fa';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';

const QUICK_PROMPTS = [
  { label: 'Show Attendance', query: 'Show today\'s attendance summary' },
  { label: 'Check Fees', query: 'Check fee status and pending dues' },
  { label: 'Open Timetable', query: 'Open my weekly timetable schedule' },
  { label: 'Report Issue', query: 'Report an issue or bug' },
  { label: 'Apply Leave', query: 'Apply for semester leave' },
  { label: 'Open LMS', query: 'Open LMS and course video lectures' },
  { label: 'Switch Theme', query: 'Toggle dark mode theme' },
  { label: 'Track Bus', query: 'Track campus transport bus' },
  { label: 'Digital Twin', query: 'Navigate to 3D Digital Campus Twin' },
  { label: 'Blockchain Vault', query: 'Open Blockchain Document Vault' }
];

export default function VoiceERPAssistantModal() {
  const {
    isOpen,
    isListening,
    transcript,
    interimTranscript,
    voiceOutput,
    isProcessing,
    isSpeaking,
    speechSupported,
    statusMessage,
    permissionError,
    closeVoiceAssistant,
    startListening,
    stopListening,
    stopSpeaking,
    speakText,
    executeVoiceCommand
  } = useVoiceAssistant();

  const [inputQuery, setInputQuery] = useState('');
  const inputRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeVoiceAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeVoiceAssistant]);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    executeVoiceCommand(inputQuery.trim());
    setInputQuery('');
  };

  const handlePromptClick = (query) => {
    executeVoiceCommand(query);
  };

  const currentDisplaySpeech = transcript || interimTranscript;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeVoiceAssistant();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-gradient-to-b from-slate-900/95 via-[#0b1120]/95 to-slate-950/95 border border-pink-500/30 rounded-3xl shadow-2xl shadow-pink-950/40 text-white overflow-hidden p-6 sm:p-8 flex flex-col gap-6"
        >
          {/* Top ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-pink-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

          {/* ─── HEADER BAR ─── */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-sm">
                  <FaMicrophone />
                </span>
                {isListening && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
                    EduVerse Voice ERP Assistant
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    Live Speech
                  </span>
                </div>
                <p className="text-xxs text-slate-400 mt-0.5">
                  Natural Language ERP Actions & Hands-free Navigation
                </p>
              </div>
            </div>

            <button
              onClick={closeVoiceAssistant}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              title="Close Voice Assistant (Esc)"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* ─── PERMISSION / COMPATIBILITY NOTICE ─── */}
          {permissionError && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5">
              <FaExclamationTriangle className="text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xxs leading-relaxed">
                <span className="font-bold block text-xs">Microphone Access Notice:</span>
                {permissionError}
              </div>
            </div>
          )}

          {!speechSupported && !permissionError && (
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xxs flex items-center gap-2">
              <FaTerminal className="text-pink-400" />
              <span>Speech recognition engine is using browser fallback. You can type commands or click phrases below.</span>
            </div>
          )}

          {/* ─── CENTRAL VOICE ORB & SOUND WAVE ─── */}
          <div className="flex flex-col items-center justify-center py-2 relative z-10">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing rings when listening */}
              {isListening && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-pink-500/20 animate-ping" />
                  <div className="absolute w-44 h-44 rounded-full border border-pink-500/30 animate-pulse" />
                </>
              )}

              {/* Central Glowing Mic Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isListening ? stopListening : startListening}
                className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-2xl transition duration-300 border-2 ${
                  isListening
                    ? 'bg-gradient-to-tr from-rose-600 to-pink-600 border-pink-300 shadow-pink-500/50 text-white'
                    : 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border-slate-700 hover:border-pink-500/60 text-slate-300 hover:text-white shadow-indigo-950/60'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to start speaking'}
              >
                {isListening ? <FaMicrophone /> : <FaMicrophoneSlash className="text-slate-400" />}
                <span className="text-[10px] font-bold tracking-widest uppercase mt-1 text-white/90">
                  {isListening ? 'Listening' : 'Tap to Speak'}
                </span>
              </motion.button>
            </div>

            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-center gap-1.5 h-8 mt-5">
              {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7, 1, 0.4].map((scale, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isListening
                      ? 'bg-gradient-to-t from-pink-500 to-rose-300 animate-pulse'
                      : isSpeaking
                      ? 'bg-indigo-400 animate-pulse'
                      : 'bg-slate-700 h-1.5'
                  }`}
                  style={{
                    height: isListening ? `${scale * 28}px` : isSpeaking ? `${scale * 20}px` : '4px',
                    animationDelay: `${i * 120}ms`
                  }}
                />
              ))}
            </div>

            {/* Status Text Indicator */}
            <span className="text-xs font-semibold text-slate-300 mt-2 text-center">
              {isProcessing ? 'Synthesizing voice command...' : statusMessage}
            </span>
          </div>

          {/* ─── LIVE TRANSCRIPTION DISPLAY ─── */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1.5 min-h-[64px] relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
              Transcript Stream
            </span>
            <div className="text-sm font-medium text-white break-words">
              {currentDisplaySpeech ? (
                <span className="text-pink-300 font-bold font-mono">
                  "{currentDisplaySpeech}"
                </span>
              ) : (
                <span className="text-slate-500 text-xs italic">
                  Say something like "Show attendance", "Open timetable", "Check fee status", or "Report an issue"...
                </span>
              )}
            </div>
          </div>

          {/* ─── ACTION EXECUTION & RESPONSE BOX ─── */}
          {voiceOutput && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/40 flex flex-col gap-2 relative z-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 text-xs">
                    <FaBolt />
                  </span>
                  <span className="text-xxs font-mono uppercase tracking-widest text-pink-400 font-bold">
                    Intent: {voiceOutput.intent}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isSpeaking ? (
                    <button
                      onClick={stopSpeaking}
                      className="text-pink-400 hover:text-pink-300 text-xs flex items-center gap-1 p-1"
                      title="Mute Speech"
                    >
                      <FaVolumeMute /> Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => speakText(voiceOutput.spokenResponse)}
                      className="text-slate-400 hover:text-white text-xs flex items-center gap-1 p-1"
                      title="Replay Audio"
                    >
                      <FaVolumeUp /> Replay
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs font-semibold text-white leading-relaxed">
                "{voiceOutput.spokenResponse}"
              </p>

              {voiceOutput.targetRoute && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xxs font-bold pt-1">
                  <FaCheckCircle />
                  <span>Action Confirmed: Navigating to {voiceOutput.targetRoute}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── QUICK SAMPLE VOICE COMMANDS ─── */}
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Quick Voice Commands (Click to test):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(p.query)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-pink-300 text-xxs font-mono transition border border-slate-800 hover:border-pink-500/40"
                >
                  "{p.label}"
                </button>
              ))}
            </div>
          </div>

          {/* ─── MANUAL TEXT INPUT FALLBACK ─── */}
          <form onSubmit={handleManualSubmit} className="flex gap-2 relative z-10 pt-2 border-t border-slate-800">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Or type voice command manually here..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isProcessing}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition flex items-center gap-1.5 text-xs disabled:opacity-50 shadow-lg shadow-pink-600/30 shrink-0"
            >
              <FaPaperPlane size={11} />
              <span>Execute</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
