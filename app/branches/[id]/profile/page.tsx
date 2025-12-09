'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Shield, Key, Upload, Save, Eye, EyeOff, Building, Star, Clock, Users } from "lucide-react";
import { PermissionProtectedRoute } from "@/components/PermissionProtected";
import { Header } from "@/components/shared/Header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const branchData = {
  downtown: {
    name: "Downtown Premium",
    address: "123 Main Street, Downtown, NY 10001",
    phone: "(555) 123-4567",
    rating: 4.9,
    reviewCount: 247,
    description: "Our flagship location in the heart of downtown, featuring state-of-the-art equipment and our most experienced barbers.",
    manager: "John Admin",
    established: "2023-01-15",
    totalStaff: 8,
    monthlyRevenue: 45000,
    status: "Active"
  },
  // Add other branches...
};

export default function BranchProfile({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const branch = branchData[params.id as keyof typeof branchData];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [profile, setProfile] = useState({
    managerName: branch?.manager || 'John Admin',
    email: user?.email || '',
    phone: branch?.phone || '(555) 123-4567',
    bio: 'Branch manager overseeing daily operations and team performance.',
    address: branch?.address || '123 Main Street, Downtown, NY 10001',
    joinDate: branch?.established || '2023-01-15',
    role: 'Branch Manager',
    branchName: branch?.name || 'Downtown Premium',
    profileImage: null as File | null,
    profileImageUrl: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        profileImage: file,
        profileImageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', profile);
    // Show success message
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Here you would typically change password via API
    console.log('Changing password');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  if (!branch) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Branch Not Found</h1>
          <p className="text-muted-foreground mb-8">The branch you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/branches')}>
            View All Branches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PermissionProtectedRoute requiredPermissions={['settings.view']}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Content */}
        <div className="pt-24 pb-16 px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Branch Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{branch.name} - Profile</h1>
                  <p className="text-gray-600">Manage branch information and personal settings</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {branch.rating}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {branch.totalStaff} Staff
                  </Badge>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>

              {/* Branch Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-lg font-semibold">{branch.rating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Staff</p>
                        <p className="text-lg font-semibold">{branch.totalStaff}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Established</p>
                        <p className="text-lg font-semibold">{new Date(branch.established).getFullYear()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-lg font-semibold text-green-600">{branch.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>

            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Account
                </TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Picture Card */}
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg">Profile Picture</CardTitle>
                      <CardDescription>Upload a profile image</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src={profile.profileImageUrl} alt="Profile" />
                          <AvatarFallback className="text-2xl">
                            {profile.managerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 w-full">
                          <Label htmlFor="profile-image" className="cursor-pointer">
                            <div className="flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Image
                            </div>
                          </Label>
                          <Input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <p className="text-xs text-gray-500 text-center">
                            JPG, PNG or GIF. Max size 5MB.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personal Details Card */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="managerName">Full Name</Label>
                          <Input
                            id="managerName"
                            value={profile.managerName}
                            onChange={(e) => handleProfileChange('managerName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => handleProfileChange('email', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              value={profile.phone}
                              onChange={(e) => handleProfileChange('phone', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="branchName">Branch Name</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="branchName"
                              value={profile.branchName}
                              onChange={(e) => handleProfileChange('branchName', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Branch Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Textarea
                            id="address"
                            value={profile.address}
                            onChange={(e) => handleProfileChange('address', e.target.value)}
                            className="pl-10"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleSaveProfile} className="bg-secondary hover:bg-secondary/90">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Contains at least one uppercase letter</li>
                        <li>• Contains at least one lowercase letter</li>
                        <li>• Contains at least one number</li>
                        <li>• Contains at least one special character</li>
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleChangePassword} className="bg-secondary hover:bg-secondary/90">
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Information */}
              <TabsContent value="account">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Your account details and branch information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{profile.role}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Branch</Label>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Building className="w-4 h-4 text-green-600" />
                            <span className="font-medium">{profile.branchName}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Member Since</Label>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">
                              {new Date(profile.joinDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Account Status</Label>
                          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-green-700">Active</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Branch Performance</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-900">Rating</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">{branch.rating}</p>
                            <p className="text-sm text-blue-600">{branch.reviewCount} reviews</p>
                          </div>
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-900">Staff</span>
                            </div>
                            <p className="text-2xl font-bold text-green-700">{branch.totalStaff}</p>
                            <p className="text-sm text-green-600">Active members</p>
                          </div>
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-purple-600" />
                              <span className="font-medium text-purple-900">Established</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-700">{new Date(branch.established).getFullYear()}</p>
                            <p className="text-sm text-purple-600">Years in service</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Actions</CardTitle>
                      <CardDescription>Manage your account settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Login Sessions</h4>
                          <p className="text-sm text-gray-600">Manage your active login sessions</p>
                        </div>
                        <Button variant="outline">View Sessions</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Branch Settings</h4>
                          <p className="text-sm text-gray-600">Configure branch-specific settings</p>
                        </div>
                        <Button variant="outline">Branch Settings</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-red-600">Delete Account</h4>
                          <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PermissionProtectedRoute>
  );
}