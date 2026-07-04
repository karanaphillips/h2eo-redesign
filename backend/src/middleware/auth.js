/**
 * Authentication Middleware
 * JWT token verification and user authorization
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { cacheOperations } from '../config/redis.js';
import logger from '../utils/logger.js';

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Access token has expired',
                    code: 'TOKEN_EXPIRED'
                });
            }
            
            return res.status(401).json({
                success: false,
                message: 'Invalid access token'
            });
        }

        // TODO: Check if token is blacklisted (for logout)
        // const isBlacklisted = await cacheOperations.exists(`blacklist_token:${token}`);
        // if (isBlacklisted) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Token has been revoked'
        //     });
        // }

        // Verify user still exists and is active
        const user = await User.findByUserId(decoded.userId);
        if (!user || user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'User not found or account inactive'
            });
        }

        // Check if password has been changed after token was issued
        if (user.lastPasswordChange && decoded.iat * 1000 < user.lastPasswordChange.getTime()) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid due to password change',
                code: 'PASSWORD_CHANGED'
            });
        }

        // Add user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            organizationId: decoded.organizationId,
            userData: user
        };

        next();

    } catch (error) {
        logger.error('Authentication middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userRole = req.user.role;
        const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions. Required role(s): ' + allowedRoles.join(', ')
            });
        }

        next();
    };
};

/**
 * Middleware to check if user has specific permission
 */
export const requirePermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        try {
            const user = req.user.userData;
            const organizationId = req.params.organizationId || req.user.organizationId;

            const hasPermission = user.hasPermission(permission, organizationId);

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: `Permission denied. Required permission: ${permission}`
                });
            }

            next();

        } catch (error) {
            logger.error('Permission check error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during permission check'
            });
        }
    };
};

/**
 * Middleware to check organization membership
 */
export const requireOrganizationAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    const requestedOrgId = req.params.organizationId || req.body.organizationId;
    const user = req.user.userData;

    if (!requestedOrgId) {
        return res.status(400).json({
            success: false,
            message: 'Organization ID is required'
        });
    }

    // Check if user has access to the organization
    const hasAccess = user.organizations.some(
        org => org.id.toString() === requestedOrgId && org.status === 'active'
    );

    if (!hasAccess) {
        return res.status(403).json({
            success: false,
            message: 'Access denied to this organization'
        });
    }

    // Add organization role to request
    const orgMembership = user.organizations.find(
        org => org.id.toString() === requestedOrgId
    );
    req.organizationRole = orgMembership.role;

    next();
};

/**
 * Middleware to check if user owns the resource or has admin access
 */
export const requireOwnershipOrAdmin = (userIdField = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const resourceUserId = req.params[userIdField] || req.body[userIdField];
        const currentUserId = req.user.userId;
        const userRole = req.user.role;

        // Allow if user owns the resource
        if (resourceUserId === currentUserId) {
            return next();
        }

        // Allow if user has admin privileges
        if (['admin', 'super_admin'].includes(userRole)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own resources or need admin privileges.'
        });
    };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(); // Continue without authentication
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            const user = await User.findByUserId(decoded.userId);

            if (user && user.status === 'active') {
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email,
                    role: decoded.role,
                    organizationId: decoded.organizationId,
                    userData: user
                };
            }
        } catch (error) {
            // Token is invalid, but we continue without authentication
            logger.debug('Optional auth failed:', error.message);
        }

        next();

    } catch (error) {
        logger.error('Optional auth middleware error:', error);
        next(); // Continue even if there's an error
    }
};

/**
 * Middleware to extract organization context from various sources
 */
export const extractOrganizationContext = (req, res, next) => {
    // Try to get organization ID from various sources
    const orgId = req.params.organizationId || 
                  req.headers['x-organization-id'] || 
                  req.query.organizationId ||
                  (req.user && req.user.organizationId);

    if (orgId) {
        req.organizationId = orgId;
        
        // If user is authenticated, verify they have access to this organization
        if (req.user) {
            const user = req.user.userData;
            const hasAccess = user.organizations.some(
                org => org.id.toString() === orgId && org.status === 'active'
            );

            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied to this organization'
                });
            }

            // Set organization-specific role
            const orgMembership = user.organizations.find(
                org => org.id.toString() === orgId
            );
            req.organizationRole = orgMembership ? orgMembership.role : null;
        }
    }

    next();
};