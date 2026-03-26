import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { setupSockets } from './sockets';
import routes from './routes';
import { errorHandler } from './common/middleware/error.middleware';

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Sockets
setupSockets(server);

// Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

export { app, server };
