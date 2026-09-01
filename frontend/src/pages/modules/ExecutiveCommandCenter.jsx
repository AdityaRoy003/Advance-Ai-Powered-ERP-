import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ExecutiveAPI } from '../../services/api';
import { 
  FaCrown, FaArrowUp, FaArrowDown, FaLightbulb, 
  FaCalculator, FaChartLine, FaRobot, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';

export default function ExecutiveCommandCenter() {
  const [activeTab, setActiveTab] = useState('briefing'); // briefing | what_changed | simulator | recommendations
  const [briefing, setBriefing] = useState(null);
  const [whatChanged, setWhatChanged] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulator State
  const [intakePct, setIntakePct] = useState(20);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const fetchExecutiveData = async () => {
      setLoading(true);
      try {
        const [bRes, wRes, rRes] = await Promise.all([
          ExecutiveAPI.getBriefing(),
          ExecutiveAPI.getWhatChanged(),
          ExecutiveAPI.getRecommendations()
        ]);
        setBriefing(bRes);
        setWhatChanged(wRes);
        setRecommendations(rRes);
      } catch (err) {
        console.error('Executive fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExecutiveData();
  }, []);

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    setSimulating(true);
    try {
      const res = await ExecutiveAPI.simulate({
        scenarioType: 'INTAKE_EXPANSION',
        intakeChangePct: Number(intakePct)
      });
      setSimulationResult(res);
      toast.success('Simulation computed via mathematical models!');
    } catch {
      toast.error('Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xl">
              <FaCrown />
            </span>
            <div>
              <h1 className="text-2xl font-black">Executive Command Center</h1>
              <p className="text-slate-400 text-xs mt-0.5">Institutional Health Matrix, AI Daily Briefings, What-Changed Delta & Simulation Sandbox</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl overflow-x-auto scrollbar-none">
          {[
            { id: 'briefing', label: 'Executive Briefing', icon: <FaCrown /> },
            { id: 'what_changed', label: 'AI What Changed?', icon: <FaChartLine /> },
            { id: 'simulator', label: 'What-If Simulator', icon: <FaCalculator /> },
            { id: 'recommendations', label: 'AI Innovations', icon: <FaLightbulb /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── 1. Executive Briefing ─── */}
      {activeTab === 'briefing' && (
        <div className="flex flex-col gap-6">
          {/* Institutional Health Banner */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xxs font-bold text-amber-400 uppercase tracking-widest">Leadership Intelligence</span>
              <h2 className="text-xl font-black text-white mt-1">Institutional Health Index: {briefing?.kpis?.institutionalHealthIndex || 94.8} / 100</h2>
              <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {briefing?.executiveSummary || 'Campus operations are operating in high-efficiency state with strong fee reconciliation and NAAC readiness.'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xxs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Grade: A++ Ready
              </span>
              <p className="text-xxs text-slate-500 mt-2">Briefing: {briefing?.periodDate || '31 Aug 2026'}</p>
            </div>
          </div>

          {/* KPI Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Enrolled Students</p>
              <p className="text-2xl font-black text-white mt-1">{briefing?.kpis?.totalStudents?.toLocaleString() || '3,420'}</p>
              <span className="text-xxs text-emerald-400 font-semibold mt-1 inline-block">1:18 Faculty Ratio</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Fee Collection Rate</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{briefing?.kpis?.feeCollectionRatePct || 94.2}%</p>
              <span className="text-xxs text-slate-400 mt-1 inline-block">₹1.82 Cr Aug Revenue</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Tier-1 Placements</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{briefing?.kpis?.placementOffersCount || 384} Offers</p>
              <span className="text-xxs text-amber-400 font-semibold mt-1 inline-block">8 New Today</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <p className="text-xxs font-bold text-slate-400 uppercase">Research Grants</p>
              <p className="text-2xl font-black text-purple-400 mt-1">₹4.25 Cr</p>
              <span className="text-xxs text-purple-400 font-semibold mt-1 inline-block">DST & AICTE Grants</span>
            </div>
          </div>

          {/* Highlights & Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
              <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <FaCheckCircle />
                <span>Executive Highlights</span>
              </h3>
              <ul className="space-y-3">
                {briefing?.keyHighlights?.map((h, i) => (
                  <li key={i} className="text-xs text-slate-200 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
              <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
                <FaExclamationTriangle />
                <span>Risk & Attention Signals</span>
              </h3>
              <ul className="space-y-3">
                {briefing?.riskAlerts?.map((a, i) => (
                  <li key={i} className="text-xs text-slate-200 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. AI "What Changed?" Engine ─── */}
      {activeTab === 'what_changed' && (
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-slate-900 to-slate-900">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <FaRobot size={18} />
              </span>
              <div>
                <h2 className="text-base font-bold text-white">Daily Delta Intelligence ("What Changed?")</h2>
                <p className="text-slate-400 text-xs">Automated 24-hour differential telemetry across attendance, finances, admissions & placements</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {whatChanged?.metricDeltas?.map((d, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-[#111827] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className={`p-3 rounded-xl text-sm mt-0.5 ${d.direction === 'UP' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {d.direction === 'UP' ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xxs px-2 py-0.5 rounded bg-slate-800 font-bold text-slate-400 uppercase tracking-wider">{d.category}</span>
                      <h3 className="text-sm font-bold text-white">{d.metric}</h3>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{d.summaryNote}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex md:flex-col items-center md:items-end justify-between">
                  <span className={`text-base font-black ${d.sentiment === 'POSITIVE' ? 'text-emerald-400' : d.sentiment === 'NEGATIVE' ? 'text-rose-400' : 'text-slate-300'}`}>
                    {d.deltaPercentage > 0 ? `+${d.deltaPercentage}%` : `${d.deltaPercentage}%`}
                  </span>
                  <span className="text-xxs font-mono text-slate-500 mt-0.5">
                    {d.previousValue} → {d.currentValue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 3. What-If Simulator ─── */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <FaCalculator className="text-amber-400" />
              <span>Simulation Parameters</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">Estimate multi-variable resource needs without altering production data</p>

            <form onSubmit={handleRunSimulation} className="space-y-4">
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Cohort Intake Expansion (+%)</label>
                <div className="flex items-center gap-3 mt-1">
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    value={intakePct} 
                    onChange={e => setIntakePct(e.target.value)}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-sm font-black text-amber-400 font-mono w-12 text-right">+{intakePct}%</span>
                </div>
                <p className="text-xxs text-slate-500 mt-1">Simulates +{Math.round(3400 * intakePct / 100)} new students</p>
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition shadow-lg shadow-amber-500/20 mt-2"
              >
                {simulating ? 'Computing Equations...' : 'Compute Resource Requirements'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <h2 className="text-base font-bold text-white mb-4">Projected Resource Impact</h2>

            {simulationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xxs text-slate-400 font-bold uppercase">New Student Count</p>
                    <p className="text-xl font-black text-white mt-1">{simulationResult.projectedStudents}</p>
                    <span className="text-xxs text-emerald-400 font-bold">{simulationResult.studentDelta}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xxs text-slate-400 font-bold uppercase">Faculty Needed</p>
                    <p className="text-xl font-black text-amber-400 mt-1">{simulationResult.requiredFaculty}</p>
                    <span className="text-xxs text-slate-500">1:20 Ratio</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xxs text-slate-400 font-bold uppercase">Lecture Halls</p>
                    <p className="text-xl font-black text-purple-400 mt-1">{simulationResult.requiredClassrooms}</p>
                    <span className="text-xxs text-slate-500">60 seats each</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xxs text-slate-400 font-bold uppercase">Hostel Rooms</p>
                    <p className="text-xl font-black text-cyan-400 mt-1">{simulationResult.requiredHostelBeds}</p>
                    <span className="text-xxs text-slate-500">50% Residency</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <p className="font-bold text-emerald-400 mb-1">Projected Annual Financial Surplus</p>
                  <p className="text-2xl font-black text-white font-mono">
                    ₹{simulationResult.financialImpact?.netInstitutionalMarginInr?.toLocaleString()}
                  </p>
                  <p className="text-xxs text-slate-400 mt-1">
                    Gross Revenue: ₹{simulationResult.financialImpact?.additionalGrossRevenueInr?.toLocaleString()} | OpEx: ₹{simulationResult.financialImpact?.estimatedOperatingExpenditureInr?.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">
                Adjust parameter slider on the left and click "Compute Resource Requirements" to execute mathematical model.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── 4. AI Innovation Recommendations ─── */}
      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map(rec => (
            <div key={rec._id || rec.title} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xxs font-bold px-2 py-0.5 rounded-full border ${rec.impactLevel === 'TRANSFORMATIVE' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                    {rec.impactLevel} Impact
                  </span>
                  <span className="text-xxs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                    {rec.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{rec.title}</h3>
                
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 mb-4 text-xs">
                  <div>
                    <span className="text-xxs font-bold text-slate-500 uppercase">Observation:</span>
                    <p className="text-slate-300 mt-0.5">{rec.observation}</p>
                  </div>
                  <div>
                    <span className="text-xxs font-bold text-amber-400 uppercase">AI Suggestion:</span>
                    <p className="text-slate-200 mt-0.5">{rec.suggestion}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xxs">
                <span className="text-slate-400">{rec.departmentScope}</span>
                <span className="font-bold text-emerald-400 font-mono">Est. Save ₹{rec.estimatedCostSavingInr?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
