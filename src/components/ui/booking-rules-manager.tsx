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
  Settings,
  Plus,
  Edit,
  Trash2,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  Timer,
  Shield,
  Bell,
  Zap
} from "lucide-react";
import { format } from "date-fns";

export interface BookingRule {
  id: string;
  name: string;
  description: string;
  type: 'business_hours' | 'max_bookings' | 'buffer_time' | 'advance_booking' | 'cancellation' | 'no_show' | 'pricing' | 'staff_availability' | 'service_restrictions' | 'customer_limits';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  conditions: {
    branches?: string[];
    services?: string[];
    barbers?: string[];
    customerTypes?: string[];
    timeRanges?: { start: string; end: string }[];
    daysOfWeek?: number[];
  };
  actions: {
    allowBooking?: boolean;
    blockBooking?: boolean;
    requireApproval?: boolean;
    sendNotification?: boolean;
    applyDiscount?: number;
    addFee?: number;
    setMinAdvanceTime?: number;
    setMaxAdvanceTime?: number;
    restrictTimeSlots?: string[];
  };
  exceptions: {
    customerIds?: string[];
    dates?: string[];
    reasons?: string[];
  };
  branchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessHours {
  [key: string]: {
    monday: { start: number; end: number; closed?: boolean };
    tuesday: { start: number; end: number; closed?: boolean };
    wednesday: { start: number; end: number; closed?: boolean };
    thursday: { start: number; end: number; closed?: boolean };
    friday: { start: number; end: number; closed?: boolean };
    saturday: { start: number; end: number; closed?: boolean };
    sunday: { start: number; end: number; closed?: boolean };
    holidays: string[];
    specialHours: { [date: string]: { start: number; end: number; closed?: boolean } };
  };
}

export interface CancellationPolicy {
  id: string;
  name: string;
  description: string;
  rules: {
    freeCancellationHours: number;
    lateCancellationFee: number;
    noShowFee: number;
    refundPercentage: number;
  };
  branchId?: string;
  isActive: boolean;
}

interface BookingRulesManagerProps {
  rules: BookingRule[];
  businessHours: BusinessHours;
  cancellationPolicies: CancellationPolicy[];
  branches: Array<{ id: string; name: string; location: string }>;
  services: Array<{ id: string; name: string; category: string }>;
  barbers: Array<{ id: string; name: string }>;
  onRuleCreate: (rule: Omit<BookingRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onRuleUpdate: (ruleId: string, updates: Partial<BookingRule>) => void;
  onRuleDelete: (ruleId: string) => void;
  onBusinessHoursUpdate: (branchId: string, hours: BusinessHours[string]) => void;
  onCancellationPolicyCreate: (policy: Omit<CancellationPolicy, 'id'>) => void;
  onCancellationPolicyUpdate: (policyId: string, updates: Partial<CancellationPolicy>) => void;
  onCancellationPolicyDelete: (policyId: string) => void;
}

export function BookingRulesManager({
  rules,
  businessHours,
  cancellationPolicies,
  branches,
  services,
  barbers,
  onRuleCreate,
  onRuleUpdate,
  onRuleDelete,
  onBusinessHoursUpdate,
  onCancellationPolicyCreate,
  onCancellationPolicyUpdate,
  onCancellationPolicyDelete
}: BookingRulesManagerProps) {
  const [selectedRule, setSelectedRule] = useState<BookingRule | null>(null);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showHoursDialog, setShowHoursDialog] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<BookingRule | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<CancellationPolicy | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [filterType, setFilterType] = useState('all');

  // Rule form state
  const [ruleForm, setRuleForm] = useState({
    name: '',
    description: '',
    type: 'business_hours' as BookingRule['type'],
    priority: 'medium' as BookingRule['priority'],
    isActive: true,
    conditions: {
      branches: [] as string[],
      services: [] as string[],
      barbers: [] as string[],
      customerTypes: [] as string[],
      timeRanges: [] as { start: string; end: string }[],
      daysOfWeek: [] as number[]
    },
    actions: {
      allowBooking: true,
      blockBooking: false,
      requireApproval: false,
      sendNotification: false,
      applyDiscount: 0,
      addFee: 0,
      setMinAdvanceTime: 0,
      setMaxAdvanceTime: 0,
      restrictTimeSlots: [] as string[]
    },
    exceptions: {
      customerIds: [] as string[],
      dates: [] as string[],
      reasons: [] as string[]
    },
    branchId: ''
  });

  // Business hours form state
  const [hoursForm, setHoursForm] = useState({
    monday: { start: 9, end: 18, closed: false },
    tuesday: { start: 9, end: 18, closed: false },
    wednesday: { start: 9, end: 18, closed: false },
    thursday: { start: 9, end: 18, closed: false },
    friday: { start: 9, end: 18, closed: false },
    saturday: { start: 9, end: 18, closed: false },
    sunday: { start: 9, end: 18, closed: false },
    holidays: [] as string[],
    specialHours: {}
  });

  // Cancellation policy form state
  const [policyForm, setPolicyForm] = useState({
    name: '',
    description: '',
    rules: {
      freeCancellationHours: 24,
      lateCancellationFee: 25,
      noShowFee: 50,
      refundPercentage: 100
    },
    branchId: '',
    isActive: true
  });

  // Reset forms
  const resetRuleForm = () => {
    setRuleForm({
      name: '',
      description: '',
      type: 'business_hours',
      priority: 'medium',
      isActive: true,
      conditions: {
        branches: [],
        services: [],
        barbers: [],
        customerTypes: [],
        timeRanges: [],
        daysOfWeek: []
      },
      actions: {
        allowBooking: true,
        blockBooking: false,
        requireApproval: false,
        sendNotification: false,
        applyDiscount: 0,
        addFee: 0,
        setMinAdvanceTime: 0,
        setMaxAdvanceTime: 0,
        restrictTimeSlots: []
      },
      exceptions: {
        customerIds: [],
        dates: [],
        reasons: []
      },
      branchId: ''
    });
  };

  const resetPolicyForm = () => {
    setPolicyForm({
      name: '',
      description: '',
      rules: {
        freeCancellationHours: 24,
        lateCancellationFee: 25,
        noShowFee: 50,
        refundPercentage: 100
      },
      branchId: '',
      isActive: true
    });
  };

  // Filter rules
  const filteredRules = rules.filter(rule => {
    const matchesBranch = selectedBranch === 'all' || rule.branchId === selectedBranch || !rule.branchId;
    const matchesType = filterType === 'all' || rule.type === filterType;
    return matchesBranch && matchesType;
  });

  // Handle rule creation
  const handleRuleCreate = () => {
    if (!ruleForm.name || !ruleForm.description) return;

    onRuleCreate({
      ...ruleForm,
      conditions: {
        ...ruleForm.conditions,
        branches: ruleForm.conditions.branches.filter(b => b.trim() !== ''),
        services: ruleForm.conditions.services.filter(s => s.trim() !== ''),
        barbers: ruleForm.conditions.barbers.filter(b => b.trim() !== ''),
        customerTypes: ruleForm.conditions.customerTypes.filter(c => c.trim() !== ''),
        timeRanges: ruleForm.conditions.timeRanges.filter(tr => tr.start && tr.end),
        daysOfWeek: ruleForm.conditions.daysOfWeek.filter(d => d >= 0 && d <= 6)
      },
      actions: {
        ...ruleForm.actions,
        restrictTimeSlots: ruleForm.actions.restrictTimeSlots.filter(t => t.trim() !== '')
      },
      exceptions: {
        ...ruleForm.exceptions,
        customerIds: ruleForm.exceptions.customerIds.filter(c => c.trim() !== ''),
        dates: ruleForm.exceptions.dates.filter(d => d.trim() !== ''),
        reasons: ruleForm.exceptions.reasons.filter(r => r.trim() !== '')
      }
    });

    resetRuleForm();
    setShowRuleDialog(false);
  };

  // Handle rule update
  const handleRuleUpdate = () => {
    if (!editingRule) return;

    onRuleUpdate(editingRule.id, {
      ...ruleForm,
      conditions: {
        ...ruleForm.conditions,
        branches: ruleForm.conditions.branches.filter(b => b.trim() !== ''),
        services: ruleForm.conditions.services.filter(s => s.trim() !== ''),
        barbers: ruleForm.conditions.barbers.filter(b => b.trim() !== ''),
        customerTypes: ruleForm.conditions.customerTypes.filter(c => c.trim() !== ''),
        timeRanges: ruleForm.conditions.timeRanges.filter(tr => tr.start && tr.end),
        daysOfWeek: ruleForm.conditions.daysOfWeek.filter(d => d >= 0 && d <= 6)
      },
      actions: {
        ...ruleForm.actions,
        restrictTimeSlots: ruleForm.actions.restrictTimeSlots.filter(t => t.trim() !== '')
      },
      exceptions: {
        ...ruleForm.exceptions,
        customerIds: ruleForm.exceptions.customerIds.filter(c => c.trim() !== ''),
        dates: ruleForm.exceptions.dates.filter(d => d.trim() !== ''),
        reasons: ruleForm.exceptions.reasons.filter(r => r.trim() !== '')
      }
    });

    setEditingRule(null);
    setShowRuleDialog(false);
  };

  // Handle policy creation
  const handlePolicyCreate = () => {
    if (!policyForm.name) return;

    onCancellationPolicyCreate(policyForm);
    resetPolicyForm();
    setShowPolicyDialog(false);
  };

  // Handle policy update
  const handlePolicyUpdate = () => {
    if (!editingPolicy) return;

    onCancellationPolicyUpdate(editingPolicy.id, policyForm);
    setEditingPolicy(null);
    setShowPolicyDialog(false);
  };

  // Get rule type color
  const getRuleTypeColor = (type: BookingRule['type']) => {
    switch (type) {
      case 'business_hours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'max_bookings': return 'bg-red-100 text-red-800 border-red-200';
      case 'buffer_time': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advance_booking': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancellation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'no_show': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pricing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'staff_availability': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'service_restrictions': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'customer_limits': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: BookingRule['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Render rules list
  const renderRulesList = () => (
    <div className="space-y-4">
      {filteredRules.map(rule => (
        <Card key={rule.id} className="cursor-pointer hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(rule.priority)}`} />
                <div>
                  <h3 className="font-semibold text-lg">{rule.name}</h3>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
                <Badge className={getRuleTypeColor(rule.type)}>
                  {rule.type.replace('_', ' ')}
                </Badge>
                <Badge variant={rule.isActive ? "default" : "secondary"}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingRule(rule);
                    setRuleForm({
                      name: rule.name,
                      description: rule.description,
                      type: rule.type,
                      priority: rule.priority,
                      isActive: rule.isActive,
                      conditions: {
                        branches: rule.conditions?.branches || [],
                        services: rule.conditions?.services || [],
                        barbers: rule.conditions?.barbers || [],
                        customerTypes: rule.conditions?.customerTypes || [],
                        timeRanges: rule.conditions?.timeRanges || [],
                        daysOfWeek: rule.conditions?.daysOfWeek || []
                      },
                      actions: {
                        allowBooking: rule.actions?.allowBooking || false,
                        blockBooking: rule.actions?.blockBooking || false,
                        requireApproval: rule.actions?.requireApproval || false,
                        sendNotification: rule.actions?.sendNotification || false,
                        applyDiscount: rule.actions?.applyDiscount || 0,
                        addFee: rule.actions?.addFee || 0,
                        setMinAdvanceTime: rule.actions?.setMinAdvanceTime || 0,
                        setMaxAdvanceTime: rule.actions?.setMaxAdvanceTime || 0,
                        restrictTimeSlots: rule.actions?.restrictTimeSlots || []
                      },
                      exceptions: {
                        customerIds: rule.exceptions?.customerIds || [],
                        dates: rule.exceptions?.dates || [],
                        reasons: rule.exceptions?.reasons || []
                      },
                      branchId: rule.branchId || ''
                    });
                    setShowRuleDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRuleDelete(rule.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Branch:</span>
                <p className="font-medium">
                  {rule.branchId ? branches.find(b => b.id === rule.branchId)?.name : 'All Branches'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Conditions:</span>
                <p className="font-medium">
                  {rule.conditions.branches?.length || 0} branches,
                  {rule.conditions.services?.length || 0} services,
                  {rule.conditions.barbers?.length || 0} barbers
                </p>
              </div>
              <div>
                <span className="text-gray-500">Actions:</span>
                <p className="font-medium">
                  {rule.actions.allowBooking ? 'Allow' : 'Block'}
                  {rule.actions.requireApproval && ', Requires Approval'}
                  {rule.actions.applyDiscount && `, ${rule.actions.applyDiscount}% Discount`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render business hours
  const renderBusinessHours = () => (
    <div className="space-y-6">
      {branches.map(branch => {
        const hours = businessHours[branch.id] || {
          monday: { start: 9, end: 18, closed: false },
          tuesday: { start: 9, end: 18, closed: false },
          wednesday: { start: 9, end: 18, closed: false },
          thursday: { start: 9, end: 18, closed: false },
          friday: { start: 9, end: 18, closed: false },
          saturday: { start: 9, end: 18, closed: false },
          sunday: { start: 9, end: 18, closed: false },
          holidays: [],
          specialHours: {}
        };

        return (
          <Card key={branch.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {branch.name} - Business Hours
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHoursForm(hours as any);
                    setSelectedBranch(branch.id);
                    setShowHoursDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Hours
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const dayHours = (hours as any)[day];
                  return (
                    <div key={day} className="text-center">
                      <h4 className="font-medium capitalize mb-2">{day}</h4>
                      {dayHours.closed ? (
                        <Badge variant="secondary">Closed</Badge>
                      ) : (
                        <div className="text-sm">
                          <p>{dayHours.start}:00 - {dayHours.end}:00</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {hours.holidays.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Holidays</h4>
                  <div className="flex flex-wrap gap-2">
                    {hours.holidays.map(holiday => (
                      <Badge key={holiday} variant="outline">
                        {holiday}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Render cancellation policies
  const renderCancellationPolicies = () => (
    <div className="space-y-4">
      {cancellationPolicies.map(policy => (
        <Card key={policy.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{policy.name}</h3>
                <p className="text-sm text-gray-600">{policy.description}</p>
                <Badge variant={policy.isActive ? "default" : "secondary"} className="mt-2">
                  {policy.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingPolicy(policy);
                    setPolicyForm({
                      name: policy.name,
                      description: policy.description,
                      rules: { ...policy.rules },
                      branchId: policy.branchId || '',
                      isActive: policy.isActive
                    });
                    setShowPolicyDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancellationPolicyDelete(policy.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Free Cancellation:</span>
                <p className="font-medium">{policy.rules.freeCancellationHours} hours</p>
              </div>
              <div>
                <span className="text-gray-500">Late Cancellation Fee:</span>
                <p className="font-medium">${policy.rules.lateCancellationFee}</p>
              </div>
              <div>
                <span className="text-gray-500">No-Show Fee:</span>
                <p className="font-medium">${policy.rules.noShowFee}</p>
              </div>
              <div>
                <span className="text-gray-500">Refund:</span>
                <p className="font-medium">{policy.rules.refundPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Booking Rules & Policies</h1>
          <p className="text-gray-600">Manage business hours, booking rules, and cancellation policies</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetRuleForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRule ? 'Edit Booking Rule' : 'Create Booking Rule'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="conditions">Conditions</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                    <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rule-name">Rule Name</Label>
                        <Input
                          id="rule-name"
                          value={ruleForm.name}
                          onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Weekend Premium Pricing"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rule-type">Rule Type</Label>
                        <Select
                          value={ruleForm.type}
                          onValueChange={(value: BookingRule['type']) => setRuleForm(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business_hours">Business Hours</SelectItem>
                            <SelectItem value="max_bookings">Max Bookings</SelectItem>
                            <SelectItem value="buffer_time">Buffer Time</SelectItem>
                            <SelectItem value="advance_booking">Advance Booking</SelectItem>
                            <SelectItem value="cancellation">Cancellation</SelectItem>
                            <SelectItem value="no_show">No Show</SelectItem>
                            <SelectItem value="pricing">Pricing</SelectItem>
                            <SelectItem value="staff_availability">Staff Availability</SelectItem>
                            <SelectItem value="service_restrictions">Service Restrictions</SelectItem>
                            <SelectItem value="customer_limits">Customer Limits</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rule-description">Description</Label>
                      <Textarea
                        id="rule-description"
                        value={ruleForm.description}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this rule does..."
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="rule-priority">Priority</Label>
                        <Select
                          value={ruleForm.priority}
                          onValueChange={(value: BookingRule['priority']) => setRuleForm(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rule-branch">Branch (Optional)</Label>
                        <Select
                          value={ruleForm.branchId}
                          onValueChange={(value) => setRuleForm(prev => ({ ...prev, branchId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All branches" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Branches</SelectItem>
                            {branches.map(branch => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Switch
                          id="rule-active"
                          checked={ruleForm.isActive}
                          onCheckedChange={(checked) => setRuleForm(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="rule-active">Active</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="conditions" className="space-y-4">
                    <div>
                      <Label>Applicable Branches</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                        {branches.map(branch => (
                          <div key={branch.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`branch-${branch.id}`}
                              checked={ruleForm.conditions.branches?.includes(branch.id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setRuleForm(prev => ({
                                  ...prev,
                                  conditions: {
                                    ...prev.conditions,
                                    branches: checked
                                      ? [...(prev.conditions.branches || []), branch.id]
                                      : (prev.conditions.branches || []).filter(id => id !== branch.id)
                                  }
                                }));
                              }}
                            />
                            <Label htmlFor={`branch-${branch.id}`}>{branch.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Applicable Services</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                        {services.map(service => (
                          <div key={service.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`service-${service.id}`}
                              checked={ruleForm.conditions.services?.includes(service.id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setRuleForm(prev => ({
                                  ...prev,
                                  conditions: {
                                    ...prev.conditions,
                                    services: checked
                                      ? [...(prev.conditions.services || []), service.id]
                                      : (prev.conditions.services || []).filter(id => id !== service.id)
                                  }
                                }));
                              }}
                            />
                            <Label htmlFor={`service-${service.id}`}>{service.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Applicable Barbers</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                        {barbers.map(barber => (
                          <div key={barber.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`barber-${barber.id}`}
                              checked={ruleForm.conditions.barbers?.includes(barber.id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setRuleForm(prev => ({
                                  ...prev,
                                  conditions: {
                                    ...prev.conditions,
                                    barbers: checked
                                      ? [...(prev.conditions.barbers || []), barber.id]
                                      : (prev.conditions.barbers || []).filter(id => id !== barber.id)
                                  }
                                }));
                              }}
                            />
                            <Label htmlFor={`barber-${barber.id}`}>{barber.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="allow-booking"
                          checked={ruleForm.actions.allowBooking}
                          onCheckedChange={(checked) => setRuleForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, allowBooking: checked }
                          }))}
                        />
                        <Label htmlFor="allow-booking">Allow booking</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="block-booking"
                          checked={ruleForm.actions.blockBooking}
                          onCheckedChange={(checked) => setRuleForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, blockBooking: checked }
                          }))}
                        />
                        <Label htmlFor="block-booking">Block booking</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="require-approval"
                          checked={ruleForm.actions.requireApproval}
                          onCheckedChange={(checked) => setRuleForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, requireApproval: checked }
                          }))}
                        />
                        <Label htmlFor="require-approval">Require approval</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="send-notification"
                          checked={ruleForm.actions.sendNotification}
                          onCheckedChange={(checked) => setRuleForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, sendNotification: checked }
                          }))}
                        />
                        <Label htmlFor="send-notification">Send notification</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          max="100"
                          value={ruleForm.actions.applyDiscount}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, applyDiscount: parseInt(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fee">Additional Fee ($)</Label>
                        <Input
                          id="fee"
                          type="number"
                          min="0"
                          value={ruleForm.actions.addFee}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, addFee: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="exceptions" className="space-y-4">
                    <div>
                      <Label htmlFor="exception-customers">Exception Customer IDs (comma-separated)</Label>
                      <Input
                        id="exception-customers"
                        value={ruleForm.exceptions.customerIds?.join(', ')}
                        onChange={(e) => setRuleForm(prev => ({
                          ...prev,
                          exceptions: {
                            ...prev.exceptions,
                            customerIds: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                          }
                        }))}
                        placeholder="customer-1, customer-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exception-dates">Exception Dates (comma-separated)</Label>
                      <Input
                        id="exception-dates"
                        value={ruleForm.exceptions.dates?.join(', ')}
                        onChange={(e) => setRuleForm(prev => ({
                          ...prev,
                          exceptions: {
                            ...prev.exceptions,
                            dates: e.target.value.split(',').map(d => d.trim()).filter(d => d)
                          }
                        }))}
                        placeholder="2024-01-01, 2024-12-25"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exception-reasons">Exception Reasons (comma-separated)</Label>
                      <Input
                        id="exception-reasons"
                        value={ruleForm.exceptions.reasons?.join(', ')}
                        onChange={(e) => setRuleForm(prev => ({
                          ...prev,
                          exceptions: {
                            ...prev.exceptions,
                            reasons: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                          }
                        }))}
                        placeholder="emergency, vip, staff"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowRuleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingRule ? handleRuleUpdate : handleRuleCreate}>
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetPolicyForm}>
                <Shield className="w-4 h-4 mr-2" />
                Add Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPolicy ? 'Edit Cancellation Policy' : 'Create Cancellation Policy'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="policy-name">Policy Name</Label>
                  <Input
                    id="policy-name"
                    value={policyForm.name}
                    onChange={(e) => setPolicyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Standard Cancellation Policy"
                  />
                </div>

                <div>
                  <Label htmlFor="policy-description">Description</Label>
                  <Textarea
                    id="policy-description"
                    value={policyForm.description}
                    onChange={(e) => setPolicyForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the cancellation policy..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="free-hours">Free Cancellation (hours)</Label>
                    <Input
                      id="free-hours"
                      type="number"
                      min="0"
                      value={policyForm.rules.freeCancellationHours}
                      onChange={(e) => setPolicyForm(prev => ({
                        ...prev,
                        rules: { ...prev.rules, freeCancellationHours: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="late-fee">Late Cancellation Fee ($)</Label>
                    <Input
                      id="late-fee"
                      type="number"
                      min="0"
                      value={policyForm.rules.lateCancellationFee}
                      onChange={(e) => setPolicyForm(prev => ({
                        ...prev,
                        rules: { ...prev.rules, lateCancellationFee: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="no-show-fee">No-Show Fee ($)</Label>
                    <Input
                      id="no-show-fee"
                      type="number"
                      min="0"
                      value={policyForm.rules.noShowFee}
                      onChange={(e) => setPolicyForm(prev => ({
                        ...prev,
                        rules: { ...prev.rules, noShowFee: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="refund-percent">Refund Percentage (%)</Label>
                    <Input
                      id="refund-percent"
                      type="number"
                      min="0"
                      max="100"
                      value={policyForm.rules.refundPercentage}
                      onChange={(e) => setPolicyForm(prev => ({
                        ...prev,
                        rules: { ...prev.rules, refundPercentage: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="policy-branch">Branch (Optional)</Label>
                  <Select
                    value={policyForm.branchId}
                    onValueChange={(value) => setPolicyForm(prev => ({ ...prev, branchId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Branches</SelectItem>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="policy-active"
                    checked={policyForm.isActive}
                    onCheckedChange={(checked) => setPolicyForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="policy-active">Policy is active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPolicyDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingPolicy ? handlePolicyUpdate : handlePolicyCreate}>
                    {editingPolicy ? 'Update Policy' : 'Create Policy'}
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
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-48">
              <SelectValue />
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
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="business_hours">Business Hours</SelectItem>
              <SelectItem value="max_bookings">Max Bookings</SelectItem>
              <SelectItem value="buffer_time">Buffer Time</SelectItem>
              <SelectItem value="advance_booking">Advance Booking</SelectItem>
              <SelectItem value="cancellation">Cancellation</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
              <SelectItem value="pricing">Pricing</SelectItem>
              <SelectItem value="staff_availability">Staff Availability</SelectItem>
              <SelectItem value="service_restrictions">Service Restrictions</SelectItem>
              <SelectItem value="customer_limits">Customer Limits</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Booking Rules</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="policies">Cancellation Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          {renderRulesList()}
        </TabsContent>

        <TabsContent value="hours">
          {renderBusinessHours()}
        </TabsContent>

        <TabsContent value="policies">
          {renderCancellationPolicies()}
        </TabsContent>
      </Tabs>

      {/* Business Hours Dialog */}
      <Dialog open={showHoursDialog} onOpenChange={setShowHoursDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Business Hours</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-7 gap-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <div key={day} className="space-y-2">
                  <Label className="capitalize font-medium">{day}</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${day}-closed`}
                      checked={(hoursForm[day as keyof typeof hoursForm] as any).closed}
                      onChange={(e) => setHoursForm(prev => ({
                        ...prev,
                        [day]: { ...(prev[day as keyof typeof prev] as any), closed: e.target.checked }
                      }))}
                    />
                    <Label htmlFor={`${day}-closed`} className="text-sm">Closed</Label>
                  </div>
                  {!((hoursForm[day as keyof typeof hoursForm] as any).closed) && (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={(hoursForm[day as keyof typeof hoursForm] as any).start}
                        onChange={(e) => setHoursForm(prev => ({
                          ...prev,
                          [day]: { ...(prev[day as keyof typeof prev] as any), start: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="Start"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={(hoursForm[day as keyof typeof hoursForm] as any).end}
                        onChange={(e) => setHoursForm(prev => ({
                          ...prev,
                          [day]: { ...(prev[day as keyof typeof prev] as any), end: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="End"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <Label>Holidays (comma-separated dates)</Label>
              <Input
                value={hoursForm.holidays.join(', ')}
                onChange={(e) => setHoursForm(prev => ({
                  ...prev,
                  holidays: e.target.value.split(',').map(d => d.trim()).filter(d => d)
                }))}
                placeholder="2024-01-01, 2024-12-25"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowHoursDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                onBusinessHoursUpdate(selectedBranch, hoursForm);
                setShowHoursDialog(false);
              }}>
                Update Hours
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};