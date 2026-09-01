import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaFilter, FaRedoAlt } from 'react-icons/fa';
import { CybersecurityAPI } from '../../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await CybersecurityAPI.getAuditLogs();
      const formatted = (data || []).map((l, i) => ({
        id: l.id || l._id || `AUD-00${i + 10}`,
        user: l.user || 'superadmin@eduverse.com',
        action: l.action || l.event || 'System Action Logged',
        oldVal: l.oldVal || 'State Initialized',
        newVal: l.newVal || 'State Mutated',
        ip: l.ip || '192.168.1.100',
        time: l.timestamp || new Date().toLocaleTimeString()
      }));
      setLogs(formatted);
    } catch (err) {
      console.error('Error fetching audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = () => {
    fetchLogs();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 text-xs font-semibold"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black">System Security Audit Logs</h1>
          <p className="text-slate-400 text-xs mt-0.5">Audit log list tracking actions, state changes, client IPs, and timestamps.</p>
        </div>

        <button 
          onClick={handleRefresh}
          className="flex items-center gap-1.5 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-xl text-xxs font-bold text-slate-350 transition"
        >
          <FaRedoAlt /> Refresh Logs
        </button>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="font-extrabold text-sm text-white flex items-center gap-2"><FaHistory /> Action Ledger</span>
          <span className="text-xxs text-slate-500">Total Entries: {logs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-bold uppercase tracking-wider text-slate-500 text-xxs">
                <th className="pb-3.5">Log ID</th>
                <th className="pb-3.5">User Profile</th>
                <th className="pb-3.5">Action Details</th>
                <th className="pb-3.5">Old State</th>
                <th className="pb-3.5">New State</th>
                <th className="pb-3.5">Client IP</th>
                <th className="pb-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="py-4 font-mono text-slate-450">{log.id}</td>
                  <td className="py-4 font-bold text-slate-100">{log.user}</td>
                  <td className="py-4 text-slate-200">{log.action}</td>
                  <td className="py-4 text-rose-450 font-mono">{log.oldVal}</td>
                  <td className="py-4 text-emerald-450 font-mono">{log.newVal}</td>
                  <td className="py-4 text-slate-400 font-mono">{log.ip}</td>
                  <td className="py-4 text-right text-slate-500 font-mono">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
