'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Settings, AlertTriangle, Clock, Calendar, Users, DollarSign, Bell, CheckCircle, XCircle, FileText, BarChart3, TrendingUp, Activity } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BookingRulesManager } from "@/components/ui/booking-rules-manager";
import { NoShowPolicyManager } from "@/components/ui/no-show-policy-manager";
import { NotificationSystem, useNotifications } from "@/components/ui/notification-system";

export default function AdminPolicies() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { notifications, addNotification, markAsRead, dismiss } = useNotifications();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('booking-rules');

  // Mock data for booking rules
  const [bookingRules, setBookingRules] = useState<any[]>([]);
  const [businessHours, setBusinessHours] = useState<any>({});
  const [cancellationPolicies, setCancellationPolicies] = useState<any[]>([]);

  // Mock data for no-show policies
  const [noShowPolicies, setNoShowPolicies] = useState<any[]>([]);
  const [noShowIncidents, setNoShowIncidents] = useState<any[]>([]);
  const [noShowAnalytics, setNoShowAnalytics] = useState({
    totalNoShows: 0,
    totalRevenueLost: 0,
    averageNoShowRate: 0,
    topNoShowServices: [],
    topNoShowCustomers: [],
    noShowTrends: [],
    branchComparison: []
  });

  // Mock data for branches, services, barbers, customers
  const branches = [
    { id: 'branch-1', name: 'Downtown Branch', location: '123 Main St' },
    { id: 'branch-2', name: 'Uptown Branch', location: '456 Oak Ave' },
    { id: 'branch-3', name: 'Mall Branch', location: '789 Shopping Center' }
  ];

  const services = [
    { id: 'service-1', name: 'Classic Haircut', category: 'Hair Services' },
    { id: 'service-2', name: 'Beard Trim', category: 'Grooming' },
    { id: 'service-3', name: 'Hair Coloring', category: 'Hair Services' },
    { id: 'service-4', name: 'Facial Treatment', category: 'Skincare' }
  ];

  const barbers = [
    { id: 'barber-1', name: 'John Smith' },
    { id: 'barber-2', name: 'Mike Johnson' },
    { id: 'barber-3', name: 'Sarah Davis' }
  ];

  const customers = [
    { id: 'customer-1', name: 'Alice Brown', email: 'alice@example.com', phone: '+1234567890' },
    { id: 'customer-2', name: 'Bob Wilson', email: 'bob@example.com', phone: '+1234567891' },
    { id: 'customer-3', name: 'Carol Davis', email: 'carol@example.com', phone: '+1234567892' }
  ];

  // Booking Rules handlers
  const handleRuleCreate = (rule: any) => {
    const newRule = { ...rule, id: `rule-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setBookingRules(prev => [...prev, newRule]);
    addNotification({
      title: 'Booking Rule Created',
      message: `New rule "${rule.name}" has been created successfully.`,
      type: 'success'
    });
  };

  const handleRuleUpdate = (ruleId: string, updates: any) => {
    setBookingRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
    addNotification({
      title: 'Booking Rule Updated',
      message: 'The booking rule has been updated successfully.',
      type: 'info'
    });
  };

  const handleRuleDelete = (ruleId: string) => {
    setBookingRules(prev => prev.filter(rule => rule.id !== ruleId));
    addNotification({
      title: 'Booking Rule Deleted',
      message: 'The booking rule has been deleted successfully.',
      type: 'warning'
    });
  };

  const handleBusinessHoursUpdate = (branchId: string, hours: any) => {
    setBusinessHours((prev: any) => ({ ...prev, [branchId]: hours }));
    addNotification({
      title: 'Business Hours Updated',
      message: 'Business hours have been updated successfully.',
      type: 'success'
    });
  };

  const handleCancellationPolicyCreate = (policy: any) => {
    const newPolicy = { ...policy, id: `policy-${Date.now()}` };
    setCancellationPolicies(prev => [...prev, newPolicy]);
    addNotification({
      title: 'Cancellation Policy Created',
      message: `New policy "${policy.name}" has been created successfully.`,
      type: 'success'
    });
  };

  const handleCancellationPolicyUpdate = (policyId: string, updates: any) => {
    setCancellationPolicies(prev => prev.map(policy =>
      policy.id === policyId ? { ...policy, ...updates } : policy
    ));
  };

  const handleCancellationPolicyDelete = (policyId: string) => {
    setCancellationPolicies(prev => prev.filter(policy => policy.id !== policyId));
  };

  // No-Show Policy handlers
  const handleNoShowPolicyCreate = (policy: any) => {
    const newPolicy = { ...policy, id: `noshow-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setNoShowPolicies(prev => [...prev, newPolicy]);
    addNotification({
      title: 'No-Show Policy Created',
      message: `New no-show policy "${policy.name}" has been created successfully.`,
      type: 'success'
    });
  };

  const handleNoShowPolicyUpdate = (policyId: string, updates: any) => {
    setNoShowPolicies(prev => prev.map(policy =>
      policy.id === policyId ? { ...policy, ...updates } : policy
    ));
  };

  const handleNoShowPolicyDelete = (policyId: string) => {
    setNoShowPolicies(prev => prev.filter(policy => policy.id !== policyId));
  };

  const handleIncidentCreate = (incident: any) => {
    const newIncident = { ...incident, id: `incident-${Date.now()}`, createdAt: new Date().toISOString() };
    setNoShowIncidents(prev => [...prev, newIncident]);
    addNotification({
      title: 'No-Show Incident Reported',
      message: `No-show incident for ${incident.customerName} has been reported.`,
      type: 'warning'
    });
  };

  const handleIncidentUpdate = (incidentId: string, updates: any) => {
    setNoShowIncidents(prev => prev.map(incident =>
      incident.id === incidentId ? { ...incident, ...updates } : incident
    ));
  };

  const handleIncidentResolve = (incidentId: string, resolution: any) => {
    setNoShowIncidents(prev => prev.map(incident =>
      incident.id === incidentId ? { ...incident, status: 'resolved' } : incident
    ));
  };

  const handleFeeCharge = (incidentId: string, amount: number) => {
    setNoShowIncidents(prev => prev.map(incident =>
      incident.id === incidentId ? { ...incident, feeCharged: amount, status: 'fee_charged' } : incident
    ));
  };

  const handleSendWarning = (customerId: string, message: string) => {
    addNotification({
      title: 'Warning Sent',
      message: `Warning sent to customer ${customerId}.`,
      type: 'info'
    });
  };

  const handleApplyRestriction = (customerId: string, duration: number) => {
    addNotification({
      title: 'Restriction Applied',
      message: `Booking restriction applied to customer ${customerId} for ${duration} days.`,
      type: 'warning'
    });
  };

  const handleBlacklistCustomer = (customerId: string, reason: string) => {
    addNotification({
      title: 'Customer Blacklisted',
      message: `Customer ${customerId} has been blacklisted. Reason: ${reason}`,
      type: 'error'
    });
  };

  // Analytics overview
  const policyStats = {
    totalRules: bookingRules.length,
    activeRules: bookingRules.filter(r => r.isActive).length,
    totalPolicies: noShowPolicies.length,
    activePolicies: noShowPolicies.filter(p => p.isActive).length,
    totalIncidents: noShowIncidents.length,
    unresolvedIncidents: noShowIncidents.filter(i => i.status !== 'resolved').length
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role={(user?.role === 'super_admin' || user?.role === 'branch_admin') ? user.role : 'branch_admin'} onLogout={handleLogout} />

        {/* Mobile Sidebar */}
        <AdminMobileSidebar
          role={(user?.role === 'super_admin' || user?.role === 'branch_admin') ? user.role : 'branch_admin'}
          onLogout={handleLogout}
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
                  <Settings className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Policies & Rules</h1>
                  <p className="text-sm text-gray-600">Manage booking rules, policies, and no-show enforcement</p>
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
                    <Settings className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Rules</p>
                      <p className="text-2xl font-bold">{policyStats.totalRules}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Rules</p>
                      <p className="text-2xl font-bold">{policyStats.activeRules}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Policies</p>
                      <p className="text-2xl font-bold">{policyStats.totalPolicies}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Policies</p>
                      <p className="text-2xl font-bold">{policyStats.activePolicies}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Incidents</p>
                      <p className="text-2xl font-bold">{policyStats.totalIncidents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <XCircle className="w-8 h-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Unresolved</p>
                      <p className="text-2xl font-bold">{policyStats.unresolvedIncidents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="booking-rules" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Booking Rules
                </TabsTrigger>
                <TabsTrigger value="no-show-policy" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  No-Show Policy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="booking-rules" className="mt-6">
                <BookingRulesManager
                  rules={bookingRules}
                  businessHours={businessHours}
                  cancellationPolicies={cancellationPolicies}
                  branches={branches}
                  services={services}
                  barbers={barbers}
                  onRuleCreate={handleRuleCreate}
                  onRuleUpdate={handleRuleUpdate}
                  onRuleDelete={handleRuleDelete}
                  onBusinessHoursUpdate={handleBusinessHoursUpdate}
                  onCancellationPolicyCreate={handleCancellationPolicyCreate}
                  onCancellationPolicyUpdate={handleCancellationPolicyUpdate}
                  onCancellationPolicyDelete={handleCancellationPolicyDelete}
                />
              </TabsContent>

              <TabsContent value="no-show-policy" className="mt-6">
                <NoShowPolicyManager
                  policies={noShowPolicies}
                  incidents={noShowIncidents}
                  analytics={noShowAnalytics}
                  branches={branches}
                  customers={customers}
                  onPolicyCreate={handleNoShowPolicyCreate}
                  onPolicyUpdate={handleNoShowPolicyUpdate}
                  onPolicyDelete={handleNoShowPolicyDelete}
                  onIncidentCreate={handleIncidentCreate}
                  onIncidentUpdate={handleIncidentUpdate}
                  onIncidentResolve={handleIncidentResolve}
                  onFeeCharge={handleFeeCharge}
                  onSendWarning={handleSendWarning}
                  onApplyRestriction={handleApplyRestriction}
                  onBlacklistCustomer={handleBlacklistCustomer}
                />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};