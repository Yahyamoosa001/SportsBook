import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { Court } from '../models/Court.js';

const router = Router();

// Get available time slots for a court on a specific date
router.get('/courts/:courtId/availability', async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    // Get the court to check operating hours
    const court = await Court.findById(courtId).populate('facilityId');
    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }

    // Get existing bookings for this court on this date
    const existingBookings = await Booking.find({
      courtId,
      date,
      status: { $in: ['confirmed', 'pending'] }
    });

    // Generate all possible time slots (assuming 1-hour slots from 6 AM to 11 PM)
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

// Get peak hours analytics for a facility
router.get('/facilities/:facilityId/peak-hours', async (req, res) => {
  try {
    const { facilityId } = req.params;
    
    const bookings = await Booking.find({
      facilityId,
      status: 'confirmed',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    // Create hourly booking count
    const hourlyBookings = {};
    for (let hour = 6; hour <= 22; hour++) {
      hourlyBookings[hour] = 0;
    }

    bookings.forEach(booking => {
      const hour = parseInt(booking.startTime.split(':')[0]);
      if (hourlyBookings[hour] !== undefined) {
        hourlyBookings[hour]++;
      }
    });

    res.json({ success: true, data: hourlyBookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
