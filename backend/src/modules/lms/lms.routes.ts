import { Router } from 'express';
import {
  listLMSCourses,
  getLMSCourse,
  createLMSCourse,
  completeLesson,
  getAdaptiveLearningRecommendations
} from './lms.controller.js';

const router = Router();

router.get('/courses', listLMSCourses);
router.get('/courses/:id', getLMSCourse);
router.post('/courses', createLMSCourse);
router.post('/courses/:courseId/complete-lesson', completeLesson);
router.get('/adaptive-recommendations/:studentId', getAdaptiveLearningRecommendations);

export default router;
