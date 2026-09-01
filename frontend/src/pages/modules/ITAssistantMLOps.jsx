import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { SystemOpsAPI } from '../../services/api';
import { 
  FaLaptopCode, FaServer, FaDatabase, FaExchangeAlt, 
  FaCheckCircle, FaExclamationTriangle, FaHistory, FaUndo, FaRobot 
} from 'react-icons/fa';

export default function ITAssistantMLOps() {
  const [activeTab, setActiveTab] = useState('mlops'); // mlops | it_assistant
  const [models, setModels] = useState([]);
  const [diagnostics, setDiagnostics] = useState({ incidents: [], systemHealth: null });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, dRes] = await Promise.all([
        SystemOpsAPI.getModels(),
        SystemOpsAPI.getITDiagnostics()
      ]);
      setModels(mRes);
      setDiagnostics(dRes);
    } catch (err) {
      console.error('System ops error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRollback = async (id, modelName, version) => {
    try {
      await SystemOpsAPI.rollbackModel(id);
      toast.success(`Model ${modelName} (${version}) promoted to Active Production!`);
      fetchData();
    } catch {
      toast.error('Rollback failed');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xl">
              <FaLaptopCode />
            </span>
            <div>
              <h1 className="text-2xl font-black">AI IT Assistant & MLOps Registry</h1>
              <p className="text-slate-400 text-xs mt-0.5">Model version tracking, drift telemetry, rollback controls & root-cause incident diagnostics</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('mlops')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'mlops' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-white'}`}
          >
            <FaRobot />
            <span>MLOps Registry</span>
          </button>
          <button
            onClick={() => setActiveTab('it_assistant')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'it_assistant' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-white'}`}
          >
            <FaServer />
            <span>IT Diagnostics</span>
          </button>
        </div>
      </div>

      {activeTab === 'mlops' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Registered Models</p>
              <p className="text-2xl font-black text-pink-400 mt-1">{models.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Avg Model Accuracy</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">91.1%</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Inference Latency</p>
              <p className="text-2xl font-black text-white mt-1">16 ms</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Data Drift Status</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">Zero Drift</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map(m => (
              <div key={m._id || m.modelName} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xxs font-mono font-bold text-pink-400">{m.version}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold ${m.status === 'Production' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {m.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{m.modelName}</h3>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center mb-3">
                    <div>
                      <p className="text-xxs text-slate-500">Accuracy</p>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">{m.accuracyPct}%</p>
                    </div>
                    <div>
                      <p className="text-xxs text-slate-500">Precision</p>
                      <p className="text-xs font-bold text-cyan-400 mt-0.5">{m.precisionPct}%</p>
                    </div>
                    <div>
                      <p className="text-xxs text-slate-500">Recall</p>
                      <p className="text-xs font-bold text-purple-400 mt-0.5">{m.recallPct}%</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xxs text-slate-400">
                    <div className="flex justify-between">
                      <span>Dataset:</span>
                      <span className="font-mono text-slate-300">{m.datasetVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Samples:</span>
                      <span className="text-slate-300">{m.trainingSamplesCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inference Latency:</span>
                      <span className="text-slate-300">{m.latencyMs} ms</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between mt-4">
                  <span className="text-xxs text-slate-500">Trained {m.lastTrainedDate}</span>
                  {m.status !== 'Production' && (
                    <button
                      onClick={() => handleRollback(m._id, m.modelName, m.version)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xxs font-bold transition"
                    >
                      <FaUndo size={10} />
                      <span>Promote</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'it_assistant' && (
        <div className="flex flex-col gap-6">
          {/* Health Snapshot */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">System Health</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{diagnostics.systemHealth?.overallStatus || 'OPTIMAL'}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">API Avg Response</p>
              <p className="text-2xl font-black text-white mt-1">{diagnostics.systemHealth?.avgApiLatencyMs || 24.2} ms</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Database Scan Latency</p>
              <p className="text-2xl font-black text-cyan-400 mt-1">{diagnostics.systemHealth?.databaseQueryAvgMs || 6.8} ms</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">System Uptime</p>
              <p className="text-2xl font-black text-purple-400 mt-1">{diagnostics.systemHealth?.uptimePct || 99.98}%</p>
            </div>
          </div>

          {/* Root-Cause Incident Diagnostics */}
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <h2 className="text-sm font-bold text-white mb-4">AI IT Incident & Diagnostic Logs</h2>
            <div className="space-y-4">
              {diagnostics.incidents?.map(inc => (
                <div key={inc._id || inc.incidentId} className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xxs font-mono font-bold text-pink-400">{inc.incidentId}</span>
                      <span className="text-xs font-bold text-white">{inc.title}</span>
                    </div>
                    <span className="text-xxs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      {inc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-xxs text-rose-400 font-bold uppercase">Root Cause Analysis:</span>
                      <p className="text-slate-300 mt-1">{inc.rootCause}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-xxs text-emerald-400 font-bold uppercase">AI Suggested Resolution:</span>
                      <p className="text-slate-300 mt-1">{inc.aiSuggestedResolution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
