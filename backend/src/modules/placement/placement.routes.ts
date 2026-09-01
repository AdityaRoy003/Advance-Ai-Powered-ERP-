import { Router } from 'express';
import { listDrives, createDrive, applyForDrive } from './placement.controller.js';

const router = Router();

router.get('/', listDrives);
router.post('/', createDrive);
router.post('/:id/apply', applyForDrive);

export default router;
