import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { facilitiesApi } from '@/lib/api/facilities';
import { bookingsApi } from '@/lib/api/bookings';
import { Facility, Court } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Clock, CreditCard, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

const EnhancedBooking: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!facilityId) return;
    
    const loadData = async () => {
      try {
        const [facilityData, courtsData] = await Promise.all([
          facilitiesApi.getFacility(facilityId),
          facilitiesApi.getFacilityCourts(facilityId)
        ]);
        setFacility(facilityData);
        setCourts(courtsData);
        
        if (courtsData.length > 0) {
          setSelectedCourt(courtsData[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [facilityId]);

  useEffect(() => {
    if (!selectedCourt || !selectedDate) return;
    
    const loadAvailability = async () => {
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const slots = await bookingsApi.getAvailability(selectedCourt._id, dateStr);
        setAvailableSlots(slots);
        setSelectedSlot('');
      } catch (error) {
        console.error('Error loading availability:', error);
        setAvailableSlots([]);
      }
    };

    loadAvailability();
  }, [selectedCourt, selectedDate]);

  const formatTime = (time: string) => {
    const [hour] = time.split(':');
    const hourNum = parseInt(hour);
    if (hourNum === 0) return '12:00 AM';
    if (hourNum === 12) return '12:00 PM';
    if (hourNum < 12) return `${hourNum}:00 AM`;
    return `${hourNum - 12}:00 PM`;
  };

  const getEndTime = (startTime: string, durationHours: number) => {
    const [hour] = startTime.split(':');
    const endHour = parseInt(hour) + durationHours;
    return `${endHour.toString().padStart(2, '0')}:00`;
  };

  const calculateTotal = () => {
    if (!selectedCourt) return 0;
    return selectedCourt.pricePerHour * duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourt || !selectedSlot || !selectedDate) {
      toast.error('Please select all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        facilityId: facilityId!,
        courtId: selectedCourt._id,
        date: selectedDate.toISOString().split('T')[0],
        startTime: selectedSlot,
        endTime: getEndTime(selectedSlot, duration),
        totalHours: duration,
        pricePerHour: selectedCourt.pricePerHour,
        totalAmount: calculateTotal(),
        status: 'confirmed' as const,
        paymentStatus: 'paid' as const
      };

      await bookingsApi.createBooking(bookingData);
      toast.success('Booking confirmed successfully!');
      navigate('/user/bookings');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
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
          <Button onClick={() => navigate('/venues')}>
            Back to Venues
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/venues/${facilityId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Venue
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Book {facility.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{facility.location.city}, {facility.location.state}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Court Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Court
              </CardTitle>
              <CardDescription>
                Choose from available courts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map((court) => (
                  <div
                    key={court._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCourt?._id === court._id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCourt(court)}
                  >
                    <h3 className="font-semibold">{court.name}</h3>
                    <p className="text-sm text-muted-foreground">{court.sportType}</p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{court.pricePerHour}/hour
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>
                Choose your preferred booking date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Time Slot Selection */}
          {selectedCourt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Available Time Slots
                </CardTitle>
                <CardDescription>
                  Select your preferred time slot
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableSlots.length === 0 ? (
                  <p className="text-muted-foreground">No slots available for this date</p>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                        className="h-12"
                      >
                        {formatTime(slot)}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Duration Selection */}
          {selectedSlot && (
            <Card>
              <CardHeader>
                <CardTitle>Duration</CardTitle>
                <CardDescription>
                  How many hours would you like to book?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select 
                  value={duration.toString()} 
                  onValueChange={(value) => setDuration(parseInt(value))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((hours) => (
                      <SelectItem key={hours} value={hours.toString()}>
                        {hours} hour{hours > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCourt && (
                <>
                  <div>
                    <Label>Court</Label>
                    <p className="font-semibold">{selectedCourt.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCourt.sportType}</p>
                  </div>

                  <div>
                    <Label>Date</Label>
                    <p className="font-semibold">{selectedDate.toLocaleDateString()}</p>
                  </div>

                  {selectedSlot && (
                    <div>
                      <Label>Time</Label>
                      <p className="font-semibold">
                        {formatTime(selectedSlot)} - {formatTime(getEndTime(selectedSlot, duration))}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label>Duration</Label>
                    <p className="font-semibold">{duration} hour{duration > 1 ? 's' : ''}</p>
                  </div>

                  <div>
                    <Label>Price per Hour</Label>
                    <p className="font-semibold">₹{selectedCourt.pricePerHour}</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-green-600">₹{calculateTotal()}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={!selectedSlot || submitting}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? 'Processing...' : 'Confirm Booking'}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    Payment will be processed securely
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBooking;
