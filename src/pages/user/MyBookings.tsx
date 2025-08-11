
import React, { useState, useEffect } from 'react';
import { bookingsApi } from '@/lib/api/bookings';
import { Booking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingsApi.getUserBookings();
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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsApi.cancelBooking(bookingId);
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      ));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
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

  const canCancelBooking = (booking: Booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const timeDiff = bookingDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return booking.status === 'confirmed' && hoursDiff > 24;
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
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No bookings found</p>
            <Button onClick={() => window.location.href = '/venues'}>
              Browse Venues
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    {booking.facility?.name}
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
                      <span>{booking.court?.name} - {booking.court?.sportType}</span>
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
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>₹{booking.pricePerHour}/hour</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {canCancelBooking(booking) && (
                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      * Cancellation allowed up to 24 hours before booking
                    </p>
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

export default MyBookings;
