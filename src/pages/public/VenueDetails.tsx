
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { facilitiesApi } from '@/lib/api/facilities';
import { Facility, Court } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Star, Clock, ChevronLeft, ChevronRight, User, Calendar, X } from 'lucide-react';

const VenueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const loadVenueDetails = async () => {
      if (!id) return;
      
      try {
        const [facilityData, courtsData] = await Promise.all([
          facilitiesApi.getFacility(id),
          facilitiesApi.getFacilityCourts(id)
        ]);
        setFacility(facilityData);
        setCourts(courtsData);
      } catch (error) {
        console.error('Error loading venue details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVenueDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Venue not found</h1>
          <Button asChild>
            <Link to="/venues">Back to Venues</Link>
          </Button>
        </div>
      </div>
    );
  }

  const mockReviews = [
    { id: 1, user: "Michael John", rating: 5, date: "19 June 2023", comment: "Nice well, well maintained" },
    { id: 2, user: "Michael John", rating: 5, date: "19 June 2023", comment: "Nice well, well maintained" },
    { id: 3, user: "Michael John", rating: 5, date: "19 June 2023", comment: "Nice well, well maintained" },
    { id: 4, user: "Michael John", rating: 5, date: "19 June 2023", comment: "Nice well, well maintained" },
    { id: 5, user: "Michael John", rating: 5, date: "19 June 2023", comment: "Nice well, well maintained" },
    { id: 6, user: "Michael John", rating: 5, date: "19 June 2023", comment: "Nice well, well maintained" },
  ];

  const sportsIcons = [
    { name: "Football", icon: "⚽" },
    { name: "Cricket", icon: "🏏" },
    { name: "Badminton", icon: "🏸" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/venues" className="flex items-center gap-2 hover:opacity-70">
                <ChevronLeft className="h-5 w-5" />
                <span className="font-semibold">QUICKCOURT</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span>Back</span>
              <Button variant="outline" size="sm">Login / Sign Up</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Venue Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{facility.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span>Ballalka, Jodhpur Village</span>
                <div className="flex items-center gap-1 ml-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{facility.rating.average} ({facility.rating.count})</span>
                </div>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="mb-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {facility.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image || '/placeholder.svg'}
                          alt={`${facility.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              <div className="text-center mt-2 text-sm text-muted-foreground">
                Images / Videos
              </div>
            </div>

            {/* Sports Available */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Sports Available</h3>
              <div className="grid grid-cols-3 gap-4">
                {sportsIcons.map((sport) => (
                  <Card key={sport.name} className="text-center p-4">
                    <div className="text-3xl mb-2">{sport.icon}</div>
                    <p className="text-sm font-medium">{sport.name}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Restroom</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Refreshment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">CCTV Surveillance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Candle for Conditional Use</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Seating Arrangement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Wifi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Others</span>
                </div>
              </div>
            </div>

            {/* About Venue */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">About Venue</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Government Training Center</p>
                <p>• For over than 2 players etc. 56 other age groups</p>
                <p>• Available wheelchair access</p>
              </div>
            </div>

            {/* Player Reviews & Ratings */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Player Reviews & Ratings</h3>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Button variant="link" className="text-blue-600">Show more reviews</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Book This Venue Button */}
              <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Book This Venue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>Badminton</DialogTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowBookingModal(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Booking is subjected to change and is controlled by venue
                    </p>
                    <div>
                      <h4 className="font-semibold mb-2">Badminton-Standard Synthetic</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Mon-Fri 6:00 AM - 07:00 AM</span>
                          <span>500 INR / Hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mon-Fri 7:00 AM - 04:00 PM</span>
                          <span>04:00 PM - 10:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday - Sunday</span>
                          <span>06:00 AM - 10:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekend</span>
                          <span>600 INR / Hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekend</span>
                          <span>06:00 AM - 10:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">7:00AM - 11:00PM</p>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-red-500">
                    <MapPin className="h-5 w-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Shree Maruti Chowk, Satellite,<br />
                    Near Balaji Towers Ahmedabad-380051<br />
                    Gujarat
                  </p>
                </CardContent>
              </Card>

              {/* Location Map */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Map View</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>Footer</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VenueDetails;
