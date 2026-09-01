import type { Request, Response } from 'express';
import Notification from './notification.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';
import { emitRealtimeNotification } from '../../socket.js';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { category, role, userId } = req.query;

    const filter: any = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Include notifications for 'ALL' or user's specific role / userId
    const orConditions: any[] = [{ targetUserId: 'ALL' }, { targetRole: 'ALL' }];
    if (userId) orConditions.push({ targetUserId: String(userId) });
    if (role) orConditions.push({ targetRole: String(role).toUpperCase() });
    filter.$or = orConditions;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Map time formatting & read state for the requesting user
    const formatted = notifications.map((n: any) => ({
      id: n._id.toString(),
      _id: n._id.toString(),
      title: n.title,
      body: n.body,
      category: n.category,
      priority: n.priority,
      icon: n.icon || (n.category === 'Finance' ? '🔴' : n.category === 'Academic' ? '🟡' : n.category === 'Security' ? '🔴' : '🔵'),
      color: n.color || (n.category === 'Finance' ? 'rose' : n.category === 'Academic' ? 'amber' : n.category === 'Security' ? 'rose' : 'sky'),
      link: n.link || '',
      read: userId ? n.readBy?.includes(String(userId)) : false,
      date: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      createdAt: n.createdAt
    }));

    return sendSuccess(res, 'Notifications fetched successfully', formatted);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch notifications', 500);
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, body, category, priority, icon, color, link, targetRole, targetUserId } = req.body;

    if (!title || !body) {
      return sendError(res, 'Title and body are required', 400);
    }

    const newNotif = await Notification.create({
      title,
      body,
      category: category || 'System',
      priority: priority || 'NORMAL',
      icon: icon || (category === 'Finance' ? '🔴' : category === 'Academic' ? '🟡' : category === 'Security' ? '🔴' : '🔵'),
      color: color || (category === 'Finance' ? 'rose' : category === 'Academic' ? 'amber' : category === 'Security' ? 'rose' : 'sky'),
      link: link || '',
      targetRole: targetRole || 'ALL',
      targetUserId: targetUserId || 'ALL',
      readBy: []
    });

    const notifObj = {
      id: newNotif._id.toString(),
      _id: newNotif._id.toString(),
      title: newNotif.title,
      body: newNotif.body,
      category: newNotif.category,
      priority: newNotif.priority,
      icon: newNotif.icon,
      color: newNotif.color,
      link: newNotif.link,
      read: false,
      date: 'Just now',
      createdAt: newNotif.createdAt
    };

    // Emit live real-time event via Socket.IO
    emitRealtimeNotification(notifObj);

    return sendSuccess(res, 'Notification created and dispatched in real time', notifObj, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create notification', 500);
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (userId) {
      await Notification.findByIdAndUpdate(id, {
        $addToSet: { readBy: String(userId) }
      });
    }

    return sendSuccess(res, 'Notification marked as read');
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to mark as read', 500);
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (userId) {
      await Notification.updateMany({}, {
        $addToSet: { readBy: String(userId) }
      });
    }
    return sendSuccess(res, 'All notifications marked as read');
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to mark all as read', 500);
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    return sendSuccess(res, 'Notification dismissed successfully');
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to delete notification', 500);
  }
};
