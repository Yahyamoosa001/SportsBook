# 🔐 QuickCourt Secure JWT Authentication System

## Overview
A complete, production-ready JWT authentication system with access and refresh tokens, automatic token refresh, and secure session management.

## 🚀 Features Implemented

### Backend Security Features
- ✅ **JWT Access Tokens** (15-minute expiry)
- ✅ **Refresh Tokens** (7-day expiry, stored in HTTP-only cookies)
- ✅ **Token Rotation** (30% chance to rotate refresh tokens on use)
- ✅ **Rate Limiting** (5 login attempts per 15 minutes)
- ✅ **Secure Middleware** with comprehensive error handling
- ✅ **Database Token Management** with auto-cleanup
- ✅ **Device Tracking** (IP, User Agent)
- ✅ **Remember Me** functionality
- ✅ **Logout from All Devices** capability

### Frontend Security Features
- ✅ **In-Memory Access Token Storage** (no localStorage)
- ✅ **Automatic Token Refresh** with retry logic
- ✅ **Request Interceptors** for seamless API calls
- ✅ **Concurrent Request Handling** (prevents multiple refresh attempts)
- ✅ **Role-Based Redirects** after authentication
- ✅ **Secure Logout** with confirmation dialogs
- ✅ **Remember Me UI** with security indicators

## 🛡️ Security Implementation

### Token Management
```typescript
// Access Token: 15 minutes (stored in memory)
// Refresh Token: 7 days (HTTP-only cookie)
// Remember Me: Persistent cookie vs session cookie
```

### Authentication Flow
```
1. User Login → Access + Refresh Tokens Generated
2. API Requests → Auto-refresh if token expires soon
3. Refresh Token → New access token (optional rotation)
4. Logout → Revoke refresh token + clear cookies
```

### Rate Limiting
```javascript
// Login/Register: 5 attempts per 15 minutes per IP+email
// OTP Verification: 3 attempts per 15 minutes per IP
```

## 📱 API Endpoints

### Authentication V2 Routes
```
POST /api/auth/v2/register     - User registration
POST /api/auth/v2/login        - User login with remember me
POST /api/auth/v2/refresh      - Refresh access token
POST /api/auth/v2/logout       - Logout current session
POST /api/auth/v2/logout-all   - Logout all sessions
POST /api/auth/v2/verify-otp   - OTP verification with remember me
GET  /api/auth/v2/me          - Get current user info
```

### Request/Response Examples

#### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

#### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "isVerified": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

## 🔧 Usage Guide

### Backend Setup

1. **Environment Variables**
```env
JWT_ACCESS_SECRET=your_very_secure_access_token_secret
JWT_REFRESH_SECRET=your_very_secure_refresh_token_secret
```

2. **Import Routes**
```javascript
import authV2Routes from './routes/authV2.js';
app.use('/api/auth/v2', authV2Routes);
```

3. **Use Middleware**
```javascript
import { authenticateToken, requireRole } from './middleware/authMiddleware.js';

// Protect routes
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Role-based protection
router.get('/admin', authenticateToken, requireRole('admin'), handler);
```

### Frontend Setup

1. **Use AuthContextV2**
```tsx
import { AuthProvider } from '@/contexts/AuthContextV2';

function App() {
  return (
    <AuthProvider>
      {/* Your app */}
    </AuthProvider>
  );
}
```

2. **Authentication Hook**
```tsx
import { useAuth } from '@/contexts/AuthContextV2';

function LoginComponent() {
  const { login, isLoading, user } = useAuth();
  
  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true
    });
  };
}
```

3. **Logout Component**
```tsx
import LogoutButton from '@/components/LogoutButton';

// Simple logout button
<LogoutButton variant="button" />

// Dropdown with user info
<LogoutButton variant="dropdown" showUser={true} />
```

## 🔐 Security Best Practices Implemented

### Token Security
- ✅ **Short-lived access tokens** (15 min) minimize exposure
- ✅ **HTTP-only cookies** prevent XSS attacks on refresh tokens
- ✅ **Secure cookies** in production (HTTPS only)
- ✅ **SameSite cookies** prevent CSRF attacks
- ✅ **Token rotation** limits refresh token lifetime

### Request Security
- ✅ **Rate limiting** prevents brute force attacks
- ✅ **Input validation** on all endpoints
- ✅ **Error message consistency** prevents user enumeration
- ✅ **Device tracking** for session management
- ✅ **Automatic cleanup** of expired tokens

### Frontend Security
- ✅ **Memory-only token storage** (no localStorage)
- ✅ **Automatic token refresh** prevents session interruption
- ✅ **Secure logout** clears all authentication state
- ✅ **Protected routes** check authentication status
- ✅ **Role-based access** control

## 🧪 Testing the Implementation

### Demo Accounts
```
Admin:    admin@quickcourt.com / admin123
Owner:    owner@quickcourt.com / owner123
User:     user@quickcourt.com / user123
```

### Test Scenarios

1. **Registration Flow**
   - Register → OTP verification → Auto-login with remember me

2. **Login Flow**
   - Login with/without remember me → Role-based redirect

3. **Token Refresh**
   - Wait 13 minutes → Make API call → Auto-refresh occurs

4. **Logout**
   - Single logout → Current session ends
   - Logout all → All device sessions end

5. **Security**
   - Multiple login attempts → Rate limiting
   - Invalid tokens → Proper error handling
   - Expired refresh token → Redirect to login

## 🚀 Production Deployment

### Required Environment Variables
```env
NODE_ENV=production
JWT_ACCESS_SECRET=generate_a_very_secure_random_key_here
JWT_REFRESH_SECRET=generate_another_very_secure_random_key_here
```

### Security Checklist
- [ ] Use strong, unique JWT secrets
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Configure secure cookie settings
- [ ] Monitor authentication logs
- [ ] Set up token cleanup cron jobs
- [ ] Implement proper error logging

## 📊 Database Schema

### RefreshToken Collection
```javascript
{
  token: String,        // Unique refresh token
  userId: ObjectId,     // Reference to user
  expiresAt: Date,      // Token expiry time
  isRevoked: Boolean,   // Manual revocation flag
  deviceInfo: {
    userAgent: String,  // Browser/device info
    ip: String         // IP address
  },
  rememberMe: Boolean, // Persistent vs session
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Migration from Old Auth

To migrate from the old authentication system:

1. **Update imports** from `AuthContext` to `AuthContextV2`
2. **Update routes** from `/login` to `/login-v2`
3. **Update API calls** to use new endpoints
4. **Test all authentication flows**
5. **Monitor for any issues**

## 📈 Performance Optimizations

- ✅ **Token refresh debouncing** prevents multiple simultaneous refreshes
- ✅ **Automatic token cleanup** removes expired tokens
- ✅ **Efficient database queries** with proper indexing
- ✅ **Memory management** for in-memory tokens
- ✅ **Request batching** for concurrent API calls

---

## 🎉 Summary

This implementation provides enterprise-grade security with:
- **Zero localStorage vulnerabilities**
- **Automatic session management**
- **Comprehensive error handling**
- **Production-ready architecture**
- **User-friendly experience**

The system is now ready for production deployment with all modern security best practices implemented!
