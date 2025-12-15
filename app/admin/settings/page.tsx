'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Store, Clock, Bell, Shield, CreditCard, Save, Upload, MessageSquare, FileText, Plus, Trash2 } from "lucide-react";
import { PermissionProtectedRoute, PermissionProtectedSection } from "@/components/PermissionProtected";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useCurrencyStore } from "@/stores/currency.store";
import { useSettingsStore } from "@/stores/settings.store";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";

interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  isActive: boolean;
  testMode: boolean;
  apiKey: string;
  secretKey: string;
}

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore();
  const { bookingWorkflow, updateBookingWorkflow } = useSettingsStore();

  // Mock payment methods data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'Stripe',
      provider: 'Stripe Payments',
      isActive: true,
      testMode: true,
      apiKey: 'sk_test_****************',
      secretKey: 'whsec_****************'
    },
    {
      id: '2',
      name: 'PayPal',
      provider: 'PayPal Express',
      isActive: false,
      testMode: false,
      apiKey: '',
      secretKey: ''
    }
  ]);

  // Settings state
  const [settings, setSettings] = useState({
    businessName: "Man of Cave",
    businessEmail: "contact@manofcave.com",
    businessPhone: "(555) 123-4567",
    businessAddress: "123 Main Street, New York, NY 10001",
    businessDescription: "Premium barber shop offering high-quality grooming services",
    timezone: "America/New_York",
    
    // Operating hours
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "20:00", closed: false },
    friday: { open: "09:00", close: "20:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
    
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    bookingReminders: true,
    marketingEmails: false,
    
    // Booking
    advanceBookingDays: 30,
    cancellationHours: 24,
    autoConfirmBookings: false,
    requireDeposit: false,
    depositAmount: 10,
    
    // Payment
    acceptCash: true,
    acceptCard: true,
    acceptDigital: true,
    taxRate: 8.5
  });

  // SMS Content State
  const [smsContent, setSmsContent] = useState({
    approval: "Your booking has been approved! We're excited to see you on {date} at {time}.",
    pending: "Your booking request is pending approval. We'll notify you once confirmed.",
    upcoming: "Reminder: You have an appointment tomorrow at {time}. See you soon!",
    rejection: "We're sorry, but your booking request could not be accommodated. Please try another time slot.",
    offers: "Special offer! {offer_name} - {discount}% off. Book now and save!",
    other: "Thank you for choosing our services. We look forward to serving you."
  });

  // Terms and Conditions State
  const [termsContent, setTermsContent] = useState({
    title: "Terms and Conditions",
    content: `Welcome to Man of Cave. By using our services, you agree to the following terms:

1. Booking Policy
   - All bookings require confirmation
   - Cancellations must be made 24 hours in advance
   - Late arrivals may result in shortened service time

2. Payment Terms
   - Payment is due at the time of service
   - We accept cash, credit cards, and digital payments
   - Deposits are non-refundable if cancelled within 24 hours

3. Service Standards
   - We strive to provide the highest quality service
   - Satisfaction guaranteed or your money back
   - All services performed by licensed professionals

4. Privacy Policy
   - Your personal information is kept confidential
   - We do not share customer data with third parties
   - Contact information used only for appointment purposes

Please contact us if you have any questions about these terms.`,
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings);
    console.log('Saving SMS content:', smsContent);
    console.log('Saving terms:', termsContent);
    console.log('Saving payment methods:', paymentMethods);
    
    // Show success message
    alert('Settings saved successfully!');
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleOperatingHoursChange = (dayKey: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [dayKey]: {
        ...(prev[dayKey as keyof typeof settings] as any),
        [field]: value
      }
    }));
  };

  return (
    <PermissionProtectedRoute requiredPermissions={['settings.view']}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="branch_admin" onLogout={handleLogout}
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
                <AdminMobileSidebar role="branch_admin" onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-600">Manage your business settings</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CurrencySwitcher />
                <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90">
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
              <Tabs defaultValue="business" className="space-y-6">
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="business" className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Business
                  </TabsTrigger>
                  <TabsTrigger value="hours" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hours
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="booking" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Booking
                  </TabsTrigger>
                  <PermissionProtectedSection requiredPermissions={['payment_methods.view']}>
                    <TabsTrigger value="payment" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment
                    </TabsTrigger>
                  </PermissionProtectedSection>
                  <PermissionProtectedSection requiredPermissions={['payment_methods.view']}>
                    <TabsTrigger value="payment-methods" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Payment Methods
                    </TabsTrigger>
                  </PermissionProtectedSection>
                  <PermissionProtectedSection requiredPermissions={['sms_content.view']}>
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      SMS Content
                    </TabsTrigger>
                  </PermissionProtectedSection>
                  <PermissionProtectedSection requiredPermissions={['terms.view']}>
                    <TabsTrigger value="terms" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Terms & Conditions
                    </TabsTrigger>
                  </PermissionProtectedSection>
                </TabsList>

                {/* Business Settings */}
                <TabsContent value="business">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>Update your business details and profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            value={settings.businessName}
                            onChange={(e) => handleSettingChange('businessName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessEmail">Business Email</Label>
                          <Input
                            id="businessEmail"
                            type="email"
                            value={settings.businessEmail}
                            onChange={(e) => handleSettingChange('businessEmail', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessPhone">Business Phone</Label>
                          <Input
                            id="businessPhone"
                            value={settings.businessPhone}
                            onChange={(e) => handleSettingChange('businessPhone', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
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
                      <div className="space-y-2">
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <Textarea
                          id="businessAddress"
                          value={settings.businessAddress}
                          onChange={(e) => handleSettingChange('businessAddress', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessDescription">Business Description</Label>
                        <Textarea
                          id="businessDescription"
                          value={settings.businessDescription}
                          onChange={(e) => handleSettingChange('businessDescription', e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Business Logo</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Store className="w-8 h-8 text-gray-400" />
                          </div>
                          <Button variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Operating Hours */}
                <TabsContent value="hours">
                  <Card>
                    <CardHeader>
                      <CardTitle>Operating Hours</CardTitle>
                      <CardDescription>Set your business hours for each day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {daysOfWeek.map((day) => (
                          <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-24">
                              <Label className="text-sm font-medium">{day.label}</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={!(settings[day.key as keyof typeof settings] as any).closed}
                                onCheckedChange={(checked) => handleOperatingHoursChange(day.key, 'closed', !checked)}
                              />
                              <span className="text-sm text-gray-600">
                                {(settings[day.key as keyof typeof settings] as any).closed ? 'Closed' : 'Open'}
                              </span>
                            </div>
                            {!((settings[day.key as keyof typeof settings] as any).closed) && (
                              <>
                                <Input
                                  type="time"
                                  value={(settings[day.key as keyof typeof settings] as any).open}
                                  onChange={(e) => handleOperatingHoursChange(day.key, 'open', e.target.value)}
                                  className="w-32"
                                />
                                <span className="text-sm text-gray-600">to</span>
                                <Input
                                  type="time"
                                  value={(settings[day.key as keyof typeof settings] as any).close}
                                  onChange={(e) => handleOperatingHoursChange(day.key, 'close', e.target.value)}
                                  className="w-32"
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Configure how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Email Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">SMS Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications via text message</p>
                          </div>
                          <Switch
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Booking Reminders</Label>
                            <p className="text-sm text-gray-600">Send automatic reminders to customers</p>
                          </div>
                          <Switch
                            checked={settings.bookingReminders}
                            onCheckedChange={(checked) => handleSettingChange('bookingReminders', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Marketing Emails</Label>
                            <p className="text-sm text-gray-600">Send promotional emails to customers</p>
                          </div>
                          <Switch
                            checked={settings.marketingEmails}
                            onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Booking Settings */}
                <TabsContent value="booking">
                  <Card>
                    <CardHeader>
                      <CardTitle>Booking Settings</CardTitle>
                      <CardDescription>Configure booking policies and rules</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="advanceBooking">Advance Booking (Days)</Label>
                          <Input
                            id="advanceBooking"
                            type="number"
                            value={settings.advanceBookingDays}
                            onChange={(e) => handleSettingChange('advanceBookingDays', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cancellationHours">Cancellation Notice (Hours)</Label>
                          <Input
                            id="cancellationHours"
                            type="number"
                            value={settings.cancellationHours}
                            onChange={(e) => handleSettingChange('cancellationHours', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Auto-confirm Bookings</Label>
                            <p className="text-sm text-gray-600">Automatically confirm new bookings</p>
                          </div>
                          <Switch
                            checked={settings.autoConfirmBookings}
                            onCheckedChange={(checked) => handleSettingChange('autoConfirmBookings', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Require Deposit</Label>
                            <p className="text-sm text-gray-600">Require payment deposit for bookings</p>
                          </div>
                          <Switch
                            checked={settings.requireDeposit}
                            onCheckedChange={(checked) => handleSettingChange('requireDeposit', checked)}
                          />
                        </div>
                        {settings.requireDeposit && (
                          <div className="space-y-2">
                            <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
                            <Input
                              id="depositAmount"
                              type="number"
                              value={settings.depositAmount}
                              onChange={(e) => handleSettingChange('depositAmount', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Booking Workflow Settings */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Booking Workflow States</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Control which booking states are active in your workflow. Disabled states will be skipped in the booking process.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <Label className="text-sm font-medium">Pending State</Label>
                              <p className="text-xs text-gray-600">New bookings start here for approval</p>
                            </div>
                            <Switch
                              checked={bookingWorkflow.enablePendingState}
                              onCheckedChange={(checked) => updateBookingWorkflow({ enablePendingState: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <Label className="text-sm font-medium">Approved State</Label>
                              <p className="text-xs text-gray-600">Bookings approved and confirmed</p>
                            </div>
                            <Switch
                              checked={bookingWorkflow.enableApprovedState}
                              onCheckedChange={(checked) => updateBookingWorkflow({ enableApprovedState: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <Label className="text-sm font-medium">In Progress State</Label>
                              <p className="text-xs text-gray-600">Service currently being performed</p>
                            </div>
                            <Switch
                              checked={bookingWorkflow.enableInProgressState}
                              onCheckedChange={(checked) => updateBookingWorkflow({ enableInProgressState: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <Label className="text-sm font-medium">Completed State</Label>
                              <p className="text-xs text-gray-600">Service finished successfully</p>
                            </div>
                            <Switch
                              checked={bookingWorkflow.enableCompletedState}
                              onCheckedChange={(checked) => updateBookingWorkflow({ enableCompletedState: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <Label className="text-sm font-medium">Rejected State</Label>
                              <p className="text-xs text-gray-600">Bookings that were declined</p>
                            </div>
                            <Switch
                              checked={bookingWorkflow.enableRejectedState}
                              onCheckedChange={(checked) => updateBookingWorkflow({ enableRejectedState: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <Label className="text-sm font-medium">Rescheduled State</Label>
                              <p className="text-xs text-gray-600">Bookings moved to different time</p>
                            </div>
                            <Switch
                              checked={bookingWorkflow.enableRescheduledState}
                              onCheckedChange={(checked) => updateBookingWorkflow({ enableRescheduledState: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded md:col-span-2">
                            <div>
                              <Label className="text-sm font-medium">Cancelled State</Label>
                              <p className="text-xs text-gray-600">Bookings that were cancelled</p>
                            </div>
                            <Switch
                              checked={bookingWorkflow.enableCancelledState}
                              onCheckedChange={(checked) => updateBookingWorkflow({ enableCancelledState: checked })}
                            />
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> If "Pending State" is disabled, new bookings will automatically go to "Approved" state, skipping the approval workflow.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payment Settings */}
                <PermissionProtectedSection requiredPermissions={['payment_methods.view']}>
                  <TabsContent value="payment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Settings</CardTitle>
                      <CardDescription>Configure payment methods and tax rates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Accept Cash</Label>
                            <p className="text-sm text-gray-600">Allow cash payments at the shop</p>
                          </div>
                          <Switch
                            checked={settings.acceptCash}
                            onCheckedChange={(checked) => handleSettingChange('acceptCash', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Accept Credit/Debit Cards</Label>
                            <p className="text-sm text-gray-600">Allow card payments</p>
                          </div>
                          <Switch
                            checked={settings.acceptCard}
                            onCheckedChange={(checked) => handleSettingChange('acceptCard', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Accept Digital Payments</Label>
                            <p className="text-sm text-gray-600">Allow Apple Pay, Google Pay, etc.</p>
                          </div>
                          <Switch
                            checked={settings.acceptDigital}
                            onCheckedChange={(checked) => handleSettingChange('acceptDigital', checked)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={selectedCurrency} onValueChange={(value: string) => setSelectedCurrency(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AED">AED - UAE Dirham (د.إ)</SelectItem>
                            <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                            <SelectItem value="PKR">PKR - Pakistani Rupee (₨)</SelectItem>
                            <SelectItem value="INR">INR - Indian Rupee (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxRate">Tax Rate (%)</Label>
                        <Input
                          id="taxRate"
                          type="number"
                          step="0.01"
                          value={settings.taxRate}
                          onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                </PermissionProtectedSection>

                {/* Payment Methods */}
                <PermissionProtectedSection requiredPermissions={['payment_methods.view']}>
                  <TabsContent value="payment-methods">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>Payment Methods</CardTitle>
                              <CardDescription>Configure and manage payment gateways</CardDescription>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Payment Method
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {paymentMethods.map((method) => (
                              <div key={method.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <CreditCard className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">{method.name}</h3>
                                      <p className="text-sm text-gray-600">{method.provider}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={method.isActive}
                                      onCheckedChange={(checked) => {
                                        setPaymentMethods(prev => prev.map(m =>
                                          m.id === method.id ? { ...m, isActive: checked } : m
                                        ));
                                      }}
                                    />
                                    <Button variant="outline" size="sm">
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Test Mode</Label>
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={method.testMode}
                                        onCheckedChange={(checked) => {
                                          setPaymentMethods(prev => prev.map(m =>
                                            m.id === method.id ? { ...m, testMode: checked } : m
                                          ));
                                        }}
                                      />
                                      <span className="text-sm text-gray-600">
                                        {method.testMode ? 'Test Mode' : 'Live Mode'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`api-key-${method.id}`}>API Key</Label>
                                    <Input
                                      id={`api-key-${method.id}`}
                                      type="password"
                                      placeholder="Enter API Key"
                                      value={method.apiKey}
                                      onChange={(e) => {
                                        setPaymentMethods(prev => prev.map(m =>
                                          m.id === method.id ? { ...m, apiKey: e.target.value } : m
                                        ));
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`secret-key-${method.id}`}>Secret Key</Label>
                                    <Input
                                      id={`secret-key-${method.id}`}
                                      type="password"
                                      placeholder="Enter Secret Key"
                                      value={method.secretKey}
                                      onChange={(e) => {
                                        setPaymentMethods(prev => prev.map(m =>
                                          m.id === method.id ? { ...m, secretKey: e.target.value } : m
                                        ));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Gateway Settings</CardTitle>
                          <CardDescription>Additional payment configuration options</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Enable Webhooks</Label>
                              <p className="text-sm text-gray-600">Receive real-time payment notifications</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Auto-capture Payments</Label>
                              <p className="text-sm text-gray-600">Automatically capture authorized payments</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Save Card Details</Label>
                              <p className="text-sm text-gray-600">Allow customers to save payment methods</p>
                            </div>
                            <Switch />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </PermissionProtectedSection>

                {/* SMS Content */}
                <PermissionProtectedSection requiredPermissions={['sms_content.view']}>
                  <TabsContent value="sms">
                    <Card>
                      <CardHeader>
                        <CardTitle>SMS Content Templates</CardTitle>
                        <CardDescription>Customize SMS messages sent to customers</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="sms-approval" className="text-sm font-medium flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              Booking Approval
                            </Label>
                            <Textarea
                              id="sms-approval"
                              value={smsContent.approval}
                              onChange={(e) => setSmsContent(prev => ({ ...prev, approval: e.target.value }))}
                              placeholder="Enter approval message template"
                              rows={2}
                            />
                            <p className="text-xs text-gray-500">Use {`{date}`} and {`{time}`} as placeholders</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sms-pending" className="text-sm font-medium flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              Booking Pending
                            </Label>
                            <Textarea
                              id="sms-pending"
                              value={smsContent.pending}
                              onChange={(e) => setSmsContent(prev => ({ ...prev, pending: e.target.value }))}
                              placeholder="Enter pending message template"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sms-upcoming" className="text-sm font-medium flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              Upcoming Appointment Reminder
                            </Label>
                            <Textarea
                              id="sms-upcoming"
                              value={smsContent.upcoming}
                              onChange={(e) => setSmsContent(prev => ({ ...prev, upcoming: e.target.value }))}
                              placeholder="Enter reminder message template"
                              rows={2}
                            />
                            <p className="text-xs text-gray-500">Use {`{time}`} as placeholder</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sms-rejection" className="text-sm font-medium flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              Booking Rejection
                            </Label>
                            <Textarea
                              id="sms-rejection"
                              value={smsContent.rejection}
                              onChange={(e) => setSmsContent(prev => ({ ...prev, rejection: e.target.value }))}
                              placeholder="Enter rejection message template"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sms-offers" className="text-sm font-medium flex items-center gap-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              Special Offers & Promotions
                            </Label>
                            <Textarea
                              id="sms-offers"
                              value={smsContent.offers}
                              onChange={(e) => setSmsContent(prev => ({ ...prev, offers: e.target.value }))}
                              placeholder="Enter promotional message template"
                              rows={2}
                            />
                            <p className="text-xs text-gray-500">Use {`{offer_name}`} and {`{discount}`} as placeholders</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sms-other" className="text-sm font-medium flex items-center gap-2">
                              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                              General Messages
                            </Label>
                            <Textarea
                              id="sms-other"
                              value={smsContent.other}
                              onChange={(e) => setSmsContent(prev => ({ ...prev, other: e.target.value }))}
                              placeholder="Enter general message template"
                              rows={2}
                            />
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Available Placeholders</h4>
                          <div className="text-sm text-blue-800 space-y-1">
                            <p><code className="bg-blue-100 px-1 rounded">{`{date}`}</code> - Appointment date</p>
                            <p><code className="bg-blue-100 px-1 rounded">{`{time}`}</code> - Appointment time</p>
                            <p><code className="bg-blue-100 px-1 rounded">{`{offer_name}`}</code> - Offer/promotion name</p>
                            <p><code className="bg-blue-100 px-1 rounded">{`{discount}`}</code> - Discount percentage</p>
                            <p><code className="bg-blue-100 px-1 rounded">{`{customer_name}`}</code> - Customer name</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <Label className="text-sm font-medium">Enable SMS Notifications</Label>
                            <p className="text-sm text-gray-600">Send SMS messages to customers</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </PermissionProtectedSection>

                {/* Terms and Conditions */}
                <PermissionProtectedSection requiredPermissions={['terms.view']}>
                  <TabsContent value="terms">
                    <Card>
                      <CardHeader>
                        <CardTitle>Terms and Conditions</CardTitle>
                        <CardDescription>Manage your business terms and conditions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="terms-title">Document Title</Label>
                            <Input
                              id="terms-title"
                              value={termsContent.title}
                              onChange={(e) => setTermsContent(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Terms and Conditions"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="terms-content">Content</Label>
                            <Textarea
                              id="terms-content"
                              value={termsContent.content}
                              onChange={(e) => setTermsContent(prev => ({ ...prev, content: e.target.value }))}
                              placeholder="Enter your terms and conditions..."
                              rows={20}
                              className="font-mono text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="terms-last-updated">Last Updated</Label>
                            <Input
                              id="terms-last-updated"
                              type="date"
                              value={termsContent.lastUpdated}
                              onChange={(e) => setTermsContent(prev => ({ ...prev, lastUpdated: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                          <div className="bg-white border rounded p-4 max-h-60 overflow-y-auto">
                            <h1 className="text-xl font-bold mb-4">{termsContent.title}</h1>
                            <div className="text-sm whitespace-pre-wrap">{termsContent.content}</div>
                            <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                              Last updated: {new Date(termsContent.lastUpdated).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <Label className="text-sm font-medium">Require Terms Acceptance</Label>
                            <p className="text-sm text-gray-600">Customers must accept terms before booking</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Show Terms on Website</Label>
                            <p className="text-sm text-gray-600">Display terms and conditions on your website</p>
                          </div>
                          <Switch defaultChecked />
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