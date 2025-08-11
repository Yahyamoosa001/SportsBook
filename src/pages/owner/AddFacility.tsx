import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { facilitiesApi } from '@/lib/api/facilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface FacilityFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  sportsTypes: string[];
  amenities: string[];
}

const AddFacility: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedSportsTypes, setSelectedSportsTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FacilityFormData>();

  const sportsOptions = [
    'Football', 'Basketball', 'Tennis', 'Cricket', 'Badminton', 
    'Volleyball', 'Swimming', 'Table Tennis', 'Squash', 'Hockey'
  ];

  const amenitiesOptions = [
    'Parking', 'Restrooms', 'Locker Rooms', 'Showers', 'WiFi',
    'Cafeteria', 'First Aid', 'Equipment Rental', 'Air Conditioning', 'Lighting'
  ];

  const operatingHours = {
    monday: { open: '09:00', close: '22:00', isOpen: true },
    tuesday: { open: '09:00', close: '22:00', isOpen: true },
    wednesday: { open: '09:00', close: '22:00', isOpen: true },
    thursday: { open: '09:00', close: '22:00', isOpen: true },
    friday: { open: '09:00', close: '22:00', isOpen: true },
    saturday: { open: '08:00', close: '23:00', isOpen: true },
    sunday: { open: '08:00', close: '21:00', isOpen: true },
  };

  const handleSportsTypeChange = (sport: string, checked: boolean) => {
    setSelectedSportsTypes(prev => 
      checked ? [...prev, sport] : prev.filter(s => s !== sport)
    );
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities(prev => 
      checked ? [...prev, amenity] : prev.filter(a => a !== amenity)
    );
  };

  const onSubmit = async (data: FacilityFormData) => {
    if (selectedSportsTypes.length === 0) {
      toast.error('Please select at least one sport type');
      return;
    }

    setLoading(true);
    try {
      const facilityData = {
        name: data.name,
        description: data.description,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          coordinates: { lat: 0, lng: 0 } // TODO: Add geocoding
        },
        contactInfo: {
          phone: data.phone,
          email: data.email
        },
        sportsTypes: selectedSportsTypes,
        amenities: selectedAmenities,
        operatingHours,
        images: [], // TODO: Add image upload
        status: 'pending'
      };

      await facilitiesApi.createFacility(facilityData);
      toast.success('Facility created successfully! It will be reviewed by admin.');
      navigate('/owner/facilities');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create facility');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/owner/facilities')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Facilities
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Facility</h1>
            <p className="text-muted-foreground">Create a new sports facility for booking</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide basic details about your facility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Facility Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Facility name is required' })}
                  placeholder="Enter facility name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your facility..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
              <CardDescription>
                Provide the location details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  {...register('address', { required: 'Address is required' })}
                  placeholder="Street address"
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register('city', { required: 'City is required' })}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register('state', { required: 'State is required' })}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How customers can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    {...register('phone', { required: 'Phone number is required' })}
                    placeholder="Phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email'
                      }
                    })}
                    placeholder="Email address"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sports Types */}
          <Card>
            <CardHeader>
              <CardTitle>Sports Types</CardTitle>
              <CardDescription>
                Select the sports available at your facility *
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sportsOptions.map((sport) => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox
                      id={sport}
                      checked={selectedSportsTypes.includes(sport)}
                      onCheckedChange={(checked) => 
                        handleSportsTypeChange(sport, !!checked)
                      }
                    />
                    <Label htmlFor={sport}>{sport}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>
                Select available amenities (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={(checked) => 
                        handleAmenityChange(amenity, !!checked)
                      }
                    />
                    <Label htmlFor={amenity}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/owner/facilities')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Facility'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacility;
