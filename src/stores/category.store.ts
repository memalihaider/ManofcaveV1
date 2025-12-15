import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  description: string;
  type: 'product' | 'service';
  branchId?: string; // undefined for super admin categories (all branches)
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryStore {
  categories: Category[];

  // Actions
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setCategories: (categories: Category[]) => void;

  // Getters
  getCategoriesByBranch: (branchId?: string) => Category[];
  getCategoriesByType: (type: 'product' | 'service', branchId?: string) => Category[];
  getActiveCategories: (branchId?: string) => Category[];
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [
        {
          id: 'cat-1',
          name: 'Haircuts & Styling',
          description: 'Professional haircut and styling services',
          type: 'service',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-2',
          name: 'Beard Care',
          description: 'Beard trimming, shaping, and grooming services',
          type: 'service',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-3',
          name: 'Color Services',
          description: 'Hair coloring and highlighting services',
          type: 'service',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-4',
          name: 'Treatments',
          description: 'Hair and scalp treatments',
          type: 'service',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-5',
          name: 'Hair Care',
          description: 'Shampoos, conditioners, and hair care products',
          type: 'product',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-6',
          name: 'Beard Care',
          description: 'Beard oils, balms, and grooming products',
          type: 'product',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-7',
          name: 'Styling',
          description: 'Hair styling products and tools',
          type: 'product',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-8',
          name: 'Skincare',
          description: 'Face care and skincare products',
          type: 'product',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-9',
          name: 'Tools',
          description: 'Professional barber tools and equipment',
          type: 'product',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-10',
          name: 'Accessories',
          description: 'Hair accessories and styling aids',
          type: 'product',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }
      ],

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map(cat =>
            cat.id === id
              ? { ...cat, ...updates, updatedAt: new Date() }
              : cat
          )
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter(cat => cat.id !== id)
        }));
      },

      setCategories: (categories) => set({ categories }),

      getCategoriesByBranch: (branchId) => {
        if (!branchId) {
          // Super admin sees all categories
          return get().categories;
        }
        // Branch admin sees only their branch categories + global categories (no branchId)
        return get().categories.filter(cat =>
          cat.branchId === branchId || !cat.branchId
        );
      },

      getCategoriesByType: (type, branchId) => {
        return get().getCategoriesByBranch(branchId).filter(cat => cat.type === type);
      },

      getActiveCategories: (branchId) => {
        return get().getCategoriesByBranch(branchId).filter(cat => cat.isActive);
      },
    }),
    {
      name: 'category-storage',
      partialize: (state) => ({
        categories: state.categories
      })
    }
  )
);