import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBuilding, FaPlus, FaUsers, FaSearch, FaFilter,
  FaCheckCircle, FaBan, FaTrash, FaEdit, FaEye,
  FaUniversity, FaSchool, FaGraduationCap, FaTimes,
  FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaChartBar, FaCrown, FaLock, FaSyncAlt, FaChevronDown,
  FaChevronRight, FaExclamationTriangle
} from 'react-icons/fa';
import { InstitutionsAPI, UsersAPI } from '../../services/api';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const PLAN_COLORS = {
  free:       'bg-slate-700 text-slate-200',
  basic:      'bg-blue-900/60 text-blue-300',
  premium:    'bg-violet-900/60 text-violet-300',
  enterprise: 'bg-amber-900/60 text-amber-300',
  trial:      'bg-teal-900/60 text-teal-300'
};
const STATUS_COLORS = {
  active:    'bg-emerald-900/50 text-emerald-400',
  suspended: 'bg-red-900/50 text-red-400',
  trial:     'bg-yellow-900/50 text-yellow-400',
  inactive:  'bg-slate-700 text-slate-400'
};
const TYPE_ICONS = {
  university:  <FaUniversity />,
  college:     <FaGraduationCap />,
  school:      <FaSchool />,
  polytechnic: <FaBuilding />,
  institute:   <FaBuilding />
};

const EMPTY_FORM = {
  name: '', code: '', type: 'college', city: '', state: '',
  country: 'India', email: '', phone: '', website: '',
  adminEmail: '', plan: 'trial', maxUsers: 500,
  settings: {
    enableHostel: true, enableTransport: true,
    enablePlacement: true, enableLibrary: true,
    enableFinance: true, enableExams: true, enableAI: true
  }
};

// ─── Create/Edit Modal ────────────────────────────────────────────────────────
function InstitutionModal({ isOpen, onClose, onSave, initial = null }) {
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ? { ...EMPTY_FORM, ...initial } : { ...EMPTY_FORM });
  }, [initial, isOpen]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSetting = (key, val) => setForm(f => ({
    ...f, settings: { ...f.settings, [key]: val }
  }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error('Name and code are required');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save institution');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="sticky top-0 bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-lg">
              <FaBuilding />
            </span>
            <div>
              <h2 className="text-white font-bold text-base">{initial ? 'Edit Institution' : 'Create New Institution'}</h2>
              <p className="text-slate-400 text-xs">All fields marked * are required</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-slate-300 mb-1 block">Institution Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="e.g. MIT College of Engineering" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Code *</label>
              <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                placeholder="e.g. MITCOE" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                {['university','college','school','polytechnic','institute'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Plan</label>
              <select value={form.plan} onChange={e => set('plan', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                {['trial','free','basic','premium','enterprise'].map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Max Users</label>
              <input type="number" value={form.maxUsers} onChange={e => set('maxUsers', Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Mumbai" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">State</label>
              <input value={form.state} onChange={e => set('state', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Maharashtra" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Country</label>
              <input value={form.country} onChange={e => set('country', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Institution Email</label>
              <input value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="info@institution.ac.in" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="+91 98765 43210" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-1 block">Admin Email (Institution Admin)</label>
            <input value={form.adminEmail} onChange={e => set('adminEmail', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="admin@institution.ac.in" />
          </div>

          {/* Feature Flags */}
          <div>
            <p className="text-xs font-bold text-slate-300 mb-3">Module Feature Flags</p>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(form.settings).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSetting(key, !val)}
                  className={`px-2 py-1.5 rounded-lg text-xxs font-bold border transition ${val ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-500'}`}
                >
                  {key.replace('enable', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#0f172a] border-t border-slate-800 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition disabled:opacity-50">
            {saving ? 'Saving...' : (initial ? 'Update Institution' : 'Create Institution')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────
function InstitutionDetailDrawer({ institution, onClose, onSuspend, onReactivate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!institution) return;
    setLoading(true);
    InstitutionsAPI.getUsers(institution._id).then(u => {
      setUsers(Array.isArray(u) ? u : []);
      setLoading(false);
    });
  }, [institution]);

  if (!institution) return null;

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="relative w-full max-w-md bg-[#0b1120] border-l border-slate-800 h-full overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xl">
              {TYPE_ICONS[institution.type] || <FaBuilding />}
            </span>
            <div>
              <h3 className="text-white font-bold text-sm">{institution.name}</h3>
              <span className="text-slate-400 text-xs font-mono">{institution.code}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><FaTimes /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {['overview', 'users', 'settings'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-bold capitalize transition border-b-2 ${tab === t ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 p-5 space-y-4">
          {tab === 'overview' && (
            <>
              {/* Status badges */}
              <div className="flex gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xxs font-bold ${STATUS_COLORS[institution.status] || STATUS_COLORS.inactive}`}>
                  {institution.status?.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xxs font-bold ${PLAN_COLORS[institution.plan] || PLAN_COLORS.free}`}>
                  {institution.plan?.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xxs font-bold bg-slate-800 text-slate-300 capitalize">
                  {institution.type}
                </span>
              </div>

              {/* Info rows */}
              {[
                { icon: <FaMapMarkerAlt />, label: 'Location', val: [institution.city, institution.state, institution.country].filter(Boolean).join(', ') || '—' },
                { icon: <FaEnvelope />, label: 'Email', val: institution.email || '—' },
                { icon: <FaPhone />, label: 'Phone', val: institution.phone || '—' },
                { icon: <FaGlobe />, label: 'Website', val: institution.website || '—' },
                { icon: <FaUsers />, label: 'Max Users', val: institution.maxUsers?.toLocaleString() },
                { icon: <FaUsers />, label: 'Current Users', val: (institution.userCount || 0).toString() }
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-slate-800/50">
                  <span className="text-slate-500 w-4 flex-shrink-0">{icon}</span>
                  <span className="text-slate-400 text-xs w-24 flex-shrink-0">{label}</span>
                  <span className="text-slate-200 text-xs truncate">{val}</span>
                </div>
              ))}

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                {institution.status === 'active' ? (
                  <button onClick={() => onSuspend(institution._id)}
                    className="flex-1 py-2 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-xs font-bold hover:bg-red-900/50 transition flex items-center justify-center gap-2">
                    <FaBan /> Suspend Institution
                  </button>
                ) : (
                  <button onClick={() => onReactivate(institution._id)}
                    className="flex-1 py-2 rounded-lg bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-xs font-bold hover:bg-emerald-900/50 transition flex items-center justify-center gap-2">
                    <FaCheckCircle /> Reactivate
                  </button>
                )}
              </div>
            </>
          )}

          {tab === 'users' && (
            <div>
              {/* Role counts */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(roleCounts).map(([role, count]) => (
                  <div key={role} className="bg-slate-800/60 rounded-lg p-3">
                    <p className="text-xxs text-slate-400 truncate">{role.replace(/_/g, ' ')}</p>
                    <p className="text-white font-bold text-lg">{count}</p>
                  </div>
                ))}
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-500 text-sm">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No users in this institution yet</div>
              ) : (
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u._id} className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{u.firstName} {u.lastName}</p>
                        <p className="text-slate-400 text-xxs truncate">{u.email}</p>
                      </div>
                      <span className="text-xxs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
                        {u.role?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'settings' && (
            <div>
              <p className="text-xs text-slate-400 mb-3">Feature modules enabled for this institution:</p>
              <div className="space-y-2">
                {institution.settings && Object.entries(institution.settings).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-300 text-xs">{key.replace('enable', '')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xxs font-bold ${val ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                      {val ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InstitutionManagement() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    const data = await InstitutionsAPI.getAll();
    setInstitutions(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchInstitutions(); }, [fetchInstitutions]);

  const handleCreate = async (form) => {
    await InstitutionsAPI.create(form);
    toast.success('Institution created successfully!');
    fetchInstitutions();
  };

  const handleEdit = async (form) => {
    await InstitutionsAPI.update(editTarget._id, form);
    toast.success('Institution updated successfully!');
    setEditTarget(null);
    fetchInstitutions();
  };

  const handleSuspend = async (id) => {
    await InstitutionsAPI.suspend(id);
    toast.success('Institution suspended');
    setDetailTarget(null);
    fetchInstitutions();
  };

  const handleReactivate = async (id) => {
    await InstitutionsAPI.reactivate(id);
    toast.success('Institution reactivated');
    setDetailTarget(null);
    fetchInstitutions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Soft-delete this institution? Users will not be removed.')) return;
    await InstitutionsAPI.delete(id);
    toast.success('Institution removed');
    fetchInstitutions();
  };

  // Filtered view
  const filtered = institutions.filter(inst => {
    const q = search.toLowerCase();
    const matchSearch = !q || inst.name?.toLowerCase().includes(q) || inst.code?.toLowerCase().includes(q) || inst.city?.toLowerCase().includes(q);
    const matchPlan = !filterPlan || inst.plan === filterPlan;
    const matchStatus = !filterStatus || inst.status === filterStatus;
    return matchSearch && matchPlan && matchStatus;
  });

  // Stats
  const total = institutions.length;
  const active = institutions.filter(i => i.status === 'active').length;
  const suspended = institutions.filter(i => i.status === 'suspended').length;
  const enterprise = institutions.filter(i => i.plan === 'enterprise').length;
  const totalUsers = institutions.reduce((s, i) => s + (i.userCount || 0), 0);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#060d18] text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Institution Management
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            EduVerse SaaS — Multi-Tenant Platform Control
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-900/30">
          <FaPlus /> New Institution
        </button>
      </div>

      {/* Tenant Tree Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-4">
        <p className="text-xs font-bold text-slate-400 mb-3">EduVerse Platform Architecture</p>
        <div className="flex items-start gap-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center"><FaCrown /></span>
          </div>
          <div className="flex-1">
            <span className="text-violet-300 font-bold">EduVerse</span>
            <span className="text-slate-500 text-xs ml-2">(Super Admin — Platform Level)</span>
            <div className="ml-4 mt-2 space-y-1 border-l border-slate-700 pl-4">
              {institutions.slice(0, 5).map(inst => (
                <div key={inst._id} className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs">├──</span>
                  <span className="text-indigo-300 text-xs font-semibold">{inst.name}</span>
                  <span className={`text-xxs px-1.5 py-0.5 rounded-full font-bold ${STATUS_COLORS[inst.status] || STATUS_COLORS.inactive}`}>
                    {inst.status}
                  </span>
                  <span className="text-slate-500 text-xxs">({inst.userCount || 0} users)</span>
                </div>
              ))}
              {institutions.length > 5 && (
                <p className="text-slate-600 text-xs pl-4">└── +{institutions.length - 5} more institutions...</p>
              )}
              {institutions.length === 0 && (
                <p className="text-slate-600 text-xs">└── No institutions yet. Create your first one above.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', val: total, color: 'text-indigo-400', icon: <FaBuilding /> },
          { label: 'Active', val: active, color: 'text-emerald-400', icon: <FaCheckCircle /> },
          { label: 'Suspended', val: suspended, color: 'text-red-400', icon: <FaBan /> },
          { label: 'Enterprise', val: enterprise, color: 'text-amber-400', icon: <FaCrown /> },
          { label: 'Total Users', val: totalUsers, color: 'text-violet-400', icon: <FaUsers /> },
        ].map(s => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <span className={`text-lg ${s.color}`}>{s.icon}</span>
            <div>
              <p className={`text-xl font-extrabold ${s.color}`}>{s.val}</p>
              <p className="text-slate-400 text-xxs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            placeholder="Search institutions..." />
        </div>
        <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
          <option value="">All Plans</option>
          {['trial','free','basic','premium','enterprise'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
          <option value="">All Status</option>
          {['active','suspended','trial','inactive'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={fetchInstitutions} className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition">
          <FaSyncAlt className="text-sm" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
              <th className="px-4 py-3 text-left font-bold">Institution</th>
              <th className="px-4 py-3 text-left font-bold">Type</th>
              <th className="px-4 py-3 text-left font-bold">Plan</th>
              <th className="px-4 py-3 text-left font-bold">Status</th>
              <th className="px-4 py-3 text-right font-bold">Users</th>
              <th className="px-4 py-3 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    Loading institutions...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  <FaBuilding className="text-3xl mx-auto mb-2 opacity-30" />
                  <p>No institutions found. Create one to get started.</p>
                </td>
              </tr>
            ) : filtered.map(inst => (
              <tr key={inst._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-indigo-400 text-base">{TYPE_ICONS[inst.type] || <FaBuilding />}</span>
                    <div>
                      <p className="text-white font-semibold text-xs">{inst.name}</p>
                      <p className="text-slate-500 text-xxs font-mono">{inst.code} · {inst.city || inst.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-300 text-xs capitalize">{inst.type}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xxs font-bold ${PLAN_COLORS[inst.plan] || PLAN_COLORS.free}`}>
                    {inst.plan?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xxs font-bold ${STATUS_COLORS[inst.status] || STATUS_COLORS.inactive}`}>
                    {inst.status?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-300 text-xs font-semibold">
                  {(inst.userCount || 0).toLocaleString()}
                  <span className="text-slate-600"> / {inst.maxUsers?.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => setDetailTarget(inst)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-900/20 transition" title="View Detail">
                      <FaEye className="text-xs" />
                    </button>
                    <button onClick={() => { setEditTarget(inst); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-900/20 transition" title="Edit">
                      <FaEdit className="text-xs" />
                    </button>
                    {inst.status === 'active' ? (
                      <button onClick={() => handleSuspend(inst._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition" title="Suspend">
                        <FaBan className="text-xs" />
                      </button>
                    ) : (
                      <button onClick={() => handleReactivate(inst._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/20 transition" title="Reactivate">
                        <FaCheckCircle className="text-xs" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(inst._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-900/20 transition" title="Delete">
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <InstitutionModal isOpen onClose={() => setShowCreateModal(false)} onSave={handleCreate} />
        )}
        {editTarget && (
          <InstitutionModal isOpen onClose={() => setEditTarget(null)} onSave={handleEdit} initial={editTarget} />
        )}
        {detailTarget && (
          <InstitutionDetailDrawer
            institution={detailTarget}
            onClose={() => setDetailTarget(null)}
            onSuspend={handleSuspend}
            onReactivate={handleReactivate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
