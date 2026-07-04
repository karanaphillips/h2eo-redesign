/**
 * Organization Routes
 * Handles organization management
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/organizations
 * @desc    Get available organizations for user
 * @access  Private
 */
router.get('/', async (req, res) => {
    try {
        // Mock organization data
        const organizations = [
            {
                id: '507f1f77bcf86cd799439011',
                name: 'Springfield University',
                type: 'university',
                description: 'Leading educational institution with over 100 years of excellence',
                website: 'https://springfield.edu',
                contactEmail: 'info@springfield.edu',
                settings: {
                    allowSelfRegistration: true,
                    requireEmailVerification: true,
                    defaultRole: 'student'
                },
                stats: {
                    totalStudents: 15000,
                    totalInstructors: 500,
                    totalCourses: 1200
                }
            },
            {
                id: '507f1f77bcf86cd799439012',
                name: 'TechCorp Learning Center',
                type: 'corporate',
                description: 'Corporate training and development platform',
                website: 'https://learning.techcorp.com',
                contactEmail: 'training@techcorp.com',
                settings: {
                    allowSelfRegistration: false,
                    requireEmailVerification: true,
                    defaultRole: 'student'
                },
                stats: {
                    totalStudents: 2500,
                    totalInstructors: 50,
                    totalCourses: 300
                }
            }
        ];

        res.json({
            success: true,
            data: {
                organizations,
                total: organizations.length
            }
        });

    } catch (error) {
        logger.error('Get organizations error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching organizations'
        });
    }
});

/**
 * @route   GET /api/v1/organizations/:id
 * @desc    Get organization details
 * @access  Private
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Mock organization detail
        const organization = {
            id,
            name: 'Springfield University',
            type: 'university',
            description: 'Leading educational institution with over 100 years of excellence in higher education',
            website: 'https://springfield.edu',
            contactEmail: 'info@springfield.edu',
            address: {
                street: '123 University Ave',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701',
                country: 'USA'
            },
            settings: {
                allowSelfRegistration: true,
                requireEmailVerification: true,
                defaultRole: 'student',
                academicYear: {
                    start: '2025-08-15',
                    end: '2026-05-30'
                }
            },
            stats: {
                totalStudents: 15000,
                totalInstructors: 500,
                totalCourses: 1200,
                totalDepartments: 25
            },
            departments: [
                { id: 'd1', name: 'Computer Science', studentCount: 2500 },
                { id: 'd2', name: 'Mathematics', studentCount: 1800 },
                { id: 'd3', name: 'English Literature', studentCount: 1200 },
                { id: 'd4', name: 'Business Administration', studentCount: 3000 }
            ]
        };

        res.json({
            success: true,
            data: { organization }
        });

    } catch (error) {
        logger.error('Get organization details error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching organization details'
        });
    }
});

export default router;