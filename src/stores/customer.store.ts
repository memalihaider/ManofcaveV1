import { create } from 'zustand';

export interface CustomerData {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  eWalletBalance: number;
  loyaltyPoints: number;
  totalSpent: number;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: string;
}

interface CustomerStore {
  customer: CustomerData | null;
  isLoading: boolean;
  setCustomer: (customer: CustomerData | null) => void;
  updateEWalletBalance: (amount: number) => void;
  addLoyaltyPoints: (points: number) => void;
  deductFromEWallet: (amount: number) => boolean;
  updateTotalSpent: (amount: number) => void;
  calculateLoyaltyPoints: (amount: number) => number;
  getMembershipTier: (totalSpent: number) => 'bronze' | 'silver' | 'gold' | 'platinum';
  loadCustomerData: (customerId: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customer: null,
  isLoading: false,

  setCustomer: (customer) => set({ customer }),

  updateEWalletBalance: (amount) =>
    set((state) => ({
      customer: state.customer
        ? { ...state.customer, eWalletBalance: state.customer.eWalletBalance + amount }
        : null,
    })),

  addLoyaltyPoints: (points) =>
    set((state) => ({
      customer: state.customer
        ? { ...state.customer, loyaltyPoints: state.customer.loyaltyPoints + points }
        : null,
    })),

  deductFromEWallet: (amount) => {
    const { customer } = get();
    if (!customer || customer.eWalletBalance < amount) {
      return false;
    }
    set({
      customer: { ...customer, eWalletBalance: customer.eWalletBalance - amount },
    });
    return true;
  },

  updateTotalSpent: (amount) =>
    set((state) => {
      if (!state.customer) return state;
      const newTotalSpent = state.customer.totalSpent + amount;
      const newTier = get().getMembershipTier(newTotalSpent);
      return {
        customer: {
          ...state.customer,
          totalSpent: newTotalSpent,
          membershipTier: newTier,
        },
      };
    }),

  calculateLoyaltyPoints: (amount) => {
    // 1 loyalty point per $10 spent
    return Math.floor(amount / 10);
  },

  getMembershipTier: (totalSpent) => {
    if (totalSpent >= 5000) return 'platinum';
    if (totalSpent >= 2500) return 'gold';
    if (totalSpent >= 1000) return 'silver';
    return 'bronze';
  },

  loadCustomerData: async (customerId) => {
    set({ isLoading: true });
    try {
      // Mock data - replace with real API call
      const mockCustomer: CustomerData = {
        id: customerId,
        email: 'customer@example.com',
        fullName: 'John Doe',
        phone: '+1234567890',
        eWalletBalance: 150.50,
        loyaltyPoints: 245,
        totalSpent: 1250.75,
        membershipTier: 'silver',
        joinDate: '2024-01-15',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      set({ customer: mockCustomer, isLoading: false });
    } catch (error) {
      console.error('Failed to load customer data:', error);
      set({ isLoading: false });
    }
  },
}));