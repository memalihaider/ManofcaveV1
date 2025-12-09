'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, TrendingUp, Building, BarChart3, Settings, UserPlus, LogOut } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Navigation handlers
  const handleViewBranchDetails = (branchName: string) => {
    // Convert branch name to URL-friendly format
    const branchId = branchName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/super-admin/branches/${branchId}`);
  };

  const handleAddNewBranch = () => {
    router.push('/super-admin/branches/new');
  };

  const handleManageStaff = () => {
    router.push('/super-admin/staff');
  };

  const handleGenerateReports = () => {
    router.push('/super-admin/analytics');
  };

  const handleSystemSettings = () => {
    router.push('/super-admin/settings');
  };

  // Mock data - in real app, this would come from API
  const overallStats = {
    totalBranches: 8,
    totalRevenue: 45680,
    totalCustomers: 1247,
    avgRating: 4.7,
    monthlyGrowth: 12.5,
  };

  const branchPerformance = [
    { name: "Downtown Premium", revenue: 8920, customers: 234, rating: 4.9, status: "excellent" },
    { name: "Midtown Elite", revenue: 7650, customers: 198, rating: 4.8, status: "good" },
    { name: "Uptown Luxury", revenue: 9230, customers: 256, rating: 4.9, status: "excellent" },
    { name: "Suburban Comfort", revenue: 6780, customers: 167, rating: 4.6, status: "good" },
    { name: "Westside Modern", revenue: 5420, customers: 142, rating: 4.5, status: "average" },
    { name: "Eastside Classic", revenue: 4980, customers: 128, rating: 4.4, status: "average" },
    { name: "Northgate Plaza", revenue: 3870, customers: 98, rating: 4.3, status: "needs_attention" },
    { name: "Southpoint Mall", revenue: 2830, customers: 74, rating: 4.2, status: "needs_attention" },
  ];

  const recentActivities = [
    { type: "new_booking", message: "New booking at Downtown Premium", time: "2 min ago" },
    { type: "staff_hired", message: "New barber hired at Midtown Elite", time: "15 min ago" },
    { type: "branch_update", message: "Uptown Luxury updated operating hours", time: "1 hour ago" },
    { type: "revenue_milestone", message: "Monthly revenue target achieved", time: "2 hours ago" },
    { type: "customer_feedback", message: "New 5-star review at Suburban Comfort", time: "3 hours ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "average": return "bg-yellow-100 text-yellow-800";
      case "needs_attention": return "bg-red-100 text-red-800";
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
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
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
                  <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Multi-Branch Management System</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-8">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallStats.totalBranches}</div>
                    <p className="text-xs text-muted-foreground">
                      All locations active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${overallStats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +{overallStats.monthlyGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallStats.totalCustomers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallStats.avgRating}</div>
                    <p className="text-xs text-muted-foreground">
                      +0.2 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">
                      Peak hours utilization
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Branch Performance */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Branch Performance Overview
                      </CardTitle>
                      <CardDescription>
                        Revenue, customers, and ratings across all locations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {branchPerformance.map((branch) => (
                          <div key={branch.name} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                                <Badge className={getStatusColor(branch.status)}>
                                  {branch.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                                <span>Revenue: ${branch.revenue.toLocaleString()}</span>
                                <span>Customers: {branch.customers}</span>
                                <span>Rating: ⭐ {branch.rating}</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewBranchDetails(branch.name)}
                            >
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions & Activities */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>
                        System-wide administrative tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={handleAddNewBranch}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add New Branch
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={handleManageStaff}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Manage Staff
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={handleGenerateReports}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate Reports
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={handleSystemSettings}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        System Settings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activities */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activities</CardTitle>
                      <CardDescription>
                        Latest updates across all branches
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.message}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Performance Charts Placeholder */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>
                    Monthly revenue across all branches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Revenue chart visualization</p>
                      <p className="text-sm text-gray-400">Chart component would be implemented here</p>
                    </div>
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