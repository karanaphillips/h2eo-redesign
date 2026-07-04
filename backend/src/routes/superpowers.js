/**
 * Academic Superpowers Routes
 * Handles superpower assessments and profiles
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/superpowers/assessment
 * @desc    Get superpower assessment questions
 * @access  Private
 */
router.get('/assessment', async (req, res) => {
    try {
        // Mock assessment questions based on Academic Superpowers framework
        const assessment = {
            title: 'Discover Your Academic Superpower',
            description: 'Answer these questions to discover whether you\'re a Brainiac, Creative Crusader, Mastermind, or Hands-on Hero!',
            estimatedTime: '10-15 minutes',
            questions: [
                {
                    id: 1,
                    category: 'learning_style',
                    question: 'When learning something new, you prefer to:',
                    type: 'single_choice',
                    options: [
                        { id: 'a', text: 'Read detailed explanations and research thoroughly', superpower: 'brainiac', weight: 3 },
                        { id: 'b', text: 'Create visual diagrams or mind maps', superpower: 'crusader', weight: 3 },
                        { id: 'c', text: 'Break it down into logical steps and systems', superpower: 'mastermind', weight: 3 },
                        { id: 'd', text: 'Jump in and learn by doing', superpower: 'handson', weight: 3 }
                    ]
                },
                {
                    id: 2,
                    category: 'problem_solving',
                    question: 'When faced with a complex problem, your first instinct is to:',
                    type: 'single_choice',
                    options: [
                        { id: 'a', text: 'Research similar problems and gather all available information', superpower: 'brainiac', weight: 3 },
                        { id: 'b', text: 'Brainstorm creative and unconventional solutions', superpower: 'crusader', weight: 3 },
                        { id: 'c', text: 'Analyze the problem systematically and plan your approach', superpower: 'mastermind', weight: 3 },
                        { id: 'd', text: 'Start experimenting with different approaches', superpower: 'handson', weight: 3 }
                    ]
                },
                {
                    id: 3,
                    category: 'work_environment',
                    question: 'Your ideal study/work environment includes:',
                    type: 'single_choice',
                    options: [
                        { id: 'a', text: 'A quiet library with access to lots of resources', superpower: 'brainiac', weight: 2 },
                        { id: 'b', text: 'A colorful, inspiring space with art and music', superpower: 'crusader', weight: 2 },
                        { id: 'c', text: 'An organized, clutter-free workspace with clear systems', superpower: 'mastermind', weight: 2 },
                        { id: 'd', text: 'A hands-on lab or workshop with tools and materials', superpower: 'handson', weight: 2 }
                    ]
                },
                {
                    id: 4,
                    category: 'collaboration',
                    question: 'In group projects, you typically:',
                    type: 'single_choice',
                    options: [
                        { id: 'a', text: 'Become the researcher, providing detailed information and analysis', superpower: 'brainiac', weight: 2 },
                        { id: 'b', text: 'Generate creative ideas and help with presentation design', superpower: 'crusader', weight: 2 },
                        { id: 'c', text: 'Take charge of planning, organizing, and coordinating tasks', superpower: 'mastermind', weight: 2 },
                        { id: 'd', text: 'Handle the practical implementation and hands-on work', superpower: 'handson', weight: 2 }
                    ]
                },
                {
                    id: 5,
                    category: 'motivation',
                    question: 'You feel most motivated when:',
                    type: 'single_choice',
                    options: [
                        { id: 'a', text: 'You can dive deep into a subject and become an expert', superpower: 'brainiac', weight: 3 },
                        { id: 'b', text: 'You can express yourself creatively and think outside the box', superpower: 'crusader', weight: 3 },
                        { id: 'c', text: 'You can organize and optimize processes for better results', superpower: 'mastermind', weight: 3 },
                        { id: 'd', text: 'You can build, create, or fix something tangible', superpower: 'handson', weight: 3 }
                    ]
                },
                {
                    id: 6,
                    category: 'strengths',
                    question: 'Which of these describes your greatest strength?',
                    type: 'multiple_choice',
                    maxSelections: 2,
                    options: [
                        { id: 'a', text: 'Analytical thinking and attention to detail', superpower: 'brainiac', weight: 2 },
                        { id: 'b', text: 'Creative problem-solving and innovation', superpower: 'crusader', weight: 2 },
                        { id: 'c', text: 'Strategic planning and organization', superpower: 'mastermind', weight: 2 },
                        { id: 'd', text: 'Practical application and implementation', superpower: 'handson', weight: 2 },
                        { id: 'e', text: 'Communication and presentation skills', superpower: 'crusader', weight: 1 },
                        { id: 'f', text: 'Leadership and team coordination', superpower: 'mastermind', weight: 1 }
                    ]
                }
            ]
        };

        res.json({
            success: true,
            data: { assessment }
        });

    } catch (error) {
        logger.error('Get assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching assessment'
        });
    }
});

/**
 * @route   POST /api/v1/superpowers/assessment/submit
 * @desc    Submit superpower assessment and calculate results
 * @access  Private
 */
router.post('/assessment/submit', [
    body('answers').isArray().withMessage('Answers must be an array'),
    body('answers.*.questionId').isInt().withMessage('Question ID must be an integer'),
    body('answers.*.selectedOptions').isArray().withMessage('Selected options must be an array')
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

        const { answers } = req.body;

        // Calculate superpower scores
        const scores = {
            brainiac: 0,
            crusader: 0,
            mastermind: 0,
            handson: 0
        };

        // Process answers and calculate scores
        answers.forEach(answer => {
            answer.selectedOptions.forEach(optionId => {
                // In a real implementation, you would look up the option weights
                // For this mock, we'll simulate scoring
                const mockWeights = {
                    'a': { superpower: 'brainiac', weight: 2 },
                    'b': { superpower: 'crusader', weight: 2 },
                    'c': { superpower: 'mastermind', weight: 2 },
                    'd': { superpower: 'handson', weight: 2 }
                };

                const option = mockWeights[optionId];
                if (option) {
                    scores[option.superpower] += option.weight;
                }
            });
        });

        // Normalize scores to percentages
        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
        const normalizedScores = {};
        Object.keys(scores).forEach(key => {
            normalizedScores[key] = Math.round((scores[key] / totalScore) * 100);
        });

        // Determine primary and secondary superpowers
        const sortedSuperpowers = Object.entries(normalizedScores)
            .sort(([,a], [,b]) => b - a);

        const primarySuperpower = sortedSuperpowers[0][0];
        const secondarySuperpower = sortedSuperpowers[1][0];

        // Create superpower profile
        const superpowerProfile = {
            primarySuperpower,
            secondarySuperpower,
            assessmentScore: normalizedScores,
            learningPreferences: {
                visualLearning: primarySuperpower === 'crusader' ? 9 : Math.floor(Math.random() * 5) + 3,
                auditoryLearning: primarySuperpower === 'brainiac' ? 8 : Math.floor(Math.random() * 5) + 3,
                kinestheticLearning: primarySuperpower === 'handson' ? 9 : Math.floor(Math.random() * 5) + 3,
                readingWriting: primarySuperpower === 'mastermind' ? 8 : Math.floor(Math.random() * 5) + 3
            },
            assessmentDate: new Date(),
            lastUpdated: new Date()
        };

        // Update user's superpower profile
        const user = await User.findByUserId(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.superpowerProfile = superpowerProfile;
        await user.save();

        // Get superpower details for response
        const superpowerDetails = {
            brainiac: {
                name: 'The Brainiac',
                description: 'You love diving deep into subjects, analyzing information, and building comprehensive understanding.',
                strengths: ['Analytical thinking', 'Research skills', 'Attention to detail', 'Critical analysis'],
                learningTips: ['Take detailed notes', 'Seek out additional resources', 'Ask probing questions', 'Connect concepts across subjects']
            },
            crusader: {
                name: 'Creative Crusader',
                description: 'You thrive on creativity, innovation, and expressing ideas in unique and artistic ways.',
                strengths: ['Creative thinking', 'Visual communication', 'Innovation', 'Artistic expression'],
                learningTips: ['Use visual aids and diagrams', 'Incorporate creative projects', 'Brainstorm freely', 'Connect learning to real-world applications']
            },
            mastermind: {
                name: 'The Mastermind',
                description: 'You excel at organizing, planning, and creating systematic approaches to learning and problem-solving.',
                strengths: ['Strategic planning', 'Organization', 'Leadership', 'Systems thinking'],
                learningTips: ['Create study schedules', 'Use organizational tools', 'Break down complex topics', 'Set clear goals and milestones']
            },
            handson: {
                name: 'Hands-on Hero',
                description: 'You learn best through practical application, experimentation, and real-world experience.',
                strengths: ['Practical application', 'Experimentation', 'Problem-solving', 'Implementation'],
                learningTips: ['Engage in hands-on activities', 'Practice immediately', 'Use real-world examples', 'Learn through trial and error']
            }
        };

        logger.info(`Superpower assessment completed for user ${user.userId}: ${primarySuperpower}`);

        res.json({
            success: true,
            message: 'Assessment completed successfully!',
            data: {
                superpowerProfile,
                primaryDetails: superpowerDetails[primarySuperpower],
                secondaryDetails: superpowerDetails[secondarySuperpower],
                allScores: normalizedScores
            }
        });

    } catch (error) {
        logger.error('Submit assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while processing assessment'
        });
    }
});

/**
 * @route   GET /api/v1/superpowers/profile
 * @desc    Get user's current superpower profile
 * @access  Private
 */
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findByUserId(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.superpowerProfile) {
            return res.json({
                success: true,
                message: 'No superpower profile found. Please take the assessment.',
                data: { hasProfile: false }
            });
        }

        res.json({
            success: true,
            data: {
                hasProfile: true,
                superpowerProfile: user.superpowerProfile
            }
        });

    } catch (error) {
        logger.error('Get superpower profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching superpower profile'
        });
    }
});

export default router;