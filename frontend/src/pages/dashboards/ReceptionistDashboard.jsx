import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FaPhone, FaIdCard, FaUserFriends, FaPlus, FaCheck, FaBuilding, FaUser } from 'react-icons/fa';

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState(() => {
    try {
      const saved = localStorage.getItem('eduverse_reception_visitors');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newVisitor, setNewVisitor] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newVisiting, setNewVisiting] = useState('');
  const [newPurpose, setNewPurpose] = useState('');

  useEffect(() => {
    localStorage.setItem('eduverse_reception_visitors', JSON.stringify(visitors));
  }, [visitors]);

  const handleRegisterVisitor = (e) => {
    e.preventDefault();
    if (!newVisitor || !newPhone) return;
    const item = {
      id: `VIS-${Math.floor(Math.random() * 900 + 100)}`,
      name: newVisitor,
      phone: newPhone,
      visiting: newVisiting || 'Dean / HOD Office',
      purpose: newPurpose || 'Campus Inquiry / Meeting',
      badge: `BADGE-#${Math.floor(Math.random() * 80 + 10)}`,
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Checked In'
    };
    const updated = [item, ...visitors];
    setVisitors(updated);
    setNewVisitor('');
    setNewPhone('');
    setNewVisiting('');
    setNewPurpose('');
    toast.success(`Visitor pass generated: ${item.badge} issued to ${item.name}!`);
  };

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Reception Desk' : 'Front Desk Receptionist';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold pb-16">
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-cyan-900/40 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-cyan-400 font-bold uppercase tracking-widest text-xxs flex items-center gap-2">
            <FaPhone /> Front Desk Reception & Campus Visitor Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">Hello, {name}</h1>
          <p className="text-slate-400 text-xs">Issue campus visitor passes, register appointment logs, route inquiries to administrative departments, and monitor entrance lobby logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
        {[
          { label: 'Active Visitors On-Campus', val: `${visitors.filter(v => v.status === 'Checked In').length}`, color: 'text-cyan-400' },
          { label: 'Total Visits Logged', val: `${visitors.length}`, color: 'text-indigo-400' },
          { label: 'Badges Returned', val: `${visitors.filter(v => v.status === 'Checked Out').length}`, color: 'text-emerald-400' },
          { label: 'Desk Status', val: 'Operational', color: 'text-amber-400' }
        ].map((s, i) => (
          <div key={i} className="p-3.5 sm:p-5 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-1 min-w-0">
            <span className="text-[10px] sm:text-xxs uppercase tracking-wider text-slate-400 font-sans font-bold truncate">{s.label}</span>
            <span className={`text-xl sm:text-2xl font-black ${s.color} truncate`}>{s.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><FaIdCard className="text-cyan-400" /> Active Campus Visitor Registry</h2>
            {visitors.length === 0 ? (
              <div className="p-8 sm:p-12 text-center border border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-2 text-slate-400">
                <FaUser className="text-3xl text-slate-600 mb-1" />
                <span className="font-bold text-sm text-slate-300">No Visitors Registered Today</span>
                <p className="text-xxs text-slate-500">Visitor passes generated at the front desk will appear here in real time.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visitors.map(v => (
                  <div key={v.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-xs">{v.name}</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xxs font-bold">{v.badge}</span>
                      </div>
                      <span className="text-xxs text-slate-300">Visiting: {v.visiting} • Purpose: {v.purpose}</span>
                      <span className="text-xxs text-slate-500 font-mono">Contact: {v.phone} • Check-in: {v.inTime}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setVisitors(visitors.map(x => x.id === v.id ? { ...x, status: 'Checked Out' } : x));
                        toast.success(`Badge ${v.badge} surrendered. Checked out.`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition self-start sm:self-auto ${v.status === 'Checked In' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-emerald-500/10 text-emerald-400 font-mono'}`}
                    >
                      {v.status === 'Checked In' ? 'Check Out' : 'Completed ✓'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPlus className="text-cyan-400" /> Generate Visitor Pass</h2>
            <form onSubmit={handleRegisterVisitor} className="flex flex-col gap-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Visitor Full Name</label>
                <input type="text" value={newVisitor} onChange={e => setNewVisitor(e.target.value)} placeholder="Full Name" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Mobile Phone</label>
                <input type="text" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Whom to Visit</label>
                <input type="text" value={newVisiting} onChange={e => setNewVisiting(e.target.value)} placeholder="Dean of Academic Affairs / HOD" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Purpose</label>
                <input type="text" value={newPurpose} onChange={e => setNewPurpose(e.target.value)} placeholder="State purpose of visit" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-xl text-xs">
                Issue Visitor Badge
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
