import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFlask, FaBook, FaAward, FaSearch, FaPlus,
  FaFileAlt, FaChartLine, FaCheckCircle, FaTimes,
  FaLightbulb, FaSyncAlt, FaExternalLinkAlt
} from 'react-icons/fa';
import { ResearchAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ResearchInnovationPortal() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [discoveryTopic, setDiscoveryTopic] = useState('Deep Learning in Education');
  const [discoveryResults, setDiscoveryResults] = useState(null);
  const [runningDiscovery, setRunningDiscovery] = useState(false);

  // New publication state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthors, setNewAuthors] = useState('');
  const [newJournal, setNewJournal] = useState('');
  const [newAbstract, setNewAbstract] = useState('');

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const data = await ResearchAPI.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setPapers(data);
      } else {
        // Initial sample publication
        const initialPaper = await ResearchAPI.create({
          title: 'Self-Supervised Representation Learning on Heterogeneous Academic Knowledge Graphs',
          authors: ['Dr. Arjun Mehta', 'Prof. Sarah Connor', 'Aditya Raj'],
          journalOrConference: 'IEEE Transactions on Knowledge and Data Engineering (TKDE)',
          abstract: 'We introduce a scalable GNN framework tailored for multi-relational academic records, achieving 94.2% accuracy on student outcome forecasting with strict privacy guarantees.',
          citationsCount: 14,
          grantFunded: true,
          grantDetails: {
            grantAgency: 'SERB India / DST Project Grant',
            amountSanctioned: '₹24,50,000',
            grantId: 'DST/SERB/2026/0419'
          },
          patentFiled: true,
          patentNumber: 'IN-PAT-2026-98104',
          status: 'published'
        });
        setPapers([initialPaper]);
      }
    } catch (err) {
      console.error('Error fetching research:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleCreatePaper = async (e) => {
    e.preventDefault();
    if (!newTitle || !newAuthors || !newJournal) {
      toast.error('Title, Authors, and Journal/Conference are required');
      return;
    }
    try {
      await ResearchAPI.create({
        title: newTitle,
        authors: newAuthors.split(',').map(a => a.trim()),
        journalOrConference: newJournal,
        abstract: newAbstract || 'Abstract provided by authors.',
        status: 'published',
        citationsCount: 0
      });
      toast.success('Research publication logged successfully!');
      setNewTitle('');
      setNewAuthors('');
      setNewJournal('');
      setNewAbstract('');
      setShowAddModal(false);
      fetchResearch();
    } catch {
      toast.error('Failed to create publication');
    }
  };

  const handleRunDiscovery = async () => {
    if (!discoveryTopic.trim()) return;
    setRunningDiscovery(true);
    try {
      const res = await ResearchAPI.runLiteratureDiscovery(discoveryTopic);
      setDiscoveryResults(res);
      toast.success('AI Literature Discovery complete!');
    } catch {
      toast.error('Discovery failed');
    } finally {
      setRunningDiscovery(false);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400 text-xl border border-violet-500/30">
              <FaFlask />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Research & Innovation Management
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Publications, Patents, DST/SERB Grants, Citation Indexing & AI Literature Discovery
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition shadow-lg shadow-violet-900/30 flex items-center gap-2"
          >
            <FaPlus /> Submit Publication / Patent
          </button>
        </div>
      </div>

      {/* AI Literature Discovery Bench */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-violet-400">
            <FaLightbulb />
            <span className="text-xs font-black uppercase tracking-wider">AI Literature & Citation Discovery Engine</span>
          </div>
          <span className="text-xxs font-mono text-slate-400">IEEE · ACM · Nature · arXiv Cross-Indexing</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={discoveryTopic}
            onChange={e => setDiscoveryTopic(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            placeholder="Enter research topic e.g., Multi-Agent Consensus in Edge Computing..."
          />
          <button
            onClick={handleRunDiscovery}
            disabled={runningDiscovery}
            className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition flex items-center gap-2"
          >
            {runningDiscovery ? 'Searching Databases...' : 'Run Discovery'}
          </button>
        </div>

        {discoveryResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex justify-between text-xxs font-mono text-slate-400">
              <span>Novelty Score: <strong className="text-emerald-400">{discoveryResults.noveltyScore}</strong></span>
              <span>Duplicate Check: <strong className="text-emerald-400">{discoveryResults.duplicateRisk}</strong></span>
            </div>

            <div className="space-y-2">
              {discoveryResults.suggestions?.map((sug, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">{sug.title}</h4>
                    <p className="text-xxs text-slate-400 mt-0.5">{sug.authors.join(', ')} · DOI: {sug.doi}</p>
                    <span className="text-xxs text-violet-300 italic mt-1 block">💡 {sug.citationRecommendation}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-xxs font-bold flex-shrink-0">
                    {sug.matchScore} Match
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Publications Repository List */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase text-slate-300">Institutional Research Publications & Grants</span>

        <div className="space-y-3">
          {papers.map((p, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xxs font-mono font-bold uppercase">
                      {p.status}
                    </span>
                    {p.patentFiled && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xxs font-mono font-bold">
                        Patent: {p.patentNumber}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">{p.title}</h3>
                  <p className="text-xxs text-slate-400 font-mono">{p.authors?.join(', ')} · {p.journalOrConference}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xxs font-mono text-violet-300">
                    Citations: <strong className="text-white text-xs">{p.citationsCount}</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                {p.abstract}
              </p>

              {p.grantFunded && p.grantDetails && (
                <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 flex items-center justify-between text-xxs font-mono">
                  <span className="text-slate-300">Grant: {p.grantDetails.grantAgency} ({p.grantDetails.grantId})</span>
                  <span className="text-emerald-400 font-bold">Funding: {p.grantDetails.amountSanctioned}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Publication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Log Research Publication</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleCreatePaper} className="space-y-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Paper Title</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="Paper title..." required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Authors (comma separated)</label>
                <input value={newAuthors} onChange={e => setNewAuthors(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="Dr. Arjun Mehta, Aditya Raj..." required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Journal / Conference</label>
                <input value={newJournal} onChange={e => setNewJournal(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="IEEE / ACM / Springer..." required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Abstract</label>
                <textarea value={newAbstract} onChange={e => setNewAbstract(e.target.value)} rows={3} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="Paper summary..." />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition">
                Submit Research Record
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
