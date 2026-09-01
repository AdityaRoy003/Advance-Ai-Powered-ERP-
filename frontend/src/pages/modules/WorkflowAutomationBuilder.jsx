import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AutomationAPI } from '../../services/api';
import { 
  FaCogs, FaPlus, FaBolt, FaFilter, FaPaperPlane, 
  FaToggleOn, FaToggleOff, FaCheckCircle, FaPlay, FaRobot 
} from 'react-icons/fa';

export default function WorkflowAutomationBuilder() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  const [ruleName, setRuleName] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('ATTENDANCE_DROPPED_BELOW_75');
  const [conditionField, setConditionField] = useState('attendancePercentage');
  const [conditionOp, setConditionOp] = useState('LESS_THAN');
  const [conditionVal, setConditionVal] = useState('75');
  const [actionType, setActionType] = useState('NOTIFY_PARENT');
  const [actionRole, setActionRole] = useState('PARENT');

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await AutomationAPI.getWorkflows();
      setWorkflows(res);
    } catch (err) {
      console.error('Workflows error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleToggle = async (id) => {
    try {
      await AutomationAPI.toggleWorkflow(id);
      toast.success('Workflow state updated');
      fetchWorkflows();
    } catch {
      toast.error('Failed to toggle workflow');
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!ruleName.trim()) {
      toast.error('Workflow name is required');
      return;
    }

    try {
      await AutomationAPI.createWorkflow({
        name: ruleName,
        description: ruleDesc || 'Automated multi-step event trigger rule',
        triggerEvent,
        conditions: [{ field: conditionField, operator: conditionOp, value: conditionVal }],
        actions: [{ actionType, recipientRole: actionRole, payloadTemplate: `Automated alert dispatched via ${actionType}.` }],
        isActive: true
      });
      toast.success('Visual workflow deployed to autonomous engine!');
      setShowBuilderModal(false);
      setRuleName('');
      setRuleDesc('');
      fetchWorkflows();
    } catch {
      toast.error('Failed to create workflow rule');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xl">
              <FaCogs />
            </span>
            <div>
              <h1 className="text-2xl font-black">Autonomous Workflow Builder</h1>
              <p className="text-slate-400 text-xs mt-0.5">Visual Trigger-Condition-Action automation pipeline (Zapier-style for campus ERP)</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowBuilderModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-lg shadow-cyan-500/20"
        >
          <FaPlus />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Active Workflows</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{workflows.filter(w => w.isActive).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Total Autonomous Triggers</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{workflows.reduce((s, w) => s + (w.executionCount || 0), 0)}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Avg Execution Latency</p>
          <p className="text-2xl font-black text-white mt-1">12 ms</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Engine Status</p>
          <p className="text-2xl font-black text-purple-400 mt-1">Autonomous</p>
        </div>
      </div>

      {/* Visual Workflow Cards */}
      <div className="space-y-4">
        {workflows.map(w => (
          <div key={w._id || w.name} className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white">{w.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold ${w.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {w.isActive ? 'Active Pipeline' : 'Paused'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{w.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xxs font-mono text-slate-500">Triggered {w.executionCount || 0} times</span>
                <button
                  onClick={() => handleToggle(w._id)}
                  className="text-2xl transition"
                >
                  {w.isActive ? <FaToggleOn className="text-cyan-400" /> : <FaToggleOff className="text-slate-600" />}
                </button>
              </div>
            </div>

            {/* Visual Flow Stages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-2">
              {/* Stage 1: WHEN Trigger */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                  <FaBolt size={14} />
                </span>
                <div>
                  <span className="text-xxs font-bold text-cyan-400 uppercase tracking-wider">1. WHEN Event Occurs</span>
                  <p className="text-xs font-mono font-bold text-white mt-1">{w.triggerEvent}</p>
                </div>
              </div>

              {/* Stage 2: CHECK Condition */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                  <FaFilter size={14} />
                </span>
                <div>
                  <span className="text-xxs font-bold text-amber-400 uppercase tracking-wider">2. CHECK Conditions</span>
                  <p className="text-xs font-bold text-white mt-1">
                    {w.conditions?.[0]?.field || 'criteria'} {w.conditions?.[0]?.operator === 'LESS_THAN' ? '<' : '>'} {w.conditions?.[0]?.value}
                  </p>
                </div>
              </div>

              {/* Stage 3: DISPATCH Actions */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                  <FaPaperPlane size={14} />
                </span>
                <div>
                  <span className="text-xxs font-bold text-purple-400 uppercase tracking-wider">3. DISPATCH Action</span>
                  <p className="text-xs font-bold text-white mt-1">
                    {w.actions?.[0]?.actionType} → <span className="text-purple-300">{w.actions?.[0]?.recipientRole}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Builder Modal */}
      {showBuilderModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-slate-800 bg-[#111827] p-6 max-w-lg w-full">
            <h2 className="text-lg font-bold text-white mb-4">Build Visual Autonomous Workflow</h2>
            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Workflow Name</label>
                <input value={ruleName} onChange={e => setRuleName(e.target.value)} placeholder="e.g. Fee Overdue Auto-Escalation" className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Trigger Event</label>
                <select value={triggerEvent} onChange={e => setTriggerEvent(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                  <option value="ATTENDANCE_DROPPED_BELOW_75">ATTENDANCE_DROPPED_BELOW_75</option>
                  <option value="FEE_OVERDUE_15_DAYS">FEE_OVERDUE_15_DAYS</option>
                  <option value="NEW_STUDENT_ADMISSION">NEW_STUDENT_ADMISSION</option>
                  <option value="EXAM_GRADE_FAIL_THRESHOLD">EXAM_GRADE_FAIL_THRESHOLD</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xxs font-bold text-slate-400 uppercase">Condition Operator</label>
                  <select value={conditionOp} onChange={e => setConditionOp(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                    <option value="LESS_THAN">LESS THAN (&lt;)</option>
                    <option value="GREATER_THAN">GREATER THAN (&gt;)</option>
                    <option value="EQUALS">EQUALS (==)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xxs font-bold text-slate-400 uppercase">Target Value</label>
                  <input value={conditionVal} onChange={e => setConditionVal(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xxs font-bold text-slate-400 uppercase">Dispatch Action</label>
                  <select value={actionType} onChange={e => setActionType(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                    <option value="NOTIFY_PARENT">NOTIFY PARENT (SMS/WhatsApp)</option>
                    <option value="DISPATCH_COUNSELOR">DISPATCH COUNSELOR (Task)</option>
                    <option value="CREATE_TASK">CREATE TASK (Finance/Admin)</option>
                    <option value="SEND_EMAIL">SEND EMAIL</option>
                  </select>
                </div>
                <div>
                  <label className="text-xxs font-bold text-slate-400 uppercase">Target Role</label>
                  <select value={actionRole} onChange={e => setActionRole(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                    <option value="PARENT">PARENT</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="TEACHER">TEACHER</option>
                    <option value="FINANCE_OFFICER">FINANCE OFFICER</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Description / Notes</label>
                <textarea rows={2} value={ruleDesc} onChange={e => setRuleDesc(e.target.value)} placeholder="Explain the business rule rationale..." className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowBuilderModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs">Deploy Pipeline</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
