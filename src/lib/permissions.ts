// Permission and Role Definitions
export type Permission =
  // Dashboard & Analytics
  | 'dashboard.view'
  | 'analytics.view'
  | 'reports.view'

  // Appointments & Bookings
  | 'appointments.view'
  | 'appointments.create'
  | 'appointments.edit'
  | 'appointments.cancel'
  | 'booking_approvals.view'
  | 'booking_approvals.approve'

  // Staff Management
  | 'staff.view'
  | 'staff.create'
  | 'staff.edit'
  | 'staff.delete'

  // Services & Products
  | 'services.view'
  | 'services.create'
  | 'services.edit'
  | 'services.delete'
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'categories.view'
  | 'categories.create'
  | 'categories.edit'
  | 'categories.delete'

  // Customer Management
  | 'customers.view'
  | 'customers.edit'
  | 'membership.view'
  | 'membership.manage'

  // Communication
  | 'messages.view'
  | 'messages.send'
  | 'feedback.view'
  | 'feedback.respond'

  // Settings & Configuration
  | 'settings.view'
  | 'settings.edit'
  | 'payment_methods.view'
  | 'payment_methods.edit'
  | 'sms_content.view'
  | 'sms_content.edit'
  | 'data_import.view'
  | 'data_import.edit'
  | 'terms.view'
  | 'terms.edit'

  // User Management (Admin only)
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'permissions.manage'

  // Branch Management (Super Admin only)
  | 'branches.view'
  | 'branches.create'
  | 'branches.edit'
  | 'branches.delete'
  | 'financial.view'
  | 'system_settings.view'
  | 'system_settings.edit'

  // Customer Portal
  | 'customer.profile.view'
  | 'customer.profile.edit'
  | 'customer.appointments.view'
  | 'customer.appointments.create'
  | 'customer.appointments.cancel'
  | 'customer.orders.view'
  | 'customer.services.view'
  | 'customer.products.view';

export type Role = 'branch_admin' | 'super_admin' | 'staff' | 'manager' | 'customer';

export interface UserPermissions {
  id: string;
  email: string;
  role: Role;
  permissions: Permission[];
  branchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Predefined role permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  branch_admin: [
    // Dashboard & Analytics
    'dashboard.view',
    'analytics.view',
    'reports.view',

    // Appointments & Bookings
    'appointments.view',
    'appointments.create',
    'appointments.edit',
    'appointments.cancel',
    'booking_approvals.view',
    'booking_approvals.approve',

    // Staff Management
    'staff.view',
    'staff.create',
    'staff.edit',

    // Services & Products
    'services.view',
    'services.create',
    'services.edit',
    'products.view',
    'products.create',
    'products.edit',
    'categories.view',
    'categories.create',
    'categories.edit',

    // Customer Management
    'customers.view',
    'customers.edit',
    'membership.view',
    'membership.manage',

    // Communication
    'messages.view',
    'messages.send',
    'feedback.view',
    'feedback.respond',

    // Settings
    'settings.view',
    'settings.edit',
    'payment_methods.view',
    'payment_methods.edit',
    'sms_content.view',
    'sms_content.edit',
    'terms.view',
    'terms.edit',

    // User Management
    'users.view',
    'users.create',
    'users.edit',
  ],

  super_admin: [
    // All branch admin permissions plus
    // Dashboard & Analytics
    'dashboard.view',
    'analytics.view',
    'reports.view',

    // Appointments & Bookings
    'appointments.view',
    'appointments.create',
    'appointments.edit',
    'appointments.cancel',
    'booking_approvals.view',
    'booking_approvals.approve',

    // Staff Management
    'staff.view',
    'staff.create',
    'staff.edit',

    // Services & Products
    'services.view',
    'services.create',
    'services.edit',
    'products.view',
    'products.create',
    'products.edit',
    'categories.view',
    'categories.create',
    'categories.edit',

    // Customer Management
    'customers.view',
    'customers.edit',
    'membership.view',
    'membership.manage',

    // Communication
    'messages.view',
    'messages.send',
    'feedback.view',
    'feedback.respond',

    // Settings
    'settings.view',
    'settings.edit',
    'payment_methods.view',
    'payment_methods.edit',
    'sms_content.view',
    'sms_content.edit',
    'terms.view',
    'terms.edit',

    // User Management
    'users.view',
    'users.create',
    'users.edit',

    // Additional super admin permissions
    'users.delete',
    'permissions.manage',
    'branches.view',
    'branches.create',
    'branches.edit',
    'branches.delete',
    'financial.view',
    'system_settings.view',
    'system_settings.edit',
  ],

  manager: [
    // Core business operations
    'dashboard.view',
    'analytics.view',
    'reports.view',
    'appointments.view',
    'appointments.create',
    'appointments.edit',
    'booking_approvals.view',
    'staff.view',
    'services.view',
    'products.view',
    'categories.view',
    'customers.view',
    'messages.view',
    'messages.send',
    'feedback.view',
    'settings.view',
  ],

  staff: [
    // Limited permissions for basic staff
    'dashboard.view',
    'appointments.view',
    'appointments.edit',
    'services.view',
    'products.view',
    'customers.view',
    'messages.view',
    'messages.send',
  ],
  customer: [
    // Customer Portal
    'customer.profile.view',
    'customer.profile.edit',
    'customer.appointments.view',
    'customer.appointments.create',
    'customer.appointments.cancel',
    'customer.orders.view',
    'customer.services.view',
    'customer.products.view',
  ],
};

// Permission groups for UI organization
export const PERMISSION_GROUPS = {
  dashboard: {
    title: 'Dashboard & Analytics',
    permissions: ['dashboard.view', 'analytics.view', 'reports.view'] as Permission[],
  },
  appointments: {
    title: 'Appointments & Bookings',
    permissions: [
      'appointments.view',
      'appointments.create',
      'appointments.edit',
      'appointments.cancel',
      'booking_approvals.view',
      'booking_approvals.approve',
    ] as Permission[],
  },
  staff: {
    title: 'Staff Management',
    permissions: ['staff.view', 'staff.create', 'staff.edit', 'staff.delete'] as Permission[],
  },
  services: {
    title: 'Services & Products',
    permissions: [
      'services.view',
      'services.create',
      'services.edit',
      'services.delete',
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
      'categories.view',
      'categories.create',
      'categories.edit',
      'categories.delete',
    ] as Permission[],
  },
  customers: {
    title: 'Customer Management',
    permissions: ['customers.view', 'customers.edit', 'membership.view', 'membership.manage'] as Permission[],
  },
  communication: {
    title: 'Communication',
    permissions: ['messages.view', 'messages.send', 'feedback.view', 'feedback.respond'] as Permission[],
  },
  settings: {
    title: 'Settings & Configuration',
    permissions: [
      'settings.view',
      'settings.edit',
      'payment_methods.view',
      'payment_methods.edit',
      'sms_content.view',
      'sms_content.edit',
      'terms.view',
      'terms.edit',
    ] as Permission[],
  },
  users: {
    title: 'User Management',
    permissions: ['users.view', 'users.create', 'users.edit', 'users.delete', 'permissions.manage'] as Permission[],
  },
  system: {
    title: 'System Administration',
    permissions: [
      'branches.view',
      'branches.create',
      'branches.edit',
      'branches.delete',
      'financial.view',
      'system_settings.view',
      'system_settings.edit',
    ] as Permission[],
  },
};