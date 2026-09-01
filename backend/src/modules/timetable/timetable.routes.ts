import { Router } from 'express';
import { listTimetable, createTimetableSlot, deleteTimetableSlot } from './timetable.controller.js';

const router = Router();

router.get('/', listTimetable);
router.post('/', createTimetableSlot);
router.delete('/:id', deleteTimetableSlot);

export default router;
