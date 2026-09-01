import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaCompass, FaPhone, FaChair } from 'react-icons/fa';
import { TransportAPI } from '../../services/api';

export default function Transport() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoutes() {
      try {
        const data = await TransportAPI.getRoutes();
        if (Array.isArray(data)) {
          const formatted = data.map((r, i) => ({
            number: r.busNumber || r.routeName || `Route #${i + 1}`,
            driver: r.driverName || 'Assigned Driver',
            phone: r.driverPhone || 'N/A',
            capacity: `${r.assignedCount || 0} / ${r.capacity || 40} seats`,
            destination: r.stops?.[r.stops.length - 1] || r.routeName || 'Campus Terminal',
            status: r.status || 'Active'
          }));
          setRoutes(formatted);
        } else {
          setRoutes([]);
        }
      } catch (err) {
        console.warn('Live transport routes notice:', err);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    }
    loadRoutes();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-semibold"
    >
      {/* Route list */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black">Transport Shuttle Services</h1>
          <p className="text-slate-400 text-xs mt-0.5">Track institutional transit routes, bus drivers, and seat capacities in real time.</p>
        </div>

        {routes.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-2 bg-[#111827]/40">
            <FaBus className="text-3xl text-slate-600 mb-1" />
            <span className="font-bold text-slate-300 text-sm">No Transport Routes Configured</span>
            <p className="text-xxs text-slate-500 max-w-sm">Transit schedules configured by transport coordinators will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {routes.map((r, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-xl flex-shrink-0">
                    <FaBus />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-base block text-slate-100">{r.number}</span>
                    <span className="text-xxs text-slate-400 block mt-0.5">Destination: {r.destination}</span>
                    <div className="flex items-center gap-4 mt-2 text-xxs text-slate-500">
                      <span className="flex items-center gap-1"><FaChair /> {r.capacity}</span>
                      <span className="flex items-center gap-1"><FaPhone /> {r.driver} ({r.phone})</span>
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xxs font-extrabold uppercase bg-emerald-500/10 text-emerald-400">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map visual */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaCompass className="text-indigo-400" /> Live GPS Transit Map
          </h2>
          
          <div className="h-56 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-25" />
            
            <div className="absolute w-44 h-1 bg-dashed border-t border-indigo-500/35 top-1/2 left-1/4 -translate-y-1/2 rotate-12" />
            
            <motion.div 
              animate={{ x: [-40, 60] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute bg-amber-500 text-slate-900 p-2 rounded-full shadow-lg shadow-amber-500/30 z-10"
            >
              <FaBus size={12} />
            </motion.div>

            <span className="text-xxs font-mono text-slate-500 absolute bottom-3 z-10">Real-time GPS Tracking Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
