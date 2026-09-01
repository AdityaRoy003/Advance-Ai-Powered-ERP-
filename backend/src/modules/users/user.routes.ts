import { Router } from 'express';
import { listUsers, getUser, createUser, updateUser, deleteUser, restoreUser, bulkImportUsers } from './user.controller.js';

const router = Router();

router.get('/', listUsers);
router.post('/', createUser);
router.post('/bulk-import', bulkImportUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/restore', restoreUser);

export default router;
