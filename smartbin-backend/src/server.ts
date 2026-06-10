import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { initSocket } from './config/socket';

const server = http.createServer(app);

initSocket(server);

const start = async (): Promise<void> => {
  await connectDatabase();

  server.listen(env.port, () => {
    console.log(`[Server] Running on port ${env.port} (${env.nodeEnv})`);
  });
};

start();
