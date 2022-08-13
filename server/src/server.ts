import 'dotenv/config';

import dotenv from 'dotenv';
import express, { Express } from 'express';
import { Server } from 'socket.io';
import {
  addSocket,
  EmitEvents,
  ListenEvents,
  removeSocket,
  ServerSideEvents,
  SocketData,
} from './SocketManager';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

const io = new Server<ListenEvents, EmitEvents, ServerSideEvents, SocketData>(
  server,
  {
    cors: {
      origin: process.env.COORS_IPS?.split(','),
    },
  },
);

io.on('connection', (socket) => {
  addSocket(socket);
  socket.on('disconnect', () => {
    removeSocket(socket.id);
  });
});
