'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Globe,
  Code,
  Settings,
  Eye,
  Copy,
  ExternalLink,
  Smartphone,
  Monitor,
  Palette,
  Plus
} from "lucide-react";
import {
  format,
  addDays,
  addHours,
  addMinutes,
  parseISO,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  addWeeks,
  addMonths
} from "date-fns";

export interface BookingWidget {
  id: string;
  name: string;
  businessId: string;
  businessName: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  settings: {
    showServicePrices: boolean;
    showBarberPhotos: boolean;
    showServiceDescriptions: boolean;
    requirePhone: boolean;
    requireEmail: boolean;
    allowGuestBooking: boolean;
    maxAdvanceBooking: number; // days
    minAdvanceBooking: number; // hours
    timeSlotInterval: number; // minutes
    businessHours: { [key: string]: { start: number; end: number; closed?: boolean } };
    holidays: string[]; // dates
    bufferTime: number; // minutes between bookings
  };
  embedCode: string;
  isActive: boolean;
  branches: string[]; // branch IDs
  services: string[]; // service IDs
  barbers: string[]; // barber IDs
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  barberId: string;
  branchId: string;
  date: string;
  time: string;
  notes?: string;
  source: 'widget';
  widgetId: string;
}

interface OnlineBookingWidgetProps {
  widgets: BookingWidget[];
  services: Array<{ id: string; name: string; description: string; duration: number; price: number; category: string }>;
  barbers: Array<{ id: string; name: string; photo?: string; specialties: string[]; branchId: string }>;
  branches: Array<{ id: string; name: string; location: string }>;
  businessHours: { [key: string]: { start: number; end: number; closed?: boolean } };
  onWidgetCreate: (widget: Omit<BookingWidget, 'id' | 'embedCode' | 'createdAt' | 'updatedAt'>) => void;
  onWidgetUpdate: (widgetId: string, updates: Partial<BookingWidget>) => void;
  onWidgetDelete: (widgetId: string) => void;
  onBookingSubmit: (booking: BookingRequest) => void;
}

export function OnlineBookingWidget({
  widgets,
  services,
  barbers,
  branches,
  businessHours,
  onWidgetCreate,
  onWidgetUpdate,
  onWidgetDelete,
  onBookingSubmit
}: OnlineBookingWidgetProps) {
  const [selectedWidget, setSelectedWidget] = useState<BookingWidget | null>(null);
  const [showWidgetDialog, setShowWidgetDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingWidget, setEditingWidget] = useState<BookingWidget | null>(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    barberId: '',
    branchId: '',
    date: '',
    time: '',
    notes: ''
  });

  // Widget form state
  const [widgetForm, setWidgetForm] = useState({
    name: '',
    businessId: '',
    businessName: '',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#6B7280',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      fontFamily: 'Inter, sans-serif'
    },
    settings: {
      showServicePrices: true,
      showBarberPhotos: true,
      showServiceDescriptions: true,
      requirePhone: true,
      requireEmail: true,
      allowGuestBooking: true,
      maxAdvanceBooking: 90,
      minAdvanceBooking: 2,
      timeSlotInterval: 30,
      businessHours: businessHours,
      holidays: [] as string[],
      bufferTime: 15
    },
    isActive: true,
    branches: [] as string[],
    services: [] as string[],
    barbers: [] as string[]
  });

  // Reset forms
  const resetWidgetForm = () => {
    setWidgetForm({
      name: '',
      businessId: '',
      businessName: '',
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#6B7280',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        fontFamily: 'Inter, sans-serif'
      },
      settings: {
        showServicePrices: true,
        showBarberPhotos: true,
        showServiceDescriptions: true,
        requirePhone: true,
        requireEmail: true,
        allowGuestBooking: true,
        maxAdvanceBooking: 90,
        minAdvanceBooking: 2,
        timeSlotInterval: 30,
        businessHours: businessHours,
        holidays: [],
        bufferTime: 15
      },
      isActive: true,
      branches: [],
      services: [],
      barbers: []
    });
  };

  // Generate embed code
  const generateEmbedCode = (widget: BookingWidget) => {
    const baseUrl = window.location.origin;
    return `<iframe
  src="${baseUrl}/booking-widget/${widget.id}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  title="${widget.name} Booking Widget"
></iframe>`;
  };

  // Handle widget creation
  const handleWidgetCreate = () => {
    if (!widgetForm.name || !widgetForm.businessName) return;

    const newWidget = {
      ...widgetForm,
      embedCode: '' // Will be generated after creation
    };

    onWidgetCreate(newWidget);
    resetWidgetForm();
    setShowWidgetDialog(false);
  };

  // Handle widget update
  const handleWidgetUpdate = () => {
    if (!editingWidget) return;

    onWidgetUpdate(editingWidget.id, {
      ...widgetForm,
      embedCode: generateEmbedCode(editingWidget)
    });
    setEditingWidget(null);
    setShowWidgetDialog(false);
  };

  // Handle booking submission
  const handleBookingSubmit = () => {
    if (!selectedWidget || !bookingForm.serviceId || !bookingForm.date || !bookingForm.time) return;

    onBookingSubmit({
      ...bookingForm,
      source: 'widget',
      widgetId: selectedWidget.id
    });

    // Reset form
    setBookingForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      serviceId: '',
      barberId: '',
      branchId: '',
      date: '',
      time: '',
      notes: ''
    });
  };

  // Get available time slots for a date
  const getAvailableTimeSlots = (date: Date, branchId: string, serviceId: string) => {
    const branchHours = businessHours[branchId] || businessHours['default'];
    if (!branchHours || branchHours.closed) return [];

    const slots = [];
    const service = services.find(s => s.id === serviceId);
    if (!service) return [];

    const startTime = branchHours.start * 60; // Convert to minutes
    const endTime = branchHours.end * 60;
    const interval = widgetForm.settings.timeSlotInterval;
    const serviceDuration = service.duration;

    for (let time = startTime; time <= endTime - serviceDuration; time += interval) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      // Check if slot is available (simplified - in real app, check against existing bookings)
      const isAvailable = true; // This would check actual availability

      if (isAvailable) {
        slots.push(timeString);
      }
    }

    return slots;
  };

  // Render widget list
  const renderWidgetList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {widgets.map(widget => (
        <Card key={widget.id} className="cursor-pointer hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{widget.name}</CardTitle>
              <Badge variant={widget.isActive ? "default" : "secondary"}>
                {widget.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{widget.businessName}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>{widget.branches.length} branches</span>
              <Scissors className="w-4 h-4 ml-2" />
              <span>{widget.services.length} services</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generateEmbedCode(widget));
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingWidget(widget);
                  setWidgetForm({
                    name: widget.name,
                    businessId: widget.businessId,
                    businessName: widget.businessName,
                    theme: { ...widget.theme },
                    settings: { ...widget.settings },
                    isActive: widget.isActive,
                    branches: [...widget.branches],
                    services: [...widget.services],
                    barbers: [...widget.barbers]
                  });
                  setShowWidgetDialog(true);
                }}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render booking widget preview
  const renderBookingWidget = () => {
    const widget = selectedWidget || editingWidget;
    if (!widget) return null;

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedService, setSelectedService] = useState('');
    const [selectedBarber, setSelectedBarber] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');

    const filteredServices = services.filter(s => widget.services.includes(s.id));
    const filteredBarbers = barbers.filter(b => widget.barbers.includes(b.id));
    const filteredBranches = branches.filter(b => widget.branches.includes(b.id));

    return (
      <div
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          fontFamily: widget.theme.fontFamily,
          backgroundColor: widget.theme.backgroundColor,
          color: widget.theme.textColor
        }}
      >
        {/* Header */}
        <div
          className="p-6 text-white text-center"
          style={{ backgroundColor: widget.theme.primaryColor }}
        >
          <h2 className="text-2xl font-bold mb-2">Book Your Appointment</h2>
          <p className="text-sm opacity-90">{widget.businessName}</p>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {['Service', 'Date & Time', 'Details', 'Confirm'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBranches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Select Service</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredServices.map(service => (
                    <div
                      key={service.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          {widget.settings.showServiceDescriptions && (
                            <p className="text-sm text-gray-600">{service.description}</p>
                          )}
                          <p className="text-sm text-gray-500">{service.duration} minutes</p>
                        </div>
                        {widget.settings.showServicePrices && (
                          <span className="font-bold text-lg">${service.price}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedBranch || !selectedService}
                className="w-full"
                style={{ backgroundColor: widget.theme.primaryColor }}
              >
                Continue
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select Barber</Label>
                <div className="grid grid-cols-2 gap-2">
                  {filteredBarbers.map(barber => (
                    <div
                      key={barber.id}
                      className={`p-3 border rounded-lg cursor-pointer text-center ${
                        selectedBarber === barber.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedBarber(barber.id)}
                    >
                      {widget.settings.showBarberPhotos && barber.photo ? (
                        <img
                          src={barber.photo}
                          alt={barber.name}
                          className="w-12 h-12 rounded-full mx-auto mb-2"
                        />
                      ) : (
                        <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      )}
                      <p className="font-medium text-sm">{barber.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Select Date</Label>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    const minDate = addHours(today, widget.settings.minAdvanceBooking);
                    const maxDate = addDays(today, widget.settings.maxAdvanceBooking);
                    return date < minDate || date > maxDate;
                  }}
                  className="rounded-md border"
                />
              </div>

              {selectedDate && selectedService && (
                <div>
                  <Label className="text-sm font-medium">Available Times</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {getAvailableTimeSlots(selectedDate, selectedBranch, selectedService).map(time => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBookingForm(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd'), time }));
                          setCurrentStep(3);
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Your Information</Label>
                <div className="space-y-3">
                  <Input
                    placeholder="Full Name"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={bookingForm.customerEmail}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Additional Notes (Optional)</Label>
                <Textarea
                  placeholder="Any special requests..."
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  disabled={!bookingForm.customerName || !bookingForm.customerEmail}
                  className="flex-1"
                  style={{ backgroundColor: widget.theme.primaryColor }}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">
                  Your appointment has been successfully booked. You'll receive a confirmation email shortly.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Booking Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Service:</strong> {services.find(s => s.id === selectedService)?.name}</p>
                  <p><strong>Barber:</strong> {barbers.find(b => b.id === selectedBarber)?.name}</p>
                  <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'PPP')}</p>
                  <p><strong>Time:</strong> {bookingForm.time}</p>
                  <p><strong>Customer:</strong> {bookingForm.customerName}</p>
                </div>
              </div>

              <Button
                onClick={handleBookingSubmit}
                className="w-full"
                style={{ backgroundColor: widget.theme.primaryColor }}
              >
                Complete Booking
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Online Booking Widgets</h1>
          <p className="text-gray-600">Create and manage embeddable booking widgets for your website</p>
        </div>
        <Dialog open={showWidgetDialog} onOpenChange={setShowWidgetDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetWidgetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Widget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWidget ? 'Edit Booking Widget' : 'Create Booking Widget'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="widget-name">Widget Name</Label>
                      <Input
                        id="widget-name"
                        value={widgetForm.name}
                        onChange={(e) => setWidgetForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Main Booking Widget"
                      />
                    </div>
                    <div>
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input
                        id="business-name"
                        value={widgetForm.businessName}
                        onChange={(e) => setWidgetForm(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Your Business Name"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="widget-active"
                      checked={widgetForm.isActive}
                      onChange={(e) => setWidgetForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <Label htmlFor="widget-active">Widget is active</Label>
                  </div>
                </TabsContent>

                <TabsContent value="theme" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={widgetForm.theme.primaryColor}
                          onChange={(e) => setWidgetForm(prev => ({
                            ...prev,
                            theme: { ...prev.theme, primaryColor: e.target.value }
                          }))}
                          className="w-16"
                        />
                        <Input
                          value={widgetForm.theme.primaryColor}
                          onChange={(e) => setWidgetForm(prev => ({
                            ...prev,
                            theme: { ...prev.theme, primaryColor: e.target.value }
                          }))}
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary-color"
                          type="color"
                          value={widgetForm.theme.secondaryColor}
                          onChange={(e) => setWidgetForm(prev => ({
                            ...prev,
                            theme: { ...prev.theme, secondaryColor: e.target.value }
                          }))}
                          className="w-16"
                        />
                        <Input
                          value={widgetForm.theme.secondaryColor}
                          onChange={(e) => setWidgetForm(prev => ({
                            ...prev,
                            theme: { ...prev.theme, secondaryColor: e.target.value }
                          }))}
                          placeholder="#6B7280"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="background-color">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="background-color"
                          type="color"
                          value={widgetForm.theme.backgroundColor}
                          onChange={(e) => setWidgetForm(prev => ({
                            ...prev,
                            theme: { ...prev.theme, backgroundColor: e.target.value }
                          }))}
                          className="w-16"
                        />
                        <Input
                          value={widgetForm.theme.backgroundColor}
                          onChange={(e) => setWidgetForm(prev => ({
                            ...prev,
                            theme: { ...prev.theme, backgroundColor: e.target.value }
                          }))}
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={widgetForm.theme.textColor}
                          onChange={(e) => setWidgetForm(prev => ({
                            ...prev,
                            theme: { ...prev.theme, textColor: e.target.value }
                          }))}
                          className="w-16"
                        />
                        <Input
                          value={widgetForm.theme.textColor}
                          onChange={(e) => setWidgetForm(prev => ({
                            ...prev,
                            theme: { ...prev.theme, textColor: e.target.value }
                          }))}
                          placeholder="#1F2937"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select
                      value={widgetForm.theme.fontFamily}
                      onValueChange={(value) => setWidgetForm(prev => ({
                        ...prev,
                        theme: { ...prev.theme, fontFamily: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                        <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                        <SelectItem value="Open Sans, sans-serif">Open Sans</SelectItem>
                        <SelectItem value="Lato, sans-serif">Lato</SelectItem>
                        <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-advance">Max Advance Booking (days)</Label>
                      <Input
                        id="max-advance"
                        type="number"
                        min="1"
                        value={widgetForm.settings.maxAdvanceBooking}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, maxAdvanceBooking: parseInt(e.target.value) || 90 }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="min-advance">Min Advance Booking (hours)</Label>
                      <Input
                        id="min-advance"
                        type="number"
                        min="0"
                        value={widgetForm.settings.minAdvanceBooking}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, minAdvanceBooking: parseInt(e.target.value) || 2 }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time-interval">Time Slot Interval (minutes)</Label>
                      <Input
                        id="time-interval"
                        type="number"
                        min="15"
                        value={widgetForm.settings.timeSlotInterval}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, timeSlotInterval: parseInt(e.target.value) || 30 }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="buffer-time">Buffer Time (minutes)</Label>
                      <Input
                        id="buffer-time"
                        type="number"
                        min="0"
                        value={widgetForm.settings.bufferTime}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, bufferTime: parseInt(e.target.value) || 15 }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-prices"
                        checked={widgetForm.settings.showServicePrices}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showServicePrices: e.target.checked }
                        }))}
                      />
                      <Label htmlFor="show-prices">Show service prices</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-photos"
                        checked={widgetForm.settings.showBarberPhotos}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showBarberPhotos: e.target.checked }
                        }))}
                      />
                      <Label htmlFor="show-photos">Show barber photos</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-descriptions"
                        checked={widgetForm.settings.showServiceDescriptions}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showServiceDescriptions: e.target.checked }
                        }))}
                      />
                      <Label htmlFor="show-descriptions">Show service descriptions</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require-phone"
                        checked={widgetForm.settings.requirePhone}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, requirePhone: e.target.checked }
                        }))}
                      />
                      <Label htmlFor="require-phone">Require phone number</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require-email"
                        checked={widgetForm.settings.requireEmail}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, requireEmail: e.target.checked }
                        }))}
                      />
                      <Label htmlFor="require-email">Require email address</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allow-guest"
                        checked={widgetForm.settings.allowGuestBooking}
                        onChange={(e) => setWidgetForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, allowGuestBooking: e.target.checked }
                        }))}
                      />
                      <Label htmlFor="allow-guest">Allow guest bookings</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label>Available Branches</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                      {branches.map(branch => (
                        <div key={branch.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`branch-${branch.id}`}
                            checked={widgetForm.branches.includes(branch.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setWidgetForm(prev => ({
                                ...prev,
                                branches: checked
                                  ? [...prev.branches, branch.id]
                                  : prev.branches.filter(id => id !== branch.id)
                              }));
                            }}
                          />
                          <Label htmlFor={`branch-${branch.id}`}>{branch.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Available Services</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                      {services.map(service => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`service-${service.id}`}
                            checked={widgetForm.services.includes(service.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setWidgetForm(prev => ({
                                ...prev,
                                services: checked
                                  ? [...prev.services, service.id]
                                  : prev.services.filter(id => id !== service.id)
                              }));
                            }}
                          />
                          <Label htmlFor={`service-${service.id}`}>{service.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Available Barbers</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                      {barbers.map(barber => (
                        <div key={barber.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`barber-${barber.id}`}
                            checked={widgetForm.barbers.includes(barber.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setWidgetForm(prev => ({
                                ...prev,
                                barbers: checked
                                  ? [...prev.barbers, barber.id]
                                  : prev.barbers.filter(id => id !== barber.id)
                              }));
                            }}
                          />
                          <Label htmlFor={`barber-${barber.id}`}>{barber.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowWidgetDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={editingWidget ? handleWidgetUpdate : handleWidgetCreate}>
                  {editingWidget ? 'Update Widget' : 'Create Widget'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Widget List */}
      {renderWidgetList()}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Widget Preview</DialogTitle>
          </DialogHeader>
          <div className="max-h-[600px] overflow-y-auto">
            {renderBookingWidget()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};