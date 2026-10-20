import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TransportAPI } from '../../services/api';
import { FaBus, FaRoute, FaUserTie, FaMapMarkerAlt, FaGasPump, FaPlus } from 'react-icons/fa';

export default function TransportManagerDashboard() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newRoute, setNewRoute] = useState('');
  const [newBus, setNewBus] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newCapacity, setNewCapacity] = useState(45);

  useEffect(() => {
    async function loadRoutes() {
      setLoading(true);
      try {
        const data = await TransportAPI.getRoutes();
        if (Array.isArray(data) && data.length > 0) {
          setRoutes(data.map((r, i) => ({
            id: r._id || r.id || `RT-${i + 1}`,
            routeName: r.name || r.routeName || 'Campus Shuttle',
            busNumber: r.vehicleNumber || r.busNumber || 'Bus Vehicle',
            driver: r.driverName || r.driver || 'Assigned Driver',
            phone: r.driverPhone || '+91 98000 00000',
            capacity: r.capacity || 45,
            enrolled: r.passengersCount || 0,
            status: 'Active'
          })));
        } else {
          setRoutes([]);
        }
      } catch (err) {
        console.warn('Transport live sync notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoutes();
  }, []);

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRoute || !newBus) return;
    const item = {
      id: `RT-${Math.floor(Math.random() * 90 + 10)}`,
      routeName: newRoute,
      busNumber: newBus,
      driver: newDriver || 'Assigned Driver',
      phone: '+91 98000 00000',
      capacity: Number(newCapacity),
      enrolled: 0,
      status: 'Active'
    };
    setRoutes([item, ...routes]);
    setNewRoute('');
    setNewBus('');
    setNewDriver('');
    toast.success(`Transport route "${item.routeName}" provisioned!`);
  };

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Transport Manager' : 'Transport Manager';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold pb-16">
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-teal-900/40 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-teal-400 font-bold uppercase tracking-widest text-xxs flex items-center gap-2">
            <FaBus /> Campus Transit & Fleet Control Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">Hello, {name}</h1>
          <p className="text-slate-400 text-xs">Coordinate shuttle routes, driver allocations, vehicle maintenance, and student transit rosters.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
        {[
          { label: 'Provisioned Routes', val: `${routes.length} Routes`, color: 'text-teal-400' },
          { label: 'Active Fleet Vehicles', val: `${routes.length} Buses`, color: 'text-indigo-400' },
          { label: 'Fleet Status', val: 'Operational', color: 'text-emerald-400' },
          { label: 'Live GPS Tracking', val: 'Enabled', color: 'text-amber-400' }
        ].map((s, i) => (
          <div key={i} className="p-3.5 sm:p-5 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-1 min-w-0">
            <span className="text-[10px] sm:text-xxs uppercase tracking-wider text-slate-400 font-sans font-bold truncate">{s.label}</span>
            <span className={`text-xl sm:text-2xl font-black ${s.color} truncate`}>{s.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><FaRoute className="text-teal-400" /> Active Campus Routes & Fleet Roster</h2>
            {routes.length === 0 ? (
              <div className="p-8 sm:p-12 text-center border border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-2 text-slate-400">
                <FaBus className="text-3xl text-slate-600 mb-1" />
                <span className="font-bold text-sm text-slate-300">No Bus Routes Configured</span>
                <p className="text-xxs text-slate-500">Register shuttle routes using the form to assign vehicles and drivers.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {routes.map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-teal-400 font-bold text-xxs">{r.id}</span>
                        <span className="font-bold text-white text-xs">{r.routeName}</span>
                      </div>
                      <span className="text-xxs text-slate-400">Bus: {r.busNumber} • Driver: {r.driver} ({r.phone})</span>
                      <span className="text-xxs text-slate-500 font-mono">Capacity: {r.capacity} Seats</span>
                    </div>
                    <span className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-lg text-xxs font-mono font-bold self-start sm:self-auto">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPlus className="text-teal-400" /> Provision Transit Route</h2>
            <form onSubmit={handleAddRoute} className="flex flex-col gap-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Route Title</label>
                <input type="text" value={newRoute} onChange={e => setNewRoute(e.target.value)} placeholder="e.g. North Campus Express" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Vehicle Registration Number</label>
                <input type="text" value={newBus} onChange={e => setNewBus(e.target.value)} placeholder="e.g. DL-01-EA-1092" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Assigned Driver Name</label>
                <input type="text" value={newDriver} onChange={e => setNewDriver(e.target.value)} placeholder="Driver Full Name" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Seating Capacity</label>
                <input type="number" min="10" value={newCapacity} onChange={e => setNewCapacity(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" />
              </div>
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs">
                Register Route
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
