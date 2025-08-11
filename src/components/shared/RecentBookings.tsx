import React, { useState, useEffect } from 'react';
import { bookingsApi } from '@/lib/api/bookings';
import { Booking } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface RecentBookingsProps {
  userType: 'user' | 'owner' | 'admin';
  limit?: number;
  showRefresh?: boolean;
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ 
  userType, 
  limit = 5, 
  showRefresh = true 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      let data: Booking[] = [];
      
      switch (userType) {
        case 'user':
          data = await bookingsApi.getUserBookings();
          break;
        case 'owner':
          data = await bookingsApi.getOwnerBookings();
          break;
        case 'admin':
          // For admin, we'll use owner bookings as a proxy (in real app, would have admin-specific endpoint)
          data = await bookingsApi.getOwnerBookings();
          break;
      }
      
      setBookings(data.slice(0, limit));
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load recent bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userType, limit]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (time: string) => {
    const [hour] = time.split(':');
    const hourNum = parseInt(hour);
    if (hourNum === 0) return '12:00 AM';
    if (hourNum === 12) return '12:00 PM';
    if (hourNum < 12) return `${hourNum}:00 AM`;
    return `${hourNum - 12}:00 PM`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Bookings
          </CardTitle>
          {showRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadBookings}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
        <CardDescription>
          {userType === 'user' && 'Your recent bookings'}
          {userType === 'owner' && 'Recent bookings at your facilities'}
          {userType === 'admin' && 'Recent platform bookings'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-sm">
                      {booking.facilityId?.name || 'Unknown Facility'}
                    </h4>
                    <Badge className={`${getStatusColor(booking.status)} text-white text-xs`}>
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{booking.courtId?.name} - {booking.courtId?.sportType}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                    </div>
                  </div>

                  {userType === 'owner' && booking.userId && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{(booking.userId as any).name || (booking.userId as any).email}</span>
                    </div>
                  )}
                </div>

                <div className="text-right ml-4">
                  <div className="font-semibold text-green-600 text-sm">
                    ₹{booking.totalAmount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {booking.totalHours}h
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBookings;
