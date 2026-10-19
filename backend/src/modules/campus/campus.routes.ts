import { Router } from 'express';
import { getDigitalTwinData, getClinicRecords, createClinicRecord, logCVDetection } from './campus.controller.js';

const router = Router();

router.get('/digital-twin', getDigitalTwinData);
router.get('/health/clinic-records', getClinicRecords);
router.post('/health/clinic-record', createClinicRecord);
router.post('/cv/detection', logCVDetection);

export default router;
