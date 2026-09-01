import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaUserCheck, FaWallet, FaBook, FaLock, FaBrain } from 'react-icons/fa';

export default function Analytics() {
  const [activeCategory, setActiveCategory] = useState('student');

  const chartsData = {
    student: {
      title: 'Student Performance Metrics',
      desc: 'Distribution of grade scores across final examinations.',
      data: [
        { label: 'Grade O', count: 12, height: 120 },
        { label: 'Grade A+', count: 28, height: 280 },
        { label: 'Grade A', count: 35, height: 350 },
        { label: 'Grade B+', count: 15, height: 150 },
        { label: 'Grade F', count: 4, height: 40 }
      ]
    },
    attendance: {
      title: 'Average Attendance Trends',
      desc: 'Average attendance percentages per class department.',
      data: [
        { label: 'CS Department', count: 95.2, height: 350 },
        { label: 'IT Department', count: 91.8, height: 320 },
        { label: 'Mechanical Eng', count: 86.4, height: 280 },
        { label: 'Civil Eng', count: 82.1, height: 240 }
      ]
    },
    finance: {
      title: 'Fee Collections Ledgers',
      desc: 'Outstanding invoice status counts across the spring term.',
      data: [
        { label: 'Fully Paid', count: 1240, height: 320 },
        { label: 'Partial Dues', count: 245, height: 180 },
        { label: 'Unpaid Dues', count: 88, height: 80 }
      ]
    },
    security: {
      title: 'SIEM Threat Telemetry Blocks',
      desc: 'Intrusions blocked by rate limiting and validation headers.',
      data: [
        { label: 'SQL Injections', count: 18, height: 120 },
        { label: 'NoSQL Injections', count: 32, height: 240 },
        { label: 'Rate Limits Trigger', count: 54, height: 360 }
      ]
    }
  };

  const activeChart = chartsData[activeCategory];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-black">Institutional Analytics Center</h1>
        <p className="text-slate-400 text-xs mt-0.5">Explore grade distributions, fee collections, and cyber-security threat logs.</p>
      </div>

      {/* Grid Category selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold font-sans">
        {[
          { id: 'student', label: 'Academic Performance', icon: <FaChartBar className="text-indigo-400" /> },
          { id: 'attendance', label: 'Attendance Rates', icon: <FaUserCheck className="text-emerald-400" /> },
          { id: 'finance', label: 'Fees & Collections', icon: <FaWallet className="text-amber-400" /> },
          { id: 'security', label: 'SIEM Logs Telemetry', icon: <FaLock className="text-pink-400" /> }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 text-left ${
              activeCategory === cat.id 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-800/40 text-slate-400'
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xxs font-bold">Category</span>
              <span>{cat.label}</span>
            </div>
            <div className="text-base p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">{cat.icon}</div>
          </button>
        ))}
      </div>

      {/* Chart Canvas Mockup representation */}
      <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">{activeChart.title}</h2>
          <p className="text-slate-400 text-xxs mt-0.5">{activeChart.desc}</p>
        </div>

        {/* Dynamic bar charts layout */}
        <div className="h-64 flex items-end gap-6 md:gap-12 border-b border-l border-slate-800 pb-3 pl-3">
          {activeChart.data.map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xxs font-mono font-bold text-indigo-400">{bar.count}</span>
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${(bar.height / 400) * 180}px` }}
                transition={{ duration: 0.6 }}
                className="w-full bg-gradient-to-t from-indigo-500 to-pink-500 rounded-t-lg shadow-lg"
              />
              <span className="text-xxs text-slate-400 text-center font-semibold truncate max-w-[80px] md:max-w-none">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
