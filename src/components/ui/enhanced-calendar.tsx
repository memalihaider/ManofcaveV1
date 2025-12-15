'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Settings,
  RotateCcw,
  Grid3X3,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Scissors,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Filter,
  Search
} from "lucide-react";
import {
  format,
  addDays,
  startOfDay,
  addMinutes,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  getDay
} from "date-fns";

export interface Appointment {
  id: number;
  customer: string;
  service: string;
  barber: string;
  room?: string;
  date: string;
  time: string;
  duration: string;
  bufferTime?: number; // minutes before/after appointment
  price: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  phone: string;
  email: string;
  notes: string;
  source: string;
  branch: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate: string;
    occurrences: number;
  };
  groupBooking?: {
    groupId: string;
    groupName: string;
    participants: number;
  };
  createdAt: string;
  updatedAt: string;
  serviceHistory?: Array<{
    date: string;
    service: string;
    notes: string;
  }>;
}

export interface BusinessHours {
  [key: string]: { start: number; end: number; closed?: boolean };
}

export interface BookingRule {
  id: string;
  name: string;
  type: 'buffer' | 'business_hours' | 'max_bookings' | 'staff_availability';
  value: any;
  branchId?: string;
}

interface EnhancedCalendarProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onAppointmentUpdate: (appointmentId: number, updates: Partial<Appointment>) => void;
  onAppointmentCreate: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAppointmentDelete: (appointmentId: number) => void;
  onStatusChange: (appointmentId: number, newStatus: string) => void;
  businessHours?: BusinessHours;
  bookingRules?: BookingRule[];
  branches?: Array<{ id: string; name: string; location: string }>;
  barbers?: Array<{ id: string; name: string; specialties: string[]; branchId: string }>;
  rooms?: Array<{ id: string; name: string; type: string; branchId: string }>;
  services?: Array<{ id: string; name: string; duration: number; bufferTime: number; price: number }>;
  viewMode?: 'day' | 'week' | 'month';
  onViewModeChange?: (mode: 'day' | 'week' | 'month') => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  selectedBranch?: string;
  onBranchChange?: (branchId: string) => void;
  selectedBarber?: string;
  onBarberChange?: (barberId: string) => void;
  selectedRoom?: string;
  onRoomChange?: (roomId: string) => void;
  showDragDrop?: boolean;
  onAppointmentMove?: (appointmentId: number, newDate: string, newTime: string, newBarber?: string, newRoom?: string) => void;
}

export function EnhancedCalendar({
  appointments,
  onAppointmentClick,
  onAppointmentUpdate,
  onAppointmentCreate,
  onAppointmentDelete,
  onStatusChange,
  businessHours = { 'default': { start: 9, end: 18 } },
  bookingRules = [],
  branches = [],
  barbers = [],
  rooms = [],
  services = [],
  viewMode = 'week',
  onViewModeChange,
  selectedDate = new Date(),
  onDateChange,
  selectedBranch = 'all',
  onBranchChange,
  selectedBarber = 'all',
  onBarberChange,
  selectedRoom = 'all',
  onRoomChange,
  showDragDrop = true,
  onAppointmentMove
}: EnhancedCalendarProps) {
  const [currentViewMode, setCurrentViewMode] = useState<'day' | 'week' | 'month'>(viewMode);
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [currentBranch, setCurrentBranch] = useState(selectedBranch);
  const [currentBarber, setCurrentBarber] = useState(selectedBarber);
  const [currentRoom, setCurrentRoom] = useState(selectedRoom);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Update parent state when local state changes
  useEffect(() => {
    if (onViewModeChange) onViewModeChange(currentViewMode);
  }, [currentViewMode, onViewModeChange]);

  useEffect(() => {
    if (onDateChange) onDateChange(currentDate);
  }, [currentDate, onDateChange]);

  useEffect(() => {
    if (onBranchChange) onBranchChange(currentBranch);
  }, [currentBranch, onBranchChange]);

  useEffect(() => {
    if (onBarberChange) onBarberChange(currentBarber);
  }, [currentBarber, onBarberChange]);

  useEffect(() => {
    if (onRoomChange) onRoomChange(currentRoom);
  }, [currentRoom, onRoomChange]);

  // Navigation functions
  const navigateDate = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      switch (currentViewMode) {
        case 'day':
          return direction === 'next' ? addDays(prevDate, 1) : addDays(prevDate, -1);
        case 'week':
          return direction === 'next' ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1);
        case 'month':
          return direction === 'next' ? addMonths(prevDate, 1) : subMonths(prevDate, 1);
        default:
          return prevDate;
      }
    });
  }, [currentViewMode]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Get date range for current view
  const getDateRange = useCallback(() => {
    switch (currentViewMode) {
      case 'day':
        return { start: currentDate, end: currentDate };
      case 'week':
        return {
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
      default:
        return { start: currentDate, end: currentDate };
    }
  }, [currentDate, currentViewMode]);

  // Filter appointments based on current filters
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = parseISO(apt.date);
    const dateRange = getDateRange();
    const inDateRange = aptDate >= dateRange.start && aptDate <= dateRange.end;
    const matchesBranch = currentBranch === 'all' || apt.branch === currentBranch;
    const matchesBarber = currentBarber === 'all' || apt.barber === currentBarber;
    const matchesRoom = currentRoom === 'all' || apt.room === currentRoom;
    const matchesSearch = searchQuery === '' ||
      apt.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

    return inDateRange && matchesBranch && matchesBarber && matchesRoom && matchesSearch && matchesStatus;
  });

  // Get appointments for a specific date and time slot
  const getAppointmentsForSlot = (date: Date, timeSlot?: string, barber?: string, room?: string) => {
    return filteredAppointments.filter(apt => {
      const aptDate = parseISO(apt.date);
      const matchesDate = isSameDay(aptDate, date);
      const matchesTime = !timeSlot || apt.time === timeSlot;
      const matchesBarber = !barber || barber === 'all' || apt.barber === barber;
      const matchesRoom = !room || room === 'all' || apt.room === room;

      return matchesDate && matchesTime && matchesBarber && matchesRoom;
    });
  };

  // Drag and drop handlers
  const handleDragStart = (appointment: Appointment) => {
    if (showDragDrop) {
      setDraggedAppointment(appointment);
    }
  };

  const handleDrop = (date: Date, timeSlot: string, barber?: string, room?: string) => {
    if (draggedAppointment && onAppointmentMove) {
      onAppointmentMove(
        draggedAppointment.id,
        format(date, 'yyyy-MM-dd'),
        timeSlot,
        barber,
        room
      );
      setDraggedAppointment(null);
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Render different view modes
  const renderDayView = () => {
    const hours = [];
    const branchHours = businessHours[currentBranch] || businessHours['default'];

    if (branchHours?.closed) {
      return (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Branch Closed</h3>
          <p className="text-gray-500">This branch is closed on {format(currentDate, 'EEEE, MMMM d')}</p>
        </div>
      );
    }

    for (let hour = branchHours.start; hour < branchHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotAppointments = getAppointmentsForSlot(currentDate, timeSlot);

        hours.push(
          <div
            key={timeSlot}
            className="flex border-b border-gray-100 min-h-[60px] hover:bg-gray-50"
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(currentDate, timeSlot);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-20 p-2 text-sm text-gray-500 border-r border-gray-100 flex-shrink-0">
              {format(new Date(`2000-01-01T${timeSlot}`), 'h:mm a')}
            </div>
            <div className="flex-1 p-1 space-y-1">
              {slotAppointments.map(apt => (
                <div
                  key={apt.id}
                  className={`p-2 rounded border cursor-pointer transition-all hover:shadow-md ${getStatusColor(apt.status)}`}
                  draggable={showDragDrop}
                  onDragStart={() => handleDragStart(apt)}
                  onClick={() => onAppointmentClick(apt)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span className="text-xs font-medium">{apt.customer}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {apt.service}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Scissors className="w-3 h-3" />
                    <span className="text-xs">{apt.barber}</span>
                    {apt.room && (
                      <>
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs">{apt.room}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="text-lg font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
          <p className="text-sm text-gray-600">
            {currentBranch !== 'all' ? branches.find(b => b.id === currentBranch)?.name : 'All Branches'} •
            {currentBarber !== 'all' ? barbers.find(b => b.id === currentBarber)?.name : 'All Barbers'}
          </p>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {hours}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const { start, end } = getDateRange();
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="text-lg font-semibold">
            {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
          </h3>
        </div>
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          {/* Header */}
          <div className="bg-gray-100 p-2 text-center font-medium text-sm">Time</div>
          {days.map(day => (
            <div key={day.toISOString()} className="bg-gray-100 p-2 text-center">
              <div className="font-medium text-sm">{format(day, 'EEE')}</div>
              <div className={`text-lg font-bold ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}

          {/* Time slots */}
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="contents">
              <div className="bg-white p-2 text-center text-xs text-gray-500 border-r">
                {format(new Date().setHours(hour, 0), 'h a')}
              </div>
              {days.map(day => {
                const dayAppointments = getAppointmentsForSlot(day).filter(apt => {
                  const aptHour = parseInt(apt.time.split(':')[0]);
                  return aptHour === hour;
                });

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="bg-white min-h-[40px] p-1 border-r border-b"
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(day, `${hour.toString().padStart(2, '0')}:00`);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {dayAppointments.slice(0, 2).map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded mb-1 cursor-pointer ${getStatusColor(apt.status)}`}
                        draggable={showDragDrop}
                        onDragStart={() => handleDragStart(apt)}
                        onClick={() => onAppointmentClick(apt)}
                      >
                        {apt.customer}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const { start, end } = getDateRange();
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h3>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Day headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-gray-100 p-2 text-center font-medium text-sm">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map(day => {
            const dayAppointments = getAppointmentsForSlot(day);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={day.toISOString()}
                className={`bg-white min-h-[120px] p-2 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday(day) ? 'bg-blue-50' : ''}`}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(day, '09:00'); // Default to 9 AM
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className={`font-medium text-sm mb-1 ${
                  isToday(day) ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map(apt => (
                    <div
                      key={apt.id}
                      className={`text-xs p-1 rounded cursor-pointer ${getStatusColor(apt.status)}`}
                      draggable={showDragDrop}
                      onDragStart={() => handleDragStart(apt)}
                      onClick={() => onAppointmentClick(apt)}
                    >
                      {apt.time} - {apt.customer}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayAppointments.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border">
            {(['day', 'week', 'month'] as const).map(mode => (
              <Button
                key={mode}
                variant={currentViewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentViewMode(mode)}
                className="rounded-none first:rounded-l-lg last:rounded-r-lg"
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Date Display */}
          <div className="text-lg font-semibold">
            {currentViewMode === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
            {currentViewMode === 'week' && `${format(getDateRange().start, 'MMM d')} - ${format(getDateRange().end, 'MMM d, yyyy')}`}
            {currentViewMode === 'month' && format(currentDate, 'MMMM yyyy')}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Filters */}
          <Select value={currentBranch} onValueChange={setCurrentBranch}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentBarber} onValueChange={setCurrentBarber}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Barber" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Barbers</SelectItem>
              {barbers.map(barber => (
                <SelectItem key={barber.id} value={barber.id}>
                  {barber.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {rooms.length > 0 && (
            <Select value={currentRoom} onValueChange={setCurrentRoom}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>

          {/* Settings */}
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4" />
          </Button>

          {/* Create Appointment */}
          <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
              </DialogHeader>
              {/* Appointment creation form would go here */}
              <div className="text-center py-8 text-gray-500">
                Appointment creation form coming soon...
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Calendar Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="drag-drop">Enable Drag & Drop</Label>
              <Switch
                id="drag-drop"
                checked={showDragDrop}
                onCheckedChange={() => {}} // Would connect to parent state
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <Switch id="auto-refresh" defaultChecked />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      <div className="bg-white rounded-lg border">
        {currentViewMode === 'day' && renderDayView()}
        {currentViewMode === 'week' && renderWeekView()}
        {currentViewMode === 'month' && renderMonthView()}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{selectedAppointment.customer}</p>
                </div>
                <div>
                  <Label>Service</Label>
                  <p className="font-medium">{selectedAppointment.service}</p>
                </div>
                <div>
                  <Label>Barber</Label>
                  <p className="font-medium">{selectedAppointment.barber}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <Label>Date & Time</Label>
                  <p className="font-medium">
                    {format(parseISO(selectedAppointment.date), 'PPP')} at {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p className="font-medium">{selectedAppointment.duration}</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <Label>Notes</Label>
                  <Textarea value={selectedAppointment.notes} readOnly className="mt-1" />
                </div>
              )}

              {selectedAppointment.serviceHistory && selectedAppointment.serviceHistory.length > 0 && (
                <div>
                  <Label>Service History</Label>
                  <div className="space-y-2 mt-1">
                    {selectedAppointment.serviceHistory.map((history, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{history.service}</span>
                        <span className="text-sm text-gray-500">{format(parseISO(history.date), 'PP')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                  Close
                </Button>
                <Button onClick={() => onAppointmentClick(selectedAppointment)}>
                  Edit Appointment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}