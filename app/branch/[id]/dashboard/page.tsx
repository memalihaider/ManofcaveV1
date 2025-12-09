'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, TrendingUp, Clock, Scissors, Star, LogOut, Settings, User } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function BranchDashboard() {
  const router = useRouter();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock branch data - in real app, this would come from API based on branch ID
  const branchData = {
    id: params.id,
    name: "Downtown Premium", // This would be dynamic based on branch ID
    location: "123 Main St, Downtown",
    manager: "Sarah Johnson",
    todayRevenue: 450,
    todayBookings: 12,
    totalStaff: 8,
    avgRating: 4.8,
    nextBooking: {
      time: "2:30 PM",
      customer: "John Smith",
      service: "Haircut & Styling"
    },
    todaysBookings: [
      { id: 1, time: "9:00 AM", customer: "Alice Johnson", service: "Haircut", status: "completed" },
      { id: 2, time: "10:30 AM", customer: "Bob Wilson", service: "Beard Grooming", status: "completed" },
      { id: 3, time: "2:30 PM", customer: "John Smith", service: "Haircut & Styling", status: "upcoming" },
      { id: 4, time: "4:00 PM", customer: "Mike Davis", service: "Premium Package", status: "upcoming" },
    ]
  };

  useEffect(() => {
    // Check if user is authenticated for this branch
    const branchAuth = localStorage.getItem('branchAuth');
    if (!branchAuth) {
      router.push('/branch');
      return;
    }

    const authData = JSON.parse(branchAuth);
    if (authData.branchId !== params.id) {
      router.push('/branch');
      return;
    }
  }, [params.id, router]);

  const handleLogout = () => {
    localStorage.removeItem('branchAuth');
    router.push('/branch');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-primary text-white">
            <h2 className="text-lg font-semibold">Branch Portal</h2>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(`/branch/${params.id}/dashboard`)}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(`/branch/${params.id}/bookings`)}>
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(`/branch/${params.id}/staff`)}>
              <Users className="w-4 h-4 mr-2" />
              Staff
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(`/branch/${params.id}/services`)}>
              <Scissors className="w-4 h-4 mr-2" />
              Services
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(`/branch/${params.id}/settings`)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </nav>

          <div className="p-4 border-t">
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b lg:ml-0">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <User className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{branchData.name}</h1>
                <p className="text-sm text-gray-600">{branchData.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Manager: {branchData.manager}</span>
              <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {/* Today's Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${branchData.todayRevenue}</div>
                <p className="text-xs text-muted-foreground">
                  +15% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{branchData.todayBookings}</div>
                <p className="text-xs text-muted-foreground">
                  4 more scheduled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{branchData.totalStaff}</div>
                <p className="text-xs text-muted-foreground">
                  All staff present
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{branchData.avgRating}</div>
                <p className="text-xs text-muted-foreground">
                  ⭐⭐⭐⭐⭐
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Next Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Next Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <div className="text-3xl font-bold text-secondary mb-2">{branchData.nextBooking.time}</div>
                  <div className="text-lg font-semibold mb-1">{branchData.nextBooking.customer}</div>
                  <div className="text-gray-600 mb-4">{branchData.nextBooking.service}</div>
                  <Button className="bg-secondary hover:bg-secondary/90">
                    Start Service
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  All bookings for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {branchData.todaysBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">{booking.time}</div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {booking.customer} - {booking.service}
                        </div>
                      </div>
                      {booking.status === 'upcoming' && (
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common branch management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col gap-2 bg-secondary hover:bg-secondary/90">
                  <Calendar className="w-6 h-6" />
                  <span className="text-xs">New Booking</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span className="text-xs">Manage Staff</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Scissors className="w-6 h-6" />
                  <span className="text-xs">Services</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-xs">Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}