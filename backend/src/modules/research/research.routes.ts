import { Router } from 'express';
import { listResearch, createResearch, runLiteratureDiscovery } from './research.controller.js';

const router = Router();

router.get('/', listResearch);
router.post('/', createResearch);
router.post('/literature-discovery', runLiteratureDiscovery);

export default router;
