'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PermissionProtectedRoute, PermissionProtectedSection } from "@/components/PermissionProtected";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  FileText,
  Star,
  MessageSquare,
  Award,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  RefreshCw,
  X
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  totalSpent: number;
  totalBookings: number;
  joinDate: string;
  lastVisit: string;
  status: 'active' | 'inactive';
}

interface Booking {
  id: string;
  date: string;
  service: string;
  staff: string;
  status: 'completed' | 'cancelled' | 'no-show';
  amount: number;
  pointsEarned: number;
}

interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  bookingId: string;
  rating: number;
  message: string;
  response?: string;
  responseDate?: string;
  date: string;
  status: 'pending' | 'responded';
}

export default function AdminReports() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mock data - in real app, this would come from API
  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      loyaltyPoints: 250,
      totalSpent: 450.00,
      totalBookings: 8,
      joinDate: '2024-01-15',
      lastVisit: '2024-12-01',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 234-5678',
      loyaltyPoints: 180,
      totalSpent: 320.00,
      totalBookings: 6,
      joinDate: '2024-03-20',
      lastVisit: '2024-11-28',
      status: 'active'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      phone: '+1 (555) 345-6789',
      loyaltyPoints: 95,
      totalSpent: 180.00,
      totalBookings: 4,
      joinDate: '2024-06-10',
      lastVisit: '2024-10-15',
      status: 'inactive'
    }
  ];

  const customerBookings: Booking[] = [
    {
      id: 'B001',
      date: '2024-12-01',
      service: 'Premium Haircut',
      staff: 'Mike Johnson',
      status: 'completed',
      amount: 45.00,
      pointsEarned: 45
    },
    {
      id: 'B002',
      date: '2024-11-15',
      service: 'Beard Trim',
      staff: 'Alex Chen',
      status: 'completed',
      amount: 25.00,
      pointsEarned: 25
    },
    {
      id: 'B003',
      date: '2024-10-20',
      service: 'Haircut + Beard',
      staff: 'Mike Johnson',
      status: 'completed',
      amount: 55.00,
      pointsEarned: 55
    }
  ];

  const feedbackData: Feedback[] = [
    {
      id: 'F001',
      customerId: '1',
      customerName: 'John Doe',
      bookingId: 'B001',
      rating: 5,
      message: 'Excellent service! Mike did a great job with my haircut.',
      response: 'Thank you for your kind words, John! We\'re glad you enjoyed your experience.',
      responseDate: '2024-12-01',
      date: '2024-12-01',
      status: 'responded'
    },
    {
      id: 'F002',
      customerId: '2',
      customerName: 'Jane Smith',
      bookingId: 'B002',
      rating: 4,
      message: 'Good service overall, but the wait time was a bit long.',
      response: 'We apologize for the wait time, Jane. We\'re working on improving our scheduling system.',
      responseDate: '2024-11-15',
      date: '2024-11-15',
      status: 'responded'
    },
    {
      id: 'F003',
      customerId: '1',
      customerName: 'John Doe',
      bookingId: 'B003',
      rating: 3,
      message: 'Service was okay, but I expected better styling.',
      date: '2024-10-20',
      status: 'pending'
    }
  ];

  const loyaltyPointsHistory = [
    {
      id: 'LP001',
      customerId: '1',
      type: 'earned',
      points: 25,
      description: 'Booking: Classic Haircut',
      date: '2024-12-01',
      bookingId: 'B001'
    },
    {
      id: 'LP002',
      customerId: '1',
      type: 'earned',
      points: 55,
      description: 'Booking: Haircut + Beard',
      date: '2024-10-20',
      bookingId: 'B003'
    },
    {
      id: 'LP003',
      customerId: '1',
      type: 'redeemed',
      points: -50,
      description: 'Redeemed for 10% discount',
      date: '2024-11-15',
      bookingId: null
    },
    {
      id: 'LP004',
      customerId: '1',
      type: 'bonus',
      points: 10,
      description: 'Birthday bonus points',
      date: '2024-11-01',
      bookingId: null
    },
    {
      id: 'LP005',
      customerId: '2',
      type: 'earned',
      points: 35,
      description: 'Booking: Hair Color',
      date: '2024-11-15',
      bookingId: 'B002'
    },
    {
      id: 'LP006',
      customerId: '2',
      type: 'earned',
      points: 15,
      description: 'Booking: Hair Wash',
      date: '2024-10-10',
      bookingId: null
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <PermissionProtectedRoute requiredPermissions={['reports.view']}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                  <p className="text-sm text-gray-600">Comprehensive reports on customer feedback and loyalty programs</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
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
              <Tabs defaultValue="loyalty" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="loyalty" className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Loyalty Points
                  </TabsTrigger>
                  <PermissionProtectedSection requiredPermissions={['feedback.view']}>
                    <TabsTrigger value="feedback" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Feedback Responses
                    </TabsTrigger>
                  </PermissionProtectedSection>
                </TabsList>

                {/* Loyalty Points Tab */}
                <TabsContent value="loyalty" className="space-y-6">
                  {/* Search and Filters */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Loyalty Overview</CardTitle>
                      <CardDescription>Track customer loyalty points, booking history, and engagement metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search customers by name or email..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Customers</SelectItem>
                            <SelectItem value="active">Active Only</SelectItem>
                            <SelectItem value="inactive">Inactive Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Customer List */}
                      <div className="space-y-4">
                        {filteredCustomers.map((customer) => (
                          <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <Avatar>
                                    <AvatarImage src={`/api/placeholder/40/40`} />
                                    <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                                    <p className="text-sm text-gray-600">{customer.email}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <span className="text-2xl font-bold text-yellow-600">{customer.loyaltyPoints}</span>
                                    <span className="text-sm text-gray-600">points</span>
                                  </div>
                                  <Badge className={getStatusColor(customer.status)}>
                                    {customer.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">${customer.totalSpent}</div>
                                  <div className="text-sm text-gray-600">Total Spent</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">{customer.totalBookings}</div>
                                  <div className="text-sm text-gray-600">Total Bookings</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {new Date(customer.joinDate).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-600">Member Since</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">
                                    {new Date(customer.lastVisit).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-600">Last Visit</div>
                                </div>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCustomer(customer)}
                                className="w-full"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Complete History
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer Detail Modal */}
                  {selectedCustomer && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <User className="w-5 h-5" />
                              Customer History: {selectedCustomer.name}
                            </CardTitle>
                            <CardDescription>
                              Complete booking history, transactions, and loyalty activity
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCustomer(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Email</Label>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{selectedCustomer.email}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Phone</Label>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{selectedCustomer.phone}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Loyalty Points</Label>
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold">{selectedCustomer.loyaltyPoints} points</span>
                            </div>
                          </div>
                        </div>

                        {/* Loyalty Points Summary */}
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 mb-3">Loyalty Points Summary</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-yellow-600">
                                {selectedCustomer.loyaltyPoints}
                              </div>
                              <div className="text-xs text-yellow-700">Current Balance</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">
                                {loyaltyPointsHistory
                                  .filter(t => t.customerId === selectedCustomer.id && t.type === 'earned' && new Date(t.date).getMonth() === new Date().getMonth())
                                  .reduce((sum, t) => sum + t.points, 0)}
                              </div>
                              <div className="text-xs text-green-700">Earned This Month</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-red-600">
                                {Math.abs(loyaltyPointsHistory
                                  .filter(t => t.customerId === selectedCustomer.id && t.type === 'redeemed')
                                  .reduce((sum, t) => sum + t.points, 0))}
                              </div>
                              <div className="text-xs text-red-700">Total Redeemed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {loyaltyPointsHistory
                                  .filter(t => t.customerId === selectedCustomer.id && t.type === 'earned')
                                  .reduce((sum, t) => sum + t.points, 0)}
                              </div>
                              <div className="text-xs text-blue-700">Total Earned</div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Booking History */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Booking History</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Staff</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Points Earned</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {customerBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-mono">{booking.id}</TableCell>
                                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                  <TableCell>{booking.service}</TableCell>
                                  <TableCell>{booking.staff}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(booking.status)}>
                                      {booking.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>${booking.amount}</TableCell>
                                  <TableCell className="text-yellow-600 font-semibold">+{booking.pointsEarned}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Feedback History */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Feedback History</h3>
                          <div className="space-y-4">
                            {feedbackData.filter(f => f.customerId === selectedCustomer.id).map((feedback) => (
                              <Card key={feedback.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex">{renderStars(feedback.rating)}</div>
                                      <span className="text-sm text-gray-600">
                                        {new Date(feedback.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <Badge className={getStatusColor(feedback.status)}>
                                      {feedback.status}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-700 mb-3">{feedback.message}</p>
                                  {feedback.response && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <p className="text-sm font-medium text-blue-800 mb-1">Response:</p>
                                      <p className="text-sm text-blue-700">{feedback.response}</p>
                                      {feedback.responseDate && (
                                        <p className="text-xs text-blue-600 mt-1">
                                          Responded on {new Date(feedback.responseDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Loyalty Points History */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Loyalty Points History</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Points</TableHead>
                                <TableHead>Balance</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(() => {
                                let runningBalance = 0;
                                return loyaltyPointsHistory
                                  .filter(transaction => transaction.customerId === selectedCustomer.id)
                                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .map((transaction) => {
                                    runningBalance += transaction.points;
                                    return (
                                      <TableRow key={transaction.id}>
                                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                          <Badge
                                            className={
                                              transaction.type === 'earned'
                                                ? 'bg-green-100 text-green-800'
                                                : transaction.type === 'redeemed'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }
                                          >
                                            {transaction.type}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>{transaction.description}</TableCell>
                                        <TableCell className={
                                          transaction.points > 0
                                            ? 'text-green-600 font-semibold'
                                            : 'text-red-600 font-semibold'
                                        }>
                                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                          {runningBalance}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  });
                              })()}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Feedback Responses Tab */}
                <PermissionProtectedSection requiredPermissions={['feedback.view']}>
                  <TabsContent value="feedback" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Feedback Overview</CardTitle>
                      <CardDescription>
                        Monitor customer feedback, ratings, and response management.
                        <span className="text-sm text-blue-600 block mt-1">
                          💡 Feedback responses are managed through the secret section in the Chat page
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Feedback Statistics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{feedbackData.length}</div>
                            <div className="text-sm text-gray-600">Total Feedback</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {feedbackData.filter(f => f.status === 'responded').length}
                            </div>
                            <div className="text-sm text-gray-600">Responded</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                              {feedbackData.filter(f => f.status === 'pending').length}
                            </div>
                            <div className="text-sm text-gray-600">Pending Response</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {(feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Feedback List */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Recent Feedback</h3>
                        {feedbackData.map((feedback) => (
                          <Card key={feedback.id}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <Avatar>
                                    <AvatarImage src={`/api/placeholder/40/40`} />
                                    <AvatarFallback>{feedback.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-semibold">{feedback.customerName}</h4>
                                    <p className="text-sm text-gray-600">Booking #{feedback.bookingId}</p>
                                    <p className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 mb-2">
                                    {renderStars(feedback.rating)}
                                  </div>
                                  <Badge className={getStatusColor(feedback.status)}>
                                    {feedback.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Customer Feedback:</Label>
                                  <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">{feedback.message}</p>
                                </div>

                                {feedback.response ? (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Your Response:</Label>
                                    <div className="mt-1 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                                      <p className="text-blue-800">{feedback.response}</p>
                                      {feedback.responseDate && (
                                        <p className="text-xs text-blue-600 mt-2">
                                          Responded on {new Date(feedback.responseDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">
                                      No response yet. Manage responses in the Chat page secret section.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                </PermissionProtectedSection>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </PermissionProtectedRoute>
  );
}