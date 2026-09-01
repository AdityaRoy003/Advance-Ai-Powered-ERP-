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
router.use('/v1/auth', authRoutes);

// Institution management — Super Admin only
router.use('/v1/institutions', authenticate, institutionRoutes);

// All tenant-scoped data routes
router.use('/v1/users',         authenticate, tenantScope, userRoutes);
router.use('/v1/students',      authenticate, tenantScope, studentRoutes);
router.use('/v1/teachers',      authenticate, tenantScope, teacherRoutes);
router.use('/v1/attendance',    authenticate, tenantScope, attendanceRoutes);
router.use('/v1/finance',       authenticate, tenantScope, financeRoutes);
router.use('/v1/library',       authenticate, tenantScope, libraryRoutes);
router.use('/v1/exams',         authenticate, tenantScope, examRoutes);
router.use('/v1/ai',            authenticate, tenantScope, aiRoutes);
router.use('/v1/cybersecurity', authenticate, tenantScope, securityRoutes);
router.use('/v1/hostel',        authenticate, tenantScope, hostelRoutes);
router.use('/v1/transport',     authenticate, tenantScope, transportRoutes);
router.use('/v1/courses',       authenticate, tenantScope, courseRoutes);
router.use('/v1/timetable',     authenticate, tenantScope, timetableRoutes);
router.use('/v1/placement',     authenticate, tenantScope, placementRoutes);
router.use('/v1/departments',   authenticate, tenantScope, departmentRoutes);
router.use('/v1/notifications', authenticate, tenantScope, notificationRoutes);
router.use('/v1/lms',           authenticate, tenantScope, lmsRoutes);
router.use('/v1/research',      authenticate, tenantScope, researchRoutes);
router.use('/v1/innovation',    authenticate, tenantScope, innovationRoutes);
router.use('/v1/accreditation', authenticate, tenantScope, accreditationRoutes);
router.use('/v1/documents',     authenticate, tenantScope, documentRoutes);
router.use('/v1/campus',        authenticate, tenantScope, campusRoutes);
router.use('/v1/facilities',    authenticate, tenantScope, facilitiesRoutes);
router.use('/v1/iot',           authenticate, tenantScope, iotRoutes);
router.use('/v1/automation',    authenticate, tenantScope, automationRoutes);
router.use('/v1/executive',     authenticate, tenantScope, executiveRoutes);
router.use('/v1/system-ops',    authenticate, tenantScope, systemOpsRoutes);
router.use('/v1/social',        authenticate, tenantScope, socialRoutes);

export default router;
