/**
 * Authentication Routes
 * Handles user login, registration, password reset, and token management
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/User.js';
import { cacheOperations } from '../config/redis.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_REQUESTS) || 5,
    message: {
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: Math.ceil((parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for refresh token endpoint
        return req.path === '/refresh';
    }
});

// Apply rate limiting to auth routes
router.use(authLimiter);

// Validation middleware
const validateRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('firstName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name is required and must be less than 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name is required and must be less than 50 characters'),
    body('organizationId')
        .isMongoId()
        .withMessage('Please provide a valid organization ID')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const validatePasswordReset = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
];

const validatePasswordResetConfirm = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, handleValidationErrors, async (req, res) => {
    try {
        const { email, password, firstName, lastName, organizationId, role = 'student' } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // TODO: Validate organization exists and user has permission to join
        // This would typically check against an Organization model

        // Create new user
        const user = new User({
            email,
            password,
            firstName,
            lastName,
            organizations: [{
                id: organizationId,
                name: 'Organization Name', // This would be fetched from Organization model
                role: role,
                status: 'active'
            }],
            primaryOrganization: organizationId
        });

        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = user.generateTokens();

        // Store refresh token in cache
        await cacheOperations.set(
            `refresh_token:${user.userId}`,
            refreshToken,
            7 * 24 * 60 * 60 // 7 days
        );

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.firstName);
        } catch (emailError) {
            logger.error('Failed to send welcome email:', emailError);
            // Don't fail registration if email fails
        }

        // Log successful registration
        logger.info(`New user registered: ${user.email} (${user.userId})`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    userId: user.userId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    role: user.getHighestRole(),
                    organizations: user.organizations,
                    emailVerified: user.emailVerified
                },
                tokens: {
                    accessToken,
                    refreshToken,
                    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
                }
            }
        });

    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
    try {
        const { email, password, organizationId, rememberMe = false } = req.body;

        // Find user with password field
        const user = await User.findByEmail(email).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to too many failed login attempts'
            });
        }

        // Check if account is active
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Account is not active. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            // Increment login attempts
            await user.incLoginAttempts();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Validate organization membership if specified
        if (organizationId) {
            const hasAccess = user.organizations.some(
                org => org.id.toString() === organizationId && org.status === 'active'
            );
            
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have access to this organization'
                });
            }

            // Update primary organization
            user.primaryOrganization = organizationId;
        }

        // Reset login attempts and update last login
        await user.resetLoginAttempts();
        await user.updateLastLogin();

        // Generate tokens
        const { accessToken, refreshToken } = user.generateTokens();

        // Store refresh token in cache with appropriate TTL
        const refreshTTL = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days
        await cacheOperations.set(
            `refresh_token:${user.userId}`,
            refreshToken,
            refreshTTL
        );

        // Log successful login
        logger.info(`User login: ${user.email} (${user.userId}) from ${req.ip}`);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    userId: user.userId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    avatarUrl: user.avatarUrl,
                    role: user.getHighestRole(),
                    organizations: user.organizations,
                    primaryOrganization: user.primaryOrganization,
                    superpowerProfile: user.superpowerProfile,
                    preferences: user.preferences,
                    lastLogin: user.lastLogin
                },
                tokens: {
                    accessToken,
                    refreshToken,
                    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
                }
            }
        });

    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Private
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }

        // Check if refresh token exists in cache
        const cachedToken = await cacheOperations.get(`refresh_token:${decoded.userId}`);
        if (!cachedToken || cachedToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token not found or revoked'
            });
        }

        // Find user
        const user = await User.findByUserId(decoded.userId);
        if (!user || user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'User not found or account inactive'
            });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = user.generateTokens();

        // Update refresh token in cache
        const ttl = await cacheOperations.ttl(`refresh_token:${decoded.userId}`);
        await cacheOperations.set(
            `refresh_token:${user.userId}`,
            newRefreshToken,
            ttl > 0 ? ttl : 7 * 24 * 60 * 60
        );

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                tokens: {
                    accessToken,
                    refreshToken: newRefreshToken,
                    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
                }
            }
        });

    } catch (error) {
        logger.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during token refresh'
        });
    }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate tokens
 * @access  Private
 */
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;

        // Remove refresh token from cache
        await cacheOperations.del(`refresh_token:${userId}`);

        // TODO: Add access token to blacklist cache
        // This would prevent the use of the current access token

        logger.info(`User logout: ${req.user.email} (${userId})`);

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during logout'
        });
    }
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', validatePasswordReset, handleValidationErrors, async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            // Don't reveal that email doesn't exist
            return res.json({
                success: true,
                message: 'If an account with this email exists, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, user.firstName, resetToken);
            
            logger.info(`Password reset requested for: ${user.email} (${user.userId})`);
            
            res.json({
                success: true,
                message: 'If an account with this email exists, a password reset link has been sent.'
            });
        } catch (emailError) {
            logger.error('Failed to send password reset email:', emailError);
            
            // Clear the reset token if email fails
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            
            res.status(500).json({
                success: false,
                message: 'Failed to send password reset email. Please try again.'
            });
        }

    } catch (error) {
        logger.error('Password reset request error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during password reset request'
        });
    }
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password', validatePasswordResetConfirm, handleValidationErrors, async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user with valid reset token
        const user = await User.findByPasswordResetToken(token);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset token'
            });
        }

        // Verify the token
        const isTokenValid = await bcrypt.compare(token, user.passwordResetToken);
        if (!isTokenValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset token'
            });
        }

        // Update password
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.lastPasswordChange = new Date();
        
        await user.save();

        // Invalidate all existing refresh tokens
        await cacheOperations.del(`refresh_token:${user.userId}`);

        logger.info(`Password reset completed for: ${user.email} (${user.userId})`);

        res.json({
            success: true,
            message: 'Password has been reset successfully. Please log in with your new password.'
        });

    } catch (error) {
        logger.error('Password reset confirmation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during password reset'
        });
    }
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByUserId(req.user.userId)
            .populate('primaryOrganization', 'name type settings');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    userId: user.userId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    displayName: user.displayName,
                    avatarUrl: user.avatarUrl,
                    dateOfBirth: user.dateOfBirth,
                    phoneNumber: user.phoneNumber,
                    timezone: user.timezone,
                    language: user.language,
                    superpowerProfile: user.superpowerProfile,
                    organizations: user.organizations,
                    primaryOrganization: user.primaryOrganization,
                    status: user.status,
                    emailVerified: user.emailVerified,
                    lastLogin: user.lastLogin,
                    learningStats: user.learningStats,
                    preferences: user.preferences,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });

    } catch (error) {
        logger.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching user profile'
        });
    }
});

/**
 * @route   POST /api/v1/auth/verify-token
 * @desc    Verify if token is valid
 * @access  Private
 */
router.post('/verify-token', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid',
        data: {
            user: {
                userId: req.user.userId,
                email: req.user.email,
                role: req.user.role,
                organizationId: req.user.organizationId
            }
        }
    });
});

export default router;