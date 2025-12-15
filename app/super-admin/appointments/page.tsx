'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Search, Filter, CheckCircle, XCircle, AlertCircle, Building } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SuperAdminAppointments() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock appointments data across all branches
  const appointments = [
    {
      id: 1,
      customer: "John Doe",
      service: "Classic Haircut",
      staff: "Mike Johnson",
      branch: "Downtown Premium",
      date: "2025-12-15",
      time: "9:00 AM",
      duration: "30 min",
      price: 35,
      status: "completed",
      phone: "(555) 123-4567",
      notes: "Regular customer, prefers fade"
    },
    {
      id: 2,
      customer: "Jane Smith",
      service: "Beard Trim & Shape",
      staff: "Alex Rodriguez",
      branch: "Midtown Elite",
      date: "2025-12-15",
      time: "10:00 AM",
      duration: "20 min",
      price: 25,
      status: "in-progress",
      phone: "(555) 234-5678",
      notes: "First time customer"
    },
    {
      id: 3,
      customer: "Bob Johnson",
      service: "Premium Package",
      staff: "Sarah Chen",
      branch: "Uptown Luxury",
      date: "2025-12-15",
      time: "11:00 AM",
      duration: "90 min",
      price: 85,
      status: "scheduled",
      phone: "(555) 345-6789",
      notes: "VIP customer, special requests"
    },
    {
      id: 4,
      customer: "Alice Brown",
      service: "Haircut & Style",
      staff: "Tom Wilson",
      branch: "Northgate Plaza",
      date: "2025-12-15",
      time: "2:00 PM",
      duration: "45 min",
      price: 50,
      status: "approved",
      phone: "(555) 456-7890",
      notes: "New customer, wants modern style"
    },
    {
      id: 5,
      customer: "Charlie Wilson",
      service: "Hot Towel Shave",
      staff: "Mike Johnson",
      branch: "Downtown Premium",
      date: "2025-12-15",
      time: "3:00 PM",
      duration: "45 min",
      price: 45,
      status: "pending",
      phone: "(555) 567-8901",
      notes: "Regular customer"
    },
    {
      id: 6,
      customer: "Diana Prince",
      service: "Hair Coloring",
      staff: "Emma Davis",
      branch: "Suburban Comfort",
      date: "2025-12-16",
      time: "10:00 AM",
      duration: "90 min",
      price: 120,
      status: "confirmed",
      phone: "(555) 678-9012",
      notes: "Color correction, gray coverage"
    },
    {
      id: 7,
      customer: "Edward Norton",
      service: "Beard Trim",
      staff: "John Smith",
      branch: "Westside Modern",
      date: "2025-12-16",
      time: "11:30 AM",
      duration: "20 min",
      price: 25,
      status: "cancelled",
      phone: "(555) 789-0123",
      notes: "Customer cancelled - emergency"
    },
    {
      id: 8,
      customer: "Fiona Green",
      service: "Styling",
      staff: "Lisa Brown",
      branch: "Eastside Classic",
      date: "2025-12-16",
      time: "1:00 PM",
      duration: "45 min",
      price: 40,
      status: "scheduled",
      phone: "(555) 890-1234",
      notes: "Wedding styling"
    },
    {
      id: 9,
      customer: "George Miller",
      service: "Classic Haircut",
      staff: "David Lee",
      branch: "Southgate Center",
      date: "2025-12-16",
      time: "2:30 PM",
      duration: "30 min",
      price: 35,
      status: "completed",
      phone: "(555) 901-2345",
      notes: "Weekly appointment, same style"
    },
    {
      id: 10,
      customer: "Helen Taylor",
      service: "Facial Treatment",
      staff: "Maria Garcia",
      branch: "Riverside Spa",
      date: "2025-12-17",
      time: "9:00 AM",
      duration: "45 min",
      price: 75,
      status: "in-progress",
      phone: "(555) 012-3456",
      notes: "Sensitive skin treatment"
    },
    {
      id: 11,
      customer: "Ian Cooper",
      service: "Premium Package",
      staff: "Sarah Chen",
      branch: "Uptown Luxury",
      date: "2025-12-17",
      time: "11:00 AM",
      duration: "90 min",
      price: 85,
      status: "approved",
      phone: "(555) 123-4567",
      notes: "Birthday special package"
    },
    {
      id: 12,
      customer: "Julia Adams",
      service: "Beard Trim & Shape",
      staff: "Alex Rodriguez",
      branch: "Midtown Elite",
      date: "2025-12-17",
      time: "1:30 PM",
      duration: "20 min",
      price: 25,
      status: "scheduled",
      phone: "(555) 234-5678",
      notes: "Monthly maintenance"
    },
    {
      id: 13,
      customer: "Kevin Wright",
      service: "Haircut & Style",
      staff: "Tom Wilson",
      branch: "Northgate Plaza",
      date: "2025-12-17",
      time: "3:00 PM",
      duration: "45 min",
      price: 50,
      status: "pending",
      phone: "(555) 345-6789",
      notes: "Corporate client, professional look"
    },
    {
      id: 14,
      customer: "Laura Martinez",
      service: "Hair Coloring",
      staff: "Emma Davis",
      branch: "Suburban Comfort",
      date: "2025-12-18",
      time: "10:00 AM",
      duration: "60 min",
      price: 120,
      status: "confirmed",
      phone: "(555) 456-7890",
      notes: "Highlights and lowlights"
    },
    {
      id: 15,
      customer: "Michael Brown",
      service: "Classic Haircut",
      staff: "Mike Johnson",
      branch: "Downtown Premium",
      date: "2025-12-18",
      time: "11:30 AM",
      duration: "30 min",
      price: 35,
      status: "rejected",
      phone: "(555) 567-8901",
      notes: "Time slot not available"
    },
    {
      id: 16,
      customer: "Nancy Davis",
      service: "Facial Treatment",
      staff: "Lisa Brown",
      branch: "Eastside Classic",
      date: "2025-12-18",
      time: "1:00 PM",
      duration: "45 min",
      price: 75,
      status: "scheduled",
      phone: "(555) 678-9012",
      notes: "Follow-up treatment"
    },
    {
      id: 17,
      customer: "Oliver Johnson",
      service: "Beard Trim",
      staff: "John Smith",
      branch: "Westside Modern",
      date: "2025-12-18",
      time: "2:30 PM",
      duration: "20 min",
      price: 25,
      status: "completed",
      phone: "(555) 789-0123",
      notes: "Quick trim, very busy"
    },
    {
      id: 18,
      customer: "Paula Wilson",
      service: "Premium Package",
      staff: "David Lee",
      branch: "Southgate Center",
      date: "2025-12-19",
      time: "9:30 AM",
      duration: "90 min",
      price: 85,
      status: "in-progress",
      phone: "(555) 890-1234",
      notes: "Special occasion preparation"
    },
    {
      id: 19,
      customer: "Quinn Rodriguez",
      service: "Haircut & Style",
      staff: "Maria Garcia",
      branch: "Riverside Spa",
      date: "2025-12-19",
      time: "12:00 PM",
      duration: "45 min",
      price: 50,
      status: "approved",
      phone: "(555) 901-2345",
      notes: "New style consultation"
    },
    {
      id: 20,
      customer: "Rachel Green",
      service: "Hair Coloring",
      staff: "Sarah Chen",
      branch: "Uptown Luxury",
      date: "2025-12-19",
      time: "2:00 PM",
      duration: "60 min",
      price: 120,
      status: "scheduled",
      phone: "(555) 012-3456",
      notes: "Balayage technique"
    }
  ];

  const branches = [...new Set(appointments.map(apt => apt.branch))];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.staff.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || appointment.branch === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "scheduled": return <Calendar className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
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
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
                  <p className="text-sm text-gray-600">Manage appointments across all branches</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button className="bg-secondary hover:bg-secondary/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  New Appointment
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
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{appointments.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all branches
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {appointments.filter(apt => apt.status === 'completed' && apt.date === '2025-12-01').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Today's completions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {appointments.filter(apt => apt.status === 'scheduled').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upcoming appointments
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${appointments.reduce((acc, apt) => acc + apt.price, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From all appointments
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search appointments..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={branchFilter} onValueChange={setBranchFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.map(branch => (
                          <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Appointments List */}
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{appointment.time}</div>
                            <div className="text-sm text-gray-500">{appointment.date}</div>
                          </div>
                          <div className="border-l pl-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-secondary">{appointment.branch}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900">{appointment.customer}</h3>
                            <p className="text-sm text-gray-600">{appointment.service} with {appointment.staff}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{appointment.duration}</span>
                              <span>${appointment.price}</span>
                              <span>{appointment.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}