import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUniversity, FaCheckCircle, FaAward, FaChartBar,
  FaFileSignature, FaLayerGroup, FaEdit, FaSyncAlt
} from 'react-icons/fa';
import { AccreditationAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AccreditationOBECenter() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('naac'); // naac | obe

  const fetchAccreditation = async () => {
    setLoading(true);
    try {
      const data = await AccreditationAPI.getReport();
      setReport(data);
    } catch (err) {
      console.error('Error fetching accreditation metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccreditation();
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-xl border border-blue-500/30">
              <FaUniversity />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Accreditation & Outcome-Based Education (OBE)
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                NAAC Criteria 1–7 Compliance, NBA Attainment & CO-PO-PSO Outcome Mapping Matrix
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('naac')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'naac' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
          >
            NAAC Criteria Center
          </button>
          <button
            onClick={() => setActiveTab('obe')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'obe' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
          >
            OBE (CO-PO Attainment)
          </button>
          <button onClick={fetchAccreditation} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition">
            <FaSyncAlt className="text-xs" />
          </button>
        </div>
      </div>

      {activeTab === 'naac' ? (
        <div className="space-y-6">
          {/* Readiness Score Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xxs uppercase font-black text-cyan-400 tracking-wider">Institutional Institutional Readiness Index</span>
              <h3 className="text-2xl font-black text-white mt-0.5">NAAC Grade Assessment: A++ Grade Readiness</h3>
              <p className="text-xs text-slate-300 mt-1">All 7 Quality Criteria verified against digital institutional repository evidence.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-cyan-400 font-mono">{report?.overallReadiness || 86.4}%</span>
              <span className="text-xxs uppercase text-slate-400 block font-mono">Institutional Score</span>
            </div>
          </div>

          {/* Criteria 1 - 7 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {report?.criteriaList?.map((crit, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 text-xxs font-mono font-bold">
                    Criterion {crit.criterionNumber}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{crit.progressPercentage}% Complete</span>
                </div>

                <h4 className="text-sm font-bold text-white">{crit.title}</h4>

                <div className="space-y-1">
                  <div className="flex justify-between text-xxs text-slate-400 font-mono">
                    <span>Target: {crit.targetScore} pts</span>
                    <span>Achieved: <strong className="text-white">{crit.currentScore} pts</strong></span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${crit.progressPercentage}%` }} />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 text-xxs font-mono text-slate-400">
                  <span>HOD: {crit.responsibleHOD}</span>
                  <span className="text-cyan-400 font-bold">{crit.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Outcome-Based Education (OBE) Matrix */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div>
              <span className="text-xxs uppercase font-black text-indigo-400 tracking-wider">Outcome Attainment Engine</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{report?.obeMatrix?.courseCode || 'CSE-401 (Distributed Cloud AI)'}</h3>
            </div>

            {/* Course Outcomes (CO) Matrix */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Course Outcomes (CO) Attainment:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report?.obeMatrix?.courseOutcomes?.map((co, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-black text-indigo-400 font-mono">{co.coCode}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{co.actualAttainment}%</span>
                    </div>
                    <p className="text-xxs text-slate-300 leading-snug">{co.description}</p>
                    <span className="text-xxs text-slate-500 font-mono block">Target: {co.targetAttainment}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Outcomes (PO) Matrix */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">Program Outcomes (PO / PSO) Mapping:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report?.obeMatrix?.programOutcomes?.map((po, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-black text-cyan-400 font-mono">{po.poCode}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{po.actualAttainment}%</span>
                    </div>
                    <p className="text-xxs text-slate-300 leading-snug">{po.description}</p>
                    <span className="text-xxs text-slate-500 font-mono block">Target: {po.targetAttainment}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
