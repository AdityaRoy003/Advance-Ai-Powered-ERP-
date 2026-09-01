import http from 'http';
import app from './app.js';
import connectDB from './config/database.js';
import env from './config/env.js';

const PORT = env.PORT;

connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});