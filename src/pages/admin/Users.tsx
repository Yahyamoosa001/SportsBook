
import React, { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/api/dashboard';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await dashboardApi.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await dashboardApi.toggleUserStatus(userId, !isActive);
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, isActive: !isActive }
          : user
      ));
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'facility_owner': return 'bg-blue-500';
      case 'user': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user._id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Role:</span>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  <Badge variant={user.isActive ? "outline" : "destructive"}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Verified:</span>
                  <Badge variant={user.isVerified ? "outline" : "secondary"}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                  <div>Updated: {new Date(user.updatedAt).toLocaleDateString()}</div>
                </div>

                <Button 
                  size="sm" 
                  variant={user.isActive ? "destructive" : "default"}
                  className="w-full"
                  onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'} User
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUsers;
