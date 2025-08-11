import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Facility } from '../models/Facility.js';
import { User } from '../models/User.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/dashboard', async (_req, res) => {
  try {
    const facilityCount = await Facility.countDocuments();
    const userCount = await User.countDocuments();
    res.json({ success: true, data: { totalBookings: 0, activeBookings: 0, totalRevenue: 0, facilityCount, userCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/facilities/pending', async (_req, res) => {
  try {
    const facilities = await Facility.find({ status: 'pending' });
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/facilities/:id/approve', async (req, res) => {
  try {
    const { approved, comments } = req.body;
    const updated = await Facility.findByIdAndUpdate(
      req.params.id,
      { status: approved ? 'approved' : 'rejected', adminComments: comments },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    const mapped = users.map((u) => ({
      _id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      isVerified: u.isVerified,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

