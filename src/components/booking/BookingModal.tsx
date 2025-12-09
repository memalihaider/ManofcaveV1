'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookingStepper } from '@/components/booking/BookingStepper';

interface BookingModalProps {
  serviceId?: string;
  serviceName?: string;
  children: React.ReactNode;
}

export function BookingModal({ serviceId, serviceName, children }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold text-primary">
            {serviceName ? `Book ${serviceName}` : 'Book Your Appointment'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <BookingStepper selectedServiceId={serviceId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}