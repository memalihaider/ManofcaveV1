'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, Clock, User, Search, Filter, CheckCircle, XCircle, AlertCircle, Bell, Smartphone, Globe, Plus, 
  Edit, Trash2, Phone, Mail, RefreshCw, FileText, Scissors, Package, DollarSign, Receipt, CheckCircle2, Eye, 
  Play, Star, FileCheck, MapPin, Repeat, Tag, Flag, CreditCard 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AdvancedCalendar } from "@/components/ui/advanced-calendar";
import { NotificationSystem, useNotifications } from "@/components/ui/notification-system";
import { useCurrencyStore } from "@/stores/currency.store";
import { cn } from "@/lib/utils";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { ResourceScheduler } from "@/components/ui/resource-scheduler";
import { RecurringAppointmentsManager } from "@/components/ui/recurring-appointments-manager";
import { AppointmentNotesHistory } from "@/components/ui/appointment-notes-history";

export default function AdminAppointments() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { formatCurrency } = useCurrencyStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'advanced-calendar' | 'list' | 'resources' | 'recurring' | 'notes'>('advanced-calendar');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    customer: '',
    phone: '',
    email: '',
    service: '',
    services: [] as Array<{name: string, price: number, duration: number, tip?: number, qty?: number}>,
    staff: '',
    staffs: [] as Array<{name: string, tip?: number}>,
    date: '',
    time: '',
    notes: '',
    products: [] as Array<{name: string, category: string, price: number, quantity: number}>,
    tax: 5,
    serviceCharges: 0,
    tip: 0,
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    category: '',
    finalTotal: 0,
    totalTip: 0,
    payments: [] as Array<{method: string, amount: number}>,
    status: 'pending',
    generateInvoice: false,
    branch: '',
    room: '',
    source: 'walk-in',
    duration: 30,
    recurring: false,
    recurringType: 'weekly' as 'daily' | 'weekly' | 'bi-weekly' | 'monthly',
    recurringEndDate: '',
    sendConfirmation: true,
    sendReminder: true,
    customerNotes: '',
    internalNotes: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    tags: [] as string[],
    attachments: [] as File[]
  });

  // Notification system
  const { notifications, addNotification, markAsRead } = useNotifications();

  // Mock products data
  const mockProducts = [
    { name: "Premium Shampoo", category: "Hair Care", price: 15 },
    { name: "Beard Oil", category: "Grooming", price: 12 },
    { name: "Hair Wax", category: "Styling", price: 8 },
    { name: "Face Mask", category: "Skincare", price: 20 },
    { name: "Hair Clippers", category: "Tools", price: 45 },
    { name: "Styling Gel", category: "Styling", price: 10 },
    { name: "Aftershave", category: "Grooming", price: 18 },
    { name: "Hair Brush", category: "Tools", price: 25 }
  ];

  // Helper functions for pricing
  const getServicePrice = (serviceName: string) => {
    const servicePrices: { [key: string]: number } = {
      "Classic Haircut": 35,
      "Beard Trim & Shape": 25,
      "Premium Package": 85,
      "Haircut & Style": 50,
      "Hair Coloring": 120,
      "Facial Treatment": 75
    };
    return servicePrices[serviceName] || 0;
  };

  const calculateTax = () => {
    const servicePrice = getServicePrice(bookingData.service);
    const additionalServicesTotal = bookingData.services.reduce((sum, s) => sum + s.price + (s.tip || 0), 0);
    const productsTotal = bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const teamTipsTotal = bookingData.staffs.reduce((sum, b) => sum + (b.tip || 0), 0);
    const subtotal = servicePrice + additionalServicesTotal + productsTotal + bookingData.serviceCharges + bookingData.tip + teamTipsTotal;
    const discountAmount = bookingData.discountType === 'percentage'
      ? (subtotal * bookingData.discount) / 100
      : bookingData.discount;
    const discountedSubtotal = subtotal - discountAmount;
    return ((discountedSubtotal * bookingData.tax) / 100).toFixed(2);
  };

  const calculateTotal = () => {
    const servicePrice = getServicePrice(bookingData.service);
    const additionalServicesTotal = bookingData.services.reduce((sum, s) => sum + s.price + (s.tip || 0), 0);
    const productsTotal = bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const teamTipsTotal = bookingData.staffs.reduce((sum, b) => sum + (b.tip || 0), 0);
    const subtotal = servicePrice + additionalServicesTotal + productsTotal + bookingData.serviceCharges + bookingData.tip + teamTipsTotal;
    const discountAmount = bookingData.discountType === 'percentage'
      ? (subtotal * bookingData.discount) / 100
      : bookingData.discount;
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = (discountedSubtotal * bookingData.tax) / 100;
    return (discountedSubtotal + taxAmount).toFixed(2);
  };

  // Calculate total tip
  const calculateTotalTip = () => {
    const serviceTips = bookingData.services.reduce((sum, s) => sum + (s.tip || 0), 0);
    const staffTips = bookingData.staffs.reduce((sum, s) => sum + (s.tip || 0), 0);
    return serviceTips + staffTips + bookingData.tip;
  };

  // Update totalTip whenever relevant data changes
  useEffect(() => {
    const totalTip = calculateTotalTip();
    setBookingData(prev => ({ ...prev, totalTip }));
  }, [bookingData.services, bookingData.staffs, bookingData.tip]);

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      customer: "John Doe",
      service: "Classic Haircut",
      staff: "Mike Johnson",
      barberAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-15",
      time: "09:00",
      duration: "30 min",
      price: 35,
      status: "confirmed",
      phone: "(555) 123-4567",
      email: "john.doe@email.com",
      notes: "Regular customer, prefers fade",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2025-12-14T08:00:00Z",
      updatedAt: "2025-12-15T09:30:00Z"
    },
    {
      id: 2,
      customer: "Sarah Wilson",
      service: "Haircut & Style",
      staff: "Emma Davis",
      barberAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-15",
      time: "10:30",
      duration: "45 min",
      price: 50,
      status: "in-progress",
      phone: "(555) 234-5678",
      email: "sarah.wilson@email.com",
      notes: "First time customer, wants modern style",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2025-12-15T09:00:00Z",
      updatedAt: "2025-12-15T10:30:00Z"
    },
    {
      id: 3,
      customer: "Robert Chen",
      service: "Beard Trim & Shape",
      staff: "Alex Rodriguez",
      barberAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-15",
      time: "11:00",
      duration: "20 min",
      price: 25,
      status: "scheduled",
      phone: "(555) 345-6789",
      email: "robert.chen@email.com",
      notes: "Monthly beard maintenance",
      source: "website",
      branch: "Uptown Branch",
      createdAt: "2025-12-14T14:30:00Z",
      updatedAt: "2025-12-14T14:30:00Z"
    },
    {
      id: 4,
      customer: "Maria Garcia",
      service: "Premium Package",
      staff: "Mike Johnson",
      barberAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-15",
      time: "13:00",
      duration: "90 min",
      price: 85,
      status: "approved",
      phone: "(555) 456-7890",
      email: "maria.garcia@email.com",
      notes: "Birthday special - full treatment",
      source: "walk-in",
      branch: "Downtown Premium",
      createdAt: "2025-12-15T11:00:00Z",
      updatedAt: "2025-12-15T11:15:00Z"
    },
    {
      id: 5,
      customer: "David Thompson",
      service: "Hair Coloring",
      staff: "Emma Davis",
      barberAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-15",
      time: "14:30",
      duration: "60 min",
      price: 120,
      status: "pending",
      phone: "(555) 567-8901",
      email: "david.thompson@email.com",
      notes: "Gray coverage, prefers natural look",
      source: "website",
      branch: "Uptown Branch",
      createdAt: "2025-12-13T16:00:00Z",
      updatedAt: "2025-12-13T16:00:00Z"
    },
    {
      id: 6,
      customer: "Lisa Anderson",
      service: "Facial Treatment",
      staff: "Sophie Brown",
      barberAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-15",
      time: "16:00",
      duration: "45 min",
      price: 75,
      status: "completed",
      phone: "(555) 678-9012",
      email: "lisa.anderson@email.com",
      notes: "Sensitive skin, use gentle products",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2025-12-14T10:00:00Z",
      updatedAt: "2025-12-15T16:45:00Z"
    },
    {
      id: 7,
      customer: "James Wilson",
      service: "Classic Haircut",
      staff: "Alex Rodriguez",
      barberAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-16",
      time: "09:00",
      duration: "30 min",
      price: 35,
      status: "confirmed",
      phone: "(555) 789-0123",
      email: "james.wilson@email.com",
      notes: "Weekly appointment, same style",
      source: "website",
      branch: "Uptown Branch",
      createdAt: "2025-12-15T08:00:00Z",
      updatedAt: "2025-12-15T08:30:00Z"
    },
    {
      id: 8,
      customer: "Anna Martinez",
      service: "Beard Trim & Shape",
      staff: "Mike Johnson",
      barberAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-16",
      time: "10:00",
      duration: "20 min",
      price: 25,
      status: "cancelled",
      phone: "(555) 890-1234",
      email: "anna.martinez@email.com",
      notes: "Emergency cancellation - family matter",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2025-12-14T15:00:00Z",
      updatedAt: "2025-12-15T18:00:00Z"
    },
    {
      id: 9,
      customer: "Michael Brown",
      service: "Haircut & Style",
      staff: "Emma Davis",
      barberAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-16",
      time: "11:30",
      duration: "45 min",
      price: 50,
      status: "rescheduled",
      phone: "(555) 901-2345",
      email: "michael.brown@email.com",
      notes: "Rescheduled from yesterday due to illness",
      source: "website",
      branch: "Uptown Branch",
      createdAt: "2025-12-14T12:00:00Z",
      updatedAt: "2025-12-15T09:00:00Z"
    },
    {
      id: 10,
      customer: "Jennifer Lee",
      service: "Premium Package",
      staff: "Sophie Brown",
      barberAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-16",
      time: "14:00",
      duration: "90 min",
      price: 85,
      status: "confirmed",
      phone: "(555) 012-3456",
      email: "jennifer.lee@email.com",
      notes: "VIP customer, extra attention to detail",
      source: "walk-in",
      branch: "Downtown Premium",
      createdAt: "2025-12-15T13:00:00Z",
      updatedAt: "2025-12-15T13:15:00Z"
    },
    {
      id: 11,
      customer: "Carlos Rodriguez",
      service: "Classic Haircut",
      staff: "Alex Rodriguez",
      barberAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-17",
      time: "09:30",
      duration: "30 min",
      price: 35,
      status: "scheduled",
      phone: "(555) 123-4567",
      email: "carlos.rodriguez@email.com",
      notes: "New customer, wants consultation first",
      source: "website",
      branch: "Uptown Branch",
      createdAt: "2025-12-15T16:00:00Z",
      updatedAt: "2025-12-15T16:00:00Z"
    },
    {
      id: 12,
      customer: "Emily Davis",
      service: "Facial Treatment",
      staff: "Sophie Brown",
      barberAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-17",
      time: "11:00",
      duration: "45 min",
      price: 75,
      status: "approved",
      phone: "(555) 234-5678",
      email: "emily.davis@email.com",
      notes: "Follow-up treatment, check skin progress",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2025-12-16T10:00:00Z",
      updatedAt: "2025-12-16T10:30:00Z"
    },
    {
      id: 13,
      customer: "Kevin Johnson",
      service: "Hair Coloring",
      staff: "Emma Davis",
      barberAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-17",
      time: "13:30",
      duration: "60 min",
      price: 120,
      status: "pending",
      phone: "(555) 345-6789",
      email: "kevin.johnson@email.com",
      notes: "Touch-up coloring, bring reference photo",
      source: "website",
      branch: "Uptown Branch",
      createdAt: "2025-12-14T11:00:00Z",
      updatedAt: "2025-12-14T11:00:00Z"
    },
    {
      id: 14,
      customer: "Rachel Green",
      service: "Beard Trim & Shape",
      staff: "Mike Johnson",
      barberAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-17",
      time: "15:00",
      duration: "20 min",
      price: 25,
      status: "confirmed",
      phone: "(555) 456-7890",
      email: "rachel.green@email.com",
      notes: "Quick trim, very busy schedule",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2025-12-16T14:00:00Z",
      updatedAt: "2025-12-16T14:15:00Z"
    },
    {
      id: 15,
      customer: "Tom Anderson",
      service: "Haircut & Style",
      staff: "Alex Rodriguez",
      barberAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-18",
      time: "10:00",
      duration: "45 min",
      price: 50,
      status: "completed",
      phone: "(555) 567-8901",
      email: "tom.anderson@email.com",
      notes: "Corporate client, professional look required",
      source: "walk-in",
      branch: "Uptown Branch",
      createdAt: "2025-12-17T08:00:00Z",
      updatedAt: "2025-12-18T10:45:00Z"
    },
    {
      id: 16,
      customer: "Sophie Taylor",
      service: "Premium Package",
      staff: "Emma Davis",
      barberAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-18",
      time: "12:00",
      duration: "90 min",
      price: 85,
      status: "in-progress",
      phone: "(555) 678-9012",
      email: "sophie.taylor@email.com",
      notes: "Special occasion - wedding preparation",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2025-12-17T15:00:00Z",
      updatedAt: "2025-12-18T12:00:00Z"
    },
    {
      id: 17,
      customer: "Daniel White",
      service: "Classic Haircut",
      staff: "Mike Johnson",
      barberAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-18",
      time: "14:30",
      duration: "30 min",
      price: 35,
      status: "rejected",
      phone: "(555) 789-0123",
      email: "daniel.white@email.com",
      notes: "Requested time not available, suggested alternative",
      source: "mobile",
      branch: "Uptown Branch",
      createdAt: "2025-12-16T09:00:00Z",
      updatedAt: "2025-12-16T09:30:00Z"
    },
    {
      id: 18,
      customer: "Olivia Martinez",
      service: "Facial Treatment",
      staff: "Sophie Brown",
      barberAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-19",
      time: "09:00",
      duration: "45 min",
      price: 75,
      status: "scheduled",
      phone: "(555) 890-1234",
      email: "olivia.martinez@email.com",
      notes: "First facial treatment, explain process",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2025-12-17T11:00:00Z",
      updatedAt: "2025-12-17T11:00:00Z"
    },
    {
      id: 19,
      customer: "Chris Evans",
      service: "Beard Trim & Shape",
      staff: "Alex Rodriguez",
      barberAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-19",
      time: "10:30",
      duration: "20 min",
      price: 25,
      status: "confirmed",
      phone: "(555) 901-2345",
      email: "chris.evans@email.com",
      notes: "Regular maintenance, keep same style",
      source: "walk-in",
      branch: "Uptown Branch",
      createdAt: "2025-12-18T14:00:00Z",
      updatedAt: "2025-12-18T14:15:00Z"
    },
    {
      id: 20,
      customer: "Amanda Clark",
      service: "Hair Coloring",
      staff: "Emma Davis",
      barberAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      date: "2025-12-19",
      time: "12:00",
      duration: "60 min",
      price: 120,
      status: "approved",
      phone: "(555) 012-3456",
      email: "amanda.clark@email.com",
      notes: "Balayage technique, natural highlights",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2025-12-18T10:00:00Z",
      updatedAt: "2025-12-18T10:45:00Z"
    }
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: "1",
      type: "info" as const,
      title: "New Booking",
      message: "John Doe booked Classic Haircut for tomorrow",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      action: {
        label: "View",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "John Doe")!)
      }
    },
    {
      id: "2",
      type: "warning" as const,
      title: "Appointment Reminder",
      message: "Sarah Wilson has an appointment in 30 minutes",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      action: {
        label: "View",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "Sarah Wilson")!)
      }
    },
    {
      id: "3",
      type: "success" as const,
      title: "Payment Received",
      message: "Payment of $50 received from Robert Chen",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      action: {
        label: "View Receipt",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "Robert Chen")!)
      }
    },
    {
      id: "4",
      type: "error" as const,
      title: "Appointment Cancelled",
      message: "Anna Martinez cancelled her appointment",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      action: {
        label: "View Details",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "Anna Martinez")!)
      }
    },
    {
      id: "5",
      type: "info" as const,
      title: "New VIP Booking",
      message: "Jennifer Lee booked Premium Package - VIP treatment",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: false,
      action: {
        label: "View",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "Jennifer Lee")!)
      }
    },
    {
      id: "6",
      type: "warning" as const,
      title: "Staff Shortage Alert",
      message: "Emma Davis called in sick - 3 appointments affected",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: true,
      action: {
        label: "Reassign",
        onClick: () => console.log("Reassign appointments")
      }
    },
    {
      id: "7",
      type: "success" as const,
      title: "Service Completed",
      message: "Lisa Anderson's Facial Treatment completed successfully",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      read: true,
      action: {
        label: "View Details",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "Lisa Anderson")!)
      }
    },
    {
      id: "8",
      type: "info" as const,
      title: "Recurring Booking",
      message: "James Wilson's weekly appointment confirmed",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false,
      action: {
        label: "View",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "James Wilson")!)
      }
    },
    {
      id: "9",
      type: "warning" as const,
      title: "Pending Approval",
      message: "David Thompson's Hair Coloring needs approval",
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
      read: false,
      action: {
        label: "Review",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "David Thompson")!)
      }
    },
    {
      id: "10",
      type: "success" as const,
      title: "5-Star Review",
      message: "Tom Anderson left a 5-star review",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      read: true,
      action: {
        label: "View Review",
        onClick: () => console.log("View review")
      }
    }
  ];

  useEffect(() => {
    // Initialize with mock notifications
    mockNotifications.forEach(notification => {
      addNotification(notification);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "scheduled": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved": return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending": return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "scheduled": return <Calendar className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "rescheduled": return <RefreshCw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSourceIcon = (source: string) => {
    return source === "mobile" ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />;
  };

  const getSourceColor = (source: string) => {
    return source === "mobile" ? "text-blue-600" : "text-green-600";
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesSearch = appointment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.staff.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || appointment.date === selectedDate.toISOString().split('T')[0];
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const handleCreateBooking = (staff: string, date: string, time: string) => {
    setBookingData({
      ...bookingData,
      staff: staff,
      date: date,
      time: time,
    });
    setShowBookingDialog(true);
  };

  const handleSubmitBooking = () => {
    // Validate required fields
    if (!bookingData.customer || !bookingData.service || !bookingData.staff || !bookingData.date || !bookingData.time || !bookingData.branch) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    // In a real app, this would make an API call to create the booking
    console.log('Creating booking:', bookingData);

    // Add notification
    addNotification({
      type: 'success',
      title: 'Booking Created',
      message: `Appointment scheduled for ${bookingData.customer} with ${bookingData.staff} on ${bookingData.date} at ${bookingData.time}${bookingData.recurring ? ' (Recurring)' : ''}`,
    });

    // Close dialog and reset form
    setShowBookingDialog(false);
    setBookingData({
      customer: '',
      phone: '',
      email: '',
      service: '',
      services: [],
      staff: '',
      staffs: [],
      date: '',
      time: '',
      notes: '',
      products: [],
      tax: 5,
      serviceCharges: 0,
      tip: 0,
      discount: 0,
      discountType: 'percentage',
      category: '',
      finalTotal: 0,
      totalTip: 0,
      payments: [],
      status: 'pending',
      generateInvoice: false,
      branch: '',
      room: '',
      source: 'walk-in',
      duration: 30,
      recurring: false,
      recurringType: 'weekly',
      recurringEndDate: '',
      sendConfirmation: true,
      sendReminder: true,
      customerNotes: '',
      internalNotes: '',
      priority: 'normal',
      tags: [],
      attachments: []
    });
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    // In a real app, this would update the backend
    console.log(`Updating appointment ${appointmentId} to status ${newStatus}`);
    
    // Show notification
    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: `Appointment status changed to ${newStatus}`,
    });
  };

  return (
    <ProtectedRoute requiredRole="branch_admin">
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <AdminSidebar
          role="branch_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-0",
          sidebarOpen ? "lg:ml-0" : "lg:ml-1"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar
                  role="branch_admin"
                  onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Appointment Calendar</h1>
                  <p className="text-sm text-gray-600">Manage all bookings from website and mobile</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CurrencySwitcher />
                {/* Notifications */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Notifications</SheetTitle>
                      <SheetDescription>
                        Recent appointment updates and reminders
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                              notification.read
                                ? 'bg-muted/50 border-muted'
                                : 'bg-background border-border'
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                {getIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium truncate">
                                    {notification.title}
                                  </h4>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                {notification.action && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 h-auto mt-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      notification.action?.onClick();
                                    }}
                                  >
                                    {notification.action.label}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                <Button variant="outline" onClick={() => router.push('/admin/booking-approvals')} className="hidden sm:flex mr-2">
                  Booking Approvals
                </Button>
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto min-h-0">
            <div className="h-full p-4 lg:p-8">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <div className="flex items-center justify-between mb-6">
                  <TabsList>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    <TabsTrigger value="advanced-calendar">Advanced Calendar</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="recurring">Recurring</TabsTrigger>
                    <TabsTrigger value="notes">Notes & History</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-sm">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search appointments..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TabsContent value="calendar" className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <div></div>
                    <Button onClick={() => setShowBookingDialog(true)} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create Booking
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Calendar */}
                    <div className="lg:col-span-1">
                      <Card className="border-2 shadow-sm">
                        <CardHeader className="pb-4 border-b bg-gray-50/50">
                          <CardTitle className="flex items-center gap-3 text-lg">
                            <Calendar className="w-5 h-5 text-primary" />
                            Booking Calendar
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Click on a date to view appointments. Appointments from both website and mobile are shown.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-lg border-2 shadow-sm w-full max-w-xs mx-auto"
                            modifiers={{
                              hasAppointments: (date) => getAppointmentsForDate(date).length > 0
                            }}
                            modifiersStyles={{
                              hasAppointments: {
                                backgroundColor: 'rgb(59 130 246 / 0.15)',
                                color: 'rgb(59 130 246)',
                                fontWeight: '600',
                                borderRadius: '6px'
                              }
                            }}
                          />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Selected Date Appointments Sidebar */}
                    <div className="lg:col-span-2">
                      <Card className="border-2 shadow-sm h-fit sticky top-6">
                        <CardHeader className="pb-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                          <CardTitle className="text-lg lg:text-xl flex items-center gap-3">
                            <Clock className="w-6 h-6 text-primary" />
                            {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Select a date'}
                          </CardTitle>
                          <CardDescription className="text-base font-medium">
                            {selectedDate ? (
                              <span className="flex items-center gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                                  {getAppointmentsForDate(selectedDate).length} appointment(s)
                                </span>
                              </span>
                            ) : 'Choose a date from the calendar'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 px-4">
                          {selectedDate && (
                            <div className="space-y-3">
                              {getAppointmentsForDate(selectedDate).map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className="group p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all duration-200 bg-white"
                                  onClick={() => handleAppointmentClick(appointment)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                      </div>
                                      <div>
                                        <span className="font-medium text-sm text-gray-900">{appointment.time}</span>
                                        <div className={`flex items-center gap-1 mt-0.5 ${getSourceColor(appointment.source)}`}>
                                          {getSourceIcon(appointment.source)}
                                          <span className="text-xs font-medium capitalize">{appointment.source}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <Badge className={`${getStatusColor(appointment.status)} border text-xs font-semibold px-2 py-0.5`}>
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-gray-900 text-sm">{appointment.customer}</p>
                                    <p className="text-gray-700 text-xs">{appointment.service}</p>
                                    <div className="flex items-center justify-between">
                                      <p className="text-gray-600 text-xs">with {appointment.staff}</p>
                                      <span className="text-xs font-semibold text-primary">{formatCurrency(appointment.price)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {getAppointmentsForDate(selectedDate).length === 0 && (
                                <div className="text-center py-12 px-6">
                                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No appointments</h3>
                                  <p className="text-gray-500 text-sm">No appointments scheduled for this date</p>
                                </div>
                              )}
                            </div>
                          )}
                          {!selectedDate && (
                            <div className="text-center py-12 px-6">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a date</h3>
                              <p className="text-gray-500 text-sm">Choose a date from the calendar to view appointments</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced-calendar" className="space-y-6">
                  <AdvancedCalendar
                    appointments={appointments}
                    onAppointmentClick={handleAppointmentClick}
                    onStatusChange={handleStatusChange}
                    onCreateBooking={handleCreateBooking}
                  />
                </TabsContent>

                <TabsContent value="list" className="space-y-4">
                  {/* Appointments List */}
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <CardHeader className="pb-3 border-b bg-gradient-to-r from-gray-50/50 to-white">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div className="space-y-1">
                                <CardTitle className="text-lg text-primary flex items-center gap-2">
                                  {appointment.customer}
                                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getSourceColor(appointment.source)} bg-current/10`}>
                                    {getSourceIcon(appointment.source)}
                                    <span className="capitalize">{appointment.source}</span>
                                  </div>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-sm">
                                  <span className="font-medium text-gray-700">{appointment.service}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600">{appointment.staff}</span>
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(appointment.status)} border flex items-center gap-1 px-3 py-1 text-xs font-semibold`}>
                              {getStatusIcon(appointment.status)}
                              <span className="capitalize">{appointment.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs font-medium text-blue-900">{appointment.date}</p>
                                <p className="text-xs text-blue-700">at {appointment.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                              <Clock className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs font-medium text-green-900">{appointment.duration}</p>
                                <p className="text-xs text-green-700">Duration</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                              <DollarSign className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="text-xs font-medium text-purple-900">{formatCurrency(appointment.price)}</p>
                                <p className="text-xs text-purple-700">Price</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                              <Phone className="w-4 h-4 text-orange-600" />
                              <div>
                                <p className="text-xs font-medium text-orange-900">{appointment.phone}</p>
                                <p className="text-xs text-orange-700">Contact</p>
                              </div>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-yellow-900 mb-1">Notes</p>
                                  <p className="text-sm text-yellow-800">{appointment.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Created: {new Date(appointment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Updated: {new Date(appointment.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                              {/* View Details Button */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAppointmentClick(appointment)}
                                className="flex items-center gap-2 border-2 hover:bg-primary hover:text-white transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Button>

                              {/* Status-based Action Buttons */}
                              {appointment.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'approved')}
                                    className="flex items-center gap-2 text-green-600 hover:text-white hover:bg-green-600 border-green-300 border-2 transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'rejected')}
                                    className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-red-300 border-2 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </Button>
                                </>
                              )}

                              {(appointment.status === 'approved' || appointment.status === 'scheduled') && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'in-progress')}
                                    className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 border-blue-300 border-2 transition-colors"
                                  >
                                    <Play className="w-4 h-4" />
                                    Start Service
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'rescheduled')}
                                    className="flex items-center gap-2 text-yellow-600 hover:text-white hover:bg-yellow-600 border-yellow-300 border-2 transition-colors"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Reschedule
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                    className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-red-300 border-2 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Cancel
                                  </Button>
                                </>
                              )}

                              {appointment.status === 'in-progress' && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2 border-2 border-green-500 text-white shadow-sm"
                                  onClick={() => handleStatusChange(appointment.id, 'completed')}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Mark Complete
                                </Button>
                              )}

                              {appointment.status === 'completed' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 border-blue-300 border-2 transition-colors"
                                  >
                                    <Receipt className="w-4 h-4" />
                                    Generate Invoice
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-2 text-purple-600 hover:text-white hover:bg-purple-600 border-purple-300 border-2 transition-colors"
                                  >
                                    <Star className="w-4 h-4" />
                                    Add Review
                                  </Button>
                                </>
                              )}

                              {appointment.status === 'rescheduled' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'approved')}
                                    className="flex items-center gap-2 text-green-600 hover:text-white hover:bg-green-600 border-green-300 border-2 transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm New Time
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                    className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-red-300 border-2 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Cancel
                                  </Button>
                                </>
                              )}

                              {appointment.status === 'cancelled' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                                  className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 border-blue-300 border-2 transition-colors"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  Rebook
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredAppointments.length === 0 && (
                    <div className="text-center py-16 px-8">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-600 mb-3">No appointments found</h3>
                      <p className="text-gray-500 text-lg">Try adjusting your filters or search query</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="resources" className="space-y-6">
                  <ResourceScheduler
                    rooms={[
                      {
                        id: 'room-1',
                        name: 'Room 1',
                        type: 'standard' as const,
                        capacity: 1,
                        branchId: 'branch-1',
                        branchName: 'Downtown Premium',
                        amenities: ['Hair Washing Station', 'LED Mirror', 'Reclining Chair'],
                        isActive: true,
                        bookingRules: {
                          maxDuration: 120,
                          bufferTime: 15,
                          requiresSpecialist: false,
                          allowedServices: ['Classic Haircut', 'Beard Trim & Shape', 'Haircut & Style']
                        },
                        createdAt: '2024-01-01T00:00:00Z',
                        updatedAt: '2024-01-01T00:00:00Z'
                      },
                      // ... other rooms
                    ]}
                    roomBookings={[
                      {
                        id: 'booking-1',
                        roomId: 'room-1',
                        appointmentId: 1,
                        startTime: '09:00',
                        endTime: '09:30',
                        date: '2025-12-15',
                        purpose: 'Classic Haircut for John Doe',
                        bookedBy: 'Mike Johnson',
                        status: 'scheduled' as const,
                        notes: 'Regular customer haircut'
                      },
                      // ... other bookings
                    ]}
                    appointments={appointments.map(apt => ({
                      id: apt.id,
                      customer: apt.customer,
                      service: apt.service,
                      staff: apt.staff,
                      date: apt.date,
                      time: apt.time,
                      duration: apt.duration,
                      status: apt.status
                    }))}
                    branches={[
                      { id: 'branch-1', name: 'Downtown Premium', location: '123 Main St, Downtown' },
                      { id: 'branch-2', name: 'Midtown Elite', location: '456 Oak Ave, Midtown' },
                      { id: 'branch-3', name: 'Uptown Luxury', location: '789 Pine St, Uptown' }
                    ]}
                    services={[
                      { id: 'service-1', name: 'Classic Haircut', duration: 30, bufferTime: 15 },
                      { id: 'service-2', name: 'Beard Trim & Shape', duration: 20, bufferTime: 10 },
                      { id: 'service-3', name: 'Premium Package', duration: 60, bufferTime: 20 },
                      { id: 'service-4', name: 'Haircut & Style', duration: 45, bufferTime: 15 },
                      { id: 'service-5', name: 'Hair Color', duration: 90, bufferTime: 30 }
                    ]}
                    onRoomCreate={(room) => console.log('Create room:', room)}
                    onRoomUpdate={(id, updates) => console.log('Update room:', id, updates)}
                    onRoomDelete={(id) => console.log('Delete room:', id)}
                    onRoomBookingCreate={(booking) => console.log('Create room booking:', booking)}
                    onRoomBookingUpdate={(id, updates) => console.log('Update room booking:', id, updates)}
                    onRoomBookingDelete={(id) => console.log('Delete room booking:', id)}
                  />
                </TabsContent>

                <TabsContent value="recurring" className="space-y-6">
                  <RecurringAppointmentsManager
                    recurringAppointments={[
                      {
                        id: 'recurring-1',
                        baseAppointmentId: 1001,
                        customer: 'John Doe',
                        service: 'Classic Haircut',
                        staff: 'John Smith',
                        room: 'Room 1',
                        pattern: {
                          frequency: 'weekly',
                          interval: 1,
                          daysOfWeek: [1, 3, 5]
                        },
                        startDate: '2025-01-01',
                        endDate: '2025-12-31',
                        time: '10:00',
                        duration: '30',
                        bufferTime: 15,
                        price: 35,
                        instances: [
                          {
                            id: 'instance-1',
                            recurringAppointmentId: 'recurring-1',
                            date: '2025-01-01',
                            time: '10:00',
                            status: 'completed',
                            notes: 'Regular haircut'
                          },
                          // ... other instances
                        ],
                        isActive: true,
                        autoConfirm: true,
                        maxOccurrences: 52,
                        currentOccurrences: 3,
                        exceptions: [],
                        createdAt: '2024-12-01T08:00:00Z',
                        updatedAt: '2024-12-15T10:30:00Z'
                      },
                      // ... other recurring appointments
                    ]}
                    services={[
                      { id: 'service-1', name: 'Classic Haircut', duration: 30, bufferTime: 15, price: 35 },
                      { id: 'service-2', name: 'Beard Trim & Shape', duration: 20, bufferTime: 10, price: 25 },
                      { id: 'service-3', name: 'Full Service Package', duration: 90, bufferTime: 30, price: 120 }
                    ]}
                    staffs={[
                      { id: 'staff-1', name: 'John Smith', specialties: ['Haircut', 'Shaving'], branchId: 'branch-1' },
                      { id: 'staff-2', name: 'Mike Johnson', specialties: ['Beard', 'Facial'], branchId: 'branch-1' }
                    ]}
                    branches={[
                      { id: 'branch-1', name: 'Downtown Branch', location: '123 Main St, Downtown' },
                      { id: 'branch-2', name: 'Uptown Branch', location: '456 Oak Ave, Uptown' }
                    ]}
                    rooms={[
                      { id: 'room-1', name: 'Room 1', type: 'standard', branchId: 'branch-1' },
                      { id: 'room-2', name: 'Room 2', type: 'standard', branchId: 'branch-1' }
                    ]}
                    onRecurringCreate={(recurring) => console.log('Create recurring:', recurring)}
                    onRecurringUpdate={(id, updates) => console.log('Update recurring:', id, updates)}
                    onRecurringDelete={(id) => console.log('Delete recurring:', id)}
                    onInstanceUpdate={(id, updates) => console.log('Update instance:', id, updates)}
                    onExceptionCreate={(exception) => console.log('Create exception:', exception)}
                  />
                </TabsContent>

                <TabsContent value="notes" className="space-y-6">
                  {selectedAppointment ? (
                    <AppointmentNotesHistory
                      appointmentId={selectedAppointment.id.toString()}
                      notes={[
                        {
                          id: 'note-1',
                          appointmentId: selectedAppointment.id.toString(),
                          authorId: 'staff-1',
                          authorName: 'Mike Johnson',
                          authorRole: 'staff' as const,
                          type: 'preference' as const,
                          content: 'Customer prefers fade haircut with minimal styling. Regular client - comes every 3 weeks.',
                          isPrivate: false,
                          priority: 'medium' as const,
                          status: 'active' as const,
                          createdAt: '2025-12-10T09:15:00Z',
                          updatedAt: '2025-12-10T09:15:00Z',
                          attachments: []
                        }
                      ]}
                      communications={[
                        {
                          id: 'comm-1',
                          appointmentId: selectedAppointment.id.toString(),
                          type: 'email' as const,
                          direction: 'outbound' as const,
                          from: 'bookings@salon.com',
                          to: selectedAppointment.email,
                          subject: 'Appointment Confirmation',
                          content: 'Your appointment is confirmed for December 15th at 10:00 AM.',
                          status: 'delivered' as const,
                          sentAt: '2025-12-14T14:20:00Z',
                          deliveredAt: '2025-12-14T14:20:30Z',
                          readAt: '2025-12-14T14:25:00Z'
                        }
                      ]}
                      history={[
                        {
                          id: 'hist-1',
                          appointmentId: selectedAppointment.id.toString(),
                          action: 'created' as const,
                          actorId: 'system',
                          actorName: 'System',
                          actorRole: 'system' as const,
                          reason: 'Website booking',
                          notes: 'Appointment created via website booking',
                          timestamp: '2025-12-14T08:00:00Z'
                        }
                      ]}
                      currentUser={{ id: user?.id || 'admin-1', name: user?.fullName || 'Admin', role: 'admin' }}
                      onNoteCreate={(note) => console.log('Create note:', note)}
                      onNoteUpdate={(id, updates) => console.log('Update note:', id, updates)}
                      onNoteDelete={(id) => console.log('Delete note:', id)}
                      onCommunicationSend={(comm) => console.log('Send communication:', comm)}
                      onAttachmentUpload={(noteId, file) => Promise.resolve()}
                      onAttachmentDownload={(id) => console.log('Download attachment:', id)}
                    />
                  ) : (
                    <div className="text-center py-16 px-8">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-600 mb-3">Select an Appointment</h3>
                      <p className="text-gray-500 text-lg">Choose an appointment from the list to view its notes and history</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Sheet */}
      <Sheet open={showAppointmentDetails} onOpenChange={setShowAppointmentDetails}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="border-b-2 pb-6 mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 -mx-6 -mt-6 px-6 pt-6 rounded-t-lg">
            <SheetTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              Appointment Details
              {selectedAppointment && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getSourceColor(selectedAppointment.source)} bg-current/10`}>
                  {getSourceIcon(selectedAppointment.source)}
                  <span className="capitalize">{selectedAppointment.source}</span>
                </div>
              )}
            </SheetTitle>
            <SheetDescription className="text-base mt-2">
              Complete appointment information and management options
            </SheetDescription>
          </SheetHeader>

          {selectedAppointment && (
            <div className="space-y-8">
              {/* Status Overview */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Appointment Status
                  </h3>
                  <Badge className={`${getStatusColor(selectedAppointment.status)} border-2 px-4 py-2 text-sm font-semibold flex items-center gap-2`}>
                    {getStatusIcon(selectedAppointment.status)}
                    <span className="capitalize">{selectedAppointment.status}</span>
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Created: {new Date(selectedAppointment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Updated: {new Date(selectedAppointment.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-6 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">{selectedAppointment.customer}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">{selectedAppointment.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <p className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border break-all">{selectedAppointment.email}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-6 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-purple-600" />
                  </div>
                  Service Details
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Scissors className="w-4 h-4" />
                        Service Type
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">{selectedAppointment.service}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assigned Barber
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">{selectedAppointment.staff}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">{selectedAppointment.date}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">{selectedAppointment.time}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">{selectedAppointment.duration}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Service Price
                    </label>
                    <p className="text-xl font-bold text-green-600 bg-green-50 px-4 py-3 rounded-lg border-2 border-green-200 text-center">{formatCurrency(selectedAppointment.price)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  Additional Information
                </h3>
                <div className="space-y-6">
                  {selectedAppointment.notes && (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Special Notes & Instructions
                      </label>
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                        <Textarea
                          value={selectedAppointment.notes}
                          readOnly
                          className="min-h-[100px] bg-transparent border-0 resize-none text-gray-800"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Branch Location
                    </label>
                    <p className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">{selectedAppointment.branch}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(selectedAppointment.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(selectedAppointment.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(selectedAppointment.updatedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(selectedAppointment.updatedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="h-12 flex items-center gap-3 border-2 hover:bg-primary hover:text-white transition-colors">
                    <Edit className="w-5 h-5" />
                    Edit Appointment Details
                  </Button>

                  {selectedAppointment.status === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-colors">
                        <RefreshCw className="w-5 h-5" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 flex items-center gap-3 border-2 border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                        onClick={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
                      >
                        <XCircle className="w-5 h-5" />
                        Cancel Appointment
                      </Button>
                    </div>
                  )}

                  {selectedAppointment.status === 'in-progress' && (
                    <Button
                      className="h-12 bg-green-600 hover:bg-green-700 flex items-center gap-3 border-2 border-green-500 text-white shadow-sm"
                      onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Completed
                    </Button>
                  )}

                  {selectedAppointment.status === 'completed' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors">
                        <Receipt className="w-5 h-5" />
                        Generate Invoice
                      </Button>
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors">
                        <Star className="w-5 h-5" />
                        Add Review
                      </Button>
                    </div>
                  )}

                  {selectedAppointment.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-green-300 text-green-700 hover:bg-green-50 transition-colors">
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </Button>
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-red-300 text-red-700 hover:bg-red-50 transition-colors">
                        <XCircle className="w-5 h-5" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Booking Creation Dialog */}
      <Sheet open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <SheetContent className="sm:max-w-[900px] w-full z-[60] overflow-y-auto">
          <SheetHeader className="border-b pb-4 mb-6">
            <SheetTitle className="text-xl font-semibold">Create New Booking</SheetTitle>
            <SheetDescription className="text-base">
              Schedule a new appointment for a customer.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 pb-6">
            {/* Customer Information */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Customer Name *</label>
                  <Input
                    placeholder="Enter customer name"
                    value={bookingData.customer}
                    onChange={(e) => setBookingData({...bookingData, customer: e.target.value})}
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Input
                      placeholder="(555) 123-4567"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      type="email"
                      placeholder="customer@email.com"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Branch & Room Selection */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location & Resources
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Branch *</label>
                    <Select value={bookingData.branch} onValueChange={(value) => setBookingData({...bookingData, branch: value})}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Downtown Premium">Downtown Premium</SelectItem>
                        <SelectItem value="Midtown Elite">Midtown Elite</SelectItem>
                        <SelectItem value="Uptown Luxury">Uptown Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Room</label>
                    <Select value={bookingData.room} onValueChange={(value) => setBookingData({...bookingData, room: value})}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select room (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Room 1">Room 1 - Premium Suite</SelectItem>
                        <SelectItem value="Room 2">Room 2 - Standard Chair</SelectItem>
                        <SelectItem value="Room 3">Room 3 - VIP Lounge</SelectItem>
                        <SelectItem value="Room 4">Room 4 - Express Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-primary" />
                  Service Details
                </h3>

                <div className="space-y-6">
                  {/* Single Service Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Service *</label>
                      <Select value={bookingData.service} onValueChange={(value) => {
                        const serviceDurations: { [key: string]: number } = {
                          "Classic Haircut": 30,
                          "Beard Trim & Shape": 20,
                          "Premium Package": 60,
                          "Haircut & Style": 45,
                          "Hair Coloring": 90,
                          "Facial Treatment": 60
                        };
                        setBookingData({
                          ...bookingData,
                          service: value,
                          duration: serviceDurations[value] || 30
                        });
                      }}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Classic Haircut">Classic Haircut - $35 (30 min)</SelectItem>
                          <SelectItem value="Beard Trim & Shape">Beard Trim & Shape - $25 (20 min)</SelectItem>
                          <SelectItem value="Premium Package">Premium Package - $85 (60 min)</SelectItem>
                          <SelectItem value="Haircut & Style">Haircut & Style - $50 (45 min)</SelectItem>
                          <SelectItem value="Hair Coloring">Hair Coloring - $120 (90 min)</SelectItem>
                          <SelectItem value="Facial Treatment">Facial Treatment - $75 (60 min)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                      <Input
                        type="number"
                        min="15"
                        step="15"
                        value={bookingData.duration}
                        onChange={(e) => setBookingData({...bookingData, duration: parseInt(e.target.value) || 30})}
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Multiple Services Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Add Additional Services</label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Add Service</label>
                        <Select onValueChange={(value) => {
                          const servicePrices: { [key: string]: number } = {
                            "Classic Haircut": 35,
                            "Beard Trim & Shape": 25,
                            "Premium Package": 85,
                            "Haircut & Style": 50,
                            "Hair Coloring": 120,
                            "Facial Treatment": 75
                          };
                          const serviceDurations: { [key: string]: number } = {
                            "Classic Haircut": 30,
                            "Beard Trim & Shape": 20,
                            "Premium Package": 60,
                            "Haircut & Style": 45,
                            "Hair Coloring": 90,
                            "Facial Treatment": 60
                          };

                          if (!bookingData.services.find(s => s.name === value)) {
                            setBookingData(prev => ({
                              ...prev,
                              services: [...prev.services, {
                                name: value,
                                price: servicePrices[value] || 0,
                                duration: serviceDurations[value] || 30
                              }]
                            }));
                          }
                        }}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select service to add" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Classic Haircut">Classic Haircut - $35 (30 min)</SelectItem>
                            <SelectItem value="Beard Trim & Shape">Beard Trim & Shape - $25 (20 min)</SelectItem>
                            <SelectItem value="Premium Package">Premium Package - $85 (60 min)</SelectItem>
                            <SelectItem value="Haircut & Style">Haircut & Style - $50 (45 min)</SelectItem>
                            <SelectItem value="Hair Coloring">Hair Coloring - $120 (90 min)</SelectItem>
                            <SelectItem value="Facial Treatment">Facial Treatment - $75 (60 min)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Selected Services List */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Selected Services</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {bookingData.services.map((service, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{service.name}</div>
                              <div className="text-xs text-gray-500">{service.duration} min • {formatCurrency(service.price)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <label className="text-xs text-gray-600">Tip:</label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={service.tip || ''}
                                  onChange={(e) => {
                                    const tip = parseFloat(e.target.value) || 0;
                                    setBookingData(prev => ({
                                      ...prev,
                                      services: prev.services.map((s, i) =>
                                        i === index ? { ...s, tip } : s
                                      )
                                    }));
                                  }}
                                  className="w-16 h-8 text-xs"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setBookingData(prev => ({
                                    ...prev,
                                    services: prev.services.filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                <XCircle className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barber/Team Selection */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Barber/Team Selection
                </h3>

                <div className="space-y-6">
                  {/* Single Staff Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Primary Staff *</label>
                      <Select value={bookingData.staff} onValueChange={(value) => setBookingData({...bookingData, staff: value})}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select primary barber" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                          <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                          <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                          <SelectItem value="David Kim">David Kim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Multiple Barbers/Team Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Add Team Members</label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Add Team Member</label>
                        <Select onValueChange={(value) => {
                          if (!bookingData.staffs.find(b => b.name === value) && value !== bookingData.staff) {
                            setBookingData(prev => ({
                              ...prev,
                              staffs: [...prev.staffs, { name: value }]
                            }));
                          }
                        }}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select team member to add" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mike Johnson" disabled={bookingData.staff === 'Mike Johnson'}>
                              Mike Johnson
                            </SelectItem>
                            <SelectItem value="Alex Rodriguez" disabled={bookingData.staff === 'Alex Rodriguez'}>
                              Alex Rodriguez
                            </SelectItem>
                            <SelectItem value="Sarah Chen" disabled={bookingData.staff === 'Sarah Chen'}>
                              Sarah Chen
                            </SelectItem>
                            <SelectItem value="David Kim" disabled={bookingData.staff === 'David Kim'}>
                              David Kim
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Selected Team Members List */}
                    {bookingData.staffs.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Team Members</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {bookingData.staffs.map((staff, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{staff.name}</div>
                                <div className="text-xs text-gray-500">Team Member</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <label className="text-xs text-gray-600">Tip:</label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={staff.tip || ''}
                                    onChange={(e) => {
                                      const tip = parseFloat(e.target.value) || 0;
                                      setBookingData(prev => ({
                                        ...prev,
                                        staffs: prev.staffs.map((s, i) =>
                                          i === index ? { ...s, tip } : s
                                        )
                                      }));
                                    }}
                                    className="w-16 h-8 text-xs"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setBookingData(prev => ({
                                      ...prev,
                                      staffs: prev.staffs.filter((_, i) => i !== index)
                                    }));
                                  }}
                                >
                                  <XCircle className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Products
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Product</label>
                      <Select onValueChange={(value) => {
                        const product = mockProducts.find(p => p.name === value);
                        if (product && !bookingData.products.find(p => p.name === value)) {
                          setBookingData(prev => ({
                            ...prev,
                            products: [...prev.products, { ...product, quantity: 1 }]
                          }));
                        }
                      }}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Add product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.name} value={product.name}>
                              {product.name} - {product.category} - {formatCurrency(product.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Selected Products List */}
                  {bookingData.products.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Selected Products</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {bookingData.products.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) => {
                                  const quantity = parseInt(e.target.value) || 1;
                                  setBookingData(prev => ({
                                    ...prev,
                                    products: prev.products.map((p, i) =>
                                      i === index ? { ...p, quantity } : p
                                    )
                                  }));
                                }}
                                className="w-16 h-8"
                              />
                              <span className="text-sm font-medium">{formatCurrency(product.price * product.quantity)}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setBookingData(prev => ({
                                    ...prev,
                                    products: prev.products.filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                <XCircle className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Pricing & Charges
                  </h3>
                  <CurrencySwitcher />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tax (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={bookingData.tax}
                      onChange={(e) => setBookingData({...bookingData, tax: parseFloat(e.target.value) || 0})}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Service Charges ($)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={bookingData.serviceCharges}
                      onChange={(e) => setBookingData({...bookingData, serviceCharges: parseFloat(e.target.value) || 0})}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">General Tip ($)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bookingData.tip}
                      onChange={(e) => setBookingData({...bookingData, tip: parseFloat(e.target.value) || 0})}
                      className="h-11"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Discount Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Discount Type</label>
                    <Select value={bookingData.discountType} onValueChange={(value: 'percentage' | 'fixed') => 
                      setBookingData({...bookingData, discountType: value})
                    }>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Discount {bookingData.discountType === 'percentage' ? '(%)' : '($)'}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step={bookingData.discountType === 'percentage' ? "0.1" : "0.01"}
                      max={bookingData.discountType === 'percentage' ? "100" : undefined}
                      value={bookingData.discount}
                      onChange={(e) => setBookingData({...bookingData, discount: parseFloat(e.target.value) || 0})}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="mt-4 p-4 bg-white rounded border">
                  <h4 className="font-medium text-gray-900 mb-3">Price Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Main Service:</span>
                      <span>{formatCurrency(getServicePrice(bookingData.service))}</span>
                    </div>
                    {bookingData.services.length > 0 && (
                      <>
                        <div className="text-xs text-gray-600 font-medium mt-2">Additional Services:</div>
                        {bookingData.services.map((service, index) => (
                          <div key={index} className="flex justify-between text-xs ml-2">
                            <span>{service.name}:</span>
                            <span>{formatCurrency(service.price)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Total Services:</span>
                          <span>{formatCurrency(
                            getServicePrice(bookingData.service) +
                            bookingData.services.reduce((sum, s) => sum + s.price, 0)
                          )}</span>
                        </div>
                      </>
                    )}
                    {bookingData.products.length > 0 && (
                      <>
                        <div className="text-xs text-gray-600 font-medium mt-2">Products:</div>
                        {bookingData.products.map((product, index) => (
                          <div key={index} className="flex justify-between text-xs ml-2">
                            <span>{product.name} (x{product.quantity}):</span>
                            <span>{formatCurrency(product.price * product.quantity)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Total Products:</span>
                          <span>{formatCurrency(bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0))}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span>Service Charges:</span>
                      <span>{formatCurrency(bookingData.serviceCharges)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>General Tip:</span>
                      <span>{formatCurrency(bookingData.tip)}</span>
                    </div>
                    {bookingData.services.some(s => s.tip) && (
                      <>
                        <div className="text-xs text-gray-600 font-medium mt-2">Service Tips:</div>
                        {bookingData.services.filter(s => s.tip).map((service, index) => (
                          <div key={index} className="flex justify-between text-xs ml-2">
                            <span>{service.name} Tip:</span>
                            <span>{formatCurrency(service.tip || 0)}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {bookingData.staffs.some(s => s.tip) && (
                      <>
                        <div className="text-xs text-gray-600 font-medium mt-2">Team Tips:</div>
                        {bookingData.staffs.filter(s => s.tip).map((staff, index) => (
                          <div key={index} className="flex justify-between text-xs ml-2">
                            <span>{staff.name} Tip:</span>
                            <span>{formatCurrency(staff.tip || 0)}</span>
                          </div>
                        ))}
                      </>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(
                        getServicePrice(bookingData.service) +
                        bookingData.services.reduce((sum, s) => sum + s.price + (s.tip || 0), 0) +
                        bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0) +
                        bookingData.serviceCharges +
                        bookingData.tip +
                        bookingData.staffs.reduce((sum, s) => sum + (s.tip || 0), 0)
                      )}</span>
                    </div>
                    {bookingData.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount {bookingData.discountType === 'percentage' ? `(${bookingData.discount}%)` : ''}:</span>
                        <span>-{formatCurrency(
                          bookingData.discountType === 'percentage' 
                            ? (getServicePrice(bookingData.service) +
                               bookingData.services.reduce((sum, s) => sum + s.price + (s.tip || 0), 0) +
                               bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0) +
                               bookingData.serviceCharges +
                               bookingData.tip +
                               bookingData.staffs.reduce((sum, s) => sum + (s.tip || 0), 0)) * (bookingData.discount / 100)
                            : bookingData.discount
                        )}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax ({bookingData.tax}%):</span>
                      <span>{formatCurrency(parseFloat(calculateTax()))}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(parseFloat(calculateTotal()))}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium text-primary">
                      <span>Total Tips:</span>
                      <span>{formatCurrency(calculateTotalTip())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Booking Status
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Select value={bookingData.status} onValueChange={(value) => setBookingData(prev => ({
                    ...prev,
                    status: value,
                    generateInvoice: value === 'completed' ? prev.generateInvoice : false
                  }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="arrived">Arrived</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Date & Time
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date *</label>
                    <Input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Time *</label>
                    <Input
                      type="time"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Recurring Appointments */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-primary" />
                  Recurring Options
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                      Make this a recurring appointment
                    </label>
                    <Switch
                      id="recurring"
                      checked={bookingData.recurring}
                      onCheckedChange={(checked) => setBookingData({...bookingData, recurring: checked})}
                    />
                  </div>

                  {bookingData.recurring && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Frequency</label>
                        <Select value={bookingData.recurringType} onValueChange={(value: any) => setBookingData({...bookingData, recurringType: value})}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <Input
                          type="date"
                          value={bookingData.recurringEndDate}
                          onChange={(e) => setBookingData({...bookingData, recurringEndDate: e.target.value})}
                          className="h-11"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Generation */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  Invoice Options
                </h3>

                <div className="space-y-4">
                  {bookingData.status === 'completed' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <label htmlFor="generateInvoice" className="text-sm font-medium text-gray-700">
                          Generate invoice automatically after booking
                        </label>
                        <Switch
                          id="generateInvoice"
                          checked={bookingData.generateInvoice}
                          onCheckedChange={(checked) => setBookingData({...bookingData, generateInvoice: checked})}
                        />
                      </div>

                      {bookingData.generateInvoice && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-800">
                            <Receipt className="w-4 h-4" />
                            <span className="text-sm font-medium">Invoice will be generated with:</span>
                          </div>
                          <ul className="mt-2 text-sm text-blue-700 space-y-1">
                            <li>• Customer details and booking information</li>
                            <li>• Itemized services and products</li>
                            <li>• Tax calculation and total amount</li>
                            <li>• Payment terms and due date</li>
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Invoice generation is only available for completed services</span>
                      </div>
                      <p className="mt-2 text-sm text-yellow-700">
                        Set the booking status to "Completed" to enable invoice generation options.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="sendConfirmation" className="text-sm font-medium text-gray-700">
                      Send booking confirmation
                    </label>
                    <Switch
                      id="sendConfirmation"
                      checked={bookingData.sendConfirmation}
                      onCheckedChange={(checked) => setBookingData({...bookingData, sendConfirmation: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="sendReminder" className="text-sm font-medium text-gray-700">
                      Send reminder notifications
                    </label>
                    <Switch
                      id="sendReminder"
                      checked={bookingData.sendReminder}
                      onCheckedChange={(checked) => setBookingData({...bookingData, sendReminder: checked})}
                    />
                  </div>

                  {bookingData.sendReminder && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Bell className="w-4 h-4" />
                        <span className="text-sm font-medium">Reminder schedule:</span>
                      </div>
                      <ul className="mt-2 text-sm text-blue-700 space-y-1">
                        <li>• 24 hours before appointment</li>
                        <li>• 2 hours before appointment</li>
                        <li>• 15 minutes before appointment</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Notes & Tags
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Customer Notes (visible to customer)</label>
                    <Textarea
                      placeholder="Notes that will be visible to the customer..."
                      value={bookingData.customerNotes}
                      onChange={(e) => setBookingData({...bookingData, customerNotes: e.target.value})}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Internal Notes (staff only)</label>
                    <Textarea
                      placeholder="Internal notes for staff reference..."
                      value={bookingData.internalNotes}
                      onChange={(e) => setBookingData({...bookingData, internalNotes: e.target.value})}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {bookingData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                          <XCircle
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => {
                              setBookingData(prev => ({
                                ...prev,
                                tags: prev.tags.filter((_, i) => i !== index)
                              }));
                            }}
                          />
                        </Badge>
                      ))}
                      <Input
                        placeholder="Add tag..."
                        className="flex-1 min-w-[120px] h-8"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = e.currentTarget.value.trim();
                            if (value && !bookingData.tags.includes(value)) {
                              setBookingData(prev => ({
                                ...prev,
                                tags: [...prev.tags, value]
                              }));
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Press Enter to add tags</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t bg-white px-6 py-4 -mx-6 -mb-6">
              <Button variant="outline" onClick={() => setShowBookingDialog(false)} className="px-6 h-11">
                Cancel
              </Button>
              <Button onClick={handleSubmitBooking} className="px-6 h-11 bg-primary hover:bg-primary/90">
                Create Booking
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </ProtectedRoute>
  );
}