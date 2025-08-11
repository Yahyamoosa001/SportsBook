import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function signToken(user) {
  const payload = { id: user._id, role: user.role, email: user.email, name: user.name };
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role || 'user' });
    res.json({ success: true, data: null, message: 'Registered' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ success: true, data: { user: toClientUser(user), token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  // MVP: accept any OTP for development, mark the most recently registered user as verified
  try {
    const { otp } = req.body;
    if (!otp || String(otp).length < 1) {
      return res.status(400).json({ success: false, message: 'Please enter an OTP' });
    }
    
    // For development: accept any 6-digit code or "123456" as valid
    const isValidOtp = String(otp).length === 6 || otp === '123456';
    if (!isValidOtp) {
      return res.status(400).json({ success: false, message: 'OTP must be 6 digits. Use 123456 for development.' });
    }
    
    const user = await User.findOne({}, {}, { sort: { createdAt: -1 } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
    
    const token = signToken(user);
    res.json({ success: true, data: { user: toClientUser(user), token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: toClientUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

function toClientUser(user) {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export default router;

