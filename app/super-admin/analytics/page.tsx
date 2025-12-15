'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, RefreshCw, Building, PieChart, Activity, FileText, Calculator, Receipt, UserPlus, CreditCard } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import * as XLSX from 'xlsx';

export default function SuperAdminAnalytics() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAddBranchExpense = () => {
    if (!selectedBranch || !expenseCategory || !expenseAmount) return;

    // Here you would typically make an API call to save the expense
    console.log('Adding branch expense:', {
      branch: selectedBranch,
      category: expenseCategory,
      amount: parseFloat(expenseAmount),
      description: expenseDescription,
      date: new Date().toISOString().split('T')[0]
    });

    // Reset form
    setSelectedBranch('');
    setExpenseCategory('');
    setExpenseAmount('');
    setExpenseDescription('');

    // Show success message (you could add a toast notification here)
    alert('Branch expense added successfully!');
  };

  const [timeRange, setTimeRange] = useState('30d');

  // Tab and expense form state
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  // Comprehensive analytics data across all branches
  const analytics = {
    overview: {
      totalRevenue: 156780,
      totalBookings: 3875,
      totalCustomers: 2341,
      avgRating: 4.7,
      revenueChange: 18.5,
      bookingsChange: 12.3,
      customersChange: 22.1,
      ratingChange: 0.3
    },
    // Branch Performance
    branchPerformance: [
      { name: "Downtown Premium", revenue: 45230, bookings: 1124, customers: 687, rating: 4.9, growth: 15.2 },
      { name: "Midtown Elite", revenue: 38750, bookings: 956, customers: 583, rating: 4.8, growth: 12.8 },
      { name: "Uptown Luxury", revenue: 42380, bookings: 1048, customers: 639, rating: 4.9, growth: 18.9 },
      { name: "Suburban Comfort", revenue: 15620, bookings: 387, customers: 236, rating: 4.6, growth: 8.4 },
      { name: "Westside Modern", revenue: 9870, bookings: 244, customers: 149, rating: 4.5, growth: 6.1 },
      { name: "Eastside Classic", revenue: 4930, bookings: 122, customers: 74, rating: 4.4, growth: 3.2 },
      { name: "Northgate Plaza", revenue: 2980, bookings: 74, customers: 45, rating: 4.3, growth: -2.1 },
      { name: "Southpoint Mall", revenue: 2020, bookings: 50, customers: 30, rating: 4.2, growth: -5.3 }
    ],
    // Registration Reports
    registrations: {
      totalRegistrations: 2341,
      newThisMonth: 387,
      activeUsers: 1952,
      inactiveUsers: 389,
      registrationTrend: [
        { month: 'Jan', count: 198 },
        { month: 'Feb', count: 234 },
        { month: 'Mar', count: 212 },
        { month: 'Apr', count: 267 },
        { month: 'May', count: 289 },
        { month: 'Jun', count: 312 }
      ],
      registrationSources: [
        { source: 'Website', count: 1123, percentage: 47.9 },
        { source: 'Mobile App', count: 892, percentage: 38.1 },
        { source: 'Referral', count: 198, percentage: 8.5 },
        { source: 'Walk-in', count: 128, percentage: 5.5 }
      ]
    },
    // Budget and Financial Reports
    budget: {
      totalBudget: 250000,
      utilizedBudget: 156780,
      remainingBudget: 93220,
      budgetUtilization: 62.7,
      monthlyBudget: [
        { month: 'Jan', allocated: 35000, spent: 28500, remaining: 6500 },
        { month: 'Feb', allocated: 35000, spent: 31200, remaining: 3800 },
        { month: 'Mar', allocated: 38000, spent: 34800, remaining: 3200 },
        { month: 'Apr', allocated: 38000, spent: 29800, remaining: 8200 },
        { month: 'May', allocated: 37500, spent: 32600, remaining: 4900 },
        { month: 'Jun', allocated: 37500, spent: 29880, remaining: 7620 }
      ]
    },
    // Charges and Calculations
    charges: {
      serviceCharges: [
        { service: 'Classic Haircut', basePrice: 25, discount: 0, tax: 2.5, total: 27.5, bookings: 1568 },
        { service: 'Beard Trim', basePrice: 15, discount: 1.5, tax: 1.35, total: 14.85, bookings: 1225 },
        { service: 'Hair Color', basePrice: 45, discount: 4.5, tax: 4.05, total: 44.55, bookings: 612 },
        { service: 'Hot Towel Shave', basePrice: 20, discount: 2, tax: 1.8, total: 19.8, bookings: 470 }
      ],
      totalTaxCollected: 18920,
      totalDiscountsGiven: 7820,
      averageTransactionValue: 40.45,
      paymentMethods: [
        { method: 'Cash', amount: 62350, transactions: 1423, percentage: 39.8 },
        { method: 'Card', amount: 72180, transactions: 1856, percentage: 46.1 },
        { method: 'Digital Wallet', amount: 22250, transactions: 596, percentage: 14.1 }
      ]
    },
    // Calculation Reports
    calculations: {
      profitMargin: 71.2,
      costOfGoodsSold: 45200,
      operatingExpenses: 29800,
      netProfit: 112780,
      roi: 168.5,
      customerAcquisitionCost: 14.25,
      lifetimeValue: 321.75,
      breakEvenPoint: 234,
      monthlyRecurringRevenue: 18750,
      churnRate: 3.8,
      conversionRate: 25.6
    },
    revenueByService: [
      { service: "Classic Haircut", revenue: 54875, bookings: 1568, percentage: 35.0 },
      { service: "Beard Trim", revenue: 30625, bookings: 1225, percentage: 19.5 },
      { service: "Hair Color", revenue: 34300, bookings: 403, percentage: 21.9 },
      { service: "Hot Towel Shave", revenue: 25375, bookings: 563, percentage: 16.2 },
      { service: "Hair Wash & Style", revenue: 11605, bookings: 290, percentage: 7.4 }
    ],
    monthlyTrends: [
      { month: "Aug", revenue: 12450, bookings: 308 },
      { month: "Sep", revenue: 13890, bookings: 343 },
      { month: "Oct", revenue: 15230, bookings: 377 },
      { month: "Nov", revenue: 16890, bookings: 417 },
      { month: "Dec", revenue: 18320, bookings: 453 }
    ],
    topServices: [
      { name: "Classic Haircut", bookings: 1568, revenue: 54875, growth: 12.5 },
      { name: "Beard Trim & Shape", bookings: 1225, revenue: 30625, growth: 18.3 },
      { name: "Hair Color", bookings: 403, revenue: 34300, growth: 8.7 },
      { name: "Hot Towel Shave", bookings: 563, revenue: 25375, growth: 15.2 },
      { name: "Hair Wash & Style", bookings: 290, revenue: 11605, growth: 22.1 }
    ],
    // Branch Expenses and Charges
    expenses: {
      totalExpenses: 45200,
      operatingCosts: 28500,
      staffSalaries: 16700,
      revenue: 156780,
      categories: [
        { name: 'Rent', amount: 18500, percentage: 40.9 },
        { name: 'Utilities', amount: 4200, percentage: 9.3 },
        { name: 'Supplies', amount: 5800, percentage: 12.8 },
        { name: 'Staff Salaries', amount: 16700, percentage: 36.9 },
        { name: 'Equipment', amount: 1200, percentage: 2.7 },
        { name: 'Marketing', amount: 1800, percentage: 4.0 },
        { name: 'Maintenance', amount: 900, percentage: 2.0 },
        { name: 'Insurance', amount: 600, percentage: 1.3 }
      ],
      branchExpenses: [
        { branch: 'Downtown Premium', date: '2025-12-15', category: 'Rent', description: 'Monthly rent payment', amount: 8500 },
        { branch: 'Midtown Elite', date: '2025-12-15', category: 'Rent', description: 'Monthly rent payment', amount: 7200 },
        { branch: 'Uptown Luxury', date: '2025-12-15', category: 'Rent', description: 'Monthly rent payment', amount: 7800 },
        { branch: 'Downtown Premium', date: '2025-12-14', category: 'Supplies', description: 'Hair products and styling tools', amount: 1200 },
        { branch: 'Midtown Elite', date: '2025-12-14', category: 'Utilities', description: 'Electricity bill', amount: 850 },
        { branch: 'Uptown Luxury', date: '2025-12-13', category: 'Staff Salaries', description: 'Monthly payroll', amount: 5600 },
        { branch: 'Downtown Premium', date: '2025-12-12', category: 'Marketing', description: 'Social media ads', amount: 600 },
        { branch: 'Midtown Elite', date: '2025-12-11', category: 'Equipment', description: 'New clippers maintenance', amount: 450 }
      ]
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Excel Export Functions
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Overview Sheet
    const overviewData = [
      ['Super Admin Analytics Overview Report', ''],
      ['Generated on', new Date().toLocaleDateString()],
      ['Time Period', timeRange],
      ['', ''],
      ['Metric', 'Value', 'Change'],
      ['Total Revenue', analytics.overview.totalRevenue, `${analytics.overview.revenueChange}%`],
      ['Total Bookings', analytics.overview.totalBookings, `${analytics.overview.bookingsChange}%`],
      ['Total Customers', analytics.overview.totalCustomers, `${analytics.overview.customersChange}%`],
      ['Average Rating', analytics.overview.avgRating, `${analytics.overview.ratingChange}`]
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');

    // Branch Performance Sheet
    const branchData = [
      ['Branch Performance Report', ''],
      ['Branch Name', 'Revenue', 'Bookings', 'Customers', 'Rating', 'Growth %'],
      ...analytics.branchPerformance.map(item => [
        item.name, item.revenue, item.bookings, item.customers, item.rating, `${item.growth}%`
      ])
    ];
    const branchSheet = XLSX.utils.aoa_to_sheet(branchData);
    XLSX.utils.book_append_sheet(workbook, branchSheet, 'Branch_Performance');

    // Registration Report Sheet
    const registrationData = [
      ['Registration Report (All Branches)', ''],
      ['Total Registrations', analytics.registrations.totalRegistrations],
      ['New This Month', analytics.registrations.newThisMonth],
      ['Active Users', analytics.registrations.activeUsers],
      ['Inactive Users', analytics.registrations.inactiveUsers],
      ['', ''],
      ['Registration Trend by Month', ''],
      ['Month', 'Registrations'],
      ...analytics.registrations.registrationTrend.map(item => [item.month, item.count]),
      ['', ''],
      ['Registration Sources', ''],
      ['Source', 'Count', 'Percentage'],
      ...analytics.registrations.registrationSources.map(item => [item.source, item.count, `${item.percentage}%`])
    ];
    const registrationSheet = XLSX.utils.aoa_to_sheet(registrationData);
    XLSX.utils.book_append_sheet(workbook, registrationSheet, 'Registrations');

    // Budget Report Sheet
    const budgetData = [
      ['Budget Report (All Branches)', ''],
      ['Total Budget', analytics.budget.totalBudget],
      ['Utilized Budget', analytics.budget.utilizedBudget],
      ['Remaining Budget', analytics.budget.remainingBudget],
      ['Budget Utilization', `${analytics.budget.budgetUtilization}%`],
      ['', ''],
      ['Monthly Budget Breakdown', ''],
      ['Month', 'Allocated', 'Spent', 'Remaining'],
      ...analytics.budget.monthlyBudget.map(item => [item.month, item.allocated, item.spent, item.remaining])
    ];
    const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Budget');

    // Charges & Calculations Sheet
    const chargesData = [
      ['Charges & Calculations Report (All Branches)', ''],
      ['Service Charges Breakdown', ''],
      ['Service', 'Base Price', 'Discount', 'Tax', 'Total', 'Bookings'],
      ...analytics.charges.serviceCharges.map(item => [
        item.service, item.basePrice, item.discount, item.tax, item.total, item.bookings
      ]),
      ['', ''],
      ['Financial Summary', ''],
      ['Total Tax Collected', analytics.charges.totalTaxCollected],
      ['Total Discounts Given', analytics.charges.totalDiscountsGiven],
      ['Average Transaction Value', analytics.charges.averageTransactionValue],
      ['', ''],
      ['Payment Methods', ''],
      ['Method', 'Amount', 'Transactions', 'Percentage'],
      ...analytics.charges.paymentMethods.map(item => [
        item.method, item.amount, item.transactions, `${item.percentage}%`
      ]),
      ['', ''],
      ['Key Calculations', ''],
      ['Profit Margin', `${analytics.calculations.profitMargin}%`],
      ['Cost of Goods Sold', analytics.calculations.costOfGoodsSold],
      ['Operating Expenses', analytics.calculations.operatingExpenses],
      ['Net Profit', analytics.calculations.netProfit],
      ['ROI', `${analytics.calculations.roi}%`],
      ['Customer Acquisition Cost', analytics.calculations.customerAcquisitionCost],
      ['Lifetime Value', analytics.calculations.lifetimeValue],
      ['Break Even Point', analytics.calculations.breakEvenPoint],
      ['Monthly Recurring Revenue', analytics.calculations.monthlyRecurringRevenue],
      ['Churn Rate', `${analytics.calculations.churnRate}%`],
      ['Conversion Rate', `${analytics.calculations.conversionRate}%`]
    ];
    const chargesSheet = XLSX.utils.aoa_to_sheet(chargesData);
    XLSX.utils.book_append_sheet(workbook, chargesSheet, 'Charges_Calculations');

    // Generate and download the file
    const fileName = `SuperAdmin_Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
                  <p className="text-sm text-gray-600">Performance across all branches</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
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
              {/* Analytics Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="branches">Branches</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">{formatPercentage(analytics.overview.revenueChange)}</span> from last period
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.totalBookings.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">{formatPercentage(analytics.overview.bookingsChange)}</span> from last period
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.totalCustomers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">{formatPercentage(analytics.overview.customersChange)}</span> from last period
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.avgRating.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">{formatPercentage(analytics.overview.ratingChange)}</span> from last period
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Branch Performance */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Branch Performance</CardTitle>
                        <CardDescription>Revenue and growth by location</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.branchPerformance.map((branch, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">{branch.name}</span>
                                  <span className="text-sm text-gray-600">{formatCurrency(branch.revenue)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-secondary h-2 rounded-full"
                                    style={{ width: `${(branch.revenue / Math.max(...analytics.branchPerformance.map(b => b.revenue))) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>{branch.bookings} bookings</span>
                                  <span className={branch.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {formatPercentage(branch.growth)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Trends</CardTitle>
                        <CardDescription>Revenue and bookings over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.monthlyTrends.map((month, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm font-medium w-12">{month.month}</span>
                              <div className="flex-1 mx-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${(month.revenue / Math.max(...analytics.monthlyTrends.map(m => m.revenue))) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{formatCurrency(month.revenue)}</div>
                                <div className="text-xs text-gray-500">{month.bookings} bookings</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Service Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Services</CardTitle>
                        <CardDescription>Most popular services across all branches</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.topServices.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{service.name}</p>
                                  <p className="text-sm text-gray-600">{service.bookings} bookings</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(service.revenue)}</p>
                                <p className="text-sm text-green-600">{formatPercentage(service.growth)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Service Distribution</CardTitle>
                        <CardDescription>Revenue breakdown by service type</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.revenueByService.map((service, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">{service.service}</span>
                                  <span className="text-sm text-gray-600">{formatCurrency(service.revenue)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${service.percentage}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>{service.bookings} bookings</span>
                                  <span>{service.percentage}% of total</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Branches Tab */}
                <TabsContent value="branches" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analytics.branchPerformance.map((branch, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-blue-600" />
                            {branch.name}
                          </CardTitle>
                          <CardDescription>Detailed branch analytics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Revenue</p>
                              <p className="text-lg font-semibold">{formatCurrency(branch.revenue)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Bookings</p>
                              <p className="text-lg font-semibold">{branch.bookings}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Customers</p>
                              <p className="text-lg font-semibold">{branch.customers}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Rating</p>
                              <p className="text-lg font-semibold">{branch.rating.toFixed(1)}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Growth</span>
                              <span className={`font-semibold ${branch.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercentage(branch.growth)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Expenses Tab */}
                <TabsContent value="expenses" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <Receipt className="h-4 w-4 text-red-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(analytics.expenses?.totalExpenses || 0)}</div>
                        <p className="text-xs text-muted-foreground">
                          Across all branches
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Operating Costs</CardTitle>
                        <Calculator className="h-4 w-4 text-orange-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.expenses?.operatingCosts || 0)}</div>
                        <p className="text-xs text-muted-foreground">
                          Rent, utilities, supplies
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Staff Salaries</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.expenses?.staffSalaries || 0)}</div>
                        <p className="text-xs text-muted-foreground">
                          Monthly payroll
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency((analytics.expenses?.revenue || 0) - (analytics.expenses?.totalExpenses || 0))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Revenue minus expenses
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expense Categories */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Expense Categories</CardTitle>
                        <CardDescription>Breakdown of expenses across all branches</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {(analytics.expenses?.categories || []).map((category, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="font-medium">{category.name}</span>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(category.amount)}</p>
                                <p className="text-sm text-gray-600">{category.percentage}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Add Branch Expense */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Add Branch Expense</CardTitle>
                        <CardDescription>Record expenses for specific branches</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Branch</label>
                          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {analytics.branchPerformance.map((branch, index) => (
                                <SelectItem key={index} value={branch.name.toLowerCase().replace(/\s+/g, '-')}>
                                  {branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Expense Category</label>
                          <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rent">Rent</SelectItem>
                              <SelectItem value="utilities">Utilities</SelectItem>
                              <SelectItem value="supplies">Supplies</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="insurance">Insurance</SelectItem>
                              <SelectItem value="salaries">Staff Salaries</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="number"
                              value={expenseAmount}
                              onChange={(e) => setExpenseAmount(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                              step="0.01"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <textarea
                            value={expenseDescription}
                            onChange={(e) => setExpenseDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the expense..."
                            rows={3}
                          />
                        </div>

                        <Button onClick={handleAddBranchExpense} className="w-full" disabled={!selectedBranch || !expenseCategory || !expenseAmount}>
                          <Receipt className="w-4 h-4 mr-2" />
                          Add Branch Expense
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Branch Expenses Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Branch Expenses</CardTitle>
                      <CardDescription>Recent expenses across all branches</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Branch</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(analytics.expenses?.branchExpenses || []).map((expense, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Badge variant="outline">{expense.branch}</Badge>
                              </TableCell>
                              <TableCell>{expense.date}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{expense.category}</Badge>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                              <TableCell className="text-right font-semibold text-red-600">
                                -{formatCurrency(expense.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}