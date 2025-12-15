'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  ShoppingBag,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Package,
  Scissors,
  Star,
  ChevronRight,
  Plus,
  FileText
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with real API calls
  const upcomingAppointments = [
    {
      id: '1',
      service: 'Classic Haircut',
      date: '2025-12-20',
      time: '10:00 AM',
      branch: 'Downtown Premium',
      status: 'confirmed'
    },
    {
      id: '2',
      service: 'Beard Trim',
      date: '2025-12-25',
      time: '2:00 PM',
      branch: 'Midtown Elite',
      status: 'confirmed'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2025-12-15',
      items: ['Luxury Shampoo', 'Beard Oil'],
      total: 85,
      status: 'delivered'
    },
    {
      id: 'ORD-002',
      date: '2025-12-10',
      items: ['Styling Wax'],
      total: 28,
      status: 'shipped'
    }
  ];

  const quickStats = {
    totalOrders: 12,
    totalSpent: 456,
    upcomingAppointments: 2,
    favoriteService: 'Classic Haircut'
  };

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push('/customer/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {user.fullName?.split(' ')[0] || 'Customer'}!
          </h1>
          <p className="text-gray-600">Manage your appointments, orders, and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ShoppingBag className="w-8 h-8 text-primary mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-primary">{quickStats.totalOrders}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CreditCard className="w-8 h-8 text-primary mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-primary">${quickStats.totalSpent}</p>
                      <p className="text-sm text-gray-600">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-primary mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-primary">{quickStats.upcomingAppointments}</p>
                      <p className="text-sm text-gray-600">Upcoming Appts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-primary mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-primary">{quickStats.favoriteService}</p>
                      <p className="text-sm text-gray-600">Favorite Service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/services">
                    <Button className="w-full h-20 flex flex-col items-center justify-center bg-secondary hover:bg-secondary/90 text-primary">
                      <Scissors className="w-6 h-6 mb-2" />
                      Book Service
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button className="w-full h-20 flex flex-col items-center justify-center bg-primary hover:bg-primary/90 text-white">
                      <ShoppingBag className="w-6 h-6 mb-2" />
                      Shop Products
                    </Button>
                  </Link>
                  <Link href="/customer/appointments">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                      <Calendar className="w-6 h-6 mb-2" />
                      View Appointments
                    </Button>
                  </Link>
                  <Link href="/customer/forms">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                      <FileText className="w-6 h-6 mb-2" />
                      Digital Forms
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your next scheduled services</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                            <Scissors className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary">{appointment.service}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {appointment.branch}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No upcoming appointments</p>
                    <Link href="/services">
                      <Button>Book Your First Appointment</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>View and manage your service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/customer/appointments">
                  <Button className="w-full">
                    View All Appointments
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>Track your product orders and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/customer/orders">
                  <Button className="w-full">
                    View All Orders
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/customer/profile">
                  <Button className="w-full">
                    Edit Profile
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}