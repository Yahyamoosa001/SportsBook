
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facilitiesApi } from '@/lib/api/facilities';
import { Facility } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, MapPin, Star, Settings } from 'lucide-react';
import { toast } from 'sonner';

const OwnerFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        console.log('Loading owner facilities...');
        const data = await facilitiesApi.getOwnerFacilities();
        console.log('Received facilities data:', data);
        console.log('Setting facilities state with:', data.length, 'facilities');
        setFacilities(data);
      } catch (error) {
        console.error('Error loading facilities:', error);
        toast.error('Failed to load facilities');
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  console.log('Rendering with facilities:', facilities.length, 'facilities');
  console.log('Facilities array:', facilities);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Facilities</h1>
        <Button asChild>
          <Link to="/owner/facilities/new">Add New Facility</Link>
        </Button>
      </div>

      {facilities.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No facilities found</p>
            <Button asChild>
              <Link to="/owner/facilities/new">Create Your First Facility</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {facilities.map((facility) => (
            <Card key={facility._id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <img
                  src={facility.images[0] || '/placeholder.svg'}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    {facility.name}
                    <Badge className={getStatusColor(facility.status)}>
                      {facility.status}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span className="text-sm">{facility.rating.average}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {facility.location.city}, {facility.location.state}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {facility.sportsTypes.slice(0, 3).map((sport) => (
                    <Badge key={sport} variant="outline">
                      {sport}
                    </Badge>
                  ))}
                  {facility.sportsTypes.length > 3 && (
                    <Badge variant="outline">+{facility.sportsTypes.length - 3} more</Badge>
                  )}
                </div>
                
                {facility.status === 'rejected' && facility.adminComments && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700">
                      <strong>Admin Comments:</strong> {facility.adminComments}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to={`/venues/${facility._id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to={`/owner/facilities/${facility._id}/courts`}>
                      <Settings className="h-4 w-4 mr-1" />
                      Courts
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/owner/facilities/${facility._id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerFacilities;
