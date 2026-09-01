import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoTAPI } from '../../services/api';
import { 
  FaLeaf, FaSun, FaTint, FaBolt, FaRecycle, 
  FaTree, FaRobot, FaArrowDown, FaCheckCircle 
} from 'react-icons/fa';

export default function SustainabilityDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSustainability = async () => {
      setLoading(true);
      try {
        const res = await IoTAPI.getSustainability();
        setData(res);
      } catch (err) {
        console.error('Sustainability fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSustainability();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs font-bold animate-pulse">
        Loading Green Campus Telemetry...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xl">
              <FaLeaf />
            </span>
            <div>
              <h1 className="text-2xl font-black">Sustainability & Carbon Footprint</h1>
              <p className="text-slate-400 text-xs mt-0.5">Net-zero emissions tracking, solar generation, water recycling & AI eco-optimization</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
          <FaTree className="text-emerald-400" />
          <span className="text-xs font-bold text-emerald-300">Green Campus Score: {data?.greenCampusScore || 92.4} / 100</span>
        </div>
      </div>

      {/* Carbon & Resource Reduction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xxs font-bold text-emerald-400 uppercase tracking-wider">Carbon Footprint</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">{data?.co2EmissionsTonnes || 28.4}</span>
              <span className="text-xs text-slate-400">Tonnes CO₂e</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <FaArrowDown />
            <span>-{data?.co2ReductionPctFromLastMonth || 12.4}% reduction vs last month</span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-900 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xxs font-bold text-amber-400 uppercase tracking-wider">Energy Efficiency</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">{data?.totalElectricityKwh?.toLocaleString() || '48,200'}</span>
              <span className="text-xs text-slate-400">kWh consumed</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <FaArrowDown />
            <span>-{data?.energyReductionPct || 8.7}% energy saved</span>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-900 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xxs font-bold text-cyan-400 uppercase tracking-wider">Water Conservation</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">{data?.recycledWaterPct || 42.5}%</span>
              <span className="text-xs text-slate-400">Greywater recycled</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <FaArrowDown />
            <span>-{data?.waterReductionPct || 5.2}% freshwater saved</span>
          </div>
        </div>
      </div>

      {/* Solar & Recycling Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FaSun className="text-yellow-400" />
            <span>Rooftop Solar Generation</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xxs text-slate-400 uppercase font-semibold">Monthly Solar Generation</p>
                <p className="text-xl font-black text-yellow-400 mt-1">{data?.solarGeneratedKwh?.toLocaleString() || '16,400'} kWh</p>
              </div>
              <div className="text-right">
                <p className="text-xxs text-slate-400 uppercase font-semibold">Solar Contribution</p>
                <p className="text-xl font-black text-emerald-400 mt-1">{data?.solarContributionPct || 34.0}%</p>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-emerald-500 h-full rounded-full" style={{ width: `${data?.solarContributionPct || 34}%` }} />
            </div>
            <p className="text-xxs text-slate-400">Targeting 50% campus energy from solar array by Q4 2026</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FaRecycle className="text-emerald-400" />
            <span>Waste Diversion & Paperless Impact</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xxs text-slate-400 uppercase font-semibold">Solid Waste Diverted</p>
              <p className="text-xl font-black text-emerald-400 mt-1">{data?.wasteDivertedKg?.toLocaleString() || '3,820'} kg</p>
              <p className="text-xxs text-slate-500 mt-1">Composted & Recycled</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xxs text-slate-400 uppercase font-semibold">Paper Sheets Saved</p>
              <p className="text-xl font-black text-blue-400 mt-1">{data?.paperSavedSheets?.toLocaleString() || '84,000'}</p>
              <p className="text-xxs text-slate-500 mt-1">Digital ERP Exams & Forms</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Sustainability Forecast & Recommendations */}
      {data?.aiForecast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <FaRobot size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">AI Eco-Forecasting & Next Actions</h2>
              <p className="text-slate-400 text-xs">Continuous ML load forecasting for zero-waste campus sustainability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xxs text-slate-400 font-bold uppercase">Next Month Projected Power</p>
              <p className="text-lg font-black text-amber-400 mt-0.5">{data.aiForecast.nextMonthElectricityKwh?.toLocaleString()} kWh</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xxs text-slate-400 font-bold uppercase">Next Month Water Forecast</p>
              <p className="text-lg font-black text-cyan-400 mt-0.5">{data.aiForecast.nextMonthWaterKiloLiters?.toLocaleString()} kL</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xxs text-slate-400 font-bold uppercase">Estimated Solar Output</p>
              <p className="text-lg font-black text-yellow-400 mt-0.5">{data.aiForecast.estimatedSolarGenerationKwh?.toLocaleString()} kWh</p>
            </div>
          </div>

          <div className="space-y-2">
            {data.aiForecast.recommendedActions?.map((act, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200">
                <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
