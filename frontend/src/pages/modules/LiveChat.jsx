import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { FaHashtag, FaPaperPlane, FaBroadcastTower } from 'react-icons/fa';

export default function LiveChat() {
  const { chatRooms, sendChatMessage, socketConnected } = useSocket();
  const { user } = useAuth();
  
  const [activeChannel, setActiveChannel] = useState('general');
  const [inputText, setInputText] = useState('');

  const activeMessages = chatRooms[activeChannel] || [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText) return;

    sendChatMessage(activeChannel, `${user.firstName} ${user.lastName}`, inputText);
    setInputText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-12 border border-slate-200 dark:border-slate-800 bg-[#111827]/40 rounded-3xl overflow-hidden min-h-[480px] shadow-lg"
    >
      {/* Sidebar: Channels */}
      <div className="md:col-span-3 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-5 bg-white/5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <span className="font-extrabold text-sm text-slate-100">Chat Channels</span>
          <div className="flex items-center gap-1.5 text-xxs font-bold text-slate-400">
            <FaBroadcastTower className={socketConnected ? 'text-emerald-400' : 'text-slate-500'} />
            <span className={socketConnected ? 'text-emerald-400' : 'text-slate-500'}>
              {socketConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 font-semibold text-xs text-slate-400">
          {[
            { id: 'general', label: 'general' },
            { id: 'teachers', label: 'teachers-lounge' },
            { id: 'parents', label: 'parents-lounge' }
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full text-left p-3 rounded-xl transition flex items-center gap-2 ${
                activeChannel === ch.id 
                  ? 'bg-indigo-600/15 text-indigo-400 font-bold border border-indigo-500/10' 
                  : 'hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <FaHashtag /> {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main chat window */}
      <div className="md:col-span-9 flex flex-col justify-between h-[480px] bg-slate-950/20">
        
        {/* Active room name */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/5 flex items-center gap-2 font-bold text-sm">
          <FaHashtag className="text-indigo-400" />
          <span>{activeChannel === 'general' ? 'general' : activeChannel === 'teachers' ? 'teachers-lounge' : 'parents-lounge'}</span>
        </div>

        {/* Message Logs */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 text-xs font-semibold">
          {activeMessages.map((m, idx) => {
            const isMe = m.sender.includes(user.firstName);
            return (
              <div key={idx} className={`flex flex-col gap-1 max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                <span className="text-xxs text-slate-500 font-normal">{m.sender} • {m.timestamp}</span>
                <div className={`p-3 rounded-2xl leading-relaxed font-normal ${
                  isMe 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-[#111827] border border-slate-800 text-slate-200'
                }`}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* TextInput Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/5 flex gap-3">
          <input 
            type="text" 
            placeholder={`Message #${activeChannel}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 font-semibold text-xs text-white"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl shadow-lg transition">
            <FaPaperPlane size={12} />
          </button>
        </form>

      </div>
    </motion.div>
  );
}
