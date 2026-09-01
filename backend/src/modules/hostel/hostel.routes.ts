import { Router } from 'express';
import { getHostelRooms, createHostelRoom, updateHostelRoom } from './hostel.controller.js';

const router = Router();

router.get('/', getHostelRooms);
router.post('/', createHostelRoom);
router.put('/:id', updateHostelRoom);

export default router;
