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
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Ban,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Users,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer
} from "lucide-react";
import { format } from "date-fns";

export interface NoShowPolicy {
  id: string;
  name: string;
  description: string;
  branchId?: string;
  isActive: boolean;
  gracePeriodMinutes: number;
  noShowFee: number;
  feeType: 'fixed' | 'percentage' | 'service_based';
  maxNoShows: number;
  warningThreshold: number;
  actions: {
    chargeFee: boolean;
    sendWarning: boolean;
    restrictBooking: boolean;
    requireDeposit: boolean;
    blacklistCustomer: boolean;
    notifyStaff: boolean;
  };
  escalationRules: {
    afterNoShows: number;
    action: 'warning' | 'fee_increase' | 'booking_restriction' | 'blacklist' | 'deposit_required';
    feeMultiplier?: number;
    restrictionDuration?: number;
  }[];
  notificationTemplates: {
    warning: string;
    feeCharged: string;
    restrictionApplied: string;
    blacklistNotice: string;
  };
  exceptions: {
    customerIds: string[];
    reasons: string[];
    dates: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface NoShowIncident {
  id: string;
  customerId: string;
  customerName: string;
  appointmentId: string;
  serviceName: string;
  barberName: string;
  branchName: string;
  scheduledDate: string;
  noShowTime: string;
  gracePeriodExpired: boolean;
  feeCharged: number;
  feePaid: boolean;
  status: 'pending' | 'fee_charged' | 'fee_paid' | 'warning_sent' | 'restricted' | 'blacklisted' | 'resolved';
  reason?: string;
  notes?: string;
  followUpActions: {
    type: 'warning_sent' | 'fee_charged' | 'restriction_applied' | 'blacklist_applied' | 'deposit_required';
    timestamp: string;
    details?: string;
  }[];
  createdAt: string;
}

export interface NoShowAnalytics {
  totalNoShows: number;
  totalRevenueLost: number;
  averageNoShowRate: number;
  topNoShowServices: Array<{ service: string; count: number; rate: number }>;
  topNoShowCustomers: Array<{ customer: string; count: number; lastNoShow: string }>;
  noShowTrends: Array<{ date: string; count: number }>;
  branchComparison: Array<{ branch: string; noShowRate: number; totalAppointments: number }>;
}

interface NoShowPolicyManagerProps {
  policies: NoShowPolicy[];
  incidents: NoShowIncident[];
  analytics: NoShowAnalytics;
  branches: Array<{ id: string; name: string; location: string }>;
  customers: Array<{ id: string; name: string; email: string; phone: string }>;
  onPolicyCreate: (policy: Omit<NoShowPolicy, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onPolicyUpdate: (policyId: string, updates: Partial<NoShowPolicy>) => void;
  onPolicyDelete: (policyId: string) => void;
  onIncidentCreate: (incident: Omit<NoShowIncident, 'id' | 'createdAt'>) => void;
  onIncidentUpdate: (incidentId: string, updates: Partial<NoShowIncident>) => void;
  onIncidentResolve: (incidentId: string, resolution: string) => void;
  onFeeCharge: (incidentId: string, amount: number) => void;
  onSendWarning: (customerId: string, message: string) => void;
  onApplyRestriction: (customerId: string, duration: number) => void;
  onBlacklistCustomer: (customerId: string, reason: string) => void;
}

export function NoShowPolicyManager({
  policies,
  incidents,
  analytics,
  branches,
  customers,
  onPolicyCreate,
  onPolicyUpdate,
  onPolicyDelete,
  onIncidentCreate,
  onIncidentUpdate,
  onIncidentResolve,
  onFeeCharge,
  onSendWarning,
  onApplyRestriction,
  onBlacklistCustomer
}: NoShowPolicyManagerProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<NoShowPolicy | null>(null);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<NoShowPolicy | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Policy form state
  const [policyForm, setPolicyForm] = useState({
    name: '',
    description: '',
    branchId: '',
    isActive: true,
    gracePeriodMinutes: 15,
    noShowFee: 25,
    feeType: 'fixed' as NoShowPolicy['feeType'],
    maxNoShows: 3,
    warningThreshold: 2,
    actions: {
      chargeFee: true,
      sendWarning: true,
      restrictBooking: false,
      requireDeposit: false,
      blacklistCustomer: false,
      notifyStaff: true
    },
    escalationRules: [] as NoShowPolicy['escalationRules'],
    notificationTemplates: {
      warning: 'You have been marked as a no-show. Please contact us to reschedule.',
      feeCharged: 'A no-show fee of ${fee} has been charged to your account.',
      restrictionApplied: 'Due to multiple no-shows, your booking privileges have been restricted.',
      blacklistNotice: 'Your account has been blacklisted due to excessive no-shows.'
    },
    exceptions: {
      customerIds: [] as string[],
      reasons: [] as string[],
      dates: [] as string[]
    }
  });

  // Incident form state
  const [incidentForm, setIncidentForm] = useState({
    customerId: '',
    customerName: '',
    appointmentId: '',
    serviceName: '',
    barberName: '',
    branchName: '',
    scheduledDate: '',
    noShowTime: '',
    gracePeriodExpired: true,
    feeCharged: 0,
    feePaid: false,
    status: 'pending' as NoShowIncident['status'],
    reason: '',
    notes: '',
    followUpActions: [] as NoShowIncident['followUpActions']
  });

  // Reset forms
  const resetPolicyForm = () => {
    setPolicyForm({
      name: '',
      description: '',
      branchId: '',
      isActive: true,
      gracePeriodMinutes: 15,
      noShowFee: 25,
      feeType: 'fixed',
      maxNoShows: 3,
      warningThreshold: 2,
      actions: {
        chargeFee: true,
        sendWarning: true,
        restrictBooking: false,
        requireDeposit: false,
        blacklistCustomer: false,
        notifyStaff: true
      },
      escalationRules: [],
      notificationTemplates: {
        warning: 'You have been marked as a no-show. Please contact us to reschedule.',
        feeCharged: 'A no-show fee of ${fee} has been charged to your account.',
        restrictionApplied: 'Due to multiple no-shows, your booking privileges have been restricted.',
        blacklistNotice: 'Your account has been blacklisted due to excessive no-shows.'
      },
      exceptions: {
        customerIds: [],
        reasons: [],
        dates: []
      }
    });
  };

  const resetIncidentForm = () => {
    setIncidentForm({
      customerId: '',
      customerName: '',
      appointmentId: '',
      serviceName: '',
      barberName: '',
      branchName: '',
      scheduledDate: '',
      noShowTime: '',
      gracePeriodExpired: true,
      feeCharged: 0,
      feePaid: false,
      status: 'pending',
      reason: '',
      notes: '',
      followUpActions: []
    });
  };

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchesBranch = selectedBranch === 'all' || incident.branchName === selectedBranch;
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    return matchesBranch && matchesStatus;
  });

  // Handle policy creation
  const handlePolicyCreate = () => {
    if (!policyForm.name || !policyForm.description) return;

    onPolicyCreate({
      ...policyForm,
      exceptions: {
        ...policyForm.exceptions,
        customerIds: policyForm.exceptions.customerIds.filter(id => id.trim() !== ''),
        reasons: policyForm.exceptions.reasons.filter(r => r.trim() !== ''),
        dates: policyForm.exceptions.dates.filter(d => d.trim() !== '')
      }
    });

    resetPolicyForm();
    setShowPolicyDialog(false);
  };

  // Handle policy update
  const handlePolicyUpdate = () => {
    if (!editingPolicy) return;

    onPolicyUpdate(editingPolicy.id, {
      ...policyForm,
      exceptions: {
        ...policyForm.exceptions,
        customerIds: policyForm.exceptions.customerIds.filter(id => id.trim() !== ''),
        reasons: policyForm.exceptions.reasons.filter(r => r.trim() !== ''),
        dates: policyForm.exceptions.dates.filter(d => d.trim() !== '')
      }
    });

    setEditingPolicy(null);
    setShowPolicyDialog(false);
  };

  // Handle incident creation
  const handleIncidentCreate = () => {
    if (!incidentForm.customerId || !incidentForm.appointmentId) return;

    onIncidentCreate(incidentForm);
    resetIncidentForm();
    setShowIncidentDialog(false);
  };

  // Get status color
  const getStatusColor = (status: NoShowIncident['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fee_charged': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'fee_paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning_sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'restricted': return 'bg-red-100 text-red-800 border-red-200';
      case 'blacklisted': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'resolved': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Render policies list
  const renderPoliciesList = () => (
    <div className="space-y-4">
      {policies.map(policy => (
        <Card key={policy.id} className="cursor-pointer hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{policy.name}</h3>
                <p className="text-sm text-gray-600">{policy.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={policy.isActive ? "default" : "secondary"}>
                    {policy.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">
                    {policy.branchId ? branches.find(b => b.id === policy.branchId)?.name : 'All Branches'}
                  </Badge>
                </div>
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
                      branchId: policy.branchId || '',
                      isActive: policy.isActive,
                      gracePeriodMinutes: policy.gracePeriodMinutes,
                      noShowFee: policy.noShowFee,
                      feeType: policy.feeType,
                      maxNoShows: policy.maxNoShows,
                      warningThreshold: policy.warningThreshold,
                      actions: { ...policy.actions },
                      escalationRules: [...policy.escalationRules],
                      notificationTemplates: { ...policy.notificationTemplates },
                      exceptions: { ...policy.exceptions }
                    });
                    setShowPolicyDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPolicyDelete(policy.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Grace Period:</span>
                <p className="font-medium">{policy.gracePeriodMinutes} minutes</p>
              </div>
              <div>
                <span className="text-gray-500">No-Show Fee:</span>
                <p className="font-medium">${policy.noShowFee} ({policy.feeType})</p>
              </div>
              <div>
                <span className="text-gray-500">Max No-Shows:</span>
                <p className="font-medium">{policy.maxNoShows}</p>
              </div>
              <div>
                <span className="text-gray-500">Warning After:</span>
                <p className="font-medium">{policy.warningThreshold} no-shows</p>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-gray-500 text-sm">Actions:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {policy.actions.chargeFee && <Badge variant="outline">Charge Fee</Badge>}
                {policy.actions.sendWarning && <Badge variant="outline">Send Warning</Badge>}
                {policy.actions.restrictBooking && <Badge variant="outline">Restrict Booking</Badge>}
                {policy.actions.requireDeposit && <Badge variant="outline">Require Deposit</Badge>}
                {policy.actions.blacklistCustomer && <Badge variant="outline">Blacklist</Badge>}
                {policy.actions.notifyStaff && <Badge variant="outline">Notify Staff</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render incidents table
  const renderIncidentsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredIncidents.map(incident => (
          <TableRow key={incident.id}>
            <TableCell>
              <div>
                <p className="font-medium">{incident.customerName}</p>
                <p className="text-sm text-gray-500">{incident.branchName}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{incident.serviceName}</p>
                <p className="text-sm text-gray-500">{incident.barberName}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p>{format(new Date(incident.scheduledDate), 'MMM dd, yyyy')}</p>
                <p className="text-sm text-gray-500">
                  No-show: {format(new Date(incident.noShowTime), 'HH:mm')}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(incident.status)}>
                {incident.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium">${incident.feeCharged}</p>
                <p className="text-sm text-gray-500">
                  {incident.feePaid ? 'Paid' : 'Unpaid'}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {incident.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFeeCharge(incident.id, incident.feeCharged)}
                    >
                      <DollarSign className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSendWarning(incident.customerId, 'No-show warning')}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onIncidentResolve(incident.id, 'Resolved manually')}
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Render analytics
  const renderAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total No-Shows</p>
              <p className="text-2xl font-bold">{analytics.totalNoShows}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue Lost</p>
              <p className="text-2xl font-bold">${analytics.totalRevenueLost}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rate</p>
              <p className="text-2xl font-bold">{analytics.averageNoShowRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Repeat Offenders</p>
              <p className="text-2xl font-bold">{analytics.topNoShowCustomers.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">No-Show Policy Manager</h1>
          <p className="text-gray-600">Manage no-show policies, track incidents, and enforce penalties</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetPolicyForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPolicy ? 'Edit No-Show Policy' : 'Create No-Show Policy'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                    <TabsTrigger value="escalation">Escalation</TabsTrigger>
                    <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="policy-name">Policy Name</Label>
                        <Input
                          id="policy-name"
                          value={policyForm.name}
                          onChange={(e) => setPolicyForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Standard No-Show Policy"
                        />
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
                    </div>

                    <div>
                      <Label htmlFor="policy-description">Description</Label>
                      <Textarea
                        id="policy-description"
                        value={policyForm.description}
                        onChange={(e) => setPolicyForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the no-show policy..."
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="grace-period">Grace Period (minutes)</Label>
                        <Input
                          id="grace-period"
                          type="number"
                          min="0"
                          value={policyForm.gracePeriodMinutes}
                          onChange={(e) => setPolicyForm(prev => ({
                            ...prev,
                            gracePeriodMinutes: parseInt(e.target.value) || 0
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="no-show-fee">No-Show Fee</Label>
                        <Input
                          id="no-show-fee"
                          type="number"
                          min="0"
                          value={policyForm.noShowFee}
                          onChange={(e) => setPolicyForm(prev => ({
                            ...prev,
                            noShowFee: parseFloat(e.target.value) || 0
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fee-type">Fee Type</Label>
                        <Select
                          value={policyForm.feeType}
                          onValueChange={(value: NoShowPolicy['feeType']) => setPolicyForm(prev => ({ ...prev, feeType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="percentage">Percentage of Service</SelectItem>
                            <SelectItem value="service_based">Service Based</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="max-no-shows">Max No-Shows</Label>
                        <Input
                          id="max-no-shows"
                          type="number"
                          min="1"
                          value={policyForm.maxNoShows}
                          onChange={(e) => setPolicyForm(prev => ({
                            ...prev,
                            maxNoShows: parseInt(e.target.value) || 1
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="warning-threshold">Warning Threshold</Label>
                        <Input
                          id="warning-threshold"
                          type="number"
                          min="1"
                          value={policyForm.warningThreshold}
                          onChange={(e) => setPolicyForm(prev => ({
                            ...prev,
                            warningThreshold: parseInt(e.target.value) || 1
                          }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Switch
                          id="policy-active"
                          checked={policyForm.isActive}
                          onCheckedChange={(checked) => setPolicyForm(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="policy-active">Policy is active</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="charge-fee"
                          checked={policyForm.actions.chargeFee}
                          onCheckedChange={(checked) => setPolicyForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, chargeFee: checked }
                          }))}
                        />
                        <Label htmlFor="charge-fee">Charge no-show fee</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="send-warning"
                          checked={policyForm.actions.sendWarning}
                          onCheckedChange={(checked) => setPolicyForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, sendWarning: checked }
                          }))}
                        />
                        <Label htmlFor="send-warning">Send warning notification</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="restrict-booking"
                          checked={policyForm.actions.restrictBooking}
                          onCheckedChange={(checked) => setPolicyForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, restrictBooking: checked }
                          }))}
                        />
                        <Label htmlFor="restrict-booking">Restrict future bookings</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="require-deposit"
                          checked={policyForm.actions.requireDeposit}
                          onCheckedChange={(checked) => setPolicyForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, requireDeposit: checked }
                          }))}
                        />
                        <Label htmlFor="require-deposit">Require deposit for future bookings</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="blacklist-customer"
                          checked={policyForm.actions.blacklistCustomer}
                          onCheckedChange={(checked) => setPolicyForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, blacklistCustomer: checked }
                          }))}
                        />
                        <Label htmlFor="blacklist-customer">Blacklist customer after max no-shows</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="notify-staff"
                          checked={policyForm.actions.notifyStaff}
                          onCheckedChange={(checked) => setPolicyForm(prev => ({
                            ...prev,
                            actions: { ...prev.actions, notifyStaff: checked }
                          }))}
                        />
                        <Label htmlFor="notify-staff">Notify staff of no-shows</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="escalation" className="space-y-4">
                    <div>
                      <Label>Escalation Rules</Label>
                      <div className="space-y-2 mt-2">
                        {policyForm.escalationRules.map((rule, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <span>After {rule.afterNoShows} no-shows:</span>
                            <Select
                              value={rule.action}
                              onValueChange={(value: typeof rule.action) => {
                                const newRules = [...policyForm.escalationRules];
                                newRules[index].action = value;
                                setPolicyForm(prev => ({ ...prev, escalationRules: newRules }));
                              }}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="warning">Send Warning</SelectItem>
                                <SelectItem value="fee_increase">Increase Fee</SelectItem>
                                <SelectItem value="booking_restriction">Restrict Booking</SelectItem>
                                <SelectItem value="blacklist">Blacklist</SelectItem>
                                <SelectItem value="deposit_required">Require Deposit</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newRules = policyForm.escalationRules.filter((_, i) => i !== index);
                                setPolicyForm(prev => ({ ...prev, escalationRules: newRules }));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPolicyForm(prev => ({
                              ...prev,
                              escalationRules: [...prev.escalationRules, {
                                afterNoShows: prev.escalationRules.length + 1,
                                action: 'warning'
                              }]
                            }));
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Escalation Rule
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="exceptions" className="space-y-4">
                    <div>
                      <Label htmlFor="exception-customers">Exception Customer IDs (comma-separated)</Label>
                      <Input
                        id="exception-customers"
                        value={policyForm.exceptions.customerIds.join(', ')}
                        onChange={(e) => setPolicyForm(prev => ({
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
                      <Label htmlFor="exception-reasons">Exception Reasons (comma-separated)</Label>
                      <Input
                        id="exception-reasons"
                        value={policyForm.exceptions.reasons.join(', ')}
                        onChange={(e) => setPolicyForm(prev => ({
                          ...prev,
                          exceptions: {
                            ...prev.exceptions,
                            reasons: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                          }
                        }))}
                        placeholder="emergency, medical, transportation"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exception-dates">Exception Dates (comma-separated)</Label>
                      <Input
                        id="exception-dates"
                        value={policyForm.exceptions.dates.join(', ')}
                        onChange={(e) => setPolicyForm(prev => ({
                          ...prev,
                          exceptions: {
                            ...prev.exceptions,
                            dates: e.target.value.split(',').map(d => d.trim()).filter(d => d)
                          }
                        }))}
                        placeholder="2024-01-01, 2024-12-25"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

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

          <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetIncidentForm}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report No-Show
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report No-Show Incident</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="incident-customer">Customer</Label>
                    <Select
                      value={incidentForm.customerId}
                      onValueChange={(value) => {
                        const customer = customers.find(c => c.id === value);
                        setIncidentForm(prev => ({
                          ...prev,
                          customerId: value,
                          customerName: customer?.name || ''
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="incident-appointment">Appointment ID</Label>
                    <Input
                      id="incident-appointment"
                      value={incidentForm.appointmentId}
                      onChange={(e) => setIncidentForm(prev => ({ ...prev, appointmentId: e.target.value }))}
                      placeholder="Appointment ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="incident-service">Service</Label>
                    <Input
                      id="incident-service"
                      value={incidentForm.serviceName}
                      onChange={(e) => setIncidentForm(prev => ({ ...prev, serviceName: e.target.value }))}
                      placeholder="Service name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="incident-barber">Barber</Label>
                    <Input
                      id="incident-barber"
                      value={incidentForm.barberName}
                      onChange={(e) => setIncidentForm(prev => ({ ...prev, barberName: e.target.value }))}
                      placeholder="Barber name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="incident-branch">Branch</Label>
                    <Select
                      value={incidentForm.branchName}
                      onValueChange={(value) => setIncidentForm(prev => ({ ...prev, branchName: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.name}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="incident-date">Scheduled Date</Label>
                    <Input
                      id="incident-date"
                      type="date"
                      value={incidentForm.scheduledDate}
                      onChange={(e) => setIncidentForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="incident-time">No-Show Time</Label>
                    <Input
                      id="incident-time"
                      type="datetime-local"
                      value={incidentForm.noShowTime}
                      onChange={(e) => setIncidentForm(prev => ({ ...prev, noShowTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="incident-fee">Fee Charged</Label>
                    <Input
                      id="incident-fee"
                      type="number"
                      min="0"
                      value={incidentForm.feeCharged}
                      onChange={(e) => setIncidentForm(prev => ({
                        ...prev,
                        feeCharged: parseFloat(e.target.value) || 0
                      }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="fee-paid"
                      checked={incidentForm.feePaid}
                      onCheckedChange={(checked) => setIncidentForm(prev => ({ ...prev, feePaid: checked }))}
                    />
                    <Label htmlFor="fee-paid">Fee Paid</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="incident-reason">Reason (Optional)</Label>
                  <Textarea
                    id="incident-reason"
                    value={incidentForm.reason}
                    onChange={(e) => setIncidentForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Reason for no-show..."
                  />
                </div>

                <div>
                  <Label htmlFor="incident-notes">Notes</Label>
                  <Textarea
                    id="incident-notes"
                    value={incidentForm.notes}
                    onChange={(e) => setIncidentForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowIncidentDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleIncidentCreate}>
                    Report No-Show
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
          <Label>Status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="fee_charged">Fee Charged</SelectItem>
              <SelectItem value="fee_paid">Fee Paid</SelectItem>
              <SelectItem value="warning_sent">Warning Sent</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
              <SelectItem value="blacklisted">Blacklisted</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="policies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="policies">Policies ({policies.length})</TabsTrigger>
          <TabsTrigger value="incidents">Incidents ({incidents.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="policies">
          {renderPoliciesList()}
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardContent className="p-0">
              {renderIncidentsTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {renderAnalytics()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top No-Show Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topNoShowServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{service.service}</span>
                        <div className="text-right">
                          <p className="font-bold">{service.count} no-shows</p>
                          <p className="text-sm text-gray-500">{service.rate.toFixed(1)}% rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Repeat Offenders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topNoShowCustomers.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{customer.customer}</span>
                        <div className="text-right">
                          <p className="font-bold">{customer.count} no-shows</p>
                          <p className="text-sm text-gray-500">
                            Last: {format(new Date(customer.lastNoShow), 'MMM dd')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};