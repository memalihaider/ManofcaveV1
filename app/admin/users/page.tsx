'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PermissionProtectedRoute, PermissionProtectedSection } from "@/components/PermissionProtected";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Check,
  X,
  Search,
  Filter,
  Settings,
  Crown,
  User,
  Briefcase
} from "lucide-react";
import { Permission, Role, PERMISSION_GROUPS, ROLE_PERMISSIONS } from "@/lib/permissions";

export default function AdminUsers() {
  const { user, logout } = useAuth();
  const { getAllUsers, updateUserPermissions, createUser, deleteUser } = usePermissions();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    role: 'staff' as Role,
    branchId: '',
  });
  const [editingPermissions, setEditingPermissions] = useState<Permission[]>([]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const allUsers = getAllUsers();

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    if (newUser.email && newUser.role) {
      createUser(newUser.email, newUser.role, newUser.role !== 'super_admin' ? newUser.branchId : undefined);
      setNewUser({ email: '', role: 'staff', branchId: '' });
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditPermissions = (user: any) => {
    setSelectedUser(user);
    setEditingPermissions([...user.permissions]);
    setIsEditDialogOpen(true);
  };

  const handleSavePermissions = () => {
    if (selectedUser) {
      updateUserPermissions(selectedUser.id, editingPermissions);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const togglePermission = (permission: Permission) => {
    setEditingPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'branch_admin': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'manager': return <Briefcase className="w-4 h-4 text-green-500" />;
      case 'staff': return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'super_admin': return 'bg-yellow-100 text-yellow-800';
      case 'branch_admin': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'staff': return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PermissionProtectedRoute requiredPermissions={['users.view']}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PermissionProtectedSection requiredPermissions={['users.create']}>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                          Add a new user to the system with specified role and permissions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            placeholder="user@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select value={newUser.role} onValueChange={(value: Role) => setNewUser({...newUser, role: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="branch_admin">Branch Admin</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newUser.role !== 'super_admin' && (
                          <div className="space-y-2">
                            <Label htmlFor="branchId">Branch ID</Label>
                            <Input
                              id="branchId"
                              value={newUser.branchId}
                              onChange={(e) => setNewUser({...newUser, branchId: e.target.value})}
                              placeholder="Branch ID"
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateUser}>Create User</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </PermissionProtectedSection>
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-8">
              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search users by email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedRole} onValueChange={(value: Role | 'all') => setSelectedRole(value)}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="branch_admin">Branch Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Users ({filteredUsers.length})
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts, roles, and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                {getRoleIcon(user.role)}
                              </div>
                              <div>
                                <div className="font-medium">{user.email}</div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.branchId || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{user.permissions.length} permissions</span>
                              <PermissionProtectedSection requiredPermissions={['permissions.manage']}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditPermissions(user)}
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </PermissionProtectedSection>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.createdAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <PermissionProtectedSection requiredPermissions={['users.edit']}>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </PermissionProtectedSection>
                              <PermissionProtectedSection requiredPermissions={['users.delete']}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </PermissionProtectedSection>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Permissions: {selectedUser?.email}</DialogTitle>
            <DialogDescription>
              Customize permissions for this user. Changes will take effect immediately.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-96">
            <div className="space-y-6">
              {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => (
                <div key={groupKey} className="space-y-3">
                  <h3 className="font-semibold text-lg">{group.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.permissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={editingPermissions.includes(permission)}
                          onCheckedChange={() => togglePermission(permission)}
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission.replace(/[_./]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PermissionProtectedRoute>
  );
}