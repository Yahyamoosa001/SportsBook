import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Facility } from '../models/Facility.js';
import { Court } from '../models/Court.js';

const router = Router();

router.get('/sports-types', async (_req, res) => {
  try {
    const sports = ['Basketball', 'Tennis', 'Badminton', 'Volleyball', 'Football'];
    res.json({ success: true, data: sports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public endpoints
router.get('/facilities', async (req, res) => {
  try {
    const { sportType, city, rating } = req.query;
    const filter = {};
    if (sportType) filter.sportsTypes = sportType;
    if (city) filter['location.city'] = city;
    if (rating) filter['rating.average'] = { $gte: Number(rating) };
    filter.status = 'approved';
    const facilities = await Facility.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/facilities/search', async (req, res) => {
  try {
    const { q } = req.query;
    const regex = q ? new RegExp(String(q), 'i') : null;
    const filter = regex ? { name: { $regex: regex } } : {};
    const facilities = await Facility.find(filter).limit(20);
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/facilities/:id', async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: facility });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/facilities/:id/courts', async (req, res) => {
  try {
    const courts = await Court.find({ facilityId: req.params.id });
    res.json({ success: true, data: courts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Owner endpoints
router.post('/owner/facilities', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    const facility = await Facility.create({ ...req.body, ownerId: req.user.id });
    res.json({ success: true, data: facility });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/owner/facilities', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    const facilities = await Facility.find({ ownerId: req.user.id });
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/owner/facilities/:id', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    const updated = await Facility.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/owner/facilities/:facilityId/courts', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    const court = await Court.create({ ...req.body, facilityId: req.params.facilityId });
    res.json({ success: true, data: court });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/owner/courts/:courtId', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    const updated = await Court.findByIdAndUpdate(req.params.courtId, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/owner/courts/:courtId', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    const deleted = await Court.findByIdAndDelete(req.params.courtId);
    if (!deleted) return res.status(404).json({ success: false, message: 'Court not found' });
    res.json({ success: true, message: 'Court deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

