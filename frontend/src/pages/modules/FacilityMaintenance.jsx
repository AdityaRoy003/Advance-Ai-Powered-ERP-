import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FacilitiesAPI } from '../../services/api';
import { 
  FaWrench, FaClock, FaCheckCircle, FaExclamationTriangle, 
  FaPlus, FaPhoneAlt, FaUserTie, FaFilter 
} from 'react-icons/fa';

export default function FacilityMaintenance() {
  const [tickets, setTickets] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('Electrical');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await FacilitiesAPI.getMaintenanceTickets();
      setTickets(res);
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

    try {
      await FacilitiesAPI.createMaintenanceTicket({ category, location, description, priority });
      toast.success('Maintenance ticket created with SLA timer active!');
      setShowCreateModal(false);
      setLocation('');
      setDescription('');
      fetchTickets();
    } catch {
      toast.error('Failed to create ticket');
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await FacilitiesAPI.updateTicketStatus(id, { status: nextStatus });
      toast.success(`Ticket moved to ${nextStatus}`);
      fetchTickets();
    } catch {
      toast.error('Status update failed');
    }
  };

  const categories = ['All', 'Electrical', 'Air Conditioning', 'Plumbing', 'Furniture', 'Network / Wi-Fi', 'Lab Equipment', 'Classroom'];
  const filtered = filterCategory === 'All' ? tickets : tickets.filter(t => t.category === filterCategory);

  const getPriorityColor = (p) => {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xl">
              <FaWrench />
            </span>
            <div>
              <h1 className="text-2xl font-black">Facility & Maintenance Management</h1>
              <p className="text-slate-400 text-xs mt-0.5">Automated work orders, technician dispatch, SLA resolution tracking & repair audit</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs transition shadow-lg shadow-orange-500/20"
        >
          <FaPlus />
          <span>New Maintenance Ticket</span>
        </button>
      </div>

      {/* SLA Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Active Work Orders</p>
          <p className="text-2xl font-black text-white mt-1">{tickets.filter(t => t.status !== 'Closed').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">High Priority SLA</p>
          <p className="text-2xl font-black text-rose-400 mt-1">30 min Response</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Avg Resolution Time</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">2.4 Hours</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">SLA Compliance Rate</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.ticketNumber} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between">
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
                  <span className="font-semibold text-emerald-400">{t.resolutionSlaHours}h window</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xxs px-2.5 py-1 rounded-lg bg-slate-800 font-bold text-slate-300">
                {t.status}
              </span>
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
          </div>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-slate-800 bg-[#111827] p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-white mb-4">Create Maintenance Work Order</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Location / Room</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Lab 402, Science Block" className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Priority Level (SLA Trigger)</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                  <option value="LOW">LOW (24h SLA)</option>
                  <option value="MEDIUM">MEDIUM (8h SLA)</option>
                  <option value="HIGH">HIGH (4h SLA)</option>
                  <option value="CRITICAL">CRITICAL (2h Emergency SLA)</option>
                </select>
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase">Problem Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the fault or maintenance requirement..." className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-orange-500 text-black font-bold text-xs shadow-lg shadow-orange-500/20">Submit Ticket</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
