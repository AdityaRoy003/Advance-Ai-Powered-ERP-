import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { SupportModalProvider } from './context/SupportModalContext';
import { VoiceAssistantProvider } from './context/VoiceAssistantContext';

// Privacy & Consent Components
import CookieConsentBanner from './components/privacy/CookieConsentBanner';
import CookieConsentModal from './components/privacy/CookieConsentModal';
import PrivacyPolicyModal from './components/privacy/PrivacyPolicyModal';
import VoiceERPAssistantModal from './components/voice/VoiceERPAssistantModal';
import EduVerseOrbLoader from './components/common/EduVerseOrbLoader';

// Layout
import DashboardLayout from './pages/DashboardLayout';

// Lazy Loaded Pages & Dashboards (Code-Splitting for Performance)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

const StudentDashboard = lazy(() => import('./pages/dashboards/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./pages/dashboards/TeacherDashboard'));
const ParentDashboard = lazy(() => import('./pages/dashboards/ParentDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/dashboards/SuperAdminDashboard'));
const HRManagerDashboard = lazy(() => import('./pages/dashboards/HRManagerDashboard'));
const EmployeeDashboard = lazy(() => import('./pages/dashboards/EmployeeDashboard'));
const CyberSecurityOfficerDashboard = lazy(() => import('./pages/dashboards/CyberSecurityOfficerDashboard'));
const FinanceOfficerDashboard = lazy(() => import('./pages/dashboards/FinanceOfficerDashboard'));
const LibrarianDashboard = lazy(() => import('./pages/dashboards/LibrarianDashboard'));
const TransportManagerDashboard = lazy(() => import('./pages/dashboards/TransportManagerDashboard'));
const PlacementOfficerDashboard = lazy(() => import('./pages/dashboards/PlacementOfficerDashboard'));
const ReceptionistDashboard = lazy(() => import('./pages/dashboards/ReceptionistDashboard'));
const AcademicControllerDashboard = lazy(() => import('./pages/dashboards/AcademicControllerDashboard'));
const HallTicketVerification = lazy(() => import('./pages/HallTicketVerification'));

const PermissionsManager = lazy(() => import('./pages/modules/PermissionsManager'));
const AuditLogs = lazy(() => import('./pages/modules/AuditLogs'));
const ApprovalsWorkflow = lazy(() => import('./pages/modules/ApprovalsWorkflow'));
const UserProfile = lazy(() => import('./pages/modules/UserProfile'));
const AccountDeletion = lazy(() => import('./pages/modules/AccountDeletion'));
const Library = lazy(() => import('./pages/modules/Library'));
const Hostel = lazy(() => import('./pages/modules/Hostel'));
const Transport = lazy(() => import('./pages/modules/Transport'));
const Finance = lazy(() => import('./pages/modules/Finance'));
const Attendance = lazy(() => import('./pages/modules/Attendance'));
const Exams = lazy(() => import('./pages/modules/Exams'));
const AIAssistant = lazy(() => import('./pages/modules/AIAssistant'));
const SIEMDashboard = lazy(() => import('./pages/modules/SIEMDashboard'));
const Analytics = lazy(() => import('./pages/modules/Analytics'));
const LiveChat = lazy(() => import('./pages/modules/LiveChat'));
const InstitutionManagement = lazy(() => import('./pages/modules/InstitutionManagement'));

// 20 Advanced Enterprise Modules
const DigitalCampusTwin = lazy(() => import('./pages/modules/DigitalCampusTwin'));
const AIFirewallCenter = lazy(() => import('./pages/modules/AIFirewallCenter'));
const LMSPlatform = lazy(() => import('./pages/modules/LMSPlatform'));
const StudentSuccessEarlyWarning = lazy(() => import('./pages/modules/StudentSuccessEarlyWarning'));
const CareerIntelligence = lazy(() => import('./pages/modules/CareerIntelligence'));
const ResearchInnovationPortal = lazy(() => import('./pages/modules/ResearchInnovationPortal'));
const HackathonInnovationHub = lazy(() => import('./pages/modules/HackathonInnovationHub'));
const MentorshipMarketplace = lazy(() => import('./pages/modules/MentorshipMarketplace'));
const AccreditationOBECenter = lazy(() => import('./pages/modules/AccreditationOBECenter'));
const BlockchainDocumentVault = lazy(() => import('./pages/modules/BlockchainDocumentVault'));
const VoiceAndVisionHub = lazy(() => import('./pages/modules/VoiceAndVisionHub'));
const CampusHealthWellness = lazy(() => import('./pages/modules/CampusHealthWellness'));
const StudentPublicPortfolio = lazy(() => import('./pages/modules/StudentPublicPortfolio'));

// Features 21 through 39 Modules
const SmartMessCafeteria = lazy(() => import('./pages/modules/SmartMessCafeteria'));
const SmartCampusIoT = lazy(() => import('./pages/modules/SmartCampusIoT'));
const SustainabilityDashboard = lazy(() => import('./pages/modules/SustainabilityDashboard'));
const FacilityMaintenance = lazy(() => import('./pages/modules/FacilityMaintenance'));
const InventoryProcurement = lazy(() => import('./pages/modules/InventoryProcurement'));
const WorkflowAutomationBuilder = lazy(() => import('./pages/modules/WorkflowAutomationBuilder'));
const PluginIntegrationsHub = lazy(() => import('./pages/modules/PluginIntegrationsHub'));
const DeveloperPortal = lazy(() => import('./pages/modules/DeveloperPortal'));
const ExecutiveCommandCenter = lazy(() => import('./pages/modules/ExecutiveCommandCenter'));
const ITAssistantMLOps = lazy(() => import('./pages/modules/ITAssistantMLOps'));
const PrivacyComplianceCenter = lazy(() => import('./pages/modules/PrivacyComplianceCenter'));
const CampusSocialCommunity = lazy(() => import('./pages/modules/CampusSocialCommunity'));
const StudentGamificationLeaderboard = lazy(() => import('./pages/modules/StudentGamificationLeaderboard'));
const PolicySimulator = lazy(() => import('./pages/modules/PolicySimulator'));
const ERPCompletenessHub = lazy(() => import('./pages/modules/ERPCompletenessHub'));
const UserManagement = lazy(() => import('./pages/modules/UserManagement'));
const ReportedIssuesHub = lazy(() => import('./pages/modules/ReportedIssuesHub'));
const InstitutionOnboarding = lazy(() => import('./pages/InstitutionOnboarding'));
const InstitutionalBilling = lazy(() => import('./pages/modules/InstitutionalBilling'));

// 6 Core Commercial & Enterprise Accreditation Modules
const AdmissionsCRM = lazy(() => import('./pages/modules/AdmissionsCRM'));
const DataMigrationEngine = lazy(() => import('./pages/modules/DataMigrationEngine'));
const PlagiarismAIDetector = lazy(() => import('./pages/modules/PlagiarismAIDetector'));
const LectureSummarizerStudio = lazy(() => import('./pages/modules/LectureSummarizerStudio'));
const AccreditationSSRCompiler = lazy(() => import('./pages/modules/AccreditationSSRCompiler'));
const AlumniNetworkHub = lazy(() => import('./pages/modules/AlumniNetworkHub'));

// Loading Fallback Component with 3D EduVerse AI Orb
const PageLoader = () => (
  <EduVerseOrbLoader 
    fullScreen 
    size="lg" 
    message="Initializing EduVerse AI Platform" 
    submessage="Restoring security context & tenant configurations" 
  />
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const savedUser = localStorage.getItem('eduverse_user');
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role-Based Route Guard Component
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  const currentRole = user.role?.toUpperCase();
  const isAllowed = allowedRoles.some(role => role.toUpperCase() === currentRole);

  if (!isAllowed) {
    const defaultPath = `/dashboard/${currentRole.toLowerCase()}`;
    return <Navigate to={defaultPath} replace />;
  }

  return children;
};

// Dynamic Dashboard Redirect based on Logged-in User Role
const DynamicDashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const rolePath = user.role?.toLowerCase() || 'employee';
  return <Navigate to={`/dashboard/${rolePath}`} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CookieConsentProvider>
          <SocketProvider>
            <LanguageProvider>
              <AccessibilityProvider>
                <SupportModalProvider>
                  <BrowserRouter>
                    <VoiceAssistantProvider>
                      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                      <CookieConsentBanner />
                      <CookieConsentModal />
                      <PrivacyPolicyModal />
                      <VoiceERPAssistantModal />
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                {/* Marketing / Landing */}
                <Route path="/" element={<LandingPage />} />

                {/* Public Recruiter Portfolio */}
                <Route path="/student/:id" element={<StudentPublicPortfolio />} />

                {/* Public QR Hall Ticket Verification */}
                <Route path="/verify/hall-ticket/:id" element={<HallTicketVerification />} />

                {/* Auth & SaaS Onboarding */}
                <Route path="/onboard" element={<InstitutionOnboarding />} />
                <Route path="/onboard-workspace" element={<InstitutionOnboarding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Dashboard Sub-routes */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Dynamic Role Index Redirect */}
                  <Route index element={<DynamicDashboardRedirect />} />

                  {/* Role-Specific Dashboards */}
                  <Route path="super_admin" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                      <SuperAdminDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="admin" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                      <AdminDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="hr_manager" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
                      <HRManagerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="hr" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
                      <HRManagerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="teacher" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'TEACHER']}>
                      <TeacherDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="student" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'STUDENT']}>
                      <StudentDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="parent" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'PARENT']}>
                      <ParentDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="employee" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'EMPLOYEE', 'HR_MANAGER']}>
                      <EmployeeDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="cyber_security_officer" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'CYBER_SECURITY_OFFICER']}>
                      <CyberSecurityOfficerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="cybersecurity" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'CYBER_SECURITY_OFFICER']}>
                      <CyberSecurityOfficerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="finance_officer" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'FINANCE_OFFICER']}>
                      <FinanceOfficerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="librarian" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'LIBRARIAN']}>
                      <LibrarianDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="transport_manager" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'TRANSPORT_MANAGER']}>
                      <TransportManagerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="placement_officer" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'PLACEMENT_OFFICER']}>
                      <PlacementOfficerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="placement" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'PLACEMENT_OFFICER']}>
                      <PlacementOfficerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="receptionist" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'RECEPTIONIST']}>
                      <ReceptionistDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="academic_controller" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="academic-calendar" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="calendar" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="timetable-mgmt" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="timetable" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="exam-mgmt" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="exams" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="exam-duty" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="duties" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="hall-tickets" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="halltickets" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="result-center" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="results" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="grade-moderation" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="moderation" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="course-mapping" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="overview" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="faculty-workload" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="workload" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="classroom-allocation" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="classrooms" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="academic-reports" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="reports" />
                    </RoleProtectedRoute>
                  } />
                  <Route path="ai-academic-assistant" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ACADEMIC_CONTROLLER', 'ADMIN']}>
                      <AcademicControllerDashboard initialTab="ai-assistant" />
                    </RoleProtectedRoute>
                  } />

                  {/* Enterprise Modules */}
                  <Route path="admin-roles" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                      <PermissionsManager />
                    </RoleProtectedRoute>
                  } />
                  <Route path="admin-audits" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                      <AuditLogs />
                    </RoleProtectedRoute>
                  } />
                  <Route path="siem" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                      <SIEMDashboard />
                    </RoleProtectedRoute>
                  } />
                  <Route path="institutions" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                      <InstitutionManagement />
                    </RoleProtectedRoute>
                  } />
                  <Route path="billing" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                      <InstitutionalBilling />
                    </RoleProtectedRoute>
                  } />
                  <Route path="users" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                      <UserManagement />
                    </RoleProtectedRoute>
                  } />
                  <Route path="policy-simulator" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                      <PolicySimulator />
                    </RoleProtectedRoute>
                  } />
                  <Route path="operations" element={<ERPCompletenessHub />} />
                  
                  {/* General ERP Modules */}
                  <Route path="approvals" element={<ApprovalsWorkflow />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="account-deletion" element={<AccountDeletion />} />
                  <Route path="delete-account" element={<AccountDeletion />} />
                  <Route path="library" element={<Library />} />
                  <Route path="hostel" element={<Hostel />} />
                  <Route path="transport" element={<Transport />} />
                  <Route path="finance" element={<Finance />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="exams" element={<Exams />} />
                  <Route path="ai" element={<AIAssistant />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="chat" element={<LiveChat />} />

                  {/* 20 Advanced Enterprise Modules */}
                  <Route path="digital-twin" element={<DigitalCampusTwin />} />
                  <Route path="ai-firewall" element={<AIFirewallCenter />} />
                  <Route path="lms" element={<LMSPlatform />} />
                  <Route path="student-success" element={<StudentSuccessEarlyWarning />} />
                  <Route path="career-ai" element={<CareerIntelligence />} />
                  <Route path="research" element={<ResearchInnovationPortal />} />
                  <Route path="hackathons" element={<HackathonInnovationHub />} />
                  <Route path="mentorship" element={<MentorshipMarketplace />} />
                  <Route path="accreditation" element={<AccreditationOBECenter />} />
                  <Route path="vault" element={<BlockchainDocumentVault />} />
                  <Route path="voice-vision" element={<VoiceAndVisionHub />} />
                  {/* Features 21 through 39 Modules */}
                  <Route path="mess" element={<SmartMessCafeteria />} />
                  <Route path="iot" element={<SmartCampusIoT />} />
                  <Route path="sustainability" element={<SustainabilityDashboard />} />
                  <Route path="maintenance" element={<FacilityMaintenance />} />
                  <Route path="inventory" element={<InventoryProcurement />} />
                  <Route path="workflows" element={<WorkflowAutomationBuilder />} />
                  <Route path="plugins" element={<PluginIntegrationsHub />} />
                  <Route path="developer" element={<DeveloperPortal />} />
                  <Route path="executive" element={<ExecutiveCommandCenter />} />
                  <Route path="it-ops" element={<ITAssistantMLOps />} />
                  <Route path="privacy" element={<PrivacyComplianceCenter />} />
                  <Route path="community" element={<CampusSocialCommunity />} />
                  <Route path="gamification" element={<StudentGamificationLeaderboard />} />
                  <Route path="portfolio" element={<StudentPublicPortfolio />} />
                  <Route path="health" element={<CampusHealthWellness />} />
                  
                  {/* Reported Issues & User Support Hub (SuperAdmin & Admin) */}
                  <Route path="reported-issues" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                      <ReportedIssuesHub />
                    </RoleProtectedRoute>
                  } />

                  {/* 6 Core Commercial & Enterprise Modules */}
                  <Route path="admissions" element={<AdmissionsCRM />} />
                  <Route path="migration" element={
                    <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                      <DataMigrationEngine />
                    </RoleProtectedRoute>
                  } />
                  <Route path="plagiarism" element={<PlagiarismAIDetector />} />
                  <Route path="lecture-ai" element={<LectureSummarizerStudio />} />
                  <Route path="ssr-compiler" element={<AccreditationSSRCompiler />} />
                  <Route path="alumni" element={<AlumniNetworkHub />} />

                  {/* Catch-all dashboard redirect */}
                  <Route path="*" element={<DynamicDashboardRedirect />} />
                </Route>

                {/* Default Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </VoiceAssistantProvider>
        </BrowserRouter>
      </SupportModalProvider>
      </AccessibilityProvider>
            </LanguageProvider>
          </SocketProvider>
        </CookieConsentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
