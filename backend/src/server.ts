import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/database.js';
import env from './config/env.js';
import { initSocket } from './socket.js';

const PORT = Number(env.PORT) || 5000;

void connectDB();

const server = http.createServer(app);

// Attach Socket.io server using socket manager
initSocket(server);

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use.`);
    console.error(`   Run this to free it:  netstat -ano | findstr :${PORT}`);
    console.error(`   Then kill via:         taskkill /PID <PID> /F\n`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`✅  Server running on port ${PORT} with Socket.IO enabled`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\n🛑  Received ${signal}. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log('✅  HTTP server closed. Exiting process.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️  Force exiting after 5s timeout.');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
