'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Settings, RotateCcw, Grid3X3 } from "lucide-react";
import { format, addDays, startOfDay, addMinutes, isSameDay, parseISO } from "date-fns";

interface Appointment {
  id: number;
  customer: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: string;
  phone: string;
  email: string;
  notes: string;
  source: string;
  branch: string;
  createdAt: string;
  updatedAt: string;
}

interface AdvancedCalendarProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onStatusChange: (appointmentId: number, newStatus: string) => void;
  onCreateBooking?: (barber: string, date: string, time: string) => void;
}

export function AdvancedCalendar({ appointments, onAppointmentClick, onStatusChange, onCreateBooking }: AdvancedCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBarber, setSelectedBarber] = useState<string>('all');
  const [timeSlotGap, setTimeSlotGap] = useState(30); // minutes - default to 30 min
  const [layoutMode, setLayoutMode] = useState<'time-top' | 'employee-top'>('time-top'); // New layout toggle
  const [businessHours, setBusinessHours] = useState({ start: 9, end: 18 }); // 9 AM to 6 PM
  const [hiddenHours, setHiddenHours] = useState<number[]>([]); // Hours to hide
  const [showSettings, setShowSettings] = useState(false);

  // Get unique barbers from appointments
  const barbers = Array.from(new Set(appointments.map(apt => apt.barber)));

  // Generate time slots based on business hours, gap, and hidden hours
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = new Date(selectedDate);
    startTime.setHours(businessHours.start, 0, 0, 0);

    const endTime = new Date(selectedDate);
    endTime.setHours(businessHours.end, 0, 0, 0);

    let currentTime = startTime;
    while (currentTime < endTime) {
      const hour = currentTime.getHours();
      if (!hiddenHours.includes(hour)) {
        slots.push(format(currentTime, 'HH:mm'));
      }
      currentTime = addMinutes(currentTime, timeSlotGap);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Filter appointments for selected date and barber
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = parseISO(apt.date);
    const isSameDate = isSameDay(aptDate, selectedDate);
    const isSameBarber = selectedBarber === 'all' || apt.barber === selectedBarber;
    return isSameDate && isSameBarber;
  });

  // Get appointment for specific time slot and barber (considering duration)
  const getAppointmentForSlot = (timeSlot: string, barber: string) => {
    return filteredAppointments.find(apt => {
      if (apt.barber !== barber) return false;

      // Parse appointment time and duration
      const aptTime = apt.time; // e.g., "10:00"
      const durationMatch = apt.duration.match(/(\d+)/);
      const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : timeSlotGap;

      // Calculate how many slots this appointment spans
      const aptStartTime = new Date(`2000-01-01T${aptTime}`);
      const slotTime = new Date(`2000-01-01T${timeSlot}`);
      const aptEndTime = addMinutes(aptStartTime, durationMinutes);

      // Check if current slot falls within appointment time range
      return slotTime >= aptStartTime && slotTime < aptEndTime;
    });
  };

  // Get the main appointment (starting slot) for display purposes
  const getMainAppointmentForSlot = (timeSlot: string, barber: string) => {
    return filteredAppointments.find(apt => {
      if (apt.barber !== barber) return false;
      return apt.time === timeSlot;
    });
  };

  // Check if slot is part of a multi-slot appointment
  const isSlotPartOfAppointment = (timeSlot: string, barber: string) => {
    return !!getAppointmentForSlot(timeSlot, barber);
  };

  // Check if slot is the starting slot of an appointment
  const isStartingSlot = (timeSlot: string, barber: string) => {
    const appointment = getMainAppointmentForSlot(timeSlot, barber);
    return !!appointment;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "scheduled": return "bg-yellow-500";
      case "approved": return "bg-purple-500";
      case "pending": return "bg-orange-500";
      case "cancelled": return "bg-red-500";
      case "rejected": return "bg-gray-500";
      default: return "bg-gray-300";
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next'
      ? addDays(selectedDate, 1)
      : addDays(selectedDate, -1);
    setSelectedDate(newDate);
  };

  const toggleHiddenHour = (hour: number) => {
    setHiddenHours(prev =>
      prev.includes(hour)
        ? prev.filter(h => h !== hour)
        : [...prev, hour]
    );
  };

  const resetHiddenHours = () => {
    setHiddenHours([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Advanced Booking Calendar
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {/* Layout Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={layoutMode === 'time-top' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayoutMode('time-top')}
                className="flex items-center gap-1"
              >
                <Grid3X3 className="w-4 h-4" />
                Time Top
              </Button>
              <Button
                variant={layoutMode === 'employee-top' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayoutMode('employee-top')}
                className="flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Employee Top
              </Button>
            </div>

            {/* Time Gap Selector */}
            <Select value={timeSlotGap.toString()} onValueChange={(value) => setTimeSlotGap(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>

            {/* Settings Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>

            {/* Date Navigation */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium min-w-[120px] text-center px-2">
                {format(selectedDate, 'MMM dd, yyyy')}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Business Hours */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Business Hours</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={businessHours.start.toString()}
                    onValueChange={(value) => setBusinessHours(prev => ({ ...prev, start: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 6).map(hour => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select
                    value={businessHours.end.toString()}
                    onValueChange={(value) => setBusinessHours(prev => ({ ...prev, end: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 12).map(hour => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Hidden Hours */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Hidden Hours</Label>
                  <Button variant="ghost" size="sm" onClick={resetHiddenHours}>
                    Reset
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: businessHours.end - businessHours.start }, (_, i) => businessHours.start + i).map(hour => (
                    <Button
                      key={hour}
                      variant={hiddenHours.includes(hour) ? "destructive" : "outline"}
                      size="sm"
                      className="w-12 h-8 text-xs"
                      onClick={() => toggleHiddenHour(hour)}
                    >
                      {hour > 12 ? `${hour - 12}P` : `${hour}A`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Barber Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filter Barber</Label>
                <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Barber" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Barbers</SelectItem>
                    {barbers.map(barber => (
                      <SelectItem key={barber} value={barber}>{barber}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] sm:max-h-[600px] w-full">
          <div className="min-w-full" style={{ width: 'max-content' }}>
            {layoutMode === 'time-top' ? (
              // Time on top, Employees on left (current layout)
              <>
                {/* Header with time slots */}
                <div className="grid gap-1 mb-2 sticky top-0 bg-background z-10 border-b pb-2" style={{ gridTemplateColumns: `clamp(120px, 15vw, 200px) repeat(${timeSlots.length}, minmax(50px, 1fr))` }}>
                  <div className="p-2 font-medium text-sm text-muted-foreground sticky left-0 bg-background">
                    Employee / Time
                  </div>
                  {timeSlots.map(slot => (
                    <div key={slot} className="p-1 text-xs text-center font-medium text-muted-foreground border rounded bg-muted/50 min-w-[50px]">
                      {slot}
                    </div>
                  ))}
                </div>

                {/* Barber rows */}
                {(selectedBarber === 'all' ? barbers : [selectedBarber]).map(barber => (
                  <div key={barber} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `clamp(120px, 15vw, 200px) repeat(${timeSlots.length}, minmax(50px, 1fr))` }}>
                    <div className="p-2 sm:p-3 bg-muted rounded flex items-center gap-2 sticky left-0 border-r" style={{ minWidth: 'clamp(120px, 15vw, 200px)' }}>
                      <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm truncate">{barber}</span>
                    </div>
                    {timeSlots.map(slot => {
                      const appointment = getAppointmentForSlot(slot, barber);
                      const isStarting = isStartingSlot(slot, barber);
                      const isPartOfAppointment = isSlotPartOfAppointment(slot, barber);

                      return (
                        <div
                          key={`${barber}-${slot}`}
                          className={`p-1 border rounded cursor-pointer hover:shadow-md transition-all duration-200 min-h-[60px] flex items-center justify-center ${
                            isPartOfAppointment
                              ? `border-2 border-primary/50 ${getStatusColor(appointment?.status || 'scheduled')}/20`
                              : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
                          }`}
                          onClick={() => appointment && onAppointmentClick(appointment)}
                        >
                          {isStarting && appointment ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-xs p-1">
                              <div className={`w-3 h-3 rounded-full mb-1 ${getStatusColor(appointment.status)}`} />
                              <div className="font-medium truncate w-full text-center leading-tight">
                                {appointment.customer.split(' ')[0]}
                              </div>
                              <div className="text-muted-foreground truncate w-full text-center text-[10px] leading-tight">
                                {appointment.service}
                              </div>
                              <div className="text-muted-foreground text-[9px] mt-1">
                                {appointment.duration}
                              </div>
                            </div>
                          ) : isPartOfAppointment ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(appointment?.status || 'scheduled')}`} />
                            </div>
                          ) : (
                            <div
                              className="text-muted-foreground/50 text-xs text-center cursor-pointer hover:text-primary transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCreateBooking && onCreateBooking(barber, format(selectedDate, 'yyyy-MM-dd'), slot);
                              }}
                            >
                              + Book
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : (
              // Employees on top, Time on left (rotated layout)
              <>
                {/* Header with barbers */}
                <div className="grid gap-1 mb-2 sticky top-0 bg-background z-10" style={{ gridTemplateColumns: `clamp(120px, 15vw, 150px) 1fr` }}>
                  <div className="p-2 font-medium text-sm text-muted-foreground">
                    Time / Employee
                  </div>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${(selectedBarber === 'all' ? barbers : [selectedBarber]).length}, minmax(80px, 1fr))` }}>
                    {(selectedBarber === 'all' ? barbers : [selectedBarber]).map(barber => (
                      <div key={barber} className="p-2 text-xs text-center font-medium text-muted-foreground border rounded bg-muted/50 flex items-center justify-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="hidden sm:inline">{barber}</span>
                        <span className="sm:hidden">{barber.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time rows */}
                {timeSlots.map(slot => (
                  <div key={slot} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `clamp(120px, 15vw, 150px) 1fr` }}>
                    <div className="p-2 sm:p-3 bg-muted rounded flex items-center gap-2 sticky left-0" style={{ minWidth: 'clamp(120px, 15vw, 150px)' }}>
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium text-xs sm:text-sm">{slot}</span>
                    </div>
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${(selectedBarber === 'all' ? barbers : [selectedBarber]).length}, minmax(60px, 1fr))` }}>
                      {(selectedBarber === 'all' ? barbers : [selectedBarber]).map(barber => {
                        const appointment = getAppointmentForSlot(slot, barber);
                        const isStarting = isStartingSlot(slot, barber);
                        const isPartOfAppointment = isSlotPartOfAppointment(slot, barber);

                        return (
                          <div
                            key={`${slot}-${barber}`}
                            className={`p-1 border rounded cursor-pointer hover:shadow-md transition-all duration-200 min-h-[80px] flex items-center justify-center ${
                              isPartOfAppointment
                                ? `border-2 border-primary/50 ${getStatusColor(appointment?.status || 'scheduled')}/20`
                                : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
                            }`}
                            onClick={() => appointment && onAppointmentClick(appointment)}
                          >
                            {isStarting && appointment ? (
                              <div className="w-full h-full flex flex-col items-center justify-center text-xs p-1">
                                <div className={`w-3 h-3 rounded-full mb-1 ${getStatusColor(appointment.status)}`} />
                                <div className="font-medium truncate w-full text-center leading-tight">
                                  {appointment.customer.split(' ')[0]}
                                </div>
                                <div className="text-muted-foreground truncate w-full text-center text-[10px] leading-tight">
                                  {appointment.service}
                                </div>
                                <div className="text-muted-foreground text-[9px] mt-1">
                                  {appointment.duration}
                                </div>
                              </div>
                            ) : isPartOfAppointment ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(appointment?.status || 'scheduled')}`} />
                              </div>
                            ) : (
                              <div
                                className="text-muted-foreground/50 text-xs text-center cursor-pointer hover:text-primary transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCreateBooking && onCreateBooking(barber, format(selectedDate, 'yyyy-MM-dd'), slot);
                                }}
                              >
                                + Book
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Legend and Info */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Cancelled/Rejected</span>
              </div>
              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Duration slots</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Gap: {timeSlotGap}min</span>
                <span>Hours: {businessHours.start > 12 ? `${businessHours.start - 12}PM` : `${businessHours.start}AM`} - {businessHours.end > 12 ? `${businessHours.end - 12}PM` : `${businessHours.end}AM`}</span>
                <span>Layout: {layoutMode === 'time-top' ? 'Time → Employees' : 'Employees → Time'}</span>
              </div>
            </div>
          </div>

          {/* Mobile responsiveness note */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            💡 <strong>Duration Highlighting:</strong> Booked services span multiple time slots based on their duration (e.g., 60min service occupies 2x 30min slots). The starting slot shows full details, while subsequent slots show status indicators.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}