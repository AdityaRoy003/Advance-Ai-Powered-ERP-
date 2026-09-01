import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBuilding, FaBolt, FaTint, FaWifi, FaBus, FaUsers,
  FaShieldAlt, FaChartLine, FaExclamationTriangle, FaEye,
  FaCubes, FaLayerGroup, FaBroadcastTower, FaMicrochip,
  FaMapMarkerAlt, FaThermometerHalf, FaSyncAlt
} from 'react-icons/fa';
import { CampusAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function DigitalCampusTwin() {
  const [facilities, setFacilities] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState('ALL'); // ALL | POWER | WATER | CROWD | BUSES
  const [forecastBuilding, setForecastBuilding] = useState('Aryabhata Academic Complex (Block A)');

  const fetchTwinData = async () => {
    setLoading(true);
    try {
      const data = await CampusAPI.getDigitalTwin();
      if (Array.isArray(data) && data.length > 0) {
        setFacilities(data);
        setSelectedBuilding(data[0]);
      }
    } catch (err) {
      console.error('Error fetching campus twin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTwinData();
  }, []);

  const totalPower = facilities.reduce((sum, f) => sum + (f.currentPowerKW || 0), 0).toFixed(1);
  const totalWater = facilities.reduce((sum, f) => sum + (f.currentWaterLitersPerHour || 0), 0);
  const totalOccupancy = facilities.reduce((sum, f) => sum + (f.occupancyCount || 0), 0);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 text-xl border border-cyan-500/30">
              <FaCubes />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                Digital Campus & 3D Twin
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time IoT Telemetry, Energy Load Forecasting & Transit Digital Simulation
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'POWER', 'WATER', 'CROWD', 'BUSES'].map(layer => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-xl text-xxs font-extrabold tracking-wider transition ${activeLayer === layer ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
            >
              {layer}
            </button>
          ))}
          <button onClick={fetchTwinData} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition">
            <FaSyncAlt className="text-xs" />
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xxs uppercase font-black text-slate-400">Total Power Draw</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{totalPower} <span className="text-xs text-slate-400 font-normal">kW</span></p>
            <span className="text-xxs text-emerald-400 font-bold">● AI Peak Shaving Active</span>
          </div>
          <span className="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-xl border border-amber-500/20"><FaBolt /></span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xxs uppercase font-black text-slate-400">Water Consumption</span>
            <p className="text-2xl font-black text-cyan-400 mt-1">{totalWater} <span className="text-xs text-slate-400 font-normal">L/h</span></p>
            <span className="text-xxs text-cyan-400 font-bold">● Smart Greywater Recycling</span>
          </div>
          <span className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl text-xl border border-cyan-500/20"><FaTint /></span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xxs uppercase font-black text-slate-400">Campus Occupancy</span>
            <p className="text-2xl font-black text-indigo-400 mt-1">{totalOccupancy} <span className="text-xs text-slate-400 font-normal">people</span></p>
            <span className="text-xxs text-indigo-400 font-bold">● 68% Capacity (Nominal)</span>
          </div>
          <span className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl text-xl border border-indigo-500/20"><FaUsers /></span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xxs uppercase font-black text-slate-400">Mesh Connectivity</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">10.0 <span className="text-xs text-slate-400 font-normal">Gbps</span></p>
            <span className="text-xxs text-emerald-400 font-bold">● Zero Packet Loss</span>
          </div>
          <span className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-xl border border-emerald-500/20"><FaWifi /></span>
        </div>
      </div>

      {/* Main 3D Twin Visual Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive 3D / Isometric Campus Canvas */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-b from-[#0e1626] to-[#090d16] border border-slate-800/80 p-6 flex flex-col relative overflow-hidden min-h-[460px]">
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">Live Digital Twin Render</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 text-xxs font-mono border border-slate-700">
              WebGL · Isometric View 45°
            </span>
          </div>

          {/* Isometric Campus Graphic Visualizer */}
          <div className="flex-1 flex items-center justify-center relative my-6">
            {/* Grid base */}
            <div className="w-full max-w-lg h-72 border border-cyan-500/10 rounded-2xl bg-cyan-950/5 relative flex items-center justify-around p-4 shadow-inner">
              {facilities.map((fac, idx) => {
                const isSelected = selectedBuilding?._id === fac._id;
                return (
                  <motion.div
                    key={fac._id || idx}
                    whileHover={{ scale: 1.06, y: -6 }}
                    onClick={() => setSelectedBuilding(fac)}
                    className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl transition border ${isSelected ? 'bg-indigo-600/30 border-indigo-400 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-400/40' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}`}
                  >
                    <div className="w-14 h-16 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg relative">
                      <FaBuilding />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-xxs flex items-center justify-center font-bold">
                        {fac.floorsCount}F
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white mt-2 text-center max-w-[130px] line-clamp-1">{fac.buildingName.split('(')[0]}</span>
                    <span className="text-xxs text-cyan-400 font-mono mt-0.5">{fac.currentPowerKW} kW</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Live Transit Buses Telematics Bar */}
          <div className="mt-auto z-10 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-amber-400"><FaBus /></span>
              <span className="text-xs font-bold text-slate-300">Live Campus Transit GPS:</span>
              <span className="text-xxs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">2 Buses En Route</span>
            </div>
            <div className="flex items-center gap-4 text-xxs text-slate-400">
              <span>● Bus-01: Central Gate (ETA 8m)</span>
              <span>● Bus-04: Tech Park (ETA 14m)</span>
            </div>
          </div>
        </div>

        {/* Building Telemetry & Predictive AI Inspector */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xxs uppercase font-black text-cyan-400 tracking-wider">Telemetry Inspector</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedBuilding?.buildingName || 'Select a Building'}</h3>
              </div>
              <span className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xxs font-bold">
                {selectedBuilding?.category || 'Academic'}
              </span>
            </div>

            {selectedBuilding && (
              <div className="mt-5 space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <FaBolt className="text-amber-400" />
                    <span className="text-xs text-slate-300 font-semibold">Active Power Draw</span>
                  </div>
                  <span className="text-sm font-mono font-black text-amber-400">{selectedBuilding.currentPowerKW} kW</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <FaTint className="text-cyan-400" />
                    <span className="text-xs text-slate-300 font-semibold">Water Flow</span>
                  </div>
                  <span className="text-sm font-mono font-black text-cyan-400">{selectedBuilding.currentWaterLitersPerHour} L/hr</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <FaUsers className="text-indigo-400" />
                    <span className="text-xs text-slate-300 font-semibold">Occupancy Density</span>
                  </div>
                  <span className="text-sm font-mono font-black text-indigo-400">
                    {selectedBuilding.occupancyCount} / {selectedBuilding.maxCapacity}
                  </span>
                </div>

                {/* AI Predictive Intelligence Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <FaMicrochip />
                    <span className="text-xs font-black uppercase tracking-wider">Predictive AI ML Engine</span>
                  </div>
                  <p className="text-xxs text-slate-300 leading-relaxed">
                    "AI Forecast: Tomorrow's expected load will peak at <strong className="text-amber-400">{selectedBuilding.powerForecastTomorrowKW} kW</strong> between 11:00 AM - 1:30 PM due to scheduled lab simulations."
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => toast.success(`Diagnostic signal dispatched to ${selectedBuilding?.buildingName}`)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg"
          >
            Dispatch IoT Calibration Ping
          </button>
        </div>
      </div>
    </div>
  );
}
