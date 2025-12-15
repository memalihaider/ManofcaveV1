'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, MapPin, Phone, Mail, Clock, ArrowLeft, Save } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AddNewBranch() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBack = () => {
    router.push('/super-admin/branches');
  };

  const handleSave = () => {
    // In a real app, this would save the branch data to the API
    // For now, just navigate back to branches list
    router.push('/super-admin/branches');
  };

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    manager: '',
    phone: '',
    email: '',
    password: '',
    description: '',
    status: 'active',
    monday: { open: '09:00', close: '20:00' },
    tuesday: { open: '09:00', close: '20:00' },
    wednesday: { open: '09:00', close: '20:00' },
    thursday: { open: '09:00', close: '20:00' },
    friday: { open: '09:00', close: '21:00' },
    saturday: { open: '08:00', close: '21:00' },
    sunday: { open: '10:00', close: '18:00' }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (day: string, type: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev] as any,
        [type]: value
      }
    }));
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar
          role="super_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar
                  role="super_admin"
                  onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <Button variant="ghost" onClick={handleBack} className="mr-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Branches
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Add New Branch</h1>
                  <p className="text-sm text-gray-600">Create a new branch location</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Branch
                </Button>
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
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Enter the basic details for the new branch
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Branch Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g., Downtown Premium"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., 123 Main St, Downtown"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="manager">Branch Manager</Label>
                        <Input
                          id="manager"
                          placeholder="e.g., Sarah Johnson"
                          value={formData.manager}
                          onChange={(e) => handleInputChange('manager', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="maintenance">Under Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of the branch..."
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={3}
                        />
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
                        Contact details for the branch
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="email">Branch Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="branch@premiumcuts.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="password">Portal Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Secure password for branch portal"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This password will be used for branch portal login
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g., downtown@premiumcuts.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Operating Hours */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Operating Hours
                    </CardTitle>
                    <CardDescription>
                      Set the operating hours for each day of the week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(formData).filter(([key]) =>
                        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key)
                      ).map(([day, hours]: [string, any]) => (
                        <div key={day} className="space-y-2">
                          <Label className="capitalize font-medium">{day}</Label>
                          <div className="flex gap-2">
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                              className="flex-1"
                            />
                            <span className="self-center text-gray-500">to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <Button variant="outline" onClick={handleBack}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Create Branch
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}