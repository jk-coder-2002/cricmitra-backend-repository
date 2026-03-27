import { app, server } from './app';
import mongoose from 'mongoose';
import config from './config';
import logger from './common/utils/logger';
import { auctionService } from './modules/auction/auction.service';

const startServer = async () => {
  try {
    await mongoose.connect(config.dbUri);
    logger.info('Connected to MongoDB');

    // Resume any auctions that were live if the server crashed
    await auctionService.resumeActiveAuctions();

    server.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
