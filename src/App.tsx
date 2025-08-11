
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Venues from "./pages/public/Venues";
import VenueDetails from "./pages/public/VenueDetails";
import Booking from "./pages/user/Booking";
import UserDashboard from "./pages/user/Dashboard";
import MyBookings from "./pages/user/MyBookings";
import Profile from "./pages/user/Profile";
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerFacilities from "./pages/owner/Facilities";
import AddFacility from "./pages/owner/AddFacility";
import Courts from "./pages/owner/Courts";
import OwnerBookings from "./pages/owner/Bookings";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminFacilities from "./pages/admin/Facilities";
import AdminUsers from "./pages/admin/Users";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venues/:id" element={<VenueDetails />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* User Routes */}
              <Route path="/booking/:facilityId" element={
                <ProtectedRoute requiredRole="user">
                  <Booking />
                </ProtectedRoute>
              } />
              <Route path="/user/dashboard" element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/bookings" element={
                <ProtectedRoute requiredRole="user">
                  <MyBookings />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
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
                  <OwnerFacilities />
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
              <Route path="/owner/bookings" element={
                <ProtectedRoute requiredRole="facility_owner">
                  <OwnerBookings />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/facilities" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminFacilities />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
