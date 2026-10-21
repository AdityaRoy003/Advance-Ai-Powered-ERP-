import { Router } from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  bulkImportUsers,
  updateUserStatus,
  resetUserPassword
} from './user.controller.js';

import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Administrative management requires SUPER_ADMIN, ADMIN, or HR_MANAGER
const adminOnly = authorizeRoles('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER');

router.get('/', listUsers);
router.post('/', adminOnly, createUser);
router.post('/bulk-import', adminOnly, bulkImportUsers);
router.get('/:id', getUser);
router.put('/:id', adminOnly, updateUser);
router.patch('/:id/status', adminOnly, updateUserStatus);
router.patch('/:id/password', adminOnly, resetUserPassword);
router.delete('/:id', adminOnly, deleteUser);
router.post('/:id/restore', adminOnly, restoreUser);

export default router;
