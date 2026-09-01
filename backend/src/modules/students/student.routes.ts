import { Router } from 'express';
import Student from './student.model.js';
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
