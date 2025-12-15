'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Package, Truck, CheckCircle, XCircle, RotateCcw, ShoppingCart, Search, Filter,
  Eye, Edit, MoreVertical, Calendar, User, Phone, Mail, MapPin, CreditCard,
  AlertCircle, Clock, DollarSign, FileText, MessageSquare, Star, RefreshCw,
  TrendingUp, AlertTriangle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useCurrencyStore } from "@/stores/currency.store";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { formatDistanceToNow, format } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: string;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  returnReason?: string;
  returnDescription?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  returnedAt?: string;
}

export default function AdminOrders() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { formatCurrency } = useCurrencyStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-001',
      customer: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Downtown, NY 10001'
      },
      items: [
        {
          id: '1',
          name: 'Premium Shampoo',
          quantity: 2,
          price: 15.99,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: '2',
          name: 'Beard Oil',
          quantity: 1,
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ],
      total: 44.97,
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Standard Shipping',
      notes: 'Please handle with care',
      createdAt: '2025-12-14T10:30:00Z',
      updatedAt: '2025-12-14T10:30:00Z'
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-002',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '(555) 234-5678',
        address: '456 Oak Ave, Midtown, NY 10002'
      },
      items: [
        {
          id: '3',
          name: 'Hair Clippers',
          quantity: 1,
          price: 45.99,
          image: 'https://images.unsplash.com/photo-1622296089863-9a4bf0b49c8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ],
      total: 45.99,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'PayPal',
      shippingMethod: 'Express Shipping',
      trackingNumber: 'TRK123456789',
      createdAt: '2025-12-13T14:20:00Z',
      updatedAt: '2025-12-14T09:15:00Z'
    },
    {
      id: '3',
      orderNumber: 'ORD-2025-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        phone: '(555) 345-6789',
        address: '789 Pine St, Uptown, NY 10003'
      },
      items: [
        {
          id: '4',
          name: 'Styling Gel',
          quantity: 3,
          price: 10.99,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          variant: 'Strong Hold'
        },
        {
          id: '5',
          name: 'Face Mask',
          quantity: 1,
          price: 20.99,
          image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ],
      total: 53.96,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Standard Shipping',
      trackingNumber: 'TRK987654321',
      createdAt: '2025-12-12T16:45:00Z',
      updatedAt: '2025-12-14T11:30:00Z'
    },
    {
      id: '4',
      orderNumber: 'ORD-2025-004',
      customer: {
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '(555) 456-7890',
        address: '321 Elm St, Brooklyn, NY 11201'
      },
      items: [
        {
          id: '6',
          name: 'Hair Brush Set',
          quantity: 1,
          price: 25.99,
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ],
      total: 25.99,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'Apple Pay',
      shippingMethod: 'Standard Shipping',
      trackingNumber: 'TRK456789123',
      deliveredAt: '2025-12-14T14:20:00Z',
      createdAt: '2025-12-11T09:10:00Z',
      updatedAt: '2025-12-14T14:20:00Z'
    },
    {
      id: '5',
      orderNumber: 'ORD-2025-005',
      customer: {
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '(555) 567-8901',
        address: '654 Maple Ave, Queens, NY 11301'
      },
      items: [
        {
          id: '7',
          name: 'Beard Trimmer',
          quantity: 1,
          price: 35.99,
          image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: '8',
          name: 'Shaving Cream',
          quantity: 2,
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ],
      total: 53.97,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Express Shipping',
      notes: 'Customer requested cancellation',
      cancelledAt: '2025-12-13T16:00:00Z',
      createdAt: '2025-12-12T11:25:00Z',
      updatedAt: '2025-12-13T16:00:00Z'
    },
    {
      id: '6',
      orderNumber: 'ORD-2025-006',
      customer: {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        phone: '(555) 678-9012',
        address: '987 Cedar St, Bronx, NY 10401'
      },
      items: [
        {
          id: '9',
          name: 'Hair Wax',
          quantity: 1,
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          variant: 'Matte Finish'
        }
      ],
      total: 8.99,
      status: 'returned',
      paymentStatus: 'refunded',
      paymentMethod: 'Google Pay',
      shippingMethod: 'Standard Shipping',
      trackingNumber: 'TRK789123456',
      returnReason: 'Defective Product',
      returnDescription: 'Product arrived damaged - packaging was torn and contents were leaking',
      returnedAt: '2025-12-14T10:15:00Z',
      createdAt: '2025-12-10T13:40:00Z',
      updatedAt: '2025-12-14T10:15:00Z'
    },
    {
      id: '7',
      orderNumber: 'ORD-2025-007',
      customer: {
        name: 'Robert Chen',
        email: 'robert.chen@email.com',
        phone: '(555) 789-0123',
        address: '147 Birch Ln, Staten Island, NY 10301'
      },
      items: [
        {
          id: '10',
          name: 'Aftershave',
          quantity: 1,
          price: 18.99,
          image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          variant: 'Cooling Effect'
        },
        {
          id: '11',
          name: 'Hair Clippers',
          quantity: 1,
          price: 45.99,
          image: 'https://images.unsplash.com/photo-1622296089863-9a4bf0b49c8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ],
      total: 64.98,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Bank Transfer',
      shippingMethod: 'Express Shipping',
      createdAt: '2025-12-14T15:20:00Z',
      updatedAt: '2025-12-14T15:20:00Z'
    },
    {
      id: '8',
      orderNumber: 'ORD-2025-008',
      customer: {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '(555) 890-1234',
        address: '258 Spruce St, Manhattan, NY 10004'
      },
      items: [
        {
          id: '12',
          name: 'Face Mask Set',
          quantity: 1,
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ],
      total: 29.99,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Standard Shipping',
      trackingNumber: 'TRK321654987',
      createdAt: '2025-12-13T08:55:00Z',
      updatedAt: '2025-12-14T12:10:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'returned': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'returned': return <RotateCcw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating order ${orderId} to status ${newStatus}`);
    // Update local state for demo
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus as Order['status'],
            updatedAt: new Date().toISOString(),
            ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() }),
            ...(newStatus === 'cancelled' && { cancelledAt: new Date().toISOString() }),
            ...(newStatus === 'returned' && { returnedAt: new Date().toISOString() })
          }
        : order
    );
    // For demo purposes, we'll just log the change
    setShowStatusDialog(false);
    setNewStatus('');
    setStatusNotes('');
  };

  const handleReturnSubmit = () => {
    if (selectedOrder) {
      handleStatusChange(selectedOrder.id, 'returned');
      // In a real app, save return reason and description
      console.log('Return reason:', returnReason);
      console.log('Return description:', returnDescription);
      setReturnReason('');
      setReturnDescription('');
    }
  };

  const getOrdersByStatus = (status: string) => {
    return filteredOrders.filter(order => order.status === status);
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status !== 'cancelled' && order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const returned = orders.filter(o => o.status === 'returned').length;

    return { total, pending, confirmed, shipped, delivered, cancelled, returned };
  };

  const stats = getOrderStats();

  return (
    <ProtectedRoute requiredRole="branch_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  <Package className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                  <p className="text-sm text-gray-600">Manage physical product orders and fulfillment</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CurrencySwitcher />
                <AdminMobileSidebar role="branch_admin" onLogout={handleLogout} />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold">{stats.pending}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Confirmed</p>
                        <p className="text-2xl font-bold">{stats.confirmed}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Shipped</p>
                        <p className="text-2xl font-bold">{stats.shipped}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Delivered</p>
                        <p className="text-2xl font-bold">{stats.delivered}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cancelled</p>
                        <p className="text-2xl font-bold">{stats.cancelled}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Returned</p>
                        <p className="text-2xl font-bold">{stats.returned}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Card */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">{formatCurrency(getTotalRevenue())}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search orders by number, customer, or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Order Sections */}
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="all">All Orders ({filteredOrders.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({getOrdersByStatus('pending').length})</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed ({getOrdersByStatus('confirmed').length})</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped ({getOrdersByStatus('shipped').length})</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered ({getOrdersByStatus('delivered').length})</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled ({getOrdersByStatus('cancelled').length})</TabsTrigger>
                  <TabsTrigger value="returned">Returned ({getOrdersByStatus('returned').length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Orders</CardTitle>
                      <CardDescription>Complete overview of all product orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div>
                                  <h3 className="font-semibold">{order.orderNumber}</h3>
                                  <p className="text-sm text-gray-600">{order.customer.name}</p>
                                </div>
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1 capitalize">{order.status}</span>
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{formatCurrency(order.total)}</span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleOrderClick(order)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    {order.status === 'pending' && (
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedOrder(order);
                                        setNewStatus('confirmed');
                                        setShowStatusDialog(true);
                                      }}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Confirm Order
                                      </DropdownMenuItem>
                                    )}
                                    {order.status === 'confirmed' && (
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedOrder(order);
                                        setNewStatus('shipped');
                                        setShowStatusDialog(true);
                                      }}>
                                        <Truck className="w-4 h-4 mr-2" />
                                        Mark as Shipped
                                      </DropdownMenuItem>
                                    )}
                                    {order.status === 'shipped' && (
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedOrder(order);
                                        setNewStatus('delivered');
                                        setShowStatusDialog(true);
                                      }}>
                                        <Package className="w-4 h-4 mr-2" />
                                        Mark as Delivered
                                      </DropdownMenuItem>
                                    )}
                                    {['pending', 'confirmed', 'shipped'].includes(order.status) && (
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedOrder(order);
                                        setNewStatus('cancelled');
                                        setShowStatusDialog(true);
                                      }}>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel Order
                                      </DropdownMenuItem>
                                    )}
                                    {order.status === 'delivered' && (
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedOrder(order);
                                        setShowOrderDetails(true);
                                      }}>
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Process Return
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Items:</span> {order.items.length} item(s)
                              </div>
                              <div>
                                <span className="text-gray-600">Payment:</span>
                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-gray-600">Ordered:</span> {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Other tab contents would be similar but filtered by status */}
                <TabsContent value="pending">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Orders</CardTitle>
                      <CardDescription>Orders waiting for confirmation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getOrdersByStatus('pending').map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-600">{order.customer.name}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setNewStatus('confirmed');
                                    setShowStatusDialog(true);
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirm
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="confirmed">
                  <Card>
                    <CardHeader>
                      <CardTitle>Confirmed Orders</CardTitle>
                      <CardDescription>Orders confirmed and ready for shipping</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getOrdersByStatus('confirmed').map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-600">{order.customer.name}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setNewStatus('shipped');
                                    setShowStatusDialog(true);
                                  }}
                                >
                                  <Truck className="w-4 h-4 mr-2" />
                                  Ship Order
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="shipped">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipped Orders</CardTitle>
                      <CardDescription>Orders in transit to customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getOrdersByStatus('shipped').map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-600">{order.customer.name}</p>
                                {order.trackingNumber && (
                                  <p className="text-sm text-blue-600">Tracking: {order.trackingNumber}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setNewStatus('delivered');
                                    setShowStatusDialog(true);
                                  }}
                                >
                                  <Package className="w-4 h-4 mr-2" />
                                  Mark Delivered
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="delivered">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivered Orders</CardTitle>
                      <CardDescription>Successfully delivered orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getOrdersByStatus('delivered').map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-600">{order.customer.name}</p>
                                {order.deliveredAt && (
                                  <p className="text-sm text-green-600">
                                    Delivered {formatDistanceToNow(new Date(order.deliveredAt), { addSuffix: true })}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowOrderDetails(true);
                                  }}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Process Return
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cancelled">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cancelled Orders</CardTitle>
                      <CardDescription>Orders that have been cancelled</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getOrdersByStatus('cancelled').map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-600">{order.customer.name}</p>
                                {order.cancelledAt && (
                                  <p className="text-sm text-red-600">
                                    Cancelled {formatDistanceToNow(new Date(order.cancelledAt), { addSuffix: true })}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancelled
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="returned">
                  <Card>
                    <CardHeader>
                      <CardTitle>Returned Orders</CardTitle>
                      <CardDescription>Orders that have been returned</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getOrdersByStatus('returned').map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-600">{order.customer.name}</p>
                                {order.returnReason && (
                                  <p className="text-sm text-orange-600">
                                    Reason: {order.returnReason}
                                  </p>
                                )}
                                {order.returnedAt && (
                                  <p className="text-sm text-orange-600">
                                    Returned {formatDistanceToNow(new Date(order.returnedAt), { addSuffix: true })}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Returned
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Sheet */}
      <Sheet open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-2xl font-bold text-gray-900">
                  Order #{selectedOrder?.orderNumber}
                </SheetTitle>
                <SheetDescription className="text-base mt-1">
                  Placed {selectedOrder && formatDistanceToNow(new Date(selectedOrder.createdAt), { addSuffix: true })}
                </SheetDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(selectedOrder?.status || '')} px-3 py-1 text-sm font-medium`}>
                  {selectedOrder && getStatusIcon(selectedOrder.status)}
                  <span className="ml-1 capitalize">{selectedOrder?.status}</span>
                </Badge>
                <Badge className={`${getPaymentStatusColor(selectedOrder?.paymentStatus || '')} px-3 py-1 text-sm font-medium`}>
                  {selectedOrder?.paymentStatus}
                </Badge>
              </div>
            </div>
          </SheetHeader>

          {selectedOrder && (
            <div className="space-y-8 mt-6">
              {/* Order Timeline */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Order Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Order Placed</p>
                      <p className="text-xs text-gray-600">{format(new Date(selectedOrder.createdAt), 'PPp')}</p>
                    </div>
                  </div>
                  {selectedOrder.status !== 'pending' && (
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${selectedOrder.confirmedAt ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Order Confirmed</p>
                        <p className="text-xs text-gray-600">
                          {selectedOrder.confirmedAt ? format(new Date(selectedOrder.confirmedAt), 'PPp') : 'Pending'}
                        </p>
                      </div>
                    </div>
                  )}
                  {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered') && (
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${selectedOrder.shippedAt ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Shipped</p>
                        <p className="text-xs text-gray-600">
                          {selectedOrder.shippedAt ? format(new Date(selectedOrder.shippedAt), 'PPp') : 'Pending'}
                        </p>
                        {selectedOrder.trackingNumber && (
                          <p className="text-xs text-purple-600 font-medium">Tracking: {selectedOrder.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Delivered</p>
                        <p className="text-xs text-gray-600">
                          {selectedOrder.deliveredAt ? format(new Date(selectedOrder.deliveredAt), 'PPp') : 'Pending'}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Cancelled</p>
                        <p className="text-xs text-gray-600">
                          {selectedOrder.cancelledAt ? format(new Date(selectedOrder.cancelledAt), 'PPp') : 'Pending'}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'returned' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Returned</p>
                        <p className="text-xs text-gray-600">
                          {selectedOrder.returnedAt ? format(new Date(selectedOrder.returnedAt), 'PPp') : 'Pending'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-indigo-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                          <p className="text-sm text-gray-600">Customer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedOrder.customer.email}</p>
                          <p className="text-sm text-gray-600">Email</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedOrder.customer.phone}</p>
                          <p className="text-sm text-gray-600">Phone</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Shipping Address</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{selectedOrder.customer.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-orange-600" />
                    Order Items ({selectedOrder.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-orange-200">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </h4>
                        {item.variant && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Variant:</span> {item.variant}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">
                            Qty: <span className="font-medium">{item.quantity}</span>
                          </span>
                          <span className="text-sm text-gray-600">
                            Unit: <span className="font-medium">{formatCurrency(item.price)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Order Total</span>
                      <span className="text-2xl font-bold text-orange-600">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Truck className="w-5 h-5 text-blue-600" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                        <span className="font-medium text-gray-700">Method</span>
                        <span className="text-gray-900">{selectedOrder.shippingMethod}</span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                          <span className="font-medium text-gray-700">Tracking Number</span>
                          <span className="text-blue-600 font-mono text-sm">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                        <span className="font-medium text-gray-700">Status</span>
                        <Badge className={`${getStatusColor(selectedOrder.status)} px-2 py-1`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="ml-1 capitalize">{selectedOrder.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-green-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-100">
                        <span className="font-medium text-gray-700">Method</span>
                        <span className="text-gray-900">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-100">
                        <span className="font-medium text-gray-700">Status</span>
                        <Badge className={`${getPaymentStatusColor(selectedOrder.paymentStatus)} px-2 py-1`}>
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-100">
                        <span className="font-medium text-gray-700">Amount</span>
                        <span className="font-bold text-lg text-green-600">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Return Information */}
              {selectedOrder.status === 'returned' && (
                <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-l-orange-400">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
                      <RotateCcw className="w-5 h-5 text-orange-600" />
                      Return Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-800">Return Reason</span>
                        </div>
                        <p className="text-gray-700 capitalize">{selectedOrder.returnReason}</p>
                      </div>
                      {selectedOrder.returnDescription && (
                        <div className="p-4 bg-white rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-orange-800">Return Description</span>
                          </div>
                          <p className="text-gray-700">{selectedOrder.returnDescription}</p>
                        </div>
                      )}
                      {selectedOrder.returnedAt && (
                        <div className="p-4 bg-white rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-orange-800">Return Date</span>
                          </div>
                          <p className="text-gray-700">{format(new Date(selectedOrder.returnedAt), 'PPp')}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <Card className="shadow-sm border-0 bg-gradient-to-br from-gray-50 to-gray-100">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    {selectedOrder.status === 'pending' && (
                      <Button
                        onClick={() => {
                          setNewStatus('confirmed');
                          setShowStatusDialog(true);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirm Order
                      </Button>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <Button
                        onClick={() => {
                          setNewStatus('shipped');
                          setShowStatusDialog(true);
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
                      >
                        <Truck className="w-5 h-5 mr-2" />
                        Mark as Shipped
                      </Button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <Button
                        onClick={() => {
                          setNewStatus('delivered');
                          setShowStatusDialog(true);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
                      >
                        <Package className="w-5 h-5 mr-2" />
                        Mark as Delivered
                      </Button>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 py-3 text-base font-medium">
                            <RotateCcw className="w-5 h-5 mr-2" />
                            Process Return
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <RotateCcw className="w-5 h-5 text-orange-600" />
                              Process Return
                            </DialogTitle>
                            <DialogDescription>
                              Process return for order {selectedOrder.orderNumber}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="return-reason" className="text-sm font-medium">Return Reason</Label>
                              <Select value={returnReason} onValueChange={setReturnReason}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select return reason" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="defective">Defective Product</SelectItem>
                                  <SelectItem value="wrong-item">Wrong Item</SelectItem>
                                  <SelectItem value="not-as-described">Not as Described</SelectItem>
                                  <SelectItem value="changed-mind">Changed Mind</SelectItem>
                                  <SelectItem value="damaged">Damaged in Transit</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="return-description" className="text-sm font-medium">Description</Label>
                              <Textarea
                                id="return-description"
                                value={returnDescription}
                                onChange={(e) => setReturnDescription(e.target.value)}
                                placeholder="Provide details about the return..."
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button onClick={handleReturnSubmit} className="flex-1 bg-orange-600 hover:bg-orange-700">
                                Process Return
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setReturnReason('');
                                  setReturnDescription('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setShowOrderDetails(false)}
                      className="px-6 py-3 text-base font-medium"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change status for order {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedOrder?.status === 'pending' && (
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                  )}
                  {selectedOrder?.status === 'confirmed' && (
                    <SelectItem value="shipped">Shipped</SelectItem>
                  )}
                  {selectedOrder?.status === 'shipped' && (
                    <SelectItem value="delivered">Delivered</SelectItem>
                  )}
                  {['pending', 'confirmed', 'shipped'].includes(selectedOrder?.status || '') && (
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {newStatus === 'shipped' && (
              <div>
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (selectedOrder) {
                    handleStatusChange(selectedOrder.id, newStatus);
                  }
                }}
                className="flex-1"
              >
                Update Status
              </Button>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}