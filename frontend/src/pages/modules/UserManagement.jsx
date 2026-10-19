import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  FaUsers, FaUserPlus, FaSearch, FaFilter, FaBan, FaCheckCircle,
  FaKey, FaEye, FaDownload, FaSync, FaShieldAlt, FaBuilding,
  FaEnvelope, FaPhone, FaTimes, FaCalendarAlt, FaLock, FaUnlock,
  FaIdBadge, FaCheck, FaExclamationTriangle, FaUserCog, FaMapMarkerAlt
} from 'react-icons/fa';
import { UsersAPI } from '../../services/api';
import { exportToCSV, exportToJSON } from '../../utils/exportHelper';

const ROLES = [
  'ALL',
  'SUPER_ADMIN',
  'ADMIN',
  'TEACHER',
  'STUDENT',
  'PARENT',
  'FINANCE_OFFICER',
  'HR_MANAGER',
  'CYBER_SECURITY_OFFICER',
  'LIBRARIAN',
  'TRANSPORT_MANAGER',
  'PLACEMENT_OFFICER',
  'RECEPTIONIST',
  'EMPLOYEE'
];

const STATUSES = ['ALL', 'active', 'suspended', 'inactive'];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Modals state
  const [viewingUser, setViewingUser] = useState(null);
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'STUDENT',
    department: 'General'
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Action in flight trackers
  const [togglingUserId, setTogglingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UsersAPI.getAll();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      toast.error('Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status (Suspend / Activate)
  const handleToggleStatus = async (user) => {
    const isCurrentlyActive = (user.status || 'active').toLowerCase() === 'active';
    const newStatus = isCurrentlyActive ? 'suspended' : 'active';
    setTogglingUserId(user._id);

    try {
      await UsersAPI.updateStatus(user._id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
      );
      if (viewingUser && viewingUser._id === user._id) {
        setViewingUser((prev) => ({ ...prev, status: newStatus }));
      }

      if (newStatus === 'suspended') {
        toast.error(`Account for ${user.firstName} ${user.lastName} has been SUSPENDED. All active sessions invalidated.`);
      } else {
        toast.success(`Account for ${user.firstName} ${user.lastName} is now ACTIVE.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setTogglingUserId(null);
    }
  };

  // Change / Reset Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await UsersAPI.resetPassword(passwordModalUser._id, newPassword);
      toast.success(`Password for ${passwordModalUser.firstName} updated successfully!`);
      setPasswordModalUser(null);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreatingUser(true);
    try {
      const created = await UsersAPI.create(newUser);
      toast.success(`User ${newUser.firstName} ${newUser.lastName} created successfully!`);
      setShowAddModal(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'STUDENT',
        department: 'General'
      });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q);

      const matchesRole = selectedRole === 'ALL' || u.role?.toUpperCase() === selectedRole;
      const matchesStatus =
        selectedStatus === 'ALL' || (u.status || 'active').toLowerCase() === selectedStatus.toLowerCase();
      const matchesDept = selectedDept === 'ALL' || u.department === selectedDept;

      return matchesSearch && matchesRole && matchesStatus && matchesDept;
    });
  }, [users, search, selectedRole, selectedStatus, selectedDept]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => (u.status || 'active').toLowerCase() === 'active').length;
    const suspended = users.filter((u) => (u.status || '').toLowerCase() === 'suspended').length;
    const teachers = users.filter((u) => u.role === 'TEACHER').length;
    const students = users.filter((u) => u.role === 'STUDENT').length;
    const admins = users.filter((u) => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)).length;
    return { total, active, suspended, teachers, students, admins };
  }, [users]);

  // Department List from current users
  const departments = useMemo(() => {
    const set = new Set();
    users.forEach((u) => {
      if (u.department) set.add(u.department);
    });
    return ['ALL', ...Array.from(set)];
  }, [users]);

  // Export handlers
  const handleExportCSV = () => {
    const exportData = filteredUsers.map((u) => ({
      ID: u._id,
      'First Name': u.firstName,
      'Last Name': u.lastName,
      Email: u.email,
      Phone: u.phone || 'N/A',
      Role: u.role,
      Department: u.department || 'General',
      Status: u.status || 'active',
      'Created At': new Date(u.createdAt || Date.now()).toLocaleDateString(),
      'Last Login': u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'
    }));
    exportToCSV(exportData, `Users_Directory_${new Date().toISOString().split('T')[0]}`);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-900/60 text-purple-300 border-purple-700/50';
      case 'ADMIN':
        return 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50';
      case 'TEACHER':
        return 'bg-blue-900/60 text-blue-300 border-blue-700/50';
      case 'STUDENT':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50';
      case 'FINANCE_OFFICER':
        return 'bg-amber-900/60 text-amber-300 border-amber-700/50';
      case 'CYBER_SECURITY_OFFICER':
        return 'bg-rose-900/60 text-rose-300 border-rose-700/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 border border-indigo-900/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
              <FaUsers /> Enterprise Identity & Directory
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              User Management & Accounts Control
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Inspect all registered user profiles, view full account details, suspend or reactivate access, and securely change passwords with administrative privileges.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/40 transition"
            >
              <FaUserPlus /> Provision User
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition"
            >
              <FaDownload /> Export CSV
            </button>
            <button
              onClick={fetchUsers}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
              title="Refresh"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Live Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 pt-6 border-t border-indigo-900/30">
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-xxs text-slate-400 font-bold uppercase tracking-wider">Total Users</span>
            <p className="text-lg font-black text-white mt-0.5">{stats.total}</p>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-xxs text-emerald-400 font-bold uppercase tracking-wider">Active</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{stats.active}</p>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-xxs text-rose-400 font-bold uppercase tracking-wider">Suspended</span>
            <p className="text-lg font-black text-rose-400 mt-0.5">{stats.suspended}</p>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-xxs text-sky-400 font-bold uppercase tracking-wider">Students</span>
            <p className="text-lg font-black text-sky-400 mt-0.5">{stats.students}</p>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-xxs text-blue-400 font-bold uppercase tracking-wider">Teachers</span>
            <p className="text-lg font-black text-blue-400 mt-0.5">{stats.teachers}</p>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-xxs text-purple-400 font-bold uppercase tracking-wider">Admins</span>
            <p className="text-lg font-black text-purple-400 mt-0.5">{stats.admins}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, role..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 items-center">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xxs font-bold text-slate-400">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xxs font-bold text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xxs font-bold text-slate-400">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {(search || selectedRole !== 'ALL' || selectedStatus !== 'ALL' || selectedDept !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedRole('ALL');
                setSelectedStatus('ALL');
                setSelectedDept('ALL');
              }}
              className="px-2.5 py-1.5 text-xxs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Users Master Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xxs font-bold">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role & Dept</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-center">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">Loading user registry...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No users found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuspended = (u.status || '').toLowerCase() === 'suspended';
                  const isToggling = togglingUserId === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-slate-800/30 transition">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow">
                              {u.firstName?.[0] || 'U'}
                              {u.lastName?.[0] || ''}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                                isSuspended ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                            ></span>
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              {u.firstName} {u.lastName}
                              {isSuspended && (
                                <span className="text-xxs px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                                  LOCKED
                                </span>
                              )}
                            </div>
                            <span className="text-xxs text-slate-400 font-mono block">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Dept */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xxs font-bold border ${getRoleBadgeStyle(
                            u.role
                          )}`}
                        >
                          {u.role}
                        </span>
                        <span className="text-xxs text-slate-400 block mt-1">
                          {u.department || 'General'}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 block text-xxs">
                          {u.phone || 'No phone'}
                        </span>
                        <span className="text-xxs text-slate-500">
                          {u.institutionId?.name || 'Central Campus'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xxs font-black tracking-wide uppercase ${
                            isSuspended
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isSuspended ? (
                            <>
                              <FaBan size={9} /> SUSPENDED
                            </>
                          ) : (
                            <>
                              <FaCheckCircle size={9} /> ACTIVE
                            </>
                          )}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-xxs text-slate-400">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never logged in'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* View All Details */}
                          <button
                            onClick={() => setViewingUser(u)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
                            title="View Full Profile Details"
                          >
                            <FaEye size={12} />
                          </button>

                          {/* Change Password */}
                          <button
                            onClick={() => {
                              setPasswordModalUser(u);
                              setNewPassword('');
                              setConfirmPassword('');
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
                            title="Reset / Change Password"
                          >
                            <FaKey size={12} />
                          </button>

                          {/* Suspend / Activate Toggle */}
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isToggling}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-xxs flex items-center gap-1.5 border transition ${
                              isSuspended
                                ? 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border-emerald-500/40'
                                : 'bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border-rose-500/40'
                            }`}
                            title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            {isToggling ? (
                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : isSuspended ? (
                              <>
                                <FaUnlock size={10} /> Activate
                              </>
                            ) : (
                              <>
                                <FaBan size={10} /> Suspend
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL 1: VIEW FULL USER DETAILS ─── */}
      <AnimatePresence>
        {viewingUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 rounded-3xl border border-slate-800 max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-base flex items-center justify-center shadow-lg">
                    {viewingUser.firstName?.[0]}
                    {viewingUser.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">
                      {viewingUser.firstName} {viewingUser.lastName}
                    </h2>
                    <span className="text-xxs text-slate-400 font-mono">{viewingUser.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingUser(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Status and Role Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xxs font-black uppercase tracking-wider ${
                    (viewingUser.status || 'active').toLowerCase() === 'suspended'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  Status: {viewingUser.status || 'ACTIVE'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xxs font-bold border ${getRoleBadgeStyle(
                    viewingUser.role
                  )}`}
                >
                  Role: {viewingUser.role}
                </span>
                <span className="px-3 py-1 rounded-full text-xxs bg-slate-800 text-slate-300 border border-slate-700">
                  Dept: {viewingUser.department || 'General'}
                </span>
              </div>

              {/* Comprehensive Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xxs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">User ID</span>
                  <span className="text-slate-200 font-mono">{viewingUser._id}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Phone</span>
                  <span className="text-slate-200">{viewingUser.phone || 'Not provided'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Institution</span>
                  <span className="text-slate-200">
                    {viewingUser.institutionId?.name || 'Central University Tenant'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">
                    Emergency Contact
                  </span>
                  <span className="text-slate-200">
                    {viewingUser.emergencyContact || 'Not configured'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">
                    Account Created
                  </span>
                  <span className="text-slate-200">
                    {new Date(viewingUser.createdAt || Date.now()).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Last Login</span>
                  <span className="text-slate-200">
                    {viewingUser.lastLogin
                      ? new Date(viewingUser.lastLogin).toLocaleString()
                      : 'Never'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">2FA Enabled</span>
                  <span className="text-slate-200">
                    {viewingUser.twoFactorEnabled ? 'Yes (MFA Active)' : 'Disabled'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">
                    Email Verified
                  </span>
                  <span className="text-slate-200">
                    {viewingUser.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>

              {/* Address / Bio */}
              {viewingUser.address && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xxs flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Address</span>
                  <span className="text-slate-200">{viewingUser.address}</span>
                </div>
              )}

              {/* Direct Actions in Modal */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => {
                    const target = viewingUser;
                    setViewingUser(null);
                    setPasswordModalUser(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2"
                >
                  <FaKey /> Change Password
                </button>

                <button
                  onClick={() => handleToggleStatus(viewingUser)}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition ${
                    (viewingUser.status || 'active').toLowerCase() === 'suspended'
                      ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                      : 'bg-rose-600 text-white border-rose-500 hover:bg-rose-500'
                  }`}
                >
                  {(viewingUser.status || 'active').toLowerCase() === 'suspended' ? (
                    <>
                      <FaUnlock /> Reactivate Account
                    </>
                  ) : (
                    <>
                      <FaBan /> Suspend Account
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 2: ADMIN CHANGE PASSWORD ─── */}
      <AnimatePresence>
        {passwordModalUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-400">
                  <FaKey className="text-lg" />
                  <h3 className="text-base font-black text-white">Change Account Password</h3>
                </div>
                <button
                  onClick={() => setPasswordModalUser(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block text-xxs">Target Account:</span>
                <span className="font-bold text-white">
                  {passwordModalUser.firstName} {passwordModalUser.lastName}
                </span>
                <span className="text-slate-400 text-xxs block font-mono">
                  {passwordModalUser.email}
                </span>
              </div>

              <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
                <div>
                  <label className="text-xxs font-bold text-slate-300">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xxs font-bold text-slate-300">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>

                <div className="flex items-center gap-2 text-xxs text-slate-400">
                  <input
                    type="checkbox"
                    id="showPass"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="showPass" className="cursor-pointer">
                    Show password characters
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setPasswordModalUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Saving Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 3: PROVISION NEW USER ─── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 rounded-3xl border border-slate-800 max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400">
                  <FaUserPlus className="text-lg" />
                  <h3 className="text-base font-black text-white">Provision New User Account</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs font-bold text-slate-300">First Name *</label>
                    <input
                      type="text"
                      required
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      placeholder="Jane"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xxs font-bold text-slate-300">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xxs font-bold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="jane.doe@university.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs font-bold text-slate-300">Role *</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                    >
                      {ROLES.filter((r) => r !== 'ALL').map((r) => (
                        <option key={r} value={r}>
                          {r.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xxs font-bold text-slate-300">Department</label>
                    <input
                      type="text"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      placeholder="Computer Science"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xxs font-bold text-slate-300">Phone</label>
                    <input
                      type="text"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="+1 555-0199"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xxs font-bold text-slate-300">Initial Password *</label>
                    <input
                      type="password"
                      required
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingUser}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg disabled:opacity-50"
                  >
                    {isCreatingUser ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
