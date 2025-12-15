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
  staff: string;
  staffAvatar?: string;
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
  onCreateBooking?: (staff: string, date: string, time: string) => void;
}

export function AdvancedCalendar({ appointments, onAppointmentClick, onStatusChange, onCreateBooking }: AdvancedCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [timeSlotGap, setTimeSlotGap] = useState(30); // minutes - default to 30 min
  const [layoutMode, setLayoutMode] = useState<'time-top' | 'employee-top'>('time-top');
  const [businessHours, setBusinessHours] = useState({ start: 9, end: 18 });
  const [hiddenHours, setHiddenHours] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Get unique staffs from appointments
  const staffs = Array.from(new Set(appointments.map(apt => apt.staff)));

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

  // Filter appointments for selected date and staff
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = parseISO(apt.date);
    const isSameDate = isSameDay(aptDate, selectedDate);
    const isSameStaff = selectedStaff === 'all' || apt.staff === selectedStaff;
    return isSameDate && isSameStaff;
  });

  // Get appointment for specific time slot and staff (considering duration)
  const getAppointmentForSlot = (timeSlot: string, staff: string) => {
    return filteredAppointments.find(apt => {
      if (apt.staff !== staff) return false;

      // Parse appointment time and duration
      const aptTime = apt.time;
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
  const getMainAppointmentForSlot = (timeSlot: string, staff: string) => {
    return filteredAppointments.find(apt => {
      if (apt.staff !== staff) return false;
      return apt.time === timeSlot;
    });
  };

  // Check if slot is part of a multi-slot appointment
  const isSlotPartOfAppointment = (timeSlot: string, staff: string) => {
    return !!getAppointmentForSlot(timeSlot, staff);
  };

  // Check if slot is the starting slot of an appointment
  const isStartingSlot = (timeSlot: string, staff: string) => {
    const appointment = getMainAppointmentForSlot(timeSlot, staff);
    return !!appointment;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500";
      case "completed": return "bg-emerald-600";
      case "in-progress": return "bg-blue-500";
      case "scheduled": return "bg-yellow-500";
      case "approved": return "bg-purple-500";
      case "pending": return "bg-orange-500";
      case "cancelled": return "bg-red-500";
      case "rejected": return "bg-gray-500";
      case "no-show": return "bg-red-700";
      case "rescheduled": return "bg-indigo-500";
      case "waiting": return "bg-amber-400";
      case "arrived": return "bg-cyan-500";
      default: return "bg-gray-300";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-700";
      case "completed": return "text-emerald-700";
      case "in-progress": return "text-blue-700";
      case "scheduled": return "text-yellow-700";
      case "approved": return "text-purple-700";
      case "pending": return "text-orange-700";
      case "cancelled": return "text-red-700";
      case "rejected": return "text-gray-700";
      case "no-show": return "text-red-800";
      case "rescheduled": return "text-indigo-700";
      case "waiting": return "text-amber-700";
      case "arrived": return "text-cyan-700";
      default: return "text-gray-700";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-50 border-green-200";
      case "completed": return "bg-emerald-50 border-emerald-200";
      case "in-progress": return "bg-blue-50 border-blue-200";
      case "scheduled": return "bg-yellow-50 border-yellow-200";
      case "approved": return "bg-purple-50 border-purple-200";
      case "pending": return "bg-orange-50 border-orange-200";
      case "cancelled": return "bg-red-50 border-red-200";
      case "rejected": return "bg-gray-50 border-gray-200";
      case "no-show": return "bg-red-100 border-red-300";
      case "rescheduled": return "bg-indigo-50 border-indigo-200";
      case "waiting": return "bg-amber-50 border-amber-200";
      case "arrived": return "bg-cyan-50 border-cyan-200";
      default: return "bg-gray-50 border-gray-200";
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
    <Card className="w-full max-h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-4 h-4" />
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

              {/* Staff Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filter Staff</Label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    {staffs.map(staff => (
                      <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      {/* Status Legend */}
      <div className="px-6 pb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-medium text-gray-700">Status Legend:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-gray-600">Approved</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Cancelled</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-700"></div>
            <span className="text-gray-600">No Show</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-gray-600">Rescheduled</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <span className="text-gray-600">Waiting</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-gray-600">Arrived</span>
          </div>
        </div>
      </div>

      <CardContent className="p-0 overflow-hidden h-[500px]">
        <div className="h-full overflow-x-auto overflow-y-auto w-full bg-background">
          <div className="min-w-full" style={{ width: 'max-content', minHeight: '100%' }}>
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

                {/* Staff rows */}
                {(selectedStaff === 'all' ? staffs : [selectedStaff]).map(staff => {
                  const staffAppointments = appointments.filter(apt => apt.staff === staff);
                  const staffAvatar = staffAppointments[0]?.staffAvatar || '/api/placeholder/32/32';

                  return (
                    <div key={staff} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `clamp(120px, 15vw, 200px) repeat(${timeSlots.length}, minmax(50px, 1fr))` }}>
                      <div className="p-2 sm:p-3 bg-muted rounded flex items-center gap-2 sticky left-0 border-r" style={{ minWidth: 'clamp(120px, 15vw, 200px)' }}>
                        <img
                          src={staffAvatar}
                          alt={staff}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/32/32';
                          }}
                        />
                        <span className="font-medium text-xs sm:text-sm truncate">{staff}</span>
                      </div>
                      {timeSlots.map(slot => {
                        const appointment = getAppointmentForSlot(slot, staff);
                        const isStarting = isStartingSlot(slot, staff);
                        const isPartOfAppointment = isSlotPartOfAppointment(slot, staff);

                        return (
                          <div
                            key={`${staff}-${slot}`}
                            className={`p-1 border rounded cursor-pointer hover:shadow-md transition-all duration-200 min-h-[60px] flex items-center justify-center ${
                              isPartOfAppointment
                                ? `${getStatusBgColor(appointment?.status || 'scheduled')} border-2`
                                : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 bg-gray-50/50'
                            }`}
                            onClick={() => appointment && onAppointmentClick(appointment)}
                          >
                            {isStarting && appointment ? (
                              <div className="w-full h-full flex flex-col items-center justify-center text-xs p-1">
                                <div className={`w-3 h-3 rounded-full mb-1 ${getStatusColor(appointment.status)} shadow-sm`} />
                                <div className={`font-medium truncate w-full text-center leading-tight ${getStatusTextColor(appointment.status)}`}>
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
                                  onCreateBooking && onCreateBooking(staff, format(selectedDate, 'yyyy-MM-dd'), slot);
                                }}
                              >
                                + Book
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            ) : (
              // Employees on top, Time on left (rotated layout)
              <>
                {/* Header with staffs */}
                <div className="grid gap-1 mb-2 sticky top-0 bg-background z-10" style={{ gridTemplateColumns: `clamp(120px, 15vw, 150px) 1fr` }}>
                  <div className="p-2 font-medium text-sm text-muted-foreground">
                    Time / Employee
                  </div>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${(selectedStaff === 'all' ? staffs : [selectedStaff]).length}, minmax(80px, 1fr))` }}>
                    {(selectedStaff === 'all' ? staffs : [selectedStaff]).map(staff => {
                      const staffAppointments = appointments.filter(apt => apt.staff === staff);
                      const staffAvatar = staffAppointments[0]?.staffAvatar || '/api/placeholder/32/32';

                      return (
                        <div key={staff} className="p-2 text-xs text-center font-medium text-muted-foreground border rounded bg-muted/50 flex flex-col items-center justify-center gap-1">
                          <img
                            src={staffAvatar}
                            alt={staff}
                            className="w-6 h-6 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/32/32';
                            }}
                          />
                          <span className="hidden sm:inline">{staff}</span>
                          <span className="sm:hidden">{staff.split(' ')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time rows */}
                {timeSlots.map(slot => (
                  <div key={slot} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `clamp(120px, 15vw, 150px) 1fr` }}>
                    <div className="p-2 sm:p-3 bg-muted rounded flex items-center gap-2 sticky left-0" style={{ minWidth: 'clamp(120px, 15vw, 150px)' }}>
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium text-xs sm:text-sm">{slot}</span>
                    </div>
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${(selectedStaff === 'all' ? staffs : [selectedStaff]).length}, minmax(60px, 1fr))` }}>
                      {(selectedStaff === 'all' ? staffs : [selectedStaff]).map(staff => {
                        const appointment = getAppointmentForSlot(slot, staff);
                        const isStarting = isStartingSlot(slot, staff);
                        const isPartOfAppointment = isSlotPartOfAppointment(slot, staff);

                        return (
                          <div
                            key={`${slot}-${staff}`}
                            className={`p-1 border rounded cursor-pointer hover:shadow-md transition-all duration-200 min-h-[80px] flex items-center justify-center ${
                              isPartOfAppointment
                                ? `${getStatusBgColor(appointment?.status || 'scheduled')} border-2`
                                : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 bg-gray-50/50'
                            }`}
                            onClick={() => appointment && onAppointmentClick(appointment)}
                          >
                            {isStarting && appointment ? (
                              <div className="w-full h-full flex flex-col items-center justify-center text-xs p-1">
                                <div className={`w-3 h-3 rounded-full mb-1 ${getStatusColor(appointment.status)} shadow-sm`} />
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
                                  onCreateBooking && onCreateBooking(staff, format(selectedDate, 'yyyy-MM-dd'), slot);
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
      </CardContent>

      {/* Legend and Info */}
      <div className="px-6 py-4 border-t border-gray-100 bg-muted/30 text-xs text-gray-600">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
              <span>Starting slot</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span>Continuation slot</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-dashed border-gray-400 rounded"></div>
              <span>Available slot</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} for {format(selectedDate, 'MMM dd, yyyy')}
          </div>
        </div>
      </div>
    </Card>
  );
}