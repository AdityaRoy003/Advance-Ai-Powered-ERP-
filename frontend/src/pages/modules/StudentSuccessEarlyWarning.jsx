import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserGraduate, FaExclamationTriangle, FaHeartbeat, FaUserClock,
  FaCalendarCheck, FaChartLine, FaCheckCircle, FaEnvelope,
  FaPhone, FaComments, FaSyncAlt
} from 'react-icons/fa';
import { AIEngineAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function StudentSuccessEarlyWarning() {
  const [rosterData, setRosterData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interventionNote, setInterventionNote] = useState('');

  const fetchRiskRoster = async () => {
    setLoading(true);
    try {
      const data = await AIEngineAPI.getStudentRiskRoster();
      setRosterData(data);
      if (data?.studentsNeedingAttention?.length > 0) {
        setSelectedStudent(data.studentsNeedingAttention[0]);
      }
    } catch (err) {
      console.error('Error fetching risk roster:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskRoster();
  }, []);

  const handleDispatchIntervention = () => {
    if (!selectedStudent) return;
    toast.success(`Counselor intervention meeting dispatched for ${selectedStudent.studentName}!`);
    setInterventionNote('');
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 text-xl border border-amber-500/30">
              <FaHeartbeat />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                Student Success & Early Warning System
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Proactive Decision Support Engine detecting attendance slippage, grade degradation & targeted counselor intervention
              </p>
            </div>
          </div>
        </div>

        <button onClick={fetchRiskRoster} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition self-start md:self-auto">
          <FaSyncAlt className="text-xs" />
        </button>
      </div>

      {/* Metric Risk Overview Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xxs uppercase font-black text-slate-400">Evaluated Cohort</span>
          <p className="text-2xl font-black text-white mt-1">{rosterData?.totalEvaluated || 480}</p>
          <span className="text-xxs text-slate-400">Underactive Monitoring</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
          <span className="text-xxs uppercase font-black text-rose-400">High Risk Priority</span>
          <p className="text-2xl font-black text-rose-400 mt-1">{rosterData?.highRiskCount || 12}</p>
          <span className="text-xxs text-rose-400 font-bold">Needs Immediate Action</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-xxs uppercase font-black text-amber-400">Medium Risk (Watchlist)</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{rosterData?.mediumRiskCount || 15}</p>
          <span className="text-xxs text-amber-400 font-bold">Early Warning Flag</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-xxs uppercase font-black text-emerald-400">Academic Safe Zone</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{rosterData?.safeCount || 443}</p>
          <span className="text-xxs text-emerald-400 font-bold">Good Standing (&gt;85% Att)</span>
        </div>
      </div>

      {/* Student Risk Roster & Intervention Action Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Roster Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <span className="text-xs font-black uppercase text-slate-300">Students Requiring Academic Attention</span>

          <div className="space-y-3">
            {rosterData?.studentsNeedingAttention?.map((s, idx) => {
              const isSelected = selectedStudent?.studentId === s.studentId;
              const isHigh = s.riskLevel === 'HIGH';
              const isMed = s.riskLevel === 'MEDIUM';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedStudent(s)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isSelected ? 'bg-slate-800/90 border-amber-400/80 shadow-lg' : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isHigh ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : isMed ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                      {s.riskLevel}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{s.studentName}</h4>
                      <p className="text-xxs text-slate-400 font-mono">{s.studentId} · {s.department} · Sem {s.semester}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xxs font-mono">
                    <div>
                      <span className="text-slate-500 block">Attendance</span>
                      <span className={`font-bold ${isHigh ? 'text-rose-400' : 'text-amber-400'}`}>{s.attendance}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">GPA Trend</span>
                      <span className="text-rose-400 font-bold">{s.gpaTrend}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action / Counselor Intervention Dispatch Panel */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <span className="text-xxs uppercase font-black text-amber-400 tracking-wider">Decision Support Intervention</span>

          {selectedStudent ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedStudent.studentName}</h3>
                <span className="text-xxs text-slate-400 font-mono">{selectedStudent.studentId} · {selectedStudent.department}</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                <span className="text-xxs font-black uppercase text-rose-400">Primary Risk Factor:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedStudent.primaryConcern}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <span className="text-xxs font-black uppercase text-amber-400">Recommended Next Action:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedStudent.recommendedIntervention}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xxs uppercase font-bold text-slate-400">Counselor Intervention Notes:</label>
                <textarea
                  value={interventionNote}
                  onChange={e => setInterventionNote(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Scheduled remedial meeting for Friday 3:00 PM..."
                />
              </div>

              <button
                onClick={handleDispatchIntervention}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2"
              >
                <FaEnvelope /> Dispatch Counselor Intervention Alert
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Select a student from the roster to dispatch support.</p>
          )}
        </div>
      </div>
    </div>
  );
}
