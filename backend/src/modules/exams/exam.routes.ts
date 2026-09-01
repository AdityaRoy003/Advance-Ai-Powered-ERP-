import { Router } from 'express';
import { sendSuccess } from '../../core/response/apiResponse.js';

const router = Router();

router.get('/', (req, res) => {
  return sendSuccess(res, 'Exam schedules retrieved', {
    exams: [
      { id: 'ex1', title: 'Machine Learning Term Final', className: 'CS-4A', subject: 'Machine Learning', date: '2026-07-28', maxMarks: 100 },
      { id: 'ex2', title: 'Cyber Security Mid-Semester', className: 'CS-4A', subject: 'Cyber Security', date: '2026-07-30', maxMarks: 50 },
      { id: 'ex3', title: 'Database Systems Quiz 3', className: 'CS-4B', subject: 'Database Systems', date: '2026-08-02', maxMarks: 20 }
    ]
  });
});

router.get('/results/:studentId', (req, res) => {
  return sendSuccess(res, 'Results retrieved successfully', {
    studentId: req.params.studentId,
    grades: [
      { subject: 'Machine Learning', score: 88, grade: 'A', remarks: 'Excellent project work' },
      { subject: 'Cyber Security', score: 92, grade: 'A+', remarks: 'Strong lab execution' },
      { subject: 'Database Systems', score: 95, grade: 'O', remarks: 'Perfect theory exam' }
    ]
  });
});

export default router;
