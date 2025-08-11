import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Facility } from '../models/Facility.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { Court } from '../models/Court.js';

const router = Router();

router.get('/user/dashboard', requireAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ userId: req.user.id });
    const activeBookings = await Booking.countDocuments({ userId: req.user.id, status: 'confirmed' });
    res.json({ success: true, data: { totalBookings, activeBookings, totalRevenue: 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/owner/dashboard', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    // Get owner's facilities
    const facilities = await Facility.find({ ownerId: req.user.id });
    const facilityIds = facilities.map(f => f._id);
    
    // Get counts
    const facilityCount = facilities.length;
    const totalBookings = await Booking.countDocuments({ facilityId: { $in: facilityIds } });
    const activeBookings = await Booking.countDocuments({ 
      facilityId: { $in: facilityIds }, 
      status: 'confirmed' 
    });
    
    // Calculate total revenue
    const bookings = await Booking.find({ 
      facilityId: { $in: facilityIds }, 
      status: 'confirmed' 
    });
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // Get court count
    const courtCount = await Court.countDocuments({ facilityId: { $in: facilityIds } });
    
    res.json({ 
      success: true, 
      data: { 
        totalBookings, 
        activeBookings, 
        totalRevenue, 
        facilityCount,
        courtCount 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get booking trends for owner
router.get('/owner/booking-trends', requireAuth, requireRole('facility_owner'), async (req, res) => {
  try {
    const facilities = await Facility.find({ ownerId: req.user.id });
    const facilityIds = facilities.map(f => f._id);
    
    const bookings = await Booking.find({
      facilityId: { $in: facilityIds },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Group by date
    const trendsData = {};
    bookings.forEach(booking => {
      const date = booking.createdAt.toISOString().split('T')[0];
      trendsData[date] = (trendsData[date] || 0) + 1;
    });
    
    const data = Object.entries(trendsData).map(([date, bookings]) => ({
      date,
      bookings
    }));
    
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get admin analytics
router.get('/admin/dashboard', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOwners = await User.countDocuments({ role: 'facility_owner' });
    const totalFacilities = await Facility.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalCourts = await Court.countDocuments();
    const pendingFacilities = await Facility.countDocuments({ status: 'pending' });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalFacilities,
        totalBookings,
        totalCourts,
        pendingFacilities
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get sports distribution analytics
router.get('/admin/sports-distribution', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const courts = await Court.find();
    const sportsCount = {};
    
    courts.forEach(court => {
      sportsCount[court.sportType] = (sportsCount[court.sportType] || 0) + 1;
    });
    
    const data = Object.entries(sportsCount).map(([sport, count]) => ({
      sport,
      bookings: count
    }));
    
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

