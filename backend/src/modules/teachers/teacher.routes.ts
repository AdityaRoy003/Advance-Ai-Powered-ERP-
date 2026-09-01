import { Router } from 'express';
import Teacher from './teacher.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('userId', 'firstName lastName email');
    const formatted = teachers.map(t => {
      const u = t.userId as any;
      return {
        id: t._id,
        name: u ? `${u.firstName} ${u.lastName}` : 'Teacher',
        employeeId: t.employeeId,
        department: t.department,
        designation: t.designation,
        subjects: t.subjects
      };
    });
    return sendSuccess(res, 'Teachers list retrieved successfully', { teachers: formatted });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch teachers', null, 500);
  }
});

export default router;
