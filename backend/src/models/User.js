/**
 * User Model
 * MongoDB schema for user accounts with Academic Superpowers integration
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

// Academic Superpower Profile Schema
const superpowerProfileSchema = new Schema({
    primarySuperpower: {
        type: String,
        enum: ['brainiac', 'crusader', 'mastermind', 'handson'],
        required: true
    },
    secondarySuperpower: {
        type: String,
        enum: ['brainiac', 'crusader', 'mastermind', 'handson'],
        default: null
    },
    assessmentScore: {
        brainiac: { type: Number, min: 0, max: 100, default: 0 },
        crusader: { type: Number, min: 0, max: 100, default: 0 },
        mastermind: { type: Number, min: 0, max: 100, default: 0 },
        handson: { type: Number, min: 0, max: 100, default: 0 }
    },
    learningPreferences: {
        visualLearning: { type: Number, min: 0, max: 10, default: 5 },
        auditoryLearning: { type: Number, min: 0, max: 10, default: 5 },
        kinestheticLearning: { type: Number, min: 0, max: 10, default: 5 },
        readingWriting: { type: Number, min: 0, max: 10, default: 5 }
    },
    assessmentDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
});

// Organization Schema (embedded)
const organizationSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin', 'super_admin'],
        default: 'student'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    }
}, {
    _id: false
});

// User Schema
const userSchema = new Schema({
    // Basic Information
    userId: {
        type: String,
        unique: true,
        default: () => uuidv4(),
        index: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't include password in queries by default
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    displayName: {
        type: String,
        trim: true,
        maxlength: [100, 'Display name cannot exceed 100 characters']
    },

    // Profile Information
    avatarUrl: {
        type: String,
        default: null
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    phoneNumber: {
        type: String,
        default: null,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    timezone: {
        type: String,
        default: 'UTC'
    },
    language: {
        type: String,
        default: 'en',
        enum: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ko']
    },

    // Academic Superpowers Integration
    superpowerProfile: {
        type: superpowerProfileSchema,
        default: null
    },

    // Organization Memberships
    organizations: [organizationSchema],
    
    // Current primary organization (for login context)
    primaryOrganization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        default: null
    },

    // Account Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'deleted'],
        default: 'active'
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null,
        select: false
    },
    emailVerificationExpires: {
        type: Date,
        default: null,
        select: false
    },

    // Password Reset
    passwordResetToken: {
        type: String,
        default: null,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        default: null,
        select: false
    },

    // Security
    lastLogin: {
        type: Date,
        default: null
    },
    lastPasswordChange: {
        type: Date,
        default: Date.now
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String,
        default: null,
        select: false
    },

    // Social Login
    googleId: {
        type: String,
        default: null,
        sparse: true
    },
    microsoftId: {
        type: String,
        default: null,
        sparse: true
    },
    appleId: {
        type: String,
        default: null,
        sparse: true
    },

    // Learning Analytics
    learningStats: {
        totalCourses: { type: Number, default: 0 },
        completedCourses: { type: Number, default: 0 },
        totalHours: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastActivityDate: { type: Date, default: null }
    },

    // Preferences
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false }
        },
        privacy: {
            profileVisibility: {
                type: String,
                enum: ['public', 'organization', 'private'],
                default: 'organization'
            },
            showOnlineStatus: { type: Boolean, default: true },
            allowDirectMessages: { type: Boolean, default: true }
        },
        learning: {
            defaultDifficulty: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced'],
                default: 'intermediate'
            },
            autoplay: { type: Boolean, default: false },
            subtitles: { type: Boolean, default: false }
        }
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.passwordResetToken;
            delete ret.passwordResetExpires;
            delete ret.emailVerificationToken;
            delete ret.emailVerificationExpires;
            delete ret.twoFactorSecret;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });
userSchema.index({ 'organizations.id': 1 });
userSchema.index({ primaryOrganization: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`.trim();
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash password if it's modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        
        // Update password change timestamp
        this.lastPasswordChange = new Date();
        
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to set display name
userSchema.pre('save', function(next) {
    if (!this.displayName) {
        this.displayName = this.fullName;
    }
    next();
});

// Instance Methods

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Generate JWT tokens
userSchema.methods.generateTokens = function() {
    const payload = {
        userId: this.userId,
        email: this.email,
        role: this.getHighestRole(),
        organizationId: this.primaryOrganization
    };

    const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { 
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
            issuer: 'h2eo-lms',
            audience: 'h2eo-users'
        }
    );

    const refreshToken = jwt.sign(
        { userId: this.userId },
        process.env.JWT_REFRESH_SECRET,
        { 
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
            issuer: 'h2eo-lms',
            audience: 'h2eo-users'
        }
    );

    return { accessToken, refreshToken };
};

// Get highest role across organizations
userSchema.methods.getHighestRole = function() {
    if (!this.organizations || this.organizations.length === 0) {
        return 'student';
    }

    const roleHierarchy = {
        'student': 1,
        'instructor': 2,
        'admin': 3,
        'super_admin': 4
    };

    return this.organizations.reduce((highest, org) => {
        const currentLevel = roleHierarchy[org.role] || 0;
        const highestLevel = roleHierarchy[highest] || 0;
        return currentLevel > highestLevel ? org.role : highest;
    }, 'student');
};

// Get role for specific organization
userSchema.methods.getRoleForOrganization = function(organizationId) {
    const membership = this.organizations.find(
        org => org.id.toString() === organizationId.toString()
    );
    return membership ? membership.role : null;
};

// Check if user has permission
userSchema.methods.hasPermission = function(permission, organizationId = null) {
    const role = organizationId 
        ? this.getRoleForOrganization(organizationId)
        : this.getHighestRole();

    const permissions = {
        'student': ['read_courses', 'submit_assignments', 'view_grades'],
        'instructor': ['create_courses', 'grade_assignments', 'manage_students'],
        'admin': ['manage_organization', 'manage_users', 'view_analytics'],
        'super_admin': ['manage_system', 'manage_all_organizations']
    };

    const rolePermissions = permissions[role] || [];
    const inheritedPermissions = this.getInheritedPermissions(role);
    
    return [...rolePermissions, ...inheritedPermissions].includes(permission);
};

// Get inherited permissions based on role hierarchy
userSchema.methods.getInheritedPermissions = function(role) {
    const hierarchy = {
        'instructor': ['read_courses', 'submit_assignments', 'view_grades'],
        'admin': ['create_courses', 'grade_assignments', 'manage_students', 'read_courses', 'submit_assignments', 'view_grades'],
        'super_admin': ['manage_organization', 'manage_users', 'view_analytics', 'create_courses', 'grade_assignments', 'manage_students', 'read_courses', 'submit_assignments', 'view_grades']
    };

    return hierarchy[role] || [];
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
    const resetToken = uuidv4();
    
    // Hash token before saving
    this.passwordResetToken = bcrypt.hashSync(resetToken, 10);
    this.passwordResetExpires = new Date(Date.now() + (parseInt(process.env.PASSWORD_RESET_EXPIRES) || 3600000)); // 1 hour
    
    return resetToken;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
    const verificationToken = uuidv4();
    
    // Hash token before saving
    this.emailVerificationToken = bcrypt.hashSync(verificationToken, 10);
    this.emailVerificationExpires = new Date(Date.now() + (parseInt(process.env.EMAIL_VERIFICATION_EXPIRES) || 86400000)); // 24 hours
    
    return verificationToken;
};

// Handle failed login attempts
userSchema.methods.incLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Check if we need to lock account (after 5 attempts)
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + (2 * 60 * 60 * 1000) }; // Lock for 2 hours
    }
    
    return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

// Update last login
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

// Static Methods

// Find by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Find by user ID
userSchema.statics.findByUserId = function(userId) {
    return this.findOne({ userId });
};

// Find by reset token
userSchema.statics.findByPasswordResetToken = function(token) {
    return this.findOne({
        passwordResetToken: { $exists: true },
        passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken');
};

// Find by verification token
userSchema.statics.findByEmailVerificationToken = function(token) {
    return this.findOne({
        emailVerificationToken: { $exists: true },
        emailVerificationExpires: { $gt: Date.now() }
    }).select('+emailVerificationToken');
};

const User = mongoose.model('User', userSchema);

export default User;