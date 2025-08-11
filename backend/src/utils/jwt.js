import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access_token_secret_change_in_production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_token_secret_change_in_production';

// Token expiry times
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';

// Generate secure random refresh token
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// Generate access token
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'quickcourt',
    audience: 'quickcourt-users'
  });
};

// Generate refresh token JWT (for validation)
export const generateRefreshTokenJWT = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'quickcourt',
    audience: 'quickcourt-users'
  });
};

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET, {
      issuer: 'quickcourt',
      audience: 'quickcourt-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: 'quickcourt',
      audience: 'quickcourt-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

// Cookie options for refresh token
export const getRefreshTokenCookieOptions = (rememberMe = false) => {
  const baseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',
    path: '/',
  };

  if (rememberMe) {
    // Persistent cookie - 7 days
    baseOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  }
  // If not rememberMe, it's a session cookie (no maxAge set)

  return baseOptions;
};
