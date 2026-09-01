import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AutomationAPI } from '../../services/api';
import { 
  FaCode, FaKey, FaBook, FaPlus, FaCopy, 
  FaCheckCircle, FaTerminal, FaShieldAlt, FaChartLine 
} from 'react-icons/fa';

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState('keys'); // keys | docs | sandbox
  const [keys, setKeys] = useState([]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedSecret, setGeneratedSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await AutomationAPI.getApiKeys();
      setKeys(res);
    } catch (err) {
      console.error('API keys error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error('Key name required');
      return;
    }

    try {
      const res = await AutomationAPI.createApiKey({
        name: newKeyName,
        scopes: ['read:students', 'read:courses', 'write:attendance'],
        rateLimitPerMin: 1200
      });
      setGeneratedSecret(res.secretToken);
      toast.success('API Key generated successfully!');
      fetchKeys();
    } catch {
      toast.error('Failed to generate key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xl">
              <FaCode />
            </span>
            <div>
              <h1 className="text-2xl font-black">Public API & Developer Portal</h1>
              <p className="text-slate-400 text-xs mt-0.5">REST API keys, OAuth scopes, rate limiting, OpenAPI specifications & interactive sandbox</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'keys' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            <FaKey />
            <span>API Keys</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'docs' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            <FaBook />
            <span>API Explorer</span>
          </button>
        </div>
      </div>

      {activeTab === 'keys' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Active Developer API Keys</h2>
              <p className="text-slate-400 text-xs">Bearer tokens for programmatic ERP integration</p>
            </div>
            <button
              onClick={() => { setGeneratedSecret(null); setShowKeyModal(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition shadow-lg shadow-emerald-500/20"
            >
              <FaPlus />
              <span>Generate API Key</span>
            </button>
          </div>

          <div className="space-y-3">
            {keys.map(k => (
              <div key={k._id || k.keyPrefix} className="p-5 rounded-2xl border border-slate-800 bg-[#111827] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white">{k.name}</h3>
                    <span className="text-xxs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      {k.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 font-mono text-xs text-slate-400">
                    <span>Key Prefix: <strong className="text-emerald-400">{k.keyPrefix}...</strong></span>
                    <span>•</span>
                    <span>Rate Limit: {k.rateLimitPerMin} req/min</span>
                    <span>•</span>
                    <span>Total Calls: {k.totalCalls?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    {k.scopes?.map((sc, i) => (
                      <span key={i} className="text-xxs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(`Bearer ${k.keyPrefix}*****************`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-300 flex items-center gap-2 transition"
                >
                  <FaCopy size={12} />
                  <span>Copy Token</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-base font-bold text-white mb-2">OpenAPI / REST Endpoints Reference</h2>
          <p className="text-xs text-slate-400 mb-6">Standard authenticated endpoints scoped under <code>/api/v1/*</code></p>

          <div className="space-y-3">
            {[
              { method: 'GET', path: '/api/v1/students', desc: 'Retrieve student cohort rosters with pagination and filters.' },
              { method: 'POST', path: '/api/v1/attendance', desc: 'Record biometric, QR or manual classroom attendance logs.' },
              { method: 'GET', path: '/api/v1/courses', desc: 'Fetch academic course catalogs, credits, and syllabus data.' },
              { method: 'GET', path: '/api/v1/finance/ledger', desc: 'Query reconciled fee transactions and invoice receipts.' },
              { method: 'POST', path: '/api/v1/iot/telemetry/ingest', desc: 'Ingest time-series MQTT telemetry from campus sensors.' }
            ].map((ep, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-xxs font-mono font-bold ${ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-white">{ep.path}</span>
                </div>
                <span className="text-xs text-slate-400 hidden md:inline">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-slate-800 bg-[#111827] p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-white mb-4">Generate Developer API Key</h2>

            {generatedSecret ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  <p className="font-bold mb-1">Make sure to copy your API secret now. You won't be able to see it again!</p>
                  <p className="font-mono text-xxs bg-black/60 p-2.5 rounded-lg break-all select-all text-white">{generatedSecret}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(generatedSecret)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                >
                  Copy Secret Token
                </button>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <label className="text-xxs font-bold text-slate-400 uppercase">Key Name / Client ID</label>
                  <input
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    placeholder="e.g. Mobile Flutter App Gateway"
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowKeyModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs">Generate Key</button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
