import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facilitiesApi } from '@/lib/api/facilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Trophy, Target, Clock, Star } from 'lucide-react';

const sportsData = [
  {
    name: 'Football',
    icon: '⚽',
    description: 'Experience the thrill of football on premium turf grounds with proper goal posts and markings.',
    benefits: ['Cardiovascular fitness', 'Team coordination', 'Strategic thinking', 'Agility improvement'],
    avgPrice: '₹800-1500/hour',
    popularity: 95
  },
  {
    name: 'Basketball', 
    icon: '🏀',
    description: 'Play on professional courts with standard hoops and court dimensions for the ultimate basketball experience.',
    benefits: ['Height training', 'Hand-eye coordination', 'Quick reflexes', 'Stamina building'],
    avgPrice: '₹600-1200/hour',
    popularity: 88
  },
  {
    name: 'Tennis',
    icon: '🎾', 
    description: 'Serve and volley on well-maintained tennis courts with proper net height and court surfaces.',
    benefits: ['Full body workout', 'Mental focus', 'Precision training', 'Competitive spirit'],
    avgPrice: '₹500-1000/hour',
    popularity: 82
  },
  {
    name: 'Cricket',
    icon: '🏏',
    description: 'Enjoy cricket on dedicated pitches with proper wickets and boundary markings.',
    benefits: ['Strategic planning', 'Team spirit', 'Hand-eye coordination', 'Patience building'],
    avgPrice: '₹1000-2000/hour',
    popularity: 92
  },
  {
    name: 'Badminton',
    icon: '🏸',
    description: 'Play on indoor courts with proper lighting and ventilation for optimal shuttlecock flight.',
    benefits: ['Agility improvement', 'Quick reflexes', 'Cardiovascular health', 'Precision shots'],
    avgPrice: '₹300-800/hour',
    popularity: 78
  },
  {
    name: 'Volleyball',
    icon: '🏐',
    description: 'Spike and serve on regulation volleyball courts with proper net height and court dimensions.',
    benefits: ['Jumping ability', 'Team coordination', 'Upper body strength', 'Communication skills'],
    avgPrice: '₹400-900/hour',
    popularity: 71
  }
];

const Sports: React.FC = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await facilitiesApi.getFacilities();
        setFacilities(data);
      } catch (error) {
        console.error('Error loading facilities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, []);

  const getSportFacilityCount = (sport: string) => {
    return facilities.filter(facility => 
      facility.sportsTypes.includes(sport)
    ).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Perfect Sport
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            From football fields to tennis courts, find the perfect venue for your favorite sport. 
            Professional facilities, competitive prices, and easy booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/venues">Browse All Venues</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Join QuickCourt</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Sports</h2>
            <p className="text-muted-foreground text-lg">
              Choose from a wide variety of sports and find venues near you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sportsData.map((sport) => (
              <Card key={sport.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{sport.icon}</span>
                      <div>
                        <CardTitle className="text-xl">{sport.name}</CardTitle>
                        <CardDescription>{getSportFacilityCount(sport.name)} venues available</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {sport.popularity}% popular
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {sport.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {sport.benefits.map((benefit) => (
                        <Badge key={benefit} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Avg. Price: </span>
                      <span className="font-semibold text-green-600">{sport.avgPrice}</span>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/venues?sport=${sport.name}`}>
                        Find Courts
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">QuickCourt by Numbers</h2>
            <p className="text-muted-foreground">Join thousands of sports enthusiasts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">{loading ? '-' : facilities.length}+</div>
              <div className="text-muted-foreground">Sports Venues</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">5000+</div>
              <div className="text-muted-foreground">Active Players</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Clock className="w-12 h-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-muted-foreground">Hours Booked</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">4.8/5</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join QuickCourt today and discover amazing sports venues in your area. 
            Book instantly, play immediately!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/venues">Browse Venues</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sports;
