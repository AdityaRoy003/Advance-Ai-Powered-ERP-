import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AutomationAPI } from '../../services/api';
import { 
  FaPuzzlePiece, FaCheckCircle, FaTimesCircle, 
  FaSearch, FaToggleOn, FaToggleOff, FaExternalLinkAlt 
} from 'react-icons/fa';

export default function PluginIntegrationsHub() {
  const [integrations, setIntegrations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await AutomationAPI.getIntegrations();
      setIntegrations(res);
    } catch (err) {
      console.error('Integrations error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleToggle = async (appKey) => {
    try {
      await AutomationAPI.toggleIntegration(appKey);
      toast.success('Integration status updated');
      fetchIntegrations();
    } catch {
      toast.error('Failed to update integration');
    }
  };

  const categories = ['All', 'Productivity', 'Communication', 'Payment', 'Hardware', 'Developer', 'Storage'];

  const filtered = integrations.filter(app => {
    const matchCat = selectedCategory === 'All' || app.category === selectedCategory;
    const matchQ = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xl">
              <FaPuzzlePiece />
            </span>
            <div>
              <h1 className="text-2xl font-black">Plugins & Integration Hub</h1>
              <p className="text-slate-400 text-xs mt-0.5">Connect Google Workspace, MS Teams, Zoom, WhatsApp, Payment Gateways & Biometrics</p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-slate-500 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search plugins..."
              className="pl-8 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedCategory === cat ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(app => (
          <div key={app.appKey} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800 inline-block">{app.icon}</span>
                <button
                  onClick={() => handleToggle(app.appKey)}
                  className="text-2xl transition"
                  title="Toggle connection status"
                >
                  {app.connected ? <FaToggleOn className="text-emerald-400" /> : <FaToggleOff className="text-slate-600" />}
                </button>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{app.name}</h3>
              <span className="text-xxs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20 inline-block mb-3">
                {app.category}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{app.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xxs">
              <span className="text-slate-500 font-mono">Auth: {app.authType}</span>
              <span className={`font-bold flex items-center gap-1 ${app.connected ? 'text-emerald-400' : 'text-slate-500'}`}>
                {app.connected ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                {app.connected ? 'Active & Synced' : 'Disconnected'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
