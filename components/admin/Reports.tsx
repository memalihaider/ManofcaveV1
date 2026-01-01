import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CurrencyDollarIcon,
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Types for the Reports component
interface ReportData {
  pageViews: number;
  propertyInquiries: number;
  propertiesSold: number;
  transactionValue: number;
  topProperties: Array<{
    title: string;
    views: number;
    inquiries: number;
    value: string;
  }>;
  revenueByCategory: Array<{
    category: string;
    amount: string;
    percentage: number;
  }>;
  monthlyPerformance: {
    propertiesListed: number;
    propertiesSold: number;
    totalRevenue: string;
  };
}

interface ReportsProps {
  // Props can be added here if needed for data passing
}

const Reports: React.FC<ReportsProps> = () => {
  // State for report data
  const [reportData, setReportData] = useState<ReportData>({
    pageViews: 45231,
    propertyInquiries: 2847,
    propertiesSold: 156,
    transactionValue: 2400000000, // AED 2.4B
    topProperties: [
      { title: 'Dubai Marina Penthouse', views: 2847, inquiries: 23, value: 'AED 12M' },
      { title: 'Palm Jumeirah Villa', views: 2156, inquiries: 18, value: 'AED 25M' },
      { title: 'Downtown Dubai Apartment', views: 1893, inquiries: 15, value: 'AED 8.5M' },
      { title: 'Jumeirah Beach Residence', views: 1654, inquiries: 12, value: 'AED 15M' },
    ],
    revenueByCategory: [
      { category: 'Apartments', amount: 'AED 850M', percentage: 35.4 },
      { category: 'Villas', amount: 'AED 720M', percentage: 30.0 },
      { category: 'Commercial', amount: 'AED 480M', percentage: 20.0 },
      { category: 'Plots', amount: 'AED 350M', percentage: 14.6 },
    ],
    monthlyPerformance: {
      propertiesListed: 156,
      propertiesSold: 89,
      totalRevenue: 'AED 1.2B',
    },
  });

  // State for filters and date ranges
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [reportType, setReportType] = useState<'overview' | 'properties' | 'revenue' | 'users'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for different time periods (in a real app, this would come from an API)
  const mockDataByPeriod = {
    '7d': {
      pageViews: 12450,
      propertyInquiries: 823,
      propertiesSold: 23,
      transactionValue: 450000000,
    },
    '30d': {
      pageViews: 45231,
      propertyInquiries: 2847,
      propertiesSold: 156,
      transactionValue: 2400000000,
    },
    '90d': {
      pageViews: 128450,
      propertyInquiries: 8234,
      propertiesSold: 423,
      transactionValue: 6800000000,
    },
    '1y': {
      pageViews: 487231,
      propertyInquiries: 28947,
      propertiesSold: 1456,
      transactionValue: 24500000000,
    },
  };

  // Update data when date range changes
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReportData(prev => ({
        ...prev,
        ...mockDataByPeriod[dateRange],
      }));
      setIsLoading(false);
    }, 500);
  }, [dateRange]);

  // Format currency values
  const formatCurrency = (value: number): string => {
    if (value >= 1000000000) {
      return `AED ${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `AED ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `AED ${(value / 1000).toFixed(1)}K`;
    }
    return `AED ${value.toLocaleString()}`;
  };

  // Calculate percentage changes (mock data)
  const getPercentageChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  // Export functions
  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF report
    console.log('Exporting PDF report...');
    // Mock implementation
    alert('PDF report exported successfully!');
  };

  const handleExportExcel = () => {
    // In a real app, this would generate and download an Excel file
    console.log('Exporting Excel report...');
    // Mock implementation
    alert('Excel report exported successfully!');
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    console.log('Exporting CSV report...');
    // Mock implementation
    alert('CSV report exported successfully!');
  };

  // Filter top properties based on search term
  const filteredProperties = reportData.topProperties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your platform performance</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          {/* Report Type Selector */}
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as typeof reportType)}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="overview">Overview</option>
            <option value="properties">Properties</option>
            <option value="revenue">Revenue</option>
            <option value="users">Users</option>
          </select>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Excel
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading report data...</span>
        </div>
      )}

      {/* Overview Statistics Cards */}
      {!isLoading && reportType === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Page Views Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <EyeIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">{reportData.pageViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                  <div className="flex items-center mt-1">
                    {getPercentageChange(reportData.pageViews, mockDataByPeriod['7d'].pageViews).isPositive ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <p className={`text-xs ${getPercentageChange(reportData.pageViews, mockDataByPeriod['7d'].pageViews).isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {getPercentageChange(reportData.pageViews, mockDataByPeriod['7d'].pageViews).value.toFixed(1)}% from last period
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Inquiries Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <HomeIcon className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">{reportData.propertyInquiries.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Property Inquiries</p>
                  <div className="flex items-center mt-1">
                    {getPercentageChange(reportData.propertyInquiries, mockDataByPeriod['7d'].propertyInquiries).isPositive ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <p className={`text-xs ${getPercentageChange(reportData.propertyInquiries, mockDataByPeriod['7d'].propertyInquiries).isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {getPercentageChange(reportData.propertyInquiries, mockDataByPeriod['7d'].propertyInquiries).value.toFixed(1)}% from last period
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Sold Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">{reportData.propertiesSold}</p>
                  <p className="text-sm text-muted-foreground">Properties Sold</p>
                  <div className="flex items-center mt-1">
                    {getPercentageChange(reportData.propertiesSold, mockDataByPeriod['7d'].propertiesSold).isPositive ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <p className={`text-xs ${getPercentageChange(reportData.propertiesSold, mockDataByPeriod['7d'].propertiesSold).isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {getPercentageChange(reportData.propertiesSold, mockDataByPeriod['7d'].propertiesSold).value.toFixed(1)}% from last period
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Value Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(reportData.transactionValue)}</p>
                  <p className="text-sm text-muted-foreground">Transaction Value</p>
                  <div className="flex items-center mt-1">
                    {getPercentageChange(reportData.transactionValue, mockDataByPeriod['7d'].transactionValue).isPositive ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <p className={`text-xs ${getPercentageChange(reportData.transactionValue, mockDataByPeriod['7d'].transactionValue).isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {getPercentageChange(reportData.transactionValue, mockDataByPeriod['7d'].transactionValue).value.toFixed(1)}% from last period
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Properties */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Top Performing Properties</h3>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-4">
                {filteredProperties.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{property.title}</p>
                      <p className="text-sm text-muted-foreground">{property.value}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{property.views.toLocaleString()} views</p>
                      <p className="text-sm text-primary">{property.inquiries} inquiries</p>
                    </div>
                  </div>
                ))}
                {filteredProperties.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No properties found matching your search.
                  </div>
                )}
              </div>
            </div>

            {/* Revenue by Category */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue by Category</h3>
              <div className="space-y-4">
                {reportData.revenueByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.category}</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-foreground">{item.amount}</p>
                      <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">{reportData.monthlyPerformance.propertiesListed}</p>
                <p className="text-sm text-muted-foreground">Properties Listed</p>
                <p className="text-xs text-green-500 mt-1">+12% vs last month</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">{reportData.monthlyPerformance.propertiesSold}</p>
                <p className="text-sm text-muted-foreground">Properties Sold</p>
                <p className="text-xs text-red-500 mt-1">-5% vs last month</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">{reportData.monthlyPerformance.totalRevenue}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xs text-green-500 mt-1">+18% vs last month</p>
              </div>
            </div>
          </div>

          {/* Additional Analytics - User Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8,942</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-xs text-green-500 mt-1">+23.5% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-500/10 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4.2</p>
                  <p className="text-sm text-muted-foreground">Avg Session Duration</p>
                  <p className="text-xs text-green-500 mt-1">+8.1% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500/10 rounded-lg">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">67.8%</p>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-xs text-green-500 mt-1">+5.2% from last month</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Properties Report */}
      {reportType === 'properties' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Property Performance Report</h3>
            <div className="text-center py-12 text-muted-foreground">
              <HomeIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Detailed property analytics and performance metrics will be displayed here.</p>
              <p className="text-sm mt-2">This section is under development.</p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Analytics Report</h3>
            <div className="text-center py-12 text-muted-foreground">
              <CurrencyDollarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Comprehensive revenue analysis and financial insights will be displayed here.</p>
              <p className="text-sm mt-2">This section is under development.</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Report */}
      {reportType === 'users' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">User Analytics Report</h3>
            <div className="text-center py-12 text-muted-foreground">
              <UserGroupIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>User behavior analysis and engagement metrics will be displayed here.</p>
              <p className="text-sm mt-2">This section is under development.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;