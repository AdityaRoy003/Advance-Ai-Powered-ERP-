import { Router } from 'express';
import Attendance from './attendance.model.js';
import Student from '../students/student.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const institutionId = (req as any).institutionId;
    const query: any = {};
    if (institutionId) query.institutionId = institutionId;

    const logs = await Attendance.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'firstName lastName' }
      });

    const formatted = logs.map(l => {
      const student = l.studentId as any;
      const user = student?.userId as any;
      return {
        id: l._id,
        studentName: user ? `${user.firstName} ${user.lastName}` : 'Student',
        date: l.date.toISOString().split('T')[0],
        status: l.status,
        className: l.className,
        subject: l.subject
      };
    });

    return sendSuccess(res, 'Attendance logs retrieved successfully', { logs: formatted });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch attendance logs', null, 500);
  }
});

router.post('/mark', async (req, res) => {
  try {
    const institutionId = (req as any).institutionId;
    const { studentId, status, className, subject, markedBy } = req.body;
    const newLog = await Attendance.create({
      studentId,
      date: new Date(),
      status,
      className: className || 'General',
      subject: subject || 'General Class',
      markedBy: markedBy || studentId,
      ...(institutionId && { institutionId })
    });
    return sendSuccess(res, 'Attendance marked successfully', newLog);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to mark attendance', null, 500);
  }
});

export default router;

