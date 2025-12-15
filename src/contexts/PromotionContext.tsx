'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Promotion {
  title: string;
  discount: string;
  description: string;
  validUntil: string;
  image: string;
  badge: string;
  terms?: string;
  couponCode?: string;
  applicableServices?: string[];
  branches?: string[];
}

interface PromotionContextType {
  selectedPromotion: Promotion | null;
  isPromotionSidebarOpen: boolean;
  openPromotionSidebar: (promotion: Promotion) => void;
  closePromotionSidebar: () => void;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export function PromotionProvider({ children }: { children: ReactNode }) {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isPromotionSidebarOpen, setIsPromotionSidebarOpen] = useState(false);

  const openPromotionSidebar = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsPromotionSidebarOpen(true);
  };

  const closePromotionSidebar = () => {
    setIsPromotionSidebarOpen(false);
    setSelectedPromotion(null);
  };

  return (
    <PromotionContext.Provider
      value={{
        selectedPromotion,
        isPromotionSidebarOpen,
        openPromotionSidebar,
        closePromotionSidebar,
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
}

export function usePromotion() {
  const context = useContext(PromotionContext);
  if (context === undefined) {
    // Return safe defaults for SSR
    return {
      selectedPromotion: null,
      isPromotionSidebarOpen: false,
      openPromotionSidebar: () => {},
      closePromotionSidebar: () => {},
    };
  }
  return context;
}