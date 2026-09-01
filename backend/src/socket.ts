import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let ioInstance: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log('⚡ Socket client connected:', socket.id);

    // Client authenticates & joins user/role rooms
    socket.on('join', (data: { userId?: string; role?: string }) => {
      if (data?.userId) {
        socket.join(`user:${data.userId}`);
      }
      if (data?.role) {
        socket.join(`role:${data.role.toUpperCase()}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket client disconnected:', socket.id);
    });
  });

  return ioInstance;
};

export const getIO = (): SocketIOServer | null => ioInstance;

export const emitRealtimeNotification = (notification: any) => {
  if (!ioInstance) return;

  const targetRole = notification.targetRole?.toUpperCase() || 'ALL';
  const targetUser = notification.targetUserId || 'ALL';

  if (targetUser !== 'ALL') {
    ioInstance.to(`user:${targetUser}`).emit('new_notification', notification);
  } else if (targetRole !== 'ALL') {
    ioInstance.to(`role:${targetRole}`).emit('new_notification', notification);
    ioInstance.emit('new_notification', notification);
  } else {
    ioInstance.emit('new_notification', notification);
  }
};
