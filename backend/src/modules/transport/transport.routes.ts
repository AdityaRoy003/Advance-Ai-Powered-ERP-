import { Router } from 'express';
import { getTransportRoutes, createTransportRoute } from './transport.controller.js';

const router = Router();

router.get('/', getTransportRoutes);
router.post('/', createTransportRoute);

export default router;
