
import React, { useState, useEffect } from 'react';
import { bookingsApi } from '@/lib/api/bookings';
import { Booking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';

const OwnerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingsApi.getOwnerBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error loading bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await bookingsApi.updateBookingStatus(bookingId, status);
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: status as any }
          : booking
      ));
      toast.success('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Facility Bookings</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No bookings found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {booking.user?.name}
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </CardTitle>
                  <div className="text-right">
                    <div className="font-semibold text-lg">₹{booking.totalAmount}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.paymentStatus}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.facility?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Court: {booking.court?.name} ({booking.court?.sportType})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.startTime} - {booking.endTime} ({booking.totalHours} hours)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Contact:</strong> {booking.user?.email}
                    </div>
                    <div className="text-sm">
                      <strong>Rate:</strong> ₹{booking.pricePerHour}/hour
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Select onValueChange={(value) => handleStatusUpdate(booking._id, value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirm Booking</SelectItem>
                          <SelectItem value="cancelled">Cancel Booking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
