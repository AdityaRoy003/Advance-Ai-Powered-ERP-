import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  FaUserShield, FaFlask, FaCheckCircle, FaExclamationTriangle,
  FaTimesCircle, FaHistory, FaUndo, FaShieldAlt, FaUsers,
  FaLock, FaCheck, FaTimes, FaLayerGroup, FaArrowRight,
  FaFileCode, FaCogs, FaSave, FaExclamationCircle
} from 'react-icons/fa';
import { PolicySimulatorAPI } from '../../services/api';

const SYSTEM_MODULES = [
  'Students', 'Attendance', 'Finance', 'Exams', 'Assignments',
  'Library', 'Hostel', 'Transport', 'Timetable', 'Announcements',
  'Leave Requests', 'Placement', 'HR & Payroll', 'Analytics',
  'SIEM Logs', 'System Config', 'Audit Trails', 'Courses'
];

const ACTIONS = ['Create', 'Read', 'Update', 'Delete', 'Approve'];

const DEFAULT_PERMS = {
  TEACHER: {
    Exams: { Create: true, Read: true, Update: true, Delete: false, Approve: false },
    Assignments: { Create: true, Read: true, Update: true, Delete: false, Approve: false },
    Attendance: { Create: true, Read: true, Update: true, Delete: false, Approve: false },
    Finance: { Create: false, Read: false, Update: false, Delete: false, Approve: false }
  },
  ADMIN: {
    Finance: { Create: true, Read: true, Update: true, Delete: false, Approve: true },
    Students: { Create: true, Read: true, Update: true, Delete: true, Approve: true }
  }
};

export default function PolicySimulator() {
  const [selectedRole, setSelectedRole] = useState('TEACHER');
  const [permissions, setPermissions] = useState(DEFAULT_PERMS.TEACHER);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [versions, setVersions] = useState([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [highRiskChangeRequested, setHighRiskChangeRequested] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load version history on mount
  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const data = await PolicySimulatorAPI.getVersions();
      if (Array.isArray(data)) setVersions(data);
    } catch (err) {
      console.error('Failed to load policy versions:', err);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setPermissions(DEFAULT_PERMS[role] || {
      Finance: { Create: false, Read: false, Update: false, Delete: false, Approve: false }
    });
    setSimulationResult(null);
  };

  const toggleAction = (mod, act) => {
    setPermissions(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [act]: !prev[mod]?.[act]
      }
    }));
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const payload = {
        role: selectedRole,
        proposedPermissions: permissions,
        featureFlags: { enableAIAutoGrading: true, directFeeRefunds: permissions?.Finance?.Approve || false },
        workflowModifications: { dualSignatureRequired: true }
      };

      const result = await PolicySimulatorAPI.simulate(payload);
      setSimulationResult(result);
      if (result.riskAssessment?.overallRisk === 'CRITICAL' || result.riskAssessment?.overallRisk === 'HIGH') {
        toast.error(`High Risk Policy Detected (${result.riskAssessment.riskScore}/100). Approval Gate Required.`);
      } else {
        toast.success('Simulation completed successfully! Preview impact deltas below.');
      }
    } catch (err) {
      toast.error('Simulation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCommitPolicy = async () => {
    if (simulationResult?.riskAssessment?.requiresDualApproval && !approvalNote.trim()) {
      setHighRiskChangeRequested(true);
      return;
    }

    setIsSaving(true);
    try {
      const newVersion = {
        role: selectedRole,
        permissions,
        description: `Policy update for ${selectedRole} via Simulator`,
        author: 'Super Admin',
        riskScore: simulationResult?.riskAssessment?.riskScore || 20
      };

      await PolicySimulatorAPI.saveVersion(newVersion);
      toast.success('Policy version committed and activated in runtime RBAC!');
      setHighRiskChangeRequested(false);
      setApprovalNote('');
      fetchVersions();
    } catch (err) {
      toast.error('Failed to save policy version: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollback = async (versionId) => {
    try {
      const res = await PolicySimulatorAPI.rollback(versionId);
      toast.success(res.message || 'Successfully rolled back to policy version!');
      fetchVersions();
    } catch (err) {
      toast.error('Rollback failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-8 border border-purple-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FaShieldAlt className="text-9xl text-purple-400" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-wider">
              <FaFlask /> Enterprise Security Core
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              Policy Simulator & Permission Impact Analyzer
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Preview policy effects, detect Segregation of Duties (SOD) conflicts, test assertions against synthetic personas, and preview workflow disruptions before committing changes.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition"
            >
              <FaHistory /> Version History & Rollback ({versions.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Config / Right Simulator Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Policy Workbench */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col gap-5 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FaUserShield className="text-purple-400" /> Step 1: Select Target Role
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {['TEACHER', 'ADMIN', 'STUDENT', 'PARENT', 'HR_MANAGER', 'FINANCE_OFFICER'].map(r => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition border text-center ${
                    selectedRole === r
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Proposed Permission Delta
                </h3>
                <span className="text-xxs text-slate-400">Click to flip permission</span>
              </div>

              {/* Module Matrix Quick Editor */}
              <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
                {SYSTEM_MODULES.slice(0, 8).map(module => (
                  <div key={module} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-200">{module}</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {ACTIONS.map(action => {
                        const isGranted = !!permissions[module]?.[action];
                        return (
                          <button
                            key={action}
                            onClick={() => toggleAction(module, action)}
                            className={`px-2.5 py-1 rounded text-xxs font-bold transition flex items-center gap-1 border ${
                              isGranted
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                            }`}
                          >
                            {isGranted ? <FaCheck size={8} /> : <FaTimes size={8} />}
                            {action}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Simulator Trigger */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Security Blast Radius...
                </>
              ) : (
                <>
                  <FaFlask /> Run Impact Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Simulation Telemetry & Impact Analysis */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {!simulationResult ? (
            <div className="h-full min-h-[420px] rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-900/30">
              <FaShieldAlt className="text-5xl text-slate-700 mb-3" />
              <h3 className="text-base font-bold text-slate-300">No Simulation Executed</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select your proposed changes on the left and click "Run Impact Simulation" to calculate access deltas, toxic SOD combinations, and workflow triggers.
              </p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
              {/* Risk Assessment Banner */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                simulationResult.riskAssessment?.overallRisk === 'CRITICAL' || simulationResult.riskAssessment?.overallRisk === 'HIGH'
                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                  : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                    simulationResult.riskAssessment?.overallRisk === 'CRITICAL' || simulationResult.riskAssessment?.overallRisk === 'HIGH'
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {simulationResult.riskAssessment?.riskScore || 0}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wide">
                      Blast Radius: {simulationResult.riskAssessment?.overallRisk} RISK
                    </h4>
                    <p className="text-xs opacity-80 mt-0.5">
                      {simulationResult.riskAssessment?.requiresDualApproval
                        ? 'Mandatory 4-Eyes Principal: Requires explicit Approval Gate before activation.'
                        : 'Low-risk changes detected. Safe for direct autonomous deployment.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCommitPolicy}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2"
                >
                  <FaSave /> Commit Policy
                </button>
              </div>

              {/* Persona Automated Test Assertions */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <FaCheckCircle className="text-indigo-400" /> Automated Test Persona Assertions
                </h3>
                <div className="space-y-2">
                  {simulationResult.scenarioResults?.map((sc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          sc.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {sc.passed ? '✓' : '✕'}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{sc.scenarioName}</p>
                          <span className="text-xxs text-slate-400">Assert: {sc.expectedOutcome}</span>
                        </div>
                      </div>
                      <span className={`text-xxs font-bold px-2.5 py-0.5 rounded-full ${
                        sc.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {sc.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Segregation of Duties (SOD) Conflicts */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <FaExclamationTriangle className="text-amber-400" /> Segregation of Duties (SOD) Conflicts
                </h3>
                {simulationResult.conflicts?.length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xxs text-emerald-400 flex items-center gap-2">
                    <FaCheckCircle /> Zero toxic permission combinations detected. Separation of powers intact.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {simulationResult.conflicts?.map((cf, i) => (
                      <div key={i} className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 flex items-start gap-3">
                        <FaExclamationCircle className="text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-amber-200">{cf.ruleTitle || 'Conflicting Privilege'}</p>
                          <p className="text-xxs text-amber-300/80 mt-0.5">{cf.description || cf.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Affected Users & Workflow Impacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                    <FaUsers className="text-sky-400" /> Users Gaining Access
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {simulationResult.usersGainingAccess?.map((u, i) => (
                      <div key={i} className="p-2 rounded bg-slate-950 text-xxs text-slate-300 flex justify-between">
                        <span>{u.name || u.email}</span>
                        <span className="text-emerald-400 font-bold">+{u.deltaModule}</span>
                      </div>
                    )) || <span className="text-xxs text-slate-500">None detected</span>}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                    <FaCogs className="text-pink-400" /> Workflow & Feature-Flag Impacts
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {simulationResult.workflowImpacts?.map((wf, i) => (
                      <div key={i} className="p-2 rounded bg-slate-950 text-xxs text-slate-300 flex justify-between">
                        <span>{wf.workflowName}</span>
                        <span className="text-purple-400 font-bold">{wf.effect}</span>
                      </div>
                    )) || <span className="text-xxs text-slate-500">No workflow interruption</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Version History Modal / Drawer */}
      <AnimatePresence>
        {showVersionHistory && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <FaHistory className="text-purple-400" /> Policy Version History & Instant Rollback
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Audit snapshot ledger of all committed role configurations</p>
                </div>
                <button onClick={() => setShowVersionHistory(false)} className="text-slate-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>

              <div className="overflow-y-auto py-4 space-y-3">
                {versions.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">No historical policy versions recorded yet.</p>
                ) : (
                  versions.map((ver, idx) => (
                    <div key={ver._id || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{ver.role}</span>
                          <span className="text-xxs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded font-mono">
                            v{ver.versionNumber || (idx + 1)}
                          </span>
                          <span className="text-xxs text-slate-400">
                            {new Date(ver.createdAt || Date.now()).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xxs text-slate-400">{ver.description || 'Standard policy update'}</p>
                      </div>

                      <button
                        onClick={() => handleRollback(ver._id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <FaUndo size={11} /> Rollback
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* High-Risk Dual Approval Modal */}
      <AnimatePresence>
        {highRiskChangeRequested && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 rounded-3xl border border-rose-800/80 p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <FaExclamationTriangle className="text-2xl" />
                <h3 className="text-lg font-black text-white">4-Eyes Dual Approval Required</h3>
              </div>
              <p className="text-xs text-slate-300">
                This policy modification exceeds the security risk threshold (Risk Score: {simulationResult?.riskAssessment?.riskScore}/100). Please provide justification for the audit log before requesting authorization.
              </p>
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Reason for high-privilege elevation or SOD override..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                rows={3}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setHighRiskChangeRequested(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitPolicy}
                  disabled={!approvalNote.trim()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg disabled:opacity-50"
                >
                  Authorize & Commit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
