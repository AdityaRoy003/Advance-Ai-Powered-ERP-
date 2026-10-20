import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaUserShield, FaCheck, FaTimes, FaPlus, FaEdit, FaSave, 
  FaTrash, FaLock, FaUnlock, FaFilter, FaBuilding, FaUsers, 
  FaTree, FaLayerGroup, FaBan, FaGlobe, FaFlask
} from 'react-icons/fa';
import PolicySimulator from './PolicySimulator';

// ─── SYSTEM MODULES (RBAC Matrix rows) ───
const SYSTEM_MODULES = [
  'Students',
  'Attendance',
  'Finance',
  'Exams',
  'Assignments',
  'Library',
  'Hostel',
  'Transport',
  'Timetable',
  'Announcements',
  'Leave Requests',
  'Placement',
  'HR & Payroll',
  'Analytics',
  'SIEM Logs',
  'System Config',
  'Audit Trails',
  'Courses'
];

const ACTIONS = ['Create', 'Read', 'Update', 'Delete', 'Approve'];

// ─── DEFAULT ROLE PERMISSIONS ───
const DEFAULT_ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.fromEntries(SYSTEM_MODULES.map(m => [m, { Create: true, Read: true, Update: true, Delete: true, Approve: true }])),
  ADMIN: Object.fromEntries(SYSTEM_MODULES.map(m => [m, { Create: true, Read: true, Update: true, Delete: false, Approve: m !== 'SIEM Logs' && m !== 'System Config' }])),
  TEACHER: Object.fromEntries(SYSTEM_MODULES.map(m => [m, { Create: ['Exams','Assignments','Timetable','Announcements'].includes(m), Read: true, Update: ['Exams','Assignments','Attendance'].includes(m), Delete: false, Approve: false }])),
  STUDENT: Object.fromEntries(SYSTEM_MODULES.map(m => [m, { Create: false, Read: ['Exams','Assignments','Library','Timetable','Hostel','Transport','Announcements','Courses'].includes(m), Update: false, Delete: false, Approve: false }])),
  PARENT: Object.fromEntries(SYSTEM_MODULES.map(m => [m, { Create: false, Read: ['Students','Attendance','Finance','Exams','Assignments','Timetable','Hostel','Transport','Announcements'].includes(m), Update: false, Delete: false, Approve: false }])),
  HR_MANAGER: Object.fromEntries(SYSTEM_MODULES.map(m => [m, { Create: ['HR & Payroll', 'Leave Requests'].includes(m), Read: true, Update: ['HR & Payroll', 'Leave Requests', 'Attendance'].includes(m), Delete: false, Approve: ['Leave Requests', 'HR & Payroll'].includes(m) }])),
  EMPLOYEE: Object.fromEntries(SYSTEM_MODULES.map(m => [m, { Create: false, Read: ['Timetable', 'Announcements', 'Leave Requests'].includes(m), Update: false, Delete: false, Approve: false }]))
};

// ─── DATA-LEVEL ACCESS CONTROL ───
const DEFAULT_DATA_SCOPE = {
  TEACHER: {
    description: 'Class-level access — only assigned sections',
    scopes: [
      { type: 'Department', value: 'CSE', allowed: true },
      { type: 'Semester', value: 'Semester 4', allowed: true },
      { type: 'Section', value: 'Section A', allowed: true },
      { type: 'Section', value: 'Section B', allowed: true },
      { type: 'Department', value: 'ECE', allowed: false },
      { type: 'Department', value: 'Mechanical', allowed: false },
      { type: 'Module', value: 'Finance', allowed: false },
      { type: 'Module', value: 'HR', allowed: false }
    ]
  },
  ADMIN: {
    description: 'Institution-wide access — all departments',
    scopes: [
      { type: 'Institution', value: 'EduVerse Central University', allowed: true },
      { type: 'All Departments', value: 'All Departments', allowed: true }
    ]
  },
  PARENT: {
    description: 'Child-scoped access — only registered wards',
    scopes: [
      { type: 'Student', value: 'Own Children Only', allowed: true },
      { type: 'Module', value: 'Financial Details of Other Students', allowed: false },
      { type: 'Module', value: 'Staff/HR Records', allowed: false }
    ]
  }
};

export default function PermissionsManager() {
  const [activeSection, setActiveSection] = useState('rbac_matrix'); // rbac_matrix | user_specific | data_scope | dept_restrictions
  const [selectedRole, setSelectedRole] = useState('TEACHER');
  const [permissions, setPermissions] = useState({ ...DEFAULT_ROLE_PERMISSIONS });
  const [userOverrides, setUserOverrides] = useState([
    { id: 'uo-1', userId: 'teacher-042', name: 'Dr. Arjun Mehta', role: 'TEACHER', overrides: { Finance: { Read: true }, 'HR & Payroll': { Read: true } }, reason: 'Temporary HOD duties' },
    { id: 'uo-2', userId: 'emp-011', name: 'Priya Sharma', role: 'EMPLOYEE', overrides: { Analytics: { Read: true } }, reason: 'Project reporting access' }
  ]);
  const [newOverrideName, setNewOverrideName] = useState('');
  const [newOverrideRole, setNewOverrideRole] = useState('TEACHER');
  const [newOverrideModule, setNewOverrideModule] = useState('Finance');
  const [newOverrideAction, setNewOverrideAction] = useState('Read');
  const [newOverrideReason, setNewOverrideReason] = useState('');

  // Dept restrictions state
  const [deptRestrictions, setDeptRestrictions] = useState([
    { id: 'dr-1', role: 'TEACHER', name: 'Dr. Nair', allowedDepts: ['CSE'], blockedDepts: ['ECE', 'MECH'] },
    { id: 'dr-2', role: 'TEACHER', name: 'Prof. Kumar', allowedDepts: ['ECE', 'MECH'], blockedDepts: ['CSE'] }
  ]);

  const togglePermission = (module, action) => {
    const current = permissions[selectedRole]?.[module]?.[action];
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [module]: {
          ...prev[selectedRole]?.[module],
          [action]: !current
        }
      }
    }));
  };

  const handleSavePermissions = () => {
    toast.success(`Permission matrix for ${selectedRole} saved successfully!`);
  };

  const handleAddUserOverride = (e) => {
    e.preventDefault();
    if (!newOverrideName) return;
    const newOv = {
      id: `uo-${Date.now()}`,
      userId: `usr-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: newOverrideName,
      role: newOverrideRole,
      overrides: { [newOverrideModule]: { [newOverrideAction]: true } },
      reason: newOverrideReason
    };
    setUserOverrides([newOv, ...userOverrides]);
    setNewOverrideName('');
    setNewOverrideReason('');
    toast.success(`User-level permission override granted to ${newOverrideName}!`);
  };

  const getRoleColor = (role) => {
    const map = { SUPER_ADMIN: 'text-rose-400', ADMIN: 'text-indigo-400', TEACHER: 'text-emerald-400', STUDENT: 'text-sky-400', PARENT: 'text-pink-400', HR_MANAGER: 'text-purple-400', EMPLOYEE: 'text-amber-400' };
    return map[role] || 'text-slate-400';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
        <span className="text-violet-400 font-bold uppercase tracking-widest text-xxs">Enterprise Access Control</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Permission Management Center</h1>
        <p className="text-slate-400 text-sm mt-1">Role-based access matrix, user-level overrides, data-scope restrictions, and department isolation.</p>
      </div>

      {/* Section Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'rbac_matrix', label: 'RBAC Module Matrix', icon: <FaLayerGroup /> },
          { id: 'policy_simulator', label: 'Policy Simulator & Impact Analyzer', icon: <FaFlask /> },
          { id: 'user_specific', label: 'User-Specific Overrides', icon: <FaUsers /> },
          { id: 'data_scope', label: 'Data-Level Access Control', icon: <FaTree /> },
          { id: 'dept_restrictions', label: 'Department & Institution Restrictions', icon: <FaBuilding /> }
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap text-xs transition ${
              activeSection === s.id ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* ─── SECTION 1: RBAC MATRIX ─── */}
      {activeSection === 'rbac_matrix' && (
        <div className="flex flex-col gap-6">
          {/* Role Selector */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-bold text-white flex items-center gap-2"><FaUserShield /> Select Role to Configure:</span>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(DEFAULT_ROLE_PERMISSIONS).map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition border ${selectedRole === role ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  {role.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix Table */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#111827]/60 shadow-xl flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Module Permissions — <span className={`font-black ${getRoleColor(selectedRole)}`}>{selectedRole.replace(/_/g, ' ')}</span></h2>
                <p className="text-xxs text-slate-400 mt-0.5">Toggle cells to grant or revoke access per action type.</p>
              </div>
              <button onClick={handleSavePermissions} className="self-start sm:self-auto bg-violet-600 hover:bg-violet-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition">
                <FaSave /> Save Permissions
              </button>
            </div>

            <div className="w-full overflow-x-auto scrollbar-thin pb-2">
              <table className="w-full min-w-[520px] border-collapse text-xxs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left pb-3 pr-4 font-bold text-slate-400 uppercase tracking-wider w-40">Module</th>
                  {ACTIONS.map(a => (
                    <th key={a} className="text-center pb-3 px-3 font-bold text-slate-400 uppercase tracking-wider">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {SYSTEM_MODULES.map(module => (
                  <tr key={module} className="hover:bg-slate-800/20 transition">
                    <td className="py-2.5 pr-4 font-bold text-slate-200 text-xs">{module}</td>
                    {ACTIONS.map(action => {
                      const enabled = permissions[selectedRole]?.[module]?.[action] || false;
                      return (
                        <td key={action} className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => togglePermission(module, action)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition border font-bold ${
                              enabled 
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30' 
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
                            }`}
                          >
                            {enabled ? <FaCheck size={10} /> : <FaTimes size={10} />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── POLICY SIMULATOR & IMPACT ANALYZER ─── */}
      {activeSection === 'policy_simulator' && (
        <div className="pt-2">
          <PolicySimulator />
        </div>
      )}

      {/* ─── SECTION 2: USER-SPECIFIC OVERRIDES ─── */}
      {activeSection === 'user_specific' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaUsers className="text-violet-400" /> Active User-Specific Permission Overrides</h2>
              <p className="text-xxs text-slate-400">These grant specific users access beyond their role definition, or restrict certain actions.</p>
              <div className="flex flex-col gap-3">
                {userOverrides.map(ov => (
                  <div key={ov.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{ov.name}</span>
                        <span className={`text-xxs font-mono font-bold px-2 py-0.5 rounded ${getRoleColor(ov.role)} bg-slate-800`}>{ov.role}</span>
                      </div>
                      <span className="text-xxs text-slate-400 font-mono">ID: {ov.userId}</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Object.entries(ov.overrides).map(([mod, acts]) => (
                          Object.entries(acts).map(([act, val]) => (
                            <span key={`${mod}-${act}`} className={`px-2 py-0.5 rounded text-xxs font-bold font-mono ${val ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {mod} → {act}
                            </span>
                          ))
                        ))}
                      </div>
                      {ov.reason && <span className="text-xxs text-slate-500 italic mt-0.5">Reason: {ov.reason}</span>}
                    </div>
                    <button onClick={() => { setUserOverrides(userOverrides.filter(u => u.id !== ov.id)); toast.success('Override revoked'); }} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPlus className="text-violet-400" /> Grant User Override</h2>
              <form onSubmit={handleAddUserOverride} className="flex flex-col gap-3">
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">User Full Name</label>
                  <input type="text" value={newOverrideName} onChange={e => setNewOverrideName(e.target.value)} placeholder="e.g. Dr. Arjun Mehta" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Role</label>
                    <select value={newOverrideRole} onChange={e => setNewOverrideRole(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold">
                      {Object.keys(DEFAULT_ROLE_PERMISSIONS).map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Module</label>
                    <select value={newOverrideModule} onChange={e => setNewOverrideModule(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold">
                      {SYSTEM_MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Action to Grant</label>
                  <select value={newOverrideAction} onChange={e => setNewOverrideAction(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold">
                    {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Justification</label>
                  <input type="text" value={newOverrideReason} onChange={e => setNewOverrideReason(e.target.value)} placeholder="e.g. Temporary HOD designation" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
                </div>
                <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-xl text-xs">
                  Grant User Override
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 3: DATA-LEVEL ACCESS CONTROL ─── */}
      {activeSection === 'data_scope' && (
        <div className="flex flex-col gap-6">
          <div className="p-4 rounded-2xl border border-amber-700/40 bg-amber-500/5">
            <p className="text-amber-300 text-xs font-bold">⚠ Data-Level Authorization — This controls WHICH records a user can access, not just which modules.</p>
            <p className="text-amber-400/70 text-xxs mt-1">Example: Teacher A can see only CSE Semester 4 sections. Parent can see only their own children's records.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(DEFAULT_DATA_SCOPE).map(([role, config]) => (
              <div key={role} className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
                <div>
                  <span className={`font-black text-sm ${getRoleColor(role)}`}>{role.replace(/_/g, ' ')}</span>
                  <p className="text-xxs text-slate-400 mt-0.5">{config.description}</p>
                </div>

                {/* Visual access tree */}
                <div className="flex flex-col gap-2">
                  {config.scopes.map((scope, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${scope.allowed ? 'bg-emerald-500/8 border border-emerald-500/20' : 'bg-rose-500/8 border border-rose-500/20'}`}>
                      <span className={`text-sm ${scope.allowed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {scope.allowed ? <FaUnlock /> : <FaLock />}
                      </span>
                      <div>
                        <span className={`font-bold text-xxs ${scope.allowed ? 'text-emerald-300' : 'text-rose-300'}`}>{scope.allowed ? '✓ ALLOWED' : '✕ DENIED'}</span>
                        <span className="text-xs text-white block">{scope.type}: {scope.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Authorization flow diagram */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Role-Aware AI Authorization Flow</h2>
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              {['User', '→', 'Role', '→', 'Permissions', '→', 'AI Authorization Layer', '→', 'Scoped Data Retrieval', '→', 'LLM Response'].map((step, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-lg font-bold ${step === '→' ? 'text-slate-500' : 'bg-slate-900 border border-slate-700 text-indigo-300'}`}>
                  {step}
                </span>
              ))}
            </div>
            <p className="text-xxs text-slate-400">The LLM never makes access decisions. Only pre-authorized, role-scoped data is passed to the model as context.</p>
          </div>
        </div>
      )}

      {/* ─── SECTION 4: DEPARTMENT & INSTITUTION RESTRICTIONS ─── */}
      {activeSection === 'dept_restrictions' && (
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaBuilding className="text-indigo-400" /> Department-Level Access Restrictions</h2>
            <div className="flex flex-col gap-3">
              {deptRestrictions.map(dr => (
                <div key={dr.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{dr.name}</span>
                      <span className={`text-xxs font-mono font-bold px-2 py-0.5 rounded ${getRoleColor(dr.role)} bg-slate-800`}>{dr.role}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xxs text-slate-400 font-sans">Allowed:</span>
                    {dr.allowedDepts.map(d => (
                      <span key={d} className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xxs font-bold">✓ {d}</span>
                    ))}
                    <span className="text-xxs text-slate-400 font-sans ml-2">Blocked:</span>
                    {dr.blockedDepts.map(d => (
                      <span key={d} className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-xxs font-bold">✕ {d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institution restrictions */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><FaGlobe className="text-teal-400" /> Multi-Tenant Institution Restrictions</h2>
            <p className="text-xxs text-slate-400">Cross-institution data isolation ensures College A records are never visible to College B administrators unless explicitly granted by the Super Admin.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'College A (Engineering)', status: 'Isolated Tenant', color: 'emerald' },
                { label: 'College B (Management)', status: 'Isolated Tenant', color: 'emerald' },
                { label: 'Cross-Tenant Queries', status: 'Super Admin Only', color: 'rose' },
                { label: 'Shared Resources (Library)', status: 'Allowed — All', color: 'indigo' }
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center`}>
                  <span className="font-bold text-white text-xs">{item.label}</span>
                  <span className={`text-xxs font-bold px-2.5 py-1 rounded-full bg-${item.color}-500/10 text-${item.color}-400`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
