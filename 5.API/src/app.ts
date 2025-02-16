// src/app.ts
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from './middleware/rateLimiter';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import setupSwagger from './config/swagger';
import { metricsMiddleware, metricsRoute } from './middleware/metrics';
import morgan from 'morgan';
import { config } from './config';

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Alternatively, using morgan
app.use(morgan('combined'));

// Rate limiting
app.use(rateLimiter);

// Metrics middleware
app.use(metricsMiddleware);

// Routes
app.use('/api', userRoutes);
app.use('/api/products', productRoutes);

// Metrics endpoint
app.get('/metrics', metricsRoute);

// Swagger documentation
setupSwagger(app, config.port);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

export default app;