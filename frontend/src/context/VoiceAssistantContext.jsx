import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AIEngineAPI } from '../services/api';
import { useTheme } from './ThemeContext';
import { useSupportModals } from './SupportModalContext';
import { useAuth } from './AuthContext';

const VoiceAssistantContext = createContext();

export const VoiceAssistantProvider = ({ children }) => {
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();
  const { openReportIssueModal } = useSupportModals();
  const { logout } = useAuth();

  // Assistant UI & State
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceOutput, setVoiceOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Click microphone or speak a command');
  const [permissionError, setPermissionError] = useState(null);

  const recognitionRef = useRef(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionError(null);
        setStatusMessage('Listening to your voice...');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += text;
          } else {
            interim += text;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final && final.trim().length > 0) {
          setTranscript(final.trim());
          setInterimTranscript('');
          handleExecuteVoiceCommand(final.trim());
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setPermissionError('Microphone access was denied. Please allow microphone permissions or use text commands below.');
          setStatusMessage('Microphone permission blocked');
        } else if (event.error === 'no-speech') {
          setStatusMessage('No speech detected. Speak again or choose a phrase.');
        } else {
          setStatusMessage(`Speech status: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech Recognition init error:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech Output
  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    stopSpeaking();
    setPermissionError(null);
    setTranscript('');
    setInterimTranscript('');

    if (!recognitionRef.current) {
      setStatusMessage('Speech recognition not supported in this browser. Please use quick prompts or text input.');
      return;
    }

    try {
      recognitionRef.current.abort();
    } catch {
      // ignore
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
    }
  }, [stopSpeaking]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setStatusMessage('Voice recognition stopped');
  }, []);

  // Open modal and immediately start listening
  const openVoiceAssistant = useCallback(() => {
    setIsOpen(true);
    setStatusMessage('Listening to your voice...');
    setTimeout(() => {
      startListening();
    }, 150);
  }, [startListening]);

  // Close modal
  const closeVoiceAssistant = useCallback(() => {
    stopListening();
    stopSpeaking();
    setIsOpen(false);
  }, [stopListening, stopSpeaking]);

  // Execute Voice Command (processes intent and triggers in-app action)
  const handleExecuteVoiceCommand = useCallback(async (spokenText) => {
    if (!spokenText || !spokenText.trim()) return;

    stopListening();
    setIsProcessing(true);
    setStatusMessage(`Interpreting command: "${spokenText}"...`);

    try {
      const res = await AIEngineAPI.sendVoiceCommand(spokenText);
      setVoiceOutput(res);
      setStatusMessage(`Recognized: ${res.intent || 'ACTION'}`);

      // Voice synthesis reply
      if (res.spokenResponse) {
        speakText(res.spokenResponse);
      }

      // Execute specific actions
      const action = res.action || 'NAVIGATE';

      if (action === 'OPEN_REPORT_ISSUE_MODAL' || res.intent === 'REPORT_ISSUE') {
        toast.success('Opening Issue Reporting Desk...');
        setTimeout(() => {
          setIsOpen(false);
          openReportIssueModal();
        }, 1200);
      } else if (action === 'TOGGLE_THEME' || res.intent === 'TOGGLE_THEME') {
        toggleTheme();
        toast.success(`Theme toggled to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      } else if (action === 'OPEN_SEARCH' || res.intent === 'OPEN_SEARCH') {
        window.dispatchEvent(new CustomEvent('open-global-search'));
        toast.success('Opening Global Search');
        setTimeout(() => setIsOpen(false), 900);
      } else if (action === 'OPEN_ACCESSIBILITY' || res.intent === 'OPEN_ACCESSIBILITY') {
        window.dispatchEvent(new CustomEvent('open-a11y-modal'));
        toast.success('Opening Accessibility Settings');
        setTimeout(() => setIsOpen(false), 900);
      } else if (action === 'LOGOUT' || res.intent === 'LOGOUT') {
        toast('Logging out...', { icon: '👋' });
        setTimeout(() => {
          setIsOpen(false);
          logout();
        }, 1200);
      } else if (res.targetRoute) {
        toast.success(`Navigating: ${res.intent}`);
        setTimeout(() => {
          navigate(res.targetRoute);
          setIsOpen(false);
        }, 1400);
      }
    } catch (err) {
      console.warn('Voice command execution failed:', err);
      // Fallback local intent matching
      const t = spokenText.toLowerCase();
      let fallbackRoute = '';
      let reply = "Processed your request.";

      if (t.includes('attendance')) {
        fallbackRoute = '/dashboard/attendance';
        reply = 'Opening Attendance Overview.';
      } else if (t.includes('timetable') || t.includes('schedule')) {
        fallbackRoute = '/dashboard/timetable';
        reply = 'Opening lecture timetable.';
      } else if (t.includes('fee') || t.includes('finance') || t.includes('payment')) {
        fallbackRoute = '/dashboard/finance';
        reply = 'Opening Fees and Finance portal.';
      } else if (t.includes('exam') || t.includes('hall ticket')) {
        fallbackRoute = '/dashboard/exams';
        reply = 'Opening Examination Management.';
      } else if (t.includes('lms') || t.includes('course')) {
        fallbackRoute = '/dashboard/lms';
        reply = 'Redirecting to LMS.';
      } else if (t.includes('leave')) {
        fallbackRoute = '/dashboard/approvals';
        reply = 'Opening Leave and Approvals Center.';
      } else if (t.includes('report issue') || t.includes('bug')) {
        openReportIssueModal();
        setIsOpen(false);
        reply = 'Opening Issue Report Desk.';
      }

      if (fallbackRoute) {
        speakText(reply);
        toast.success(reply);
        setTimeout(() => {
          navigate(fallbackRoute);
          setIsOpen(false);
        }, 1200);
      } else {
        toast.error('Could not process voice command. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [stopListening, speakText, openReportIssueModal, toggleTheme, theme, logout, navigate]);

  return (
    <VoiceAssistantContext.Provider
      value={{
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
        openVoiceAssistant,
        closeVoiceAssistant,
        startListening,
        stopListening,
        speakText,
        stopSpeaking,
        executeVoiceCommand: handleExecuteVoiceCommand
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    return {
      isOpen: false,
      isListening: false,
      transcript: '',
      interimTranscript: '',
      voiceOutput: null,
      isProcessing: false,
      isSpeaking: false,
      speechSupported: true,
      statusMessage: '',
      permissionError: null,
      openVoiceAssistant: () => console.warn('VoiceAssistantProvider not mounted'),
      closeVoiceAssistant: () => {},
      startListening: () => {},
      stopListening: () => {},
      speakText: () => {},
      stopSpeaking: () => {},
      executeVoiceCommand: () => {}
    };
  }
  return context;
};

export default VoiceAssistantContext;
