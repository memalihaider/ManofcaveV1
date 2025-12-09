import React from 'react';
import { usePermissions } from '@/contexts/PermissionContext';
import { Permission } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Lock } from 'lucide-react';

interface PermissionProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, ANY permission
  fallback?: React.ReactNode;
}

export const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requireAll = false,
  fallback,
}) => {
  const { user } = useAuth();
  const { canAccessPage, hasAllPermissions, hasAnyPermission } = usePermissions();

  // If no permissions required, allow access
  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (!user) {
    return fallback || <AccessDenied message="Please log in to access this page." />;
  }

  // Check permissions
  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return fallback || <AccessDenied message="You don't have permission to access this page." />;
  }

  return <>{children}</>;
};

interface PermissionProtectedSectionProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const PermissionProtectedSection: React.FC<PermissionProtectedSectionProps> = ({
  children,
  requiredPermissions = [],
  requireAll = false,
  fallback,
}) => {
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  // If no permissions required, show content
  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  // Check permissions
  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return fallback || <AccessDeniedSection />;
  }

  return <>{children}</>;
};

const AccessDenied: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-red-600" />
        </div>
        <CardTitle className="text-red-600">Access Denied</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-gray-600">
          Contact your administrator if you believe this is an error.
        </p>
      </CardContent>
    </Card>
  </div>
);

const AccessDeniedSection: React.FC = () => (
  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
    <div className="text-center">
      <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600">You don't have permission to access this section.</p>
    </div>
  </div>
);

// Hook for checking permissions in components
export const usePermissionCheck = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};