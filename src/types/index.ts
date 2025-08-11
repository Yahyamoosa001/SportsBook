
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'facility_owner' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
}

export interface OperatingHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface Facility {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  location: Location;
  sportsTypes: string[];
  amenities: string[];
  images: string[];
  operatingHours: OperatingHours;
  contactInfo: ContactInfo;
  rating: { average: number; count: number };
  status: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Court {
  _id: string;
  facilityId: string;
  name: string;
  sportType: string;
  pricePerHour: number;
  description: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  userId: string;
  facilityId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  pricePerHour: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  // Populated fields
  facility?: Facility;
  court?: Court;
  user?: User;
}

export interface Review {
  _id: string;
  userId: string;
  facilityId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Availability {
  _id: string;
  courtId: string;
  date: string;
  blockedSlots: { startTime: string; endTime: string; reason: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'facility_owner';
}

export interface SearchFilters {
  sportType?: string;
  city?: string;
  priceRange?: { min: number; max: number };
  rating?: number;
  amenities?: string[];
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  facilityCount?: number;
  userCount?: number;
}
