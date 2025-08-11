
import { User, Facility, Court, Booking, DashboardStats } from '@/types';

// Mock users data
export const mockUsers: User[] = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    isVerified: true,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'facility_owner',
    isVerified: true,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    isVerified: true,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Mock facilities data
export const mockFacilities: Facility[] = [
  {
    _id: '1',
    name: 'SportZone Arena',
    description: 'Premium sports facility with state-of-the-art equipment and professional courts.',
    ownerId: '2',
    location: {
      address: '123 Sports Ave',
      city: 'New York',
      state: 'NY',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    sportsTypes: ['Basketball', 'Tennis', 'Badminton'],
    amenities: ['Parking', 'Locker Rooms', 'Cafeteria', 'Pro Shop'],
    images: ['/placeholder.svg', '/placeholder.svg'],
    operatingHours: {
      monday: { open: '06:00', close: '22:00', isOpen: true },
      tuesday: { open: '06:00', close: '22:00', isOpen: true },
      wednesday: { open: '06:00', close: '22:00', isOpen: true },
      thursday: { open: '06:00', close: '22:00', isOpen: true },
      friday: { open: '06:00', close: '22:00', isOpen: true },
      saturday: { open: '08:00', close: '20:00', isOpen: true },
      sunday: { open: '08:00', close: '20:00', isOpen: true }
    },
    contactInfo: {
      phone: '+1-555-123-4567',
      email: 'info@sportzone.com'
    },
    rating: { average: 4.5, count: 120 },
    status: 'approved',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Mock courts data
export const mockCourts: Court[] = [
  {
    _id: '1',
    facilityId: '1',
    name: 'Basketball Court A',
    sportType: 'Basketball',
    pricePerHour: 50,
    description: 'Professional basketball court with wooden flooring',
    images: ['/placeholder.svg'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: '2',
    facilityId: '1',
    name: 'Tennis Court 1',
    sportType: 'Tennis',
    pricePerHour: 40,
    description: 'Clay tennis court with professional lighting',
    images: ['/placeholder.svg'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    _id: '1',
    userId: '1',
    facilityId: '1',
    courtId: '1',
    date: '2024-12-15',
    startTime: '10:00',
    endTime: '12:00',
    totalHours: 2,
    pricePerHour: 50,
    totalAmount: 100,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-10'
  }
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalBookings: 150,
  activeBookings: 25,
  totalRevenue: 15000,
  facilityCount: 12,
  userCount: 450
};

// Mock sports types
export const mockSportsTypes = ['Basketball', 'Tennis', 'Badminton', 'Volleyball', 'Football'];
