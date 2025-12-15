'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, DollarSign, MapPin, Users, Gift, Star } from "lucide-react";
import { useBranchStore } from "@/stores/branch.store";
import { useCurrencyStore } from "@/stores/currency.store";

export function FloatingTools() {
  const { branches, selectedBranch, setSelectedBranch } = useBranchStore();
  const { currencies, selectedCurrency, setSelectedCurrency } = useCurrencyStore();
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');
  const [isOpen, setIsOpen] = useState(false);

  // Exclusive Promotions Mock Data
  const exclusivePromotions = [
    {
      id: 'vip-lounge',
      title: 'VIP Lounge Access',
      description: 'Exclusive access to premium lounge with complimentary beverages',
      discount: 'Free',
      validUntil: '2025-12-31',
      category: 'Service'
    },
    {
      id: 'diamond-package',
      title: 'Diamond Grooming Package',
      description: 'Complete grooming experience with premium products',
      discount: '50% OFF',
      validUntil: '2025-12-25',
      category: 'Package'
    },
    {
      id: 'loyalty-reward',
      title: 'Loyalty Member Reward',
      description: 'Special discount for our valued returning customers',
      discount: '30% OFF',
      validUntil: '2025-12-20',
      category: 'Discount'
    },
    {
      id: 'birthday-special',
      title: 'Birthday Special Treatment',
      description: 'Celebrate your special day with complimentary services',
      discount: 'Free Service',
      validUntil: '2025-12-31',
      category: 'Celebration'
    },
    {
      id: 'early-bird',
      title: 'Early Bird Discount',
      description: 'Book before 10 AM and get special morning rates',
      discount: '25% OFF',
      validUntil: '2025-12-31',
      category: 'Time-based'
    }
  ];

  const toggleGender = () => {
    setSelectedGender(prev => prev === 'men' ? 'women' : 'men');
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/97124109999?text=Hi%20Man%20of%20Cave!%20I%20would%20like%20to%20book%20an%20appointment."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-10 transform translate-x-1/2 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
        title="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7 text-white mx-auto mt-3.5 justify-center items-center"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </a>

      {/* Floating Action Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-10 transform translate-x-1/2 z-50 w-14 h-14 rounded-full bg-gold hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            size="icon"
            title="Settings & Tools"
          >
            <Settings className="w-6 h-6 text-white" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings & Tools
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Gender Preference
              </label>
              <div className="flex gap-2">
                <Button
                  variant={selectedGender === 'men' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedGender('men')}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M12 12v8"/>
                    <path d="M8 16h8"/>
                  </svg>
                  Men
                </Button>
                <Button
                  variant={selectedGender === 'women' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedGender('women')}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M12 12v8"/>
                    <path d="M8 16h8"/>
                    <circle cx="9" cy="6" r="1"/>
                    <circle cx="15" cy="6" r="1"/>
                  </svg>
                  Women
                </Button>
              </div>
            </div>

            {/* Currency Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Currency
              </label>
              <Select
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{currency.symbol}</span>
                        <span>{currency.name}</span>
                        <span className="text-xs text-gray-500">({currency.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Branch
              </label>
              <Select
                value={selectedBranch?.id || "all"}
                onValueChange={(value) => {
                  const branch = value === "all" ? null : branches.find(b => b.id === value) || null;
                  setSelectedBranch(branch);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exclusive Promotions */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Exclusive Promotions
              </label>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {exclusivePromotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="p-3 rounded-lg border bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        {promo.title}
                      </h4>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {promo.discount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {promo.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}