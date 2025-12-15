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
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Calendar,
  Repeat,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  Scissors,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  CalendarDays,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  parseISO,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getDay,
  setDay,
  addYears
} from "date-fns";

export interface RecurringAppointment {
  id: string;
  baseAppointmentId: number;
  customer: string;
  service: string;
  staff: string;
  room?: string;
  pattern: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number; // every N days/weeks/months
    daysOfWeek?: number[]; // 0-6, Sunday = 0
    dayOfMonth?: number; // 1-31
    weekOfMonth?: number; // 1-4, -1 for last
    monthInterval?: number; // every N months
  };
  startDate: string;
  endDate: string;
  time: string;
  duration: string;
  bufferTime?: number;
  price: number;
  instances: RecurringInstance[];
  isActive: boolean;
  autoConfirm: boolean;
  maxOccurrences?: number;
  currentOccurrences: number;
  exceptions: RecurringException[];
  createdAt: string;
  updatedAt: string;
}

export interface RecurringInstance {
  id: string;
  recurringAppointmentId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  actualStartTime?: string;
  actualEndTime?: string;
}

export interface RecurringException {
  id: string;
  recurringAppointmentId: string;
  originalDate: string;
  action: 'skip' | 'reschedule' | 'modify';
  newDate?: string;
  newTime?: string;
  reason: string;
  createdAt: string;
}

interface RecurringAppointmentsManagerProps {
  recurringAppointments: RecurringAppointment[];
  services: Array<{ id: string; name: string; duration: number; bufferTime: number; price: number }>;
  staffs: Array<{ id: string; name: string; specialties: string[]; branchId: string }>;
  rooms: Array<{ id: string; name: string; type: string; branchId: string }>;
  branches: Array<{ id: string; name: string; location: string }>;
  onRecurringCreate: (recurring: Omit<RecurringAppointment, 'id' | 'instances' | 'exceptions' | 'currentOccurrences' | 'createdAt' | 'updatedAt'>) => void;
  onRecurringUpdate: (recurringId: string, updates: Partial<RecurringAppointment>) => void;
  onRecurringDelete: (recurringId: string) => void;
  onInstanceUpdate: (instanceId: string, updates: Partial<RecurringInstance>) => void;
  onExceptionCreate: (exception: Omit<RecurringException, 'id' | 'createdAt'>) => void;
  selectedDate?: Date;
}

export function RecurringAppointmentsManager({
  recurringAppointments,
  services,
  staffs,
  rooms,
  branches,
  onRecurringCreate,
  onRecurringUpdate,
  onRecurringDelete,
  onInstanceUpdate,
  onExceptionCreate,
  selectedDate = new Date()
}: RecurringAppointmentsManagerProps) {
  const [selectedRecurring, setSelectedRecurring] = useState<RecurringAppointment | null>(null);
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [showInstanceDialog, setShowInstanceDialog] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringAppointment | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<RecurringInstance | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'instances'>('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Recurring form state
  const [recurringForm, setRecurringForm] = useState({
    baseAppointmentId: '',
    customer: '',
    service: '',
    staff: '',
    room: 'none',
    pattern: {
      frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'custom',
      interval: 1,
      daysOfWeek: [1], // Monday
      dayOfMonth: 1,
      weekOfMonth: 1,
      monthInterval: 1
    },
    startDate: format(selectedDate, 'yyyy-MM-dd'),
    endDate: format(addMonths(selectedDate, 3), 'yyyy-MM-dd'),
    time: '09:00',
    duration: '60',
    bufferTime: 15,
    price: 0,
    isActive: true,
    autoConfirm: false,
    maxOccurrences: 12
  });

  // Instance form state
  const [instanceForm, setInstanceForm] = useState({
    date: '',
    time: '',
    status: 'scheduled' as const,
    notes: ''
  });

  // Reset forms
  const resetRecurringForm = () => {
    setRecurringForm({
      baseAppointmentId: '',
      customer: '',
      service: '',
      staff: '',
      room: 'none',
      pattern: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [1],
        dayOfMonth: 1,
        weekOfMonth: 1,
        monthInterval: 1
      },
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      endDate: format(addMonths(selectedDate, 3), 'yyyy-MM-dd'),
      time: '09:00',
      duration: '60',
      bufferTime: 15,
      price: 0,
      isActive: true,
      autoConfirm: false,
      maxOccurrences: 12
    });
  };

  // Generate recurring instances preview
  const generateInstancesPreview = (pattern: typeof recurringForm.pattern, startDate: string, endDate: string, maxOccurrences?: number) => {
    const instances: Array<{ date: string; time: string }> = [];
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    let current = start;
    let count = 0;

    while (current <= end && (!maxOccurrences || count < maxOccurrences)) {
      switch (pattern.frequency) {
        case 'daily':
          if (count % pattern.interval === 0) {
            instances.push({
              date: format(current, 'yyyy-MM-dd'),
              time: recurringForm.time
            });
          }
          current = addDays(current, 1);
          break;

        case 'weekly':
          if (pattern.daysOfWeek?.includes(getDay(current))) {
            instances.push({
              date: format(current, 'yyyy-MM-dd'),
              time: recurringForm.time
            });
            count++;
          }
          // Move to next week if we've processed all days this week
          const nextWeek = addWeeks(startOfWeek(current, { weekStartsOn: 1 }), pattern.interval);
          if (current >= endOfWeek(current, { weekStartsOn: 1 })) {
            current = nextWeek;
          } else {
            current = addDays(current, 1);
          }
          break;

        case 'monthly':
          if (pattern.dayOfMonth && getDay(current) === pattern.dayOfMonth - 1) {
            instances.push({
              date: format(current, 'yyyy-MM-dd'),
              time: recurringForm.time
            });
            count++;
          }
          current = addDays(current, 1);
          break;

        default:
          current = addDays(current, 1);
      }

      count++;
      if (instances.length >= 20) break; // Limit preview
    }

    return instances;
  };

  // Filter recurring appointments
  const filteredRecurring = recurringAppointments.filter(recurring => {
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && recurring.isActive) ||
      (filterStatus === 'inactive' && !recurring.isActive);
    const matchesSearch = searchQuery === '' ||
      recurring.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recurring.service.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Handle recurring creation
  const handleRecurringCreate = () => {
    if (!recurringForm.customer || !recurringForm.service || !recurringForm.staff) return;

    const service = services.find(s => s.id === recurringForm.service);
    if (service) {
      setRecurringForm(prev => ({
        ...prev,
        duration: service.duration.toString(),
        price: service.price,
        bufferTime: service.bufferTime
      }));
    }

    onRecurringCreate({
      ...recurringForm,
      room: recurringForm.room === 'none' ? '' : recurringForm.room,
      baseAppointmentId: recurringForm.baseAppointmentId ? parseInt(recurringForm.baseAppointmentId) : 0
    });

    resetRecurringForm();
    setShowRecurringDialog(false);
  };

  // Handle recurring update
  const handleRecurringUpdate = () => {
    if (!editingRecurring) return;

    onRecurringUpdate(editingRecurring.id, {
      ...recurringForm,
      room: recurringForm.room === 'none' ? '' : recurringForm.room,
      baseAppointmentId: recurringForm.baseAppointmentId ? parseInt(recurringForm.baseAppointmentId) : 0
    });
    setEditingRecurring(null);
    setShowRecurringDialog(false);
  };

  // Get frequency description
  const getFrequencyDescription = (pattern: typeof recurringForm.pattern) => {
    switch (pattern.frequency) {
      case 'daily':
        return `Every ${pattern.interval} day${pattern.interval > 1 ? 's' : ''}`;
      case 'weekly':
        const days = pattern.daysOfWeek?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || '';
        return `Every ${pattern.interval} week${pattern.interval > 1 ? 's' : ''} on ${days}`;
      case 'monthly':
        return `Every ${pattern.interval} month${pattern.interval > 1 ? 's' : ''} on day ${pattern.dayOfMonth}`;
      default:
        return 'Custom schedule';
    }
  };

  // Render list view
  const renderListView = () => (
    <div className="space-y-4">
      {filteredRecurring.map(recurring => (
        <Card key={recurring.id} className="cursor-pointer hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-lg">{recurring.customer}</h3>
                    <p className="text-sm text-gray-600">{recurring.service}</p>
                  </div>
                </div>
                <Badge variant={recurring.isActive ? "default" : "secondary"}>
                  {recurring.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{getFrequencyDescription(recurring.pattern as any)}</p>
                  <p className="text-xs text-gray-500">
                    {recurring.currentOccurrences} / {recurring.maxOccurrences || '∞'} occurrences
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRecurring(recurring);
                      setViewMode('instances');
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRecurring(recurring);
                      setRecurringForm({
                        baseAppointmentId: recurring.baseAppointmentId?.toString() || '',
                        customer: recurring.customer,
                        service: recurring.service,
                        staff: recurring.staff,
                        room: recurring.room || 'none',
                        pattern: { ...recurring.pattern } as any,
                        startDate: recurring.startDate,
                        endDate: recurring.endDate,
                        time: recurring.time,
                        duration: recurring.duration,
                        bufferTime: recurring.bufferTime || 15,
                        price: recurring.price,
                        isActive: recurring.isActive,
                        autoConfirm: recurring.autoConfirm,
                        maxOccurrences: recurring.maxOccurrences || 0
                      });
                      setShowRecurringDialog(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRecurringDelete(recurring.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Staff:</span>
                <p className="font-medium">{recurring.staff}</p>
              </div>
              <div>
                <span className="text-gray-500">Time:</span>
                <p className="font-medium">{recurring.time}</p>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <p className="font-medium">{recurring.duration}</p>
              </div>
              <div>
                <span className="text-gray-500">Price:</span>
                <p className="font-medium">${recurring.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">Period:</span>
                <span className="ml-1">
                  {format(parseISO(recurring.startDate), 'MMM d, yyyy')} - {format(parseISO(recurring.endDate), 'MMM d, yyyy')}
                </span>
              </div>
              {recurring.room && (
                <div>
                  <span className="text-gray-500">Room:</span>
                  <span className="ml-1">{recurring.room}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render instances view
  const renderInstancesView = () => {
    if (!selectedRecurring) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setSelectedRecurring(null)}>
              ← Back to Recurring
            </Button>
            <h2 className="text-xl font-semibold">{selectedRecurring.customer} - Recurring Instances</h2>
          </div>
          <Button onClick={() => setShowInstanceDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Instance
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Instances</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedRecurring.instances
                  .filter(instance => parseISO(instance.date) >= new Date())
                  .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                  .map(instance => (
                    <TableRow key={instance.id}>
                      <TableCell>{format(parseISO(instance.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{instance.time}</TableCell>
                      <TableCell>
                        <Badge variant={
                          instance.status === 'completed' ? 'default' :
                          instance.status === 'confirmed' ? 'secondary' :
                          instance.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {instance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{instance.notes || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInstance(instance);
                              setInstanceForm({
                                date: instance.date,
                                time: instance.time,
                                status: instance.status as any,
                                notes: instance.notes || ''
                              });
                              setShowInstanceDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onExceptionCreate({
                              recurringAppointmentId: selectedRecurring.id,
                              originalDate: instance.date,
                              action: 'skip',
                              reason: 'Manual skip'
                            })}
                          >
                            Skip
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recurring Appointments</h1>
          <p className="text-gray-600">Manage recurring bookings and their instances</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            Calendar View
          </Button>
          <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetRecurringForm}>
                <Plus className="w-4 h-4 mr-2" />
                New Recurring
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRecurring ? 'Edit Recurring Appointment' : 'Create Recurring Appointment'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer">Customer Name</Label>
                    <Input
                      id="customer"
                      value={recurringForm.customer}
                      onChange={(e) => setRecurringForm(prev => ({ ...prev, customer: e.target.value }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="service">Service</Label>
                    <Select
                      value={recurringForm.service}
                      onValueChange={(value) => {
                        setRecurringForm(prev => ({ ...prev, service: value }));
                        const service = services.find(s => s.id === value);
                        if (service) {
                          setRecurringForm(prev => ({
                            ...prev,
                            duration: service.duration.toString(),
                            price: service.price,
                            bufferTime: service.bufferTime
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - ${service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="staff">Staff</Label>
                    <Select
                      value={recurringForm.staff}
                      onValueChange={(value) => setRecurringForm(prev => ({ ...prev, staff: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffs.map(staff => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="room">Room (Optional)</Label>
                    <Select
                      value={recurringForm.room}
                      onValueChange={(value) => setRecurringForm(prev => ({ ...prev, room: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No specific room</SelectItem>
                        {rooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pattern Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Repeat className="w-5 h-5" />
                      Recurrence Pattern
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select
                          value={recurringForm.pattern.frequency}
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'custom') => setRecurringForm(prev => ({
                            ...prev,
                            pattern: { ...prev.pattern, frequency: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="interval">Every</Label>
                        <Input
                          id="interval"
                          type="number"
                          min="1"
                          value={recurringForm.pattern.interval}
                          onChange={(e) => setRecurringForm(prev => ({
                            ...prev,
                            pattern: { ...prev.pattern, interval: parseInt(e.target.value) || 1 }
                          }))}
                        />
                      </div>
                    </div>

                    {recurringForm.pattern.frequency === 'weekly' && (
                      <div>
                        <Label>Days of Week</Label>
                        <div className="flex gap-2 mt-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                            <Button
                              key={day}
                              variant={recurringForm.pattern.daysOfWeek?.includes(index) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const days = recurringForm.pattern.daysOfWeek || [];
                                const newDays = days.includes(index)
                                  ? days.filter(d => d !== index)
                                  : [...days, index];
                                setRecurringForm(prev => ({
                                  ...prev,
                                  pattern: { ...prev.pattern, daysOfWeek: newDays }
                                }));
                              }}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {recurringForm.pattern.frequency === 'monthly' && (
                      <div>
                        <Label htmlFor="day-of-month">Day of Month</Label>
                        <Input
                          id="day-of-month"
                          type="number"
                          min="1"
                          max="31"
                          value={recurringForm.pattern.dayOfMonth}
                          onChange={(e) => setRecurringForm(prev => ({
                            ...prev,
                            pattern: { ...prev.pattern, dayOfMonth: parseInt(e.target.value) || 1 }
                          }))}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Schedule Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={recurringForm.startDate}
                      onChange={(e) => setRecurringForm(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={recurringForm.endDate}
                      onChange={(e) => setRecurringForm(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={recurringForm.time}
                      onChange={(e) => setRecurringForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-occurrences">Max Occurrences</Label>
                    <Input
                      id="max-occurrences"
                      type="number"
                      min="1"
                      value={recurringForm.maxOccurrences}
                      onChange={(e) => setRecurringForm(prev => ({ ...prev, maxOccurrences: parseInt(e.target.value) || 12 }))}
                    />
                  </div>
                </div>

                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">
                      {getFrequencyDescription(recurringForm.pattern)}
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {generateInstancesPreview(recurringForm.pattern, recurringForm.startDate, recurringForm.endDate, recurringForm.maxOccurrences)
                        .slice(0, 10)
                        .map((instance, index) => (
                          <div key={index} className="text-sm text-gray-500">
                            {format(parseISO(instance.date), 'MMM d, yyyy')} at {instance.time}
                          </div>
                        ))}
                    </div>
                    {generateInstancesPreview(recurringForm.pattern, recurringForm.startDate, recurringForm.endDate, recurringForm.maxOccurrences).length > 10 && (
                      <p className="text-sm text-gray-500 mt-2">
                        ... and {generateInstancesPreview(recurringForm.pattern, recurringForm.startDate, recurringForm.endDate, recurringForm.maxOccurrences).length - 10} more
                      </p>
                    )}
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-confirm"
                      checked={recurringForm.autoConfirm}
                      onCheckedChange={(checked) => setRecurringForm(prev => ({ ...prev, autoConfirm: checked }))}
                    />
                    <Label htmlFor="auto-confirm">Auto-confirm instances</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowRecurringDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingRecurring ? handleRecurringUpdate : handleRecurringCreate}>
                      {editingRecurring ? 'Update Recurring' : 'Create Recurring'}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <Label>Status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Input
            placeholder="Search recurring appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'instances' && renderInstancesView()}

      {/* Instance Dialog */}
      <Dialog open={showInstanceDialog} onOpenChange={setShowInstanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedInstance ? 'Edit Instance' : 'Add Instance'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instance-date">Date</Label>
                <Input
                  id="instance-date"
                  type="date"
                  value={instanceForm.date}
                  onChange={(e) => setInstanceForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="instance-time">Time</Label>
                <Input
                  id="instance-time"
                  type="time"
                  value={instanceForm.time}
                  onChange={(e) => setInstanceForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="instance-status">Status</Label>
              <Select
                value={instanceForm.status}
                onValueChange={(value: RecurringInstance['status']) => setInstanceForm(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="instance-notes">Notes</Label>
              <Textarea
                id="instance-notes"
                value={instanceForm.notes}
                onChange={(e) => setInstanceForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInstanceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (selectedInstance) {
                  onInstanceUpdate(selectedInstance.id, instanceForm);
                }
                setShowInstanceDialog(false);
              }}>
                {selectedInstance ? 'Update Instance' : 'Add Instance'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};