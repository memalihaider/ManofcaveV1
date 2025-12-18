'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, RefreshCw, FileText, Calculator, Receipt, UserPlus, CreditCard, PieChart } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useCurrencyStore } from "@/stores/currency.store";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import * as XLSX from 'xlsx';

export default function AdminAnalytics() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { formatCurrency } = useCurrencyStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAddExpense = () => {
    if (!expenseCategory || !expenseAmount) return;

    // Here you would typically make an API call to save the expense
    console.log('Adding expense:', {
      category: expenseCategory,
      amount: parseFloat(expenseAmount),
      description: expenseDescription,
      invoiceUrl: expenseInvoiceUrl,
      invoiceFile: expenseInvoiceFile,
      date: new Date().toISOString().split('T')[0]
    });

    // Reset form
    setExpenseCategory('');
    setExpenseAmount('');
    setExpenseDescription('');
    setExpenseInvoiceUrl('');
    setExpenseInvoiceFile(null);

    // Show success message (you could add a toast notification here)
    alert('Expense added successfully!');
  };

  const [timeRange, setTimeRange] = useState('30d');

  // Expense form state
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseInvoiceUrl, setExpenseInvoiceUrl] = useState('');
  const [expenseInvoiceFile, setExpenseInvoiceFile] = useState<File | null>(null);

  // Comprehensive analytics data with detailed reports
  const analytics = {
    overview: {
      totalRevenue: 45280,
      totalBookings: 1247,
      totalCustomers: 892,
      avgRating: 4.7,
      revenueChange: 12.5,
      bookingsChange: 8.3,
      customersChange: 15.2,
      ratingChange: 0.2
    },
    // Registration Reports
    registrations: {
      totalRegistrations: 892,
      newThisMonth: 156,
      activeUsers: 734,
      inactiveUsers: 158,
      registrationTrend: [
        { month: 'Jan', count: 45 },
        { month: 'Feb', count: 52 },
        { month: 'Mar', count: 48 },
        { month: 'Apr', count: 61 },
        { month: 'May', count: 67 },
        { month: 'Jun', count: 73 }
      ],
      registrationSources: [
        { source: 'Website', count: 423, percentage: 47.4 },
        { source: 'Mobile App', count: 312, percentage: 35.0 },
        { source: 'Referral', count: 98, percentage: 11.0 },
        { source: 'Walk-in', count: 59, percentage: 6.6 }
      ]
    },
    // Budget and Financial Reports
    budget: {
      totalBudget: 75000,
      utilizedBudget: 45280,
      remainingBudget: 29720,
      budgetUtilization: 60.4,
      monthlyBudget: [
        { month: 'Jan', allocated: 12000, spent: 8500, remaining: 3500 },
        { month: 'Feb', allocated: 12000, spent: 9200, remaining: 2800 },
        { month: 'Mar', allocated: 13000, spent: 11200, remaining: 1800 },
        { month: 'Apr', allocated: 13000, spent: 9800, remaining: 3200 },
        { month: 'May', allocated: 12500, spent: 10800, remaining: 1700 },
        { month: 'Jun', allocated: 12500, spent: 9780, remaining: 2720 }
      ]
    },
    // Charges and Calculations
    charges: {
      serviceCharges: [
        { service: 'Classic Haircut', basePrice: 25, discount: 0, tax: 2.5, total: 27.5, bookings: 355 },
        { service: 'Beard Trim', basePrice: 15, discount: 1.5, tax: 1.35, total: 14.85, bookings: 356 },
        { service: 'Hair Color', basePrice: 45, discount: 4.5, tax: 4.05, total: 44.55, bookings: 184 },
        { service: 'Hot Towel Shave', basePrice: 20, discount: 2, tax: 1.8, total: 19.8, bookings: 183 },
        { service: 'Hair Wash', basePrice: 10, discount: 1, tax: 0.9, total: 9.9, bookings: 169 }
      ],
      totalTaxCollected: 5680,
      totalDiscountsGiven: 2340,
      averageTransactionValue: 36.25,
      paymentMethods: [
        { method: 'Cash', amount: 18250, transactions: 423, percentage: 40.3 },
        { method: 'Card', amount: 19890, transactions: 512, percentage: 43.9 },
        { method: 'Digital Wallet', amount: 7140, transactions: 312, percentage: 15.8 }
      ]
    },
    // Calculation Reports
    calculations: {
      profitMargin: 68.5,
      costOfGoodsSold: 14200,
      operatingExpenses: 8900,
      netProfit: 32180,
      roi: 142.3,
      customerAcquisitionCost: 12.50,
      lifetimeValue: 285.75,
      breakEvenPoint: 156,
      monthlyRecurringRevenue: 12500,
      churnRate: 4.2,
      conversionRate: 23.8
    },
    revenueByService: [
      { service: "Classic Haircut", revenue: 12450, bookings: 355, percentage: 27.5 },
      { service: "Beard Trim", revenue: 8920, bookings: 356, percentage: 19.7 },
      { service: "Hair Color", revenue: 15680, bookings: 184, percentage: 34.6 },
      { service: "Hot Towel Shave", revenue: 8230, bookings: 183, percentage: 18.2 }
    ],
    revenueByDay: [
      { day: "Mon", revenue: 5200 },
      { day: "Tue", revenue: 4800 },
      { day: "Wed", revenue: 6100 },
      { day: "Thu", revenue: 5800 },
      { day: "Fri", revenue: 7200 },
      { day: "Sat", revenue: 8900 },
      { day: "Sun", revenue: 7280 }
    ],
    topStaff: [
      { name: "Mike Johnson", revenue: 18250, bookings: 428, rating: 4.9 },
      { name: "Sarah Chen", revenue: 15680, bookings: 312, rating: 4.8 },
      { name: "Alex Rodriguez", revenue: 11350, bookings: 267, rating: 4.7 }
    ],
    customerRetention: {
      newCustomers: 156,
      returningCustomers: 736,
      retentionRate: 82.5
    },
    // Branch Expenses and Charges
    expenses: {
      totalExpenses: 15800,
      operatingCosts: 9200,
      staffSalaries: 6600,
      revenue: 45280,
      categories: [
        { name: 'Rent', amount: 3500, percentage: 22.2 },
        { name: 'Utilities', amount: 1200, percentage: 7.6 },
        { name: 'Supplies', amount: 800, percentage: 5.1 },
        { name: 'Staff Salaries', amount: 6600, percentage: 41.8 },
        { name: 'Equipment', amount: 1800, percentage: 11.4 },
        { name: 'Marketing', amount: 900, percentage: 5.7 },
        { name: 'Maintenance', amount: 600, percentage: 3.8 },
        { name: 'Insurance', amount: 400, percentage: 2.5 }
      ],
      recentExpenses: [
        { date: '2025-12-15', category: 'Supplies', description: 'Hair products and styling tools', amount: 450 },
        { date: '2025-12-14', category: 'Utilities', description: 'Electricity bill', amount: 320 },
        { date: '2025-12-13', category: 'Equipment', description: 'New clippers maintenance', amount: 180 },
        { date: '2025-12-12', category: 'Marketing', description: 'Social media ads', amount: 250 },
        { date: '2025-12-11', category: 'Rent', description: 'Monthly rent payment', amount: 3500 }
      ]
    }
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Excel Export Functions
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Overview Sheet
    const overviewData = [
      ['Analytics Overview Report', ''],
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

    // Registration Report Sheet
    const registrationData = [
      ['Registration Report', ''],
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
      ['Budget Report', ''],
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
      ['Charges & Calculations Report', ''],
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

    // Revenue by Service Sheet
    const revenueServiceData = [
      ['Revenue by Service', ''],
      ['Service', 'Revenue', 'Bookings', 'Percentage'],
      ...analytics.revenueByService.map(item => [
        item.service, item.revenue, item.bookings, `${item.percentage}%`
      ])
    ];
    const revenueServiceSheet = XLSX.utils.aoa_to_sheet(revenueServiceData);
    XLSX.utils.book_append_sheet(workbook, revenueServiceSheet, 'Revenue_by_Service');

    // Staff Performance Sheet
    const staffData = [
      ['Staff Performance Report', ''],
      ['Name', 'Revenue', 'Bookings', 'Rating'],
      ...analytics.topStaff.map(item => [
        item.name, item.revenue, item.bookings, item.rating
      ])
    ];
    const staffSheet = XLSX.utils.aoa_to_sheet(staffData);
    XLSX.utils.book_append_sheet(workbook, staffSheet, 'Staff_Performance');

    // Generate and download the file
    const fileName = `Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
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
                  <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-sm text-gray-600">Track your business performance</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CurrencySwitcher />
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
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

              {/* Comprehensive Reports Tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="registrations">Registrations</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="charges">Charges</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="calculations">Calculations</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue by Service */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue by Service</CardTitle>
                        <CardDescription>Top performing services this period</CardDescription>
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
                                    className="bg-secondary h-2 rounded-full"
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

                    {/* Revenue by Day */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue by Day</CardTitle>
                        <CardDescription>Daily revenue for the past week</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.revenueByDay.map((day, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm font-medium w-12">{day.day}</span>
                              <div className="flex-1 mx-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${(day.revenue / Math.max(...analytics.revenueByDay.map(d => d.revenue))) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-600">{formatCurrency(day.revenue)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Registrations Tab */}
                <TabsContent value="registrations" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.registrations.totalRegistrations}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">+{analytics.registrations.newThisMonth}</span> new this month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.registrations.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((analytics.registrations.activeUsers / analytics.registrations.totalRegistrations) * 100)}% of total
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.registrations.inactiveUsers}</div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((analytics.registrations.inactiveUsers / analytics.registrations.totalRegistrations) * 100)}% of total
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Registration Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Registration Trend</CardTitle>
                        <CardDescription>Monthly registration growth</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.registrations.registrationTrend.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm font-medium w-12">{item.month}</span>
                              <div className="flex-1 mx-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${(item.count / Math.max(...analytics.registrations.registrationTrend.map(r => r.count))) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-600">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Registration Sources */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Registration Sources</CardTitle>
                        <CardDescription>How customers found us</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.registrations.registrationSources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">{source.source}</span>
                                  <span className="text-sm text-gray-600">{source.count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${source.percentage}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {source.percentage}% of total
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Budget Tab */}
                <TabsContent value="budget" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.budget.totalBudget)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilized</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.budget.utilizedBudget)}</div>
                        <p className="text-xs text-muted-foreground">
                          {analytics.budget.budgetUtilization}% utilized
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.budget.remainingBudget)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.budget.budgetUtilization}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Monthly Budget Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Budget Breakdown</CardTitle>
                      <CardDescription>Detailed budget allocation and spending by month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Allocated</TableHead>
                            <TableHead>Spent</TableHead>
                            <TableHead>Remaining</TableHead>
                            <TableHead>Utilization</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics.budget.monthlyBudget.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.month}</TableCell>
                              <TableCell>{formatCurrency(item.allocated)}</TableCell>
                              <TableCell>{formatCurrency(item.spent)}</TableCell>
                              <TableCell>{formatCurrency(item.remaining)}</TableCell>
                              <TableCell>
                                <Badge variant={item.spent / item.allocated > 0.9 ? "destructive" : "default"}>
                                  {Math.round((item.spent / item.allocated) * 100)}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Charges Tab */}
                <TabsContent value="charges" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tax Collected</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.charges.totalTaxCollected)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.charges.totalDiscountsGiven)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.charges.averageTransactionValue)}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Service Charges Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Service Charges Breakdown</CardTitle>
                        <CardDescription>Detailed pricing for each service</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Service</TableHead>
                              <TableHead>Base Price</TableHead>
                              <TableHead>Discount</TableHead>
                              <TableHead>Tax</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {analytics.charges.serviceCharges.map((service, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{service.service}</TableCell>
                                <TableCell>{formatCurrency(service.basePrice)}</TableCell>
                                <TableCell>{formatCurrency(service.discount)}</TableCell>
                                <TableCell>{formatCurrency(service.tax)}</TableCell>
                                <TableCell className="font-semibold">{formatCurrency(service.total)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Revenue breakdown by payment type</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.charges.paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <div>
                                  <p className="font-medium">{method.method}</p>
                                  <p className="text-sm text-gray-600">{method.transactions} transactions</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(method.amount)}</p>
                                <p className="text-sm text-gray-600">{method.percentage}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Branch Charges & Expenses Tab */}
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
                          This month
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
                        <CardDescription>Breakdown of monthly expenses</CardDescription>
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

                    {/* Add New Expense */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Expense</CardTitle>
                        <CardDescription>Record branch expenses and charges</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
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

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Invoice (Optional)</label>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">Invoice URL</label>
                              <input
                                type="url"
                                value={expenseInvoiceUrl}
                                onChange={(e) => setExpenseInvoiceUrl(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://example.com/invoice.pdf"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">Or Upload Invoice Image</label>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setExpenseInvoiceFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                              {expenseInvoiceFile && (
                                <p className="text-xs text-green-600 mt-1">Selected: {expenseInvoiceFile.name}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button onClick={handleAddExpense} className="w-full" disabled={!expenseCategory || !expenseAmount}>
                          <Receipt className="w-4 h-4 mr-2" />
                          Add Expense
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Expenses Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Expenses</CardTitle>
                      <CardDescription>Latest expense entries for this branch</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(analytics.expenses?.recentExpenses || []).map((expense, index) => (
                            <TableRow key={index}>
                              <TableCell>{expense.date}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{expense.category}</Badge>
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

                {/* Calculations Tab */}
                <TabsContent value="calculations" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.calculations.profitMargin}%</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.calculations.netProfit)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ROI</CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.calculations.roi}%</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.calculations.lifetimeValue)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CAC</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.calculations.customerAcquisitionCost)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">MRR</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analytics.calculations.monthlyRecurringRevenue)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.calculations.churnRate}%</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.calculations.conversionRate}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Financial Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Summary</CardTitle>
                      <CardDescription>Key financial metrics and calculations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Revenue</span>
                            <span className="text-sm">{formatCurrency(analytics.overview.totalRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Cost of Goods Sold</span>
                            <span className="text-sm">{formatCurrency(analytics.calculations.costOfGoodsSold)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Operating Expenses</span>
                            <span className="text-sm">{formatCurrency(analytics.calculations.operatingExpenses)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-sm font-semibold">Net Profit</span>
                            <span className="text-sm font-semibold">{formatCurrency(analytics.calculations.netProfit)}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Break Even Point</span>
                            <span className="text-sm">{analytics.calculations.breakEvenPoint} customers</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">LTV/CAC Ratio</span>
                            <span className="text-sm">{(analytics.calculations.lifetimeValue / analytics.calculations.customerAcquisitionCost).toFixed(1)}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Monthly Growth Rate</span>
                            <span className="text-sm">{analytics.overview.customersChange}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Staff Performance */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Staff Performance</CardTitle>
                        <CardDescription>Highest earning staff members</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.topStaff.map((staff, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                                  {staff.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">{staff.name}</p>
                                  <p className="text-sm text-gray-600">{staff.bookings} bookings</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(staff.revenue)}</p>
                                <p className="text-sm text-gray-600">★ {staff.rating}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Customer Retention */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Retention</CardTitle>
                        <CardDescription>Customer loyalty metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-secondary mb-2">
                              {analytics.customerRetention.retentionRate}%
                            </div>
                            <p className="text-sm text-gray-600">Retention Rate</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {analytics.customerRetention.returningCustomers}
                              </div>
                              <p className="text-sm text-gray-600">Returning</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {analytics.customerRetention.newCustomers}
                              </div>
                              <p className="text-sm text-gray-600">New Customers</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>New vs Returning</span>
                              <span>{Math.round((analytics.customerRetention.newCustomers / (analytics.customerRetention.newCustomers + analytics.customerRetention.returningCustomers)) * 100)}% new</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(analytics.customerRetention.newCustomers / (analytics.customerRetention.newCustomers + analytics.customerRetention.returningCustomers)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}