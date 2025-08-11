import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  generateRefreshTokenJWT,
  verifyRefreshToken,
  getRefreshTokenCookieOptions 
} from '../utils/jwt.js';
import { authenticateToken, authRateLimit } from '../middleware/authMiddleware.js';

const router = Router();

// Helper function to get device info
const getDeviceInfo = (req) => ({
  userAgent: req.get('User-Agent') || 'Unknown',
  ip: req.ip || req.connection.remoteAddress || 'Unknown'
});

// Helper function to create token payload
const createTokenPayload = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
  name: user.name
});

// Helper function to create client-safe user object
const toClientUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt
});

// POST /api/auth/v2/register
router.post('/register', authRateLimit(3, 15 * 60 * 1000), async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      role: ['user', 'facility_owner', 'admin'].includes(role) ? role : 'user',
      isVerified: false // Will be verified via OTP
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for OTP verification.',
      data: {
        userId: user._id,
        email: user.email,
        requiresVerification: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// POST /api/auth/v2/login
router.post('/login', authRateLimit(5, 15 * 60 * 1000), async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        code: 'EMAIL_NOT_VERIFIED',
        requiresVerification: true
      });
    }

    // Create token payload
    const tokenPayload = createTokenPayload(user);

    // Generate tokens
    const accessToken = generateAccessToken(tokenPayload);
    const refreshTokenString = generateRefreshToken();

    // Store refresh token in database
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

    await RefreshToken.create({
      token: refreshTokenString,
      userId: user._id,
      expiresAt: refreshTokenExpiry,
      deviceInfo: getDeviceInfo(req),
      rememberMe
    });

    // Set refresh token cookie
    const cookieOptions = getRefreshTokenCookieOptions(rememberMe);
    res.cookie('refreshToken', refreshTokenString, cookieOptions);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: toClientUser(user),
        accessToken,
        expiresIn: 15 * 60, // 15 minutes in seconds
        tokenType: 'Bearer'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// POST /api/auth/v2/refresh
router.post('/refresh', async (req, res) => {
  try {
    const refreshTokenString = req.cookies.refreshToken;

    if (!refreshTokenString) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    // Find refresh token in database
    const refreshTokenDoc = await RefreshToken.findOne({ 
      token: refreshTokenString,
      isRevoked: false
    }).populate('userId');

    if (!refreshTokenDoc) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Check if token is expired
    if (!refreshTokenDoc.isValid()) {
      // Clean up expired token
      await RefreshToken.deleteOne({ _id: refreshTokenDoc._id });
      res.clearCookie('refreshToken');
      
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }

    const user = refreshTokenDoc.userId;

    // Check if user still exists and is verified
    if (!user || !user.isVerified) {
      await RefreshToken.deleteOne({ _id: refreshTokenDoc._id });
      res.clearCookie('refreshToken');
      
      return res.status(401).json({
        success: false,
        message: 'User not found or not verified',
        code: 'USER_INVALID'
      });
    }

    // Generate new access token
    const tokenPayload = createTokenPayload(user);
    const accessToken = generateAccessToken(tokenPayload);

    // Optionally rotate refresh token (recommended for security)
    const shouldRotateRefreshToken = Math.random() > 0.7; // 30% chance to rotate
    
    if (shouldRotateRefreshToken) {
      // Generate new refresh token
      const newRefreshTokenString = generateRefreshToken();
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

      // Create new refresh token
      await RefreshToken.create({
        token: newRefreshTokenString,
        userId: user._id,
        expiresAt: refreshTokenExpiry,
        deviceInfo: getDeviceInfo(req),
        rememberMe: refreshTokenDoc.rememberMe
      });

      // Revoke old refresh token
      refreshTokenDoc.isRevoked = true;
      await refreshTokenDoc.save();

      // Set new refresh token cookie
      const cookieOptions = getRefreshTokenCookieOptions(refreshTokenDoc.rememberMe);
      res.cookie('refreshToken', newRefreshTokenString, cookieOptions);
    }

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: toClientUser(user),
        accessToken,
        expiresIn: 15 * 60, // 15 minutes in seconds
        tokenType: 'Bearer'
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// POST /api/auth/v2/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const refreshTokenString = req.cookies.refreshToken;

    // Revoke refresh token if present
    if (refreshTokenString) {
      await RefreshToken.updateOne(
        { token: refreshTokenString, userId: req.user._id },
        { isRevoked: true }
      );
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// POST /api/auth/v2/logout-all
router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    // Revoke all refresh tokens for the user
    await RefreshToken.revokeAllForUser(req.user._id);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    res.json({
      success: true,
      message: 'Logged out from all devices'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout all failed'
    });
  }
});

// POST /api/auth/v2/verify-otp (compatible with existing OTP system)
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp, rememberMe = false } = req.body;
    
    if (!otp || String(otp).length < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter an OTP' 
      });
    }
    
    // For development: accept any 6-digit code or "123456" as valid
    const isValidOtp = String(otp).length === 6 || otp === '123456';
    if (!isValidOtp) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP must be 6 digits. Use 123456 for development.' 
      });
    }
    
    // Find the most recently registered unverified user
    const user = await User.findOne({ isVerified: false }, {}, { sort: { createdAt: -1 } });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Create token payload
    const tokenPayload = createTokenPayload(user);

    // Generate tokens
    const accessToken = generateAccessToken(tokenPayload);
    const refreshTokenString = generateRefreshToken();

    // Store refresh token in database
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

    await RefreshToken.create({
      token: refreshTokenString,
      userId: user._id,
      expiresAt: refreshTokenExpiry,
      deviceInfo: getDeviceInfo(req),
      rememberMe
    });

    // Set refresh token cookie
    const cookieOptions = getRefreshTokenCookieOptions(rememberMe);
    res.cookie('refreshToken', refreshTokenString, cookieOptions);
    
    res.json({ 
      success: true, 
      message: 'Email verified successfully',
      data: { 
        user: toClientUser(user), 
        accessToken,
        expiresIn: 15 * 60,
        tokenType: 'Bearer'
      } 
    });
    
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'OTP verification failed' 
    });
  }
});

// GET /api/auth/v2/me (get current user info)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: toClientUser(req.user)
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
});

// Background cleanup task for expired tokens
const cleanupExpiredTokens = async () => {
  try {
    const deletedCount = await RefreshToken.cleanupTokens();
    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} expired/revoked refresh tokens`);
    }
  } catch (error) {
    console.error('Token cleanup error:', error);
  }
};

// Run cleanup every hour
if (process.env.NODE_ENV !== 'test') {
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // 1 hour
}

export default router;
