import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Booking } from '../models/Booking.js';
import { Facility } from '../models/Facility.js';
import { Court } from '../models/Court.js';

const router = Router();

router.post('/user/bookings', requireAuth, async (req, res) => {
  try {
    const bookingData = { 
      ...req.body, 
      userId: req.user.id,
      status: req.body.status || 'confirmed',
      paymentStatus: req.body.paymentStatus || 'paid'
    };
    
    const booking = await Booking.create(bookingData);
    
    // Populate the booking with facility and court details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('facilityId', 'name location')
      .populate('courtId', 'name sportType');
    
    res.json({ success: true, data: populatedBooking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/user/bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('facilityId', 'name location')
      .populate('courtId', 'name sportType')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/user/bookings/:id', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/user/bookings/:id/cancel', requireAuth, async (req, res) => {
  try {
    const updated = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/owner/bookings', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    // Get owner's facilities
    const facilities = await Facility.find({ ownerId: req.user.id });
    const facilityIds = facilities.map(f => f._id);
    
    const bookings = await Booking.find({ facilityId: { $in: facilityIds } })
      .populate('facilityId', 'name location')
      .populate('courtId', 'name sportType')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/owner/bookings/:id/status', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/courts/:courtId/availability', async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    // Get existing bookings for this court on this date
    const existingBookings = await Booking.find({
      courtId,
      date,
      status: { $in: ['confirmed', 'pending'] }
    });

    // Generate all possible time slots (6 AM to 10 PM)
    const allSlots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      allSlots.push(timeSlot);
    }

    // Filter out booked slots
    const bookedSlots = existingBookings.map(booking => booking.startTime);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ success: true, data: availableSlots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

