/**
 * H2EO LMS Backend Server
 * Main server entry point with Express.js configuration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import configurations and middleware
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import errorHandler from './middleware/errorHandler.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import organizationRoutes from './routes/organizations.js';
import superpowerRoutes from './routes/superpowers.js';
import contactRoutes from './routes/contact.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.apiVersion = process.env.API_VERSION || 'v1';
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet({
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"]
                }
            }
        }));

        // CORS configuration
        const corsOptions = {
            origin: (origin, callback) => {
                const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: true,
            maxAge: 86400 // 24 hours
        };
        this.app.use(cors(corsOptions));

        // Body parsing middleware
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Compression middleware
        this.app.use(compression());

        // Logging middleware
        if (process.env.NODE_ENV !== 'test') {
            this.app.use(morgan('combined', {
                stream: {
                    write: (message) => logger.info(message.trim())
                }
            }));
        }

        // Rate limiting
        const limiter = rateLimit({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
            message: {
                error: 'Too many requests from this IP, please try again later.',
                retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
            },
            standardHeaders: true,
            legacyHeaders: false
        });
        this.app.use(limiter);

        // Serve static files
        this.app.use('/uploads', express.static(join(__dirname, '../uploads')));
    }

    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development'
            });
        });

        // API routes
        const apiPrefix = `/api/${this.apiVersion}`;
        
        this.app.use(`${apiPrefix}/auth`, authRoutes);
        this.app.use(`${apiPrefix}/users`, userRoutes);
        this.app.use(`${apiPrefix}/courses`, courseRoutes);
        this.app.use(`${apiPrefix}/organizations`, organizationRoutes);
        this.app.use(`${apiPrefix}/superpowers`, superpowerRoutes);
        this.app.use(`${apiPrefix}/contact`, contactRoutes);

        // API documentation route
        this.app.get(`${apiPrefix}/docs`, (req, res) => {
            res.json({
                title: 'H2EO LMS API Documentation',
                version: this.apiVersion,
                description: 'RESTful API for H2EO Learning Management System with Academic Superpowers™ integration',
                baseUrl: `${req.protocol}://${req.get('host')}${apiPrefix}`,
                endpoints: {
                    auth: `${apiPrefix}/auth`,
                    users: `${apiPrefix}/users`,
                    courses: `${apiPrefix}/courses`,
                    organizations: `${apiPrefix}/organizations`,
                    superpowers: `${apiPrefix}/superpowers`,
                    contact: `${apiPrefix}/contact`
                },
                documentation: 'https://docs.h2eo.org/api'
            });
        });
    }

    setupErrorHandling() {
        // 404 handler
        this.app.use(notFoundHandler);
        
        // Global error handler
        this.app.use(errorHandler);
    }

    async start() {
        try {
            // Connect to databases
            await connectDatabase();
            await connectRedis();

            // Start server
            this.server = this.app.listen(this.port, () => {
                logger.info(`🚀 H2EO LMS Server started on port ${this.port}`);
                logger.info(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
                logger.info(`🔗 API Base URL: http://localhost:${this.port}/api/${this.apiVersion}`);
                logger.info(`💊 Health Check: http://localhost:${this.port}/health`);
            });

            // Graceful shutdown handling
            this.setupGracefulShutdown();

        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    }

    setupGracefulShutdown() {
        const gracefulShutdown = (signal) => {
            logger.info(`Received ${signal}. Starting graceful shutdown...`);
            
            if (this.server) {
                this.server.close((err) => {
                    if (err) {
                        logger.error('Error during server shutdown:', err);
                        process.exit(1);
                    }
                    logger.info('Server closed successfully');
                    process.exit(0);
                });
            }
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });
    }

    getApp() {
        return this.app;
    }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const server = new Server();
    server.start();
}

export default Server;