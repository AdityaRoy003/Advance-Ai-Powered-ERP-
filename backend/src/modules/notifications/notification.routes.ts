import { Router } from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from './notification.controller.js';

const router = Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/mark-all-read', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
