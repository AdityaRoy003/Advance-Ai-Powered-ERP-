import { Server } from 'socket.io';

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('ping', () => {
      socket.emit('pong', { ok: true });
    });
  });

  return io;
};

export default initSocket;
