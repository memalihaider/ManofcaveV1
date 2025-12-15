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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  History,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  Eye,
  Download,
  Upload,
  Star,
  Flag,
  Tag
} from "lucide-react";
import { format } from "date-fns";

export interface AppointmentNote {
  id: string;
  appointmentId: string;
  authorId: string;
  authorName: string;
  authorRole: 'customer' | 'staff' | 'admin' | 'super_admin';
  type: 'general' | 'medical' | 'preference' | 'complaint' | 'compliment' | 'follow_up' | 'cancellation' | 'reschedule' | 'payment' | 'system';
  content: string;
  isPrivate: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'resolved' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationLog {
  id: string;
  appointmentId: string;
  type: 'email' | 'sms' | 'phone' | 'in_person' | 'system_notification';
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  metadata?: {
    emailId?: string;
    smsId?: string;
    callDuration?: number;
    recordingUrl?: string;
  };
}

export interface AppointmentHistory {
  id: string;
  appointmentId: string;
  action: 'created' | 'updated' | 'cancelled' | 'rescheduled' | 'completed' | 'no_show' | 'confirmed' | 'paid' | 'refunded' | 'reviewed';
  actorId: string;
  actorName: string;
  actorRole: 'customer' | 'staff' | 'admin' | 'super_admin' | 'system';
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  reason?: string;
  notes?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

interface AppointmentNotesHistoryProps {
  appointmentId: string;
  notes: AppointmentNote[];
  communications: CommunicationLog[];
  history: AppointmentHistory[];
  currentUser: {
    id: string;
    name: string;
    role: 'customer' | 'staff' | 'admin' | 'super_admin';
  };
  onNoteCreate: (note: Omit<AppointmentNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onNoteUpdate: (noteId: string, updates: Partial<AppointmentNote>) => void;
  onNoteDelete: (noteId: string) => void;
  onCommunicationSend: (communication: Omit<CommunicationLog, 'id' | 'sentAt'>) => void;
  onAttachmentUpload: (noteId: string, file: File) => Promise<void>;
  onAttachmentDownload: (attachmentId: string) => void;
}

export function AppointmentNotesHistory({
  appointmentId,
  notes,
  communications,
  history,
  currentUser,
  onNoteCreate,
  onNoteUpdate,
  onNoteDelete,
  onCommunicationSend,
  onAttachmentUpload,
  onAttachmentDownload
}: AppointmentNotesHistoryProps) {
  const [selectedNote, setSelectedNote] = useState<AppointmentNote | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<AppointmentNote | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Note form state
  const [noteForm, setNoteForm] = useState({
    type: 'general' as AppointmentNote['type'],
    content: '',
    isPrivate: false,
    tags: [] as string[],
    priority: 'medium' as AppointmentNote['priority'],
    status: 'active' as AppointmentNote['status']
  });

  // Communication form state
  const [communicationForm, setCommunicationForm] = useState({
    type: 'email' as CommunicationLog['type'],
    direction: 'outbound' as CommunicationLog['direction'],
    to: '',
    subject: '',
    content: ''
  });

  // Reset forms
  const resetNoteForm = () => {
    setNoteForm({
      type: 'general',
      content: '',
      isPrivate: false,
      tags: [],
      priority: 'medium',
      status: 'active'
    });
  };

  const resetCommunicationForm = () => {
    setCommunicationForm({
      type: 'email',
      direction: 'outbound',
      to: '',
      subject: '',
      content: ''
    });
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesType = filterType === 'all' || note.type === filterType;
    const matchesStatus = filterStatus === 'all' || note.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesStatus && matchesSearch;
  });

  // Handle note creation
  const handleNoteCreate = () => {
    if (!noteForm.content.trim()) return;

    onNoteCreate({
      appointmentId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      ...noteForm,
      tags: noteForm.tags.filter(tag => tag.trim() !== ''),
      attachments: []
    });

    resetNoteForm();
    setShowNoteDialog(false);
  };

  // Handle note update
  const handleNoteUpdate = () => {
    if (!editingNote || !noteForm.content.trim()) return;

    onNoteUpdate(editingNote.id, {
      ...noteForm,
      tags: noteForm.tags.filter(tag => tag.trim() !== ''),
      updatedAt: new Date().toISOString()
    });

    setEditingNote(null);
    setShowNoteDialog(false);
  };

  // Handle communication send
  const handleCommunicationSend = () => {
    if (!communicationForm.content.trim()) return;

    onCommunicationSend({
      appointmentId,
      ...communicationForm,
      from: currentUser.name,
      status: 'pending'
    });

    resetCommunicationForm();
    setShowCommunicationDialog(false);
  };

  // Get note type color
  const getNoteTypeColor = (type: AppointmentNote['type']) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medical': return 'bg-red-100 text-red-800 border-red-200';
      case 'preference': return 'bg-green-100 text-green-800 border-green-200';
      case 'complaint': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'compliment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'follow_up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancellation': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'reschedule': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'payment': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'system': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: AppointmentNote['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get communication type icon
  const getCommunicationIcon = (type: CommunicationLog['type']) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in_person': return <User className="w-4 h-4" />;
      case 'system_notification': return <AlertCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status: CommunicationLog['status']) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'read': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Render notes list
  const renderNotesList = () => (
    <div className="space-y-4">
      {filteredNotes.map(note => (
        <Card key={note.id} className="cursor-pointer hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {note.authorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{note.authorName}</span>
                    <Badge variant="outline" className="text-xs">
                      {note.authorRole}
                    </Badge>
                    <Badge className={getNoteTypeColor(note.type)}>
                      {note.type.replace('_', ' ')}
                    </Badge>
                    {note.isPrivate && (
                      <Badge variant="destructive" className="text-xs">
                        Private
                      </Badge>
                    )}
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(note.priority)}`} />
                  </div>

                  <p className="text-gray-700 mb-3">{note.content}</p>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {note.attachments && note.attachments.length > 0 && (
                    <div className="space-y-2 mb-3">
                      <Label className="text-sm font-medium">Attachments:</Label>
                      <div className="flex flex-wrap gap-2">
                        {note.attachments.map(attachment => (
                          <Button
                            key={attachment.id}
                            variant="outline"
                            size="sm"
                            onClick={() => onAttachmentDownload(attachment.id)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            {attachment.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                    <Badge variant={note.status === 'active' ? 'default' : 'secondary'}>
                      {note.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingNote(note);
                    setNoteForm({
                      type: note.type,
                      content: note.content,
                      isPrivate: note.isPrivate,
                      tags: note.tags || [],
                      priority: note.priority,
                      status: note.status
                    });
                    setShowNoteDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNoteDelete(note.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render communications
  const renderCommunications = () => (
    <div className="space-y-4">
      {communications.map(comm => (
        <Card key={comm.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getCommunicationIcon(comm.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    {comm.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                  </Badge>
                  <Badge variant="outline">
                    {comm.type.replace('_', ' ')}
                  </Badge>
                  {getStatusIcon(comm.status)}
                  <span className="text-sm text-gray-500">
                    {format(new Date(comm.sentAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">From:</span> {comm.from} •
                  <span className="font-medium ml-2">To:</span> {comm.to}
                </div>

                {comm.subject && (
                  <div className="font-medium mb-2">{comm.subject}</div>
                )}

                <p className="text-gray-700">{comm.content}</p>

                {comm.metadata && (
                  <div className="mt-2 text-xs text-gray-500">
                    {comm.metadata.callDuration && (
                      <span>Duration: {comm.metadata.callDuration}s</span>
                    )}
                    {comm.metadata.recordingUrl && (
                      <Button variant="link" size="sm" className="p-0 h-auto ml-2">
                        <Download className="w-3 h-3 mr-1" />
                        Recording
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render history
  const renderHistory = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Changes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map(entry => (
          <TableRow key={entry.id}>
            <TableCell>
              {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm:ss')}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {entry.action.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {entry.actorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{entry.actorName}</span>
                <Badge variant="secondary" className="text-xs">
                  {entry.actorRole}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {entry.reason && <p><strong>Reason:</strong> {entry.reason}</p>}
                {entry.notes && <p><strong>Notes:</strong> {entry.notes}</p>}
              </div>
            </TableCell>
            <TableCell>
              {entry.changes && entry.changes.length > 0 && (
                <div className="text-xs space-y-1">
                  {entry.changes.map((change, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded">
                      <strong>{change.field}:</strong>
                      <div className="text-red-600">Old: {JSON.stringify(change.oldValue)}</div>
                      <div className="text-green-600">New: {JSON.stringify(change.newValue)}</div>
                    </div>
                  ))}
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointment Notes & History</h1>
          <p className="text-gray-600">Manage notes, communications, and appointment history</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetNoteForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="note-type">Note Type</Label>
                    <Select
                      value={noteForm.type}
                      onValueChange={(value: AppointmentNote['type']) => setNoteForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="preference">Preference</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="compliment">Compliment</SelectItem>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                        <SelectItem value="cancellation">Cancellation</SelectItem>
                        <SelectItem value="reschedule">Reschedule</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="note-priority">Priority</Label>
                    <Select
                      value={noteForm.priority}
                      onValueChange={(value: AppointmentNote['priority']) => setNoteForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="note-content">Content</Label>
                  <Textarea
                    id="note-content"
                    value={noteForm.content}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter note content..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="note-tags">Tags (comma-separated)</Label>
                  <Input
                    id="note-tags"
                    value={noteForm.tags.join(', ')}
                    onChange={(e) => setNoteForm(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))}
                    placeholder="important, follow-up, medical"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="note-status">Status</Label>
                    <Select
                      value={noteForm.status}
                      onValueChange={(value: AppointmentNote['status']) => setNoteForm(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="note-private"
                      checked={noteForm.isPrivate}
                      onChange={(e) => setNoteForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                    />
                    <Label htmlFor="note-private">Private note (only visible to staff)</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingNote ? handleNoteUpdate : handleNoteCreate}>
                    {editingNote ? 'Update Note' : 'Add Note'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCommunicationDialog} onOpenChange={setShowCommunicationDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetCommunicationForm}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Communication</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="comm-type">Type</Label>
                    <Select
                      value={communicationForm.type}
                      onValueChange={(value: CommunicationLog['type']) => setCommunicationForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="in_person">In Person</SelectItem>
                        <SelectItem value="system_notification">System Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="comm-direction">Direction</Label>
                    <Select
                      value={communicationForm.direction}
                      onValueChange={(value: CommunicationLog['direction']) => setCommunicationForm(prev => ({ ...prev, direction: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outbound">Outbound</SelectItem>
                        <SelectItem value="inbound">Inbound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="comm-to">To</Label>
                    <Input
                      id="comm-to"
                      value={communicationForm.to}
                      onChange={(e) => setCommunicationForm(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="Recipient"
                    />
                  </div>
                  {(communicationForm.type === 'email' || communicationForm.type === 'system_notification') && (
                    <div>
                      <Label htmlFor="comm-subject">Subject</Label>
                      <Input
                        id="comm-subject"
                        value={communicationForm.subject}
                        onChange={(e) => setCommunicationForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Subject line"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="comm-content">Content</Label>
                  <Textarea
                    id="comm-content"
                    value={communicationForm.content}
                    onChange={(e) => setCommunicationForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter message content..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCommunicationDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCommunicationSend}>
                    Send Message
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
          <Label>Type:</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="preference">Preference</SelectItem>
              <SelectItem value="complaint">Complaint</SelectItem>
              <SelectItem value="compliment">Compliment</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
              <SelectItem value="cancellation">Cancellation</SelectItem>
              <SelectItem value="reschedule">Reschedule</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="system">System</SelectItem>
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
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="communications">Communications ({communications.length})</TabsTrigger>
          <TabsTrigger value="history">History ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          {renderNotesList()}
        </TabsContent>

        <TabsContent value="communications">
          {renderCommunications()}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              {renderHistory()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};