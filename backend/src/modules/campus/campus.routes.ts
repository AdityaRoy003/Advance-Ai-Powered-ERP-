import { Router } from 'express';
import { getDigitalTwinData, createClinicRecord, logCVDetection } from './campus.controller.js';

const router = Router();

router.get('/digital-twin', getDigitalTwinData);
router.post('/health/clinic-record', createClinicRecord);
router.post('/cv/detection', logCVDetection);

export default router;
