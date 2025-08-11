
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { facilitiesApi } from '@/lib/api/facilities';
import { Facility, SearchFilters } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { MapPin, Star, Search, Filter } from 'lucide-react';

const Venues: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const facilitiesPerPage = 12;

  // Mock filter options
  const sportsTypes = ['Basketball', 'Tennis', 'Football', 'Cricket', 'Badminton'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'];
  const amenities = ['Parking', 'Cafeteria', 'Changing Room', 'First Aid', 'Wi-Fi'];

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoading(true);
        const sport = searchParams.get('sport');
        const initialFilters = sport ? { sportType: sport } : {};
        setFilters(initialFilters);
        
        const data = await facilitiesApi.getFacilities(initialFilters);
        setFacilities(data);
      } catch (error) {
        console.error('Error loading facilities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, [searchParams]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = searchQuery 
        ? await facilitiesApi.searchFacilities(searchQuery, filters)
        : await facilitiesApi.getFacilities(filters);
      setFacilities(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string, checked?: boolean) => {
    const newFilters = { ...filters };
    
    if (checked !== undefined) {
      // Handle checkbox filters (amenities)
      if (!newFilters[key]) newFilters[key] = [];
      if (checked) {
        newFilters[key] = [...(newFilters[key] as string[]), value];
      } else {
        newFilters[key] = (newFilters[key] as string[]).filter(item => item !== value);
      }
    } else {
      // Handle select filters
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
  };

  // Pagination logic
  const totalPages = Math.ceil(facilities.length / facilitiesPerPage);
  const startIndex = (currentPage - 1) * facilitiesPerPage;
  const endIndex = startIndex + facilitiesPerPage;
  const currentFacilities = facilities.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="w-80 bg-card border-r p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border p-6 min-h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">QUICKCOURT</h1>
            <p className="text-sm text-muted-foreground">Sports Venues in Ahmedabad: Discover and Book Nearby Venues</p>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search by venue name</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select onValueChange={(value) => handleFilterChange('city', value)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sports Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sports Type</label>
              <div className="space-y-2">
                {sportsTypes.map((sport) => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox 
                      id={sport}
                      onCheckedChange={(checked) => handleFilterChange('sportsTypes', sport.toLowerCase(), checked as boolean)}
                    />
                    <label htmlFor={sport} className="text-sm">{sport}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="price1" />
                  <label htmlFor="price1" className="text-sm">₹ 0 - ₹ 500</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price2" />
                  <label htmlFor="price2" className="text-sm">₹ 500 - ₹ 1000</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price3" />
                  <label htmlFor="price3" className="text-sm">₹ 1000 - ₹ 2000</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price4" />
                  <label htmlFor="price4" className="text-sm">₹ 2000 & up</label>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating5" />
                  <label htmlFor="rating5" className="text-sm flex items-center">
                    5 <Star className="h-3 w-3 fill-current text-yellow-500 ml-1" />
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating4" />
                  <label htmlFor="rating4" className="text-sm flex items-center">
                    4 <Star className="h-3 w-3 fill-current text-yellow-500 ml-1" /> & up
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating3" />
                  <label htmlFor="rating3" className="text-sm flex items-center">
                    3 <Star className="h-3 w-3 fill-current text-yellow-500 ml-1" /> & up
                  </label>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSearch}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">See Venues / Venue Booking Page</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>See Venues (Mobile View)</span>
              </div>
            </div>

            {/* Venue Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentFacilities.map((facility) => (
                <Card key={facility._id} className="overflow-hidden hover:shadow-lg transition-shadow border rounded-lg">
                  <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                    Image
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{facility.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span className="text-xs">{facility.rating.average}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{facility.location.city}</span>
                      </div>
                      <div className="text-sm">₹ {Math.floor(Math.random() * 1000) + 500}/hr</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {facility.sportsTypes.slice(0, 2).map((sport) => (
                          <Badge key={sport} variant="outline" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        asChild 
                        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs"
                        size="sm"
                      >
                        <Link to={`/venues/${facility._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mb-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            {facilities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No venues found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-12">
            Footer
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venues;
