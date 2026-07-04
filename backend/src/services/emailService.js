/**
 * Email Service
 * Handles email sending for authentication and notifications
 */

import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    async initializeTransporter() {
        try {
            // Create SMTP transporter
            this.transporter = nodemailer.createTransporter({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // Verify connection
            await this.transporter.verify();
            logger.info('📧 Email service initialized successfully');

        } catch (error) {
            logger.error('Failed to initialize email service:', error);
            this.transporter = null;
        }
    }

    async sendEmail(to, subject, html, text = null) {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }

        const mailOptions = {
            from: `${process.env.FROM_NAME || 'H2EO LMS'} <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            html,
            text: text || this.htmlToText(html)
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent successfully to ${to}: ${subject}`);
            return result;
        } catch (error) {
            logger.error(`Failed to send email to ${to}:`, error);
            throw error;
        }
    }

    htmlToText(html) {
        // Simple HTML to text conversion
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    getEmailTemplate(templateName, variables = {}) {
        const templates = {
            welcome: {
                subject: 'Welcome to H2EO Platform! 🚀',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welcome to H2EO LMS</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; }
                            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 40px 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; }
                            .content { padding: 40px 30px; }
                            .btn { display: inline-block; background: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                            .btn:hover { background: #1e40af; }
                            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
                            .highlight { background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 20px; border-radius: 8px; margin: 20px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Welcome to H2EO Platform!</h1>
                                <p>Discover Your Academic Superpower</p>
                            </div>
                            <div class="content">
                                <p>Hello ${variables.firstName || 'Student'},</p>
                                
                                <p>Welcome to H2EO Platform! We're excited to have you join our community of learners who are discovering their unique Academic Superpowers™.</p>
                                
                                <div class="highlight">
                                    <h3>🦸‍♀️ Discover Your Academic Superpower</h3>
                                    <p>Take our assessment to discover whether you're a <strong>Brainiac</strong>, <strong>Creative Crusader</strong>, <strong>Mastermind</strong>, or <strong>Hands-on Hero</strong>!</p>
                                </div>
                                
                                <p>Here's what you can do next:</p>
                                <ul>
                                    <li>Complete your Academic Superpowers™ assessment</li>
                                    <li>Explore personalized learning paths</li>
                                    <li>Join your organization's courses</li>
                                    <li>Connect with your AI Learning Coach</li>
                                </ul>
                                
                                <a href="${variables.loginUrl || '#'}" class="btn">Access Your Dashboard</a>
                                
                                <p>If you have any questions, our support team is here to help. Simply reply to this email or visit our help center.</p>
                                
                                <p>Happy learning!<br>The H2EO Team</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2025 H2EO LMS. All rights reserved.</p>
                                <p>This email was sent to ${variables.email || 'you'} because you created an account with H2EO LMS.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            },
            passwordReset: {
                subject: 'Reset Your H2EO LMS Password',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Reset Your Password</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; }
                            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 40px 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; }
                            .content { padding: 40px 30px; }
                            .btn { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                            .btn:hover { background: #b91c1c; }
                            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
                            .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; }
                            .token-box { background: #f8fafc; padding: 16px; border-radius: 6px; font-family: monospace; word-break: break-all; margin: 20px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Password Reset Request</h1>
                                <p>H2EO LMS Account Security</p>
                            </div>
                            <div class="content">
                                <p>Hello ${variables.firstName || 'Student'},</p>
                                
                                <p>We received a request to reset the password for your H2EO LMS account. If you made this request, click the button below to reset your password:</p>
                                
                                <a href="${variables.resetUrl}" class="btn">Reset My Password</a>
                                
                                <p>Alternatively, you can copy and paste this link into your browser:</p>
                                <div class="token-box">${variables.resetUrl}</div>
                                
                                <div class="warning">
                                    <p><strong>Important Security Information:</strong></p>
                                    <ul>
                                        <li>This link will expire in 1 hour for security reasons</li>
                                        <li>If you didn't request this reset, please ignore this email</li>
                                        <li>Your password won't change until you create a new one</li>
                                    </ul>
                                </div>
                                
                                <p>If you're having trouble with the button above, contact our support team for assistance.</p>
                                
                                <p>Best regards,<br>The H2EO Security Team</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2025 H2EO LMS. All rights reserved.</p>
                                <p>For security reasons, this email was automatically generated and sent to ${variables.email || 'your email address'}.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            },
            emailVerification: {
                subject: 'Verify Your H2EO LMS Email Address',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verify Your Email</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; }
                            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 40px 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; }
                            .content { padding: 40px 30px; }
                            .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                            .btn:hover { background: #059669; }
                            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
                            .info { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Verify Your Email</h1>
                                <p>Complete Your H2EO LMS Registration</p>
                            </div>
                            <div class="content">
                                <p>Hello ${variables.firstName || 'Student'},</p>
                                
                                <p>Thank you for registering with H2EO LMS! To complete your registration and access all features, please verify your email address.</p>
                                
                                <a href="${variables.verificationUrl}" class="btn">Verify My Email</a>
                                
                                <div class="info">
                                    <p><strong>Why verify your email?</strong></p>
                                    <ul>
                                        <li>Secure your account and enable password recovery</li>
                                        <li>Receive important course notifications</li>
                                        <li>Access all H2EO LMS features</li>
                                    </ul>
                                </div>
                                
                                <p>This verification link will expire in 24 hours. If you need a new verification email, you can request one from your account settings.</p>
                                
                                <p>Welcome to the H2EO learning community!</p>
                                
                                <p>Best regards,<br>The H2EO Team</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2025 H2EO LMS. All rights reserved.</p>
                                <p>This email was sent to ${variables.email || 'your email address'} for account verification.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            }
        };

        return templates[templateName] || null;
    }
}

// Create singleton instance
const emailService = new EmailService();

// Export helper functions
export const sendWelcomeEmail = async (email, firstName) => {
    const template = emailService.getEmailTemplate('welcome', {
        firstName,
        email,
        loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/login`
    });

    if (!template) {
        throw new Error('Welcome email template not found');
    }

    return await emailService.sendEmail(email, template.subject, template.html);
};

export const sendPasswordResetEmail = async (email, firstName, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    
    const template = emailService.getEmailTemplate('passwordReset', {
        firstName,
        email,
        resetUrl,
        resetToken
    });

    if (!template) {
        throw new Error('Password reset email template not found');
    }

    return await emailService.sendEmail(email, template.subject, template.html);
};

export const sendEmailVerification = async (email, firstName, verificationToken) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify-email?token=${verificationToken}`;
    
    const template = emailService.getEmailTemplate('emailVerification', {
        firstName,
        email,
        verificationUrl,
        verificationToken
    });

    if (!template) {
        throw new Error('Email verification template not found');
    }

    return await emailService.sendEmail(email, template.subject, template.html);
};

export default emailService;