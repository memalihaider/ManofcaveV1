import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Permission, Role, UserPermissions, ROLE_PERMISSIONS } from '../lib/permissions';

interface PermissionContextType {
  userPermissions: UserPermissions | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessPage: (pagePermissions: Permission[]) => boolean;
  updateUserPermissions: (userId: string, permissions: Permission[]) => void;
  getAllUsers: () => UserPermissions[];
  createUser: (email: string, role: Role, branchId?: string) => UserPermissions;
  deleteUser: (userId: string) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

interface PermissionProviderProps {
  children: ReactNode;
  currentUser: { id: string; email: string; role: Role; branchId?: string } | null;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children, currentUser }) => {
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [allUsers, setAllUsers] = useState<UserPermissions[]>([]);

  // Initialize mock users and permissions
  useEffect(() => {
    const initializeMockData = () => {
      const mockUsers: UserPermissions[] = [
        {
          id: '1',
          email: 'admin@branch1.com',
          role: 'branch_admin',
          permissions: ROLE_PERMISSIONS.branch_admin,
          branchId: '1',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        },
        {
          id: '2',
          email: 'super@premiumcuts.com',
          role: 'super_admin',
          permissions: ROLE_PERMISSIONS.super_admin,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        },
        {
          id: '3',
          email: 'manager@branch1.com',
          role: 'manager',
          permissions: ROLE_PERMISSIONS.manager,
          branchId: '1',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date(),
        },
        {
          id: '4',
          email: 'staff@branch1.com',
          role: 'staff',
          permissions: ROLE_PERMISSIONS.staff,
          branchId: '1',
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date(),
        },
      ];

      setAllUsers(mockUsers);

      // Set current user permissions
      if (currentUser) {
        const currentUserData = mockUsers.find(u => u.id === currentUser.id);
        if (currentUserData) {
          setUserPermissions(currentUserData);
        } else {
          // Create permissions for current user if not found
          const newUserPermissions: UserPermissions = {
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role,
            permissions: ROLE_PERMISSIONS[currentUser.role],
            branchId: currentUser.branchId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUserPermissions(newUserPermissions);
          setAllUsers(prev => [...prev, newUserPermissions]);
        }
      }
    };

    initializeMockData();
  }, [currentUser]);

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions?.permissions.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccessPage = (pagePermissions: Permission[]): boolean => {
    // If no permissions required, allow access
    if (pagePermissions.length === 0) return true;

    // Check if user has any of the required permissions
    return hasAnyPermission(pagePermissions);
  };

  const updateUserPermissions = (userId: string, permissions: Permission[]) => {
    setAllUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, permissions, updatedAt: new Date() }
        : user
    ));

    // Update current user permissions if it's the current user
    if (userPermissions?.id === userId) {
      setUserPermissions(prev => prev ? { ...prev, permissions, updatedAt: new Date() } : null);
    }
  };

  const getAllUsers = (): UserPermissions[] => {
    return allUsers;
  };

  const createUser = (email: string, role: Role, branchId?: string): UserPermissions => {
    const newUser: UserPermissions = {
      id: Date.now().toString(),
      email,
      role,
      permissions: ROLE_PERMISSIONS[role],
      branchId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAllUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(user => user.id !== userId));

    // Clear current user permissions if deleting current user
    if (userPermissions?.id === userId) {
      setUserPermissions(null);
    }
  };

  const value: PermissionContextType = {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessPage,
    updateUserPermissions,
    getAllUsers,
    createUser,
    deleteUser,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};