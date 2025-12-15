'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ChevronRight, Calendar, Clock, User, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { useBooking } from '@/contexts/BookingContext';
import { useBookingStore } from '@/stores/booking.store';
import { cn } from '@/lib/utils';

// Service data (should be moved to a shared location)
const services = [
  { id: 'haircut', name: 'Haircut', price: 25, duration: '30 min' },
  { id: 'shave', name: 'Shave', price: 20, duration: '20 min' },
  { id: 'haircut-shave', name: 'Haircut & Shave', price: 40, duration: '50 min' },
  { id: 'beard-trim', name: 'Beard Trim', price: 15, duration: '15 min' },
  { id: 'hot-towel-shave', name: 'Hot Towel Shave', price: 30, duration: '30 min' },
  { id: 'fade', name: 'Fade', price: 35, duration: '45 min' },
];

const recommendedProducts = [
  { id: 'product1', name: 'Premium Hair Pomade', price: 18, category: 'Styling' },
  { id: 'product2', name: 'Beard Oil & Balm Kit', price: 32, category: 'Beard Care' },
  { id: 'product3', name: 'After Shave Soother', price: 22, category: 'Skincare' },
];

export function BookingSidebar() {
  const { isSidebarOpen, selectedService, closeSidebar } = useBooking();
  const { bookingData, updateBookingData } = useBookingStore();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const selectedServiceData = selectedService ? services.find(s => s.id === selectedService) : null;

  // Handle smooth sidebar closing
  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeSidebar();
      setIsClosing(false);
    }, 300);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen, closeSidebar]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowScrollTop(contentRef.current.scrollTop > 200);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [isSidebarOpen]);

  // Scroll to top function
  const scrollToTop = () => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isSidebarOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop with enhanced transition */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300",
          isClosing ? "bg-transparent backdrop-blur-0" : "bg-black/50 backdrop-blur-sm"
        )}
        onClick={handleCloseSidebar}
      />

      {/* Sidebar with enhanced animations */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50",
          "transform transition-all duration-300 ease-out",
          isClosing ? "translate-x-full" : "translate-x-0",
          "border-l-4 border-secondary flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-br from-primary via-primary/90 to-secondary p-6 md:p-8 overflow-hidden relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/5 rounded-full animate-spin-slow"></div>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {selectedServiceData ? `Book ${selectedServiceData.name}` : "Book Appointment"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm">
                  {selectedServiceData && (
                    <>
                      <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                        <Clock className="h-3 w-3" />
                        {selectedServiceData.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                        ${selectedServiceData.price}
                      </span>
                    </>
                  )}
                  <span className="text-white/70">Premium grooming services</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseSidebar}
              className="self-start md:self-center text-white hover:bg-white/20 rounded-full p-2 md:p-3 hover:scale-110 transition-all duration-200 active:scale-95"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <Button
            variant="secondary"
            size="sm"
            onClick={scrollToTop}
            className="fixed right-8 bottom-8 z-10 rounded-full shadow-lg animate-bounce"
          >
            <ChevronRight className="h-4 w-4 rotate-270" />
          </Button>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Custom scrollbar container */}
          <div 
            ref={contentRef}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/30 scrollbar-track-transparent hover:scrollbar-thumb-secondary/50 scroll-smooth overscroll-contain touch-pan-y"
          >
            <div className="p-6 md:p-8">
              {/* Main booking stepper */}
              <BookingStepper selectedServiceId={selectedService || undefined} />
              
              {/* Additional Information Section */}
              <div className="mt-12 border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  What to Expect
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Before Your Appointment</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Arrive 5 minutes early</li>
                      <li>• Clean, dry hair preferred</li>
                      <li>• Bring reference photos if desired</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">After Your Service</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Style maintenance tips</li>
                      <li>• Product recommendations</li>
                      <li>• Follow-up appointment planning</li>
                    </ul>
                  </div>
                </div>

                {/* Recommended Products */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Recommended Products
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendedProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <span className="font-semibold text-primary">${product.price}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => {
                            const isSelected = bookingData.products.includes(product.id);
                            const newProducts = isSelected
                              ? bookingData.products.filter(id => id !== product.id)
                              : [...bookingData.products, product.id];
                            updateBookingData("products", newProducts);
                          }}
                        >
                          {bookingData.products.includes(product.id) ? "✓ Added" : "Add to Order"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {[
                      { q: "What's your cancellation policy?", a: "Cancel up to 24 hours before for a full refund." },
                      { q: "Do you accept walk-ins?", a: "Appointments are preferred, but we welcome walk-ins based on availability." },
                      { q: "Can I bring a child?", a: "Yes, we offer child-friendly services and have a waiting area." }
                    ].map((faq, index) => (
                      <details 
                        key={index}
                        className="border rounded-lg p-4 hover:border-primary/30 transition-colors group"
                      >
                        <summary className="font-medium text-gray-700 cursor-pointer list-none flex justify-between items-center">
                          {faq.q}
                          <ChevronRight className="h-4 w-4 transform group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="mt-2 text-gray-600 text-sm pl-4">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Footer */}
        <div className="border-t p-4 md:p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Need help?</p>
              <p className="text-xs">Call us at (555) 123-4567</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseSidebar}
                className="text-sm"
              >
                Save for Later
              </Button>
              <Button
                size="sm"
                className="text-sm bg-primary hover:bg-primary/90"
              >
                Continue Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}