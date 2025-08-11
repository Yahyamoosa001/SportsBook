
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '@/lib/api/dashboard';
import { DashboardStats, Facility } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, CreditCard, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingFacilities, setPendingFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, pendingData] = await Promise.all([
          dashboardApi.getAdminStats(),
          dashboardApi.getPendingFacilities()
        ]);
        
        setStats(statsData);
        setPendingFacilities(pendingData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleFacilityApproval = async (facilityId: string, approved: boolean, comments?: string) => {
    try {
      await dashboardApi.approveFacility(facilityId, approved, comments);
      setPendingFacilities(prev => prev.filter(f => f._id !== facilityId));
      toast.success(`Facility ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating facility status:', error);
      toast.error('Failed to update facility status');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/facilities">Manage Facilities</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/users">Manage Users</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.facilityCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.userCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalRevenue || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Facilities */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Facility Approvals ({pendingFacilities.length})
            </CardTitle>
            <Button asChild variant="outline">
              <Link to="/admin/facilities">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pendingFacilities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingFacilities.slice(0, 5).map((facility) => (
                <div key={facility._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{facility.name}</h3>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>{facility.location.city}, {facility.location.state}</div>
                      <div>Sports: {facility.sportsTypes.join(', ')}</div>
                      <div>Created: {new Date(facility.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleFacilityApproval(facility._id, false, 'Rejected by admin')}
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleFacilityApproval(facility._id, true)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
