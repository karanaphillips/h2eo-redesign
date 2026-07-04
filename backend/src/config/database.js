/**
 * Database Configuration
 * MongoDB connection setup with Mongoose
 */

import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDatabase = async () => {
    try {
        const mongoUri = process.env.NODE_ENV === 'test' 
            ? process.env.MONGODB_TEST_URI 
            : process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MongoDB URI not provided in environment variables');
        }

        const options = {
            // Connection options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0,
            
            // Authentication options
            authSource: 'admin',
            
            // Replica set options
            readPreference: 'primary',
            
            // Other options
            maxIdleTimeMS: 30000,
            connectTimeoutMS: 10000,
        };

        // Connect to MongoDB
        await mongoose.connect(mongoUri, options);

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            logger.info('📦 MongoDB connected successfully');
        });

        mongoose.connection.on('error', (error) => {
            logger.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('⚠️ MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                logger.info('📦 MongoDB connection closed through app termination');
            } catch (error) {
                logger.error('Error closing MongoDB connection:', error);
            }
        });

        return mongoose.connection;

    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};

// Database health check
const checkDatabaseHealth = async () => {
    try {
        const isConnected = mongoose.connection.readyState === 1;
        if (!isConnected) {
            throw new Error('Database not connected');
        }

        // Simple ping to check connection
        await mongoose.connection.db.admin().ping();
        return { status: 'healthy', message: 'Database connection is active' };
    } catch (error) {
        return { status: 'unhealthy', message: error.message };
    }
};

export { connectDatabase, checkDatabaseHealth };