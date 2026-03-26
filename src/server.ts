import { app, server } from './app';
import mongoose from 'mongoose';
import config from './config';
import logger from './common/utils/logger';

const startServer = async () => {
  try {
    await mongoose.connect(config.dbUri);
    logger.info('Connected to MongoDB');

    server.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
