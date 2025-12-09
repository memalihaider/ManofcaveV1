import { create } from 'zustand';

interface BookingData {
  service: string;
  barber: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  paymentMethod: string;
}

interface BookingStore {
  bookingData: BookingData;
  currentStep: number;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialBookingData: BookingData = {
  service: '',
  barber: '',
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
  paymentMethod: 'cod',
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookingData: initialBookingData,
  currentStep: 1,

  updateBookingData: (field, value) =>
    set((state) => ({
      bookingData: { ...state.bookingData, [field]: value },
    })),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 5),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  reset: () =>
    set({
      bookingData: initialBookingData,
      currentStep: 1,
    }),
}));