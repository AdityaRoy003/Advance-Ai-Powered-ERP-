import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import studentRoutes from '../modules/students/student.routes.js';
import teacherRoutes from '../modules/teachers/teacher.routes.js';
import attendanceRoutes from '../modules/attendance/attendance.routes.js';
import financeRoutes from '../modules/finance/finance.routes.js';
import libraryRoutes from '../modules/library/library.routes.js';
import examRoutes from '../modules/exams/exam.routes.js';
import aiRoutes from '../modules/ai/ai.routes.js';
import securityRoutes from '../modules/cybersecurity/cybersecurity.routes.js';
import hostelRoutes from '../modules/hostel/hostel.routes.js';
import transportRoutes from '../modules/transport/transport.routes.js';
import courseRoutes from '../modules/courses/course.routes.js';
import timetableRoutes from '../modules/timetable/timetable.routes.js';
import placementRoutes from '../modules/placement/placement.routes.js';
import departmentRoutes from '../modules/departments/department.routes.js';
import notificationRoutes from '../modules/notifications/notification.routes.js';
import institutionRoutes from '../modules/institutions/institution.routes.js';
import lmsRoutes from '../modules/lms/lms.routes.js';
import researchRoutes from '../modules/research/research.routes.js';
import innovationRoutes from '../modules/innovation/innovation.routes.js';
import accreditationRoutes from '../modules/accreditation/accreditation.routes.js';
import documentRoutes from '../modules/documents/document.routes.js';
import campusRoutes from '../modules/campus/campus.routes.js';
import facilitiesRoutes from '../modules/facilities/facilities.routes.js';
import iotRoutes from '../modules/iot_sustainability/iot.routes.js';
import automationRoutes from '../modules/automation/automation.routes.js';
import executiveRoutes from '../modules/executive/executive.routes.js';
import systemOpsRoutes from '../modules/system_ops/system_ops.routes.js';
import socialRoutes from '../modules/social_gamification/social.routes.js';
import operationsRoutes from '../modules/erp_operations/erp_operations.routes.js';
import academicRoutes from '../modules/academic_controller/academic.routes.js';
import { authenticate } from '../modules/auth/auth.middleware.js';
import { tenantScope } from '../middlewares/tenantScope.middleware.js';
import { sendSuccess } from '../core/response/apiResponse.js';

const router = Router();

router.get('/', (req, res) => {
  return sendSuccess(res, 'EduVerse AI ERP backend is running', {
    project: 'EduVerse AI ERP',
    architecture: 'multi-tenant SaaS',
    version: 'v2.6'
  });
});

router.get('/health', (req, res) => {
  return sendSuccess(res, 'API is healthy', {
    server: 'Running',
    database: 'Connection handled by config/database.js',
    multiTenant: true,
    modules: [
      'auth', 'users', 'institutions', 'students', 'teachers',
      'attendance', 'finance', 'library', 'exams', 'ai',
      'cybersecurity', 'hostel', 'transport', 'courses',
      'timetable', 'placement', 'departments', 'notifications',
      'lms', 'research', 'innovation', 'accreditation', 'documents', 'campus'
    ]
  });
});

// Auth — no tenant scoping needed
router.use(['/v1/auth', '/auth'], authRoutes);

// Institution management — Super Admin only
router.use(['/v1/institutions', '/institutions'], authenticate, institutionRoutes);

// All tenant-scoped data routes
router.use(['/v1/users', '/users'],                 authenticate, tenantScope, userRoutes);
router.use(['/v1/students', '/students'],           authenticate, tenantScope, studentRoutes);
router.use(['/v1/teachers', '/teachers'],           authenticate, tenantScope, teacherRoutes);
router.use(['/v1/attendance', '/attendance'],       authenticate, tenantScope, attendanceRoutes);
router.use(['/v1/finance', '/finance'],             authenticate, tenantScope, financeRoutes);
router.use(['/v1/library', '/library'],             authenticate, tenantScope, libraryRoutes);
router.use(['/v1/exams', '/exams'],                 authenticate, tenantScope, examRoutes);
router.use(['/v1/ai', '/ai'],                       authenticate, tenantScope, aiRoutes);
router.use(['/v1/cybersecurity', '/cybersecurity'], authenticate, tenantScope, securityRoutes);
router.use(['/v1/hostel', '/hostel'],               authenticate, tenantScope, hostelRoutes);
router.use(['/v1/transport', '/transport'],         authenticate, tenantScope, transportRoutes);
router.use(['/v1/courses', '/courses'],             authenticate, tenantScope, courseRoutes);
router.use(['/v1/timetable', '/timetable'],         authenticate, tenantScope, timetableRoutes);
router.use(['/v1/placement', '/placement'],         authenticate, tenantScope, placementRoutes);
router.use(['/v1/departments', '/departments'],     authenticate, tenantScope, departmentRoutes);
router.use(['/v1/notifications', '/notifications'], authenticate, tenantScope, notificationRoutes);
router.use(['/v1/lms', '/lms'],                     authenticate, tenantScope, lmsRoutes);
router.use(['/v1/research', '/research'],           authenticate, tenantScope, researchRoutes);
router.use(['/v1/innovation', '/innovation'],       authenticate, tenantScope, innovationRoutes);
router.use(['/v1/accreditation', '/accreditation'], authenticate, tenantScope, accreditationRoutes);
router.use(['/v1/documents', '/documents'],         authenticate, tenantScope, documentRoutes);
router.use(['/v1/campus', '/campus'],               authenticate, tenantScope, campusRoutes);
router.use(['/v1/facilities', '/facilities'],       authenticate, tenantScope, facilitiesRoutes);
router.use(['/v1/iot', '/iot'],                     authenticate, tenantScope, iotRoutes);
router.use(['/v1/automation', '/automation'],       authenticate, tenantScope, automationRoutes);
router.use(['/v1/executive', '/executive'],         authenticate, tenantScope, executiveRoutes);
router.use(['/v1/system-ops', '/system-ops'],       authenticate, tenantScope, systemOpsRoutes);
router.use(['/v1/social', '/social'],               authenticate, tenantScope, socialRoutes);
router.use(['/v1/operations', '/operations'],       authenticate, tenantScope, operationsRoutes);
// Public QR verification endpoint bypasses auth for mobile scanners
router.get(['/v1/academic/hall-tickets/verify/:id', '/academic/hall-tickets/verify/:id'], academicRoutes);
router.use(['/v1/academic', '/academic'],           authenticate, tenantScope, academicRoutes);

export default router;
