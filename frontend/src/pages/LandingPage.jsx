import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FaRobot, FaUserShield, FaBrain, FaChartLine, FaBell,
  FaMoon, FaSun, FaArrowRight, FaCheck, FaLock, FaUsers,
  FaFileAlt, FaCalendarCheck, FaCode, FaGlobe, FaAngleDown,
  FaLinkedin, FaGithub, FaTwitter, FaRegStar, FaStar
} from 'react-icons/fa';

// Stat counter card (separate component to avoid hooks-in-map violation)
function StatCounter({ end, label, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, 2000 / steps);
    return () => clearInterval(interval);
  }, [isInView, end]);

  return (
    <div ref={ref} className="flex flex-col gap-2 text-center">
      <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {count}{suffix}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{label}</span>
    </div>
  );
}

// Floating orb background
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-indigo-600/15 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute top-40 right-[15%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-[20%] w-64 h-64 bg-pink-600/10 rounded-full blur-[70px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-cyan-600/10 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}

const statItems = [
  { end: 542, label: 'Employees Managed', suffix: '+' },
  { end: 98, label: 'System Uptime', suffix: '%' },
  { end: 12, label: 'Departments Connected', suffix: '' },
  { end: 24, label: 'AI Modules Deployed', suffix: '' }
];

const features = [
  {
    icon: <FaUserShield className="text-2xl" />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'Role-Based Access Control',
    desc: 'Granular RBAC with dynamic permission matrices. Every user only sees what they need.'
  },
  {
    icon: <FaBrain className="text-2xl" />,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    title: 'AI ERP Copilot',
    desc: 'Natural language queries against your HR, finance, and attendance database in real-time.'
  },
  {
    icon: <FaChartLine className="text-2xl" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Analytics & Heatmaps',
    desc: 'KPI dashboards, GitHub-style attendance heatmaps, employee growth curves, and more.'
  },
  {
    icon: <FaLock className="text-2xl" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'SIEM Cybersecurity Center',
    desc: 'Detect failed logins, permission overrides, and audit all user actions in real time.'
  },
  {
    icon: <FaCalendarCheck className="text-2xl" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Approvals Workflow Engine',
    desc: 'Multi-stage leave, project, and payroll approval flows from Employee to Manager to HR.'
  },
  {
    icon: <FaBell className="text-2xl" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Live Notification Center',
    desc: 'Socket.IO-powered real-time alerts: approvals, payroll dispatches, and security events.'
  },
  {
    icon: <FaFileAlt className="text-2xl" />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    title: 'Audit Log System',
    desc: 'Every action — permission toggle, salary update, role change — is timestamped and persisted.'
  },
  {
    icon: <FaGlobe className="text-2xl" />,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'Global Enterprise Search',
    desc: 'Search employees, invoices, projects, and documents from one unified search interface.'
  }
];

const plans = [
  {
    name: 'Starter',
    price: '₹4,999',
    period: '/month',
    desc: 'Perfect for small institutions and startups.',
    features: ['Up to 50 users', '5 departments', 'Basic reporting', 'Email support'],
    cta: 'Start Free Trial',
    highlight: false
  },
  {
    name: 'Professional',
    price: '₹14,999',
    period: '/month',
    desc: 'Full-suite ERP for mid-size organizations.',
    features: ['Up to 500 users', '25 departments', 'RBAC & permissions', 'AI Copilot', 'Priority support', 'Audit logs'],
    cta: 'Get Started',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Scalable for large organizations with custom SLAs.',
    features: ['Unlimited users', 'Custom integrations', 'SIEM cybersecurity', 'Dedicated account manager', 'SLA 99.99% uptime'],
    cta: 'Contact Sales',
    highlight: false
  }
];

const testimonials = [
  { name: 'Priya Sharma', role: 'CHRO, TechVision India', text: 'EduVerse ERP completely transformed our HR workflows. Leave approvals that took 3 days now take minutes.' },
  { name: 'Arjun Mehta', role: 'CTO, InnovateCo', text: 'The RBAC system and audit logs give us full enterprise-grade compliance out of the box. Remarkable product.' },
  { name: 'Sarah Mitchell', role: 'IT Director, GlobalEd', text: 'The AI Copilot answers natural language queries against our entire organizational data. The future of ERP is here.' }
];

const faqItems = [
  { q: 'How does the RBAC system work?', a: 'Roles are configured with a permission matrix covering modules like Employee, Payroll, and Reports — each with View, Create, Edit, and Delete toggles. Changes propagate instantly to sidebar navigation and accessible features.' },
  { q: 'Is my data secure?', a: 'All data is encrypted at rest and in transit. The SIEM module monitors for failed logins, injection attempts, and permission anomalies in real-time, with audit trails for every action.' },
  { q: 'Can I try different dashboard views?', a: 'Yes! After login, use the Role Switcher in the top navigation to instantly preview Super Admin, HR Manager, and Employee dashboards with their respective permissions.' },
  { q: 'Does the AI Copilot work offline?', a: 'The AI Copilot queries your organization\'s local database using pattern-matching and pre-trained models. An internet connection is only required for advanced LLM features.' }
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiDemo = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    setTimeout(() => {
      setAiLoading(false);
      if (aiQuery.toLowerCase().includes('attendance')) {
        setAiResponse('Found 24 employees with attendance below 80%. Top 3: Rahul Sharma (72%), Jay Patel (68%), Nisha Roy (65%). Generate report?');
      } else if (aiQuery.toLowerCase().includes('payroll') || aiQuery.toLowerCase().includes('salary')) {
        setAiResponse('Current month payroll: ₹45,00,000 disbursed. 3 pending approvals. Finance team notified. Generate ledger?');
      } else if (aiQuery.toLowerCase().includes('leave')) {
        setAiResponse('12 active leave applications. 4 awaiting manager approval. Oldest pending: Rahul Sharma (3 days). Open Approvals?');
      } else {
        setAiResponse(`Queried "${aiQuery}" across all modules. Found 8 matching records in Employee, Finance, and Projects. Open results?`);
      }
    }, 1400);
  };

  return (
    <div className={`min-h-screen font-sans ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-white text-slate-900'} transition-all duration-300`}>
      
      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#090d16]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 font-extrabold text-lg">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/30">
              <FaRobot className="text-white text-lg" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              EduVerse ERP
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-500 transition">Features</a>
            <a href="#demo" className="hover:text-indigo-500 transition">Demo</a>
            <a href="#pricing" className="hover:text-indigo-500 transition">Pricing</a>
            <a href="#faq" className="hover:text-indigo-500 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-500/40 transition">
              {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
            <Link to="/login" className="text-sm font-bold border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl hover:border-indigo-500/40 transition text-slate-600 dark:text-slate-300">
              Sign In
            </Link>
            <button onClick={() => navigate('/register')} className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5">
              Get Started <FaArrowRight size={10} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <FloatingOrbs />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8"
          >
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
            Enterprise-grade ERP • Powered by AI • Built for Scale
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            The <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Intelligent</span>
            <br />Enterprise ERP
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Unify HR, Finance, Attendance, and Operations in one AI-powered platform. 
            Built with role-based access, real-time alerts, and an intelligent copilot assistant.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition flex items-center gap-2"
            >
              Launch Dashboard <FaArrowRight />
            </button>
            <a 
              href="#demo"
              className="border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 text-slate-600 dark:text-slate-300 font-bold px-8 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition flex items-center gap-2"
            >
              See AI Demo <FaAngleDown />
            </a>
          </div>

          {/* Dashboard Preview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mx-auto max-w-3xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-indigo-900/20 bg-[#111827]"
          >
            {/* Mock dashboard header bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-[#0d1420]">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-4 text-slate-500 text-xs font-mono">eduverse-erp.app/dashboard/super_admin</span>
            </div>

            {/* Mock dashboard content */}
            <div className="p-6 grid grid-cols-3 gap-4 text-left">
              {[
                { label: 'Total Users', val: '120', trend: '↑ 12%', color: 'text-indigo-400' },
                { label: 'Departments', val: '12', trend: 'Synced', color: 'text-emerald-400' },
                { label: 'Active Sessions', val: '98', trend: '↑ 8%', color: 'text-pink-400' }
              ].map((c, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xxs text-slate-500 font-bold uppercase tracking-widest block mb-1">{c.label}</span>
                  <span className="text-2xl font-black text-white block">{c.val}</span>
                  <span className={`text-xxs font-bold ${c.color}`}>{c.trend}</span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 grid grid-cols-2 gap-4">
              {/* Mock chart bars */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-xxs text-slate-500 font-bold mb-3 block">Employee Growth</span>
                <div className="flex items-end gap-1.5 h-12">
                  {[40, 55, 45, 70, 60, 85, 75, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-indigo-500 rounded-t opacity-80 hover:opacity-100 transition" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              {/* Security badge */}
              <div className="bg-slate-900/60 border border-rose-900/30 rounded-2xl p-4">
                <span className="text-xxs text-rose-400 font-bold mb-2 block">Security Alerts</span>
                <div className="flex flex-col gap-1.5 text-xxs text-slate-500 font-mono">
                  <span className="text-rose-400">⚠ 5 Failed logins detected</span>
                  <span className="text-amber-400">⚠ 2 Permission overrides</span>
                  <span className="text-emerald-400">✓ Database ONLINE</span>
                </div>
              </div>
            </div>

            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#090d16] to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs font-semibold">Scroll to explore</span>
          <FaAngleDown />
        </motion.div>
      </section>

      {/* STATS COUNTER SECTION */}
      <section className="py-20 border-y border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {statItems.map((item, i) => (
            <StatCounter key={i} end={item.end} label={item.label} suffix={item.suffix} />
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-400 font-bold text-sm uppercase tracking-widest">Enterprise Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Everything your organization needs</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed">
              From granular RBAC to AI-powered analysis — each feature is enterprise-hardened and production-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`p-6 rounded-2xl border ${feat.bg} flex flex-col gap-4 cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.bg} ${feat.color} border`}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">{feat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI DEMO SECTION */}
      <section id="demo" className="py-24 px-6 bg-white/30 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-pink-400 font-bold text-sm uppercase tracking-widest">AI Copilot Demo</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Ask your ERP anything</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed">
              Try natural language queries on employee data, attendance records, payroll, and more.
            </p>
          </div>

          <div className="bg-[#0d1420] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Show low attendance employees', 'Payroll summary this month', 'Pending leave requests'].map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setAiQuery(s)}
                  className="text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={handleAiDemo} className="flex gap-3 mb-6">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder='e.g. "Show employees with attendance below 80%"'
                className="flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm font-semibold placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg">
                Query
              </button>
            </form>

            <AnimatePresence>
              {aiLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-slate-500 font-mono animate-pulse mb-4">
                  AI Copilot is querying your organization data...
                </motion.div>
              )}
              {aiResponse && !aiLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-5 text-sm font-semibold text-slate-200 leading-relaxed flex gap-3 items-start"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaRobot className="text-white text-sm" />
                  </div>
                  <div>
                    <span className="block text-xxs text-indigo-400 font-bold mb-1 uppercase tracking-widest">ERP Copilot</span>
                    {aiResponse}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* DASHBOARD ROLE PREVIEWS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest">Personalized Views</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Different dashboards for every role</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: 'Super Admin',
                badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
                desc: 'Full system visibility with security alerts, database health, permission matrix, and audit logs.',
                modules: ['System Health Monitor', 'SIEM Security Feed', 'User & Role Matrix', 'Audit Logs Trail'],
                route: '/dashboard/super_admin'
              },
              {
                role: 'HR Manager',
                badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
                desc: 'Personnel management with leave approvals, payroll dispatch, and recruitment pipelines.',
                modules: ['Employee Directory', 'Leave Approvals', 'Payroll Dispatch', 'Recruitment Tracking'],
                route: '/dashboard/hr_manager'
              },
              {
                role: 'Employee',
                badge: 'bg-pink-500/15 text-pink-400 border-pink-500/25',
                desc: 'Personal workspace for attendance records, leave balance, payslip downloads, and profile.',
                modules: ['Attendance Ring', 'Leave Balance', 'Pay Slip Download', 'Profile Overview'],
                route: '/dashboard/employee'
              }
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 flex flex-col gap-5"
              >
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold w-fit ${r.badge}`}>
                  {r.role}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{r.desc}</p>
                <ul className="flex flex-col gap-2">
                  {r.modules.map((m, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      <FaCheck className="text-emerald-400 flex-shrink-0" size={10} />
                      {m}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/login')}
                  className="mt-auto w-full border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  Preview Dashboard <FaArrowRight size={10} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-white/30 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-3xl flex flex-col gap-5 ${
                  plan.highlight 
                    ? 'bg-indigo-600 border-2 border-indigo-400 shadow-2xl shadow-indigo-600/30 text-white' 
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40'
                }`}
              >
                <div>
                  <span className={`text-xs font-extrabold uppercase tracking-widest ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.name}</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : ''}`}>{plan.price}</span>
                    <span className={`text-sm font-semibold ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.period}</span>
                  </div>
                  <p className={`text-xs mt-2 leading-relaxed ${plan.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-xs font-semibold ${plan.highlight ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      <FaCheck size={10} className={plan.highlight ? 'text-indigo-200' : 'text-emerald-400'} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigate('/register')}
                  className={`w-full font-bold py-3 rounded-xl transition text-sm ${
                    plan.highlight 
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50' 
                      : 'border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-cyan-400 font-bold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Trusted by teams globally</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <FaStar key={j} className="text-amber-400 text-xs" />)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block text-slate-900 dark:text-white">{t.name}</span>
                    <span className="text-xxs text-slate-400">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 bg-white/30 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-800/60">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-purple-400 font-bold text-sm uppercase tracking-widest">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Common questions</h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#111827]/30"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                >
                  {item.q}
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <FaAngleDown className="text-slate-400 flex-shrink-0" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Ready to modernize your organization?</h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto leading-relaxed">
              Join hundreds of teams using EduVerse ERP to unify operations, automate approvals, and unlock AI-powered insights.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-indigo-600 font-extrabold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition shadow-lg text-sm flex items-center gap-2 mx-auto"
            >
              Get Started Free <FaArrowRight />
            </button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <FaRobot className="text-white text-sm" />
            </div>
            EduVerse ERP
          </Link>
          
          <div className="flex gap-6 font-semibold">
            <a href="#features" className="hover:text-indigo-500 transition">Features</a>
            <a href="#pricing" className="hover:text-indigo-500 transition">Pricing</a>
            <a href="#faq" className="hover:text-indigo-500 transition">FAQ</a>
            <Link to="/login" className="hover:text-indigo-500 transition">Login</Link>
          </div>

          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-indigo-500 transition"><FaGithub /></a>
            <a href="#" className="hover:text-indigo-500 transition"><FaLinkedin /></a>
            <a href="#" className="hover:text-indigo-500 transition"><FaTwitter /></a>
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-slate-500">
          © 2026 EduVerse ERP. Built with React, TypeScript & Express. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
