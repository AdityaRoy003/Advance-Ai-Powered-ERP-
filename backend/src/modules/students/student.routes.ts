import { Router } from 'express';
import Student from './student.model.js';
import User from '../users/user.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'firstName lastName email');
    const formatted = students.map(s => {
      const u = s.userId as any;
      return {
        id: s._id,
        name: u ? `${u.firstName} ${u.lastName}` : 'Student',
        rollNumber: s.rollNumber,
        class: s.className,
        department: s.department,
        gpa: s.gpa,
        attendance: s.attendancePercentage
      };
    });
    return sendSuccess(res, 'Students list retrieved successfully', { students: formatted });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch students', null, 500);
  }
});

router.get('/me', async (req: any, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return sendError(res, 'User ID not authenticated', null, 401);
    }
    let student = await Student.findOne({ userId }).populate('userId', 'firstName lastName email department');
    if (!student) {
      const user = await User.findById(userId);
      if (user) {
        student = await Student.create({
          userId: user._id,
          rollNumber: `STU-${Math.floor(10000 + Math.random() * 90000)}`,
          className: 'Final Year Batch',
          department: user.department || 'Computer Science',
          gpa: 3.85,
          attendancePercentage: 88,
          parentName: 'Guardian',
          parentEmail: `guardian.${user.email}`,
          parentPhone: '+1-555-0199',
          feesPaid: 12000,
          feesDue: 0,
          transportRoute: 'Route A - North Campus Express',
          hostelRoom: 'Block B - Room 304',
          courses: []
        });
        student = await Student.findById(student._id).populate('userId', 'firstName lastName email department');
      }
    }
    if (!student) {
      return sendError(res, 'Student profile not found', null, 404);
    }
    return sendSuccess(res, 'Student profile retrieved successfully', student);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch student profile', null, 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('userId', 'firstName lastName email');
    if (!student) {
      return sendError(res, 'Student not found', null, 404);
    }
    const u = student.userId as any;
    return sendSuccess(res, 'Student details retrieved successfully', {
      id: student._id,
      name: u ? `${u.firstName} ${u.lastName}` : 'Student',
      rollNumber: student.rollNumber,
      class: student.className,
      department: student.department,
      gpa: student.gpa,
      attendance: student.attendancePercentage,
      courses: student.courses,
      transportRoute: student.transportRoute,
      hostelRoom: student.hostelRoom,
      parentName: student.parentName,
      parentEmail: student.parentEmail
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch student details', null, 500);
  }
});

export default router;
