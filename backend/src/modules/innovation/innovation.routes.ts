import { Router } from 'express';
import { listHackathons, createHackathon, matchTeammatesAI, bookMentorSession } from './innovation.controller.js';

const router = Router();

router.get('/hackathons', listHackathons);
router.post('/hackathons', createHackathon);
router.post('/match-teammates', matchTeammatesAI);
router.post('/mentorship/book', bookMentorSession);

export default router;
