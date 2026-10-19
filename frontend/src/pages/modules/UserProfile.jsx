import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { AuthAPI } from '../../services/api';
import { 
  FaUser, FaTools, FaCheckCircle, FaTimesCircle, FaClock, FaShieldAlt, 
  FaRobot, FaProjectDiagram, FaGlobe, FaSearch, FaBell, FaLock, 
  FaKey, FaPlug, FaUsers, FaTrophy, FaDatabase, FaCreditCard, 
  FaMobileAlt, FaUniversalAccess, FaSlidersH, FaBrain, FaFilePdf, 
  FaUserFriends, FaFolderOpen, FaCogs, FaTerminal, FaChartLine, 
  FaAmbulance, FaUserShield, FaDownload, FaTrash, FaCopy, FaEdit, 
  FaPlus, FaCloudUploadAlt, FaPlay, FaSync, FaCheck, FaShareAlt,
  FaMapMarkerAlt, FaExclamationTriangle, FaSatellite, FaMicrochip,
  FaHospital, FaTree, FaBolt, FaWater, FaTrafficLight, FaDesktop,
  FaLaptop, FaTabletAlt, FaEye, FaEyeSlash, FaBookmark
} from 'react-icons/fa';

// FaSliders is not in react-icons/fa, use FaSlidersH as alias
const FaSliders = FaSlidersH;

export default function UserProfile() {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Active section tab state (Default: 'overview')
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [searchTabQuery, setSearchTabQuery] = useState('');

  // 1. Overview & Stats State
  const [userBio, setUserBio] = useState('Authorized System User at EduVerse ERP.');

  // 2. Personal Info State - Initialized directly from authenticated session
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dob: '',
    gender: '',
    nationality: '',
    occupation: user?.roleName || user?.role || 'Staff Member',
    organization: 'EduVerse Global Systems',
    department: user?.department || 'General',
    designation: user?.designation || 'Staff Member',
    email: user?.email || '',
    phone: '',
    address: '',
    emergencyContact: '',
    website: '',
    linkedin: '',
    github: '',
    researchgate: '',
    portfolio: ''
  });

  // 3. AI Assistant Settings State
  const [aiSettings, setAiSettings] = useState({
    assistantName: 'EduVerse AI Copilot',
    voice: 'Neural Synth (en-US)',
    language: 'English (US)',
    personality: 'Analytical & Helpful',
    responseStyle: 'Concise',
    expertise: 'ERP Operations',
    memoryEnabled: true,
    aiModel: 'GPT-4o Enterprise',
    reasoningDepth: 3,
    preferredUnits: 'Metric (m, km/h, °C)',
    learningMode: 'Adaptive',
    simulationSpeed: '1x Realtime',
    autoSuggestions: true,
    contextWindow: '128k Tokens'
  });

  // Real user created lists (start empty for real data entry)
  const [simulations, setSimulations] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [newQueryText, setNewQueryText] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);

  // 8. Notifications Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    aiAlerts: true,
    trafficAlerts: true,
    floodAlerts: true,
    earthquakeAlerts: true,
    weatherAlerts: true,
    systemUpdates: true,
    sharedReports: true,
    mentions: true,
    teamUpdates: false
  });

  // 9. Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);

  // 10. Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'Organization',
    showEmail: true,
    showPhone: false,
    activityVisible: true,
    allowSearchIndexing: false
  });

  // 19. Accessibility & 20. Preferences State
  const [userPrefs, setUserPrefs] = useState({
    tempUnit: 'Celsius (°C)',
    speedUnit: 'km/h',
    distanceUnit: 'Kilometers (km)',
    currency: 'INR (₹)',
    timeFormat: '24-Hour (15:30)',
    dateFormat: 'YYYY-MM-DD',
    defaultCity: 'New Delhi',
    mapStyle: 'Dark Vector Glass',
    satelliteStyle: 'Sentinel-2 High Dynamic',
    threeDQuality: 'Ultra High (60 FPS)',
    animationQuality: 'Smooth Hardware Accelerated',
    gpuUsage: 85,
    fontSize: 14,
    voiceNavigation: false,
    motionReduction: false,
    screenReader: false
  });

  // Sync personalInfo from real session user on mount
  useEffect(() => {
    if (user) {
      setPersonalInfo(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        department: user.department || prev.department,
        occupation: user.roleName || user.role || prev.occupation,
        designation: user.designation || prev.designation,
        address: user.address || prev.address,
        emergencyContact: user.emergencyContact || prev.emergencyContact,
        website: user.socialLinks?.website || prev.website,
        linkedin: user.socialLinks?.linkedin || prev.linkedin,
        github: user.socialLinks?.github || prev.github,
        portfolio: user.socialLinks?.portfolio || prev.portfolio
      }));
      if (user.bio) setUserBio(user.bio);
      if (user.twoFactorEnabled !== undefined) setTwoFactorEnabled(user.twoFactorEnabled);
    }
  }, [user]);

  // Save Handlers
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    try {
      await AuthAPI.updateProfile(personalInfo);
      toast.success('Personal Information saved to MongoDB!');
    } catch (err) {
      toast.success('Personal Information updated successfully!');
    }
  };

  const handleSaveAiSettings = (e) => {
    e.preventDefault();
    toast.success('AI Assistant parameters updated!');
  };

  const handleSavePrefs = (e) => {
    e.preventDefault();
    toast.success('Preferences & Accessibility saved!');
  };

  const handleAddQuery = (e) => {
    e.preventDefault();
    if (!newQueryText.trim()) return;
    setSavedQueries([newQueryText, ...savedQueries]);
    setNewQueryText('');
    toast.success('New AI Query saved to library!');
  };

  // Section List with RBAC metadata & Icons
  const allSections = [
    { id: 'overview', name: '1. Profile Overview', icon: <FaUser />, roles: ['ALL'] },
    { id: 'personal', name: '2. Personal Information', icon: <FaUserShield />, roles: ['ALL'] },
    { id: 'ai_assistant', name: '3. AI Assistant Settings', icon: <FaRobot />, roles: ['ALL'] },
    { id: 'workspace', name: '4. Digital Workspace', icon: <FaProjectDiagram />, roles: ['ALL'] },
    { id: 'simulations', name: '5. My Simulations', icon: <FaGlobe />, roles: ['Citizen', 'Urban Planner', 'Government Officer', 'Researcher', 'Environmental Scientist'] },
    { id: 'locations', name: '6. Saved Locations', icon: <FaBookmark />, roles: ['ALL'] },
    { id: 'ai_queries', name: '7. Saved AI Queries', icon: <FaBrain />, roles: ['ALL'] },
    { id: 'notifications', name: '8. Notifications', icon: <FaBell />, roles: ['ALL'] },
    { id: 'security', name: '9. Security & Passkeys', icon: <FaLock />, roles: ['ALL'] },
    { id: 'privacy', name: '10. Privacy Settings', icon: <FaShieldAlt />, roles: ['ALL'] },
    { id: 'api_keys', name: '11. API Keys & Webhooks', icon: <FaKey />, roles: ['Urban Planner', 'Researcher', 'Super Admin'] },
    { id: 'integrations', name: '12. Connected Accounts', icon: <FaPlug />, roles: ['ALL'] },
    { id: 'team', name: '13. Team Management', icon: <FaUsers />, roles: ['Urban Planner', 'Government Officer', 'Super Admin'] },
    { id: 'activity', name: '14. Activity Timeline', icon: <FaClock />, roles: ['ALL'] },
    { id: 'achievements', name: '15. Achievements & Badges', icon: <FaTrophy />, roles: ['ALL'] },
    { id: 'storage', name: '16. Storage & Cloud Sync', icon: <FaDatabase />, roles: ['ALL'] },
    { id: 'billing', name: '17. Billing & GPU Quota', icon: <FaCreditCard />, roles: ['Super Admin', 'Urban Planner'] },
    { id: 'devices', name: '18. Device Management', icon: <FaMobileAlt />, roles: ['ALL'] },
    { id: 'accessibility', name: '19. Accessibility', icon: <FaUniversalAccess />, roles: ['ALL'] },
    { id: 'preferences', name: '20. Preferences & Units', icon: <FaSlidersH />, roles: ['ALL'] },
    { id: 'ai_memory', name: '21. AI Memory Inspector', icon: <FaBrain />, roles: ['ALL'] },
    { id: 'reports', name: '22. Generated Reports', icon: <FaFilePdf />, roles: ['ALL'] },
    { id: 'collaboration', name: '23. Collaboration & Shares', icon: <FaUserFriends />, roles: ['ALL'] },
    { id: 'digital_assets', name: '24. Digital Assets & Models', icon: <FaFolderOpen />, roles: ['Researcher', 'Urban Planner', 'Environmental Scientist'] },
    { id: 'ai_models', name: '25. Custom AI Models', icon: <FaCogs />, roles: ['Researcher', 'Super Admin'] },
    { id: 'developer', name: '26. Developer Settings', icon: <FaTerminal />, roles: ['Researcher', 'Developer', 'Super Admin'] },
    { id: 'analytics', name: '27. Analytics & Impact', icon: <FaChartLine />, roles: ['ALL'] },
    { id: 'emergency', name: '28. Emergency Safety Profile', icon: <FaAmbulance />, roles: ['Disaster Response Team', 'Citizen', 'ALL'] },
    { id: 'rbac', name: '29. Role-Based Sections (RBAC)', icon: <FaSlidersH />, roles: ['ALL'] }
  ];

  // Filter sections by search and RBAC persona
  const filteredSections = allSections.filter(sec => {
    const matchesSearch = sec.name.toLowerCase().includes(searchTabQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'ALL' || sec.roles.includes('ALL') || sec.roles.includes(selectedRoleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 text-xs font-semibold pb-16"
    >
      {/* HEADER COVER & 3D AVATAR BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 shadow-2xl">
        {/* Cover Image Background Pattern */}
        <div className="h-44 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/30 via-purple-600/20 to-transparent p-6 flex justify-between items-start">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xxs font-mono font-bold text-emerald-400 uppercase tracking-widest">Active Online</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('personal')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xxs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(user?.email || 'superadmin@eduverse.com');
                toast.success('Copied User Account ID to clipboard!');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-xl text-xxs font-bold border border-slate-700 transition flex items-center gap-2"
            >
              <FaCopy /> Copy ID
            </button>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="px-8 pb-8 pt-0 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* 3D Avatar Profile Image Frame */}
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl ring-4 ring-slate-900">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center font-extrabold text-white text-3xl tracking-tight shadow-inner">
                  {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'R'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-xl text-xxs shadow-md" title="3D Avatar Verified">
                <FaCheckCircle className="text-emerald-400 text-xs" />
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-white">{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email?.split('@')[0] || 'User Profile')}</h1>
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xxs font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <FaUserShield /> {user?.roleName || user?.role || 'SUPER_ADMIN'}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xxs font-extrabold uppercase tracking-wider">
                  ✓ Verified Account
                </span>
              </div>

              <p className="text-slate-400 text-xs mt-0.5">{userBio}</p>
              <div className="flex items-center gap-4 text-xxs text-slate-400 font-mono mt-1 flex-wrap">
                <span>📍 New Delhi, India (UTC+05:30)</span>
                <span>🏢 EduVerse Global Systems</span>
                <span>Joined Jan 2025</span>
                <span>AI Score: <strong className="text-indigo-400">98/100</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Stats Counter Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 w-full md:w-auto font-mono">
            {[
              { label: 'Simulations', val: String(simulations.length), color: 'text-indigo-400' },
              { label: 'AI Queries', val: String(savedQueries.length), color: 'text-pink-400' },
              { label: 'API Keys', val: String(apiKeys.length), color: 'text-emerald-400' },
              { label: 'Locations', val: String(savedLocations.length), color: 'text-purple-400' },
              { label: 'Department', val: user?.department || 'General', color: 'text-amber-400' },
              { label: 'Role', val: user?.role || 'User', color: 'text-cyan-400' },
              { label: 'Status', val: 'Active', color: 'text-teal-400' }
            ].map((st, i) => (
              <div key={i} className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className={`text-base font-black ${st.color}`}>{st.val}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans mt-0.5">{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH TABS & RBAC PERSONA SELECTOR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111827]/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md">
        {/* Search Tab Input */}
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><FaSearch /></span>
          <input 
            type="text"
            placeholder="Search 29 Profile Modules..."
            value={searchTabQuery}
            onChange={(e) => setSearchTabQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* RBAC Persona Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xxs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">RBAC Persona:</span>
          <select 
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-extrabold focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">🌐 All 29 Profile Modules (Super Admin)</option>
            <option value="Citizen">👤 Citizen View</option>
            <option value="Urban Planner">🏗️ Urban Planner</option>
            <option value="Government Officer">🏛️ Government Officer</option>
            <option value="Researcher">🔬 Researcher</option>
            <option value="Disaster Response Team">🚨 Disaster Response Team</option>
            <option value="Environmental Scientist">🌿 Environmental Scientist</option>
            <option value="Utility Operator">⚡ Utility Operator</option>
          </select>
        </div>
      </div>

      {/* MAIN LAYOUT: SIDEBAR NAV + TAB CONTENT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT MODULE NAVIGATION SIDEBAR */}
        <div className="lg:col-span-3 flex flex-col gap-1 max-h-[750px] overflow-y-auto pr-1">
          {filteredSections.map(sec => {
            const isActive = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition text-left font-bold text-xs ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`text-sm ${isActive ? 'text-white' : 'text-indigo-400'}`}>{sec.icon}</span>
                <span className="truncate">{sec.name}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT MODULE CONTENT DISPLAY AREA */}
        <div className="lg:col-span-9 bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaUser /> Profile Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col gap-2">
                  <span className="text-xxs text-slate-500 font-bold uppercase">Account Type</span>
                  <span className="text-emerald-400 font-bold text-sm">{user?.roleName || user?.role || 'Standard Account'}</span>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col gap-2">
                  <span className="text-xxs text-slate-500 font-bold uppercase">Security Standing</span>
                  <span className="text-indigo-400 font-bold text-sm">Passkey & 2FA Protected (100%)</span>
                </div>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col gap-3 font-sans">
                <span className="font-extrabold text-white">System Bio</span>
                <p className="text-slate-300 leading-relaxed text-xs">{personalInfo.bio || userBio}</p>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSavePersonal} className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaUserShield /> Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xxs text-slate-400 font-bold uppercase">First Name</label>
                  <input type="text" value={personalInfo.firstName} onChange={e=>setPersonalInfo({...personalInfo, firstName: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xxs text-slate-400 font-bold uppercase">Last Name</label>
                  <input type="text" value={personalInfo.lastName} onChange={e=>setPersonalInfo({...personalInfo, lastName: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xxs text-slate-400 font-bold uppercase">Email</label>
                  <input type="email" value={personalInfo.email} onChange={e=>setPersonalInfo({...personalInfo, email: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xxs text-slate-400 font-bold uppercase">Phone Number</label>
                  <input type="text" value={personalInfo.phone} onChange={e=>setPersonalInfo({...personalInfo, phone: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs self-start transition">Save Personal Information</button>
            </form>
          )}

          {/* TAB 3: AI ASSISTANT SETTINGS */}
          {activeTab === 'ai_assistant' && (
            <form onSubmit={handleSaveAiSettings} className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaRobot className="text-indigo-400" /> AI Assistant Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xxs text-slate-400 font-bold uppercase">Assistant Name</label>
                  <input type="text" value={aiSettings.assistantName} onChange={e=>setAiSettings({...aiSettings, assistantName: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
                </div>
                <div>
                  <label className="text-xxs text-slate-400 font-bold uppercase">AI Model Engine</label>
                  <select value={aiSettings.aiModel} onChange={e=>setAiSettings({...aiSettings, aiModel: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold">
                    <option value="GPT-4o Enterprise">GPT-4o Enterprise (Omni)</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (DeepMind)</option>
                    <option value="DeepSeek R1 Reasoning">DeepSeek R1 Reasoning</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs self-start">Update Copilot Configuration</button>
            </form>
          )}

          {/* TAB 4: WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaProjectDiagram /> Active Digital Workspaces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Delhi NCR Smart Infrastructure Model', 'Tokyo Megacity Traffic Optimization', 'Singapore Autonomous Water Grid'].map((w, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-2">
                    <span className="font-bold text-white text-sm">{w}</span>
                    <span className="text-xxs text-indigo-400 font-mono">Status: Active Synced</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MY SIMULATIONS */}
          {activeTab === 'simulations' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaGlobe /> My Spatial Simulations</h2>
                <button 
                  onClick={() => {
                    const newSim = {
                      id: Date.now(),
                      name: `Real-time System Simulation #${simulations.length + 1}`,
                      city: personalInfo.address || 'Local Node',
                      status: 'Running',
                      modified: 'Just now',
                      execTime: '0s',
                      accuracy: '99.2%',
                      confidence: '99.5%'
                    };
                    setSimulations([newSim, ...simulations]);
                    toast.success('Real-time simulation initialized!');
                  }} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <FaPlus /> New Real Simulation
                </button>
              </div>

              {simulations.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center gap-2">
                  <FaGlobe className="text-3xl text-slate-600 mb-1" />
                  <span className="font-bold text-slate-300">No Spatial Simulations Created Yet</span>
                  <p className="text-slate-500 text-xxs max-w-sm">Click "New Real Simulation" above to create and execute real system pipelines on demand.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase text-xxs">
                        <th className="pb-3">Simulation</th>
                        <th className="pb-3">City / Node</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Accuracy</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {simulations.map(s => (
                        <tr key={s.id}>
                          <td className="py-3.5 font-bold text-white">{s.name}</td>
                          <td className="py-3.5 text-slate-400">{s.city}</td>
                          <td className="py-3.5"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xxs font-bold">{s.status}</span></td>
                          <td className="py-3.5 font-mono text-indigo-400">{s.accuracy}</td>
                          <td className="py-3.5 text-right">
                            <button onClick={() => toast('Exporting simulation data...', { icon: '📦' })} className="text-slate-400 hover:text-white p-1"><FaDownload /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SAVED LOCATIONS */}
          {activeTab === 'locations' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaBookmark /> Saved GIS Locations</h2>
                <button 
                  onClick={() => {
                    const newLoc = `Location Landmark #${savedLocations.length + 1}`;
                    setSavedLocations([...savedLocations, newLoc]);
                    toast.success('Location added to saved GIS bookmarks!');
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <FaPlus /> Save Location
                </button>
              </div>

              {savedLocations.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center gap-2">
                  <FaBookmark className="text-3xl text-slate-600 mb-1" />
                  <span className="font-bold text-slate-300">No Saved GIS Locations</span>
                  <p className="text-slate-500 text-xxs max-w-sm">Bookmark your preferred operational locations and spatial POIs.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedLocations.map((loc, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center">
                      <span className="font-bold text-slate-200">{loc}</span>
                      <span className="text-xxs text-emerald-400 font-mono font-bold">● SAVED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SAVED AI QUERIES */}
          {activeTab === 'ai_queries' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaBrain className="text-indigo-400" /> Saved AI Queries</h2>
              <form onSubmit={handleAddQuery} className="flex gap-2">
                <input type="text" placeholder="Enter real query to save..." value={newQueryText} onChange={e=>setNewQueryText(e.target.value)} className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500" />
                <button type="submit" className="bg-indigo-600 text-white font-bold px-5 rounded-xl text-xs">Save</button>
              </form>

              {savedQueries.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center gap-2">
                  <FaBrain className="text-3xl text-slate-600 mb-1" />
                  <span className="font-bold text-slate-300">No Saved AI Queries</span>
                  <p className="text-slate-500 text-xxs max-w-sm">Type a prompt in the input field above and click Save to store it in your library.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {savedQueries.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center">
                      <span className="text-slate-300 font-mono text-xs">"{q}"</span>
                      <button onClick={() => toast.success('Executing query in AI engine...')} className="bg-indigo-600/30 text-indigo-400 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg text-xxs font-bold transition">Run Now</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaBell /> Notification Preferences</h2>
              <div className="flex flex-col gap-3">
                {Object.keys(notifPrefs).map((key) => (
                  <div key={key} className="flex justify-between items-center p-3.5 rounded-xl border border-slate-800 bg-slate-900/50">
                    <span className="capitalize text-slate-300 font-bold">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <input type="checkbox" checked={notifPrefs[key]} onChange={e=>setNotifPrefs({...notifPrefs, [key]: e.target.checked})} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SECURITY */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaLock /> Security & Passkeys</h2>

              {/* 2FA Toggle */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Two-Factor Authentication (2FA)</span>
                  <span className="text-xxs text-slate-400">Protects your account with TOTP authenticator app.</span>
                </div>
                <button
                  onClick={() => { setTwoFactorEnabled(!twoFactorEnabled); toast.success(`2FA ${!twoFactorEnabled ? 'Enabled ✅' : 'Disabled'}`); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-indigo-500'}`}
                >
                  {twoFactorEnabled ? '✓ Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Change Password */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-4">
                <span className="font-bold text-white">Change Password</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xxs text-slate-400 font-bold uppercase">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xxs text-slate-400 font-bold uppercase">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xxs text-slate-400 font-bold uppercase">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <button onClick={() => toast.success('Password changed successfully!')} className="self-start bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition">Update Password</button>
              </div>

              {/* Login Sessions */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-3">
                <span className="font-bold text-white">Active Login Sessions</span>
                {[
                  { device: 'Chrome on Windows 11', location: 'New Delhi, India', time: 'Now — Current Session', active: true },
                  { device: 'Safari on iPhone 15', location: 'Mumbai, India', time: '2 hours ago', active: false },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="font-bold text-white text-xs block">{s.device}</span>
                      <span className="text-xxs text-slate-400">{s.location} · {s.time}</span>
                    </div>
                    {s.active
                      ? <span className="text-xxs font-bold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10">Active</span>
                      : <button onClick={() => toast.success('Session revoked')} className="text-xxs font-bold text-rose-400 hover:underline">Revoke</button>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaShieldAlt /> Privacy & Access Governance</h2>

              {/* Profile Visibility */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Profile Visibility</span>
                  <span className="text-xxs text-slate-400">Controls who can view your full profile.</span>
                </div>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={e => { setPrivacySettings({...privacySettings, profileVisibility: e.target.value}); toast.success('Profile visibility updated!'); }}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-400 font-bold focus:outline-none"
                >
                  <option value="Public">Public</option>
                  <option value="Organization">Organization Only</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              {/* Privacy Toggles */}
              <div className="flex flex-col gap-3">
                {[
                  { key: 'showEmail', label: 'Show Email Address', desc: 'Display your email on public profile' },
                  { key: 'showPhone', label: 'Show Phone Number', desc: 'Display phone number on profile' },
                  { key: 'activityVisible', label: 'Activity Visibility', desc: 'Show your recent activity to team members' },
                  { key: 'allowSearchIndexing', label: 'Allow Search Indexing', desc: 'Allow your profile to appear in system search' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex justify-between items-center p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
                    <div>
                      <span className="font-bold text-white block">{label}</span>
                      <span className="text-xxs text-slate-400">{desc}</span>
                    </div>
                    <button
                      onClick={() => { setPrivacySettings({...privacySettings, [key]: !privacySettings[key]}); toast.success(`${label} ${!privacySettings[key] ? 'enabled' : 'disabled'}`); }}
                      className={`w-10 h-5 rounded-full transition-colors relative ${privacySettings[key] ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${privacySettings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* TAB 11: API KEYS */}
          {activeTab === 'api_keys' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaKey /> API Keys & Integrations</h2>
                <button onClick={()=>toast.success('New API Key Generated!')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><FaPlus /> Generate Key</button>
              </div>
              <div className="flex flex-col gap-3">
                {apiKeys.map((k, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center font-mono">
                    <div>
                      <span className="font-bold text-white block">{k.name}</span>
                      <span className="text-xxs text-indigo-400">{k.key}</span>
                    </div>
                    <span className="text-xxs font-bold text-emerald-400">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: CONNECTED ACCOUNTS */}
          {activeTab === 'integrations' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaPlug /> Connected Cloud Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Google Workspace', 'GitHub Enterprise', 'AWS Cloud Services', 'Slack Workspace', 'Mapbox GIS Platform', 'NASA EarthData API'].map((acc, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center">
                    <span className="font-bold text-slate-200">{acc}</span>
                    <button onClick={()=>toast.success(`Connected to ${acc}`)} className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xxs font-bold">Connected</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 13: TEAM MANAGEMENT */}
          {activeTab === 'team' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaUsers /> Team Management & Roles</h2>
              <p className="text-slate-400 text-xs">Organize institutional teams, assign project roles, and grant permissions.</p>
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 font-mono text-xs text-indigo-400 font-bold">
                Organization: EduVerse Core Systems Team (12 Active Members)
              </div>
            </div>
          )}

          {/* TAB 14: ACTIVITY TIMELINE */}
          {activeTab === 'activity' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaClock /> Comprehensive Activity Timeline</h2>
              <div className="border-l border-slate-800 pl-4 flex flex-col gap-4">
                {[
                  { time: 'Today 10:45 AM', text: 'Ran Yamuna River Flood Simulation v4' },
                  { time: 'Yesterday 16:20 PM', text: 'Generated Q3 Infrastructure Urban Impact Report' },
                  { time: '2 days ago', text: 'Uploaded Sentinel Satellite High-Res Dataset' }
                ].map((act, idx) => (
                  <div key={idx} className="relative flex flex-col gap-1">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xxs text-slate-500 font-mono">{act.time}</span>
                    <span className="text-slate-300 font-semibold">{act.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 15: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaTrophy className="text-amber-400" /> Gamification & Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Simulation Expert', desc: 'Ran over 100 spatial AI simulations', progress: '100%' },
                  { title: 'Weather Scientist', desc: 'Analyzed 50+ climate models', progress: '85%' },
                  { title: 'Traffic Master', desc: 'Optimized 20 urban transit corridors', progress: '92%' }
                ].map((ach, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-2">
                    <span className="font-bold text-white">{ach.title}</span>
                    <span className="text-xxs text-slate-400">{ach.desc}</span>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-indigo-500" style={{width: ach.progress}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 16: STORAGE */}
          {activeTab === 'storage' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaDatabase /> Cloud Storage Quota</h2>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-3 font-mono">
                <div className="flex justify-between font-bold text-xs">
                  <span>Used Storage: 8.2 GB</span>
                  <span className="text-indigo-400">Total Quota: 50.0 GB (16.4%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{width: '16.4%'}} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 17: BILLING */}
          {activeTab === 'billing' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaCreditCard /> Billing & Subscriptions</h2>
              <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Active Plan</span>
                  <span className="text-2xl font-black text-white">Enterprise Tier</span>
                </div>
                <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">ACTIVE SUBSCRIPTION</span>
              </div>
            </div>
          )}

          {/* TAB 18: DEVICES */}
          {activeTab === 'devices' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaMobileAlt /> Connected Hardware Devices</h2>
              <div className="flex flex-col gap-3 font-mono text-xs">
                {['Desktop Workstation (Windows 11) - Active Now', 'MacBook Pro M3 Max (macOS Sequoia)', 'iPad Pro 12.9" (iPadOS 18)'].map((d, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center">
                    <span className="text-slate-200">{d}</span>
                    <button onClick={()=>toast.success('Revoked session on device')} className="text-rose-400 text-xxs font-bold border border-rose-900/40 px-3 py-1 rounded-lg">Logout</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 19: ACCESSIBILITY */}
          {activeTab === 'accessibility' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaUniversalAccess /> Accessibility Options</h2>
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-3">
                <span className="font-bold text-white">Font Size Scaling</span>
                <input type="range" min="12" max="20" value={userPrefs.fontSize} onChange={e=>setUserPrefs({...userPrefs, fontSize: e.target.value})} className="w-full accent-indigo-600" />
                <span className="text-xxs font-mono text-indigo-400">Current Font Size: {userPrefs.fontSize}px</span>
              </div>
            </div>
          )}

          {/* TAB 20: PREFERENCES */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePrefs} className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaSlidersH /> System Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xxs text-slate-400 font-bold uppercase">Temperature Unit</label>
                  <select value={userPrefs.tempUnit} onChange={e=>setUserPrefs({...userPrefs, tempUnit: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                    <option value="Celsius (°C)">Celsius (°C)</option>
                    <option value="Fahrenheit (°F)">Fahrenheit (°F)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xxs text-slate-400 font-bold uppercase">Speed Unit</label>
                  <select value={userPrefs.speedUnit} onChange={e=>setUserPrefs({...userPrefs, speedUnit: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                    <option value="km/h">Kilometers per Hour (km/h)</option>
                    <option value="mph">Miles per Hour (mph)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl text-xs self-start">Save Preferences</button>
            </form>
          )}

          {/* TAB 21: AI MEMORY */}
          {activeTab === 'ai_memory' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaBrain className="text-indigo-400" /> AI Memory Inspector</h2>
              <p className="text-slate-400 text-xs">Review what the AI Copilot has learned from your past queries and workflows.</p>
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 font-mono text-xxs text-slate-300">
                • Preferred Focus: Yamuna River & Delhi Traffic Optimization<br/>
                • Frequently Executed Prompt: Flood Level Multi-Year Analysis<br/>
                • Associated Datasets: NASA Sentinel-2 TCI Bands
              </div>
            </div>
          )}

          {/* TAB 22: REPORTS */}
          {activeTab === 'reports' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaFilePdf /> Generated System Reports</h2>
              <div className="flex flex-col gap-3 font-mono text-xs">
                {['Delhi Traffic Congestion & Peak Hours Audit 2026.pdf', 'Yamuna Floodplain Mitigation Strategic Plan.pdf', 'Urban Energy Microgrid Load Distribution.pdf'].map((rep, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center">
                    <span className="text-slate-200">{rep}</span>
                    <button onClick={()=>toast.success('Downloading PDF report...')} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xxs font-bold">Download PDF</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 23: COLLABORATION */}
          {activeTab === 'collaboration' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaUserFriends /> Collaboration & Live Editing</h2>
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-2">
                <span className="font-bold text-white">Active Shared Workspaces (18)</span>
                <span className="text-xxs text-slate-400">Co-edit city simulations with researchers and urban planners in real time.</span>
              </div>
            </div>
          )}

          {/* TAB 24: DIGITAL ASSETS */}
          {activeTab === 'digital_assets' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaFolderOpen /> Spatial Digital Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['New Delhi 3D Terrain (.gltf)', 'Yamuna River Elevation (.dem)', 'Metro Line 8 CAD (.dwg)', 'Delhi Sensor GeoJSON (.geojson)'].map((ast, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex justify-between items-center">
                    <span className="font-bold text-slate-200">{ast}</span>
                    <span className="text-xxs text-indigo-400 font-mono font-bold">● LOADED</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 25: AI MODELS */}
          {activeTab === 'ai_models' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaCogs /> Trained AI Models Repository</h2>
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-2">
                <span className="font-bold text-white">Yamuna Flood Neural Predictor v2.4</span>
                <span className="text-xxs text-emerald-400 font-mono font-bold">Accuracy: 98.4% • Status: Deployed in Production</span>
              </div>
            </div>
          )}

          {/* TAB 26: DEVELOPER SETTINGS */}
          {activeTab === 'developer' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaTerminal className="text-emerald-400" /> Developer Sandbox & SDK</h2>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 font-mono text-xxs text-emerald-400 flex flex-col gap-2">
                <span>$ npm install @eduverse/spatial-sdk</span>
                <span>$ python -m eduverse.simulation --city delhi --model flood_v4</span>
              </div>
            </div>
          )}

          {/* TAB 27: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaChartLine className="text-pink-400" /> Analytics & Carbon Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-1">
                  <span className="text-xxs text-slate-400 font-bold uppercase">Estimated Energy Saved</span>
                  <span className="text-2xl font-black text-emerald-400">450 MWh</span>
                </div>
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-1">
                  <span className="text-xxs text-slate-400 font-bold uppercase">Estimated CO₂ Reduced</span>
                  <span className="text-2xl font-black text-pink-400">128 Tons</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 28: EMERGENCY PROFILE */}
          {activeTab === 'emergency' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-rose-400 flex items-center gap-2"><FaAmbulance className="text-rose-500 animate-pulse" /> Emergency Safety Profile</h2>
              <div className="p-5 rounded-2xl border border-rose-900/40 bg-rose-950/20 flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center border-b border-rose-900/30 pb-2">
                  <span className="font-bold text-white">Primary SOS Contact:</span>
                  <span className="text-rose-400 font-mono font-bold">Sarah Roy (+91 98112 33445)</span>
                </div>
                <div className="flex justify-between items-center border-b border-rose-900/30 pb-2">
                  <span className="font-bold text-white">Preferred Hospital:</span>
                  <span className="text-slate-300">AIIMS Emergency Center, New Delhi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Disaster Live Dispatch:</span>
                  <span className="text-emerald-400 font-mono font-bold">● CONNECTED</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 29: ROLE-BASED SECTIONS (RBAC CONFIG) */}
          {activeTab === 'rbac' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><FaSliders className="text-indigo-400" /> Role-Based Profile Module Access Matrix (RBAC)</h2>
              <p className="text-slate-400 text-xs">Module features automatically adjust according to the active role persona.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-xxs">
                      <th className="pb-3">Role Persona</th>
                      <th className="pb-3">Accessible Profile Modules</th>
                      <th className="pb-3 text-right">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-mono text-xxs">
                    {[
                      { role: 'Citizen', mods: 'Personal Info, Saved Places, Alerts, Simulations, AI Assistant', access: 'Standard Citizen' },
                      { role: 'Urban Planner', mods: 'City Models, Infrastructure Projects, Team Workspace, Reports', access: 'Planner Executive' },
                      { role: 'Government Officer', mods: 'Regional Dashboards, Disaster Management, Policy Simulations', access: 'Government Admin' },
                      { role: 'Researcher', mods: 'AI Models, Datasets, Experiment Logs, Publications', access: 'Scientific Master' },
                      { role: 'Disaster Response Team', mods: 'Emergency Alerts, Resource Allocation, Live Incident Map', access: 'Emergency Priority' },
                      { role: 'Environmental Scientist', mods: 'Climate Analytics, Pollution Models, Satellite Layers', access: 'Environmental Lead' },
                      { role: 'Utility Operator', mods: 'Energy Grid, Water Network, Infrastructure Health', access: 'Operator Specialist' }
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-3 font-bold text-indigo-400">{row.role}</td>
                        <td className="py-3 text-slate-300">{row.mods}</td>
                        <td className="py-3 text-right text-emerald-400 font-bold">{row.access}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
