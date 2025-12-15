import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Service {
  id: string;
  name: string;
  category?: string;
  duration?: number;
  price?: number;
  branches?: string[];
  description?: string;
  isPackage?: boolean;
  packageServices?: string[]; // Array of service IDs included in package
  discountPercentage?: number; // Discount for package
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: Service[];
  totalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  duration: number;
  branches?: string[];
  isActive: boolean;
}

interface ServicesStore {
  services: Service[];
  packages: ServicePackage[];
  getServicesByBranch: (branchId?: string) => Service[];
  getPackagesByBranch: (branchId?: string) => ServicePackage[];
  addService: (service: Omit<Service, 'id'>) => void;
  addPackage: (pkg: Omit<ServicePackage, 'id'>) => void;
  getPackageById: (id: string) => ServicePackage | undefined;
}

export const useServicesStore = create<ServicesStore>()(
  persist((set, get) => ({
    services: [
      { id: 'haircut', name: 'Classic Haircut', category: 'haircut', price: 35, duration: 30, branches: ['branch1', 'branch2', 'branch3'], description: 'Professional haircut with modern techniques' },
      { id: 'beard', name: 'Beard Trim', category: 'beard', price: 25, duration: 20, branches: ['branch1', 'branch2'], description: 'Precision beard trimming and shaping' },
      { id: 'color', name: 'Hair Color', category: 'color', price: 70, duration: 90, branches: ['branch1', 'branch3'], description: 'Professional hair coloring services' },
      { id: 'shave', name: 'Hot Towel Shave', category: 'shaving', price: 45, duration: 30, branches: ['branch1'], description: 'Traditional hot towel straight razor shave' },
      { id: 'facial', name: 'Facial Treatment', category: 'skincare', price: 65, duration: 45, branches: ['branch1', 'branch2'], description: 'Deep cleansing facial treatment' },
      { id: 'massage', name: 'Scalp Massage', category: 'relaxation', price: 40, duration: 20, branches: ['branch1', 'branch2', 'branch3'], description: 'Relaxing scalp and neck massage' },
    ],
    packages: [
      {
        id: 'premium-package',
        name: 'Premium Grooming Package',
        description: 'Complete grooming experience with haircut, beard trim, and hot towel shave',
        services: [
          { id: 'haircut', name: 'Classic Haircut', category: 'haircut', price: 35, duration: 30, branches: ['branch1', 'branch2', 'branch3'], description: 'Professional haircut with modern techniques' },
          { id: 'beard', name: 'Beard Trim', category: 'beard', price: 25, duration: 20, branches: ['branch1', 'branch2'], description: 'Precision beard trimming and shaping' },
          { id: 'shave', name: 'Hot Towel Shave', category: 'shaving', price: 45, duration: 30, branches: ['branch1'], description: 'Traditional hot towel straight razor shave' }
        ],
        totalPrice: 105,
        discountedPrice: 85,
        discountPercentage: 19,
        duration: 80,
        branches: ['branch1', 'branch2'],
        isActive: true
      },
      {
        id: 'vip-package',
        name: 'VIP Luxury Package',
        description: 'Ultimate luxury experience with premium services and treatments',
        services: [
          { id: 'haircut', name: 'Classic Haircut', category: 'haircut', price: 35, duration: 30, branches: ['branch1', 'branch2', 'branch3'], description: 'Professional haircut with modern techniques' },
          { id: 'color', name: 'Hair Color', category: 'color', price: 70, duration: 90, branches: ['branch1', 'branch3'], description: 'Professional hair coloring services' },
          { id: 'facial', name: 'Facial Treatment', category: 'skincare', price: 65, duration: 45, branches: ['branch1', 'branch2'], description: 'Deep cleansing facial treatment' },
          { id: 'massage', name: 'Scalp Massage', category: 'relaxation', price: 40, duration: 20, branches: ['branch1', 'branch2', 'branch3'], description: 'Relaxing scalp and neck massage' }
        ],
        totalPrice: 210,
        discountedPrice: 165,
        discountPercentage: 21,
        duration: 185,
        branches: ['branch1'],
        isActive: true
      },
      {
        id: 'student-package',
        name: 'Student Special Package',
        description: 'Affordable grooming package for students',
        services: [
          { id: 'haircut', name: 'Classic Haircut', category: 'haircut', price: 35, duration: 30, branches: ['branch1', 'branch2', 'branch3'], description: 'Professional haircut with modern techniques' },
          { id: 'beard', name: 'Beard Trim', category: 'beard', price: 25, duration: 20, branches: ['branch1', 'branch2'], description: 'Precision beard trimming and shaping' }
        ],
        totalPrice: 60,
        discountedPrice: 45,
        discountPercentage: 25,
        duration: 50,
        branches: ['branch1', 'branch2', 'branch3'],
        isActive: true
      }
    ],
    getServicesByBranch: (branchId) => {
      if (!branchId) return get().services;
      return get().services.filter(s => !s.branches || s.branches.includes(branchId));
    },
    getPackagesByBranch: (branchId) => {
      if (!branchId) return get().packages;
      return get().packages.filter(p => !p.branches || p.branches.includes(branchId));
    },
    addService: (service) => {
      const newService: Service = { ...service, id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` };
      set(state => ({ services: [...state.services, newService] }));
    },
    addPackage: (pkg) => {
      const newPackage: ServicePackage = { ...pkg, id: `package-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` };
      set(state => ({ packages: [...state.packages, newPackage] }));
    },
    getPackageById: (id) => {
      return get().packages.find(p => p.id === id);
    }
  }), { name: 'services-storage' })
);

export default useServicesStore;
