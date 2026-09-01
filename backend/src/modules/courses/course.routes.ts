import { Router } from 'express';
import { listCourses, createCourse, updateCourse, deleteCourse } from './course.controller.js';

const router = Router();

router.get('/', listCourses);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
