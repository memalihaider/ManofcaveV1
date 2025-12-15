'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Edit,
  Search,
  Filter,
  Tag,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  UserCheck,
  UserX,
  MoreVertical,
  Eye,
  MessageSquare,
  Gift,
  Download,
  Upload,
  Trash2,
  Plus,
  Save,
  X,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Send,
  Target,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  joinDate: string;
  lastVisit: string;
  totalSpent: number;
  totalVisits: number;
  averageRating: number;
  membershipTier: string;
  loyaltyPoints: number;
  tags: string[];
  status: 'active' | 'inactive';
  notes: string;
  allergies: string;
  preferences: string;
}

export default function AdminClients() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state for create/edit client
  const [clientForm, setClientForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    membershipTier: 'Bronze',
    tags: [] as string[],
    notes: '',
    allergies: '',
    preferences: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mock clients data - replace with real API calls
  const clients: Client[] = [
    {
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      joinDate: '2025-01-15',
      lastVisit: '2025-12-10',
      totalSpent: 450,
      totalVisits: 8,
      averageRating: 4.8,
      membershipTier: 'Gold',
      loyaltyPoints: 1250,
      tags: ['VIP', 'Regular', 'Beard Care'],
      status: 'active',
      notes: 'Prefers fade haircuts, very satisfied with service',
      allergies: 'Sensitive to chemical fragrances',
      preferences: 'Morning appointments, classic styles'
    },
    {
      id: '2',
      fullName: 'Mike Johnson',
      email: 'mike.j@email.com',
      phone: '+1234567891',
      joinDate: '2025-03-20',
      lastVisit: '2025-12-08',
      totalSpent: 280,
      totalVisits: 5,
      averageRating: 4.6,
      membershipTier: 'Silver',
      loyaltyPoints: 750,
      tags: ['New Client', 'Hair Care'],
      status: 'active',
      notes: 'First-time client, learning preferences',
      allergies: 'None reported',
      preferences: 'Afternoon appointments preferred'
    },
    {
      id: '3',
      fullName: 'Sarah Wilson',
      email: 'sarah.w@email.com',
      phone: '+1234567892',
      joinDate: '2025-06-10',
      lastVisit: '2025-11-25',
      totalSpent: 150,
      totalVisits: 3,
      averageRating: 4.9,
      membershipTier: 'Bronze',
      loyaltyPoints: 300,
      tags: ['New Client', 'Female Client'],
      status: 'active',
      notes: 'Very particular about styling, excellent feedback',
      allergies: 'Latex allergy',
      preferences: 'Detailed consultations, premium products'
    },
    {
      id: '4',
      fullName: 'David Chen',
      email: 'david.c@email.com',
      phone: '+1234567893',
      joinDate: '2024-11-05',
      lastVisit: '2025-10-15',
      totalSpent: 620,
      totalVisits: 12,
      averageRating: 4.7,
      membershipTier: 'Platinum',
      loyaltyPoints: 1800,
      tags: ['VIP', 'High Spender', 'Regular'],
      status: 'inactive',
      notes: 'Long-time client, moved to another city',
      allergies: 'None reported',
      preferences: 'Quick service, consistent stylist'
    }
  ];

  const availableTags = [...new Set(clients.flatMap(client => client.tags))];

  const segments = [
    { id: 'all', name: 'All Clients', count: clients.length },
    { id: 'active', name: 'Active Clients', count: clients.filter(c => c.status === 'active').length },
    { id: 'inactive', name: 'Inactive Clients', count: clients.filter(c => c.status === 'inactive').length },
    { id: 'vip', name: 'VIP Clients', count: clients.filter(c => c.tags.includes('VIP')).length },
    { id: 'new', name: 'New Clients', count: clients.filter(c => c.tags.includes('New Client')).length },
    { id: 'high-spender', name: 'High Spenders', count: clients.filter(c => c.totalSpent > 400).length },
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesSegment = selectedSegment === 'all' ||
                          (selectedSegment === 'active' && client.status === 'active') ||
                          (selectedSegment === 'inactive' && client.status === 'inactive') ||
                          (selectedSegment === 'vip' && client.tags.includes('VIP')) ||
                          (selectedSegment === 'new' && client.tags.includes('New Client')) ||
                          (selectedSegment === 'high-spender' && client.totalSpent > 400);
    const matchesTag = selectedTag === 'all' || client.tags.includes(selectedTag);

    return matchesSearch && matchesSegment && matchesTag;
  });

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleCreateClient = () => {
    setClientForm({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      membershipTier: 'Bronze',
      tags: [],
      notes: '',
      allergies: '',
      preferences: '',
      status: 'active'
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setClientForm({
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      address: '',
      city: '',
      zipCode: '',
      membershipTier: client.membershipTier,
      tags: [...client.tags],
      notes: client.notes,
      allergies: client.allergies,
      preferences: client.preferences,
      status: client.status
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveClient = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isCreateDialogOpen) {
        // Create new client
        const newClient: Client = {
          id: `client-${Date.now()}`,
          ...clientForm,
          joinDate: new Date().toISOString().split('T')[0],
          lastVisit: new Date().toISOString().split('T')[0],
          totalSpent: 0,
          totalVisits: 0,
          averageRating: 0,
          loyaltyPoints: 0
        };
        // In real app, add to clients array
        console.log('Creating client:', newClient);
        setSuccess('Client created successfully!');
      } else {
        // Update existing client
        console.log('Updating client:', selectedClient?.id, clientForm);
        setSuccess('Client updated successfully!');
      }

      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      setError('Failed to save client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Deleting client:', clientId);
      setSuccess('Client deleted successfully!');
    } catch (error) {
      setError('Failed to delete client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedClients.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedClients.length} clients? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Bulk deleting clients:', selectedClients);
      setSelectedClients([]);
      setSuccess(`${selectedClients.length} clients deleted successfully!`);
      setIsBulkDialogOpen(false);
    } catch (error) {
      setError('Failed to delete clients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportClients = () => {
    const exportData = filteredClients.map(client => ({
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      joinDate: client.joinDate,
      lastVisit: client.lastVisit,
      totalSpent: client.totalSpent,
      totalVisits: client.totalVisits,
      averageRating: client.averageRating,
      membershipTier: client.membershipTier,
      loyaltyPoints: client.loyaltyPoints,
      tags: client.tags.join(', '),
      status: client.status,
      notes: client.notes,
      allergies: client.allergies,
      preferences: client.preferences
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(value =>
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClients = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      processImport(csv);
    };
    reader.readAsText(file);
  };

  const processImport = (csv: string) => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      setError('CSV must have at least a header row and one data row');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const expectedHeaders = ['fullName', 'email', 'phone', 'joinDate', 'lastVisit', 'totalSpent', 'totalVisits', 'averageRating', 'membershipTier', 'loyaltyPoints', 'tags', 'status', 'notes', 'allergies', 'preferences'];

    const errors: string[] = [];
    const importedClients: Partial<Client>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
        continue;
      }

      const client: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        if (header === 'tags') {
          client[header] = value ? value.split(',').map((t: string) => t.trim()) : [];
        } else if (['totalSpent', 'totalVisits', 'averageRating', 'loyaltyPoints'].includes(header)) {
          client[header] = parseFloat(value) || 0;
        } else {
          client[header] = value;
        }
      });

      // Validate required fields
      if (!client.fullName || !client.email) {
        errors.push(`Row ${i + 1}: Missing required fields (fullName, email)`);
        continue;
      }

      // Set defaults for missing fields
      client.id = `imported-${Date.now()}-${i}`;
      client.status = client.status || 'active';
      client.membershipTier = client.membershipTier || 'Bronze';
      client.tags = client.tags || [];
      client.notes = client.notes || '';
      client.allergies = client.allergies || '';
      client.preferences = client.preferences || '';

      importedClients.push(client);
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    // Mock import - in real app, save to database
    console.log('Importing clients:', importedClients);
    setSuccess(`${importedClients.length} clients imported successfully!`);
    setIsImportDialogOpen(false);
  };

  const handleSendMessage = (client: Client) => {
    // Mock message sending - in real app, integrate with email/SMS service
    console.log('Sending message to:', client.email);
    setSuccess(`Message sent to ${client.fullName}`);
  };

  const handleSendBulkMessage = () => {
    if (selectedClients.length === 0) return;
    console.log('Sending bulk message to:', selectedClients.length, 'clients');
    setSuccess(`Bulk message sent to ${selectedClients.length} clients`);
    setSelectedClients([]);
    setIsBulkDialogOpen(false);
  };

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleAllClients = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const getMembershipColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <ProtectedRoute requiredRole="branch_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar
          role="branch_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-0" : "lg:ml-0"}`}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar
                  role="branch_admin"
                  onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
                  <p className="text-sm text-gray-600">Manage client profiles, segmentation, and CRM data</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleExportClients}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handleCreateClient}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="clients">All Clients</TabsTrigger>
                  <TabsTrigger value="segments">Segments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Users className="w-8 h-8 text-blue-600 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                            <p className="text-sm text-gray-600">Total Clients</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <UserCheck className="w-8 h-8 text-green-600 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {clients.filter(c => c.status === 'active').length}
                            </p>
                            <p className="text-sm text-gray-600">Active Clients</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              ${clients.reduce((sum, c) => sum + c.totalSpent, 0)}
                            </p>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Star className="w-8 h-8 text-yellow-600 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {(clients.reduce((sum, c) => sum + c.averageRating, 0) / clients.length).toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-600">Avg Rating</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Segments Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Segments</CardTitle>
                      <CardDescription>Overview of client segmentation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {segments.slice(1).map((segment) => (
                          <div key={segment.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{segment.name}</p>
                                <p className="text-2xl font-bold text-primary">{segment.count}</p>
                              </div>
                              <Users className="w-8 h-8 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="clients" className="space-y-6">
                  {/* Filters */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search clients..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                          <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Select segment" />
                          </SelectTrigger>
                          <SelectContent>
                            {segments.map((segment) => (
                              <SelectItem key={segment.id} value={segment.id}>
                                {segment.name} ({segment.count})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={selectedTag} onValueChange={setSelectedTag}>
                          <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Select tag" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Tags</SelectItem>
                            {availableTags.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Clients Table */}
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                                onCheckedChange={toggleAllClients}
                              />
                            </TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Membership</TableHead>
                            <TableHead>Stats</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClients.map((client) => (
                            <TableRow key={client.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedClients.includes(client.id)}
                                  onCheckedChange={() => toggleClientSelection(client.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-gray-900">{client.fullName}</p>
                                  <p className="text-sm text-gray-600">Joined {client.joinDate}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm">
                                    <Mail className="w-3 h-3 mr-2 text-gray-400" />
                                    {client.email}
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Phone className="w-3 h-3 mr-2 text-gray-400" />
                                    {client.phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getMembershipColor(client.membershipTier)}>
                                  {client.membershipTier}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="w-3 h-3 mr-2 text-gray-400" />
                                    ${client.totalSpent}
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                                    {client.totalVisits} visits
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {client.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {client.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{client.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(client.status)}>
                                  {client.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleViewClient(client)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Send Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Gift className="w-4 h-4 mr-2" />
                                      Send Offer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Bulk Actions */}
                      {selectedClients.length > 0 && (
                        <div className="p-4 border-t bg-gray-50">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {selectedClients.length} client{selectedClients.length > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSendBulkMessage}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Send Message
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportClients}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export Selected
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Selected
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="segments" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {segments.map((segment) => (
                      <Card key={segment.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            {segment.name}
                            <Badge variant="secondary">{segment.count}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {segment.id === 'vip' && 'High-value clients with premium services'}
                            {segment.id === 'new' && 'Recently joined clients'}
                            {segment.id === 'high-spender' && 'Clients with high total spending'}
                            {segment.id === 'active' && 'Currently active clients'}
                            {segment.id === 'inactive' && 'Inactive or dormant clients'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedSegment(segment.id)}
                          >
                            View Clients
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Client Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedClient?.fullName}
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900">{selectedClient.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedClient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedClient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Membership</label>
                  <Badge className={getMembershipColor(selectedClient.membershipTier)}>
                    {selectedClient.membershipTier}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">${selectedClient.totalSpent}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedClient.totalVisits}</p>
                  <p className="text-sm text-gray-600">Total Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedClient.loyaltyPoints}</p>
                  <p className="text-sm text-gray-600">Loyalty Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedClient.averageRating}</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClient.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Preferences</label>
                  <p className="text-gray-900 mt-1">{selectedClient.preferences}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Allergies & Notes</label>
                  <p className="text-gray-900 mt-1">{selectedClient.allergies}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Additional Notes</label>
                  <p className="text-gray-900 mt-1">{selectedClient.notes}</p>
                </div>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>

      {/* Create/Edit Client Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setClientForm({
            fullName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zipCode: '',
            membershipTier: 'Bronze',
            tags: [],
            notes: '',
            allergies: '',
            preferences: '',
            status: 'active'
          });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? 'Create New Client' : 'Edit Client'}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen
                ? 'Add a new client to your database.'
                : 'Update client information.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveClient} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={clientForm.fullName}
                  onChange={(e) => setClientForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="membershipTier">Membership Tier</Label>
                <Select
                  value={clientForm.membershipTier}
                  onValueChange={(value) => setClientForm(prev => ({ ...prev, membershipTier: value as 'Bronze' | 'Silver' | 'Gold' | 'Platinum' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas"
                value={clientForm.tags.join(', ')}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={clientForm.status}
                onValueChange={(value) => setClientForm(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="List any allergies or sensitivities"
                value={clientForm.allergies}
                onChange={(e) => setClientForm(prev => ({ ...prev, allergies: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Preferences</Label>
              <Textarea
                id="preferences"
                placeholder="Client preferences and special requests"
                value={clientForm.preferences}
                onChange={(e) => setClientForm(prev => ({ ...prev, preferences: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the client"
                value={clientForm.notes}
                onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
                  setClientForm({
                    fullName: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    zipCode: '',
                    membershipTier: 'Bronze',
                    tags: [],
                    notes: '',
                    allergies: '',
                    preferences: '',
                    status: 'active'
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isCreateDialogOpen ? 'Create Client' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Clients Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Clients</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import multiple clients at once.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImportClients(file);
                  }
                }}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Import Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">CSV Format Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Columns: fullName, email, phone, membershipTier, tags, status, notes, allergies, preferences</li>
                <li>Tags should be comma-separated</li>
                <li>Membership tiers: Bronze, Silver, Gold, Platinum</li>
                <li>Status: Active, Inactive, Suspended</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}