
import React, { useState, useEffect } from 'react';
import { facilitiesApi } from '@/lib/api/facilities';
import { dashboardApi } from '@/lib/api/dashboard';
import { Facility } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';

const AdminFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [comments, setComments] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await facilitiesApi.getFacilities();
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

  const handleFacilityAction = async (facilityId: string, approved: boolean) => {
    try {
      await dashboardApi.approveFacility(facilityId, approved, comments);
      setFacilities(prev => prev.map(facility => 
        facility._id === facilityId 
          ? { 
              ...facility, 
              status: approved ? 'approved' as const : 'rejected' as const,
              adminComments: comments 
            }
          : facility
      ));
      toast.success(`Facility ${approved ? 'approved' : 'rejected'} successfully`);
      setDialogOpen(false);
      setComments('');
      setSelectedFacility(null);
    } catch (error) {
      console.error('Error updating facility status:', error);
      toast.error('Failed to update facility status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const openDialog = (facility: Facility) => {
    setSelectedFacility(facility);
    setComments(facility.adminComments || '');
    setDialogOpen(true);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Facilities</h1>

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

              <div className="text-sm text-muted-foreground mb-4">
                <div>Created: {new Date(facility.createdAt).toLocaleDateString()}</div>
                <div>Updated: {new Date(facility.updatedAt).toLocaleDateString()}</div>
              </div>
              
              {facility.adminComments && (
                <div className="mb-4 p-3 bg-muted rounded">
                  <p className="text-sm">
                    <strong>Admin Comments:</strong> {facility.adminComments}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => openDialog(facility)}
                >
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review Facility</DialogTitle>
            <DialogDescription>
              {selectedFacility?.name} - {selectedFacility?.location.city}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Comments</label>
              <Textarea
                placeholder="Add comments for facility owner..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => selectedFacility && handleFacilityAction(selectedFacility._id, false)}
            >
              Reject
            </Button>
            <Button 
              onClick={() => selectedFacility && handleFacilityAction(selectedFacility._id, true)}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFacilities;
