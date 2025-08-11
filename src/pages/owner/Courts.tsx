import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { facilitiesApi } from '@/lib/api/facilities';
import { Court, Facility } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Courts: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    description: ''
  });

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
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load court data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [facilityId]);

  const resetForm = () => {
    setFormData({
      name: '',
      sportType: '',
      pricePerHour: '',
      description: ''
    });
    setEditingCourt(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (court: Court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      sportType: court.sportType,
      pricePerHour: court.pricePerHour.toString(),
      description: court.description || ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!facilityId || !formData.name || !formData.sportType || !formData.pricePerHour) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const courtData = {
        name: formData.name,
        sportType: formData.sportType,
        pricePerHour: parseFloat(formData.pricePerHour),
        description: formData.description
      };

      if (editingCourt) {
        const updatedCourt = await facilitiesApi.updateCourt(editingCourt._id, courtData);
        setCourts(prev => prev.map(court => 
          court._id === editingCourt._id ? updatedCourt : court
        ));
        toast.success('Court updated successfully');
      } else {
        const newCourt = await facilitiesApi.createCourt(facilityId, courtData);
        setCourts(prev => [...prev, newCourt]);
        toast.success('Court created successfully');
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save court');
    }
  };

  const handleDelete = async (courtId: string) => {
    if (!confirm('Are you sure you want to delete this court?')) return;

    try {
      await facilitiesApi.deleteCourt(courtId);
      setCourts(prev => prev.filter(court => court._id !== courtId));
      toast.success('Court deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete court');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Facility not found</h1>
          <Button onClick={() => navigate('/owner/facilities')}>
            Back to Facilities
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
          onClick={() => navigate('/owner/facilities')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Facilities
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{facility.name} - Courts</h1>
          <p className="text-muted-foreground">Manage courts and pricing</p>
        </div>
      </div>

      {/* Add Court Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Courts ({courts.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Court
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCourt ? 'Edit Court' : 'Add New Court'}
              </DialogTitle>
              <DialogDescription>
                {editingCourt ? 'Update court details' : 'Create a new court for this facility'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Court Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="e.g., Court 1, Main Court"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sportType">Sport Type *</Label>
                  <Select 
                    value={formData.sportType} 
                    onValueChange={(value) => setFormData(prev => ({...prev, sportType: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport type" />
                    </SelectTrigger>
                    <SelectContent>
                      {facility.sportsTypes.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pricePerHour">Price per Hour (₹) *</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData(prev => ({...prev, pricePerHour: e.target.value}))}
                    placeholder="500"
                    min="0"
                    step="50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Court details, special features..."
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCourt ? 'Update Court' : 'Create Court'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courts List */}
      {courts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No courts created yet</p>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Court
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <Card key={court._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{court.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditDialog(court)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(court._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{court.sportType}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    ₹{court.pricePerHour}/hour
                  </span>
                </div>
                {court.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {court.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(court.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courts;
