import { Router } from 'express';
import { getAllSensors, ingestTelemetry, getSustainabilitySnapshot } from './iot.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { tenantScope } from '../../middlewares/tenantScope.middleware.js';

const router = Router();

router.use(authenticate, tenantScope);

router.get('/sensors', getAllSensors);
router.post('/telemetry/ingest', ingestTelemetry);
router.get('/sustainability', getSustainabilitySnapshot);

export default router;
