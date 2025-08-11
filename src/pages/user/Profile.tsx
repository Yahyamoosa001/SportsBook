
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Calendar, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileForm {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'edit'>('bookings');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileForm>({
    name: user?.name || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
  });

  // Mock bookings data
  const mockBookings = [
    {
      id: 1,
      venue: 'Skyline Badminton Court (badminton)',
      date: '18 June 2025',
      time: '5:00 PM - 6:00 PM',
      status: 'Confirmed',
      method: 'Online',
      type: 'Future Booking'
    },
    {
      id: 2,
      venue: 'Skyline Badminton Court (badminton)',
      date: '10 June 2025',
      time: '5:00 PM - 6:00 PM',
      status: 'Confirmed',
      method: 'Online',
      type: 'Future Booking'
    }
  ];

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this would call an API to update the profile
      console.log('Updating profile:', formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      oldPassword: '',
      newPassword: '',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded"></div>
            <span className="font-bold text-lg">QUICKCOURT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Michell Admin</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <Card className="p-6">
              <div className="text-center mb-6">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.role}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              
              <div className="space-y-2">
                <Button
                  variant={activeTab === 'edit' ? 'default' : 'ghost'}
                  className="w-full justify-start bg-green-100 text-green-700 hover:bg-green-200"
                  onClick={() => setActiveTab('edit')}
                >
                  Edit Profile
                </Button>
                <Button
                  variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('bookings')}
                >
                  All Bookings
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {activeTab === 'bookings' ? (
              <Card className="p-6">
                <div className="flex gap-2 mb-6">
                  <Button variant="outline" size="sm" className="bg-green-100 text-green-700">
                    All Bookings
                  </Button>
                  <Button variant="outline" size="sm">
                    Cancelled
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{booking.venue}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {booking.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Status:</span>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div>{booking.method}</div>
                          <div className="text-blue-600">[{booking.type}]</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  No cancel booking button for past dates
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column - Profile Info */}
                  <div>
                    <div className="text-center mb-6">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.role}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="w-full">
                        All Bookings
                      </Button>
                    </div>
                  </div>

                  {/* Right Column - Edit Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Old Password</label>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? 'text' : 'password'}
                          value={formData.oldPassword}
                          onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                          className="rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showOldPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          className="rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 rounded-lg"
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 rounded-lg bg-green-600 hover:bg-green-700"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
