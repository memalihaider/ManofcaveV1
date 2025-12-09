'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Calendar, Shield, Key, Upload, Save, Eye, EyeOff, Building } from "lucide-react";
import { PermissionProtectedRoute } from "@/components/PermissionProtected";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SuperAdminProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [profile, setProfile] = useState({
    firstName: 'Super',
    lastName: 'Admin',
    email: user?.email || '',
    phone: '+1 (555) 987-6543',
    bio: 'Super administrator overseeing all branches and system operations.',
    address: '456 Corporate Blvd, Headquarters, NY 10002',
    dateOfBirth: '1985-03-20',
    joinDate: '2022-06-01',
    role: 'Super Admin',
    organization: 'Premium Cuts Inc.',
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

  return (
    <PermissionProtectedRoute requiredPermissions={['settings.view']}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-sm text-gray-600">Manage your personal information and account settings</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-8">
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
                              {profile.firstName[0]}{profile.lastName[0]}
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
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profile.firstName}
                              onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profile.lastName}
                              onChange={(e) => handleProfileChange('lastName', e.target.value)}
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
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="dateOfBirth"
                                type="date"
                                value={profile.dateOfBirth}
                                onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="joinDate">Join Date</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="joinDate"
                                type="date"
                                value={profile.joinDate}
                                onChange={(e) => handleProfileChange('joinDate', e.target.value)}
                                className="pl-10"
                                disabled
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
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
                        <CardDescription>Your account details and permissions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                              <Shield className="w-4 h-4 text-red-600" />
                              <span className="font-medium">{profile.role}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Organization</Label>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                              <Building className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">{profile.organization}</span>
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
                          <Label>System Access Level</Label>
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-5 h-5 text-red-600" />
                              <span className="font-medium text-red-900">Super Administrator</span>
                            </div>
                            <p className="text-sm text-red-800">
                              Full system access including all branches, user management, system settings, and administrative controls.
                            </p>
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
                            <h4 className="font-medium">System Audit Logs</h4>
                            <p className="text-sm text-gray-600">View system activity and changes</p>
                          </div>
                          <Button variant="outline">View Audit Logs</Button>
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
      </div>
    </PermissionProtectedRoute>
  );
}