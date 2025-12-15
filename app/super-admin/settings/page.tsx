'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, Palette, Database, Mail, Phone, MapPin, Clock, Save, RefreshCw, Plus, Trash2, MessageSquare, FileText, CreditCard, Upload, Download } from "lucide-react";
import { PermissionProtectedRoute, PermissionProtectedSection } from "@/components/PermissionProtected";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SuperAdminSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [settings, setSettings] = useState({
    // General Settings
    businessName: "Luxury Barbershop Chain",
    businessEmail: "admin@luxurybarbershop.com",
    businessPhone: "+1 (555) 123-4567",
    businessAddress: "123 Main Street, Suite 100",
    businessCity: "New York",
    businessState: "NY",
    businessZip: "10001",
    timezone: "America/New_York",
    currency: "AED",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingReminders: true,
    paymentNotifications: true,
    systemAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",

    // Appearance Settings
    theme: "luxury",
    primaryColor: "#1a1a1a",
    secondaryColor: "#d4af37",
    accentColor: "#8b4513",

    // System Settings
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "365",
    maintenanceMode: false,
    debugMode: false,
    taxRate: "8.25",
    smsProvider: "twilio",
    senderId: "LuxuryBarbershop",
    requireTermsAcceptance: true,
    autoUpdateTerms: false
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: "Stripe", apiKey: "", secretKey: "", enabled: true },
    { id: 2, name: "PayPal", apiKey: "", secretKey: "", enabled: false }
  ]);

  const [smsContent, setSmsContent] = useState({
    approval: "Your booking has been approved! We're excited to see you on {date} at {time}.",
    pending: "Your booking request is pending approval. We'll notify you once confirmed.",
    upcoming: "Reminder: You have a booking tomorrow at {time} with {staff}.",
    rejection: "Unfortunately, your booking request could not be accommodated. Please try another time.",
    offers: "Special offer: {offer} available now! Book your appointment today.",
    general: "Thank you for choosing our services. We look forward to serving you."
  });

  const [termsContent, setTermsContent] = useState({
    title: "Terms and Conditions",
    content: `# Terms and Conditions

## 1. Introduction
Welcome to our barbershop services. These terms and conditions govern your use of our services.

## 2. Booking Policy
- Bookings must be made in advance
- Cancellations require 24-hour notice
- Late arrivals may result in shortened services

## 3. Payment Terms
- Payment is due at the time of service
- We accept cash, credit cards, and digital payments
- Refunds are processed within 7 business days

## 4. Liability
We are not liable for any indirect or consequential damages arising from our services.

## 5. Contact Information
For any questions, please contact us at admin@luxurybarbershop.com`
  });

  // User Management State
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@luxurybarbershop.com",
      role: "super_admin",
      branch: "All Branches",
      status: "active",
      lastLogin: "2025-12-15 10:30 AM",
      permissions: ["all"]
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@branch1.com",
      role: "branch_admin",
      branch: "Downtown Branch",
      status: "active",
      lastLogin: "2025-12-14 2:15 PM",
      permissions: ["appointments.view", "staff.manage", "services.view"]
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@branch2.com",
      role: "branch_admin",
      branch: "Uptown Branch",
      status: "inactive",
      lastLogin: "2025-12-10 9:45 AM",
      permissions: ["appointments.view", "services.view"]
    }
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: "2025-12-15 10:30:15",
      user: "John Doe",
      action: "User Login",
      resource: "Authentication",
      details: "Successful login from IP 192.168.1.100",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 131.0.0.0"
    },
    {
      id: 2,
      timestamp: "2025-12-15 10:25:30",
      user: "Jane Smith",
      action: "Created Appointment",
      resource: "Appointments",
      details: "Created appointment for customer ID 12345",
      ipAddress: "192.168.1.101",
      userAgent: "Safari 17.1"
    },
    {
      id: 3,
      timestamp: "2025-12-15 10:20:45",
      user: "John Doe",
      action: "Updated Settings",
      resource: "System Settings",
      details: "Modified business information settings",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 131.0.0.0"
    },
    {
      id: 4,
      timestamp: "2025-12-15 10:15:20",
      user: "Mike Johnson",
      action: "Deleted Service",
      resource: "Services",
      details: "Removed service 'Hair Treatment' from branch inventory",
      ipAddress: "192.168.1.102",
      userAgent: "Firefox 133.0"
    },
    {
      id: 5,
      timestamp: "2025-12-15 10:10:10",
      user: "Jane Smith",
      action: "Password Reset",
      resource: "User Management",
      details: "Requested password reset for user account",
      ipAddress: "192.168.1.101",
      userAgent: "Safari 17.1"
    }
  ]);

  // Branding State
  const [branding, setBranding] = useState({
    companyName: "Luxury Barbershop Chain",
    logo: "/logo.png",
    primaryColor: "#1a1a1a",
    secondaryColor: "#d4af37",
    accentColor: "#8b4513",
    fontFamily: "serif",
    favicon: "/favicon.ico",
    customCss: "",
    emailTemplate: "luxury",
    smsSignature: "Luxury Barbershop"
  });

  // Data Import/Export State
  const [importExport, setImportExport] = useState({
    exportFormat: "csv",
    includeImages: true,
    dateRange: "all",
    selectedTables: ["customers", "appointments", "services"],
    compression: "zip"
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <PermissionProtectedRoute requiredPermissions={['settings.view']}>
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
                  <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                  <p className="text-sm text-gray-600">Configure system-wide settings and preferences</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
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
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-11">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Branding
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Audit Logs
                  </TabsTrigger>
                  <TabsTrigger value="system" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    System
                  </TabsTrigger>
                  <PermissionProtectedSection requiredPermissions={['payment_methods.view']}>
                    <TabsTrigger value="payment-methods" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Methods
                    </TabsTrigger>
                  </PermissionProtectedSection>
                  <PermissionProtectedSection requiredPermissions={['sms_content.view']}>
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      SMS Content
                    </TabsTrigger>
                  </PermissionProtectedSection>
                  <PermissionProtectedSection requiredPermissions={['data_import.view']}>
                    <TabsTrigger value="data" className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Data Import/Export
                    </TabsTrigger>
                  </PermissionProtectedSection>
                  <PermissionProtectedSection requiredPermissions={['terms.view']}>
                    <TabsTrigger value="terms" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Terms & Conditions
                    </TabsTrigger>
                  </PermissionProtectedSection>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>Basic business details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            value={settings.businessName}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessEmail">Business Email</Label>
                          <Input
                            id="businessEmail"
                            type="email"
                            value={settings.businessEmail}
                            onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessPhone">Business Phone</Label>
                          <Input
                            id="businessPhone"
                            value={settings.businessPhone}
                            onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Business Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="businessAddress">Street Address</Label>
                            <Input
                              id="businessAddress"
                              value={settings.businessAddress}
                              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessCity">City</Label>
                            <Input
                              id="businessCity"
                              value={settings.businessCity}
                              onChange={(e) => handleInputChange('businessCity', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessState">State</Label>
                            <Input
                              id="businessState"
                              value={settings.businessState}
                              onChange={(e) => handleInputChange('businessState', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessZip">ZIP Code</Label>
                            <Input
                              id="businessZip"
                              value={settings.businessZip}
                              onChange={(e) => handleInputChange('businessZip', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="CAD">CAD (C$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Configure how and when you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                          </div>
                          <Switch
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                          </div>
                          <Switch
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Types</h3>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Booking Reminders</Label>
                            <p className="text-sm text-gray-600">Notify about upcoming appointments</p>
                          </div>
                          <Switch
                            checked={settings.bookingReminders}
                            onCheckedChange={(checked) => handleInputChange('bookingReminders', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Payment Notifications</Label>
                            <p className="text-sm text-gray-600">Notify about payment activities</p>
                          </div>
                          <Switch
                            checked={settings.paymentNotifications}
                            onCheckedChange={(checked) => handleInputChange('paymentNotifications', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>System Alerts</Label>
                            <p className="text-sm text-gray-600">Notify about system issues and updates</p>
                          </div>
                          <Switch
                            checked={settings.systemAlerts}
                            onCheckedChange={(checked) => handleInputChange('systemAlerts', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Configuration</CardTitle>
                      <CardDescription>Manage security settings and access controls</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                          </div>
                          <Switch
                            checked={settings.twoFactorAuth}
                            onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Select value={settings.sessionTimeout} onValueChange={(value) => handleInputChange('sessionTimeout', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                          <Select value={settings.passwordExpiry} onValueChange={(value) => handleInputChange('passwordExpiry', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                          <Select value={settings.loginAttempts} onValueChange={(value) => handleInputChange('loginAttempts', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 attempts</SelectItem>
                              <SelectItem value="5">5 attempts</SelectItem>
                              <SelectItem value="10">10 attempts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Branding Settings */}
                <TabsContent value="appearance">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>White-Label Branding</CardTitle>
                        <CardDescription>Customize your company branding across all locations</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                              id="companyName"
                              value={branding.companyName}
                              onChange={(e) => setBranding({...branding, companyName: e.target.value})}
                              placeholder="Enter your company name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smsSignature">SMS Signature</Label>
                            <Input
                              id="smsSignature"
                              value={branding.smsSignature}
                              onChange={(e) => setBranding({...branding, smsSignature: e.target.value})}
                              placeholder="Your SMS signature"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label>Logo Upload</Label>
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              <Upload className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Upload your company logo</p>
                              <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                              <Button variant="outline" size="sm" className="mt-2">
                                Choose File
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Color Scheme</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="primaryColor">Primary Color</Label>
                              <Input
                                id="primaryColor"
                                type="color"
                                value={branding.primaryColor}
                                onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                                className="w-full h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="secondaryColor">Secondary Color</Label>
                              <Input
                                id="secondaryColor"
                                type="color"
                                value={branding.secondaryColor}
                                onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                                className="w-full h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="accentColor">Accent Color</Label>
                              <Input
                                id="accentColor"
                                type="color"
                                value={branding.accentColor}
                                onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                                className="w-full h-10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fontFamily">Font Family</Label>
                          <Select value={branding.fontFamily} onValueChange={(value) => setBranding({...branding, fontFamily: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="serif">Serif (Classic)</SelectItem>
                              <SelectItem value="sans-serif">Sans Serif (Modern)</SelectItem>
                              <SelectItem value="monospace">Monospace</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emailTemplate">Email Template Style</Label>
                          <Select value={branding.emailTemplate} onValueChange={(value) => setBranding({...branding, emailTemplate: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="luxury">Luxury</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customCss">Custom CSS</Label>
                          <Textarea
                            id="customCss"
                            value={branding.customCss}
                            onChange={(e) => setBranding({...branding, customCss: e.target.value})}
                            placeholder="Enter custom CSS for advanced styling"
                            rows={4}
                          />
                        </div>

                        <Button className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          Save Branding Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Configuration</CardTitle>
                      <CardDescription>Advanced system settings and maintenance options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Automatic Backups</Label>
                            <p className="text-sm text-gray-600">Automatically backup system data</p>
                          </div>
                          <Switch
                            checked={settings.autoBackup}
                            onCheckedChange={(checked) => handleInputChange('autoBackup', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Maintenance Mode</Label>
                            <p className="text-sm text-gray-600">Put system in maintenance mode</p>
                          </div>
                          <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Debug Mode</Label>
                            <p className="text-sm text-gray-600">Enable detailed logging and debugging</p>
                          </div>
                          <Switch
                            checked={settings.debugMode}
                            onCheckedChange={(checked) => handleInputChange('debugMode', checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Backup Frequency</Label>
                          <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dataRetention">Data Retention (days)</Label>
                          <Select value={settings.dataRetention} onValueChange={(value) => handleInputChange('dataRetention', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                              <SelectItem value="365">1 year</SelectItem>
                              <SelectItem value="730">2 years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payment Methods */}
                <PermissionProtectedSection requiredPermissions={['payment_methods.view']}>
                  <TabsContent value="payment-methods">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods Configuration</CardTitle>
                      <CardDescription>Configure payment gateways and processing options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Payment Gateways</h3>
                          <p className="text-sm text-gray-600">Manage your payment processing integrations</p>
                        </div>
                        <Button
                          onClick={() => setPaymentMethods([...paymentMethods, {
                            id: Date.now(),
                            name: "",
                            apiKey: "",
                            secretKey: "",
                            enabled: false
                          }])}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Gateway
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {paymentMethods.map((method, index) => (
                          <Card key={method.id} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">{method.name || `Gateway ${index + 1}`}</h4>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={method.enabled}
                                  onCheckedChange={(checked) => {
                                    const updated = [...paymentMethods];
                                    updated[index].enabled = checked;
                                    setPaymentMethods(updated);
                                  }}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPaymentMethods(paymentMethods.filter(m => m.id !== method.id))}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Gateway Name</Label>
                                <Input
                                  value={method.name}
                                  onChange={(e) => {
                                    const updated = [...paymentMethods];
                                    updated[index].name = e.target.value;
                                    setPaymentMethods(updated);
                                  }}
                                  placeholder="e.g., Stripe, PayPal"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>API Key</Label>
                                <Input
                                  type="password"
                                  value={method.apiKey}
                                  onChange={(e) => {
                                    const updated = [...paymentMethods];
                                    updated[index].apiKey = e.target.value;
                                    setPaymentMethods(updated);
                                  }}
                                  placeholder="Enter API key"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Secret Key</Label>
                                <Input
                                  type="password"
                                  value={method.secretKey}
                                  onChange={(e) => {
                                    const updated = [...paymentMethods];
                                    updated[index].secretKey = e.target.value;
                                    setPaymentMethods(updated);
                                  }}
                                  placeholder="Enter secret key"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Payment Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Currency</Label>
                            <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="CAD">CAD (C$)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Tax Rate (%)</Label>
                            <Input
                              type="number"
                              placeholder="8.25"
                              value={settings.taxRate || ""}
                              onChange={(e) => handleInputChange('taxRate', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                </PermissionProtectedSection>

                {/* SMS Content */}
                <PermissionProtectedSection requiredPermissions={['sms_content.view']}>
                  <TabsContent value="sms">
                  <Card>
                    <CardHeader>
                      <CardTitle>SMS Content Templates</CardTitle>
                      <CardDescription>Customize SMS messages sent to customers for different scenarios</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-6">
                        {/* Approval Message */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <Label className="text-base font-medium">Booking Approval</Label>
                          </div>
                          <Textarea
                            value={smsContent.approval}
                            onChange={(e) => setSmsContent({...smsContent, approval: e.target.value})}
                            placeholder="Enter approval message template"
                            rows={3}
                          />
                          <p className="text-sm text-gray-600">
                            Available placeholders: {'{date}'}, {'{time}'}, {'{staff}'}, {'{service}'}
                          </p>
                        </div>

                        {/* Pending Message */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <Label className="text-base font-medium">Booking Pending</Label>
                          </div>
                          <Textarea
                            value={smsContent.pending}
                            onChange={(e) => setSmsContent({...smsContent, pending: e.target.value})}
                            placeholder="Enter pending message template"
                            rows={3}
                          />
                          <p className="text-sm text-gray-600">
                            Available placeholders: {'{date}'}, {'{time}'}
                          </p>
                        </div>

                        {/* Upcoming Message */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <Label className="text-base font-medium">Upcoming Appointment Reminder</Label>
                          </div>
                          <Textarea
                            value={smsContent.upcoming}
                            onChange={(e) => setSmsContent({...smsContent, upcoming: e.target.value})}
                            placeholder="Enter reminder message template"
                            rows={3}
                          />
                          <p className="text-sm text-gray-600">
                            Available placeholders: {'{time}'}, {'{staff}'}, {'{service}'}
                          </p>
                        </div>

                        {/* Rejection Message */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <Label className="text-base font-medium">Booking Rejection</Label>
                          </div>
                          <Textarea
                            value={smsContent.rejection}
                            onChange={(e) => setSmsContent({...smsContent, rejection: e.target.value})}
                            placeholder="Enter rejection message template"
                            rows={3}
                          />
                          <p className="text-sm text-gray-600">
                            Available placeholders: {'{date}'}, {'{time}'}
                          </p>
                        </div>

                        {/* Offers Message */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <Label className="text-base font-medium">Special Offers</Label>
                          </div>
                          <Textarea
                            value={smsContent.offers}
                            onChange={(e) => setSmsContent({...smsContent, offers: e.target.value})}
                            placeholder="Enter offers message template"
                            rows={3}
                          />
                          <p className="text-sm text-gray-600">
                            Available placeholders: {'{offer}'}, {'{discount}'}, {'{validity}'}
                          </p>
                        </div>

                        {/* General Message */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <Label className="text-base font-medium">General Messages</Label>
                          </div>
                          <Textarea
                            value={smsContent.general}
                            onChange={(e) => setSmsContent({...smsContent, general: e.target.value})}
                            placeholder="Enter general message template"
                            rows={3}
                          />
                          <p className="text-sm text-gray-600">
                            General purpose messages and confirmations
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">SMS Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>SMS Provider</Label>
                            <Select value={settings.smsProvider || "twilio"} onValueChange={(value) => handleInputChange('smsProvider', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="twilio">Twilio</SelectItem>
                                <SelectItem value="aws-sns">AWS SNS</SelectItem>
                                <SelectItem value="messagebird">MessageBird</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Sender ID</Label>
                            <Input
                              value={settings.senderId || ""}
                              onChange={(e) => handleInputChange('senderId', e.target.value)}
                              placeholder="Your business name"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                </PermissionProtectedSection>

                {/* Terms & Conditions */}
                <PermissionProtectedSection requiredPermissions={['terms.view']}>
                  <TabsContent value="terms">
                  <Card>
                    <CardHeader>
                      <CardTitle>Terms and Conditions</CardTitle>
                      <CardDescription>Manage your business terms and conditions content</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="termsTitle">Document Title</Label>
                          <Input
                            id="termsTitle"
                            value={termsContent.title}
                            onChange={(e) => setTermsContent({...termsContent, title: e.target.value})}
                            placeholder="Terms and Conditions"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="termsContent">Content (Markdown supported)</Label>
                          <Textarea
                            id="termsContent"
                            value={termsContent.content}
                            onChange={(e) => setTermsContent({...termsContent, content: e.target.value})}
                            placeholder="Enter your terms and conditions content here..."
                            rows={20}
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Preview</h3>
                        <Card className="p-4 bg-gray-50">
                          <h2 className="text-xl font-bold mb-4">{termsContent.title}</h2>
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap text-sm">{termsContent.content}</pre>
                          </div>
                        </Card>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Settings</h3>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Require acceptance on booking</Label>
                            <p className="text-sm text-gray-600">Customers must accept terms before booking</p>
                          </div>
                          <Switch
                            checked={settings.requireTermsAcceptance || false}
                            onCheckedChange={(checked) => handleInputChange('requireTermsAcceptance', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Auto-update customer agreements</Label>
                            <p className="text-sm text-gray-600">Automatically update existing customer agreements</p>
                          </div>
                          <Switch
                            checked={settings.autoUpdateTerms || false}
                            onCheckedChange={(checked) => handleInputChange('autoUpdateTerms', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                </PermissionProtectedSection>

                {/* User Management */}
                <TabsContent value="users">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage users, roles, and permissions across all branches</CardDescription>
                          </div>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {users.map((user) => (
                            <Card key={user.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                                        {user.role.replace('_', ' ')}
                                      </Badge>
                                      <span className="text-xs text-gray-500">{user.branch}</span>
                                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                        {user.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Last login: {user.lastLogin}</span>
                                  <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Audit Logs */}
                <TabsContent value="audit">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Audit Logs</CardTitle>
                        <CardDescription>Track all system activities and user actions for accountability</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <Input placeholder="Search logs..." className="flex-1" />
                            <Select defaultValue="all">
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="login">Login</SelectItem>
                                <SelectItem value="create">Create</SelectItem>
                                <SelectItem value="update">Update</SelectItem>
                                <SelectItem value="delete">Delete</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Refresh
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {auditLogs.map((log) => (
                              <Card key={log.id} className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">{log.user}</span>
                                      <Badge variant="outline">{log.action}</Badge>
                                      <span className="text-sm text-gray-500">{log.resource}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>{log.timestamp}</span>
                                      <span>IP: {log.ipAddress}</span>
                                      <span>{log.userAgent}</span>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Data Import/Export */}
                <PermissionProtectedSection requiredPermissions={['data_import.view']}>
                  <TabsContent value="data">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Data Import & Export</CardTitle>
                          <CardDescription>Migrate data in and out of the system easily</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                              <div className="text-center space-y-4">
                                <Upload className="w-12 h-12 text-blue-600 mx-auto" />
                                <div>
                                  <h3 className="font-semibold">Import Data</h3>
                                  <p className="text-sm text-gray-600">Upload CSV or Excel files to import data</p>
                                </div>
                                <Button variant="outline" className="w-full">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Choose File
                                </Button>
                              </div>
                            </Card>

                            <Card className="p-6">
                              <div className="text-center space-y-4">
                                <Download className="w-12 h-12 text-green-600 mx-auto" />
                                <div>
                                  <h3 className="font-semibold">Export Data</h3>
                                  <p className="text-sm text-gray-600">Download your data in various formats</p>
                                </div>
                                <Button className="w-full">
                                  <Download className="w-4 h-4 mr-2" />
                                  Export Data
                                </Button>
                              </div>
                            </Card>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Export Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Export Format</Label>
                                <Select value={importExport.exportFormat} onValueChange={(value) => setImportExport({...importExport, exportFormat: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="excel">Excel</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Date Range</Label>
                                <Select value={importExport.dateRange} onValueChange={(value) => setImportExport({...importExport, dateRange: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="last_30">Last 30 Days</SelectItem>
                                    <SelectItem value="last_90">Last 90 Days</SelectItem>
                                    <SelectItem value="last_year">Last Year</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Data Tables to Export</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {[
                                  { id: 'customers', label: 'Customers' },
                                  { id: 'appointments', label: 'Appointments' },
                                  { id: 'services', label: 'Services' },
                                  { id: 'staff', label: 'Staff' },
                                  { id: 'products', label: 'Products' },
                                  { id: 'branches', label: 'Branches' },
                                  { id: 'analytics', label: 'Analytics' }
                                ].map((table) => (
                                  <div key={table.id} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={table.id}
                                      checked={importExport.selectedTables.includes(table.id)}
                                      onChange={(e) => {
                                        const newTables = e.target.checked
                                          ? [...importExport.selectedTables, table.id]
                                          : importExport.selectedTables.filter(t => t !== table.id);
                                        setImportExport({...importExport, selectedTables: newTables});
                                      }}
                                      className="rounded"
                                    />
                                    <Label htmlFor={table.id} className="text-sm">{table.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="includeImages"
                                checked={importExport.includeImages}
                                onChange={(e) => setImportExport({...importExport, includeImages: e.target.checked})}
                                className="rounded"
                              />
                              <Label htmlFor="includeImages">Include images and attachments</Label>
                            </div>

                            <Button className="w-full">
                              <Download className="w-4 h-4 mr-2" />
                              Start Export
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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