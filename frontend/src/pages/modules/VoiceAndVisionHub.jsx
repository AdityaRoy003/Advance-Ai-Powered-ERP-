import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaMicrophone, FaEye, FaVideo, FaVolumeUp,
  FaCheckCircle, FaCar, FaQrcode, FaShieldAlt,
  FaBroadcastTower, FaTerminal, FaPlay
} from 'react-icons/fa';
import { AIEngineAPI, CampusAPI } from '../../services/api';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import toast from 'react-hot-toast';

export default function VoiceAndVisionHub() {
  const navigate = useNavigate();
  const { openVoiceAssistant, isListening: isVoiceAssistantListening, executeVoiceCommand } = useVoiceAssistant();
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('Show today\'s attendance summary');
  const [voiceOutput, setVoiceOutput] = useState(null);

  // Computer Vision State
  const [cameraActive, setCameraActive] = useState(true);
  const [cvLogs, setCvLogs] = useState([
    { time: '11:24 AM', zone: 'North Gate ANPR', event: 'Vehicle ANPR', detail: 'DL-01-AB-2026 (Authorized Faculty)', conf: '99%' },
    { time: '11:20 AM', zone: 'Lecture Hall 401', event: 'QR Attendance', detail: 'Student STU-1029 (Aarav Sharma)', conf: '98%' },
    { time: '11:15 AM', zone: 'Robotics Lab 2', event: 'Lab PPE Verified', detail: 'Safety Goggles + Coat Confirmed', conf: '96%' }
  ]);

  const handleExecuteVoice = async (transcriptText) => {
    const text = transcriptText || voiceQuery;
    try {
      const res = await AIEngineAPI.sendVoiceCommand(text);
      setVoiceOutput(res);
      toast.success(`Voice Command Recognized: ${res.intent}`);

      // Web Speech Synthesis (Text-to-Speech)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(res.spokenResponse);
        window.speechSynthesis.speak(utterance);
      }

      if (res.targetRoute && res.targetRoute !== '/dashboard') {
        setTimeout(() => {
          navigate(res.targetRoute);
        }, 2200);
      }
    } catch {
      toast.error('Voice processing failed');
    }
  };

  const handleSimulateSpeech = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleExecuteVoice(voiceQuery);
    }, 1200);
  };

  const handleTriggerCVEvent = async (eventType, detail) => {
    try {
      await CampusAPI.logCVDetection({
        cameraZone: 'Central Gate AI Stream',
        eventType,
        plateNumberOrBadge: detail
      });
      setCvLogs(prev => [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), zone: 'Main Cam 1', event: eventType, detail, conf: '99%' },
        ...prev
      ]);
      toast.success(`Computer Vision Event Triggered: ${eventType}`);
    } catch {
      toast.error('CV event logging failed');
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 text-xl border border-pink-500/30">
              <FaMicrophone />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                Voice ERP Assistant & Computer Vision Hub
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Natural Speech ERP Navigation, Live Computer Vision Camera Telemetry & Lab PPE Monitoring
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice ERP Assistant Engine */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase text-pink-400 tracking-wider">Voice ERP Natural Speech Engine</span>
              <span className="text-xxs font-mono text-slate-400">Web Speech STT / TTS Active</span>
            </div>

            {/* Voice Waveform & Microphone Visualizer */}
            <div className="my-6 flex flex-col items-center justify-center space-y-4">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={openVoiceAssistant}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl shadow-2xl transition border-4 ${isVoiceAssistantListening ? 'bg-rose-600 border-rose-400 animate-pulse ring-8 ring-rose-500/30 text-white' : 'bg-gradient-to-tr from-pink-600 to-indigo-600 border-pink-400/40 text-white'}`}
                title="Click to activate Voice ERP Speech Assistant"
              >
                <FaMicrophone />
              </motion.button>
              <span className="text-xs font-bold text-slate-300">
                {isVoiceAssistantListening ? 'Listening & Synthesizing Audio...' : 'Click to Speak Voice Command'}
              </span>
            </div>

            {/* Prompt Quick Selection */}
            <div className="space-y-2">
              <span className="text-xxs font-bold uppercase text-slate-500 block">Sample Voice Phrases:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Show today\'s attendance summary',
                  'Open LMS and course video lectures',
                  'Navigate to Digital Campus Twin',
                  'Open Blockchain Document Vault',
                  'Apply for semester leave',
                  'Check fee status and pending dues',
                  'Report an issue or bug'
                ].map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      executeVoiceCommand(phrase);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xxs font-mono transition border border-slate-700 hover:border-pink-500/40"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spoken Response Box */}
          {voiceOutput && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-pink-950/20 border border-pink-500/30 space-y-2">
              <div className="flex items-center gap-2 text-pink-400">
                <FaVolumeUp />
                <span className="text-xxs font-black uppercase tracking-wider">EduVerse Voice Synthesizer</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-semibold">"{voiceOutput.spokenResponse}"</p>
              <span className="text-xxs font-mono text-slate-400 block">Intent: {voiceOutput.intent} ➔ Redirecting to {voiceOutput.targetRoute}</span>
            </motion.div>
          )}
        </div>

        {/* Computer Vision Real-Time Feed & ANPR Simulator */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">Computer Vision Live AI Streams</span>
              <span className="text-xxs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live 60 FPS
              </span>
            </div>

            {/* Video Feed Simulation Box */}
            <div className="my-4 aspect-video w-full rounded-2xl bg-black border border-cyan-500/30 relative flex items-center justify-center overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-cyan-950/20 flex flex-col justify-between p-3 pointer-events-none">
                <div className="flex justify-between text-xxs font-mono text-cyan-400">
                  <span>CAM-01 · GATE 1 ANPR</span>
                  <span>AI OVERLAY: ENABLED</span>
                </div>
                <div className="self-center border-2 border-emerald-400/60 w-40 h-28 rounded-lg flex items-center justify-center">
                  <span className="text-xxs font-mono bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 font-bold">
                    ANPR: DL-01-AB-2026 (CONF: 99%)
                  </span>
                </div>
                <div className="text-xxs font-mono text-slate-400">FPS: 59.8 · LATENCY: 12ms</div>
              </div>
            </div>

            {/* Trigger Simulation Events */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleTriggerCVEvent('Vehicle ANPR', 'KA-04-EV-2026 (Transport Bus)')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xxs font-bold transition border border-slate-700 flex items-center gap-1.5"
              >
                <FaCar /> Simulate Bus ANPR
              </button>
              <button
                onClick={() => handleTriggerCVEvent('Lab PPE Verified', 'Goggles + Safety Vest Verified')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xxs font-bold transition border border-slate-700 flex items-center gap-1.5"
              >
                <FaShieldAlt /> Simulate Lab PPE
              </button>
            </div>
          </div>

          {/* Live CV Detection Logs */}
          <div className="space-y-2 max-h-36 overflow-y-auto pt-2 border-t border-slate-800">
            {cvLogs.map((log, i) => (
              <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xxs font-mono">
                <span className="text-cyan-400 font-bold">{log.event}</span>
                <span className="text-slate-300 truncate max-w-[200px]">{log.detail}</span>
                <span className="text-slate-500">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
