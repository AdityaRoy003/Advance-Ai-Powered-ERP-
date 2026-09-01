import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FacilitiesAPI } from '../../services/api';
import { 
  FaUtensils, FaLeaf, FaChartPie, FaCheckCircle, 
  FaExclamationTriangle, FaCalendarAlt, FaRobot, FaQrcode, FaHistory 
} from 'react-icons/fa';

export default function SmartMessCafeteria() {
  const [activeTab, setActiveTab] = useState('menu'); // menu | attendance | wastage_ai
  const [menus, setMenus] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [wasteData, setWasteData] = useState({ logs: [], aiForecast: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessData = async () => {
      setLoading(true);
      try {
        const [menuRes, wasteRes] = await Promise.all([
          FacilitiesAPI.getMessMenu(),
          FacilitiesAPI.getMessWasteStats()
        ]);
        setMenus(menuRes);
        setWasteData(wasteRes);
      } catch (err) {
        console.error('Mess data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessData();
  }, []);

  const handleMarkMeal = async (mealType) => {
    try {
      await FacilitiesAPI.markMealAttendance({ mealType, status: 'Attended' });
      toast.success(`Check-in verified for ${mealType}! Meal token generated.`);
    } catch {
      toast.error('Meal verification failed');
    }
  };

  const dayMenus = menus.filter(m => m.day === selectedDay);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xl">
              <FaUtensils />
            </span>
            <div>
              <h1 className="text-2xl font-black">Smart Mess & Cafeteria</h1>
              <p className="text-slate-400 text-xs mt-0.5">Nutritional meal schedules, biometric meal tokens & AI demand forecasting</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          {[
            { id: 'menu', label: 'Weekly Menu', icon: <FaCalendarAlt /> },
            { id: 'attendance', label: 'Meal Check-in', icon: <FaQrcode /> },
            { id: 'wastage_ai', label: 'AI Demand & Waste', icon: <FaRobot /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Views */}
      {activeTab === 'menu' && (
        <div className="flex flex-col gap-6">
          {/* Day Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedDay === d ? 'bg-amber-500 text-black' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Meal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(mealType => {
              const mealItem = dayMenus.find(m => m.mealType === mealType);
              return (
                <div key={mealType} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{mealType}</span>
                      <span className="text-xxs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                        {mealItem?.calories || 450} kcal
                      </span>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      {mealItem?.items?.map((it, idx) => (
                        <li key={idx} className="text-sm font-medium text-slate-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{it}</span>
                        </li>
                      )) || <li className="text-xs text-slate-500">Regular hostel meal standard</li>}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xxs text-emerald-400 font-semibold flex items-center gap-1">
                      <FaLeaf size={10} /> Certified Nutritious
                    </span>
                    <button 
                      onClick={() => handleMarkMeal(mealType)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xxs font-bold transition"
                    >
                      Token Check-in
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <h2 className="text-lg font-bold mb-1">Instant Cafeteria QR Scanner</h2>
            <p className="text-slate-400 text-xs mb-6">Scan terminal QR code or show digital student meal barcode at turnstiles</p>

            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-amber-500/30 bg-amber-500/5 mb-6">
              <FaQrcode className="text-6xl text-amber-400 mb-3 animate-pulse" />
              <p className="text-sm font-bold text-white mb-1">EDV-MEAL-TOKEN-88902</p>
              <p className="text-xxs text-slate-400">Valid for today's Lunch & Dinner sessions</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(meal => (
                <button
                  key={meal}
                  onClick={() => handleMarkMeal(meal)}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-amber-500/40 text-center transition"
                >
                  <p className="text-xs font-bold text-white mb-1">{meal}</p>
                  <span className="text-xxs text-amber-400 font-medium">Verify Entry</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
              <FaHistory className="text-amber-400" />
              <span>Recent Meal Access</span>
            </h2>
            <div className="space-y-3">
              {[
                { meal: 'Lunch Today', time: '12:45 PM', status: 'Verified' },
                { meal: 'Breakfast Today', time: '08:15 AM', status: 'Verified' },
                { meal: 'Dinner Yesterday', time: '08:30 PM', status: 'Verified' }
              ].map((rec, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{rec.meal}</p>
                    <p className="text-xxs text-slate-500">{rec.time}</p>
                  </div>
                  <span className="text-xxs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wastage_ai' && (
        <div className="flex flex-col gap-6">
          {/* AI Forecast Banner */}
          {wasteData.aiForecast && (
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-900 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <FaRobot size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">AI Predictive Meal Demand Engine</h2>
                  <p className="text-slate-400 text-xs">Trained on historical consumption, live hostel occupancy, and day-of-week trends</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xxs text-slate-400 uppercase font-bold">Forecasted Meals Tomorrow</p>
                  <p className="text-xl font-black text-amber-400 mt-1">{wasteData.aiForecast.predictedMealsTomorrow}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xxs text-slate-400 uppercase font-bold">Recommended Prep (Kg)</p>
                  <p className="text-xl font-black text-emerald-400 mt-1">{wasteData.aiForecast.suggestedPrepKg} kg</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xxs text-slate-400 uppercase font-bold">Monthly Cost Savings</p>
                  <p className="text-xl font-black text-blue-400 mt-1">₹{wasteData.aiForecast.potentialCostSavingsInr?.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xxs text-slate-400 uppercase font-bold">Model Confidence</p>
                  <p className="text-xl font-black text-purple-400 mt-1">{wasteData.aiForecast.modelConfidencePct}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Waste Logs Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <h3 className="font-bold text-sm">Historical Food Preparation & Wastage Audit</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 text-xxs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Session</th>
                    <th className="p-4">Prepared (Kg)</th>
                    <th className="p-4">Consumed (Kg)</th>
                    <th className="p-4">Wasted (Kg)</th>
                    <th className="p-4">Wastage %</th>
                    <th className="p-4">CO₂ Footprint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {wasteData.logs?.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono font-bold text-white">{log.date}</td>
                      <td className="p-4 text-amber-400 font-bold">{log.mealType}</td>
                      <td className="p-4">{log.foodPreparedKg} kg</td>
                      <td className="p-4 text-emerald-400 font-semibold">{log.foodConsumedKg} kg</td>
                      <td className="p-4 text-rose-400 font-semibold">{log.foodWastedKg} kg</td>
                      <td className="p-4 font-bold">{log.wastePercentage}%</td>
                      <td className="p-4 text-slate-400">{log.co2ImpactKg} kg CO₂</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
