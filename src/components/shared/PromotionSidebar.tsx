'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Gift, Calendar, Clock, MapPin, Star, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { useBooking } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';

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

interface PromotionSidebarProps {
  promotion: Promotion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromotionSidebar({ promotion, isOpen, onClose }: PromotionSidebarProps) {
  const { openSidebar } = useBooking();
  const [isClosing, setIsClosing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle smooth sidebar closing
  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
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

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      // Handle scroll if needed
    };

    const contentElement = contentRef.current;
    if (contentElement && isOpen) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  const handleBookNow = () => {
    handleCloseSidebar();
    setTimeout(() => {
      openSidebar();
    }, 300);
  };

  if (!isOpen || !promotion) return null;

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
        <div className="flex-shrink-0 bg-gradient-to-br from-secondary via-secondary/90 to-primary p-6 md:p-8 overflow-hidden relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/5 rounded-full animate-spin-slow"></div>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {promotion.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm">
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                    <Tag className="h-3 w-3" />
                    {promotion.discount}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                    <Clock className="h-3 w-3" />
                    {promotion.validUntil}
                  </span>
                  <span className="text-white/70">Exclusive offer</span>
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

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Custom scrollbar container */}
          <div
            ref={contentRef}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/30 scrollbar-track-transparent hover:scrollbar-thumb-secondary/50 scroll-smooth overscroll-contain touch-pan-y"
          >
            <div className="p-6 md:p-8">
              {/* Promotion Image */}
              <div className="relative mb-8 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-primary font-semibold shadow-lg">
                    {promotion.badge}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-secondary text-primary font-bold shadow-lg">
                    {promotion.discount}
                  </Badge>
                </div>
              </div>

              {/* Promotion Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-secondary" />
                    Offer Details
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {promotion.description}
                  </p>
                </div>

                <Separator />

                {/* Terms and Conditions */}
                {promotion.terms && (
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Terms & Conditions</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {promotion.terms}
                    </p>
                  </div>
                )}

                {/* Applicable Services */}
                {promotion.applicableServices && promotion.applicableServices.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-3">Applicable Services</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {promotion.applicableServices.map((service, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Branches */}
                {promotion.branches && promotion.branches.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-secondary" />
                      Available Locations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {promotion.branches.map((branch, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {branch.charAt(0).toUpperCase() + branch.slice(1)} Branch
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coupon Code */}
                {promotion.couponCode && (
                  <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 rounded-xl border border-secondary/20">
                    <h4 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-secondary" />
                      Coupon Code
                    </h4>
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-secondary/30">
                      <code className="text-2xl font-mono font-bold text-primary bg-secondary/10 px-4 py-2 rounded block text-center">
                        {promotion.couponCode}
                      </code>
                      <p className="text-sm text-gray-600 text-center mt-2">
                        Copy this code and use it during booking
                      </p>
                    </div>
                  </div>
                )}

                {/* Validity */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Clock className="h-4 w-4 text-secondary" />
                    <span className="font-medium">Valid Until:</span>
                  </div>
                  <p className="text-gray-600">{promotion.validUntil}</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 space-y-4">
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Now & Claim Offer
                </Button>

                {promotion.couponCode && (
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(promotion.couponCode!)}
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Copy Coupon Code
                  </Button>
                )}
              </div>

              {/* Additional Information */}
              <div className="mt-8 border-t pt-6">
                <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-secondary" />
                  Why Choose This Offer?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Gift className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Exclusive Savings</h5>
                      <p className="text-sm text-gray-600">Limited-time offer available only to select customers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Premium Service</h5>
                      <p className="text-sm text-gray-600">Experience our world-class grooming services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Expert Stylists</h5>
                      <p className="text-sm text-gray-600">Professional care from certified grooming experts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Multiple Locations</h5>
                      <p className="text-sm text-gray-600">Conveniently located across the city</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}