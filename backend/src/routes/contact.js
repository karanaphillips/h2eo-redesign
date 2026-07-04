/**
 * Contact Routes
 * Handles website contact form submissions and updates opt-in notifications
 */

import express from 'express';
import { body, validationResult } from 'express-validator';

import emailService from '../services/emailService.js';
import logger from '../utils/logger.js';

const router = express.Router();

const validateContactSubmission = [
    body('fullName')
        .trim()
        .isLength({ min: 1, max: 120 })
        .withMessage('Full name is required and must be less than 120 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('interest')
        .trim()
        .isLength({ min: 1, max: 120 })
        .withMessage('Interest is required'),
    body('message')
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Message is required and must be less than 5000 characters'),
    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 50 })
        .withMessage('Phone must be less than 50 characters'),
    body('timeline')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 120 })
        .withMessage('Timeline must be less than 120 characters'),
    body('newsletter')
        .optional()
        .isBoolean()
        .withMessage('Newsletter flag must be a boolean')
];

const validateAssessmentResultsSubmission = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('resultPayload')
        .isObject()
        .withMessage('A full assessment result payload is required'),
    body('source')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage('Source must be less than 200 characters')
];

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

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');

router.post('/inquiries', validateContactSubmission, handleValidationErrors, async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone = 'Not provided',
            interest,
            timeline = 'Not provided',
            message,
            newsletter = false,
            source = 'website'
        } = req.body;

        const supportRecipient = 'support@heretoeducateothers.com';
        const configuredRecipient = process.env.CONTACT_EMAIL ? String(process.env.CONTACT_EMAIL).trim() : '';
        const contactRecipients = Array.from(new Set([supportRecipient, configuredRecipient].filter(Boolean))).join(', ');
        const updatesRecipient = process.env.UPDATES_EMAIL || supportRecipient;

        const submissionPayload = {
            fullName,
            email,
            phone,
            interest,
            timeline,
            message,
            newsletter,
            source,
            submittedAt: new Date().toISOString()
        };
        const payloadText = JSON.stringify(submissionPayload, null, 2);

        const inquirySubject = `New H2EO inquiry: ${interest}`;
        const inquiryHtml = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Interest:</strong> ${escapeHtml(interest)}</p>
            <p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>
            <p><strong>Newsletter Opt-in:</strong> ${newsletter ? 'Yes' : 'No'}</p>
            <p><strong>Source:</strong> ${escapeHtml(source)}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            <hr>
            <p><strong>Full Submission Payload:</strong></p>
            <pre style="white-space: pre-wrap; font-family: monospace; background: #f8fafc; padding: 12px; border-radius: 6px;">${escapeHtml(payloadText)}</pre>
        `;

        await emailService.sendEmail(contactRecipients, inquirySubject, inquiryHtml, `New Contact Form Submission\n\n${payloadText}`);

        if (newsletter) {
            const updatesSubject = `Updates Opt-in: ${fullName}`;
            const updatesHtml = `
                <h2>H2EO Updates Opt-in</h2>
                <p>A contact requested to be added to updates.</p>
                <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Interest:</strong> ${escapeHtml(interest)}</p>
                <p><strong>Source:</strong> ${escapeHtml(source)}</p>
            `;

            await emailService.sendEmail(updatesRecipient, updatesSubject, updatesHtml);
        }

        return res.status(200).json({
            success: true,
            message: 'Contact submission received successfully'
        });
    } catch (error) {
        logger.error('Failed to process contact submission:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to process contact submission at this time'
        });
    }
});

router.post('/assessment-results', validateAssessmentResultsSubmission, handleValidationErrors, async (req, res) => {
    try {
        const {
            email,
            resultPayload,
            source = 'assessment-results'
        } = req.body;

        const contactRecipient = process.env.CONTACT_EMAIL || 'support@heretoeducateothers.com';
        const assessmentName = resultPayload?.name || resultPayload?.superpower || 'Assessment Result';

        const payloadText = JSON.stringify(resultPayload, null, 2);

        const subject = `Assessment signup + full results: ${assessmentName}`;
        const html = `
            <h2>Assessment Email Signup</h2>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Source:</strong> ${escapeHtml(source)}</p>
            <p><strong>Assessment Type:</strong> ${escapeHtml(resultPayload?.assessmentType || 'Unknown')}</p>
            <p><strong>Result:</strong> ${escapeHtml(assessmentName)}</p>
            <hr>
            <p><strong>Full Result Payload:</strong></p>
            <pre style="white-space: pre-wrap; font-family: monospace; background: #f8fafc; padding: 12px; border-radius: 6px;">${escapeHtml(payloadText)}</pre>
        `;

        await emailService.sendEmail(contactRecipient, subject, html, `Assessment Email Signup\nEmail: ${email}\nSource: ${source}\n\nFull Result Payload:\n${payloadText}`);

        return res.status(200).json({
            success: true,
            message: 'Assessment signup and results received successfully'
        });
    } catch (error) {
        logger.error('Failed to process assessment results submission:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to process assessment submission at this time'
        });
    }
});

export default router;
