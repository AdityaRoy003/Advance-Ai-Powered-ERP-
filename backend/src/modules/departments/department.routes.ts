import { Router } from 'express';
import { listDepartments, createDepartment } from './department.controller.js';

const router = Router();

router.get('/', listDepartments);
router.post('/', createDepartment);

export default router;
