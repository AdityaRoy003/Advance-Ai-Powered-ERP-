import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaRobot, FaPaperPlane, FaTimes, FaInbox } from 'react-icons/fa';

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Hello! I am your EduVerse ERP Copilot. Ask me to pull metrics or search at-risk staff.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    setMessages((prev) => [...prev, { sender: 'User', text: userPrompt }]);
    setPrompt('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      let aiText = '';
      let options = null;

      if (userPrompt.toLowerCase().includes('attendance') || userPrompt.toLowerCase().includes('below')) {
        aiText = 'Found 24 employees with attendance below 80%. Would you like me to compile a PDF risk index report?';
        options = ['Generate PDF Report', 'Show Details list'];
      } else if (userPrompt.toLowerCase().includes('salary') || userPrompt.toLowerCase().includes('payroll')) {
        aiText = 'Payroll projections are computed. Current month disbursement: ₹45 Lakhs. Generate report?';
        options = ['Disburse Ledgers', 'Export Excel sheet'];
      } else {
        aiText = `Analyzing data for "${userPrompt}"... Found matching employee records in the IT Department. Generate dashboard audit report?`;
        options = ['Compile Audit Logs'];
      }

      setMessages((prev) => [...prev, { sender: 'AI', text: aiText, options }]);
    }, 1200);
  };

  const handleOptionClick = (option) => {
    toast.success(`Action Triggered: "${option}" successful!`);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-3 font-semibold text-xs">
      
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="w-[calc(100vw-2rem)] sm:w-80 h-[380px] bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Window title bar */}
            <div className="px-5 py-4 border-b border-slate-850 bg-white/5 flex justify-between items-center text-white">
              <span className="font-extrabold text-sm flex items-center gap-2">
                <FaRobot className="text-indigo-400" /> Ask ERP AI Copilot
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <FaTimes />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 max-h-[220px]">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col gap-1 max-w-[85%] ${m.sender === 'User' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`p-3 rounded-2xl leading-normal font-normal text-xxs ${
                    m.sender === 'User' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-900 text-slate-350'
                  }`}>
                    {m.text}
                  </div>
                  
                  {/* Options buttons triggers */}
                  {m.options && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {m.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-indigo-500/20 text-indigo-400 font-bold px-2.5 py-1 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/35 transition"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <span className="text-xxs font-mono text-slate-500 animate-pulse">Copilot is querying database...</span>
              )}
            </div>

            {/* Prompt input form */}
            <form onSubmit={handleQuerySubmit} className="p-3 border-t border-slate-850 bg-white/5 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask ERP AI..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 text-xxs font-semibold text-white"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition">
                <FaPaperPlane size={10} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition cursor-pointer"
        title="Ask ERP AI Copilot"
      >
        <FaRobot size={22} className="animate-pulse" />
      </motion.button>

    </div>
  );
}
