import { Router } from 'express';
import {
  listInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  suspendInstitution,
  reactivateInstitution,
  deleteInstitution,
  getInstitutionUsers
} from './institution.controller.js';

const router = Router();

// All institution routes are Super Admin only (auth checked at middleware level)
router.get('/', listInstitutions);
router.post('/', createInstitution);
router.get('/:id', getInstitution);
router.put('/:id', updateInstitution);
router.patch('/:id/suspend', suspendInstitution);
router.patch('/:id/reactivate', reactivateInstitution);
router.delete('/:id', deleteInstitution);
router.get('/:id/users', getInstitutionUsers);

export default router;
