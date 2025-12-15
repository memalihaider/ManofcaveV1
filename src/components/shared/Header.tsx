'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Scissors, User, LogOut, Search, X } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useMemo } from "react";
import { FloatingTools } from "./FloatingTools";

export function Header() {
  const { getItemCount } = useCartStore();
  const { user, logout } = useAuth();
  const itemCount = getItemCount();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample product data for search (you can replace this with actual data from your store)
  const allProducts = [
    { id: 'luxury-shampoo', name: "Luxury Shampoo", category: "Hair Care", price: "$45" },
    { id: 'beard-oil', name: "Beard Oil", category: "Beard Care", price: "$35" },
    { id: 'styling-wax', name: "Styling Wax", category: "Styling", price: "$28" },
    { id: 'aftershave-balm', name: "Aftershave Balm", category: "Skin Care", price: "$40" },
    { id: 'hair-serum', name: "Hair Serum", category: "Hair Care", price: "$52" },
    { id: 'beard-wash', name: "Beard Wash", category: "Beard Care", price: "$25" },
    { id: 'premium-conditioner', name: "Premium Conditioner", category: "Hair Care", price: "$42" },
    { id: 'luxury-beard-kit', name: "Luxury Beard Kit", category: "Beard Care", price: "$65" },
    { id: 'gold-hair-mask', name: "Gold Hair Mask", category: "Hair Care", price: "$75" },
    { id: 'premium-beard-oil', name: "Premium Beard Oil", category: "Beard Care", price: "$48" },
    { id: 'luxury-shaving-cream', name: "Luxury Shaving Cream", category: "Shaving", price: "$38" },
    { id: 'diamond-face-serum', name: "Diamond Face Serum", category: "Skin Care", price: "$120" },
    { id: 'luxury-hair-brush', name: "Luxury Hair Brush", category: "Tools", price: "$85" },
    { id: 'platinum-beard-balm', name: "Platinum Beard Balm", category: "Beard Care", price: "$55" },
    { id: 'luxury-cologne', name: "Luxury Cologne", category: "Fragrance", price: "$95" },
    { id: 'vip-grooming-set', name: "VIP Grooming Set", category: "Grooming Kit", price: "$150" },
    { id: 'aromatic-shampoo', name: "Aromatic Shampoo", category: "Hair Care", price: "$48" },
    { id: 'premium-styling-gel', name: "Premium Styling Gel", category: "Styling", price: "$32" },
    { id: 'organic-hair-oil', name: "Organic Hair Oil", category: "Hair Care", price: "$42" },
    { id: 'aromatherapy-beard-oil', name: "Aromatherapy Beard Oil", category: "Beard Care", price: "$38" },
    { id: 'essential-oil-blend', name: "Essential Oil Blend", category: "Hair Care", price: "$55" },
    { id: 'meditation-scalp-serum', name: "Meditation Scalp Serum", category: "Hair Care", price: "$65" },
    { id: 'natural-beard-conditioner', name: "Natural Beard Conditioner", category: "Beard Care", price: "$35" },
    { id: 'aroma-diffuser-oil', name: "Aroma Diffuser Oil", category: "Aromatherapy", price: "$28" },
    { id: 'holistic-hair-tonic', name: "Holistic Hair Tonic", category: "Hair Care", price: "$50" },
    { id: 'wellness-grooming-kit', name: "Wellness Grooming Kit", category: "Wellness", price: "$85" },
    { id: 'luxury-face-mask', name: "Luxury Face Mask", category: "Skin Care", price: "$55" },
    { id: 'executive-grooming-set', name: "Executive Grooming Set", category: "Grooming Kit", price: "$89" },
    { id: 'platinum-shaving-set', name: "Platinum Shaving Set", category: "Shaving", price: "$120" },
    { id: 'diamond-dust-scrub', name: "Diamond Dust Scrub", category: "Skin Care", price: "$85" },
    { id: 'executive-cologne', name: "Executive Cologne", category: "Fragrance", price: "$110" },
    { id: 'luxury-hair-treatment', name: "Luxury Hair Treatment", category: "Hair Care", price: "$95" },
    { id: 'gold-leaf-serum', name: "Gold Leaf Serum", category: "Skin Care", price: "$150" },
    { id: 'executive-beard-kit', name: "Executive Beard Kit", category: "Beard Care", price: "$95" },
    { id: 'luxury-scent-collection', name: "Luxury Scent Collection", category: "Fragrance", price: "$200" },
    { id: 'diamond-grooming-experience', name: "Diamond Grooming Experience", category: "Luxury Experience", price: "$250" },
    { id: 'travel-grooming-kit', name: "Travel Grooming Kit", category: "Travel", price: "$38" },
    { id: 'quick-styling-spray', name: "Quick Styling Spray", category: "Styling", price: "$25" },
    { id: 'mall-shopping-grooming', name: "Mall Shopping Grooming", category: "Quick Service", price: "$20" },
    { id: 'express-beard-trim', name: "Express Beard Trim", category: "Quick Service", price: "$15" },
    { id: 'shopping-companion-kit', name: "Shopping Companion Kit", category: "Travel", price: "$45" },
    { id: 'quick-hair-refresh', name: "Quick Hair Refresh", category: "Quick Service", price: "$18" },
    { id: 'mall-vip-treatment', name: "Mall VIP Treatment", category: "VIP Service", price: "$60" },
    { id: 'express-styling-kit', name: "Express Styling Kit", category: "Styling", price: "$35" },
    { id: 'shopping-day-package', name: "Shopping Day Package", category: "Package", price: "$75" },
    { id: 'mall-exclusive-perfume', name: "Mall Exclusive Perfume", category: "Fragrance", price: "$55" },
    { id: 'businessman-special', name: "Businessman Special Kit", category: "Professional", price: "$72" },
    { id: 'premium-scalp-serum', name: "Premium Scalp Serum", category: "Hair Care", price: "$58" },
    { id: 'corporate-hair-gel', name: "Corporate Hair Gel", category: "Styling", price: "$28" },
    { id: 'executive-shaving-kit', name: "Executive Shaving Kit", category: "Shaving", price: "$65" },
    { id: 'business-fragrance', name: "Business Fragrance", category: "Fragrance", price: "$45" },
    { id: 'corporate-beard-care', name: "Corporate Beard Care", category: "Beard Care", price: "$40" },
    { id: 'meeting-ready-spray', name: "Meeting Ready Spray", category: "Styling", price: "$25" },
    { id: 'executive-grooming-bag', name: "Executive Grooming Bag", category: "Travel", price: "$85" },
    { id: 'boardroom-special', name: "Boardroom Special", category: "Special Treatment", price: "$55" },
    { id: 'corporate-wellness-kit', name: "Corporate Wellness Kit", category: "Wellness", price: "$95" },
    { id: 'traditional-beard-oil', name: "Traditional Beard Oil", category: "Beard Care", price: "$39" },
    { id: 'herbal-hair-tonic', name: "Herbal Hair Tonic", category: "Hair Care", price: "$44" },
    { id: 'traditional-shaving-cream', name: "Traditional Shaving Cream", category: "Shaving", price: "$32" },
    { id: 'natural-beard-conditioner', name: "Natural Beard Conditioner", category: "Beard Care", price: "$35" },
    { id: 'herbal-scalp-oil', name: "Herbal Scalp Oil", category: "Hair Care", price: "$38" },
    { id: 'traditional-hair-pomade', name: "Traditional Hair Pomade", category: "Styling", price: "$28" },
    { id: 'natural-face-soap', name: "Natural Face Soap", category: "Skin Care", price: "$25" },
    { id: 'herbal-beard-wash', name: "Herbal Beard Wash", category: "Beard Care", price: "$30" },
    { id: 'traditional-grooming-kit', name: "Traditional Grooming Kit", category: "Grooming Kit", price: "$65" },
    { id: 'natural-cologne', name: "Natural Cologne", category: "Fragrance", price: "$42" },
  ];

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8); // Limit to 8 results
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <span className="text-2xl font-serif font-bold text-primary">Man of Cave</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {/* <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link> */}
          <Link href="/services" className="text-foreground hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/branches" className="text-foreground hover:text-primary transition-colors">
            Branches
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="p-2 h-8 w-8" title="Search products">
                <Search className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Products
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                    autoFocus
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {searchQuery && (
                  <div className="max-h-64 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <div className="space-y-2">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              // You can add navigation logic here
                              window.location.href = `/products/${product.id}`;
                            }}
                          >
                            <div>
                              <h4 className="font-medium text-sm">{product.name}</h4>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                            <span className="text-sm font-semibold text-primary">{product.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No products found</p>
                        <p className="text-xs">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}

                {!searchQuery && (
                  <div className="text-center py-8 text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start typing to search products...</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/cart">
            <Button variant="outline" className="relative p-2 h-8 w-8">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-secondary text-primary text-xs min-w-[20px] h-5 flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user && user.role === 'customer' ? (
            <div className="flex items-center gap-2">
              <Link href="/customer/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {user.fullName?.split(' ')[0] || 'Account'}
                  </span>
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w- h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/customer/login">Sign In</Link>
              </Button>
              <Button asChild className="hidden sm:flex">
                <Link href="/customer/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      </header>
      <FloatingTools />
    </>
  );
}