import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Booking Workflow Types
export type BookingState = 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected' | 'rescheduled' | 'cancelled';

export interface BookingWorkflowSettings {
  enablePendingState: boolean;
  enableApprovedState: boolean;
  enableInProgressState: boolean;
  enableCompletedState: boolean;
  enableRejectedState: boolean;
  enableRescheduledState: boolean;
  enableCancelledState: boolean;
}

// Get the initial state for new bookings based on workflow settings
export function getInitialBookingState(settings: BookingWorkflowSettings): BookingState {
  if (settings.enablePendingState) {
    return 'pending';
  }
  if (settings.enableApprovedState) {
    return 'approved';
  }
  // Fallback to approved if pending is disabled
  return 'approved';
}

// Get available booking states based on workflow settings
export function getAvailableBookingStates(settings: BookingWorkflowSettings): BookingState[] {
  const states: BookingState[] = [];

  if (settings.enablePendingState) states.push('pending');
  if (settings.enableApprovedState) states.push('approved');
  if (settings.enableInProgressState) states.push('in-progress');
  if (settings.enableCompletedState) states.push('completed');
  if (settings.enableRejectedState) states.push('rejected');
  if (settings.enableRescheduledState) states.push('rescheduled');
  if (settings.enableCancelledState) states.push('cancelled');

  return states;
}

// Get the next logical state in the workflow
export function getNextBookingState(currentState: BookingState, settings: BookingWorkflowSettings): BookingState | null {
  const workflow: BookingState[] = [];

  if (settings.enablePendingState) workflow.push('pending');
  if (settings.enableApprovedState) workflow.push('approved');
  if (settings.enableInProgressState) workflow.push('in-progress');
  if (settings.enableCompletedState) workflow.push('completed');

  const currentIndex = workflow.indexOf(currentState);
  if (currentIndex === -1 || currentIndex === workflow.length - 1) {
    return null; // No next state or current state not in workflow
  }

  return workflow[currentIndex + 1];
}

// Check if a state transition is allowed
export function isValidStateTransition(fromState: BookingState, toState: BookingState, settings: BookingWorkflowSettings): boolean {
  const availableStates = getAvailableBookingStates(settings);
  return availableStates.includes(fromState) && availableStates.includes(toState);
}
