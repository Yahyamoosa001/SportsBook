import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContextV2';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRouteV2';

// Import pages
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LoginV2 from './pages/auth/LoginV2';
import RegisterV2 from './pages/auth/RegisterV2';
import VerifyOtpV2 from './pages/auth/VerifyOtpV2';
import Venues from './pages/public/Venues';
import VenueDetails from './pages/public/VenueDetails';
import Sports from './pages/public/Sports';
import About from './pages/public/About';
import Booking from './pages/user/Booking';
import EnhancedBooking from './pages/user/EnhancedBooking';
import UserDashboard from './pages/user/Dashboard';
import MyBookings from './pages/user/MyBookings';
import EnhancedMyBookings from './pages/user/EnhancedMyBookings';
import OwnerDashboard from './pages/owner/Dashboard';
import Facilities from './pages/owner/Facilities';
import AddFacility from './pages/owner/AddFacility';
import Courts from './pages/owner/Courts';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminFacilities from './pages/admin/Facilities';
import Unauthorized from './pages/Unauthorized';

function AppV2() {
  return (
    <div className="App">
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              
              {/* Authentication Routes - V2 */}
              <Route path="/login-v2" element={<LoginV2 />} />
              <Route path="/register-v2" element={<RegisterV2 />} />
              <Route path="/verify-otp-v2" element={<VerifyOtpV2 />} />
              
              {/* Redirect old auth routes to new ones */}
              <Route path="/login" element={<LoginV2 />} />
              <Route path="/register" element={<RegisterV2 />} />
              <Route path="/verify-otp" element={<VerifyOtpV2 />} />
              
              {/* Public Content Routes */}
              <Route path="/sports" element={<Sports />} />
              <Route path="/about" element={<About />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venues/:id" element={<VenueDetails />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* User Routes */}
              <Route path="/booking/:facilityId" element={
                <ProtectedRoute requiredRole="user">
                  <EnhancedBooking />
                </ProtectedRoute>
              } />
              <Route path="/user/dashboard" element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/bookings" element={
                <ProtectedRoute requiredRole="user">
                  <EnhancedMyBookings />
                </ProtectedRoute>
              } />

              {/* Facility Owner Routes */}
              <Route path="/owner/dashboard" element={
                <ProtectedRoute requiredRole="facility_owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/owner/facilities" element={
                <ProtectedRoute requiredRole="facility_owner">
                  <Facilities />
                </ProtectedRoute>
              } />
              <Route path="/owner/facilities/new" element={
                <ProtectedRoute requiredRole="facility_owner">
                  <AddFacility />
                </ProtectedRoute>
              } />
              <Route path="/owner/facilities/:facilityId/courts" element={
                <ProtectedRoute requiredRole="facility_owner">
                  <Courts />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/facilities" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminFacilities />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default AppV2;
