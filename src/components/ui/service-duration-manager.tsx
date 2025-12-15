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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  Settings,
  Scissors,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Timer,
  Calendar,
  Zap
} from "lucide-react";
import { format, addMinutes } from "date-fns";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // minutes
  bufferTime: number; // minutes before/after
  price: number;
  isActive: boolean;
  requiresSpecialist: boolean;
  maxConcurrentBookings: number;
  preparationTime: number; // minutes needed to prepare
  cleanupTime: number; // minutes needed to clean up
  resources: string[]; // required rooms/equipment
  staffRequirements: string[]; // required staff skills
  branchAvailability: string[]; // branch IDs where available
  bookingRules: {
    minAdvanceBooking: number; // hours
    maxAdvanceBooking: number; // days
    cancellationPolicy: 'flexible' | 'moderate' | 'strict';
    reschedulePolicy: 'flexible' | 'moderate' | 'strict';
    depositRequired: boolean;
    depositAmount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

interface ServiceDurationManagerProps {
  services: Service[];
  categories: ServiceCategory[];
  branches: Array<{ id: string; name: string; location: string }>;
  barbers: Array<{ id: string; name: string; specialties: string[]; branchId: string }>;
  rooms: Array<{ id: string; name: string; type: string; branchId: string }>;
  onServiceCreate: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onServiceUpdate: (serviceId: string, updates: Partial<Service>) => void;
  onServiceDelete: (serviceId: string) => void;
  onCategoryCreate: (category: Omit<ServiceCategory, 'id'>) => void;
  onCategoryUpdate: (categoryId: string, updates: Partial<ServiceCategory>) => void;
  onCategoryDelete: (categoryId: string) => void;
}

export function ServiceDurationManager({
  services,
  categories,
  branches,
  barbers,
  rooms,
  onServiceCreate,
  onServiceUpdate,
  onServiceDelete,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete
}: ServiceDurationManagerProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    category: '',
    duration: 60,
    bufferTime: 15,
    price: 0,
    isActive: true,
    requiresSpecialist: false,
    maxConcurrentBookings: 1,
    preparationTime: 0,
    cleanupTime: 0,
    resources: [] as string[],
    staffRequirements: [] as string[],
    branchAvailability: [] as string[],
    bookingRules: {
      minAdvanceBooking: 1,
      maxAdvanceBooking: 30,
      cancellationPolicy: 'flexible' as const,
      reschedulePolicy: 'flexible' as const,
      depositRequired: false,
      depositAmount: 0
    }
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: 'scissors',
    isActive: true
  });

  // Reset forms
  const resetServiceForm = () => {
    setServiceForm({
      name: '',
      description: '',
      category: '',
      duration: 60,
      bufferTime: 15,
      price: 0,
      isActive: true,
      requiresSpecialist: false,
      maxConcurrentBookings: 1,
      preparationTime: 0,
      cleanupTime: 0,
      resources: [],
      staffRequirements: [],
      branchAvailability: [],
      bookingRules: {
        minAdvanceBooking: 1,
        maxAdvanceBooking: 30,
        cancellationPolicy: 'flexible',
        reschedulePolicy: 'flexible',
        depositRequired: false,
        depositAmount: 0
      }
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: 'scissors',
      isActive: true
    });
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && service.isActive) ||
      (filterStatus === 'inactive' && !service.isActive);
    const matchesSearch = searchQuery === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Handle service creation
  const handleServiceCreate = () => {
    if (!serviceForm.name || !serviceForm.category) return;

    onServiceCreate({
      ...serviceForm,
      resources: serviceForm.resources.filter(r => r.trim() !== ''),
      staffRequirements: serviceForm.staffRequirements.filter(s => s.trim() !== ''),
      branchAvailability: serviceForm.branchAvailability.filter(b => b.trim() !== '')
    });

    resetServiceForm();
    setShowServiceDialog(false);
  };

  // Handle service update
  const handleServiceUpdate = () => {
    if (!editingService || !serviceForm.name || !serviceForm.category) return;

    onServiceUpdate(editingService.id, {
      ...serviceForm,
      resources: serviceForm.resources.filter(r => r.trim() !== ''),
      staffRequirements: serviceForm.staffRequirements.filter(s => s.trim() !== ''),
      branchAvailability: serviceForm.branchAvailability.filter(b => b.trim() !== '')
    });

    setEditingService(null);
    setShowServiceDialog(false);
  };

  // Handle category creation
  const handleCategoryCreate = () => {
    if (!categoryForm.name) return;

    onCategoryCreate(categoryForm);
    resetCategoryForm();
    setShowCategoryDialog(false);
  };

  // Handle category update
  const handleCategoryUpdate = () => {
    if (!editingCategory || !categoryForm.name) return;

    onCategoryUpdate(editingCategory.id, categoryForm);
    setEditingCategory(null);
    setShowCategoryDialog(false);
  };

  // Calculate total service time (including buffer)
  const getTotalServiceTime = (service: Service) => {
    return service.duration + service.bufferTime + service.preparationTime + service.cleanupTime;
  };

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6B7280';
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Duration Manager</h1>
          <p className="text-gray-600">Configure services with durations, buffer times, and booking rules</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetCategoryForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Haircuts, Treatments"
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this category..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-color">Color</Label>
                    <Input
                      id="category-color"
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-icon">Icon</Label>
                    <Select
                      value={categoryForm.icon}
                      onValueChange={(value) => setCategoryForm(prev => ({ ...prev, icon: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scissors">Scissors</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="heart">Heart</SelectItem>
                        <SelectItem value="star">Star</SelectItem>
                        <SelectItem value="zap">Zap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="category-active"
                    checked={categoryForm.isActive}
                    onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="category-active">Category is active</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingCategory ? handleCategoryUpdate : handleCategoryCreate}>
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetServiceForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="timing">Timing</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="rules">Booking Rules</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service-name">Service Name</Label>
                        <Input
                          id="service-name"
                          value={serviceForm.name}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Men's Haircut"
                        />
                      </div>
                      <div>
                        <Label htmlFor="service-category">Category</Label>
                        <Select
                          value={serviceForm.category}
                          onValueChange={(value) => setServiceForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(c => c.isActive).map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="service-description">Description</Label>
                      <Textarea
                        id="service-description"
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the service..."
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="service-price">Price ($)</Label>
                        <Input
                          id="service-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-concurrent">Max Concurrent</Label>
                        <Input
                          id="max-concurrent"
                          type="number"
                          min="1"
                          value={serviceForm.maxConcurrentBookings}
                          onChange={(e) => setServiceForm(prev => ({
                            ...prev,
                            maxConcurrentBookings: parseInt(e.target.value) || 1
                          }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Switch
                          id="service-active"
                          checked={serviceForm.isActive}
                          onCheckedChange={(checked) => setServiceForm(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="service-active">Active</Label>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requires-specialist"
                        checked={serviceForm.requiresSpecialist}
                        onCheckedChange={(checked) => setServiceForm(prev => ({ ...prev, requiresSpecialist: checked }))}
                      />
                      <Label htmlFor="requires-specialist">Requires specialist</Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="timing" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Service Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="5"
                          value={serviceForm.duration}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buffer-time">Buffer Time (minutes)</Label>
                        <Input
                          id="buffer-time"
                          type="number"
                          min="0"
                          value={serviceForm.bufferTime}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, bufferTime: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="prep-time">Preparation Time (minutes)</Label>
                        <Input
                          id="prep-time"
                          type="number"
                          min="0"
                          value={serviceForm.preparationTime}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cleanup-time">Cleanup Time (minutes)</Label>
                        <Input
                          id="cleanup-time"
                          type="number"
                          min="0"
                          value={serviceForm.cleanupTime}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, cleanupTime: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Total Time: {formatDuration(getTotalServiceTime(serviceForm as Service))}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            <span>Service: {formatDuration(serviceForm.duration)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Buffer: {formatDuration(serviceForm.bufferTime)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    <div>
                      <Label htmlFor="resources">Required Resources (comma-separated)</Label>
                      <Input
                        id="resources"
                        value={serviceForm.resources.join(', ')}
                        onChange={(e) => setServiceForm(prev => ({
                          ...prev,
                          resources: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                        }))}
                        placeholder="e.g., Chair 1, Clippers, Shampoo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="staff-requirements">Staff Requirements (comma-separated)</Label>
                      <Input
                        id="staff-requirements"
                        value={serviceForm.staffRequirements.join(', ')}
                        onChange={(e) => setServiceForm(prev => ({
                          ...prev,
                          staffRequirements: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        }))}
                        placeholder="e.g., Senior Stylist, Color Specialist"
                      />
                    </div>

                    <div>
                      <Label>Available Branches</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {branches.map(branch => (
                          <div key={branch.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`branch-${branch.id}`}
                              checked={serviceForm.branchAvailability.includes(branch.id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setServiceForm(prev => ({
                                  ...prev,
                                  branchAvailability: checked
                                    ? [...prev.branchAvailability, branch.id]
                                    : prev.branchAvailability.filter(id => id !== branch.id)
                                }));
                              }}
                            />
                            <Label htmlFor={`branch-${branch.id}`}>{branch.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rules" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min-advance">Min Advance Booking (hours)</Label>
                        <Input
                          id="min-advance"
                          type="number"
                          min="0"
                          value={serviceForm.bookingRules.minAdvanceBooking}
                          onChange={(e) => setServiceForm(prev => ({
                            ...prev,
                            bookingRules: { ...prev.bookingRules, minAdvanceBooking: parseInt(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-advance">Max Advance Booking (days)</Label>
                        <Input
                          id="max-advance"
                          type="number"
                          min="1"
                          value={serviceForm.bookingRules.maxAdvanceBooking}
                          onChange={(e) => setServiceForm(prev => ({
                            ...prev,
                            bookingRules: { ...prev.bookingRules, maxAdvanceBooking: parseInt(e.target.value) || 30 }
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cancellation-policy">Cancellation Policy</Label>
                        <Select
                          value={serviceForm.bookingRules.cancellationPolicy}
                          onValueChange={(value: 'flexible' | 'moderate' | 'strict') => setServiceForm(prev => ({
                            ...prev,
                            bookingRules: { ...prev.bookingRules, cancellationPolicy: value as any }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flexible">Flexible (24h)</SelectItem>
                            <SelectItem value="moderate">Moderate (6h)</SelectItem>
                            <SelectItem value="strict">Strict (2h)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="reschedule-policy">Reschedule Policy</Label>
                        <Select
                          value={serviceForm.bookingRules.reschedulePolicy}
                          onValueChange={(value: 'flexible' | 'moderate' | 'strict') => setServiceForm(prev => ({
                            ...prev,
                            bookingRules: { ...prev.bookingRules, reschedulePolicy: value as any }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flexible">Flexible (24h)</SelectItem>
                            <SelectItem value="moderate">Moderate (6h)</SelectItem>
                            <SelectItem value="strict">Strict (2h)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="deposit-required"
                        checked={serviceForm.bookingRules.depositRequired}
                        onCheckedChange={(checked) => setServiceForm(prev => ({
                          ...prev,
                          bookingRules: { ...prev.bookingRules, depositRequired: checked }
                        }))}
                      />
                      <Label htmlFor="deposit-required">Deposit Required</Label>
                    </div>

                    {serviceForm.bookingRules.depositRequired && (
                      <div>
                        <Label htmlFor="deposit-amount">Deposit Amount ($)</Label>
                        <Input
                          id="deposit-amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={serviceForm.bookingRules.depositAmount}
                          onChange={(e) => setServiceForm(prev => ({
                            ...prev,
                            bookingRules: {
                              ...prev.bookingRules,
                              depositAmount: parseFloat(e.target.value) || 0
                            }
                          }))}
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowServiceDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingService ? handleServiceUpdate : handleServiceCreate}>
                    {editingService ? 'Update Service' : 'Create Service'}
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
          <Label>Category:</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
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

        <div className="flex-1">
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Buffer</TableHead>
                <TableHead>Total Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map(service => {
                const category = categories.find(c => c.id === service.category);
                return (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge style={{ backgroundColor: getCategoryColor(service.category) }}>
                        {category?.name || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(service.duration)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        {formatDuration(service.bufferTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {formatDuration(getTotalServiceTime(service))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${service.price.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
                            setServiceForm({
                              name: service.name,
                              description: service.description,
                              category: service.category,
                              duration: service.duration,
                              bufferTime: service.bufferTime,
                              price: service.price,
                              isActive: service.isActive,
                              requiresSpecialist: service.requiresSpecialist,
                              maxConcurrentBookings: service.maxConcurrentBookings,
                              preparationTime: service.preparationTime,
                              cleanupTime: service.cleanupTime,
                              resources: [...service.resources],
                              staffRequirements: [...service.staffRequirements],
                              branchAvailability: [...service.branchAvailability],
                              bookingRules: { ...service.bookingRules } as any
                            });
                            setShowServiceDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onServiceDelete(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Service Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                style={{ borderColor: category.color }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(category);
                      setCategoryForm({
                        name: category.name,
                        description: category.description,
                        color: category.color,
                        icon: category.icon,
                        isActive: category.isActive
                      });
                      setShowCategoryDialog(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCategoryDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};