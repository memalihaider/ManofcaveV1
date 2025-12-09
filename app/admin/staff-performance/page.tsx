'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Star,
  Clock,
  Calendar,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  Scissors,
  Award,
  Target,
  Activity,
  Timer,
  CalendarDays,
  RefreshCw,
  X
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';

interface StaffPerformance {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  totalBookings: number;
  completedServices: number;
  pendingServices: number;
  cancelledServices: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  monthlyTarget: number;
  monthlyProgress: number;
  todaysBookings: number;
  weeklyBookings: number;
  monthlyBookings: number;
  specialization: string[];
  performance: {
    thisMonth: {
      bookings: number;
      revenue: number;
      rating: number;
    };
    lastMonth: {
      bookings: number;
      revenue: number;
      rating: number;
    };
  };
  recentBookings: {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    status: 'completed' | 'pending' | 'cancelled';
    amount: number;
  }[];
}

export default function StaffPerformancePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffPerformance | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mock staff performance data
  const staffPerformanceData: StaffPerformance[] = [
    {
      id: '1',
      name: 'Mike Johnson',
      role: 'Senior Barber',
      totalBookings: 284,
      completedServices: 267,
      pendingServices: 12,
      cancelledServices: 5,
      totalRevenue: 18250,
      averageRating: 4.9,
      totalReviews: 156,
      monthlyTarget: 80,
      monthlyProgress: 75,
      todaysBookings: 8,
      weeklyBookings: 42,
      monthlyBookings: 75,
      specialization: ['Classic Haircut', 'Beard Trim', 'Hot Towel Shave'],
      performance: {
        thisMonth: { bookings: 75, revenue: 4850, rating: 4.9 },
        lastMonth: { bookings: 68, revenue: 4420, rating: 4.8 }
      },
      recentBookings: [
        { id: 'B001', customerName: 'John Doe', service: 'Classic Haircut', date: '2024-12-04', time: '10:00 AM', status: 'completed', amount: 25 },
        { id: 'B002', customerName: 'Jane Smith', service: 'Beard Trim', date: '2024-12-04', time: '11:30 AM', status: 'completed', amount: 15 },
        { id: 'B003', customerName: 'Bob Wilson', service: 'Haircut + Beard', date: '2024-12-04', time: '2:00 PM', status: 'pending', amount: 35 }
      ]
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Hair Stylist',
      totalBookings: 198,
      completedServices: 185,
      pendingServices: 8,
      cancelledServices: 5,
      totalRevenue: 15680,
      averageRating: 4.8,
      totalReviews: 124,
      monthlyTarget: 60,
      monthlyProgress: 82,
      todaysBookings: 6,
      weeklyBookings: 35,
      monthlyBookings: 49,
      specialization: ['Hair Color', 'Hair Wash', 'Styling'],
      performance: {
        thisMonth: { bookings: 49, revenue: 3890, rating: 4.8 },
        lastMonth: { bookings: 42, revenue: 3340, rating: 4.7 }
      },
      recentBookings: [
        { id: 'B004', customerName: 'Alice Brown', service: 'Hair Color', date: '2024-12-04', time: '9:00 AM', status: 'completed', amount: 45 },
        { id: 'B005', customerName: 'Emma Davis', service: 'Hair Wash', date: '2024-12-04', time: '1:00 PM', status: 'completed', amount: 10 }
      ]
    },
    {
      id: '3',
      name: 'Alex Rodriguez',
      role: 'Barber',
      totalBookings: 156,
      completedServices: 142,
      pendingServices: 10,
      cancelledServices: 4,
      totalRevenue: 11350,
      averageRating: 4.7,
      totalReviews: 98,
      monthlyTarget: 50,
      monthlyProgress: 68,
      todaysBookings: 5,
      weeklyBookings: 28,
      monthlyBookings: 34,
      specialization: ['Classic Haircut', 'Beard Trim'],
      performance: {
        thisMonth: { bookings: 34, revenue: 2480, rating: 4.7 },
        lastMonth: { bookings: 29, revenue: 2110, rating: 4.6 }
      },
      recentBookings: [
        { id: 'B006', customerName: 'Charlie Wilson', service: 'Classic Haircut', date: '2024-12-04', time: '3:00 PM', status: 'pending', amount: 25 }
      ]
    },
    {
      id: '4',
      name: 'Lisa Park',
      role: 'Apprentice',
      totalBookings: 89,
      completedServices: 78,
      pendingServices: 8,
      cancelledServices: 3,
      totalRevenue: 6240,
      averageRating: 4.5,
      totalReviews: 45,
      monthlyTarget: 30,
      monthlyProgress: 45,
      todaysBookings: 3,
      weeklyBookings: 15,
      monthlyBookings: 13,
      specialization: ['Hair Wash', 'Basic Styling'],
      performance: {
        thisMonth: { bookings: 13, revenue: 920, rating: 4.5 },
        lastMonth: { bookings: 11, revenue: 780, rating: 4.4 }
      },
      recentBookings: [
        { id: 'B007', customerName: 'Diana Prince', service: 'Hair Wash', date: '2024-12-04', time: '4:00 PM', status: 'pending', amount: 10 }
      ]
    }
  ];

  const filteredStaff = staffPerformanceData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || staff.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Excel Export Function
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Staff Performance Overview
    const overviewData = [
      ['Staff Performance Report', ''],
      ['Generated on', new Date().toLocaleDateString()],
      ['Time Period', timeRange],
      ['', ''],
      ['Staff Member', 'Role', 'Total Bookings', 'Completed', 'Pending', 'Cancelled', 'Revenue', 'Rating', 'Monthly Progress %'],
      ...staffPerformanceData.map(staff => [
        staff.name,
        staff.role,
        staff.totalBookings,
        staff.completedServices,
        staff.pendingServices,
        staff.cancelledServices,
        staff.totalRevenue,
        staff.averageRating,
        staff.monthlyProgress
      ])
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Staff_Overview');

    // Detailed Performance Sheet
    const detailedData = [
      ['Detailed Staff Performance', ''],
      ['Staff Member', 'This Month Bookings', 'This Month Revenue', 'Last Month Bookings', 'Last Month Revenue', 'Growth %', 'Target Achievement %'],
      ...staffPerformanceData.map(staff => {
        const bookingGrowth = ((staff.performance.thisMonth.bookings - staff.performance.lastMonth.bookings) / staff.performance.lastMonth.bookings * 100);
        return [
          staff.name,
          staff.performance.thisMonth.bookings,
          staff.performance.thisMonth.revenue,
          staff.performance.lastMonth.bookings,
          staff.performance.lastMonth.revenue,
          bookingGrowth.toFixed(1) + '%',
          staff.monthlyProgress + '%'
        ];
      })
    ];
    const detailedSheet = XLSX.utils.aoa_to_sheet(detailedData);
    XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed_Performance');

    // Generate and download the file
    const fileName = `Staff_Performance_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <ProtectedRoute requiredRole="branch_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-0" : "lg:ml-1"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Staff Performance</h1>
                  <p className="text-sm text-gray-600">Monitor employee duties and service performance</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="senior barber">Senior Barber</SelectItem>
                    <SelectItem value="hair stylist">Hair Stylist</SelectItem>
                    <SelectItem value="barber">Barber</SelectItem>
                    <SelectItem value="apprentice">Apprentice</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportToExcel}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4" />
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
              {/* Performance Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{staffPerformanceData.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Active employees
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {staffPerformanceData.reduce((sum, staff) => sum + staff.totalBookings, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All time bookings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(staffPerformanceData.reduce((sum, staff) => sum + staff.monthlyProgress, 0) / staffPerformanceData.length)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Monthly target achievement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${staffPerformanceData.reduce((sum, staff) => sum + staff.totalRevenue, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Generated by staff
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Staff Performance Table */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Staff Performance Overview</CardTitle>
                  <CardDescription>Detailed performance metrics for all staff members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Total Bookings</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Pending</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Monthly Progress</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={staff.avatar} />
                                <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-gray-500">{staff.specialization.join(', ')}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{staff.role}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{staff.totalBookings}</TableCell>
                          <TableCell>
                            <span className="text-green-600 font-semibold">{staff.completedServices}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-yellow-600 font-semibold">{staff.pendingServices}</span>
                          </TableCell>
                          <TableCell className="font-semibold">${staff.totalRevenue}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{staff.averageRating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{staff.monthlyProgress}%</span>
                                <span className="text-gray-500">of {staff.monthlyTarget}</span>
                              </div>
                              <Progress value={staff.monthlyProgress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStaff(staff)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Staff Detail Modal */}
              {selectedStaff && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={selectedStaff.avatar} />
                          <AvatarFallback className="text-lg">
                            {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl">{selectedStaff.name}</CardTitle>
                          <CardDescription className="text-lg">{selectedStaff.role}</CardDescription>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{selectedStaff.averageRating}</span>
                              <span className="text-gray-600">({selectedStaff.totalReviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStaff(null)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Performance Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedStaff.totalBookings}</div>
                        <div className="text-sm text-blue-700">Total Bookings</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedStaff.completedServices}</div>
                        <div className="text-sm text-green-700">Completed Services</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{selectedStaff.pendingServices}</div>
                        <div className="text-sm text-yellow-700">Pending Services</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">${selectedStaff.totalRevenue}</div>
                        <div className="text-sm text-purple-700">Total Revenue</div>
                      </div>
                    </div>

                    {/* Monthly Performance Comparison */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">This Month</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm">Bookings:</span>
                                <span className="font-semibold">{selectedStaff.performance.thisMonth.bookings}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Revenue:</span>
                                <span className="font-semibold">${selectedStaff.performance.thisMonth.revenue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Rating:</span>
                                <span className="font-semibold">{selectedStaff.performance.thisMonth.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Last Month</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm">Bookings:</span>
                                <span className="font-semibold">{selectedStaff.performance.lastMonth.bookings}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Revenue:</span>
                                <span className="font-semibold">${selectedStaff.performance.lastMonth.revenue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Rating:</span>
                                <span className="font-semibold">{selectedStaff.performance.lastMonth.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Recent Bookings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedStaff.recentBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-mono">{booking.id}</TableCell>
                              <TableCell>{booking.customerName}</TableCell>
                              <TableCell>{booking.service}</TableCell>
                              <TableCell>{booking.date} at {booking.time}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell>${booking.amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Specialization */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Specialization</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStaff.specialization.map((spec, index) => (
                          <Badge key={index} variant="secondary">
                            <Scissors className="w-3 h-3 mr-1" />
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}