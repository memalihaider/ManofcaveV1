'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Users, DollarSign, TrendingUp, Star, ArrowLeft, Edit, Settings } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";

export default function BranchDetails() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBack = () => {
    router.push('/super-admin');
  };

  // Mock branch data - in real app, this would come from API based on params.id
  const branch = {
    id: 1,
    name: "Downtown Premium",
    location: "123 Main St, Downtown",
    manager: "Sarah Johnson",
    phone: "(555) 123-4567",
    email: "downtown@premiumcuts.com",
    password: "Dt2025!Secure",
    employees: 8,
    revenue: 8920,
    customers: 234,
    rating: 4.9,
    status: "active",
    performance: "excellent",
    image: "https://picsum.photos/400/250?random=1",
    description: "Our flagship location in the heart of downtown, offering premium grooming services with state-of-the-art facilities.",
    operatingHours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 9:00 PM",
      saturday: "8:00 AM - 9:00 PM",
      sunday: "10:00 AM - 6:00 PM"
    },
    services: ["Haircut & Styling", "Beard Grooming", "Premium Packages", "Consultations"],
    recentBookings: [
      { id: 1, customer: "John Doe", service: "Haircut & Styling", time: "2 hours ago", amount: 35 },
      { id: 2, customer: "Mike Smith", service: "Beard Grooming", time: "4 hours ago", amount: 25 },
      { id: 3, customer: "Alex Johnson", service: "Premium Package", time: "6 hours ago", amount: 65 }
    ],
    portalAccess: true,
    lastLogin: "2025-12-04 14:30"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{branch.name}</h1>
                  <p className="text-sm text-gray-600">Branch Details & Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Branch
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
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
              {/* Branch Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Branch Image & Basic Info */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3">
                          <img
                            src={branch.image}
                            alt={branch.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">{branch.name}</h2>
                            <Badge className={getStatusColor(branch.status)}>
                              {branch.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{branch.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{branch.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{branch.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{branch.employees} employees</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{branch.rating} rating</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-secondary">${branch.revenue.toLocaleString()}</div>
                      <p className="text-sm text-gray-500">+12% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-secondary">{branch.customers}</div>
                      <p className="text-sm text-gray-500">This month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-secondary">{branch.rating}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(branch.rating) ? 'fill-secondary text-secondary' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Operating Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle>Operating Hours</CardTitle>
                    <CardDescription>Current schedule for this location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(branch.operatingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize font-medium">{day}:</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Services Offered */}
                <Card>
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                    <CardDescription>Available services at this branch</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {branch.services.map((service) => (
                        <Badge key={service} variant="secondary" className="px-3 py-1">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Branch Portal Credentials */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Branch Portal Credentials</CardTitle>
                  <CardDescription>Login credentials for branch portal access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Portal Email</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md font-mono text-sm">
                          {branch.email}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Portal Password</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md font-mono text-sm">
                          {branch.password}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Portal Access</label>
                        <div className="mt-1">
                          <Badge variant={branch.portalAccess ? "default" : "secondary"} className={branch.portalAccess ? "bg-green-100 text-green-800" : ""}>
                            {branch.portalAccess ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Last Login</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                          {branch.lastLogin}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" size="sm">
                      Reset Password
                    </Button>
                    <Button variant={branch.portalAccess ? "destructive" : "default"} size="sm">
                      {branch.portalAccess ? "Disable Portal Access" : "Enable Portal Access"}
                    </Button>
                    <Button variant="outline" size="sm">
                      Send Login Credentials
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest appointments at this branch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {branch.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{booking.customer}</p>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <p className="text-xs text-gray-500">{booking.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-secondary">${booking.amount}</p>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}