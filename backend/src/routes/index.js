import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import studentRoutes from '../modules/students/student.routes.js';
import teacherRoutes from '../modules/teachers/teacher.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import attendanceRoutes from '../modules/attendance/attendance.routes.js';
import financeRoutes from '../modules/finance/finance.routes.js';
import libraryRoutes from '../modules/library/library.routes.js';
import { sendSuccess } from '../core/response/apiResponse.js';

const router = Router();

router.get('/', (req, res) => {
  return sendSuccess(res, 'EduVerse AI ERP backend is running', {
    project: 'EduVerse AI ERP',
    architecture: 'feature-based modular',
    version: 'v1'
  });
});

router.get('/health', (req, res) => {
  return sendSuccess(res, 'API is healthy', {
    server: 'Running',
    database: 'Connection handled by config/database.js',
    modules: ['auth', 'users', 'students', 'teachers', 'attendance', 'finance', 'library']
  });
});

router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/students', studentRoutes);
router.use('/v1/teachers', teacherRoutes);
router.use('/v1/attendance', attendanceRoutes);
router.use('/v1/finance', financeRoutes);
router.use('/v1/library', libraryRoutes);

export default router;