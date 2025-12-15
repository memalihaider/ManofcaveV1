'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  isSidebarOpen: boolean;
  selectedService: string | null;
  openSidebar: (serviceId?: string) => void;
  closeSidebar: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const openSidebar = (serviceId?: string) => {
    setSelectedService(serviceId || null);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedService(null);
  };

  return (
    <BookingContext.Provider value={{
      isSidebarOpen,
      selectedService,
      openSidebar,
      closeSidebar,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}