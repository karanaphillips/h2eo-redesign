/**
 * Redis Configuration
 * Redis connection setup for caching and sessions
 */

import { createClient } from 'redis';
import logger from '../utils/logger.js';

let redisClient = null;

const connectRedis = async () => {
    try {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        
        const redisConfig = {
            url: redisUrl,
            retry_delayms: 100,
            retry_max_delay: 5000,
            max_attempts: 10,
            connect_timeout: 5000,
            command_timeout: 5000
        };

        // Add password if provided
        if (process.env.REDIS_PASSWORD) {
            redisConfig.password = process.env.REDIS_PASSWORD;
        }

        redisClient = createClient(redisConfig);

        // Error handling
        redisClient.on('error', (error) => {
            logger.error('❌ Redis connection error:', error);
        });

        redisClient.on('connect', () => {
            logger.info('🔗 Connecting to Redis...');
        });

        redisClient.on('ready', () => {
            logger.info('📦 Redis connected and ready');
        });

        redisClient.on('end', () => {
            logger.warn('⚠️ Redis connection ended');
        });

        redisClient.on('reconnecting', () => {
            logger.info('🔄 Redis reconnecting...');
        });

        // Connect to Redis
        await redisClient.connect();

        // Test connection
        await redisClient.ping();
        logger.info('✅ Redis connection test successful');

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                if (redisClient && redisClient.isOpen) {
                    await redisClient.quit();
                    logger.info('📦 Redis connection closed through app termination');
                }
            } catch (error) {
                logger.error('Error closing Redis connection:', error);
            }
        });

        return redisClient;

    } catch (error) {
        logger.error('Failed to connect to Redis:', error);
        logger.warn('⚠️ Redis is not available. Some features may be limited.');
        // Don't throw error - allow app to run without Redis
        return null;
    }
};

// Get Redis client instance
const getRedisClient = () => {
    return redisClient;
};

// Cache operations
const cacheOperations = {
    // Set cache with TTL
    set: async (key, value, ttlSeconds = 3600) => {
        try {
            if (!redisClient || !redisClient.isOpen) {
                logger.warn('Redis not available for SET operation');
                return false;
            }
            
            const serializedValue = JSON.stringify(value);
            await redisClient.setEx(key, ttlSeconds, serializedValue);
            return true;
        } catch (error) {
            logger.error('Redis SET error:', error);
            return false;
        }
    },

    // Get cache
    get: async (key) => {
        try {
            if (!redisClient || !redisClient.isOpen) {
                logger.warn('Redis not available for GET operation');
                return null;
            }
            
            const value = await redisClient.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            logger.error('Redis GET error:', error);
            return null;
        }
    },

    // Delete cache
    del: async (key) => {
        try {
            if (!redisClient || !redisClient.isOpen) {
                logger.warn('Redis not available for DEL operation');
                return false;
            }
            
            await redisClient.del(key);
            return true;
        } catch (error) {
            logger.error('Redis DEL error:', error);
            return false;
        }
    },

    // Check if key exists
    exists: async (key) => {
        try {
            if (!redisClient || !redisClient.isOpen) {
                return false;
            }
            
            const exists = await redisClient.exists(key);
            return exists === 1;
        } catch (error) {
            logger.error('Redis EXISTS error:', error);
            return false;
        }
    },

    // Set expiration
    expire: async (key, ttlSeconds) => {
        try {
            if (!redisClient || !redisClient.isOpen) {
                return false;
            }
            
            await redisClient.expire(key, ttlSeconds);
            return true;
        } catch (error) {
            logger.error('Redis EXPIRE error:', error);
            return false;
        }
    },

    // Get TTL
    ttl: async (key) => {
        try {
            if (!redisClient || !redisClient.isOpen) {
                return -1;
            }
            
            return await redisClient.ttl(key);
        } catch (error) {
            logger.error('Redis TTL error:', error);
            return -1;
        }
    }
};

// Redis health check
const checkRedisHealth = async () => {
    try {
        if (!redisClient || !redisClient.isOpen) {
            throw new Error('Redis client not connected');
        }

        await redisClient.ping();
        return { status: 'healthy', message: 'Redis connection is active' };
    } catch (error) {
        return { status: 'unhealthy', message: error.message };
    }
};

export { 
    connectRedis, 
    getRedisClient, 
    cacheOperations,
    checkRedisHealth 
};