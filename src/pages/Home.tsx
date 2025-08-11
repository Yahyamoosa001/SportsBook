
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { facilitiesApi } from '@/lib/api/facilities';
import { Facility } from '@/types';
import { Search, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [sportsTypes, setSportsTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSport, setSelectedSport] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [facilitiesData, sportsData] = await Promise.all([
          facilitiesApi.getFacilities(),
          facilitiesApi.getSportsTypes()
        ]);
        setFacilities(facilitiesData);
        setSportsTypes(sportsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters = {
        ...(selectedLocation && { city: selectedLocation }),
        ...(selectedSport && { sportType: selectedSport })
      };
      
      const data = searchQuery 
        ? await facilitiesApi.searchFacilities(searchQuery, filters)
        : await facilitiesApi.getFacilities(filters);
      setFacilities(data);
    } catch (error) {
      console.error('Error searching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const popularSports = [
    { name: 'Badminton', image: '/placeholder.svg' },
    { name: 'Cricket', image: '/placeholder.svg' },
    { name: 'Football', image: '/placeholder.svg' },
    { name: 'Basketball', image: '/placeholder.svg' },
    { name: 'Tennis', image: '/placeholder.svg' },
    { name: 'Swimming', image: '/placeholder.svg' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <p className="text-sm text-muted-foreground">Find & Book</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-primary">FIND PLAYERS & VENUES NEARBY</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Seamlessly explore sports venues near you with sports enthusiasts just like you.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                  Book Venues
                </Button>

                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-full"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>

                  <Select onValueChange={setSelectedLocation}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={setSelectedSport}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportsTypes.map((sport) => (
                        <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    onClick={handleSearch}
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Venue Preview in Sidebar */}
            <div className="space-y-3">
              <h3 className="font-medium">Image</h3>
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">Image</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">HD Badminton</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span className="text-xs">4.5 (15)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>Powai/Mumbai (5.6)</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Basketball</Badge>
                  <Badge variant="outline" className="text-xs">Cricket</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Book Venues</h2>
              <Link to="/venues" className="text-primary hover:underline">
                See all venues →
              </Link>
            </div>

            {/* Venue Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {facilities.slice(0, 8).map((facility) => (
                <Card key={facility._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Image</span>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{facility.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span className="text-xs">{facility.rating.average} ({facility.rating.count})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{facility.location.city} ({Math.random().toFixed(1)} km)</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {facility.sportsTypes.slice(0, 2).map((sport) => (
                          <Badge key={sport} variant="outline" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mb-8">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Popular Sports */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Popular Sports</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularSports.map((sport) => (
                <Link key={sport.name} to={`/venues?sport=${sport.name.toLowerCase()}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <img
                        src={sport.image}
                        alt={sport.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <span className="text-sm font-medium text-center block">{sport.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
