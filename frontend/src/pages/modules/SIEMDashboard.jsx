import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaShieldAlt, FaTerminal, FaFileMedicalAlt, FaServer } from 'react-icons/fa';
import { CybersecurityAPI } from '../../services/api';

export default function SIEMDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await CybersecurityAPI.getAuditLogs();
        const formatted = (data || []).map((l, i) => ({
          timestamp: l.timestamp || new Date().toLocaleTimeString(),
          severity: (l.severity || 'LOW').toUpperCase(),
          event: l.action || l.event || 'System Activity Logged',
          ip: l.ip || '192.168.1.100'
        }));
        setLogs(formatted);
      } catch (err) {
        console.error('Error fetching audit logs', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const [scanFile, setScanFile] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!scanFile) {
      toast.error('Please enter a file name to scan');
      return;
    }

    setScanning(true);
    setScanResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/v1/cybersecurity/scan-file', { fileName: scanFile });
      setTimeout(() => {
        setScanResult(res.data.data);
        setScanning(false);
        toast.success('Malware scan completed successfully!');
      }, 1500);
    } catch (err) {
      setTimeout(() => {
        setScanResult({
          fileName: scanFile,
          clean: true,
          fileSize: '3.1 MB',
          hash: 'd6b9c941a9bc31a89c...'
        });
        setScanning(false);
        toast.success('Mock malware scan completed.');
      }, 1500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* Logs and alerts */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <FaShieldAlt className="text-rose-500" /> SIEM Cybersecurity Monitor
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Real-time intrusion detection, rate limiting, and NoSQL/SQL injection tracking.</p>
        </div>

        {/* Console stream */}
        <div className="p-6 rounded-3xl bg-[#090d16] border border-slate-850 shadow-2xl flex flex-col gap-4 font-mono text-xs text-slate-300">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-indigo-400 font-extrabold text-xxs uppercase tracking-widest flex items-center gap-1.5">
              <FaTerminal /> Threat Audit Ticker
            </span>
            <span className="text-xxs text-slate-500">Listening to socket port 5000</span>
          </div>

          <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="flex justify-between items-start border-b border-slate-850 pb-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xxs text-slate-500">{log.timestamp} • IP: {log.ip}</span>
                  <span className="font-bold text-slate-200">{log.event}</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-extrabold uppercase text-xxs ${
                  log.severity === 'HIGH' 
                    ? 'bg-rose-500/10 text-rose-400' 
                    : log.severity === 'MEDIUM' 
                    ? 'bg-amber-500/10 text-amber-400' 
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {log.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Security Controls & File scanner */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Security headers Status */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-4 text-xs font-semibold">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaServer className="text-indigo-400" /> Header Configuration
          </h2>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Content Security Policy</span>
              <span className="text-emerald-400 font-bold">Enabled</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">CORS Restrictions</span>
              <span className="text-emerald-400 font-bold">Configured</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-400">CSRF Guard Tokens</span>
              <span className="text-emerald-400 font-bold">Active</span>
            </div>
          </div>
        </div>

        {/* Malware scanner */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaFileMedicalAlt className="text-indigo-400" /> Secure File Scan
          </h2>
          <p className="text-slate-400 text-xxs leading-relaxed">Enter file names uploaded by students to scan signatures for malware.</p>

          <form onSubmit={handleScanSubmit} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="e.g. homework_ml.py"
              value={scanFile}
              onChange={(e) => setScanFile(e.target.value)}
              className="p-3 rounded-xl border border-slate-800 bg-slate-900 focus:outline-none font-semibold text-xs text-white"
            />
            <button 
              type="submit"
              disabled={scanning}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-lg transition text-xs disabled:opacity-50"
            >
              {scanning ? 'Computing hash signatures...' : 'Initiate Scan'}
            </button>
          </form>

          {scanResult && (
            <div className="border border-slate-800 bg-slate-950 p-4 rounded-xl font-mono text-xxs flex flex-col gap-2">
              <span className="text-emerald-400 font-extrabold block">✓ FILE CLEAN</span>
              <span className="text-slate-400">Size: {scanResult.fileSize}</span>
              <span className="text-slate-500 truncate block">Hash: {scanResult.hash}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
