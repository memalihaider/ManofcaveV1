'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Clock, Settings, Plus, Edit, Trash2, CheckCircle, AlertCircle, BarChart3, TrendingUp, Activity } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useCategoryStore, type Category } from "@/stores/category.store";

interface Widget {
  id: string;
  name: string;
  businessId?: string;
  businessName?: string;
  theme?: any;
  settings?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
import { useRouter } from "next/navigation";
import { ServiceDurationManager } from "@/components/ui/service-duration-manager";
import { OnlineBookingWidget, type BookingWidget } from "@/components/ui/online-booking-widget";
import { NotificationSystem, useNotifications } from "@/components/ui/notification-system";

type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  bufferTime: number;
  price: number;
  isActive: boolean;
  requiresSpecialist: boolean;
  maxConcurrentBookings: number;
  preparationTime: number;
  cleanupTime: number;
  resources: string[];
  staffRequirements: string[];
  branchAvailability: string[];
  bookingRules: {
    minAdvanceBooking: number;
    maxAdvanceBooking: number;
    cancellationPolicy: 'flexible' | 'moderate' | 'strict';
    reschedulePolicy: 'flexible' | 'moderate' | 'strict';
    depositRequired: boolean;
    depositAmount?: number;
  };
  createdAt: string;
  updatedAt: string;
};

export default function AdminServiceManagement() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { notifications, addNotification, markAsRead, dismiss } = useNotifications();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Mock data for services and categories
  const [services, setServices] = useState<Service[]>([
    {
      id: 'service-1',
      name: 'Classic Haircut',
      category: 'Hair Services',
      duration: 30,
      bufferTime: 15,
      price: 35,
      description: 'Traditional haircut with styling',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requiresSpecialist: false,
      maxConcurrentBookings: 1,
      preparationTime: 5,
      cleanupTime: 10,
      resources: ['chair-1'],
      staffRequirements: ['stylist'],
      branchAvailability: ['branch-1'],
      bookingRules: {
        minAdvanceBooking: 1,
        maxAdvanceBooking: 30,
        cancellationPolicy: 'flexible',
        reschedulePolicy: 'flexible',
        depositRequired: false
      }
    },
    {
      id: 'service-2',
      name: 'Beard Trim & Shape',
      category: 'Grooming',
      duration: 20,
      bufferTime: 10,
      price: 25,
      description: 'Professional beard grooming',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requiresSpecialist: false,
      maxConcurrentBookings: 1,
      preparationTime: 5,
      cleanupTime: 5,
      resources: ['chair-1'],
      staffRequirements: ['barber'],
      branchAvailability: ['branch-1'],
      bookingRules: {
        minAdvanceBooking: 1,
        maxAdvanceBooking: 30,
        cancellationPolicy: 'flexible',
        reschedulePolicy: 'flexible',
        depositRequired: false
      }
    }
  ]);

  const [categories, setCategories] = useState([
    {
      id: 'cat-1',
      name: 'Hair Services',
      description: 'All hair-related services',
      color: '#3B82F6',
      icon: 'scissors',
      isActive: true
    },
    {
      id: 'cat-2',
      name: 'Grooming',
      description: 'Beard and facial grooming',
      color: '#10B981',
      icon: 'user',
      isActive: true
    }
  ]);

  const [branches, setBranches] = useState([
    { id: 'branch-1', name: 'Downtown Branch', location: '123 Main St' },
    { id: 'branch-2', name: 'Uptown Branch', location: '456 Oak Ave' }
  ]);

  const [barbers, setBarbers] = useState([
    { id: 'barber-1', name: 'John Smith', specialties: ['Hair Services'], branchId: 'branch-1' },
    { id: 'barber-2', name: 'Mike Johnson', specialties: ['Grooming', 'Hair Services'], branchId: 'branch-1' }
  ]);

  const [rooms, setRooms] = useState([
    { id: 'room-1', name: 'Chair 1', type: 'workstation', branchId: 'branch-1' },
    { id: 'room-2', name: 'Chair 2', type: 'workstation', branchId: 'branch-1' }
  ]);

  // Mock data for online booking widgets
  const [widgets, setWidgets] = useState<BookingWidget[]>([]);

  // Service handlers
  const handleServiceCreate = (service: any) => {
    const newService = { ...service, id: `service-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setServices(prev => [...prev, newService]);
    addNotification({
      title: 'Service Created',
      message: `New service "${service.name}" has been created successfully.`,
      type: 'success'
    });
  };

  const handleServiceUpdate = (serviceId: string, updates: any) => {
    setServices(prev => prev.map(service =>
      service.id === serviceId ? { ...service, ...updates } : service
    ));
    addNotification({
      title: 'Service Updated',
      message: 'The service has been updated successfully.',
      type: 'info'
    });
  };

  const handleServiceDelete = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    addNotification({
      title: 'Service Deleted',
      message: 'The service has been deleted successfully.',
      type: 'warning'
    });
  };

  // Category handlers
  const handleCategoryCreate = (category: any) => {
    const newCategory = { ...category, id: `category-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setCategories(prev => [...prev, newCategory]);
    addNotification({
      title: 'Category Created',
      message: `New category "${category.name}" has been created successfully.`,
      type: 'success'
    });
  };

  const handleCategoryUpdate = (categoryId: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category =>
      category.id === categoryId ? { ...category, ...updates } : category
    ));
  };

  const handleCategoryDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(category => category.id !== categoryId));
  };

  // Widget handlers - commented out for now
  /*
  const handleWidgetCreate = (widget: Omit<Widget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWidget = { ...widget, id: `widget-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setWidgets(prev => [...prev, newWidget]);
    addNotification({
      title: 'Booking Widget Created',
      message: `New widget "${widget.name}" has been created successfully.`,
      type: 'success'
    });
  };

  const handleWidgetUpdate = (widgetId: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, ...updates } : widget
    ));
  };

  const handleWidgetDelete = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
  };
  */

  // Analytics overview
  const serviceStats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.isActive).length,
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.isActive).length,
    totalWidgets: widgets.length,
    activeWidgets: widgets.filter(w => w.isActive).length
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role={(user?.role as 'branch_admin' | 'super_admin') || 'branch_admin'} onLogout={logout} />

        {/* Mobile Sidebar */}
        <AdminMobileSidebar
          role={(user?.role as 'branch_admin' | 'super_admin') || 'branch_admin'}
          onLogout={logout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Scissors className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
                  <p className="text-sm text-gray-600">Manage services, durations, and online booking widgets</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <NotificationSystem
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onDismiss={dismiss}
                />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="bg-white border-b p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Scissors className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Services</p>
                      <p className="text-2xl font-bold">{serviceStats.totalServices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Services</p>
                      <p className="text-2xl font-bold">{serviceStats.activeServices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Settings className="w-8 h-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold">{serviceStats.totalCategories}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Categories</p>
                      <p className="text-2xl font-bold">{serviceStats.activeCategories}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Settings className="w-8 h-8 text-indigo-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Booking Widgets</p>
                      <p className="text-2xl font-bold">{serviceStats.totalWidgets}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-teal-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Widgets</p>
                      <p className="text-2xl font-bold">{serviceStats.activeWidgets}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="services" className="flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  Services & Durations
                </TabsTrigger>
                {/* <TabsTrigger value="widgets" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Booking Widgets
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="services" className="mt-6">
                <ServiceDurationManager
                  services={services}
                  categories={categories}
                  branches={branches}
                  barbers={barbers}
                  rooms={rooms}
                  onServiceCreate={handleServiceCreate}
                  onServiceUpdate={handleServiceUpdate}
                  onServiceDelete={handleServiceDelete}
                  onCategoryCreate={handleCategoryCreate}
                  onCategoryUpdate={handleCategoryUpdate}
                  onCategoryDelete={handleCategoryDelete}
                />
              </TabsContent>

              {/* <TabsContent value="widgets" className="mt-6">
                <OnlineBookingWidget
                  widgets={widgets as any}
                  services={services}
                  barbers={barbers}
                  branches={branches}
                  onWidgetCreate={handleWidgetCreate}
                  onWidgetUpdate={handleWidgetUpdate}
                  onWidgetDelete={handleWidgetDelete}
                />
              </TabsContent> */}
            </Tabs>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};