'use client'

import { useState, useEffect } from 'react'
import { 
  Search, Filter, MoreVertical, UserPlus, Mail, 
  Phone, Calendar, Shield, Trash2, Edit2, CheckCircle, XCircle, Eye, EyeOff,
  Loader2
} from 'lucide-react'
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '@/lib/firebase'

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  last_login?: string
  status: 'active' | 'inactive' | 'suspended'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'customer',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Load users from Firebase
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersCollection = collection(db, "users")
      const userSnapshot = await getDocs(usersCollection)
      
      const usersList: User[] = []
      userSnapshot.forEach((doc) => {
        const data = doc.data()
        usersList.push({ 
          id: doc.id, 
          ...data,
          status: data.status || 'active',
          role: data.role || 'customer'
        } as User)
      })
      
      // Sort by creation date (newest first)
      usersList.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )
      
      setUsers(usersList)
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Failed to load users from Firebase.')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchUsers()
  }, [])

  // CREATE USER IN FIRESTORE ONLY (Without Firebase Auth)
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setPasswordError('')

    // Basic validation
    if (!formData.email.trim() || !formData.full_name.trim()) {
      alert('Email and name are required')
      setIsSubmitting(false)
      return
    }

    if (!editingUser && formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      setIsSubmitting(false)
      return
    }

    try {
      // Check if email already exists
      const emailExists = users.some(user => 
        user.email.toLowerCase() === formData.email.trim().toLowerCase()
      )
      
      if (emailExists && !editingUser) {
        alert('Email already exists. Please use a different email.')
        setIsSubmitting(false)
        return
      }

      // Prepare user data
      const userData = {
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        role: formData.role,
        status: formData.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Note: In production, never store passwords in plain text!
        // This is for demonstration only
        password: formData.password // TEMPORARY - REMOVE IN PRODUCTION
      }

      if (editingUser) {
        // UPDATE EXISTING USER
        const userRef = doc(db, "users", editingUser.id)
        const updateData = {
          full_name: userData.full_name,
          role: userData.role,
          status: userData.status,
          updated_at: userData.updated_at
        }
        
        await updateDoc(userRef, updateData)
        
        // Update local state
        const updatedUser = {
          ...editingUser,
          ...updateData
        }
        
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u))
        
        alert('User updated successfully!')
        
      } else {
        // CREATE NEW USER
        const docRef = await addDoc(collection(db, "users"), userData)
        
        console.log('User created with ID:', docRef.id)

        // Update local state
        const newUser = {
          id: docRef.id,
          ...userData
        } as User

        setUsers([newUser, ...users])
        
        alert('User created successfully! Please note: Password is stored in plain text (for demo only).')
      }
      
      // Reset and close
      setShowAddModal(false)
      resetForm()
      setShowPassword(false)
      
    } catch (error: any) {
      console.error('Error saving user:', error)
      
      let errorMessage = 'Error saving user. Please try again.'
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check Firebase rules.'
      } else if (error.code === 'already-exists') {
        errorMessage = 'User already exists.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // DELETE USER FROM FIRESTORE
  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}? This action cannot be undone.`)) {
      return
    }

    try {
      // Delete from Firestore
      const userRef = doc(db, "users", userId)
      await deleteDoc(userRef)
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId))
      
      alert('User deleted successfully!')
      
    } catch (error: any) {
      console.error('Error deleting user:', error)
      
      if (error.code === 'permission-denied') {
        alert('Delete permission denied. Please check Firebase rules.')
      } else {
        alert('Error deleting user. Please try again.')
      }
    }
  }

  // TOGGLE USER STATUS
  const handleToggleStatus = async (user: User) => {
    const newStatus: 'active' | 'inactive' = user.status === 'active' ? 'inactive' : 'active'
    
    try {
      // Update in Firestore
      const userRef = doc(db, "users", user.id)
      await updateDoc(userRef, {
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      
      // Update local state
      const updatedUser = {
        ...user,
        status: newStatus
      }
      
      setUsers(users.map(u => u.id === user.id ? updatedUser : u))
      
      alert(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
      
    } catch (error: any) {
      console.error('Error updating user status:', error)
      alert('Error updating user status. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      role: 'customer',
      status: 'active'
    })
    setPasswordError('')
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Statistics
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const adminUsers = users.filter(u => u.role === 'admin').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all registered users and their permissions.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null)
            resetForm()
            setShowAddModal(true)
          }}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
          <p className="text-sm text-gray-500">Active Users</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
          <p className="text-sm text-gray-500">Admin Users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>
          <button 
            onClick={fetchUsers}
            className="inline-flex items-center px-3 py-2 rounded-md border bg-background hover:bg-accent transition-colors"
          >
            <Filter className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p>Loading users from Firebase...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'agent' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                          user.status === 'suspended' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                          'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {user.status === 'active' ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingUser(user)
                            setFormData({
                              full_name: user.full_name,
                              email: user.email,
                              password: '', // Don't show existing password
                              role: user.role,
                              status: user.status
                            })
                            setShowAddModal(true)
                          }}
                          className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit User"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="p-2 hover:bg-red-50 rounded-md transition-colors text-muted-foreground hover:text-red-600"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
                <span className="text-sm text-gray-500 ml-2">(Firebase Firestore)</span>
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingUser(null)
                  resetForm()
                  setShowPassword(false)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  disabled={isSubmitting || !!editingUser}
                />
                {editingUser && (
                  <p className="text-xs text-gray-500">Email cannot be changed for existing users.</p>
                )}
              </div>

              {!editingUser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        setPasswordError('')
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-600">{passwordError}</p>
                  )}
                  <p className="text-xs text-gray-500">Minimum 6 characters required</p>
                  <p className="text-xs text-red-500 font-medium">
                    ⚠️ Warning: Password stored in plain text (for demo only)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  disabled={isSubmitting}
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  disabled={isSubmitting}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingUser(null)
                    resetForm()
                    setShowPassword(false)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {editingUser ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingUser ? 'Update User' : 'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


