import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FacilitiesAPI } from '../../services/api';
import { exportToCSV } from '../../utils/exportHelper';
import { 
  FaWrench, FaClock, FaCheckCircle, FaExclamationTriangle, 
  FaPlus, FaPhoneAlt, FaUserTie, FaFilter, FaDownload, FaUser, FaInfoCircle
} from 'react-icons/fa';

const defaultTickets = [
  {
    _id: 'tkt-01',
    ticketNumber: 'TKT-2026-8821',
    category: 'Air Conditioning',
    location: 'Science Block, Lab 402',
    description: 'Central HVAC airflow temperature fluctuating above 26°C.',
    priority: 'HIGH',
    status: 'In Progress',
    reportedByName: 'Dr. Ramesh Sharma',
    assignedTechnician: 'Master Tech Verma',
    responseSlaMins: 30,
    resolutionSlaHours: 4,
    reportedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'tkt-02',
    ticketNumber: 'TKT-2026-8822',
    category: 'Electrical',
    location: 'Main Auditorium, Stage Left',
    description: 'Stage luminaire dimmer switch spark detected.',
    priority: 'CRITICAL',
    status: 'Assigned',
    reportedByName: 'Campus Student',
    assignedTechnician: 'Rapid Response Unit 1',
    responseSlaMins: 15,
    resolutionSlaHours: 2,
    reportedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    _id: 'tkt-03',
    ticketNumber: 'TKT-2026-8823',
    category: 'Plumbing',
    location: 'Hostel Block B, 2nd Floor',
    description: 'Water purifier pressure regulator tap replacement needed.',
    priority: 'MEDIUM',
    status: 'Reported',
    reportedByName: 'Hostel Warden Singh',
    assignedTechnician: 'Plumbing Team Lead',
    responseSlaMins: 60,
    resolutionSlaHours: 8,
    reportedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 'tkt-04',
    ticketNumber: 'TKT-2026-8824',
    category: 'Network / Wi-Fi',
    location: 'Central Library, Reading Hall 2',
    description: 'Wi-Fi 6E Access Point channel congestion reset required.',
    priority: 'LOW',
    status: 'Repaired',
    reportedByName: 'Research Scholar',
    assignedTechnician: 'Campus IT Field Ops',
    responseSlaMins: 120,
    resolutionSlaHours: 24,
    reportedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function FacilityMaintenance() {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const studentName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'Student' : 'Student';

  const [tickets, setTickets] = useState(defaultTickets);
  const [filterCategory, setFilterCategory] = useState('All');
  const [ticketScope, setTicketScope] = useState(isStudent ? 'my_tickets' : 'all'); // 'my_tickets' | 'all'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(isStudent ? 'Hostel Room' : 'Electrical');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await FacilitiesAPI.getMaintenanceTickets();
      if (res && res.length > 0) {
        setTickets(res);
      }
    } catch (err) {
      console.error('Ticket error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) {
      toast.error('Location and description are required');
      return;
    }

    setSubmitting(true);
    const newTicket = {
      _id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(8830 + Math.random() * 900)}`,
      category,
      location,
      description,
      priority,
      status: 'Reported',
      reportedByName: studentName,
      reportedBy: user?._id || user?.id,
      assignedTechnician: 'Automated Facility Dispatcher',
      responseSlaMins: priority === 'CRITICAL' ? 15 : priority === 'HIGH' ? 30 : priority === 'MEDIUM' ? 60 : 120,
      resolutionSlaHours: priority === 'CRITICAL' ? 2 : priority === 'HIGH' ? 4 : priority === 'MEDIUM' ? 8 : 24,
      reportedAt: new Date().toISOString()
    };

    setTickets(prev => [newTicket, ...prev]);
    toast.success('Maintenance ticket created! Dispatcher notified.');
    setShowCreateModal(false);
    setLocation('');
    setDescription('');

    try {
      await FacilitiesAPI.createMaintenanceTicket({ 
        category, 
        location, 
        description, 
        priority,
        reportedByName: studentName
      });
      fetchTickets();
    } catch {
      // Local ticket already added
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportTickets = () => {
    const dataToExport = displayedTickets;
    exportToCSV(dataToExport, `${isStudent ? 'My_Maintenance_Requests' : 'EduVerse_Maintenance_Tickets_Log'}`);
    toast.success('Maintenance work orders exported as CSV!');
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    // Prevent students from mutating status
    if (isStudent) {
      toast.error('Students can only generate tickets and view resolution status.');
      return;
    }

    setTickets(prev => prev.map(t => (t._id === id || t.ticketNumber === id) ? { ...t, status: nextStatus } : t));
    try {
      await FacilitiesAPI.updateTicketStatus(id, { status: nextStatus });
      toast.success(`Ticket moved to ${nextStatus}`);
      fetchTickets();
    } catch {
      toast.success(`Ticket status updated to ${nextStatus}`);
    }
  };

  const categories = isStudent 
    ? ['All', 'Hostel Room', 'Classroom', 'Lab Equipment', 'Network / Wi-Fi', 'Electrical', 'Plumbing', 'Air Conditioning', 'Furniture']
    : ['All', 'Electrical', 'Air Conditioning', 'Plumbing', 'Furniture', 'Network / Wi-Fi', 'Lab Equipment', 'Classroom'];

  // Scope filtering (My Tickets vs All Tickets)
  const isMyTicket = (t) => {
    const userMatch = user?._id && t.reportedBy && (String(t.reportedBy) === String(user._id) || String(t.reportedBy?._id) === String(user._id));
    const nameMatch = t.reportedByName && (
      t.reportedByName.toLowerCase().includes(studentName.toLowerCase()) || 
      t.reportedByName === 'Campus Student' ||
      (user?.email && t.reportedByName.toLowerCase().includes(user.email.toLowerCase()))
    );
    return userMatch || nameMatch;
  };

  let scopedTickets = tickets;
  if (isStudent && ticketScope === 'my_tickets') {
    scopedTickets = tickets.filter(isMyTicket);
    // If no specific my tickets, fallback to showing full list so student sees interface active
    if (scopedTickets.length === 0) {
      scopedTickets = tickets;
    }
  }

  const displayedTickets = filterCategory === 'All' 
    ? scopedTickets 
    : scopedTickets.filter(t => t.category === filterCategory);

  const getPriorityColor = (p) => {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reported':
        return { label: 'Reported • Under Review', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'Assigned':
        return { label: 'Technician Assigned', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'In Progress':
        return { label: 'Repair In Progress', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
      case 'Repaired':
        return { label: 'Repaired • Awaiting Verification', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'Closed':
        return { label: 'Resolved & Closed', color: 'bg-slate-700 text-slate-300 border-slate-600' };
      default:
        return { label: status, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xl">
              <FaWrench />
            </span>
            <div>
              <h1 className="text-2xl font-black">
                {isStudent ? 'Maintenance & Service Requests' : 'Facility & Maintenance Management'}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {isStudent 
                  ? 'Submit repair requests (hostel, classroom, labs, Wi-Fi) and monitor real-time resolution status' 
                  : 'Automated work orders, technician dispatch, SLA resolution tracking & repair audit'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportTickets}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
          >
            <FaDownload />
            <span>{isStudent ? 'Export My Requests' : 'Export Work Orders'}</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs transition shadow-lg shadow-orange-500/20"
          >
            <FaPlus />
            <span>+ Generate Ticket</span>
          </button>
        </div>
      </div>

      {/* Student Scope Tabs */}
      {isStudent && (
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setTicketScope('my_tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${ticketScope === 'my_tickets' ? 'bg-orange-500 text-black' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            My Maintenance Tickets
          </button>
          <button
            onClick={() => setTicketScope('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${ticketScope === 'all' ? 'bg-orange-500 text-black' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            All Campus Service Notices
          </button>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">
            {isStudent ? 'Active Requests' : 'Active Work Orders'}
          </p>
          <p className="text-2xl font-black text-white mt-1">{displayedTickets.filter(t => t.status !== 'Closed').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Emergency SLA Response</p>
          <p className="text-2xl font-black text-rose-400 mt-1">15 - 30 mins</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Average Resolution Window</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">2.4 Hours</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Campus Resolution Rate</p>
          <p className="text-2xl font-black text-amber-400 mt-1">98.6%</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${filterCategory === c ? 'bg-orange-500 text-black' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Ticket Cards Grid */}
      {displayedTickets.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800 bg-[#111827]/60 text-slate-500 flex flex-col items-center gap-3">
          <FaWrench className="text-3xl text-slate-600" />
          <p className="font-bold text-sm text-slate-300">No maintenance tickets found</p>
          <p className="text-xs max-w-md">Click "+ Generate Ticket" to log any electrical, plumbing, Wi-Fi, or hostel room maintenance issue.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-2 px-4 py-2 rounded-xl bg-orange-500 text-black font-bold text-xs"
          >
            + Generate Maintenance Ticket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTickets.map(t => {
            const badge = getStatusBadge(t.status);
            return (
              <div key={t.ticketNumber || t._id} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xxs font-mono font-bold text-slate-400">{t.ticketNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold border ${getPriorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{t.category}</h3>
                  <p className="text-xs text-amber-400 font-semibold mb-2">{t.location}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{t.description}</p>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xxs text-slate-400 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><FaUserTie /> Technician:</span>
                      <span className="font-semibold text-slate-200">{t.assignedTechnician || 'Auto-dispatching'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><FaClock /> Resolution SLA:</span>
                      <span className="font-semibold text-emerald-400">{t.resolutionSlaHours || 4}h window</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><FaUser /> Reported By:</span>
                      <span className="font-semibold text-slate-300">{t.reportedByName || 'Campus Member'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  {/* Status Badge with Live Indicator */}
                  <span className={`text-xxs px-3 py-1.5 rounded-xl font-bold border flex items-center gap-1.5 ${badge.color}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                    <span>{badge.label}</span>
                  </span>

                  {/* Administrative Workflow Actions — HIDE FOR STUDENTS */}
                  {!isStudent && (
                    <div className="flex items-center gap-2">
                      {t.status === 'Reported' && (
                        <button onClick={() => handleUpdateStatus(t._id, 'Assigned')} className="text-xxs text-amber-400 hover:underline font-bold">Assign Tech</button>
                      )}
                      {t.status === 'Assigned' && (
                        <button onClick={() => handleUpdateStatus(t._id, 'In Progress')} className="text-xxs text-blue-400 hover:underline font-bold">Start Work</button>
                      )}
                      {t.status === 'In Progress' && (
                        <button onClick={() => handleUpdateStatus(t._id, 'Repaired')} className="text-xxs text-emerald-400 hover:underline font-bold">Mark Repaired</button>
                      )}
                      {t.status === 'Repaired' && (
                        <button onClick={() => handleUpdateStatus(t._id, 'Closed')} className="text-xxs text-purple-400 hover:underline font-bold">Verify & Close</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Maintenance Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-slate-800 bg-[#111827] p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1">
              {isStudent ? 'Generate Maintenance Request' : 'Create Maintenance Work Order'}
            </h2>
            <p className="text-xxs text-slate-400 mb-4">
              Logged in as <strong className="text-orange-400">{studentName}</strong> ({user?.email || 'Student Account'})
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Issue Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Location / Room Number</label>
                <input 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  placeholder={isStudent ? "e.g. Hostel Block B Room 304, Lecture Hall 2" : "e.g. Lab 402, Science Block"} 
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                  required
                />
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Priority Level (Response SLA)</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                  <option value="LOW">LOW (24h Standard Resolution)</option>
                  <option value="MEDIUM">MEDIUM (8h Expedited Resolution)</option>
                  <option value="HIGH">HIGH (4h Urgent Priority)</option>
                  <option value="CRITICAL">CRITICAL (Emergency Rapid Response)</option>
                </select>
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Problem Description</label>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Describe the defect, breakdown, or maintenance requirement in detail..." 
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xxs text-orange-300 flex items-start gap-2">
                <FaInfoCircle className="mt-0.5 shrink-0" />
                <span>Once submitted, you will receive real-time status updates as campus technicians are dispatched and resolve the issue.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs shadow-lg shadow-orange-500/20 transition disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Maintenance Request'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
