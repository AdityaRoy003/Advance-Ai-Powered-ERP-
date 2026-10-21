import { Router } from 'express';
import { validateMigrationData, executeMigration } from './migration.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.post('/validate', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), validateMigrationData);
router.post('/execute', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), executeMigration);

export default router;
