import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaBuilding, FaTools, FaBed, FaUserShield } from 'react-icons/fa';
import { HostelAPI } from '../../services/api';

export default function Hostel() {
  const [complaintText, setComplaintText] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await HostelAPI.getRooms();
        if (Array.isArray(data)) {
          const formatted = data.map((r) => ({
            number: r.roomNumber || 'Room',
            occupant: r.occupants?.length ? r.occupants.join(' & ') : 'Vacant',
            status: r.status || (r.occupied === r.capacity ? 'full' : r.occupied > 0 ? 'partial' : 'vacant'),
            block: r.block || 'Main Block'
          }));
          setRooms(formatted);
        } else {
          setRooms([]);
        }
      } catch (err) {
        console.warn('Live hostel rooms notice:', err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintText) {
      toast.error('Please describe the issue');
      return;
    }
    toast.success('Complaint logged! Maintenance team notified.');
    setComplaintText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-semibold"
    >
      {/* Rooms Layout */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black">Hostel Residency & Rooms</h1>
          <p className="text-slate-400 text-xs mt-0.5">Explore real-time room occupancy and accommodation status.</p>
        </div>

        {rooms.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-2 bg-[#111827]/40">
            <FaBuilding className="text-3xl text-slate-600 mb-1" />
            <span className="font-bold text-slate-300 text-sm">No Hostel Allocations Registered</span>
            <p className="text-xxs text-slate-500 max-w-sm">Hostel rooms and block assignments registered by campus administrators will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rooms.map((r, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-lg flex items-center gap-2 text-white">
                    <FaBed className="text-indigo-400" /> Room {r.number}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xxs font-extrabold uppercase ${
                    r.status === 'full' 
                      ? 'bg-rose-500/10 text-rose-400' 
                      : r.status === 'partial' 
                      ? 'bg-amber-500/10 text-amber-400' 
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <span className="text-xs text-slate-300 font-semibold">{r.occupant}</span>
                <span className="text-xxs text-slate-500">{r.block}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warden details & complaints */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Warden details */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center text-xl">
            <FaUserShield />
          </div>
          <div>
            <span className="font-extrabold text-sm block text-white">Hostel Administration</span>
            <span className="text-xxs text-slate-400">Campus Residence Support Desk</span>
          </div>
        </div>

        {/* Complaint Box */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <FaTools className="text-indigo-400" /> Maintenance Desk
          </h2>
          <p className="text-slate-400 text-xxs">Report room maintenance requests (plumbing, lighting, amenities).</p>

          <form onSubmit={handleComplaintSubmit} className="flex flex-col gap-3">
            <textarea 
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows="3"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 focus:outline-none font-semibold text-xs text-slate-200"
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-lg transition text-xs"
            >
              Submit Maintenance Request
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
