import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { IoTAPI } from '../../services/api';
import { 
  FaWifi, FaThermometerHalf, FaBolt, FaTint, 
  FaSmog, FaUsers, FaSun, FaExclamationTriangle, FaSync 
} from 'react-icons/fa';

export default function SmartCampusIoT() {
  const [sensors, setSensors] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const res = await IoTAPI.getSensors();
      setSensors(res);
    } catch (err) {
      console.error('Sensor error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleSimulateTelemetry = async () => {
    setSimulating(true);
    try {
      await IoTAPI.ingestTelemetry({
        sensorId: 'IOT-TEMP-01',
        value: Number((20.5 + Math.random() * 3).toFixed(1)),
        unit: '°C'
      });
      await fetchSensors();
      toast.success('Telemetry packet pushed via MQTT / HTTP Gateway!');
    } catch {
      toast.error('Telemetry ingestion failed');
    } finally {
      setSimulating(false);
    }
  };

  const types = ['All', 'Temperature', 'Electricity', 'Water Flow', 'Air Quality (AQI)', 'Occupancy', 'Solar Generation'];
  const filtered = selectedType === 'All' ? sensors : sensors.filter(s => s.type === selectedType);

  const getIcon = (type) => {
    switch (type) {
      case 'Temperature': return <FaThermometerHalf className="text-rose-400" />;
      case 'Electricity': return <FaBolt className="text-amber-400" />;
      case 'Water Flow': return <FaTint className="text-cyan-400" />;
      case 'Air Quality (AQI)': return <FaSmog className="text-emerald-400" />;
      case 'Occupancy': return <FaUsers className="text-purple-400" />;
      case 'Solar Generation': return <FaSun className="text-yellow-400" />;
      default: return <FaWifi className="text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xl">
              <FaWifi />
            </span>
            <div>
              <h1 className="text-2xl font-black">Smart Campus IoT Network</h1>
              <p className="text-slate-400 text-xs mt-0.5">Real-time MQTT telematics, time-series metrics & sensor threshold diagnostics</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateTelemetry}
            disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-lg shadow-cyan-500/20"
          >
            <FaSync className={simulating ? 'animate-spin' : ''} />
            <span>Emit Live Telemetry</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Active IoT Nodes</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{sensors.length} Connected</p>
          <span className="text-xxs text-emerald-400 font-semibold mt-1 inline-block">100% Online</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Grid Load (kW)</p>
          <p className="text-2xl font-black text-amber-400 mt-1">142.8 kW</p>
          <span className="text-xxs text-slate-400 mt-1 inline-block">Within Safe Threshold</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Solar Generation</p>
          <p className="text-2xl font-black text-yellow-400 mt-1">64.2 kW</p>
          <span className="text-xxs text-emerald-400 font-semibold mt-1 inline-block">34% Campus Power</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-xxs font-bold text-slate-400 uppercase">Average AQI</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">42 AQI</p>
          <span className="text-xxs text-emerald-400 font-semibold mt-1 inline-block">Good Air Quality</span>
        </div>
      </div>

      {/* Sensor Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedType === t ? 'bg-cyan-500 text-black' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sensor Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.sensorId} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-slate-800 text-base">{getIcon(s.type)}</span>
                  <div>
                    <h3 className="text-xs font-bold text-white">{s.name}</h3>
                    <p className="text-xxs font-mono text-slate-500">{s.sensorId}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xxs font-bold ${s.status === 'Alert' ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {s.status}
                </span>
              </div>

              <div className="my-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xxs text-slate-400 uppercase font-semibold">Live Telemetry</p>
                  <p className="text-2xl font-black text-white mt-0.5">
                    {s.currentValue} <span className="text-xs text-slate-400 font-normal">{s.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xxs text-slate-500">Threshold</p>
                  <p className="text-xxs font-mono text-slate-300">{s.minSafeValue} – {s.maxSafeValue} {s.unit}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xxs text-slate-400">
              <span>{s.building} • {s.floor}</span>
              <span>Synced just now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
