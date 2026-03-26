import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../common/utils/logger';

export const setupSockets = (server: HttpServer) => {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Join Match Room for Live Scoring
    socket.on('join_match', (matchId: string) => {
      socket.join(matchId);
      logger.info(`Socket ${socket.id} joined match room ${matchId}`);
    });

    socket.on('leave_match', (matchId: string) => {
      socket.leave(matchId);
      logger.info(`Socket ${socket.id} left match room ${matchId}`);
    });

    // Join Personal Room for Notifications
    socket.on('join_user_room', (userId: string) => {
      socket.join(userId);
      logger.info(`Socket ${socket.id} joined user room ${userId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  // Attach io instance to global object to be accessible from controllers/services
  (global as any).io = io;
};

export const getIo = (): Server => {
  if (!(global as any).io) {
    throw new Error('Socket.io not initialized');
  }
  return (global as any).io;
};
