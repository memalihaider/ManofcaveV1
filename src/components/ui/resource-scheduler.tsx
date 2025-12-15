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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Grid3X3,
  Scissors,
  User
} from "lucide-react";
import { format, addMinutes, parseISO, isSameDay } from "date-fns";

export interface Room {
  id: string;
  name: string;
  type: 'standard' | 'vip' | 'treatment' | 'waiting' | 'storage';
  capacity: number;
  branchId: string;
  branchName: string;
  amenities: string[];
  isActive: boolean;
  maintenanceSchedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    nextMaintenance: string;
    lastMaintenance: string;
  };
  bookingRules: {
    maxDuration: number; // minutes
    bufferTime: number; // minutes between bookings
    requiresSpecialist: boolean;
    allowedServices: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  appointmentId: number;
  startTime: string;
  endTime: string;
  date: string;
  purpose: string;
  bookedBy: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

interface ResourceSchedulerProps {
  rooms: Room[];
  roomBookings: RoomBooking[];
  appointments: Array<{
    id: number;
    customer: string;
    service: string;
    staff: string;
    date: string;
    time: string;
    duration: string;
    status: string;
  }>;
  branches: Array<{ id: string; name: string; location: string }>;
  services: Array<{ id: string; name: string; duration: number; bufferTime: number }>;
  onRoomCreate: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onRoomUpdate: (roomId: string, updates: Partial<Room>) => void;
  onRoomDelete: (roomId: string) => void;
  onRoomBookingCreate: (booking: Omit<RoomBooking, 'id'>) => void;
  onRoomBookingUpdate: (bookingId: string, updates: Partial<RoomBooking>) => void;
  onRoomBookingDelete: (bookingId: string) => void;
  selectedDate?: Date;
  selectedBranch?: string;
}

export function ResourceScheduler({
  rooms,
  roomBookings,
  appointments,
  branches,
  services,
  onRoomCreate,
  onRoomUpdate,
  onRoomDelete,
  onRoomBookingCreate,
  onRoomBookingUpdate,
  onRoomBookingDelete,
  selectedDate = new Date(),
  selectedBranch = 'all'
}: ResourceSchedulerProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Room form state
  const [roomForm, setRoomForm] = useState({
    name: '',
    type: 'standard' as Room['type'],
    capacity: 1,
    branchId: '',
    branchName: '',
    amenities: [] as string[],
    isActive: true,
    bookingRules: {
      maxDuration: 120,
      bufferTime: 15,
      requiresSpecialist: false,
      allowedServices: [] as string[]
    }
  });

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    roomId: '',
    appointmentId: '',
    startTime: '',
    endTime: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    purpose: '',
    bookedBy: '',
    notes: '',
    status: 'scheduled' as const
  });

  // Reset forms
  const resetRoomForm = () => {
    setRoomForm({
      name: '',
      type: 'standard',
      capacity: 1,
      branchId: selectedBranch !== 'all' ? selectedBranch : '',
      branchName: '',
      amenities: [],
      isActive: true,
      bookingRules: {
        maxDuration: 120,
        bufferTime: 15,
        requiresSpecialist: false,
        allowedServices: []
      }
    });
  };

  const resetBookingForm = () => {
    setBookingForm({
      roomId: '',
      appointmentId: '',
      startTime: '',
      endTime: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      purpose: '',
      bookedBy: '',
      notes: '',
      status: 'scheduled'
    });
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesBranch = selectedBranch === 'all' || room.branchId === selectedBranch;
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && room.isActive) ||
      (filterStatus === 'inactive' && !room.isActive);

    return matchesBranch && matchesType && matchesStatus;
  });

  // Get room availability for a specific time slot
  const getRoomAvailability = (roomId: string, date: string, startTime: string, endTime: string) => {
    const roomBookingsForDate = roomBookings.filter(booking =>
      booking.roomId === roomId &&
      booking.date === date &&
      booking.status !== 'cancelled'
    );

    // Check for conflicts
    const hasConflict = roomBookingsForDate.some(booking => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      return (startTime < bookingEnd && endTime > bookingStart);
    });

    return !hasConflict;
  };

  // Get room utilization for the day
  const getRoomUtilization = (roomId: string, date: string) => {
    const roomBookingsForDate = roomBookings.filter(booking =>
      booking.roomId === roomId &&
      booking.date === date &&
      booking.status !== 'cancelled'
    );

    const totalMinutes = roomBookingsForDate.reduce((total, booking) => {
      const start = new Date(`2000-01-01T${booking.startTime}`);
      const end = new Date(`2000-01-01T${booking.endTime}`);
      return total + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    // Assuming 8 hour workday (480 minutes)
    return Math.round((totalMinutes / 480) * 100);
  };

  // Handle room creation
  const handleRoomCreate = () => {
    if (!roomForm.name || !roomForm.branchId) return;

    onRoomCreate({
      ...roomForm,
      amenities: roomForm.amenities.filter(a => a.trim() !== ''),
      bookingRules: {
        ...roomForm.bookingRules,
        allowedServices: roomForm.bookingRules.allowedServices.filter(s => s.trim() !== '')
      }
    });

    resetRoomForm();
    setShowRoomDialog(false);
  };

  // Handle room update
  const handleRoomUpdate = () => {
    if (!editingRoom || !roomForm.name || !roomForm.branchId) return;

    onRoomUpdate(editingRoom.id, {
      ...roomForm,
      amenities: roomForm.amenities.filter(a => a.trim() !== ''),
      bookingRules: {
        ...roomForm.bookingRules,
        allowedServices: roomForm.bookingRules.allowedServices.filter(s => s.trim() !== '')
      }
    });

    setEditingRoom(null);
    setShowRoomDialog(false);
  };

  // Handle booking creation
  const handleBookingCreate = () => {
    if (!bookingForm.roomId || !bookingForm.startTime || !bookingForm.endTime) return;

    onRoomBookingCreate({
      ...bookingForm,
      appointmentId: bookingForm.appointmentId ? parseInt(bookingForm.appointmentId) : 0
    });

    resetBookingForm();
    setShowBookingDialog(false);
  };

  // Get room type color
  const getRoomTypeColor = (type: Room['type']) => {
    switch (type) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'treatment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'waiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'storage': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Render room grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredRooms.map(room => {
        const utilization = getRoomUtilization(room.id, format(selectedDate, 'yyyy-MM-dd'));
        const todaysBookings = roomBookings.filter(booking =>
          booking.roomId === room.id &&
          booking.date === format(selectedDate, 'yyyy-MM-dd') &&
          booking.status !== 'cancelled'
        );

        return (
          <Card key={room.id} className={`cursor-pointer transition-all hover:shadow-lg ${
            !room.isActive ? 'opacity-60' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {room.name}
                </CardTitle>
                <Badge className={getRoomTypeColor(room.type)}>
                  {room.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {branches.find(b => b.id === room.branchId)?.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Capacity: {room.capacity}
                </span>
                <span className={`flex items-center gap-1 ${
                  utilization > 80 ? 'text-red-600' :
                  utilization > 60 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  <Clock className="w-4 h-4" />
                  {utilization}% used
                </span>
              </div>

              {room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {room.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.amenities.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="text-sm">
                <p className="font-medium">Today's Bookings: {todaysBookings.length}</p>
                {todaysBookings.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {todaysBookings.slice(0, 2).map(booking => (
                      <div key={booking.id} className="flex justify-between text-xs bg-gray-50 p-1 rounded">
                        <span>{booking.startTime} - {booking.endTime}</span>
                        <Badge variant="outline" className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRoom(room);
                    setViewMode('timeline');
                  }}
                  className="flex-1"
                >
                  View Schedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingRoom(room);
                    setRoomForm({
                      name: room.name,
                      type: room.type,
                      capacity: room.capacity,
                      branchId: room.branchId,
                      branchName: room.branchName || '',
                      amenities: [...room.amenities],
                      isActive: room.isActive,
                      bookingRules: { ...room.bookingRules }
                    });
                    setShowRoomDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Render room list view
  const renderListView = () => (
    <div className="space-y-2">
      {filteredRooms.map(room => {
        const utilization = getRoomUtilization(room.id, format(selectedDate, 'yyyy-MM-dd'));
        const todaysBookings = roomBookings.filter(booking =>
          booking.roomId === room.id &&
          booking.date === format(selectedDate, 'yyyy-MM-dd') &&
          booking.status !== 'cancelled'
        );

        return (
          <Card key={room.id} className="cursor-pointer hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-sm text-gray-600">
                        {branches.find(b => b.id === room.branchId)?.name}
                      </p>
                    </div>
                  </div>
                  <Badge className={getRoomTypeColor(room.type)}>
                    {room.type}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm">
                    <Users className="w-4 h-4" />
                    {room.capacity}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{utilization}% utilized</p>
                    <p className="text-xs text-gray-500">{todaysBookings.length} bookings</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRoom(room);
                        setViewMode('timeline');
                      }}
                    >
                      Schedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingRoom(room);
                        setRoomForm({
                          name: room.name,
                          type: room.type,
                          capacity: room.capacity,
                          branchId: room.branchId,
                          branchName: room.branchName || '',
                          amenities: [...room.amenities],
                          isActive: room.isActive,
                          bookingRules: { ...room.bookingRules }
                        });
                        setShowRoomDialog(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Render timeline view for selected room
  const renderTimelineView = () => {
    if (!selectedRoom) return null;

    const hours = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotBookings = roomBookings.filter(booking =>
          booking.roomId === selectedRoom.id &&
          booking.date === format(selectedDate, 'yyyy-MM-dd') &&
          booking.startTime <= timeSlot &&
          booking.endTime > timeSlot &&
          booking.status !== 'cancelled'
        );

        hours.push(
          <div key={timeSlot} className="flex border-b border-gray-100 min-h-[40px]">
            <div className="w-20 p-2 text-sm text-gray-500 border-r border-gray-100 flex-shrink-0">
              {format(new Date(`2000-01-01T${timeSlot}`), 'h:mm a')}
            </div>
            <div className="flex-1 p-1">
              {slotBookings.map(booking => (
                <div
                  key={booking.id}
                  className="bg-blue-100 border border-blue-200 rounded p-2 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{booking.purpose}</span>
                    <Badge variant="outline" className="text-xs">
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {booking.startTime} - {booking.endTime}
                  </p>
                  {booking.notes && (
                    <p className="text-xs text-gray-500 mt-1">{booking.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setSelectedRoom(null)}>
              ← Back to Rooms
            </Button>
            <h2 className="text-xl font-semibold">{selectedRoom.name} Schedule</h2>
            <Badge className={getRoomTypeColor(selectedRoom.type)}>
              {selectedRoom.type}
            </Badge>
          </div>
          <Button onClick={() => setShowBookingDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Book Room
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
              {hours}
            </div>
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
          <h1 className="text-2xl font-bold">Resource Scheduler</h1>
          <p className="text-gray-600">Manage rooms and their availability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            <Grid3X3 className="w-4 h-4 mr-2" />
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetRoomForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input
                      id="room-name"
                      value={roomForm.name}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Room 101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room-type">Room Type</Label>
                    <Select
                      value={roomForm.type}
                      onValueChange={(value: Room['type']) => setRoomForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="treatment">Treatment</SelectItem>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      value={roomForm.capacity}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Select
                      value={roomForm.branchId}
                      onValueChange={(value) => setRoomForm(prev => ({ ...prev, branchId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="amenities"
                    value={roomForm.amenities.join(', ')}
                    onChange={(e) => setRoomForm(prev => ({
                      ...prev,
                      amenities: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                    }))}
                    placeholder="WiFi, TV, Massage Chair, etc."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={roomForm.isActive}
                    onCheckedChange={(checked) => setRoomForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="active">Room is active</Label>
                </div>

                <Tabs defaultValue="rules" className="w-full">
                  <TabsList>
                    <TabsTrigger value="rules">Booking Rules</TabsTrigger>
                    <TabsTrigger value="services">Allowed Services</TabsTrigger>
                  </TabsList>
                  <TabsContent value="rules" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="max-duration">Max Duration (minutes)</Label>
                        <Input
                          id="max-duration"
                          type="number"
                          min="15"
                          value={roomForm.bookingRules.maxDuration}
                          onChange={(e) => setRoomForm(prev => ({
                            ...prev,
                            bookingRules: { ...prev.bookingRules, maxDuration: parseInt(e.target.value) || 120 }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buffer-time">Buffer Time (minutes)</Label>
                        <Input
                          id="buffer-time"
                          type="number"
                          min="0"
                          value={roomForm.bookingRules.bufferTime}
                          onChange={(e) => setRoomForm(prev => ({
                            ...prev,
                            bookingRules: { ...prev.bookingRules, bufferTime: parseInt(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requires-specialist"
                        checked={roomForm.bookingRules.requiresSpecialist}
                        onCheckedChange={(checked) => setRoomForm(prev => ({
                          ...prev,
                          bookingRules: { ...prev.bookingRules, requiresSpecialist: checked }
                        }))}
                      />
                      <Label htmlFor="requires-specialist">Requires specialist booking</Label>
                    </div>
                  </TabsContent>
                  <TabsContent value="services">
                    <div>
                      <Label htmlFor="allowed-services">Allowed Services (comma-separated service IDs)</Label>
                      <Input
                        id="allowed-services"
                        value={roomForm.bookingRules.allowedServices.join(', ')}
                        onChange={(e) => setRoomForm(prev => ({
                          ...prev,
                          bookingRules: {
                            ...prev.bookingRules,
                            allowedServices: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          }
                        }))}
                        placeholder="service-1, service-2, etc."
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowRoomDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingRoom ? handleRoomUpdate : handleRoomCreate}>
                    {editingRoom ? 'Update Room' : 'Create Room'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <Label>Branch:</Label>
          <Select value={selectedBranch} onValueChange={() => {}}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select branch" />
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
        </div>

        <div className="flex items-center gap-2">
          <Label>Type:</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="treatment">Treatment</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
      </div>

      {/* Content */}
      {viewMode === 'timeline' && selectedRoom ? (
        renderTimelineView()
      ) : viewMode === 'list' ? (
        renderListView()
      ) : (
        renderGridView()
      )}

      {/* Room Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="booking-room">Room</Label>
              <Select
                value={bookingForm.roomId}
                onValueChange={(value) => setBookingForm(prev => ({ ...prev, roomId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} ({branches.find(b => b.id === room.branchId)?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={bookingForm.startTime}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={bookingForm.endTime}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                value={bookingForm.purpose}
                onChange={(e) => setBookingForm(prev => ({ ...prev, purpose: e.target.value }))}
                placeholder="e.g., Haircut, Meeting, Maintenance"
              />
            </div>

            <div>
              <Label htmlFor="appointment-link">Link to Appointment (optional)</Label>
              <Select
                value={bookingForm.appointmentId}
                onValueChange={(value) => setBookingForm(prev => ({ ...prev, appointmentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment" />
                </SelectTrigger>
                <SelectContent>
                  {appointments
                    .filter(apt => apt.date === bookingForm.date)
                    .map(apt => (
                      <SelectItem key={apt.id} value={apt.id.toString()}>
                        {apt.customer} - {apt.service} ({apt.time})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="booked-by">Booked By</Label>
              <Input
                id="booked-by"
                value={bookingForm.bookedBy}
                onChange={(e) => setBookingForm(prev => ({ ...prev, bookedBy: e.target.value }))}
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBookingCreate}>
                Book Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};