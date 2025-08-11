
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { facilitiesApi } from '@/lib/api/facilities';
import { bookingsApi } from '@/lib/api/bookings';
import { Facility, Court } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MapPin, Star, Clock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const Booking: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [facility, setFacility] = useState<Facility | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number[]>([2]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const courtId = searchParams.get('court');

  useEffect(() => {
    const loadBookingData = async () => {
      if (!facilityId) return;
      
      try {
        const [facilityData, courtsData] = await Promise.all([
          facilitiesApi.getFacility(facilityId),
          facilitiesApi.getFacilityCourts(facilityId)
        ]);
        
        setFacility(facilityData);
        setCourts(courtsData);
        
        if (courtId) {
          const court = courtsData.find(c => c._id === courtId);
          setSelectedCourt(court || null);
        }
      } catch (error) {
        console.error('Error loading booking data:', error);
        toast.error('Failed to load booking information');
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [facilityId, courtId]);

  useEffect(() => {
    const loadAvailability = async () => {
      if (selectedCourt && selectedDate) {
        try {
          const dateStr = selectedDate.toISOString().split('T')[0];
          const slots = await bookingsApi.getAvailability(selectedCourt._id, dateStr);
          setAvailableSlots(slots);
        } catch (error) {
          console.error('Error loading availability:', error);
        }
      }
    };

    loadAvailability();
  }, [selectedCourt, selectedDate]);

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const calculateTotalAmount = () => {
    if (!selectedCourt) return 0;
    return duration[0] * selectedCourt.pricePerHour;
  };

  const calculateEndTime = () => {
    if (!selectedStartTime) return '';
    const [hours, minutes] = selectedStartTime.split(':').map(Number);
    const endHours = hours + duration[0];
    return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedStartTime || !user) {
      toast.error('Please fill in all booking details');
      return;
    }

    setBooking(true);
    try {
      await bookingsApi.createBooking({
        facilityId: facilityId!,
        courtId: selectedCourt._id,
        date: selectedDate.toISOString().split('T')[0],
        startTime: selectedStartTime,
        endTime: calculateEndTime(),
        totalHours: duration[0],
        pricePerHour: selectedCourt.pricePerHour,
        totalAmount: calculateTotalAmount(),
      });

      toast.success('Booking created successfully!');
      navigate('/user/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Facility not found</h1>
          <Button onClick={() => navigate('/venues')}>Back to Venues</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <span className="font-semibold">QUICKCOURT</span>
            </div>
            <div className="text-sm text-muted-foreground">
              If not logged in first redirect to the login
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 text-center">Court Booking</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {/* Venue Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{facility.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Satellite, Jodhpur Village</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{facility.rating.average} ({facility.rating.count})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Sport Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sport</label>
                    <Select value="badminton" disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="badminton">🏸 Badminton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <div className="border rounded-md p-3 bg-muted/50">
                      <span className="text-sm">
                        {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Select date'}
                      </span>
                    </div>
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <Select onValueChange={setSelectedStartTime} value={selectedStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem 
                            key={time} 
                            value={time}
                            disabled={!availableSlots.includes(time)}
                          >
                            {time} {!availableSlots.includes(time) && '(Booked)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration Slider */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <div className="px-3">
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        max={6}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1hr</span>
                        <span className="font-medium">{duration[0]}hr</span>
                        <span>6hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Court Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Court</label>
                    <Select onValueChange={(value) => {
                      const court = courts.find(c => c._id === value);
                      setSelectedCourt(court || null);
                    }} value={selectedCourt?._id || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Court" />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((court) => (
                          <SelectItem key={court._id} value={court._id}>
                            Court {courts.indexOf(court) + 1} - Court {courts.indexOf(court) + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Continue to Payment Button */}
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                    onClick={handleBooking}
                    disabled={!selectedCourt || !selectedDate || !selectedStartTime || booking}
                  >
                    {booking ? 'Processing...' : `Continue to Payment - ₹${calculateTotalAmount()}.00`}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Calendar Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-4 text-center">
                  You should also use to keep in your calendar.
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border-0"
                />
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Busy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Events</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Share this with us to the future consultation and we can be applied as per selected
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
