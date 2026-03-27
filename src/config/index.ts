import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  dbUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cricmitra',
  redisUri: process.env.REDIS_URI || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  env: process.env.NODE_ENV || 'development'
};
