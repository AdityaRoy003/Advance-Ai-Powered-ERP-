import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaBuilding, FaCreditCard, FaCalendarCheck, 
  FaFileSignature, FaRobot, FaLock, FaChartBar, FaComments, 
  FaBell, FaSignOutAlt, FaSun, FaMoon, FaBars, FaChevronLeft, 
  FaExchangeAlt, FaChevronRight, FaSearch, FaTimes, FaInbox,
  FaFileAlt, FaCheck, FaProjectDiagram, FaIdCard, FaHistory, FaTools,
  FaGraduationCap, FaDollarSign, FaBus, FaFilter,
  FaUserGraduate, FaBook, FaFileInvoiceDollar, FaBullhorn,
  FaShieldAlt, FaCog, FaExclamationTriangle, FaCheckCircle,
  FaInfoCircle, FaStream, FaWifi, FaBriefcase, FaPhone, FaKey,
  FaMicrophone, FaCubes, FaBookOpen, FaHeartbeat, FaFlask, FaTrophy, FaUserFriends, FaAward,
  FaUtensils, FaLeaf, FaWrench, FaBoxes, FaCogs, FaPuzzlePiece, FaCode, FaCrown, FaLaptopCode, FaUserShield, FaGlobe, FaUniversalAccess, FaClipboardCheck, FaUsers,
  FaCalendarAlt, FaUserTie, FaBalanceScale, FaTasks, FaBug, FaChevronDown, FaPlus,
  FaFileImport, FaVideo, FaCertificate, FaHandHoldingUsd
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCookieConsent } from '../context/CookieConsentContext';
import { useVoiceAssistant } from '../context/VoiceAssistantContext';
import { InstitutionsAPI } from '../services/api';
import toast from 'react-hot-toast';
import AIAssistantWidget from '../components/AIAssistantWidget';
import EduVerseOrbLoader from '../components/common/EduVerseOrbLoader';
import EduVerseLogo3D from '../components/common/EduVerseLogo3D';
import DashboardFooter from '../components/layout/DashboardFooter';

// ─── NOTIFICATION CATEGORIES ───
const NOTIF_CATEGORIES = ['All', 'Academic', 'Finance', 'Transport', 'Hostel', 'Security', 'System'];

const SAMPLE_NOTIFICATIONS = [
  { id: 'n1', category: 'Finance', icon: '🔴', title: 'Fee Payment Overdue', body: 'Semester 4 tuition fee of ₹42,000 is due by Sept 15, 2026.', time: '2h ago', read: false, color: 'rose' },
  { id: 'n2', category: 'Academic', icon: '🟡', title: 'Assignment Due Tomorrow', body: 'AVL Tree Lab Implementation must be submitted by 11:59 PM.', time: '5h ago', read: false, color: 'amber' },
  { id: 'n3', category: 'Academic', icon: '🟢', title: 'Leave Request Approved', body: 'Your leave application PL-4921 has been approved by the Class Coordinator.', time: 'Yesterday', read: true, color: 'emerald' },
  { id: 'n4', category: 'Academic', icon: '🔵', title: 'New Announcement Posted', body: 'Mid-Term Examination Schedule has been published by the Principal.', time: '2 days ago', read: true, color: 'blue' },
  { id: 'n5', category: 'System', icon: '🟣', title: 'AI Report Ready', body: 'Class Performance Analysis Report for August 2026 is now available.', time: '3 days ago', read: true, color: 'purple' },
  { id: 'n6', category: 'Transport', icon: '🔵', title: 'Bus Route Change', body: 'Bus #12 will use alternate Gate 3 route tomorrow due to campus event.', time: '1 day ago', read: false, color: 'sky' },
  { id: 'n7', category: 'Security', icon: '🔴', title: 'New Login Detected', body: 'Your account was accessed from a new device: Chrome on Windows 11.', time: '3h ago', read: false, color: 'rose' },
  { id: 'n8', category: 'Hostel', icon: '🟡', title: 'Hostel Maintenance Notice', body: 'Block B water supply interrupted 8-10 AM tomorrow for pipe repair.', time: '4h ago', read: true, color: 'amber' }
];

// ─── GLOBAL SEARCH ITEMS (role-aware database items) ───
const buildSearchItems = (userRole) => {
  const base = [
    { type: 'Student', title: 'Aditya Roy', desc: 'CSE • Semester 4 • CGPA: 8.43', link: '/dashboard/student', icon: '🎓' },
    { type: 'Student', title: 'Ananya Mehta', desc: 'ECE • Semester 2 • CGPA: 9.01', link: '/dashboard/student', icon: '🎓' },
    { type: 'Teacher', title: 'Dr. Priya Nair', desc: 'ECE • DBMS Faculty Lead', link: '/dashboard/teacher', icon: '👨‍🏫' },
    { type: 'Course', title: 'Data Structures & Algorithms (CS301)', desc: 'CSE • 4 Credits • Semester 4', link: '/dashboard/courses', icon: '📚' },
    { type: 'Course', title: 'DBMS (CS302)', desc: 'CSE • 3 Credits • Semester 4', link: '/dashboard/courses', icon: '📚' },
    { type: 'Document', title: 'IT Security Policy v3.2.pdf', desc: 'System Config • 2.4 MB • All Access', link: '/dashboard/library', icon: '📄' },
    { type: 'Announcement', title: 'Mid-Term Exam Schedule Published', desc: 'Posted by Principal Office • 2 days ago', link: '/dashboard/student', icon: '📢' },
    { type: 'Fee Record', title: 'Invoice #EDV-2026-9081', desc: 'Aditya Roy • Semester 4 • ₹42,000 Due', link: '/dashboard/finance', icon: '💳' },
    { type: 'Library Book', title: 'Introduction to Algorithms (CLRS)', desc: 'Available: 3 copies • CS Section', link: '/dashboard/library', icon: '📖' },
    { type: 'Support', title: 'Reported Issues & Resolution Desk', desc: 'Triage user bugs, system anomalies & notifications', link: '/dashboard/reported-issues', icon: '🐞' },
    { type: 'Admissions', title: 'Admissions & Enrollment CRM Pipeline', desc: 'Interactive Kanban, candidate portal & fee tracking', link: '/dashboard/admissions', icon: '🎯' },
    { type: 'Migration', title: 'Bulk CSV / Excel Data Migration Engine', desc: 'Smart column auto-mapping & dry-run validator', link: '/dashboard/migration', icon: '📥' },
    { type: 'Plagiarism', title: 'Plagiarism & AI Content Integrity Engine', desc: 'Turnitin & GPTZero alternative similarity scanner', link: '/dashboard/plagiarism', icon: '🛡️' },
    { type: 'AI Lecture', title: 'AI Lecture Summarizer & Video Chapterizer', desc: 'Whisper audio transcription, chapters & flashcards', link: '/dashboard/lecture-ai', icon: '🎥' },
    { type: 'Accreditation', title: 'One-Click NAAC / NBA / ABET SSR Compiler', desc: 'Self-study report generator & criteria CGPA predictor', link: '/dashboard/ssr-compiler', icon: '📜' },
    { type: 'Alumni', title: 'Alumni Network, Job Referrals & Endowment', desc: 'Global graduate directory, referral board & donations', link: '/dashboard/alumni', icon: '🤝' }
  ];
  if (userRole === 'STUDENT' || userRole === 'PARENT') {
    return base.filter(item => !['Fee Record', 'System Config'].includes(item.type));
  }
  return base;
};

export default function DashboardLayout() {
  const { user, logout, switchRole, setSessionUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAllAsRead, dismissNotification, addNotification } = useSocket();
  const { currentLang, changeLanguage, languages } = useLanguage();
  const { 
    highContrast, toggleHighContrast, 
    largeText, toggleLargeText, 
    reducedMotion, toggleReducedMotion, 
    focusIndicators, toggleFocusIndicators 
  } = useAccessibility();
  const { openModal: openCookieConsentModal, openPreferences } = useCookieConsent();

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState('All');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showA11yModal, setShowA11yModal] = useState(false);
  const { openVoiceAssistant, isListening: isVoiceListening } = useVoiceAssistant();
  const scrollContainerRef = useRef(null);

  // ─── Active Tenant / Campus Switcher State ───
  const [campuses, setCampuses] = useState([]);
  const [activeCampus, setActiveCampus] = useState(() => {
    try {
      const saved = localStorage.getItem('eduverse_active_institution');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { name: 'Apex University of Technology', code: 'AIT', plan: 'professional' };
  });
  const [showCampusSwitcher, setShowCampusSwitcher] = useState(false);
  const [campusSearch, setCampusSearch] = useState('');

  useEffect(() => {
    InstitutionsAPI.getPublicList().then(list => {
      if (Array.isArray(list) && list.length > 0) {
        setCampuses(list);
        setActiveCampus(curr => {
          const match = list.find(c => c._id === curr?._id || c.code === curr?.code);
          return match || list[0] || curr;
        });
      }
    });
  }, []);

  const handleSelectCampus = (campus) => {
    setActiveCampus(campus);
    localStorage.setItem('eduverse_active_institution', JSON.stringify(campus));
    if (setSessionUser && user) {
      setSessionUser({
        ...user,
        institutionId: campus._id,
        institution: campus
      });
    }
    setShowCampusSwitcher(false);
    toast.success(`Active workspace switched to ${campus.name}`, { icon: '🏛️' });
  };

  const filteredCampuses = campuses.length > 0
    ? campuses.filter(c => !campusSearch || c.name?.toLowerCase().includes(campusSearch.toLowerCase()) || c.code?.toLowerCase().includes(campusSearch.toLowerCase()))
    : [activeCampus];

  // Auto-close mobile drawer on route change & scroll to top of page
  useEffect(() => {
    setMobileDrawerOpen(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
    setShowCampusSwitcher(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.key]);

  // Global Ctrl+K Search
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCategory, setSearchCategory] = useState('All');

  const searchItems = buildSearchItems(user?.role);
  const searchCategories = ['All', 'Student', 'Teacher', 'Course', 'Document', 'Announcement', 'Fee Record', 'Library Book'];

  // Global Shortcuts & Custom event listeners (Ctrl+K, Alt+V, voice events)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(prev => !prev);
        setSearchQuery('');
        setSearchResults([]);
      }
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        openVoiceAssistant();
      }
      if (e.key === 'Escape') {
        setShowGlobalSearch(false);
      }
    };

    const handleOpenSearch = () => setShowGlobalSearch(true);
    const handleOpenA11y = () => setShowA11yModal(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-global-search', handleOpenSearch);
    window.addEventListener('open-a11y-modal', handleOpenA11y);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-global-search', handleOpenSearch);
      window.removeEventListener('open-a11y-modal', handleOpenA11y);
    };
  }, [openVoiceAssistant]);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    let filtered = searchItems.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    );
    if (searchCategory !== 'All') {
      filtered = filtered.filter(item => item.type === searchCategory);
    }
    setSearchResults(filtered);
  }, [searchQuery, searchCategory]);

  if (!user) return null;

  // Real-time notification counts & category filtering
  const allNotifs = Array.isArray(notifications) ? notifications : [];
  const filteredNotifs = notifFilter === 'All' ? allNotifs : allNotifs.filter(n => n.category === notifFilter);
  const unreadCount = allNotifs.filter(n => !n.read).length;

  const markAllRead = () => {
    markAllAsRead();
  };

  const dismissNotif = (id) => {
    dismissNotification(id);
  };

  // Sidebar dynamic navigation configuration strictly filtered by role
  const getSidebarMenu = () => {
    const role = user.role?.toUpperCase() || 'EMPLOYEE';
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { name: 'Super Admin HQ', path: '/dashboard/super_admin', icon: <FaChartBar /> },
          { name: 'Admissions CRM Pipeline', path: '/dashboard/admissions', icon: <FaUserGraduate /> },
          { name: 'Bulk Data Migration Engine', path: '/dashboard/migration', icon: <FaFileImport /> },
          { name: 'Plagiarism & AI Integrity', path: '/dashboard/plagiarism', icon: <FaShieldAlt /> },
          { name: 'AI Lecture Summarizer', path: '/dashboard/lecture-ai', icon: <FaVideo /> },
          { name: 'Accreditation SSR Compiler', path: '/dashboard/ssr-compiler', icon: <FaCertificate /> },
          { name: 'Alumni & Endowments', path: '/dashboard/alumni', icon: <FaHandHoldingUsd /> },
          { name: 'Executive Command HQ', path: '/dashboard/executive', icon: <FaCrown /> },
          { name: 'Institutions (Multi-Tenant)', path: '/dashboard/institutions', icon: <FaBuilding /> },
          { name: 'Subscription & Quotas', path: '/dashboard/billing', icon: <FaCreditCard /> },
          { name: 'Autonomous Workflows', path: '/dashboard/workflows', icon: <FaCogs /> },
          { name: 'Plugins & Integrations', path: '/dashboard/plugins', icon: <FaPuzzlePiece /> },
          { name: 'Developer Portal & APIs', path: '/dashboard/developer', icon: <FaCode /> },
          { name: 'IT Ops & MLOps Registry', path: '/dashboard/it-ops', icon: <FaLaptopCode /> },
          { name: 'AI Security Firewall', path: '/dashboard/ai-firewall', icon: <FaLock /> },
          { name: 'SIEM Cybersecurity', path: '/dashboard/siem', icon: <FaShieldAlt /> },
          { name: 'Audit Timeline & Logs', path: '/dashboard/admin-audits', icon: <FaHistory /> },
          { name: 'Blockchain Notary Vault', path: '/dashboard/vault', icon: <FaLock /> },
          { name: 'Privacy Governance', path: '/dashboard/privacy', icon: <FaUserShield /> },
          { name: 'Users Directory & Accounts', path: '/dashboard/users', icon: <FaUsers /> },
          { name: 'Policy Simulator & RBAC', path: '/dashboard/policy-simulator', icon: <FaFlask /> },
          { name: 'ERP Operations Hub (25)', path: '/dashboard/operations', icon: <FaClipboardCheck /> },
          { name: 'Reported Issues Desk', path: '/dashboard/reported-issues', icon: <FaBug /> },
          { name: 'Global Analytics', path: '/dashboard/analytics', icon: <FaChartBar /> },
          { name: 'Voice & AI Gateway', path: '/dashboard/ai', icon: <FaRobot /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'ADMIN':
        return [
          { name: 'Admin Dashboard', path: '/dashboard/admin', icon: <FaChartBar /> },
          { name: 'Admissions CRM Pipeline', path: '/dashboard/admissions', icon: <FaUserGraduate /> },
          { name: 'Bulk Data Migration Engine', path: '/dashboard/migration', icon: <FaFileImport /> },
          { name: 'Plagiarism & AI Integrity', path: '/dashboard/plagiarism', icon: <FaShieldAlt /> },
          { name: 'AI Lecture Summarizer', path: '/dashboard/lecture-ai', icon: <FaVideo /> },
          { name: 'Accreditation SSR Compiler', path: '/dashboard/ssr-compiler', icon: <FaCertificate /> },
          { name: 'Alumni & Endowments', path: '/dashboard/alumni', icon: <FaHandHoldingUsd /> },
          { name: 'Subscription & Quotas', path: '/dashboard/billing', icon: <FaCreditCard /> },
          { name: 'Users Directory & Accounts', path: '/dashboard/users', icon: <FaUsers /> },
          { name: 'Policy Simulator & RBAC', path: '/dashboard/policy-simulator', icon: <FaFlask /> },
          { name: 'ERP Operations Hub (25)', path: '/dashboard/operations', icon: <FaClipboardCheck /> },
          { name: 'Executive Command HQ', path: '/dashboard/executive', icon: <FaCrown /> },
          { name: '3D Digital Twin Map', path: '/dashboard/digital-twin', icon: <FaCubes /> },
          { name: 'Smart Campus IoT', path: '/dashboard/iot', icon: <FaWifi /> },
          { name: 'Green Sustainability', path: '/dashboard/sustainability', icon: <FaLeaf /> },
          { name: 'Smart Mess & Cafeteria', path: '/dashboard/mess', icon: <FaUtensils /> },
          { name: 'Facility & Maintenance', path: '/dashboard/maintenance', icon: <FaWrench /> },
          { name: 'Inventory & Procurement', path: '/dashboard/inventory', icon: <FaBoxes /> },
          { name: 'Autonomous Workflows', path: '/dashboard/workflows', icon: <FaCogs /> },
          { name: 'Accreditation & OBE', path: '/dashboard/accreditation', icon: <FaAward /> },
          { name: 'Campus Attendance', path: '/dashboard/attendance', icon: <FaCalendarCheck /> },
          { name: 'Exams & Schedules', path: '/dashboard/exams', icon: <FaFileAlt /> },
          { name: 'Finance Control', path: '/dashboard/finance', icon: <FaCreditCard /> },
          { name: 'Campus Health & Safety', path: '/dashboard/health', icon: <FaHeartbeat /> },
          { name: 'Hostel System', path: '/dashboard/hostel', icon: <FaBuilding /> },
          { name: 'Transport System', path: '/dashboard/transport', icon: <FaTools /> },
          { name: 'Library System', path: '/dashboard/library', icon: <FaBookOpen /> },
          { name: 'Leave Approvals', path: '/dashboard/approvals', icon: <FaFileSignature /> },
          { name: 'Reported Issues Desk', path: '/dashboard/reported-issues', icon: <FaBug /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'CYBER_SECURITY_OFFICER':
      case 'CYBER_SECURITY':
      case 'CYBERSECURITY':
        return [
          { name: 'Security Command HQ', path: '/dashboard/cyber_security_officer', icon: <FaShieldAlt /> },
          { name: 'SIEM SOC Operations', path: '/dashboard/siem', icon: <FaLock /> },
          { name: 'AI Security Firewall', path: '/dashboard/ai-firewall', icon: <FaShieldAlt /> },
          { name: 'Privacy Governance', path: '/dashboard/privacy', icon: <FaUserShield /> },
          { name: 'Audit Trail & Timeline', path: '/dashboard/admin-audits', icon: <FaHistory /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'FINANCE_OFFICER':
      case 'FINANCE':
        return [
          { name: 'Finance Officer HQ', path: '/dashboard/finance_officer', icon: <FaDollarSign /> },
          { name: 'Fee Structures & Invoices', path: '/dashboard/finance', icon: <FaFileInvoiceDollar /> },
          { name: 'Procurement Requests', path: '/dashboard/inventory', icon: <FaBoxes /> },
          { name: 'Financial Analytics', path: '/dashboard/analytics', icon: <FaChartBar /> },
          { name: 'Payment Approvals', path: '/dashboard/approvals', icon: <FaFileSignature /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'HR_MANAGER':
      case 'HR':
        return [
          { name: 'HR Operations HQ', path: '/dashboard/hr_manager', icon: <FaUserGraduate /> },
          { name: 'Employee Directory', path: '/dashboard/hr_manager', icon: <FaUser /> },
          { name: 'Staff Attendance', path: '/dashboard/attendance', icon: <FaCalendarCheck /> },
          { name: 'Leave Workflow', path: '/dashboard/approvals', icon: <FaFileSignature /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'PLACEMENT_OFFICER':
      case 'PLACEMENT':
        return [
          { name: 'Placement Operations HQ', path: '/dashboard/placement_officer', icon: <FaBriefcase /> },
          { name: 'Alumni Network & Job Referrals', path: '/dashboard/alumni', icon: <FaHandHoldingUsd /> },
          { name: 'Career Intelligence AI', path: '/dashboard/career-ai', icon: <FaBriefcase /> },
          { name: 'Hackathon & Innovation Hub', path: '/dashboard/hackathons', icon: <FaTrophy /> },
          { name: 'Student Portfolios', path: '/dashboard/portfolio', icon: <FaAward /> },
          { name: 'Campus Social Feed', path: '/dashboard/community', icon: <FaComments /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'TRANSPORT_MANAGER':
      case 'TRANSPORT':
        return [
          { name: 'Fleet Operations HQ', path: '/dashboard/transport_manager', icon: <FaBus /> },
          { name: 'Live GPS Bus Tracking', path: '/dashboard/transport', icon: <FaTools /> },
          { name: 'Vehicle Maintenance', path: '/dashboard/maintenance', icon: <FaWrench /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'LIBRARIAN':
        return [
          { name: 'Library Operations HQ', path: '/dashboard/librarian', icon: <FaBook /> },
          { name: 'Catalog & Digital Books', path: '/dashboard/library', icon: <FaBookOpen /> },
          { name: 'Book Inventory', path: '/dashboard/inventory', icon: <FaBoxes /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'RECEPTIONIST':
        return [
          { name: 'Reception Desk HQ', path: '/dashboard/receptionist', icon: <FaPhone /> },
          { name: 'Visitor Passes & Inquiries', path: '/dashboard/receptionist', icon: <FaIdCard /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'ACADEMIC_CONTROLLER':
      case 'ACADEMIC':
        return [
          { name: 'Academic Dashboard', path: '/dashboard/academic_controller', icon: <FaChartBar /> },
          { name: 'Accreditation SSR Compiler', path: '/dashboard/ssr-compiler', icon: <FaCertificate /> },
          { name: 'Academic Calendar', path: '/dashboard/academic-calendar', icon: <FaCalendarAlt /> },
          { name: 'Timetable Management', path: '/dashboard/timetable-mgmt', icon: <FaCalendarCheck /> },
          { name: 'Exam Management', path: '/dashboard/exam-mgmt', icon: <FaFileAlt /> },
          { name: 'Exam Duty Allocation', path: '/dashboard/exam-duty', icon: <FaUserTie /> },
          { name: 'Hall Ticket Center', path: '/dashboard/hall-tickets', icon: <FaIdCard /> },
          { name: 'Result Center', path: '/dashboard/result-center', icon: <FaAward /> },
          { name: 'Grade Moderation', path: '/dashboard/grade-moderation', icon: <FaBalanceScale /> },
          { name: 'Course & Subject Mapping', path: '/dashboard/course-mapping', icon: <FaBookOpen /> },
          { name: 'Faculty Workload', path: '/dashboard/faculty-workload', icon: <FaTasks /> },
          { name: 'Classroom Allocation', path: '/dashboard/classroom-allocation', icon: <FaBuilding /> },
          { name: 'Reports', path: '/dashboard/academic-reports', icon: <FaClipboardCheck /> },
          { name: 'AI Academic Assistant', path: '/dashboard/ai-academic-assistant', icon: <FaRobot /> },
          { name: 'Live Chat & Queries', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'TEACHER':
      case 'FACULTY':
        return [
          { name: 'Faculty Dashboard', path: '/dashboard/teacher', icon: <FaChartBar /> },
          { name: 'Plagiarism & AI Detector', path: '/dashboard/plagiarism', icon: <FaShieldAlt /> },
          { name: 'AI Lecture Summarizer', path: '/dashboard/lecture-ai', icon: <FaVideo /> },
          { name: 'Accreditation SSR Compiler', path: '/dashboard/ssr-compiler', icon: <FaCertificate /> },
          { name: 'LMS & Lesson Plans', path: '/dashboard/lms', icon: <FaBookOpen /> },
          { name: 'Classroom Attendance', path: '/dashboard/attendance', icon: <FaCalendarCheck /> },
          { name: 'Exams & Grading', path: '/dashboard/exams', icon: <FaFileAlt /> },
          { name: 'Student Success AI', path: '/dashboard/student-success', icon: <FaHeartbeat /> },
          { name: 'Mentorship Hub', path: '/dashboard/mentorship', icon: <FaUserFriends /> },
          { name: 'Campus Guilds & Clubs', path: '/dashboard/community', icon: <FaComments /> },
          { name: 'Smart Mess Menu', path: '/dashboard/mess', icon: <FaUtensils /> },
          { name: 'Facility Ticket', path: '/dashboard/maintenance', icon: <FaWrench /> },
          { name: 'Research & Grants', path: '/dashboard/research', icon: <FaFlask /> },
          { name: 'Accreditation & OBE', path: '/dashboard/accreditation', icon: <FaAward /> },
          { name: 'AI Teaching Suite', path: '/dashboard/ai', icon: <FaRobot /> },
          { name: 'Voice ERP Assistant', path: '/dashboard/voice-vision', icon: <FaMicrophone /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'STUDENT':
        return [
          { name: 'Student Dashboard', path: '/dashboard/student', icon: <FaChartBar /> },
          { name: 'AI Lecture Notes & Cards', path: '/dashboard/lecture-ai', icon: <FaVideo /> },
          { name: 'Alumni Network & Referrals', path: '/dashboard/alumni', icon: <FaHandHoldingUsd /> },
          { name: 'LMS & Video Classes', path: '/dashboard/lms', icon: <FaBookOpen /> },
          { name: 'Achievements & Badges', path: '/dashboard/gamification', icon: <FaTrophy /> },
          { name: 'Campus Social Feed', path: '/dashboard/community', icon: <FaComments /> },
          { name: 'Smart Mess & Tokens', path: '/dashboard/mess', icon: <FaUtensils /> },
          { name: 'My Attendance', path: '/dashboard/attendance', icon: <FaCalendarCheck /> },
          { name: 'Exams & Grades', path: '/dashboard/exams', icon: <FaFileAlt /> },
          { name: 'Career Intelligence AI', path: '/dashboard/career-ai', icon: <FaBriefcase /> },
          { name: 'Hackathons & Teams', path: '/dashboard/hackathons', icon: <FaTrophy /> },
          { name: 'Mentorship Booking', path: '/dashboard/mentorship', icon: <FaUserFriends /> },
          { name: 'Blockchain Vault', path: '/dashboard/vault', icon: <FaLock /> },
          { name: 'Public Portfolio', path: '/dashboard/portfolio', icon: <FaAward /> },
          { name: '3D Campus Map', path: '/dashboard/digital-twin', icon: <FaCubes /> },
          { name: 'Smart Campus IoT', path: '/dashboard/iot', icon: <FaWifi /> },
          { name: 'Sustainability Impact', path: '/dashboard/sustainability', icon: <FaLeaf /> },
          { name: 'Maintenance Request', path: '/dashboard/maintenance', icon: <FaWrench /> },
          { name: 'Privacy Center', path: '/dashboard/privacy', icon: <FaUserShield /> },
          { name: 'My Fees & Payments', path: '/dashboard/finance', icon: <FaCreditCard /> },
          { name: 'Library & Hostel', path: '/dashboard/library', icon: <FaBuilding /> },
          { name: 'Health Clinic', path: '/dashboard/health', icon: <FaHeartbeat /> },
          { name: 'AI Tutor & Voice', path: '/dashboard/ai', icon: <FaRobot /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'PARENT':
        return [
          { name: 'Parent Portal', path: '/dashboard/parent', icon: <FaChartBar /> },
          { name: 'Ward Attendance', path: '/dashboard/attendance', icon: <FaCalendarCheck /> },
          { name: 'Ward Academic Grades', path: '/dashboard/exams', icon: <FaFileAlt /> },
          { name: 'Fee Payments', path: '/dashboard/finance', icon: <FaCreditCard /> },
          { name: 'Mess & Nutrition Log', path: '/dashboard/mess', icon: <FaUtensils /> },
          { name: 'Bus Tracking', path: '/dashboard/transport', icon: <FaBus /> },
          { name: 'Privacy Preferences', path: '/dashboard/privacy', icon: <FaUserShield /> },
          { name: 'Teacher Chat & PTM', path: '/dashboard/chat', icon: <FaComments /> }
        ];

      case 'EMPLOYEE':
      default:
        return [
          { name: 'Employee Dashboard', path: '/dashboard/employee', icon: <FaChartBar /> },
          { name: 'My Profile', path: '/dashboard/profile', icon: <FaUser /> },
          { name: 'My Attendance', path: '/dashboard/attendance', icon: <FaCalendarCheck /> },
          { name: 'Smart Mess Access', path: '/dashboard/mess', icon: <FaUtensils /> },
          { name: 'Facility Ticket', path: '/dashboard/maintenance', icon: <FaWrench /> },
          { name: 'Leave Workflow', path: '/dashboard/approvals', icon: <FaFileSignature /> },
          { name: 'Live Chat', path: '/dashboard/chat', icon: <FaComments /> }
        ];
    }
  };

  const isSuperAdmin = Boolean(
    user?.originalRole?.toUpperCase() === 'SUPER_ADMIN' || 
    user?.role?.toUpperCase() === 'SUPER_ADMIN' || 
    user?.email?.toLowerCase() === 'superadmin@eduverse.com'
  );
  const isImpersonating = isSuperAdmin && user?.role?.toUpperCase() !== 'SUPER_ADMIN';

  const handleSignOut = () => { logout(); navigate('/login'); };
  const handleReturnToSuperAdmin = () => {
    switchRole('SUPER_ADMIN');
    navigate('/dashboard/super_admin');
  };
  const handleRoleChange = (e) => {
    const r = e.target.value;
    switchRole(r);
    const roleRoutes = {
      SUPER_ADMIN: '/dashboard/super_admin',
      ADMIN: '/dashboard/admin',
      CYBER_SECURITY_OFFICER: '/dashboard/cyber_security_officer',
      FINANCE_OFFICER: '/dashboard/finance_officer',
      HR_MANAGER: '/dashboard/hr_manager',
      PLACEMENT_OFFICER: '/dashboard/placement_officer',
      ACADEMIC_CONTROLLER: '/dashboard/academic_controller',
      TRANSPORT_MANAGER: '/dashboard/transport_manager',
      LIBRARIAN: '/dashboard/librarian',
      RECEPTIONIST: '/dashboard/receptionist',
      TEACHER: '/dashboard/teacher',
      STUDENT: '/dashboard/student',
      PARENT: '/dashboard/parent',
      EMPLOYEE: '/dashboard/employee'
    };
    navigate(roleRoutes[r] || `/dashboard/${r.toLowerCase()}`);
  };

  const menuItems = getSidebarMenu();
  const activePath = location.pathname;

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-all duration-300`}>

      {/* ─── DESKTOP SIDEBAR ─── */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/70 backdrop-blur-sm sticky top-0 h-screen overflow-y-auto z-40"
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3 overflow-hidden" title="EduVerse AI ERP">
            <EduVerseLogo3D size="md" showText={sidebarOpen} />
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {sidebarOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
          </button>
        </div>

        <div className="p-4 flex flex-col gap-1.5 flex-1">
          {sidebarOpen && (
            <span className="text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">
              Navigation Menu
            </span>
          )}
          {menuItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={(e) => {
                  if (item.path === '/dashboard/voice-vision') {
                    e.preventDefault();
                    openVoiceAssistant();
                  }
                }}
                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold transition ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="text-sm truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Ctrl+K hint & Privacy in sidebar */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
            <button 
              onClick={() => setShowGlobalSearch(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold hover:border-indigo-500/40 transition"
            >
              <FaSearch size={11} />
              <span className="flex-1 text-left">Global Search…</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-xxs font-mono text-slate-500">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => {
                const fn = openCookieConsentModal || openPreferences;
                if (typeof fn === 'function') fn();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-400 hover:text-slate-200 text-xxs font-bold transition cursor-pointer"
            >
              <span className="flex items-center gap-2"><FaShieldAlt className="text-indigo-400" /> Privacy & Cookies</span>
              <span className="text-[10px] text-indigo-400">Manage</span>
            </button>
          </div>
        )}
      </motion.aside>

      {/* ─── MOBILE DRAWER SIDEBAR ─── */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-80 max-w-[85vw] h-full bg-[#111827] border-r border-slate-800 flex flex-col z-10 shadow-2xl overflow-y-auto"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <Link to="/" className="flex items-center gap-3" onClick={() => setMobileDrawerOpen(false)}>
                  <EduVerseLogo3D size="md" showText={true} />
                </Link>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="p-3 flex flex-col gap-1 flex-1">
                <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                  Active Modules ({menuItems.length})
                </span>
                {menuItems.map((item) => {
                  const isActive = activePath === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={(e) => {
                        setMobileDrawerOpen(false);
                        if (item.path === '/dashboard/voice-vision') {
                          e.preventDefault();
                          openVoiceAssistant();
                        }
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'text-slate-300 hover:bg-slate-800/70'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* ─── MOBILE DRAWER QUICK TOOLS & CONTROLS ─── */}
              <div className="p-3 border-t border-slate-800 flex flex-col gap-2 bg-slate-900/60">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider px-1">
                  Quick Tools
                </span>
                <div className="grid grid-cols-2 gap-2 text-xxs font-bold">
                  {/* Language Selector */}
                  <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200">
                    <FaGlobe className="text-slate-400 shrink-0" />
                    <select
                      value={currentLang}
                      onChange={e => changeLanguage(e.target.value)}
                      className="bg-transparent border-none text-xxs font-bold text-slate-200 focus:outline-none w-full cursor-pointer truncate"
                    >
                      {languages.map(l => (
                        <option key={l.code} value={l.code} className="bg-[#111827] text-white">
                          {l.flag} {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Accessibility Toggle */}
                  <button
                    onClick={() => { setMobileDrawerOpen(false); setShowA11yModal(true); }}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:text-white"
                  >
                    <FaUniversalAccess className={highContrast || largeText ? 'text-teal-400' : 'text-slate-400'} />
                    <span className="truncate">Accessibility</span>
                  </button>

                  {/* Voice ERP Assistant */}
                  <button
                    onClick={() => { setMobileDrawerOpen(false); openVoiceAssistant(); }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border transition ${
                      isVoiceListening
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                        : 'bg-pink-500/10 border-pink-500/30 text-pink-300'
                    }`}
                  >
                    <FaMicrophone className="text-pink-400 shrink-0" />
                    <span className="truncate">Voice ERP</span>
                  </button>

                  {/* Theme Switcher */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:text-white"
                  >
                    {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-indigo-400" />}
                    <span className="truncate">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  {/* Privacy & Cookie Preferences */}
                  <button
                    type="button"
                    onClick={() => { 
                      setMobileDrawerOpen(false); 
                      const fn = openCookieConsentModal || openPreferences;
                      if (typeof fn === 'function') fn();
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:text-white col-span-2 justify-center cursor-pointer"
                  >
                    <FaShieldAlt className="text-indigo-400 shrink-0" />
                    <span className="truncate">Privacy & Cookie Preferences</span>
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800">
                <button
                  onClick={() => { setMobileDrawerOpen(false); handleSignOut(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTAINER ─── */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 flex flex-col min-w-0 min-h-[100dvh] h-[100dvh] overflow-y-auto"
      >
        
        {/* ─── TOP BAR ─── */}
        <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#090d16]/90 backdrop-blur-md px-2.5 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between shadow-sm gap-1.5 sm:gap-4">
          
          {/* Left: Hamburger + Search trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3 sm:flex-1 max-w-md min-w-0">
            <button 
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 active:scale-95 transition shrink-0"
              aria-label="Open Navigation Menu"
            >
              <FaBars size={15} />
            </button>

            {/* Global Search Trigger Bar (Desktop: full bar, Mobile: icon button) */}
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="hidden sm:flex items-center gap-3 w-full pl-4 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-500/40 transition font-semibold text-xs text-slate-400 text-left"
            >
              <FaSearch className="text-slate-400" size={13} />
              <span className="flex-1 truncate">Search anything… students, fees, courses</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-xxs font-mono text-slate-500">Ctrl+K</kbd>
            </button>

            <button
              onClick={() => setShowGlobalSearch(true)}
              className="sm:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white transition shrink-0"
              title="Search"
            >
              <FaSearch size={13} />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            
            {/* ─── ACTIVE TENANT / CAMPUS SWITCHER ─── */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowCampusSwitcher(prev => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:border-indigo-500/40 text-left transition text-xs font-semibold"
                title="Switch Campus Workspace / Organization"
              >
                <div className="w-5 h-5 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs shrink-0 font-black">
                  {activeCampus?.name?.[0] || '🏛️'}
                </div>
                <div className="hidden lg:flex flex-col min-w-0 max-w-[130px]">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate leading-tight text-xs">
                    {activeCampus?.name || 'Main Campus'}
                  </span>
                  <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-wider">
                    {activeCampus?.plan || 'PRO'} TIER
                  </span>
                </div>
                <FaChevronDown size={9} className="text-slate-400 shrink-0 ml-0.5" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showCampusSwitcher && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowCampusSwitcher(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-14 sm:top-full mt-1 sm:mt-2 w-auto sm:w-80 max-w-full sm:max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-2xl p-3 z-50 space-y-2.5 backdrop-blur-xl max-h-[85vh] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between px-2 pt-1">
                        <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider font-mono">
                          Switch Campus Workspace
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold">
                          MULTI-TENANT
                        </span>
                      </div>

                      {/* Quick Search */}
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaSearch size={10} /></span>
                        <input
                          type="text"
                          value={campusSearch}
                          onChange={(e) => setCampusSearch(e.target.value)}
                          placeholder="Search campuses..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Campuses List */}
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                        {filteredCampuses.map(c => {
                          const isActive = (c._id && c._id === activeCampus?._id) || c.code === activeCampus?.code;
                          return (
                            <button
                              key={c._id || c.code}
                              onClick={() => handleSelectCampus(c)}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition text-xs ${
                                isActive 
                                  ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-400' 
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xxs shrink-0">
                                  {c.name?.[0] || '🏛️'}
                                </span>
                                <div className="min-w-0">
                                  <p className="font-bold text-xs truncate leading-tight text-slate-900 dark:text-slate-100">{c.name}</p>
                                  <p className="text-[10px] text-slate-500 font-mono">{c.code} • {c.city || 'India'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  {c.plan || 'PRO'}
                                </span>
                                {isActive && <FaCheckCircle className="text-indigo-400" size={12} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Bottom Actions: Onboard New & Subscription */}
                      <div className="border-t border-slate-200 dark:border-slate-800 pt-2 space-y-1">
                        <Link
                          to="/onboard"
                          onClick={() => setShowCampusSwitcher(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-indigo-400 hover:bg-indigo-500/10 transition"
                        >
                          <FaPlus size={10} />
                          <span>+ Onboard New Campus Workspace</span>
                        </Link>
                        <Link
                          to="/dashboard/billing"
                          onClick={() => setShowCampusSwitcher(false)}
                          className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <span className="flex items-center gap-2">
                            <FaCreditCard className="text-amber-400" size={11} />
                            <span>Subscription & Quotas Hub</span>
                          </span>
                          <FaChevronRight size={10} className="text-slate-500" />
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {/* Role Switcher (Super Admin) / Role Badge */}
            {isSuperAdmin ? (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {isImpersonating && (
                  <button
                    onClick={handleReturnToSuperAdmin}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1 text-[10px] sm:text-xs font-bold transition shadow-sm animate-pulse"
                    title="Exit preview mode and return to Super Admin HQ"
                  >
                    <span>↩</span>
                    <span className="hidden lg:inline">Return to Super Admin</span>
                    <span className="lg:hidden">Exit</span>
                  </button>
                )}
                <div className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-1.5 text-xxs font-sans transition ${isImpersonating ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400'}`}>
                  <FaExchangeAlt className={`${isImpersonating ? 'text-amber-400' : 'text-indigo-400'} shrink-0`} size={10} />
                  <select 
                    value={user.role} 
                    onChange={handleRoleChange}
                    className={`bg-transparent border-none font-bold focus:outline-none cursor-pointer text-xxs sm:text-xs max-w-[72px] xs:max-w-[88px] sm:max-w-none truncate ${isImpersonating ? 'text-amber-300' : 'text-indigo-400'}`}
                  >
                    <option value="SUPER_ADMIN" className="bg-[#111827] text-white">👑 Super Admin</option>
                    <option value="ADMIN" className="bg-[#111827] text-white">🏛️ Admin</option>
                    <option value="ACADEMIC_CONTROLLER" className="bg-[#111827] text-white">📊 Academic Controller</option>
                    <option value="CYBER_SECURITY_OFFICER" className="bg-[#111827] text-white">🛡️ Cyber Sec</option>
                    <option value="FINANCE_OFFICER" className="bg-[#111827] text-white">💰 Finance</option>
                    <option value="HR_MANAGER" className="bg-[#111827] text-white">👥 HR</option>
                    <option value="PLACEMENT_OFFICER" className="bg-[#111827] text-white">💼 Placement</option>
                    <option value="TRANSPORT_MANAGER" className="bg-[#111827] text-white">🚌 Transport</option>
                    <option value="LIBRARIAN" className="bg-[#111827] text-white">📚 Library</option>
                    <option value="RECEPTIONIST" className="bg-[#111827] text-white">🛎️ Reception</option>
                    <option value="TEACHER" className="bg-[#111827] text-white">👨‍🏫 Faculty</option>
                    <option value="STUDENT" className="bg-[#111827] text-white">🎓 Student</option>
                    <option value="PARENT" className="bg-[#111827] text-white">👨‍👧 Parent</option>
                    <option value="EMPLOYEE" className="bg-[#111827] text-white">👔 Employee</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex bg-slate-800/60 border border-slate-700/50 px-2.5 py-1.5 rounded-xl items-center gap-1.5 text-xxs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-bold uppercase tracking-wider">{user.role?.replace(/_/g, ' ')}</span>
              </div>
            )}

            {/* Multi-Language Selector (Desktop - mobile in drawer) */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
              <FaGlobe className="text-slate-400 text-xs" />
              <select
                value={currentLang}
                onChange={e => changeLanguage(e.target.value)}
                className="bg-transparent border-none font-bold text-xxs text-slate-300 focus:outline-none cursor-pointer"
                title="Select ERP Interface Language"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} className="bg-[#111827] text-white">
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accessibility Mode Toggle (Desktop - mobile in drawer) */}
            <button
              onClick={() => setShowA11yModal(true)}
              className="hidden sm:flex p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
              title="Accessibility Settings (High Contrast, Large Text)"
            >
              <FaUniversalAccess size={13} className={highContrast || largeText ? 'text-teal-400' : ''} />
            </button>

            {/* Voice ERP Trigger (Desktop - opens Voice Natural Assistant) */}
            <button 
              onClick={openVoiceAssistant}
              className={`hidden sm:flex p-2 sm:p-2.5 rounded-xl border transition ${
                isVoiceListening
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse ring-4 ring-rose-500/30'
                  : 'border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400'
              }`}
              title="Voice ERP Natural Assistant (Click to Speak or Alt+V)"
            >
              <FaMicrophone size={13} />
            </button>

            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <FaSun size={12} className="text-yellow-400" /> : <FaMoon size={12} />}
            </button>

            {/* ─── NOTIFICATION CENTER ─── */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 relative transition"
                title="Notifications"
              >
                <FaBell size={12} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white rounded-full text-[9px] sm:text-xxs font-extrabold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-14 sm:top-full mt-1 sm:mt-3 w-auto sm:w-96 max-w-full sm:max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-800 bg-[#111827] shadow-2xl p-0 z-50 flex flex-col overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xxs font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllRead} 
                            className="text-xxs text-indigo-400 hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                        <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white p-1">
                          <FaTimes size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-800 overflow-x-auto scrollbar-none">
                      {NOTIF_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setNotifFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-xxs font-semibold whitespace-nowrap transition ${
                            notifFilter === cat 
                              ? 'bg-indigo-600 text-white' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* List */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 p-1">
                      {filteredNotifs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-2">
                          <FaInbox className="text-2xl opacity-40" />
                          <span className="text-xs">No notifications</span>
                        </div>
                      ) : (
                        filteredNotifs.map((n) => (
                          <div 
                            key={n.id} 
                            className={`p-3 rounded-xl flex items-start gap-3 transition group ${
                              n.read ? 'opacity-60 hover:opacity-90' : 'bg-slate-800/40 hover:bg-slate-800/70'
                            }`}
                          >
                            <span className="text-base flex-shrink-0 mt-0.5">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`font-bold text-xs truncate ${n.read ? 'text-slate-300' : 'text-white'}`}>
                                  {n.title}
                                </span>
                                <span className="text-xxs text-slate-500 font-mono flex-shrink-0">{n.time}</span>
                              </div>
                              <p className="text-xxs text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
                              <span className={`text-xxs font-bold mt-1 block`}>{n.category}</span>
                            </div>
                            <button onClick={() => dismissNotif(n.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-300 transition flex-shrink-0">
                              <FaTimes size={11} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="flex items-center gap-1.5 hover:opacity-85 transition"
              >
                <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {(user.firstName?.[0] || 'U')}{(user.lastName?.[0] || 'S')}
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-14 sm:top-full mt-1 sm:mt-3 w-auto sm:w-72 max-w-full sm:max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xl p-4 z-50 flex flex-col gap-4 text-xs font-semibold"
                  >
                    <div className="pb-3 border-b border-slate-800">
                      <span className="font-extrabold block text-sm">{user.firstName} {user.lastName}</span>
                      <span className="text-slate-400 font-normal block truncate mt-0.5">{user.email}</span>
                      <span className="text-xxs text-slate-350 block mt-1 font-semibold">{user.designation}</span>
                      <span className="inline-block mt-2.5 px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold uppercase tracking-wider text-xxs">
                        🛡️ {user.roleName || user.role}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 font-mono text-xxs border-b border-slate-800 pb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Department:</span>
                        <span className="text-slate-200 font-bold">{user.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Access Level:</span>
                        <span className="text-emerald-400 font-bold">{user.accessLevel}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-3 max-h-36 overflow-y-auto">
                      <span className="text-xxs text-slate-500 uppercase tracking-widest font-bold block mb-1">Assigned Permissions</span>
                      {(user.permissions || []).map((perm, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xxs font-normal">
                          <FaCheck className="text-emerald-400 flex-shrink-0" />
                          <span className="text-slate-300">{perm}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
                      <button 
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          const fn = openCookieConsentModal || openPreferences;
                          if (typeof fn === 'function') fn();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition border border-slate-700/60 cursor-pointer"
                      >
                        <FaShieldAlt className="text-indigo-400" /> Cookie & Privacy Preferences
                      </button>
                      <button 
                        onClick={() => { setShowProfileMenu(false); navigate('/dashboard/profile'); }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition border border-indigo-500/20"
                      >
                        <FaUser /> View Full Profile
                      </button>
                      <button 
                        onClick={() => { setShowProfileMenu(false); navigate('/dashboard/account-deletion'); }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition border border-rose-500/20 cursor-pointer"
                      >
                        <FaExclamationTriangle className="text-rose-400" /> Account Security & Deletion
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/20"
                      >
                        <FaSignOutAlt /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ─── CONTENT ─── */}
        <main className="flex-1 shrink-0 flex flex-col p-3 sm:p-6 pb-8 md:pb-6 max-w-7xl mx-auto w-full relative">
          <Suspense fallback={
            <div className="flex-1 min-h-[calc(100dvh-120px)] md:min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center w-full my-auto">
              <EduVerseOrbLoader 
                size="md" 
                message="Loading ERP Module..." 
                submessage="Retrieving operational telemetry & datasets" 
              />
            </div>
          }>
            <Outlet />
          </Suspense>
          <AIAssistantWidget />
        </main>

        {/* ─── AUTHENTICATED ERP FOOTER ─── */}
        <DashboardFooter />

        {/* ─── MOBILE BOTTOM NAVIGATION BAR ─── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111827]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-2xl">
          <Link
            to={menuItems[0]?.path || '/dashboard'}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              activePath === menuItems[0]?.path ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-base">{menuItems[0]?.icon || <FaChartBar />}</span>
            <span className="text-[10px]">Dashboard</span>
          </Link>

          <Link
            to="/dashboard/chat"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              activePath === '/dashboard/chat' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-base"><FaComments /></span>
            <span className="text-[10px]">Chat</span>
          </Link>

          <button
            onClick={() => setShowGlobalSearch(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-white transition"
          >
            <span className="text-base"><FaSearch /></span>
            <span className="text-[10px]">Search</span>
          </button>

          <button
            onClick={openVoiceAssistant}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              isVoiceListening ? 'text-rose-400 font-bold animate-pulse' : 'text-pink-400 hover:text-pink-300'
            }`}
          >
            <span className="text-base"><FaMicrophone /></span>
            <span className="text-[10px]">Voice AI</span>
          </button>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-white transition"
          >
            <span className="text-base"><FaBars /></span>
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </div>

      {/* ─── GLOBAL SEARCH MODAL (Ctrl+K) ─── */}
      <AnimatePresence>
        {showGlobalSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 pb-6 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setShowGlobalSearch(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-[#111827] border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Search Input */}
              <div className="flex items-center gap-2.5 p-3.5 sm:p-5 border-b border-slate-800">
                <FaSearch className="text-slate-400 flex-shrink-0" size={14} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search students, teachers, courses, fees, books, documents…"
                  className="flex-1 bg-transparent text-white text-sm font-semibold focus:outline-none placeholder-slate-500"
                />
                <kbd className="px-2 py-1 rounded-lg bg-slate-800 text-xxs font-mono text-slate-500">ESC</kbd>
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 overflow-x-auto scrollbar-none">
                {searchCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSearchCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xxs font-bold whitespace-nowrap transition ${searchCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-3">
                {!searchQuery && (
                  <div className="flex flex-col gap-2 py-4">
                    <span className="text-xxs uppercase font-bold text-slate-500 px-2 mb-2">Quick Navigate</span>
                    {[
                      { icon: '🎓', label: 'Students', path: '/dashboard/student' },
                      { icon: '👨‍🏫', label: 'Teachers', path: '/dashboard/teacher' },
                      { icon: '📚', label: 'Courses', path: '/dashboard/courses' },
                      { icon: '💳', label: 'Fees', path: '/dashboard/finance' },
                      { icon: '📖', label: 'Library', path: '/dashboard/library' }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => { navigate(item.path); setShowGlobalSearch(false); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-left transition"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <div className="flex flex-col items-center py-10 text-slate-500 gap-2">
                    <FaInbox className="text-3xl" />
                    <span className="text-sm font-semibold">No results for "{searchQuery}"</span>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="flex flex-col gap-1.5 py-2">
                    <span className="text-xxs uppercase font-bold text-slate-500 px-2 mb-1">{searchResults.length} result{searchResults.length > 1 ? 's' : ''}</span>
                    {searchResults.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => { navigate(item.link); setShowGlobalSearch(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/20 border border-transparent text-left transition"
                      >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-white text-xs block">{item.title}</span>
                          <span className="text-xxs text-slate-400 truncate block">{item.desc}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-xxs font-mono text-slate-400 font-bold flex-shrink-0">{item.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility Preferences Modal */}
      <AnimatePresence>
        {showA11yModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowA11yModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 text-base">
                    <FaUniversalAccess />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Accessibility Controls</h3>
                    <p className="text-xxs text-slate-400">Tailor EduVerse ERP to your sensory preferences</p>
                  </div>
                </div>
                <button onClick={() => setShowA11yModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-white">
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">High Contrast Mode</h4>
                    <p className="text-xxs text-slate-400">Boost contrast ratios for text clarity</p>
                  </div>
                  <button onClick={toggleHighContrast} className="text-xl">
                    {highContrast ? <span className="text-teal-400 font-bold text-xs px-2.5 py-1 rounded bg-teal-500/20">ON</span> : <span className="text-slate-500 text-xs px-2.5 py-1 rounded bg-slate-800">OFF</span>}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Large Text Scale</h4>
                    <p className="text-xxs text-slate-400">Scale base font sizes +20% for readability</p>
                  </div>
                  <button onClick={toggleLargeText} className="text-xl">
                    {largeText ? <span className="text-teal-400 font-bold text-xs px-2.5 py-1 rounded bg-teal-500/20">ON</span> : <span className="text-slate-500 text-xs px-2.5 py-1 rounded bg-slate-800">OFF</span>}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Reduced Motion</h4>
                    <p className="text-xxs text-slate-400">Disable animations and decorative transitions</p>
                  </div>
                  <button onClick={toggleReducedMotion} className="text-xl">
                    {reducedMotion ? <span className="text-teal-400 font-bold text-xs px-2.5 py-1 rounded bg-teal-500/20">ON</span> : <span className="text-slate-500 text-xs px-2.5 py-1 rounded bg-slate-800">OFF</span>}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Enhanced Focus Outlines</h4>
                    <p className="text-xxs text-slate-400">Prominent keyboard navigation indicators</p>
                  </div>
                  <button onClick={toggleFocusIndicators} className="text-xl">
                    {focusIndicators ? <span className="text-teal-400 font-bold text-xs px-2.5 py-1 rounded bg-teal-500/20">ON</span> : <span className="text-slate-500 text-xs px-2.5 py-1 rounded bg-slate-800">OFF</span>}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowA11yModal(false)}
                  className="px-4 py-2 rounded-xl bg-teal-500 text-black font-bold text-xs"
                >
                  Apply & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
