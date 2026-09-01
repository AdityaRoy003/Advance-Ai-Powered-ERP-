import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaTrophy, FaUsers, FaLaptopCode, FaRocket,
  FaCheckCircle, FaPlus, FaCodeBranch, FaUserFriends,
  FaLightbulb, FaSyncAlt
} from 'react-icons/fa';
import { InnovationAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function HackathonInnovationHub() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetDomain, setTargetDomain] = useState('Generative AI for Social Impact');
  const [teammateMatches, setTeammateMatches] = useState(null);
  const [matching, setMatching] = useState(false);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const data = await InnovationAPI.getHackathons();
      if (Array.isArray(data) && data.length > 0) {
        setHackathons(data);
      } else {
        const initialHack = await InnovationAPI.createHackathon({
          title: 'EduVerse National AI Hackathon 2026',
          theme: 'Building Autonomous Multi-Agent Systems for Higher Education',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          prizePool: '₹2,50,000',
          status: 'live',
          registeredTeams: [
            {
              teamName: 'Synthetix AI',
              projectTitle: 'Neural Adaptive Curriculum Optimizer',
              members: [
                { name: 'Aditya Raj', role: 'Full Stack Lead', skills: ['React', 'Node.js', 'MongoDB'] },
                { name: 'Rohan Deshmukh', role: 'AI Model Engineer', skills: ['PyTorch', 'FastAPI', 'LangChain'] }
              ],
              score: 94
            }
          ]
        });
        setHackathons([initialHack]);
      }
    } catch (err) {
      console.error('Error fetching hackathons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const handleMatchTeammates = async () => {
    setMatching(true);
    try {
      const res = await InnovationAPI.matchTeammates(['React', 'TypeScript', 'UI Design'], targetDomain);
      setTeammateMatches(res);
      toast.success('AI Teammate Synergies Identified!');
    } catch {
      toast.error('Matching failed');
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 text-xl border border-amber-500/30">
              <FaTrophy />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Hackathon & Innovation Hub
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Campus Competitions, AI-Powered Team Matchmaking & Project Portfolios
              </p>
            </div>
          </div>
        </div>

        <button onClick={fetchHackathons} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition self-start md:self-auto">
          <FaSyncAlt className="text-xs" />
        </button>
      </div>

      {/* AI Team Matchmaking Bench */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-amber-400">
            <FaUserFriends />
            <span className="text-xs font-black uppercase tracking-wider">AI Teammate Matchmaker Engine</span>
          </div>
          <span className="text-xxs font-mono text-slate-400">Complementary Skill Graph Matching</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={targetDomain}
            onChange={e => setTargetDomain(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            placeholder="Target Competition Domain e.g., AI in Healthcare..."
          />
          <button
            onClick={handleMatchTeammates}
            disabled={matching}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center gap-2"
          >
            {matching ? 'Analyzing Skill Matrix...' : 'Find Teammates'}
          </button>
        </div>

        {teammateMatches && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teammateMatches.recommendedTeammates?.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rec.name}</h4>
                      <p className="text-xxs text-amber-400 font-mono">{rec.role}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xxs font-mono font-bold">
                      {rec.synergyScore} Synergy
                    </span>
                  </div>

                  <p className="text-xxs text-slate-300 italic">{rec.complementaryNote}</p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {rec.skills.map((sk, k) => (
                      <span key={k} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xxs font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => toast.success(`Team invitation sent to ${rec.name}!`)}
                    className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xxs font-bold transition border border-slate-700"
                  >
                    Send Hackathon Team Invite
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Active Hackathons Arena */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase text-slate-300">Live Campus Hackathons & Innovation Challenges</span>

        <div className="space-y-4">
          {hackathons.map((h, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xxs font-mono font-bold uppercase">
                    ● {h.status}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{h.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{h.theme}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xxs uppercase text-slate-500 block font-mono">Prize Pool</span>
                    <span className="text-base font-black text-amber-400 font-mono">{h.prizePool}</span>
                  </div>
                  <button
                    onClick={() => toast.success(`Registered your team for ${h.title}!`)}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg"
                  >
                    Register Team
                  </button>
                </div>
              </div>

              {/* Registered Teams Preview */}
              {h.registeredTeams?.length > 0 && (
                <div className="border-t border-slate-800 pt-3">
                  <span className="text-xxs font-bold uppercase text-slate-500 block mb-2">Competing Teams:</span>
                  <div className="flex flex-wrap gap-2">
                    {h.registeredTeams.map((t, tIdx) => (
                      <div key={tIdx} className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xxs">
                        <span className="text-amber-400 font-bold">{t.teamName}</span>
                        <span className="text-slate-500">· {t.projectTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
