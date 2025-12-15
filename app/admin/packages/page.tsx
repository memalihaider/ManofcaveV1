'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useServicesStore, type ServicePackage } from '@/stores/services.store';
import {
  Package,
  Plus,
  Edit,
  Search,
  Filter,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  Trash2,
  Percent,
  Scissors
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminPackages() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    selectedServices: [] as string[],
    discountPercentage: 15,
    branches: [] as string[],
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const { services, packages, addPackage, getPackagesByBranch, getServicesByBranch } = useServicesStore();

  const availableServices = getServicesByBranch();
  const allPackages = getPackagesByBranch();

  const filteredPackages = allPackages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' ||
                         (pkg.branches && pkg.branches.includes(selectedBranch));

    return matchesSearch && matchesBranch;
  });

  const handleCreatePackage = () => {
    if (newPackage.name && newPackage.selectedServices.length > 0) {
      // Calculate package details
      const selectedServiceObjects = availableServices.filter(s =>
        newPackage.selectedServices.includes(s.id)
      );

      const totalPrice = selectedServiceObjects.reduce((sum, s) => sum + (s.price || 0), 0);
      const discountedPrice = totalPrice * (1 - newPackage.discountPercentage / 100);
      const totalDuration = selectedServiceObjects.reduce((sum, s) => sum + (s.duration || 0), 0);

      const packageData = {
        name: newPackage.name,
        description: newPackage.description,
        services: selectedServiceObjects,
        totalPrice,
        discountedPrice,
        discountPercentage: newPackage.discountPercentage,
        duration: totalDuration,
        branches: newPackage.branches.length > 0 ? newPackage.branches : undefined,
        isActive: true
      };

      addPackage(packageData);

      setNewPackage({
        name: '',
        description: '',
        selectedServices: [],
        discountPercentage: 15,
        branches: [],
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleViewPackage = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setIsViewDialogOpen(true);
  };

  const toggleServiceSelection = (serviceId: string) => {
    setNewPackage(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const toggleBranchSelection = (branchId: string) => {
    setNewPackage(prev => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter(id => id !== branchId)
        : [...prev.branches, branchId]
    }));
  };

  const branches = ['branch1', 'branch2', 'branch3']; // Mock branches

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
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
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
                  <h1 className="text-2xl font-bold text-gray-900">Package Management</h1>
                  <p className="text-sm text-gray-600">Create and manage bundled service packages</p>
                </div>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Package
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Package className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                        <p className="text-sm text-gray-600">Total Packages</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {packages.filter(p => p.isActive).length}
                        </p>
                        <p className="text-sm text-gray-600">Active Packages</p>
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
                          ${packages.reduce((sum, p) => sum + p.discountedPrice, 0)}
                        </p>
                        <p className="text-sm text-gray-600">Total Value</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Percent className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(packages.reduce((sum, p) => sum + p.discountPercentage, 0) / packages.length)}%
                        </p>
                        <p className="text-sm text-gray-600">Avg Discount</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search packages..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Packages Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Services</TableHead>
                        <TableHead>Pricing</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{pkg.name}</p>
                              <p className="text-sm text-gray-600">{pkg.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Scissors className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{pkg.services.length} services</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <DollarSign className="w-3 h-3 mr-1 text-gray-400" />
                                <span className="line-through text-gray-500">${pkg.totalPrice}</span>
                                <span className="ml-2 font-medium text-green-600">${pkg.discountedPrice}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {pkg.discountPercentage}% off
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Clock className="w-3 h-3 mr-1 text-gray-400" />
                              {pkg.duration} min
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {pkg.isActive ? 'Active' : 'Inactive'}
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
                                <DropdownMenuItem onClick={() => handleViewPackage(pkg)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Package
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Package
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Create Package Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Service Package</DialogTitle>
            <DialogDescription>
              Bundle multiple services into a discounted package
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name
                </label>
                <Input
                  value={newPackage.name}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Premium Grooming Package"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage
                </label>
                <Input
                  type="number"
                  value={newPackage.discountPercentage}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, discountPercentage: Number(e.target.value) }))}
                  placeholder="15"
                  min="0"
                  max="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={newPackage.description}
                onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the package benefits and services included"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Services
              </label>
              <ScrollArea className="h-48 border rounded-md p-4">
                <div className="space-y-3">
                  {availableServices.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={newPackage.selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleServiceSelection(service.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`service-${service.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {service.name}
                        </label>
                        <p className="text-xs text-gray-600">
                          ${service.price} • {service.duration} min • {service.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Branches
              </label>
              <div className="flex flex-wrap gap-2">
                {branches.map((branch) => (
                  <div key={branch} className="flex items-center space-x-2">
                    <Checkbox
                      id={`branch-${branch}`}
                      checked={newPackage.branches.includes(branch)}
                      onCheckedChange={() => toggleBranchSelection(branch)}
                    />
                    <label htmlFor={`branch-${branch}`} className="text-sm cursor-pointer">
                      {branch}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to make available at all branches
              </p>
            </div>

            {/* Package Preview */}
            {newPackage.selectedServices.length > 0 && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Package Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Services selected:</span>
                      <span>{newPackage.selectedServices.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total duration:</span>
                      <span>
                        {availableServices
                          .filter(s => newPackage.selectedServices.includes(s.id))
                          .reduce((sum, s) => sum + (s.duration || 0), 0)} min
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Regular price:</span>
                      <span className="line-through">
                        ${availableServices
                          .filter(s => newPackage.selectedServices.includes(s.id))
                          .reduce((sum, s) => sum + (s.price || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Discounted price:</span>
                      <span className="text-green-600">
                        ${Math.round(availableServices
                          .filter(s => newPackage.selectedServices.includes(s.id))
                          .reduce((sum, s) => sum + (s.price || 0), 0) * (1 - newPackage.discountPercentage / 100))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePackage}
              disabled={!newPackage.name || newPackage.selectedServices.length === 0}
            >
              Create Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Package Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPackage?.name}</DialogTitle>
            <DialogDescription>{selectedPackage?.description}</DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-6">
              {/* Package Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">${selectedPackage.discountedPrice}</p>
                  <p className="text-sm text-gray-600">Package Price</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedPackage.duration}</p>
                  <p className="text-sm text-gray-600">Duration (min)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedPackage.discountPercentage}%</p>
                  <p className="text-sm text-gray-600">Discount</p>
                </div>
              </div>

              {/* Services Included */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Services Included</h3>
                <div className="space-y-3">
                  {selectedPackage.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${service.price}</p>
                        <p className="text-sm text-gray-600">{service.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Savings Summary */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">Total Savings</p>
                      <p className="text-sm text-green-600">
                        Save ${selectedPackage.totalPrice - selectedPackage.discountedPrice} on this package
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-800">
                        {selectedPackage.discountPercentage}%
                      </p>
                      <p className="text-sm text-green-600">off</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}