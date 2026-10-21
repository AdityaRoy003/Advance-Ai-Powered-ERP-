import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaUniversity, FaGraduationCap, FaBuilding, FaSchool,
  FaUserTie, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt,
  FaCheck, FaArrowRight, FaArrowLeft, FaShieldAlt, FaRocket,
  FaGlobe, FaBolt, FaCheckCircle, FaLaptopCode, FaCrown
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { InstitutionsAPI } from '../services/api';
import AuthFooter from '../components/layout/AuthFooter';

export default function InstitutionOnboarding() {
  const { setSessionUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [institutionName, setInstitutionName] = useState('');
  const [institutionCode, setInstitutionCode] = useState('');
  const [institutionType, setInstitutionType] = useState('university');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');

  // Administrator Account
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  // Plan & Configuration
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [seedDemoData, setSeedDemoData] = useState(true);

  // Auto-generate slug when name changes if code is blank or matches previous
  const handleNameChange = (e) => {
    const val = e.target.value;
    setInstitutionName(val);
    if (!institutionCode || institutionCode === institutionName.slice(0, 5).toUpperCase()) {
      const generated = val
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 5)
        .toUpperCase();
      setInstitutionCode(generated);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!institutionName.trim() || !institutionCode.trim()) {
        toast.error('Please enter your institution name and campus code');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!adminFirstName.trim() || !adminLastName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
        toast.error('Please fill in all administrator credentials');
        return;
      }
      if (adminPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      setStep(3);
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      const res = await InstitutionsAPI.onboardWorkspace({
        institutionName,
        institutionCode,
        institutionType,
        city,
        state,
        country,
        plan: selectedPlan,
        billingCycle,
        adminFirstName,
        adminLastName,
        adminEmail,
        adminPassword,
        adminPhone,
        seedDemoData
      });

      if (res?.success) {
        toast.success(`🎉 Workspace created! Welcome to ${institutionName}`, { duration: 5000 });
        
        const userData = {
          id: res.data.user._id || res.data.user.id,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
          role: 'ADMIN',
          originalRole: 'ADMIN',
          roleName: 'Campus Administrator',
          designation: 'Institutional Director',
          department: 'Executive Leadership',
          accessLevel: 'Campus Administrator',
          avatarColor: 'from-indigo-600 to-purple-600',
          permissions: ['All Administrative Modules', 'User Management', 'Departments', 'Billing & Quotas'],
          token: res.data.token,
          institutionId: res.data.institution._id,
          institution: res.data.institution
        };

        setSessionUser(userData);
        // Also persist active institution in localStorage for tenant context
        localStorage.setItem('eduverse_active_institution', JSON.stringify(res.data.institution));
        navigate('/dashboard/admin');
      } else {
        toast.error(res?.message || 'Failed to initialize workspace');
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Onboarding failed. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between relative px-4 py-6 sm:px-8 overflow-x-hidden ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar with brand & back link */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800/80 z-10">
        <Link to="/" className="flex items-center gap-3 font-extrabold text-lg">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/30">
            <FaUniversity />
          </div>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-black tracking-tight">
            EduVerse AI
          </span>
          <span className="px-2 py-0.5 rounded-full text-xxs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            WORKSPACE PROVISIONING
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="hidden sm:inline text-slate-400">Already registered?</span>
          <Link to="/login" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-slate-600 dark:text-slate-300 transition">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="my-auto w-full max-w-4xl mx-auto py-10 z-10">
        {/* Progress Stepper */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 -z-0 transition-all duration-300"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />

            {[
              { num: 1, label: 'Campus Identity' },
              { num: 2, label: 'Executive Admin' },
              { num: 3, label: 'Plan & Provision' }
            ].map((s) => {
              const isDone = step > s.num;
              const isActive = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isDone 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                      : isActive 
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/30' 
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400'
                  }`}>
                    {isDone ? <FaCheck size={12} /> : s.num}
                  </div>
                  <span className={`text-xxs font-bold uppercase tracking-wider ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl shadow-2xl">
          <AnimatePresence mode="wait">
            {/* ─── STEP 1: CAMPUS IDENTITY ─── */}
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNext}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Register Your Institution</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Set up an isolated multi-tenant academic workspace for your university or college.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Institution Name *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaUniversity /></span>
                      <input 
                        type="text"
                        required
                        value={institutionName}
                        onChange={handleNameChange}
                        placeholder="e.g. Stanford University of Technology"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Campus Code / Slug *
                      </label>
                      <input 
                        type="text"
                        required
                        value={institutionCode}
                        onChange={(e) => setInstitutionCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                        placeholder="e.g. SUT"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-mono font-bold focus:border-indigo-500 focus:outline-none transition uppercase"
                      />
                      <p className="text-xxs text-indigo-400 font-mono mt-1">
                        Workspace URL: https://{institutionCode.toLowerCase() || 'campus'}.eduverse.ai
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Institution Type
                      </label>
                      <select
                        value={institutionType}
                        onChange={(e) => setInstitutionType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition cursor-pointer"
                      >
                        <option value="university" className="bg-[#111827] text-white">University / Group of Institutions</option>
                        <option value="college" className="bg-[#111827] text-white">Autonomous College / Engineering Campus</option>
                        <option value="institute" className="bg-[#111827] text-white">Specialized Research Institute</option>
                        <option value="polytechnic" className="bg-[#111827] text-white">Polytechnic / Vocational Institute</option>
                        <option value="school" className="bg-[#111827] text-white">Senior Secondary Academy</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">City</label>
                      <input 
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bangalore"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">State</label>
                      <input 
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Karnataka"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Country</label>
                      <input 
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <span>Proceed to Administrator</span>
                    <FaArrowRight size={12} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* ─── STEP 2: EXECUTIVE ADMINISTRATOR ─── */}
            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNext}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Primary Administrator Profile</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    This account will hold master root control over roles, finance ledgers, and academic departments.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        First Name *
                      </label>
                      <input 
                        type="text"
                        required
                        value={adminFirstName}
                        onChange={(e) => setAdminFirstName(e.target.value)}
                        placeholder="Aditya"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Last Name *
                      </label>
                      <input 
                        type="text"
                        required
                        value={adminLastName}
                        onChange={(e) => setAdminLastName(e.target.value)}
                        placeholder="Roy"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Institutional Work Email *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaEnvelope /></span>
                      <input 
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="dean@university.edu"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Master Password *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaLock /></span>
                        <input 
                          type="password"
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Official Phone (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaPhone /></span>
                        <input 
                          type="tel"
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold transition flex items-center gap-2"
                  >
                    <FaArrowLeft size={11} /> Back
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <span>Proceed to Plan Selection</span>
                    <FaArrowRight size={12} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* ─── STEP 3: PLAN TIER & PROVISIONING ─── */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Select Subscription Tier</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Includes 14-day free trial on all plans. No credit card required to begin.
                    </p>
                  </div>

                  {/* Monthly / Annual Toggle */}
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0 self-start">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('annual')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      <span>Annual</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-extrabold">SAVE 20%</span>
                    </button>
                  </div>
                </div>

                {/* Plan Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'starter',
                      name: 'Starter Campus',
                      price: billingCycle === 'annual' ? '₹3,999' : '₹4,999',
                      period: '/month',
                      users: 'Up to 50 active users',
                      storage: '10 GB Cloud Storage',
                      features: ['5 Academic Departments', 'Core Attendance & LMS', 'Basic Student Portals', 'Email Support']
                    },
                    {
                      id: 'professional',
                      name: 'Professional',
                      price: billingCycle === 'annual' ? '₹11,999' : '₹14,999',
                      period: '/month',
                      badge: 'MOST POPULAR',
                      users: 'Up to 500 active users',
                      storage: '50 GB Cloud Storage',
                      features: ['Unlimited Departments', 'AI Copilot & Natural Speech', 'Full RBAC & SIEM Center', 'Approvals Workflow Engine', 'Priority 24/7 Support']
                    },
                    {
                      id: 'enterprise',
                      name: 'Enterprise Multi-Campus',
                      price: 'Custom SLA',
                      period: '',
                      users: '5,000+ active users',
                      storage: '500 GB Dedicated Storage',
                      features: ['Multi-College Governance', 'Custom AI Model Fine-tuning', 'Dedicated Security Officer', '99.99% Uptime Guarantee', 'Single Sign-On (SAML / Azure)']
                    }
                  ].map((p) => {
                    const isSelected = selectedPlan === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500/10 shadow-xl shadow-indigo-500/10'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-700'
                        }`}
                      >
                        {p.badge && (
                          <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full text-xxs font-black bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-sm">
                            {p.badge}
                          </span>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-slate-300">{p.name}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-600'}`}>
                              {isSelected && <FaCheck size={9} />}
                            </div>
                          </div>

                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black">{p.price}</span>
                            <span className="text-xs text-slate-400">{p.period}</span>
                          </div>

                          <div className="text-xxs font-semibold text-slate-400 space-y-1 border-y border-slate-200 dark:border-slate-800 py-2.5">
                            <p className="flex items-center gap-1.5"><FaCrown className="text-amber-400" /> {p.users}</p>
                            <p className="flex items-center gap-1.5"><FaRocket className="text-indigo-400" /> {p.storage}</p>
                          </div>

                          <ul className="space-y-1.5 text-xxs text-slate-300">
                            {p.features.map((f, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <FaCheckCircle className="text-emerald-400 shrink-0" size={10} />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Instant Demo Sandbox Toggle */}
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <FaBolt />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Pre-seed Interactive Sample Academic Data</p>
                      <p className="text-xxs text-slate-400">Loads starter curriculum, faculty roles, and sample courses so you can test immediately.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={seedDemoData} 
                      onChange={(e) => setSeedDemoData(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold transition flex items-center gap-2"
                  >
                    <FaArrowLeft size={11} /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteOnboarding}
                    disabled={loading}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Provisioning Campus Workspace...</span>
                      </>
                    ) : (
                      <>
                        <FaRocket />
                        <span>Launch Workspace (14-Day Free Trial)</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enterprise Trust Footnote */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xxs font-mono text-slate-500">
          <span className="flex items-center gap-1.5"><FaShieldAlt className="text-emerald-400" /> SOC2 Type II Certified</span>
          <span className="flex items-center gap-1.5"><FaCheckCircle className="text-indigo-400" /> FERPA Compliant</span>
          <span className="flex items-center gap-1.5"><FaGlobe className="text-cyan-400" /> GDPR Ready</span>
          <span className="flex items-center gap-1.5"><FaLock className="text-amber-400" /> 256-Bit AES Encryption</span>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
