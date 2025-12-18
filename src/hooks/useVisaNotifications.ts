'use client';

import { useEffect } from 'react';

interface StaffMember {
  id: number;
  name: string;
  visaExpiryDate: string;
}

export function useVisaNotifications(staff: StaffMember[]) {
  useEffect(() => {
    const checkVisaExpiry = () => {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const expiringVisas = staff.filter(member => {
        const expiryDate = new Date(member.visaExpiryDate);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
      });

      const expiredVisas = staff.filter(member => {
        const expiryDate = new Date(member.visaExpiryDate);
        return expiryDate < today;
      });

      // Show browser notifications if permission granted
      if (Notification.permission === 'granted') {
        expiringVisas.forEach(member => {
          const daysUntilExpiry = Math.ceil((new Date(member.visaExpiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          new Notification(`Visa Expiring Soon`, {
            body: `${member.name}'s visa expires in ${daysUntilExpiry} days`,
            icon: '/favicon.ico'
          });
        });

        expiredVisas.forEach(member => {
          new Notification(`Visa Expired`, {
            body: `${member.name}'s visa has expired`,
            icon: '/favicon.ico'
          });
        });
      } else if (Notification.permission !== 'denied') {
        // Request permission
        Notification.requestPermission();
      }

      // Log to console for debugging
      if (expiringVisas.length > 0) {
        console.log('Staff with visas expiring soon:', expiringVisas.map(m => `${m.name} (${m.visaExpiryDate})`));
      }
      if (expiredVisas.length > 0) {
        console.log('Staff with expired visas:', expiredVisas.map(m => `${m.name} (${m.visaExpiryDate})`));
      }
    };

    // Check immediately
    checkVisaExpiry();

    // Check daily
    const interval = setInterval(checkVisaExpiry, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [staff]);
}