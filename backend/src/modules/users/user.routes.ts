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

const router = Router();

router.get('/', listUsers);
router.post('/', createUser);
router.post('/bulk-import', bulkImportUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.patch('/:id/status', updateUserStatus);
router.patch('/:id/password', resetUserPassword);
router.delete('/:id', deleteUser);
router.post('/:id/restore', restoreUser);

export default router;
