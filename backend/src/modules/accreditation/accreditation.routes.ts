import { Router } from 'express';
import { getAccreditationReport, updateCriterionScore } from './accreditation.controller.js';

const router = Router();

router.get('/', getAccreditationReport);
router.put('/:id', updateCriterionScore);

export default router;
