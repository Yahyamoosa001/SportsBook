import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, MapPin, Clock, Shield, Star, Trophy, Users, Target } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Easy Booking",
      description: "Book your favorite sports venues in just 3 clicks"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Find Nearby",
      description: "Discover sports facilities near your location"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Availability",
      description: "See live availability and book instantly"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Venues",
      description: "All venues are quality-checked and verified"
    }
  ];

  const sports = [
    { name: "Football", icon: "⚽", venues: "50+ venues" },
    { name: "Basketball", icon: "🏀", venues: "35+ venues" },
    { name: "Tennis", icon: "🎾", venues: "40+ venues" },
    { name: "Cricket", icon: "🏏", venues: "45+ venues" },
    { name: "Badminton", icon: "🏸", venues: "60+ venues" },
    { name: "Volleyball", icon: "🏐", venues: "25+ venues" }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Football Enthusiast",
      comment: "QuickCourt made it so easy to find and book football grounds. Amazing platform!",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Tennis Player",
      comment: "Love the real-time availability feature. Never had to wait or face disappointment.",
      rating: 5
    },
    {
      name: "Arjun Singh",
      role: "Cricket Captain",
      comment: "Our team books cricket grounds regularly. QuickCourt is our go-to platform.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">QuickCourt</span>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link to="/sports">Sports</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/about">About</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/login-v2">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register-v2">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              🎉 India's #1 Sports Booking Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Book Sports Venues
              <br />
              <span className="text-foreground">In Seconds</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover and book premium sports facilities near you. From football fields to tennis courts, 
              find your perfect venue and play your favorite sport instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={() => navigate('/register-v2')} className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login-v2')} className="text-lg px-8 py-6">
                Login to Account
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100+ Verified Venues</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>5000+ Happy Players</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>15000+ Bookings Made</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Sports</h2>
            <p className="text-muted-foreground text-lg">Choose from a wide variety of sports venues</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport) => (
              <Card key={sport.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 pb-4">
                  <div className="text-4xl mb-3">{sport.icon}</div>
                  <h3 className="font-semibold mb-1">{sport.name}</h3>
                  <p className="text-sm text-muted-foreground">{sport.venues}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose QuickCourt?</h2>
            <p className="text-muted-foreground text-lg">Everything you need to book and play sports</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="pt-8 pb-6">
                  <div className="flex justify-center mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
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

      {/* How it Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get started in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create your free account in under 30 seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Find Venues</h3>
              <p className="text-muted-foreground">Search and discover sports facilities near you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Book & Play</h3>
              <p className="text-muted-foreground">Select time slots, pay securely, and enjoy your game</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Players Say</h2>
            <p className="text-muted-foreground text-lg">Join thousands of satisfied sports enthusiasts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Playing?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join QuickCourt today and experience the easiest way to book sports venues. 
            Your next game is just a click away!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/register-v2')} className="text-lg px-8 py-6">
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login-v2')} className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">QuickCourt</span>
              </div>
              <p className="text-muted-foreground text-sm">
                India's leading sports venue booking platform. Making sports accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link to="/sports" className="block text-muted-foreground hover:text-foreground">Sports</Link>
                <Link to="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
                <Link to="/register-v2" className="block text-muted-foreground hover:text-foreground">Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sports</h4>
              <div className="space-y-2 text-sm">
                <span className="block text-muted-foreground">Football</span>
                <span className="block text-muted-foreground">Basketball</span>
                <span className="block text-muted-foreground">Tennis</span>
                <span className="block text-muted-foreground">Cricket</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>support@quickcourt.com</p>
                <p>+91 9876543210</p>
                <p>Mumbai, India</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 QuickCourt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
