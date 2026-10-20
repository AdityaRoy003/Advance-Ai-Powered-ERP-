import { Router } from 'express';
import {
  getDashboardSummary,
  getCalendar,
  addCalendarEvent,
  toggleFreezeCalendar,
  publishCalendar,
  getTimetable,
  runAITimetableSolver,
  getClassrooms,
  getRoomSuggestions,
  getExams,
  createExam,
  updateExamWorkflow,
  generateSeatingPlan,
  getFacultyDuties,
  runAIFacultyDutyAllocation,
  getHallTickets,
  generateHallTickets,
  verifyHallTicketPublic,
  getResults,
  applyGradeModeration,
  getFacultyWorkload,
  getAcademicReports,
  queryAIAssistant
} from './academic.controller.js';

const router = Router();

// Dashboard & KPI Executive Summary
router.get('/summary', getDashboardSummary);

// Module 1: Academic Calendar
router.get('/calendar', getCalendar);
router.post('/calendar/events', addCalendarEvent);
router.post('/calendar/freeze', toggleFreezeCalendar);
router.post('/calendar/publish', publishCalendar);

// Module 2: AI Timetable Generator
router.get('/timetable', getTimetable);
router.post('/timetable/ai-solve', runAITimetableSolver);

// Module 3: Classroom Allocation
router.get('/classrooms', getClassrooms);
router.get('/classrooms/suggestions', getRoomSuggestions);

// Module 4 & 5: Exam Management & Seating Plan
router.get('/exams', getExams);
router.post('/exams', createExam);
router.patch('/exams/:id/workflow', updateExamWorkflow);
router.post('/exams/:id/seating-plan', generateSeatingPlan);

// Module 6: Faculty Exam Duty Allocation
router.get('/duties', getFacultyDuties);
router.post('/duties/ai-allocate', runAIFacultyDutyAllocation);

// Module 7: Hall Ticket Center
router.get('/hall-tickets', getHallTickets);
router.post('/hall-tickets/generate', generateHallTickets);
router.get('/hall-tickets/verify/:id', verifyHallTicketPublic);

// Module 8 & 9: Result Center & Grade Moderation
router.get('/results', getResults);
router.post('/results/moderation', applyGradeModeration);

// Module 10: Faculty Workload Manager
router.get('/workload', getFacultyWorkload);

// Module 11: Reports
router.get('/reports', getAcademicReports);

// Module 12: AI Academic Assistant
router.post('/ai-assistant', queryAIAssistant);

export default router;
