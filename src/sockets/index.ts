import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../common/utils/logger';

export const setupSockets = (server: HttpServer) => {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Match Room
    socket.on('join_match', (matchId: string) => {
      socket.join(matchId);
      logger.info(`Socket ${socket.id} joined match room ${matchId}`);
    });

    // Auction Room
    socket.on('join_auction', (auctionId: string) => {
      socket.join(`auction_${auctionId}`);
      logger.info(`Socket ${socket.id} joined auction room auction_${auctionId}`);
    });

    socket.on('leave_auction', (auctionId: string) => {
      socket.leave(`auction_${auctionId}`);
      logger.info(`Socket ${socket.id} left auction room auction_${auctionId}`);
    });

    // User Room
    socket.on('join_user_room', (userId: string) => {
      socket.join(userId);
      logger.info(`Socket ${socket.id} joined user room ${userId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  (global as any).io = io;
};

export const getIo = (): Server => {
  if (!(global as any).io) {
    throw new Error('Socket.io not initialized');
  }
  return (global as any).io;
};
