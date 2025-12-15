import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingWorkflowSettings {
  enablePendingState: boolean;
  enableApprovedState: boolean;
  enableInProgressState: boolean;
  enableCompletedState: boolean;
  enableRejectedState: boolean;
  enableRescheduledState: boolean;
  enableCancelledState: boolean;
}

export interface SettingsState {
  // Booking Workflow Settings
  bookingWorkflow: BookingWorkflowSettings;

  // Actions
  updateBookingWorkflow: (settings: Partial<BookingWorkflowSettings>) => void;
  resetBookingWorkflow: () => void;
}

const defaultBookingWorkflow: BookingWorkflowSettings = {
  enablePendingState: true,
  enableApprovedState: true,
  enableInProgressState: true,
  enableCompletedState: true,
  enableRejectedState: true,
  enableRescheduledState: true,
  enableCancelledState: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      bookingWorkflow: defaultBookingWorkflow,

      updateBookingWorkflow: (settings) =>
        set((state) => ({
          bookingWorkflow: { ...state.bookingWorkflow, ...settings },
        })),

      resetBookingWorkflow: () =>
        set({ bookingWorkflow: defaultBookingWorkflow }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        bookingWorkflow: state.bookingWorkflow,
      }),
    }
  )
);