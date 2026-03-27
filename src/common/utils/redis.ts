import Redis from 'ioredis';
import Redlock from 'redlock';
import config from '../../config';
import logger from './logger';

export const redisClient = new Redis(config.redisUri);

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

// Configure Redlock for distributed locking
// Important: Redlock helps prevent race conditions during high-concurrency bidding
export const redlock = new Redlock(
  [redisClient],
  {
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 200, // time in ms
    retryJitter: 200, // time in ms
    automaticExtensionThreshold: 500, // time in ms
  }
);
