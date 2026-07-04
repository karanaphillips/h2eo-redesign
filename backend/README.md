# H2EO LMS Backend API

A comprehensive backend API for the H2EO Learning Management System with Academic Superpowers integration.

## Features

- 🔐 **JWT Authentication** - Secure login/logout with access and refresh tokens
- 👥 **Multi-Organization Support** - Users can belong to multiple organizations with different roles
- 🦸‍♀️ **Academic Superpowers Integration** - Personalized learning based on superpower profiles
- 📧 **Email Services** - Welcome emails, password reset, and notifications
- 🔒 **Role-Based Access Control** - Fine-grained permissions system
- 📊 **Learning Analytics** - Track user progress and statistics
- 🚀 **Performance Optimized** - Redis caching and rate limiting
- 🛡️ **Security First** - Helmet, CORS, input validation, and security best practices

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 4.4+
- Redis 6+ (optional, for caching)
- SMTP server (for emails)

### Installation

1. **Clone and setup**
   ```bash
   cd h2eo/backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Configuration

### Required Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/h2eo_lms

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_ACCESS_SECRET=your-super-secure-access-token-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-token-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=support@heretoeducateothers.com
CONTACT_EMAIL=support@heretoeducateothers.com
UPDATES_EMAIL=support@heretoeducateothers.com
```

### Optional Variables

```env
# Redis (for caching)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:3001

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX_REQUESTS=5
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/me` - Get current user profile

### Users
- `GET /api/v1/users/me/stats` - Get user statistics
- `PUT /api/v1/users/me/profile` - Update user profile
- `GET /api/v1/users/:userId` - Get user by ID

### Courses
- `GET /api/v1/courses/my-courses` - Get enrolled courses
- `GET /api/v1/courses/:courseId` - Get course details

### Organizations
- `GET /api/v1/organizations` - Get available organizations
- `GET /api/v1/organizations/:id` - Get organization details

### Academic Superpowers
- `GET /api/v1/superpowers/assessment` - Get assessment questions
- `POST /api/v1/superpowers/assessment/submit` - Submit assessment
- `GET /api/v1/superpowers/profile` - Get superpower profile

### Contact
- `POST /api/v1/contact/inquiries` - Submit website contact form (sends main inquiry email, plus separate updates email when opted in)
- `POST /api/v1/contact/assessment-results` - Submit assessment email signup and send full assessment results to support

## Academic Superpowers Framework

The system integrates four learning superpowers:

### 🧠 The Brainiac
- **Strengths**: Analytical thinking, research, attention to detail
- **Learning Style**: Deep-dive research, comprehensive analysis
- **Preferences**: Quiet study spaces, detailed resources

### 🎨 Creative Crusader  
- **Strengths**: Creative thinking, visual communication, innovation
- **Learning Style**: Visual aids, creative projects, brainstorming
- **Preferences**: Inspiring environments, artistic expression

### ♟️ The Mastermind
- **Strengths**: Strategic planning, organization, systems thinking
- **Learning Style**: Structured approach, clear goals, systematic learning
- **Preferences**: Organized spaces, planning tools

### 🔧 Hands-on Hero
- **Strengths**: Practical application, experimentation, implementation
- **Learning Style**: Learning by doing, trial and error, real-world practice
- **Preferences**: Lab environments, hands-on activities

## Authentication Flow

### Registration
```javascript
POST /api/v1/auth/register
{
  "email": "student@university.edu",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": "507f1f77bcf86cd799439011"
}
```

### Login
```javascript
POST /api/v1/auth/login
{
  "email": "student@university.edu", 
  "password": "SecurePass123!",
  "organizationId": "507f1f77bcf86cd799439011",
  "rememberMe": true
}
```

### Token Refresh
```javascript
POST /api/v1/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Security Features

- **JWT Tokens**: Access (15min) and refresh (7 days) tokens
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Configurable limits for API endpoints
- **Account Locking**: Automatic lockout after failed attempts
- **Input Validation**: Comprehensive validation with Joi
- **CORS Protection**: Configurable origin restrictions
- **Helmet Security**: Security headers and protections

## Development

### Scripts
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Project Structure
```
src/
├── config/          # Database and Redis configuration
├── middleware/      # Authentication and error handling
├── models/          # MongoDB schemas
├── routes/          # API route handlers
├── services/        # External services (email, etc.)
├── utils/           # Utility functions
└── server.js        # Main server file
```

## Testing

Run the test suite:
```bash
npm test

# Watch mode
npm run test:watch
```

## Health Check

Check API health:
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-09T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production database
4. Set up Redis for caching
5. Configure SMTP for emails

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Support

For support and questions:
- 📧 Email: support@heretoeducateothers.com
- 📖 Documentation: https://docs.h2eo.org
- 🐛 Issues: GitHub Issues

## License

This project is licensed under the MIT License - see the LICENSE file for details.