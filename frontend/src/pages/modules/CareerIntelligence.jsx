import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaBriefcase, FaChartPie, FaRocket, FaCheckCircle,
  FaArrowRight, FaCode, FaLaptopCode, FaAward,
  FaFileAlt, FaLayerGroup, FaSyncAlt
} from 'react-icons/fa';
import { AIEngineAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CareerIntelligence() {
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchCareerInsights = async () => {
    setLoading(true);
    try {
      const data = await AIEngineAPI.getCareerAnalysis(['React', 'TypeScript', 'Node.js', 'Python', 'SQL']);
      setCareerData(data);
      if (data?.recommendedCareers?.length > 0) {
        setSelectedRole(data.recommendedCareers[0]);
      }
    } catch (err) {
      console.error('Error fetching career insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerInsights();
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 text-xl border border-teal-500/30">
              <FaBriefcase />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Career Intelligence Platform
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                AI Career Match Matrix, Skill-Gap Diagnostic Radar & Personalized Roadmap to Industry Placement
              </p>
            </div>
          </div>
        </div>

        <button onClick={fetchCareerInsights} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition self-start md:self-auto">
          <FaSyncAlt className="text-xs" />
        </button>
      </div>

      {/* Target Career Roles Match Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {careerData?.recommendedCareers?.map((career, idx) => {
          const isSelected = selectedRole?.role === career.role;
          return (
            <div
              key={idx}
              onClick={() => setSelectedRole(career)}
              className={`p-6 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${isSelected ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-teal-400 shadow-xl shadow-teal-500/10' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 text-xxs font-mono font-bold">
                    {career.demandIndex} DEMAND
                  </span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{career.matchPercentage}%</span>
                </div>
                <h3 className="text-base font-bold text-white mt-3">{career.role}</h3>
                <p className="text-xxs text-slate-400 font-mono mt-1">{career.salaryRange}</p>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full"
                  style={{ width: `${career.matchPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill-Gap Diagnostic Matrix & Targeted Remediation Roadmap */}
      {selectedRole && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill-Gap Matrix Box */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div>
              <span className="text-xxs uppercase font-black text-teal-400 tracking-wider">Skill Gap Diagnostic Analysis</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedRole.role}</h3>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Missing Skills required for 100% Fit:</span>
              <div className="flex flex-wrap gap-2">
                {selectedRole.skillGap.map((s, i) => (
                  <div key={i} className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                    <FaCode className="text-rose-400 text-xxs" /> {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2 text-xxs text-slate-300 leading-relaxed">
              <span className="font-bold text-teal-400 block uppercase">AI Placement Recommendation:</span>
              Completing the recommended projects below will bridge your score from <strong className="text-white">{selectedRole.matchPercentage}%</strong> to <strong className="text-emerald-400">98%</strong> ahead of upcoming recruitment drives.
            </div>
          </div>

          {/* Step-by-Step Learning & Project Roadmap */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <span className="text-xxs uppercase font-black text-emerald-400 tracking-wider">Personalized Project & Placement Roadmap</span>

            <div className="space-y-3">
              {selectedRole.learningRoadmap.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/80 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-snug">{step}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => toast.success(`Learning plan for ${selectedRole.role} synchronized with LMS!`)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs transition shadow-lg"
            >
              Enroll Roadmap into Student LMS Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
