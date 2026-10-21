import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaUserShield, FaUsers, FaBuilding, FaMobileAlt, 
  FaExclamationTriangle, FaHeartbeat, FaCheckCircle, 
  FaTimesCircle, FaChartLine, FaChartPie, FaUserPlus, FaLock, 
  FaEnvelope, FaTimes, FaCheck, FaSitemap, FaKey, FaCogs, 
  FaToggleOn, FaDatabase, FaShieldAlt, FaRobot, FaBell, 
  FaTrash, FaEdit, FaSync, FaDownload, FaPlus, FaLaptop, FaBan, FaUndo
} from 'react-icons/fa';
import { UsersAPI, DepartmentsAPI, CybersecurityAPI, InstitutionsAPI } from '../../services/api';
import ReportedIssuesHub from '../modules/ReportedIssuesHub';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('org_hierarchy'); // org_hierarchy | users_roles | sessions_api | system_config | backup_mgmt | audit_security | ai_config | notif_config
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Organization Management (Multi-tenant University Hierarchy)
  const [institutions, setInstitutions] = useState([
    {
      id: 'inst-1',
      name: 'EduVerse Central University',
      type: 'University',
      colleges: [
        {
          id: 'col-a',
          name: 'College of Engineering & Technology (College A)',
          departments: [
            { id: 'dept-1', name: 'Computer Science & Engineering (CSE)', code: 'CSE', head: 'Dr. Arjun Mehta', students: 120 },
            { id: 'dept-2', name: 'Electronics & Communication (ECE)', code: 'ECE', head: 'Dr. Priya Nair', students: 95 },
            { id: 'dept-3', name: 'Mechanical Engineering (MECH)', code: 'MECH', head: 'Prof. Rajesh Kumar', students: 80 }
          ]
        },
        {
          id: 'col-b',
          name: 'School of Management & Business Studies (College B)',
          departments: [
            { id: 'dept-4', name: 'Business Administration (MBA)', code: 'MBA', head: 'Dr. Sarah Connor', students: 110 },
            { id: 'dept-5', name: 'Finance & Accounts', code: 'FIN', head: 'Prof. Priya Mehta', students: 75 }
          ]
        }
      ]
    }
  ]);

  const [newInstName, setNewInstName] = useState('');
  const [newCollegeName, setNewCollegeName] = useState('');
  const [selectedInstId, setSelectedInstId] = useState('inst-1');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('col-a');

  // 2. Users & Roles Management Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [liveInstitutions, setLiveInstitutions] = useState([]);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userDept, setUserDept] = useState('CSE');
  const [userRole, setUserRole] = useState('STUDENT');
  const [userInstitutionId, setUserInstitutionId] = useState('');
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState(null);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUserPassword(pass);
    toast.success('Generated secure password!');
  };

  const [customRoles, setCustomRoles] = useState([
    { name: 'Academic Dean', permissions: ['All Academic Modules', 'Curriculum Approval', 'Staff Evaluation'] },
    { name: 'Examination Controller', permissions: ['Exam Scheduling', 'Question Bank', 'Grade Moderation'] },
    { name: 'Hostel Supervisor', permissions: ['Hostel Allocation', 'Maintenance Approval', 'Visitor Logs'] }
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePerms, setNewRolePerms] = useState('');

  // 3. API & Session Management
  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Mobile App Gateway', key: 'edv_live_99a8x903k2lm0192', rateLimit: '1000 req/min', status: 'Active', created: '2026-08-01' },
    { id: 'key-2', name: 'Biometric Attendance Device', key: 'edv_live_44bx78912qpa8712', rateLimit: '500 req/min', status: 'Active', created: '2026-08-15' }
  ]);
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Chrome on Windows 11', user: 'superadmin@eduverse.com', ip: '192.168.1.100', location: 'New Delhi, IN', active: 'Current Session' },
    { id: 'sess-2', device: 'Safari on iPhone 15 Pro', user: 'admin@eduverse.com', ip: '185.12.33.91', location: 'Mumbai, IN', active: '20 mins ago' },
    { id: 'sess-3', device: 'Firefox on macOS', user: 'teacher@eduverse.com', ip: '172.16.4.12', location: 'Bengaluru, IN', active: '1 hr ago' }
  ]);

  // 4. Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    aiAssistant: true,
    faceAttendance: true,
    smsAlerts: true,
    multiTenantMode: true,
    mfaEnforcement: true,
    autoBackups: true
  });

  // 5. Backups Management
  const [backups, setBackups] = useState([
    { id: 'bk-1', name: 'Full_Database_Snapshot_2026-08-28.gz', size: '14.2 MB', timestamp: '2026-08-28 03:00 AM', status: 'Verified' },
    { id: 'bk-2', name: 'Incremental_Log_Backup_2026-08-29.gz', size: '3.8 MB', timestamp: '2026-08-29 03:00 AM', status: 'Verified' }
  ]);

  // 6. AI Configuration
  const [aiConfig, setAiConfig] = useState({
    model: 'GPT-4o Enterprise',
    temperature: 0.7,
    maxTokens: 4096,
    autoModeration: true,
    fallbackEngine: 'Claude 3.5 Sonnet'
  });

  // 7. Notification Configuration
  const [notifConfig, setNotifConfig] = useState({
    smtpHost: 'smtp.eduverse.com',
    smtpPort: '587',
    smsGateway: 'Twilio Enterprise SMS',
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [data, insts] = await Promise.all([
        UsersAPI.getAll(),
        InstitutionsAPI.getAll()
      ]);
      if (Array.isArray(data)) {
        setUsersList(data);
      }
      if (Array.isArray(insts) && insts.length > 0) {
        setLiveInstitutions(insts);
        setUserInstitutionId(insts[0]._id);
      }
    } catch (err) {
      console.warn('Error fetching live users / institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handlers
  const handleAddInstitution = (e) => {
    e.preventDefault();
    if (!newInstName) return;
    const newInst = {
      id: `inst-${Date.now()}`,
      name: newInstName,
      type: 'University',
      colleges: []
    };
    setInstitutions([...institutions, newInst]);
    setNewInstName('');
    toast.success(`Institution "${newInstName}" created!`);
  };

  const handleAddCollege = (e) => {
    e.preventDefault();
    if (!newCollegeName) return;
    setInstitutions(institutions.map(inst => {
      if (inst.id === selectedInstId) {
        return {
          ...inst,
          colleges: [
            ...inst.colleges,
            { id: `col-${Date.now()}`, name: newCollegeName, departments: [] }
          ]
        };
      }
      return inst;
    }));
    setNewCollegeName('');
    toast.success(`School/College "${newCollegeName}" added to University!`);
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;
    setInstitutions(institutions.map(inst => {
      return {
        ...inst,
        colleges: inst.colleges.map(col => {
          if (col.id === selectedCollegeId) {
            return {
              ...col,
              departments: [
                ...col.departments,
                { id: `dept-${Date.now()}`, name: newDeptName, code: newDeptCode, head: 'Assigned HOD', students: 0 }
              ]
            };
          }
          return col;
        })
      };
    }));
    setNewDeptName('');
    setNewDeptCode('');
    toast.success(`Department "${newDeptName}" added to college!`);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userFirstName || !userEmail || !userPassword) {
      toast.error('First name, email, and password are required');
      return;
    }
    try {
      await UsersAPI.create({
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
        password: userPassword,
        department: userDept,
        role: userRole,
        institutionId: userInstitutionId || undefined
      });
      const creds = {
        name: `${userFirstName} ${userLastName}`.trim(),
        email: userEmail,
        password: userPassword,
        role: userRole,
        department: userDept
      };
      setGeneratedCreds(creds);
      setShowCredentialsModal(true);
      toast.success(`Provisioned ${userFirstName} ${userLastName} (${userRole})!`);
      setUserFirstName('');
      setUserLastName('');
      setUserEmail('');
      setUserPassword('');
      setShowUserModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleSuspension = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await UsersAPI.update(id, { status: nextStatus });
      setUsersList(usersList.map(u => (u._id || u.id) === id ? { ...u, status: nextStatus } : u));
      toast.success(`User access ${nextStatus === 'suspended' ? 'Suspended' : 'Reactivated'}!`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCreateCustomRole = (e) => {
    e.preventDefault();
    if (!newRoleName) return;
    setCustomRoles([...customRoles, {
      name: newRoleName,
      permissions: newRolePerms.split(',').map(p => p.trim()).filter(Boolean)
    }]);
    setNewRoleName('');
    setNewRolePerms('');
    toast.success(`Custom Role "${newRoleName}" registered!`);
  };

  const handleGenerateApiKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: `External Client App #${apiKeys.length + 1}`,
      key: `edv_live_${Math.random().toString(36).substring(2, 18)}`,
      rateLimit: '1000 req/min',
      status: 'Active',
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success('New API Key Generated!');
  };

  const handleTriggerBackup = () => {
    toast.loading('Generating encrypted database snapshot...');
    setTimeout(() => {
      toast.dismiss();
      const newBk = {
        id: `bk-${Date.now()}`,
        name: `Full_Database_Snapshot_${new Date().toISOString().split('T')[0]}.gz`,
        size: '14.8 MB',
        timestamp: new Date().toLocaleString(),
        status: 'Verified'
      };
      setBackups([newBk, ...backups]);
      toast.success('Database Backup Snapshot Created & Verified!');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 text-xs font-semibold"
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-indigo-400 font-bold uppercase tracking-widest text-xxs">Enterprise Governance</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">Super Admin Console</h1>
          <p className="opacity-90 text-sm mt-1">Multi-tenant hierarchy, RBAC permissions, system configuration, AI & security center.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowUserModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 text-xs"
          >
            <FaUserPlus /> Provision User Account
          </button>
        </div>
      </div>

      {/* Navigation Module Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none -mx-1 px-1">
        {[
          { id: 'org_hierarchy', label: 'Organization Hierarchy (Multi-Tenant)', icon: <FaSitemap /> },
          { id: 'reported_issues', label: 'Reported Issues Desk', icon: <FaExclamationTriangle className="text-amber-400" /> },
          { id: 'users_roles', label: 'Users & Custom Roles', icon: <FaUsers /> },
          { id: 'sessions_api', label: 'Sessions & API Keys', icon: <FaKey /> },
          { id: 'system_config', label: 'System Config & Feature Flags', icon: <FaCogs /> },
          { id: 'backup_mgmt', label: 'Backup Management', icon: <FaDatabase /> },
          { id: 'ai_config', label: 'AI Model Configuration', icon: <FaRobot /> },
          { id: 'notif_config', label: 'Notification Gateway', icon: <FaBell /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition text-xs ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB 1: ORGANIZATION MANAGEMENT (MULTI-TENANT HIERARCHY) ─── */}
      {activeTab === 'org_hierarchy' && (
        <div className="flex flex-col gap-8">
          {/* Create Section forms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form 1: Create Institution */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><FaBuilding className="text-indigo-400" /> Create Institution / University</h3>
              <form onSubmit={handleAddInstitution} className="flex flex-col gap-3">
                <input 
                  type="text" 
                  value={newInstName} 
                  onChange={e => setNewInstName(e.target.value)} 
                  placeholder="e.g. Stanford University" 
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                  required 
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                  <FaPlus /> Add Institution
                </button>
              </form>
            </div>

            {/* Form 2: Create College */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><FaSitemap className="text-purple-400" /> Create School / College</h3>
              <form onSubmit={handleAddCollege} className="flex flex-col gap-3">
                <select value={selectedInstId} onChange={e => setSelectedInstId(e.target.value)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-bold">
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  value={newCollegeName} 
                  onChange={e => setNewCollegeName(e.target.value)} 
                  placeholder="e.g. College of Engineering (College A)" 
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                  required 
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                  <FaPlus /> Add School/College
                </button>
              </form>
            </div>

            {/* Form 3: Create Department */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><FaUsers className="text-emerald-400" /> Create Department</h3>
              <form onSubmit={handleAddDepartment} className="flex flex-col gap-3">
                <select value={selectedCollegeId} onChange={e => setSelectedCollegeId(e.target.value)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-bold">
                  {institutions.flatMap(inst => inst.colleges).map(col => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    value={newDeptName} 
                    onChange={e => setNewDeptName(e.target.value)} 
                    placeholder="e.g. Computer Science" 
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                    required 
                  />
                  <input 
                    type="text" 
                    value={newDeptCode} 
                    onChange={e => setNewDeptCode(e.target.value)} 
                    placeholder="e.g. CSE" 
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white uppercase font-mono" 
                    required 
                  />
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                  <FaPlus /> Add Department
                </button>
              </form>
            </div>
          </div>

          {/* Visual Multi-Tenant Tree Representation */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-[#111827]/40 shadow-xl flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaSitemap className="text-indigo-400" /> Multi-Tenant Institutional Hierarchy Tree
            </h2>

            <div className="flex flex-col gap-6">
              {institutions.map(inst => (
                <div key={inst.id} className="p-6 rounded-2xl border border-indigo-700/30 bg-indigo-950/20 flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-indigo-700/30 pb-3">
                    <span className="p-2 rounded-xl bg-indigo-600 text-white text-base"><FaBuilding /></span>
                    <div>
                      <span className="font-extrabold text-base text-white block">{inst.name}</span>
                      <span className="text-xxs text-indigo-300 font-mono">TENANT ROOT ({inst.type.toUpperCase()})</span>
                    </div>
                  </div>

                  <div className="pl-6 border-l-2 border-dashed border-indigo-500/40 flex flex-col gap-5 mt-2">
                    {inst.colleges.map(col => (
                      <div key={col.id} className="p-5 rounded-xl border border-purple-700/30 bg-purple-950/20 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 rounded-lg bg-purple-600 text-white text-sm"><FaSitemap /></span>
                          <span className="font-bold text-sm text-purple-200">{col.name}</span>
                        </div>

                        {/* Departments */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-4 border-l border-purple-500/30 mt-2">
                          {col.departments.map(dept => (
                            <div key={dept.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                              <span className="text-xxs font-mono text-emerald-400 font-bold">{dept.code}</span>
                              <span className="font-bold text-xs text-white">{dept.name}</span>
                              <span className="text-xxs text-slate-400">Head: {dept.head}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: USERS & CUSTOM ROLES ─── */}
      {activeTab === 'users_roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Users Directory */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Accounts & Role Assignment</h2>
                  <p className="text-slate-400 text-xxs mt-0.5">Toggle user suspensions, reset access, or reassign roles.</p>
                </div>
                <button 
                  onClick={() => setShowUserModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-lg"
                >
                  <FaUserPlus /> Create User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 font-bold uppercase tracking-wider text-slate-500 text-xxs">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {usersList.map((u) => (
                      <tr key={u._id || u.id}>
                        <td className="py-3.5 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xxs">
                            {u.firstName?.[0] || 'U'}
                          </div>
                          <div>
                            <span className="block">{u.firstName} {u.lastName}</span>
                            <span className="text-xxs font-mono text-slate-400 font-normal">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-300">{u.department || 'General'}</td>
                        <td className="py-3.5 font-mono text-indigo-400 font-bold">{u.role}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase ${
                            u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => toast.success(`Password reset token sent to ${u.email}!`)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xxs font-bold"
                              title="Reset Password"
                            >
                              <FaUndo /> Reset Pass
                            </button>
                            <button 
                              onClick={() => handleToggleSuspension(u._id || u.id, u.status || 'active')}
                              className={`px-2.5 py-1 rounded-lg text-xxs font-bold transition ${
                                u.status === 'active' ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              }`}
                            >
                              {u.status === 'active' ? <><FaBan className="inline mr-1" /> Suspend</> : <><FaCheck className="inline mr-1" /> Reactivate</>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Col: Custom Roles & Permissions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 shadow-sm flex flex-col gap-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaUserShield className="text-purple-400" /> Create Custom Role</h2>
              <form onSubmit={handleCreateCustomRole} className="flex flex-col gap-3">
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Role Title</label>
                  <input 
                    type="text" 
                    value={newRoleName} 
                    onChange={e => setNewRoleName(e.target.value)} 
                    placeholder="e.g. Lab Director" 
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Comma-separated Permissions</label>
                  <input 
                    type="text" 
                    value={newRolePerms} 
                    onChange={e => setNewRolePerms(e.target.value)} 
                    placeholder="e.g. Lab Booking, Inventory Access" 
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                  />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs">
                  Create Role Definition
                </button>
              </form>

              <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
                <span className="text-xxs uppercase font-bold text-slate-400">Active Custom Roles</span>
                {customRoles.map((cr, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
                    <span className="font-bold text-white text-xs">{cr.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {cr.permissions.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-xxs font-mono">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SESSIONS & API MANAGEMENT ─── */}
      {activeTab === 'sessions_api' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* API Keys */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaKey className="text-indigo-400" /> Enterprise API Keys</h2>
                <p className="text-xxs text-slate-400">Developer integrations and rate limiting</p>
              </div>
              <button onClick={handleGenerateApiKey} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <FaPlus /> Generate Key
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {apiKeys.map(k => (
                <div key={k.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">{k.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xxs font-bold">{k.status}</span>
                  </div>
                  <span className="font-mono text-indigo-300 text-xxs bg-slate-950 p-2 rounded-lg border border-slate-800 select-all">{k.key}</span>
                  <div className="flex justify-between text-xxs text-slate-400 font-mono">
                    <span>Limit: {k.rateLimit}</span>
                    <span>Created: {k.created}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaLaptop className="text-pink-400" /> Active Session Management</h2>
            <div className="flex flex-col gap-3">
              {activeSessions.map(s => (
                <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-white text-xs">{s.device}</span>
                    <span className="text-xxs text-slate-400 font-mono">{s.user} • {s.ip}</span>
                    <span className="text-xxs text-slate-500">{s.location} • {s.active}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveSessions(activeSessions.filter(x => x.id !== s.id));
                      toast.success(`Revoked session for ${s.device}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-bold text-xxs"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: SYSTEM CONFIG & FEATURE FLAGS ─── */}
      {activeTab === 'system_config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaToggleOn className="text-emerald-400" /> Enterprise Feature Flags</h2>
            <div className="flex flex-col gap-4">
              {[
                { key: 'aiAssistant', label: 'AI Copilot & Question Generator', desc: 'Enable LLM assistance for teachers & administrators' },
                { key: 'faceAttendance', label: 'CNN Face Biometric Attendance', desc: 'Allow camera facial embedding scans for classroom presence' },
                { key: 'smsAlerts', label: 'SMS Emergency Notifications', desc: 'Send direct SMS alerts on fee dues and closures' },
                { key: 'multiTenantMode', label: 'Multi-Tenant University Isolation', desc: 'Enforce domain and college-level data partitioning' },
                { key: 'mfaEnforcement', label: 'Mandatory 2FA for Staff', desc: 'Require TOTP authenticator app verification on login' }
              ].map(f => (
                <div key={f.key} className="flex justify-between items-center p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-white text-xs block">{f.label}</span>
                    <span className="text-xxs text-slate-400">{f.desc}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setFeatureFlags({ ...featureFlags, [f.key]: !featureFlags[f.key] });
                      toast.success(`${f.label} ${!featureFlags[f.key] ? 'Enabled' : 'Disabled'}`);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${featureFlags[f.key] ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${featureFlags[f.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaCogs className="text-indigo-400" /> Global Environment Parameters</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-xxs text-slate-400 uppercase font-bold">Node Environment</span>
                <span className="text-emerald-400 font-bold font-mono">production</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-xxs text-slate-400 uppercase font-bold">JWT Token Expiry</span>
                <span className="text-indigo-400 font-bold font-mono">7 Days (Standard)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-xxs text-slate-400 uppercase font-bold">Rate Limit Window</span>
                <span className="text-purple-400 font-bold font-mono">100 req / 15 mins</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                <span className="text-xxs text-slate-400 uppercase font-bold">Database Driver</span>
                <span className="text-amber-400 font-bold font-mono">MongoDB v7.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: BACKUP MANAGEMENT ─── */}
      {activeTab === 'backup_mgmt' && (
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaDatabase className="text-emerald-400" /> Database Backup & Snapshot Engine</h2>
                <p className="text-xxs text-slate-400">Automated incremental and manual full-system recovery images</p>
              </div>
              <button 
                onClick={handleTriggerBackup} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-lg"
              >
                <FaDatabase /> Trigger Manual Snapshot
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {backups.map(b => (
                <div key={b.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-white font-mono text-xs">{b.name}</span>
                    <span className="text-xxs text-slate-400">{b.size} • Captured on {b.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xxs font-bold">{b.status}</span>
                    <button onClick={() => toast.success(`Downloading backup image ${b.name}...`)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: AI CONFIGURATION ─── */}
      {activeTab === 'ai_config' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 flex flex-col gap-6 max-w-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaRobot className="text-indigo-400" /> AI Engine Configuration</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Primary AI Model</label>
              <select 
                value={aiConfig.model} 
                onChange={e => setAiConfig({ ...aiConfig, model: e.target.value })} 
                className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold"
              >
                <option value="GPT-4o Enterprise">GPT-4o Enterprise (Omni)</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                <option value="DeepSeek R1">DeepSeek R1 Reasoning</option>
              </select>
            </div>

            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">Max Generation Tokens ({aiConfig.maxTokens})</label>
              <input 
                type="range" 
                min="1024" 
                max="8192" 
                step="512"
                value={aiConfig.maxTokens} 
                onChange={e => setAiConfig({ ...aiConfig, maxTokens: Number(e.target.value) })}
                className="w-full mt-2 accent-indigo-600" 
              />
            </div>

            <button onClick={() => toast.success('AI engine configuration updated!')} className="self-start bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs">
              Save AI Parameters
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 7: NOTIFICATION CONFIGURATION ─── */}
      {activeTab === 'notif_config' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#111827]/40 flex flex-col gap-6 max-w-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBell className="text-amber-400" /> Notification Gateway Settings</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">SMTP Host Server</label>
              <input 
                type="text" 
                value={notifConfig.smtpHost} 
                onChange={e => setNotifConfig({ ...notifConfig, smtpHost: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
              />
            </div>
            <div>
              <label className="text-xxs uppercase font-bold text-slate-400">SMS Gateway Provider</label>
              <input 
                type="text" 
                value={notifConfig.smsGateway} 
                onChange={e => setNotifConfig({ ...notifConfig, smsGateway: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
              />
            </div>
            <button onClick={() => toast.success('Notification channels configured!')} className="self-start bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs">
              Update Gateways
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB: USER REPORTED ISSUES & RESOLUTION DESK ─── */}
      {activeTab === 'reported_issues' && (
        <div className="flex flex-col gap-6">
          <ReportedIssuesHub embedded={true} />
        </div>
      )}

      {/* Provision User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl flex flex-col gap-4 sm:gap-5 text-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold">Provision New User Account</h3>
                <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">First Name</label>
                    <input 
                      type="text" 
                      value={userFirstName} 
                      onChange={e => setUserFirstName(e.target.value)} 
                      placeholder="Jane" 
                      className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Last Name</label>
                    <input 
                      type="text" 
                      value={userLastName} 
                      onChange={e => setUserLastName(e.target.value)} 
                      placeholder="Doe" 
                      className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Email Address</label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    onChange={e => setUserEmail(e.target.value)} 
                    placeholder="jane.doe@eduverse.com" 
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                    required 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xxs uppercase font-bold text-slate-400">Password</label>
                    <button 
                      type="button" 
                      onClick={generateRandomPassword}
                      className="text-xxs font-bold text-indigo-400 hover:text-indigo-300 transition underline"
                    >
                      ⚡ Generate Secure Password
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={userPassword} 
                    onChange={e => setUserPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Department</label>
                    <select 
                      value={userDept} 
                      onChange={e => setUserDept(e.target.value)} 
                      className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold"
                    >
                      <option value="CSE">CSE (Computer Science)</option>
                      <option value="ECE">ECE (Electronics)</option>
                      <option value="MECH">MECH (Mechanical)</option>
                      <option value="MBA">MBA (Business)</option>
                      <option value="Finance & Accounts">Finance & Accounts</option>
                      <option value="Cyber Security SOC">Cyber Security SOC</option>
                      <option value="Library">Library</option>
                      <option value="Transport & Transit">Transport & Transit</option>
                      <option value="Placement Cell">Placement Cell</option>
                      <option value="Front Desk & Reception">Front Desk & Reception</option>
                      <option value="Executive Board & Security">Executive Board & Security</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Tenant / Institution</label>
                    <select 
                      value={userInstitutionId} 
                      onChange={e => setUserInstitutionId(e.target.value)} 
                      className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold"
                    >
                      {liveInstitutions.length > 0 ? (
                        liveInstitutions.map(inst => (
                          <option key={inst._id} value={inst._id}>{inst.name} ({inst.code})</option>
                        ))
                      ) : (
                        <option value="">EduVerse Central Campus</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Assigned Role</label>
                  <select 
                    value={userRole} 
                    onChange={e => setUserRole(e.target.value)} 
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold"
                  >
                      <option value="CYBER_SECURITY_OFFICER">CYBER_SECURITY_OFFICER (Cyber Security)</option>
                      <option value="FINANCE_OFFICER">FINANCE_OFFICER (Finance Officer)</option>
                      <option value="LIBRARIAN">LIBRARIAN (Librarian)</option>
                      <option value="TRANSPORT_MANAGER">TRANSPORT_MANAGER (Transport Manager)</option>
                      <option value="PLACEMENT_OFFICER">PLACEMENT_OFFICER (Placement Officer)</option>
                      <option value="RECEPTIONIST">RECEPTIONIST (Receptionist)</option>
                      <option value="HR_MANAGER">HR_MANAGER (HR Manager)</option>
                      <option value="ADMIN">ADMIN (Administrator)</option>
                      <option value="TEACHER">TEACHER (Faculty Member)</option>
                      <option value="STUDENT">STUDENT (Student)</option>
                      <option value="PARENT">PARENT (Parent / Guardian)</option>
                      <option value="EMPLOYEE">EMPLOYEE (Staff Member)</option>
                    </select>
                  </div>

                <button 
                  type="submit" 
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2"
                >
                  <FaUserPlus /> Provision Account & Generate Credentials
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Generated Credentials Slip Modal */}
        {showCredentialsModal && generatedCreds && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] border border-indigo-500/40 p-6 rounded-3xl w-full max-w-md shadow-2xl flex flex-col gap-5 text-white"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                  <FaCheck /> Account Credentials Issued!
                </h3>
                <button onClick={() => setShowCredentialsModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <p className="text-slate-300 text-xs">
                The account has been created in MongoDB. Provide these credentials to the user to log in:
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5 font-mono text-xs select-all">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white font-bold">{generatedCreds.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-indigo-400 font-bold">{generatedCreds.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Password:</span>
                  <span className="text-emerald-400 font-bold">{generatedCreds.password}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Role:</span>
                  <span className="text-purple-400 font-bold">{generatedCreds.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="text-slate-300">{generatedCreds.department}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const text = `EduVerse ERP Login Credentials\nEmail: ${generatedCreds.email}\nPassword: ${generatedCreds.password}\nRole: ${generatedCreds.role}\nDepartment: ${generatedCreds.department}\nLogin URL: http://localhost:5173/login`;
                    navigator.clipboard.writeText(text);
                    toast.success('Credentials copied to clipboard!');
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <FaDownload /> Copy Credentials Slip
                </button>
                <button 
                  onClick={() => setShowCredentialsModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
