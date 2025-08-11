import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Shield, Clock, MapPin, Trophy, Heart, Zap } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Easy Booking",
      description: "Book your favorite sports venues in just a few clicks. Real-time availability and instant confirmation."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community Focused",
      description: "Connect with fellow sports enthusiasts and build lasting friendships through shared passion for sports."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Verified Venues",
      description: "All venues are verified and approved by our team to ensure quality facilities and safety standards."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Flexible Timing",
      description: "Book venues from early morning to late evening. Flexible duration options from 1 to 6 hours."
    }
  ];

  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      description: "Former professional athlete with 15+ years in sports industry",
      avatar: "👨‍💼"
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      description: "Expert in venue management and customer experience",
      avatar: "👩‍💼"
    },
    {
      name: "Arjun Patel",
      role: "Tech Lead",
      description: "Software engineer passionate about sports technology",
      avatar: "👨‍💻"
    },
    {
      name: "Sneha Reddy",
      role: "Community Manager",
      description: "Building connections between sports enthusiasts",
      avatar: "👩‍🎯"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Passion for Sports",
      description: "We believe sports bring people together and build communities"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality First",
      description: "We ensure every venue meets our high standards for safety and quality"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Innovation",
      description: "We continuously improve our platform with latest technology"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About QuickCourt
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're on a mission to make sports accessible to everyone. 
            QuickCourt connects sports enthusiasts with premium facilities, 
            making it easier than ever to play your favorite sport.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Join Our Community</Link>
          </Button>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-muted-foreground mb-6">
                  QuickCourt was born from a simple frustration: finding and booking quality sports venues was too complicated. 
                  Our founders, passionate sports players themselves, experienced the hassle of calling multiple venues, 
                  uncertain availability, and complicated booking processes.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  In 2024, we decided to solve this problem. We built QuickCourt to be the ultimate platform where 
                  sports enthusiasts can easily discover, book, and enjoy premium sports facilities across India.
                </p>
                <p className="text-lg text-muted-foreground">
                  Today, we're proud to serve thousands of players and hundreds of venues, 
                  making sports more accessible and enjoyable for everyone.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-primary/5 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To democratize access to sports by connecting players with quality venues through technology.
                  </p>
                </div>
                <div className="bg-secondary/5 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">
                    A world where everyone can easily play their favorite sport, anytime, anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuickCourt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">QuickCourt Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Partner Venues</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Happy Players</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-muted-foreground">Bookings Made</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join QuickCourt?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Become part of India's largest sports community. Book venues, play sports, and make friends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/venues">Browse Venues</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
