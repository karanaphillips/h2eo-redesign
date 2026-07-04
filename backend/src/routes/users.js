/**
 * User Routes
 * Handles user profile management and statistics
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken, requireOwnershipOrAdmin } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/users/me/stats
 * @desc    Get current user's statistics
 * @access  Private
 */
router.get('/me/stats', async (req, res) => {
    try {
        const user = await User.findByUserId(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Mock statistics for now - in a real app, these would be calculated from course/assignment data
        const stats = {
            activeCourses: Math.floor(Math.random() * 8) + 2, // 2-10 courses
            pendingAssignments: Math.floor(Math.random() * 12) + 3, // 3-15 assignments
            completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
            learningStreak: Math.floor(Math.random() * 20) + 5, // 5-25 days
            totalHours: user.learningStats.totalHours,
            completedCourses: user.learningStats.completedCourses,
            currentStreak: user.learningStats.currentStreak,
            longestStreak: user.learningStats.longestStreak
        };

        res.json({
            success: true,
            data: { stats }
        });

    } catch (error) {
        logger.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching user statistics'
        });
    }
});

/**
 * @route   PUT /api/v1/users/me/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/me/profile', [
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
    body('displayName').optional().trim().isLength({ max: 100 }),
    body('phoneNumber').optional().matches(/^\+?[\d\s\-\(\)]+$/),
    body('timezone').optional().isString(),
    body('language').optional().isIn(['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ko'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const user = await User.findByUserId(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update allowed fields
        const allowedFields = ['firstName', 'lastName', 'displayName', 'phoneNumber', 'timezone', 'language'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    userId: user.userId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    displayName: user.displayName,
                    phoneNumber: user.phoneNumber,
                    timezone: user.timezone,
                    language: user.language
                }
            }
        });

    } catch (error) {
        logger.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating profile'
        });
    }
});

/**
 * @route   GET /api/v1/users/:userId
 * @desc    Get user by ID (admin only or own profile)
 * @access  Private
 */
router.get('/:userId', requireOwnershipOrAdmin('userId'), async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findByUserId(userId);
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
                    status: user.status,
                    organizations: user.organizations,
                    superpowerProfile: user.superpowerProfile,
                    learningStats: user.learningStats,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                }
            }
        });

    } catch (error) {
        logger.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching user'
        });
    }
});

export default router;