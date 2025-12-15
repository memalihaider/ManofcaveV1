import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Branch {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  phone?: string;
  address?: string;
}

interface BranchState {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  getBranchById: (id: string) => Branch | undefined;
}

// Mock branches data
const mockBranches: Branch[] = [
  {
    id: 'alwahda',
    name: 'Alwahda',
    location: 'Alwahda District',
    description: 'Premium grooming in the heart of Alwahda',
    image: 'https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    phone: '+971-50-123-4567',
    address: '123 Alwahda Main Street, Abu Dhabi'
  },
  {
    id: 'madinat',
    name: 'Madinat',
    location: 'Madinat District',
    description: 'Modern styling in Madinat district',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    phone: '+971-50-234-5678',
    address: '456 Madinat Boulevard, Abu Dhabi'
  },
  {
    id: 'khalifa',
    name: 'Khalifa',
    location: 'Khalifa Area',
    description: 'Luxury experience in Khalifa area',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    phone: '+971-50-345-6789',
    address: '789 Khalifa Street, Abu Dhabi'
  },
  {
    id: 'marina-mall',
    name: 'Marina Mall',
    location: 'Marina Mall',
    description: 'Convenient shopping center location',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    phone: '+971-50-456-7890',
    address: 'Marina Mall, Ground Floor, Abu Dhabi'
  },
  {
    id: 'wtc',
    name: 'WTC Branch',
    location: 'World Trade Center',
    description: 'Business district professional services',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    phone: '+971-50-567-8901',
    address: 'World Trade Center, Tower A, Abu Dhabi'
  },
  {
    id: 'salam-street',
    name: 'Salam Street Branch',
    location: 'Salam Street',
    description: 'Traditional charm with modern expertise',
    image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    phone: '+971-50-678-9012',
    address: '321 Salam Street, Abu Dhabi'
  }
];

export const useBranchStore = create<BranchState>()(
  persist(
    (set, get) => ({
      branches: mockBranches,
      selectedBranch: null,
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      getBranchById: (id) => get().branches.find(branch => branch.id === id),
    }),
    {
      name: 'branch-storage',
      partialize: (state) => ({ selectedBranch: state.selectedBranch }),
    }
  )
);