'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { Scissors, MapPin, Star, Clock, Phone, Mail, Gift, Copy, ChevronDown, ShoppingCart, CheckCircle, AlertCircle, Info, X, Settings, Users } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { PromotionSidebar } from "@/components/shared/PromotionSidebar";
import { PromotionProvider, usePromotion } from "@/contexts/PromotionContext";
import Link from "next/link";
import { useCartStore } from "@/stores/cart.store";
import { useBranchStore } from "@/stores/branch.store";
import { useCurrencyStore } from "@/stores/currency.store";
import { useTeamStore } from "@/stores/team.store";
import { useBooking } from "@/contexts/BookingContext";

import dynamic from 'next/dynamic';

// Create a component that uses the promotion context
const PromotionSidebarWrapper = dynamic(
  () => Promise.resolve(function PromotionSidebarWrapper() {
    const { selectedPromotion, isPromotionSidebarOpen, closePromotionSidebar } = usePromotion();

    return (
      <PromotionSidebar
        promotion={selectedPromotion}
        isOpen={isPromotionSidebarOpen}
        onClose={closePromotionSidebar}
      />
    );
  }),
  { ssr: false }
);

export default function Home() {
  const { addItem } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const { convertPrice, getCurrencySymbol, selectedCurrency } = useCurrencyStore();
  const { getTeamMembersByBranch } = useTeamStore();
  const { openSidebar } = useBooking();
  
  const [isMounted, setIsMounted] = useState(false);
  const { openPromotionSidebar } = usePromotion();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Toast notification functions
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Helper function to handle promotion sidebar opening
  const handleOpenPromotionSidebar = (promo: any) => {
    if (isMounted) {
      openPromotionSidebar(promo);
    }
  };

  // Helper function to handle claiming promotion
  const handleClaimOffer = (promo: any) => {
    showToast(`🎉 ${promo.title} claimed successfully! Use code: ${promo.couponCode}`, 'success');
  };

  // Helper function to handle adding item to cart with toast
  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id || product.name,
      name: product.name,
      price: parseFloat(product.price.replace('$', '')),
      image: product.image,
    });
    showToast(`✅ ${product.name} added to cart!`, 'success');
  };

  // Helper function to format prices with currency conversion
  const formatPrice = (priceString: string) => {
    // Extract numeric value from price string (e.g., "From $35" -> 35)
    const match = priceString.match(/\$?(\d+)/);
    if (!match) return priceString;

    const basePrice = parseFloat(match[1]);
    const convertedPrice = convertPrice(basePrice);
    const symbol = getCurrencySymbol();

    return priceString.replace(/\$\d+/, `${symbol}${convertedPrice}`);
  };

  // Services data with branch information, promotions, and coupon codes
  const allServices = [
    // Alwahda Branch Services (10+ services)
    {
      name: "Haircut & Styling",
      price: "From $35",
      originalPrice: "$45",
      description: "Professional cuts with modern techniques",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "30-45 min",
      branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"],
      promotion: "20% off first visit",
      couponCode: "ALWAHDA20"
    },
    {
      name: "Beard Trim & Shape",
      price: "From $25",
      description: "Expert beard grooming and shaping",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "20 min",
      branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc"],
      promotion: "Free beard oil with service",
      couponCode: "BEARDGIFT"
    },
    {
      name: "Hair Styling",
      price: "From $15",
      description: "Modern styling with premium products",
      image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "20 min",
      branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"],
      promotion: "Buy 5 get 1 free",
      couponCode: "STYLE5GET1"
    },
    {
      name: "Scalp Treatment",
      price: "From $40",
      description: "Therapeutic scalp massage and treatment",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      duration: "30 min",
      branches: ["alwahda", "madinat", "khalifa", "wtc"],
      promotion: "15% off scalp treatment",
      couponCode: "SCALP15"
    },
    {
      name: "Eyebrow Shaping",
      price: "From $20",
      description: "Professional eyebrow grooming and shaping",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "15 min",
      branches: ["alwahda", "madinat", "marina-mall", "salam-street"],
      promotion: "Free eyebrow tint with shaping",
      couponCode: "EYEBROWFREE"
    },
    {
      name: "Neck & Shoulder Massage",
      price: "From $25",
      description: "Relaxing massage for neck and shoulders",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "25 min",
      branches: ["alwahda", "khalifa", "wtc", "salam-street"],
      promotion: "25% off massage packages",
      couponCode: "MASSAGE25"
    },
    {
      name: "VIP Hair Treatment",
      price: "From $60",
      description: "Luxury hair treatment with premium products",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "45 min",
      branches: ["alwahda"],
      promotion: "VIP members get 30% off",
      couponCode: "VIPHAIR30"
    },
    {
      name: "Luxury Facial",
      price: "From $50",
      description: "Complete facial treatment with gold masks",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "40 min",
      branches: ["alwahda"],
      promotion: "Free facial cleanser with service",
      couponCode: "FACIALGIFT"
    },
    {
      name: "Executive Haircut",
      price: "From $45",
      description: "Premium haircut for business professionals",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "35 min",
      branches: ["alwahda"],
      promotion: "Business card holders get 20% off",
      couponCode: "EXECUTIVE20"
    },
    {
      name: "Complete Grooming Package",
      price: "From $80",
      description: "Full grooming experience including haircut, beard, and styling",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      duration: "75 min",
      branches: ["alwahda"],
      promotion: "Package deal: Save $25",
      couponCode: "PACKAGE25"
    },
    {
      name: "Hair Coloring Service",
      price: "From $70",
      description: "Professional hair coloring with premium dyes",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "90 min",
      branches: ["alwahda"],
      promotion: "First color treatment 15% off",
      couponCode: "COLOR15"
    },
    {
      name: "Deep Conditioning Treatment",
      price: "From $35",
      description: "Intensive conditioning for damaged hair",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "30 min",
      branches: ["alwahda"],
      promotion: "Free conditioning mask sample",
      couponCode: "CONDITIONFREE"
    },

    // Madinat Branch Services (10+ services)
    {
      name: "Deep Conditioning",
      price: "From $30",
      description: "Intensive hair conditioning treatment",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "35 min",
      branches: ["madinat", "khalifa", "marina-mall", "wtc"],
      promotion: "Buy 3 get 1 free",
      couponCode: "CONDITION3GET1"
    },
    {
      name: "Express Service",
      price: "From $20",
      description: "Quick grooming service for busy schedules",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "15 min",
      branches: ["alwahda", "madinat", "marina-mall", "wtc", "salam-street"],
      promotion: "Express services 10% off",
      couponCode: "EXPRESS10"
    },
    {
      name: "VIP Grooming Package",
      price: "From $85",
      description: "Complete grooming experience with premium treatments",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      duration: "90 min",
      branches: ["madinat"],
      promotion: "VIP package includes free consultation",
      couponCode: "VIPPACKAGE"
    },
    {
      name: "Hot Towel Shave",
      price: "From $35",
      description: "Traditional straight razor shave experience",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      duration: "30 min",
      branches: ["madinat", "khalifa", "wtc"],
      promotion: "Hot towel shave with free aftershave",
      couponCode: "SHAVEGIFT"
    },
    {
      name: "Aromatherapy Scalp Massage",
      price: "From $45",
      description: "Relaxing scalp massage with essential oils",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      duration: "40 min",
      branches: ["madinat"],
      promotion: "Aromatherapy session 25% off",
      couponCode: "AROMA25"
    },
    {
      name: "Premium Hair Coloring",
      price: "From $80",
      description: "High-end hair coloring with organic dyes",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "120 min",
      branches: ["madinat"],
      promotion: "Color correction 20% off",
      couponCode: "COLORCORRECT20"
    },
    {
      name: "Gentlemen's Facial",
      price: "From $40",
      description: "Specialized facial treatment for men",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "35 min",
      branches: ["madinat"],
      promotion: "First facial treatment free",
      couponCode: "FIRSTFACIAL"
    },
    {
      name: "Hair Extension Consultation",
      price: "From $25",
      description: "Professional consultation for hair extensions",
      image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "30 min",
      branches: ["madinat"],
      promotion: "Free consultation, 15% off extensions",
      couponCode: "EXTENSION15"
    },
    {
      name: "Luxury Beard Grooming",
      price: "From $50",
      description: "Complete beard care with premium products",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "45 min",
      branches: ["madinat"],
      promotion: "Beard grooming package 30% off",
      couponCode: "BEARDPACKAGE30"
    },
    {
      name: "Stress Relief Massage",
      price: "From $55",
      description: "Therapeutic massage to reduce stress and tension",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "50 min",
      branches: ["madinat"],
      promotion: "Massage sessions buy 2 get 1 free",
      couponCode: "MASSAGE2GET1"
    },
    {
      name: "Organic Hair Treatment",
      price: "From $65",
      description: "Natural treatment using organic ingredients",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "60 min",
      branches: ["madinat"],
      promotion: "Organic treatments 20% off",
      couponCode: "ORGANIC20"
    },

    // Khalifa Branch Services (10+ services)
    {
      name: "Luxury Facial Treatment",
      price: "From $55",
      description: "Advanced facial with premium skincare products",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "50 min",
      branches: ["khalifa"],
      promotion: "Luxury facial with free gold mask",
      couponCode: "LUXURYFACIAL"
    },
    {
      name: "Hair Coloring & Highlights",
      price: "From $75",
      description: "Professional coloring and highlighting services",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "120 min",
      branches: ["khalifa", "wtc"],
      promotion: "Color services 25% off",
      couponCode: "COLOR25"
    },
    {
      name: "Diamond Facial",
      price: "From $90",
      description: "Luxury facial with diamond dust exfoliation",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "70 min",
      branches: ["khalifa"],
      promotion: "Diamond facial includes champagne",
      couponCode: "DIAMONDCHAMP"
    },
    {
      name: "Executive Haircut",
      price: "From $55",
      description: "Premium haircut for business executives",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "40 min",
      branches: ["khalifa"],
      promotion: "Executive package with free coffee",
      couponCode: "EXECPACKAGE"
    },
    {
      name: "Gold Hair Treatment",
      price: "From $100",
      description: "Luxury hair treatment with 24k gold particles",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "80 min",
      branches: ["khalifa"],
      promotion: "Gold treatment 30% off first visit",
      couponCode: "GOLD30"
    },
    {
      name: "VIP Spa Experience",
      price: "From $150",
      description: "Complete spa experience with private room",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "120 min",
      branches: ["khalifa"],
      promotion: "VIP experience includes private butler",
      couponCode: "VIPSPA"
    },
    {
      name: "Platinum Beard Service",
      price: "From $70",
      description: "Ultimate beard grooming with platinum products",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "50 min",
      branches: ["khalifa"],
      promotion: "Platinum service with free grooming kit",
      couponCode: "PLATINUMKIT"
    },
    {
      name: "Designer Haircut",
      price: "From $80",
      description: "Custom haircut designed by celebrity stylists",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "60 min",
      branches: ["khalifa"],
      promotion: "Designer cut with style consultation",
      couponCode: "DESIGNERCUT"
    },
    {
      name: "Luxury Scalp Therapy",
      price: "From $85",
      description: "Advanced scalp treatment with luxury products",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      duration: "55 min",
      branches: ["khalifa"],
      promotion: "Scalp therapy 20% off",
      couponCode: "SCALPTHERAPY20"
    },
    {
      name: "Champagne Hair Wash",
      price: "From $40",
      description: "Luxury hair wash experience with champagne",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "30 min",
      branches: ["khalifa"],
      promotion: "Champagne wash with free flute",
      couponCode: "CHAMPAGNEWASH"
    },

    // Marina Mall Branch Services (10+ services)
    {
      name: "Quick Touch-Up",
      price: "From $15",
      description: "Fast grooming touch-ups for busy professionals",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      duration: "10 min",
      branches: ["marina-mall"],
      promotion: "Quick touch-up 50% off",
      couponCode: "QUICK50"
    },
    {
      name: "Express Haircut",
      price: "From $25",
      description: "Quick professional haircut for busy schedules",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "20 min",
      branches: ["marina-mall"],
      promotion: "Express service with free coffee",
      couponCode: "EXPRESSCOFFEE"
    },
    {
      name: "Travel Grooming Kit Service",
      price: "From $35",
      description: "Complete grooming service with travel kit",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "30 min",
      branches: ["marina-mall"],
      promotion: "Travel kit included free",
      couponCode: "TRAVELFREE"
    },
    {
      name: "Business Lunch Grooming",
      price: "From $30",
      description: "Quick grooming service during lunch break",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "15 min",
      branches: ["marina-mall"],
      promotion: "Lunch hour special 25% off",
      couponCode: "LUNCH25"
    },
    {
      name: "Mall Shopping Grooming",
      price: "From $20",
      description: "Quick grooming while shopping",
      image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "15 min",
      branches: ["marina-mall"],
      promotion: "Shopping companion grooming",
      couponCode: "SHOPPINGGROOM"
    },
    {
      name: "Family Grooming Package",
      price: "From $60",
      description: "Grooming services for the whole family",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      duration: "60 min",
      branches: ["marina-mall"],
      promotion: "Family package 30% off",
      couponCode: "FAMILY30"
    },
    {
      name: "Date Night Styling",
      price: "From $40",
      description: "Special styling for romantic occasions",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "35 min",
      branches: ["marina-mall"],
      promotion: "Date night special with free styling tips",
      couponCode: "DATENIGHT"
    },
    {
      name: "Weekend Warrior Grooming",
      price: "From $35",
      description: "Complete grooming for weekend activities",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "30 min",
      branches: ["marina-mall"],
      promotion: "Weekend grooming 20% off",
      couponCode: "WEEKEND20"
    },
    {
      name: "Mall VIP Experience",
      price: "From $50",
      description: "VIP grooming experience at the mall",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "45 min",
      branches: ["marina-mall"],
      promotion: "VIP experience with free mall gift card",
      couponCode: "MALLVIP"
    },
    {
      name: "Quick Facial Refresh",
      price: "From $25",
      description: "Fast facial treatment for busy shoppers",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "20 min",
      branches: ["marina-mall"],
      promotion: "Facial refresh with free samples",
      couponCode: "FACIALREFRESH"
    },

    // WTC Branch Services (10+ services)
    {
      name: "Executive Grooming",
      price: "From $65",
      description: "Professional grooming for business executives",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "60 min",
      branches: ["wtc"],
      promotion: "Executive grooming with free tie adjustment",
      couponCode: "EXECGROOM"
    },
    {
      name: "Business Class Haircut",
      price: "From $50",
      description: "Professional haircut for business professionals",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "45 min",
      branches: ["wtc"],
      promotion: "Business class with free shoe shine",
      couponCode: "BUSINESSCLASS"
    },
    {
      name: "Corporate Beard Trim",
      price: "From $30",
      description: "Professional beard grooming for corporate settings",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "25 min",
      branches: ["wtc"],
      promotion: "Corporate trim 15% off",
      couponCode: "CORPORATE15"
    },
    {
      name: "Meeting Ready Styling",
      price: "From $25",
      description: "Quick styling for important meetings",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "20 min",
      branches: ["wtc"],
      promotion: "Meeting ready with free cologne",
      couponCode: "MEETINGREADY"
    },
    {
      name: "Power Lunch Grooming",
      price: "From $40",
      description: "Quick grooming for power lunch meetings",
      image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "25 min",
      branches: ["wtc"],
      promotion: "Power lunch special 25% off",
      couponCode: "POWERLUNCH25"
    },
    {
      name: "Boardroom Package",
      price: "From $75",
      description: "Complete grooming package for boardroom presence",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      duration: "55 min",
      branches: ["wtc"],
      promotion: "Boardroom package includes free consultation",
      couponCode: "BOARDROOM"
    },
    {
      name: "Executive Facial",
      price: "From $60",
      description: "Professional facial for business executives",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "45 min",
      branches: ["wtc"],
      promotion: "Executive facial 20% off",
      couponCode: "EXECFACIAL20"
    },
    {
      name: "Corporate Hair Coloring",
      price: "From $85",
      description: "Professional coloring for corporate environment",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "90 min",
      branches: ["wtc"],
      promotion: "Corporate color with free maintenance tips",
      couponCode: "CORPORATECOLOR"
    },
    {
      name: "Leadership Grooming",
      price: "From $70",
      description: "Premium grooming for leadership roles",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      duration: "50 min",
      branches: ["wtc"],
      promotion: "Leadership package 30% off",
      couponCode: "LEADERSHIP30"
    },
    {
      name: "Business Travel Grooming",
      price: "From $45",
      description: "Grooming service for business travelers",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "35 min",
      branches: ["wtc"],
      promotion: "Business travel with free travel kit",
      couponCode: "BUSINESSTRAVEL"
    },

    // Salam Street Branch Services (10+ services)
    {
      name: "Traditional Grooming",
      price: "From $45",
      description: "Classic barbering with traditional techniques",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "45 min",
      branches: ["salam-street"],
      promotion: "Traditional grooming with free hot towel",
      couponCode: "TRADITIONALHOT"
    },
    {
      name: "Herbal Hair Treatment",
      price: "From $50",
      description: "Natural hair treatment with herbal ingredients",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "50 min",
      branches: ["salam-street"],
      promotion: "Herbal treatment 25% off",
      couponCode: "HERBAL25"
    },
    {
      name: "Traditional Beard Oil Massage",
      price: "From $30",
      description: "Traditional beard care with natural oils",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "25 min",
      branches: ["salam-street"],
      promotion: "Traditional oil massage free with service",
      couponCode: "OILFREE"
    },
    {
      name: "Natural Scalp Therapy",
      price: "From $40",
      description: "Natural scalp treatment with organic ingredients",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      duration: "35 min",
      branches: ["salam-street"],
      promotion: "Natural therapy with free herbal tea",
      couponCode: "NATURALTEA"
    },
    {
      name: "Classic Straight Razor Shave",
      price: "From $35",
      description: "Traditional straight razor shaving experience",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      duration: "30 min",
      branches: ["salam-street"],
      promotion: "Classic shave with free aftershave balm",
      couponCode: "CLASSICBALM"
    },
    {
      name: "Herbal Hair Coloring",
      price: "From $65",
      description: "Natural hair coloring with herbal dyes",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "75 min",
      branches: ["salam-street"],
      promotion: "Herbal coloring 20% off",
      couponCode: "HERBALCOLOR20"
    },
    {
      name: "Traditional Haircut",
      price: "From $30",
      description: "Classic barber haircut with traditional techniques",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "35 min",
      branches: ["salam-street"],
      promotion: "Traditional cut with free hot lather",
      couponCode: "TRADCUTLATHER"
    },
    {
      name: "Natural Beard Grooming",
      price: "From $35",
      description: "Natural beard care with organic products",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "30 min",
      branches: ["salam-street"],
      promotion: "Natural grooming 15% off",
      couponCode: "NATURALGROOM15"
    },
    {
      name: "Herbal Facial Treatment",
      price: "From $45",
      description: "Natural facial with herbal ingredients",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: "40 min",
      branches: ["salam-street"],
      promotion: "Herbal facial with free herbal mask",
      couponCode: "HERBALFACIAL"
    },
    {
      name: "Traditional Grooming Package",
      price: "From $70",
      description: "Complete traditional grooming experience",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      duration: "65 min",
      branches: ["salam-street"],
      promotion: "Traditional package 25% off",
      couponCode: "TRADPACKAGE25"
    }
  ];

  // Products data with branch information, promotions, and coupon codes
  const allProducts = [
    // Universal Products (available at all branches)
    {
      id: 'luxury-shampoo',
      name: "Luxury Shampoo",
      price: "$45",
      originalPrice: "$55",
      description: "Organic ingredients for healthy, voluminous hair with professional salon results",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Bestseller",
      branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"],
      promotion: "Buy 2 get 1 free",
      couponCode: "SHAMPOO3GET1"
    },
    {
      id: 'beard-oil',
      name: "Beard Oil",
      price: "$35",
      description: "Nourishing blend of natural oils for soft, manageable beard care",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "Professional",
      branches: ["alwahda", "madinat", "khalifa", "wtc", "salam-street"],
      promotion: "Free beard brush with purchase",
      couponCode: "BEARDOILFREE"
    },
    {
      id: 'styling-wax',
      name: "Styling Wax",
      price: "$28",
      description: "Professional hold and natural shine for all hair types and styles",
      category: "Styling",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Trending",
      branches: ["alwahda", "madinat", "marina-mall", "wtc", "salam-street"],
      promotion: "20% off styling products",
      couponCode: "STYLE20"
    },
    {
      id: 'aftershave-balm',
      name: "Aftershave Balm",
      price: "$40",
      description: "Soothing and moisturizing balm that calms skin after shaving",
      category: "Skin Care",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      badge: "New Arrival",
      branches: ["alwahda", "khalifa", "marina-mall", "wtc"],
      promotion: "Aftershave balm 15% off",
      couponCode: "AFTERSHAVE15"
    },
    {
      id: 'hair-serum',
      name: "Hair Serum",
      price: "$52",
      description: "Advanced hair serum for shine and protection",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Premium",
      branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"],
      promotion: "Hair care bundle 25% off",
      couponCode: "HAIRBUNDLE25"
    },
    {
      id: 'beard-wash',
      name: "Beard Wash",
      price: "$25",
      description: "Gentle cleansing shampoo specifically for beards",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Essential",
      branches: ["alwahda", "madinat", "khalifa", "wtc", "salam-street"],
      promotion: "Beard care set 30% off",
      couponCode: "BEARDSET30"
    },

    // Alwahda Branch Products (10+ products)
    {
      id: 'premium-conditioner',
      name: "Premium Conditioner",
      price: "$42",
      description: "Deep conditioning formula for damaged and dry hair",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Alwahda Exclusive",
      branches: ["alwahda"],
      promotion: "Conditioner buy 2 get 1 free",
      couponCode: "CONDITIONER3GET1"
    },
    {
      id: 'luxury-beard-kit',
      name: "Luxury Beard Kit",
      price: "$65",
      description: "Complete beard care kit with oil, balm, and brush",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Complete Kit",
      branches: ["alwahda"],
      promotion: "Luxury kit with free engraving",
      couponCode: "LUXURYKIT"
    },
    {
      id: 'gold-hair-mask',
      name: "Gold Hair Mask",
      price: "$75",
      description: "Luxury hair mask with 24k gold particles",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      badge: "Luxury",
      branches: ["alwahda"],
      promotion: "Gold mask 20% off first purchase",
      couponCode: "GOLDMASK20"
    },
    {
      id: 'premium-beard-oil',
      name: "Premium Beard Oil",
      price: "$48",
      description: "High-end beard oil with rare essential oils",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "Premium",
      branches: ["alwahda"],
      promotion: "Premium oil with free applicator",
      couponCode: "PREMIUMOIL"
    },
    {
      id: 'luxury-shaving-cream',
      name: "Luxury Shaving Cream",
      price: "$38",
      description: "Rich shaving cream for the ultimate shave",
      category: "Shaving",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      badge: "Luxury",
      branches: ["alwahda"],
      promotion: "Shaving cream 15% off",
      couponCode: "SHAVECREAM15"
    },
    {
      id: 'diamond-face-serum',
      name: "Diamond Face Serum",
      price: "$120",
      description: "Anti-aging serum with real diamond particles",
      category: "Skin Care",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Diamond Series",
      branches: ["alwahda"],
      promotion: "Diamond serum with free consultation",
      couponCode: "DIAMONDSERUM"
    },
    {
      id: 'luxury-hair-brush',
      name: "Luxury Hair Brush",
      price: "$85",
      description: "Professional hair brush with natural bristles",
      category: "Tools",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Professional",
      branches: ["alwahda"],
      promotion: "Luxury brush 25% off",
      couponCode: "LUXURYBRUSH25"
    },
    {
      id: 'platinum-beard-balm',
      name: "Platinum Beard Balm",
      price: "$55",
      description: "Premium beard balm for styling and conditioning",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Platinum",
      branches: ["alwahda"],
      promotion: "Platinum balm with free mini size",
      couponCode: "PLATINUMBALM"
    },
    {
      id: 'luxury-cologne',
      name: "Luxury Cologne",
      price: "$95",
      description: "Signature cologne with rare ingredients",
      category: "Fragrance",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Signature",
      branches: ["alwahda"],
      promotion: "Luxury cologne 30% off",
      couponCode: "LUXURYCOLOGNE30"
    },
    {
      id: 'vip-grooming-set',
      name: "VIP Grooming Set",
      price: "$150",
      description: "Complete VIP grooming set with all essentials",
      category: "Grooming Kit",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "VIP Exclusive",
      branches: ["alwahda"],
      promotion: "VIP set with personal engraving",
      couponCode: "VIPSET"
    },

    // Madinat Branch Products (10+ products)
    {
      id: 'aromatic-shampoo',
      name: "Aromatic Shampoo",
      price: "$48",
      description: "Scented shampoo with essential oils for a refreshing experience",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Madinat Exclusive",
      branches: ["madinat"],
      promotion: "Aromatic shampoo 20% off",
      couponCode: "AROMATIC20"
    },
    {
      id: 'premium-styling-gel',
      name: "Premium Styling Gel",
      price: "$32",
      description: "Strong hold styling gel with natural ingredients",
      category: "Styling",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      badge: "Professional Grade",
      branches: ["madinat"],
      promotion: "Styling gel buy 2 get 1 free",
      couponCode: "STYLING3GET1"
    },
    {
      id: 'organic-hair-oil',
      name: "Organic Hair Oil",
      price: "$42",
      description: "Pure organic oil for hair nourishment",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Organic",
      branches: ["madinat"],
      promotion: "Organic oil with free dropper",
      couponCode: "ORGANICOIL"
    },
    {
      id: 'aromatherapy-beard-oil',
      name: "Aromatherapy Beard Oil",
      price: "$38",
      description: "Beard oil with calming aromatherapy scents",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "Aromatherapy",
      branches: ["madinat"],
      promotion: "Aromatherapy oil 25% off",
      couponCode: "AROMABEARD25"
    },
    {
      id: 'essential-oil-blend',
      name: "Essential Oil Blend",
      price: "$55",
      description: "Custom blend of essential oils for hair and scalp",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      badge: "Custom Blend",
      branches: ["madinat"],
      promotion: "Essential oil blend 30% off",
      couponCode: "ESSENTIAL30"
    },
    {
      id: 'meditation-scalp-serum',
      name: "Meditation Scalp Serum",
      price: "$65",
      description: "Scalp serum designed for relaxation and hair growth",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      badge: "Meditation",
      branches: ["madinat"],
      promotion: "Meditation serum with free guided session",
      couponCode: "MEDITATIONSERUM"
    },
    {
      id: 'natural-beard-conditioner',
      name: "Natural Beard Conditioner",
      price: "$35",
      description: "All-natural conditioner for beard hair",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Natural",
      branches: ["madinat"],
      promotion: "Natural conditioner 20% off",
      couponCode: "NATURALCOND20"
    },
    {
      id: 'aroma-diffuser-oil',
      name: "Aroma Diffuser Oil",
      price: "$28",
      description: "Essential oil for diffusers during treatments",
      category: "Aromatherapy",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Relaxation",
      branches: ["madinat"],
      promotion: "Aroma oil buy 3 get 1 free",
      couponCode: "AROMA3GET1"
    },
    {
      id: 'holistic-hair-tonic',
      name: "Holistic Hair Tonic",
      price: "$50",
      description: "Holistic approach to hair health and growth",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Holistic",
      branches: ["madinat"],
      promotion: "Holistic tonic with free consultation",
      couponCode: "HOLISTICTONIC"
    },
    {
      id: 'wellness-grooming-kit',
      name: "Wellness Grooming Kit",
      price: "$85",
      description: "Complete grooming kit focused on wellness",
      category: "Grooming Kit",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "Wellness",
      branches: ["madinat"],
      promotion: "Wellness kit 25% off",
      couponCode: "WELLNESS25"
    },

    // Khalifa Branch Products (10+ products)
    {
      id: 'luxury-face-mask',
      name: "Luxury Face Mask",
      price: "$55",
      description: "Premium facial mask with gold particles for rejuvenation",
      category: "Skin Care",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Luxury",
      branches: ["khalifa"],
      promotion: "Luxury mask with free gold applicator",
      couponCode: "LUXMASK"
    },
    {
      id: 'executive-grooming-set',
      name: "Executive Grooming Set",
      price: "$89",
      description: "Complete grooming set for the modern executive",
      category: "Grooming Kit",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Executive",
      branches: ["khalifa"],
      promotion: "Executive set with free leather case",
      couponCode: "EXECSET"
    },
    {
      id: 'platinum-shaving-set',
      name: "Platinum Shaving Set",
      price: "$120",
      description: "Complete platinum shaving experience",
      category: "Shaving",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      badge: "Platinum",
      branches: ["khalifa"],
      promotion: "Platinum set 20% off",
      couponCode: "PLATINUM20"
    },
    {
      id: 'diamond-dust-scrub',
      name: "Diamond Dust Scrub",
      price: "$85",
      description: "Luxury exfoliating scrub with real diamond dust",
      category: "Skin Care",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Diamond",
      branches: ["khalifa"],
      promotion: "Diamond scrub with free massage oil",
      couponCode: "DIAMONDSCRUB"
    },
    {
      id: 'executive-cologne',
      name: "Executive Cologne",
      price: "$110",
      description: "Signature cologne for business executives",
      category: "Fragrance",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Executive",
      branches: ["khalifa"],
      promotion: "Executive cologne 25% off",
      couponCode: "EXECCOLOGNE25"
    },
    {
      id: 'luxury-hair-treatment',
      name: "Luxury Hair Treatment",
      price: "$95",
      description: "Premium hair treatment with rare ingredients",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      badge: "Luxury Treatment",
      branches: ["khalifa"],
      promotion: "Luxury treatment with free scalp massage",
      couponCode: "LUXTREATMENT"
    },
    {
      id: 'gold-leaf-serum',
      name: "Gold Leaf Serum",
      price: "$150",
      description: "Anti-aging serum with edible gold leaf",
      category: "Skin Care",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Gold Leaf",
      branches: ["khalifa"],
      promotion: "Gold serum with free gold applicator",
      couponCode: "GOLDLEAF"
    },
    {
      id: 'executive-beard-kit',
      name: "Executive Beard Kit",
      price: "$95",
      description: "Complete beard care for business professionals",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Executive",
      branches: ["khalifa"],
      promotion: "Executive beard kit 30% off",
      couponCode: "EXECBEARD30"
    },
    {
      id: 'luxury-scent-collection',
      name: "Luxury Scent Collection",
      price: "$200",
      description: "Collection of luxury fragrances for different occasions",
      category: "Fragrance",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Collection",
      branches: ["khalifa"],
      promotion: "Luxury collection with free scent consultation",
      couponCode: "LUXCOLLECTION"
    },
    {
      id: 'diamond-grooming-experience',
      name: "Diamond Grooming Experience",
      price: "$250",
      description: "Ultimate grooming experience with diamond products",
      category: "Luxury Experience",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "Diamond Experience",
      branches: ["khalifa"],
      promotion: "Diamond experience with private butler service",
      couponCode: "DIAMONDEXP"
    },

    // Marina Mall Branch Products (10+ products)
    {
      id: 'travel-grooming-kit',
      name: "Travel Grooming Kit",
      price: "$38",
      description: "Compact grooming essentials for travel and on-the-go",
      category: "Travel",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      badge: "Travel Size",
      branches: ["marina-mall"],
      promotion: "Travel kit with free travel bag",
      couponCode: "TRAVELKIT"
    },
    {
      id: 'quick-styling-spray',
      name: "Quick Styling Spray",
      price: "$25",
      description: "Instant styling spray for busy mornings",
      category: "Styling",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Quick Fix",
      branches: ["marina-mall"],
      promotion: "Quick spray buy 2 get 1 free",
      couponCode: "QUICKSPRAY3GET1"
    },
    {
      id: 'mall-shopping-grooming',
      name: "Mall Shopping Grooming",
      price: "$20",
      description: "Quick grooming service while shopping",
      category: "Quick Service",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Mall Special",
      branches: ["marina-mall"],
      promotion: "Mall grooming 50% off during shopping hours",
      couponCode: "MALL50"
    },
    {
      id: 'express-beard-trim',
      name: "Express Beard Trim",
      price: "$15",
      description: "Quick beard trimming service",
      category: "Quick Service",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Express",
      branches: ["marina-mall"],
      promotion: "Express trim with free touch-up",
      couponCode: "EXPRESSBEARD"
    },
    {
      id: 'shopping-companion-kit',
      name: "Shopping Companion Kit",
      price: "$45",
      description: "Grooming kit perfect for long shopping trips",
      category: "Travel",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      badge: "Shopping Companion",
      branches: ["marina-mall"],
      promotion: "Shopping kit with free mall map",
      couponCode: "SHOPPINGKIT"
    },
    {
      id: 'quick-hair-refresh',
      name: "Quick Hair Refresh",
      price: "$18",
      description: "Fast hair refreshening service",
      category: "Quick Service",
      image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Refresh",
      branches: ["marina-mall"],
      promotion: "Hair refresh with free water bottle",
      couponCode: "REFRESHWATER"
    },
    {
      id: 'mall-vip-treatment',
      name: "Mall VIP Treatment",
      price: "$60",
      description: "VIP treatment experience at the mall",
      category: "VIP Service",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Mall VIP",
      branches: ["marina-mall"],
      promotion: "VIP treatment with free mall parking",
      couponCode: "MALLVIPPARKING"
    },
    {
      id: 'express-styling-kit',
      name: "Express Styling Kit",
      price: "$35",
      description: "Complete styling kit for quick touch-ups",
      category: "Styling",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Express Kit",
      branches: ["marina-mall"],
      promotion: "Express kit 25% off",
      couponCode: "EXPRESSKIT25"
    },
    {
      id: 'shopping-day-package',
      name: "Shopping Day Package",
      price: "$75",
      description: "Complete grooming package for shopping days",
      category: "Package",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "Shopping Package",
      branches: ["marina-mall"],
      promotion: "Shopping package with free meal voucher",
      couponCode: "SHOPPINGMEAL"
    },
    {
      id: 'mall-exclusive-perfume',
      name: "Mall Exclusive Perfume",
      price: "$55",
      description: "Exclusive fragrance available only at mall location",
      category: "Fragrance",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Mall Exclusive",
      branches: ["marina-mall"],
      promotion: "Exclusive perfume with free scent test",
      couponCode: "MALLEXCLUSIVE"
    },

    // WTC Branch Products (10+ products)
    {
      id: 'businessman-special',
      name: "Businessman Special Kit",
      price: "$72",
      description: "Professional grooming kit designed for business professionals",
      category: "Professional",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      badge: "Business Professional",
      branches: ["wtc"],
      promotion: "Business kit with free business card holder",
      couponCode: "BUSINESSCARD"
    },
    {
      id: 'premium-scalp-serum',
      name: "Premium Scalp Serum",
      price: "$58",
      description: "Advanced scalp treatment serum for hair health",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      badge: "Medical Grade",
      branches: ["wtc"],
      promotion: "Scalp serum with free dermatologist consultation",
      couponCode: "SCALPCONSULT"
    },
    {
      id: 'corporate-hair-gel',
      name: "Corporate Hair Gel",
      price: "$28",
      description: "Professional hair gel for corporate environments",
      category: "Styling",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Corporate",
      branches: ["wtc"],
      promotion: "Corporate gel buy 3 get 1 free",
      couponCode: "CORPORATEGEL3GET1"
    },
    {
      id: 'executive-shaving-kit',
      name: "Executive Shaving Kit",
      price: "$65",
      description: "Complete shaving kit for business executives",
      category: "Shaving",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      badge: "Executive",
      branches: ["wtc"],
      promotion: "Executive kit with free razor",
      couponCode: "EXECSHAVE"
    },
    {
      id: 'business-fragrance',
      name: "Business Fragrance",
      price: "$45",
      description: "Professional fragrance for business settings",
      category: "Fragrance",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Business",
      branches: ["wtc"],
      promotion: "Business fragrance 20% off",
      couponCode: "BUSINESSFRAG20"
    },
    {
      id: 'corporate-beard-care',
      name: "Corporate Beard Care",
      price: "$40",
      description: "Professional beard care for corporate professionals",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Corporate",
      branches: ["wtc"],
      promotion: "Corporate beard care with free trim",
      couponCode: "CORPBEARDTRIM"
    },
    {
      id: 'meeting-ready-spray',
      name: "Meeting Ready Spray",
      price: "$25",
      description: "Quick styling spray for important meetings",
      category: "Styling",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Meeting Ready",
      branches: ["wtc"],
      promotion: "Meeting spray buy 2 get 1 free",
      couponCode: "MEETING2GET1"
    },
    {
      id: 'executive-grooming-bag',
      name: "Executive Grooming Bag",
      price: "$85",
      description: "Luxury grooming bag for business travel",
      category: "Travel",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      badge: "Executive Travel",
      branches: ["wtc"],
      promotion: "Executive bag with free packing service",
      couponCode: "EXECBAGPACK"
    },
    {
      id: 'boardroom-special',
      name: "Boardroom Special",
      price: "$55",
      description: "Special grooming treatment for boardroom presence",
      category: "Special Treatment",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Boardroom",
      branches: ["wtc"],
      promotion: "Boardroom special with free confidence coaching",
      couponCode: "BOARDROOMCOACH"
    },
    {
      id: 'corporate-wellness-kit',
      name: "Corporate Wellness Kit",
      price: "$95",
      description: "Complete wellness kit for corporate professionals",
      category: "Wellness",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "Corporate Wellness",
      branches: ["wtc"],
      promotion: "Wellness kit with free stress management session",
      couponCode: "WELLNESSSTRESS"
    },

    // Salam Street Branch Products (10+ products)
    {
      id: 'traditional-beard-oil',
      name: "Traditional Beard Oil",
      price: "$39",
      description: "Classic beard oil with traditional herbal ingredients",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Traditional",
      branches: ["salam-street"],
      promotion: "Traditional oil with free herbal recipe",
      couponCode: "TRADOILRECIPE"
    },
    {
      id: 'herbal-hair-tonic',
      name: "Herbal Hair Tonic",
      price: "$44",
      description: "Natural herbal tonic for hair growth and scalp health",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Natural",
      branches: ["salam-street"],
      promotion: "Herbal tonic with free scalp massage",
      couponCode: "HERBALMASSAGE"
    },
    {
      name: "Traditional Shaving Cream",
      price: "$32",
      description: "Classic shaving cream with natural ingredients",
      category: "Shaving",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      badge: "Traditional",
      branches: ["salam-street"],
      promotion: "Traditional cream 20% off",
      couponCode: "TRADCREAM20"
    },
    {
      name: "Natural Beard Balm",
      price: "$35",
      description: "All-natural beard balm with herbal extracts",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Natural",
      branches: ["salam-street"],
      promotion: "Natural balm with free beard comb",
      couponCode: "NATURALBALMCOMB"
    },
    {
      name: "Herbal Scalp Oil",
      price: "$38",
      description: "Natural oil blend for scalp health",
      category: "Hair Care",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      badge: "Herbal",
      branches: ["salam-street"],
      promotion: "Herbal oil buy 2 get 1 free",
      couponCode: "HERBALOIL3GET1"
    },
    {
      name: "Traditional Hair Pomade",
      price: "$28",
      description: "Classic hair pomade with natural waxes",
      category: "Styling",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Traditional",
      branches: ["salam-street"],
      promotion: "Traditional pomade 15% off",
      couponCode: "TRADPOMADE15"
    },
    {
      name: "Natural Face Soap",
      price: "$25",
      description: "Gentle natural soap for face and beard",
      category: "Skin Care",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Natural",
      branches: ["salam-street"],
      promotion: "Natural soap with free soap dish",
      couponCode: "NATURALSOAPDISH"
    },
    {
      name: "Herbal Beard Wash",
      price: "$30",
      description: "Gentle beard wash with herbal ingredients",
      category: "Beard Care",
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Herbal",
      branches: ["salam-street"],
      promotion: "Herbal wash 25% off",
      couponCode: "HERBALWASH25"
    },
    {
      name: "Traditional Grooming Kit",
      price: "$65",
      description: "Complete traditional grooming kit",
      category: "Grooming Kit",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      badge: "Traditional Kit",
      branches: ["salam-street"],
      promotion: "Traditional kit with free grooming lesson",
      couponCode: "TRADKITLESSON"
    },
    {
      name: "Natural Cologne",
      price: "$42",
      description: "Natural fragrance with essential oils",
      category: "Fragrance",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      badge: "Natural",
      branches: ["salam-street"],
      promotion: "Natural cologne with free scent blending",
      couponCode: "NATURALCOLOGNE"
    }
  ];

  // Filter services and products based on selected branch
  const filteredServices = selectedBranch
    ? allServices.filter(service => service.branches.includes(selectedBranch.id))
    : allServices;

  const filteredProducts = selectedBranch
    ? allProducts.filter(product => product.branches.includes(selectedBranch.id))
    : allProducts;

  // Get team members based on selected branch
  const teamMembers = getTeamMembersByBranch(selectedBranch?.id);

  return (
    <PromotionProvider>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Luxury barber shop interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Content */}
          <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="mb-6">
            <Badge className="bg-secondary/90 text-primary font-semibold px-4 py-2 mb-4 backdrop-blur-sm">
              ✨ Premium Grooming Experience
            </Badge>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
              Man of
              <span className="block text-secondary">Cave</span>
            </h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          </div>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Experience luxury grooming at our 8 locations across the city.
            Where tradition meets innovation in the art of gentlemen's grooming.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-10 py-4 text-lg shadow-2xl hover:shadow-secondary/25 transition-all duration-300 transform hover:scale-105" onClick={() => openSidebar()}>
              <Scissors className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 text-lg backdrop-blur-sm bg-white/10 shadow-2xl transition-all duration-300" asChild>
              <Link href="/branches">
                <MapPin className="w-5 h-5 mr-2" />
                Find Location
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">8+</div>
              <div className="text-sm md:text-base opacity-90">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">5000+</div>
              <div className="text-sm md:text-base opacity-90">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">4.9★</div>
              <div className="text-sm md:text-base opacity-90">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              ✨ Featured Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              Premium Grooming Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience world-class grooming services tailored to perfection, delivered by our expert stylists
            </p>
          </div>
          <div className="relative">
            <Carousel className="max-w-7xl mx-auto" autoPlay={true} autoPlayInterval={8000} showDots={false}>
              {filteredServices.length > 0 ? (
                filteredServices.reduce((slides: any[], service, index) => {
                  if (index % 4 === 0) {
                    slides.push([service]);
                  } else {
                    slides[slides.length - 1].push(service);
                  }
                  return slides;
                }, []).map((slideServices: any[], slideIndex: number) => (
                  <div key={slideIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {slideServices.map((service: any, index: number) => (
                      <Card key={service.name} className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg animate-slide-up overflow-hidden bg-white hover:-translate-y-2 min-h-[400px] flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="relative overflow-hidden">
                          <img
                            src={service.image}
                            alt={`${service.name} service`}
                            className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white/90 text-primary font-semibold shadow-lg text-xs">
                              {service.duration}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-secondary text-lg font-bold group-hover:text-primary transition-colors duration-300">
                            {service.name}
                          </CardTitle>
                          <CardDescription className="text-accent font-semibold text-base">
                            {formatPrice(service.price)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 flex-grow">
                          <p className="text-muted-foreground mb-3 leading-relaxed text-sm">{service.description}</p>
                          <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 text-sm py-2" onClick={() => openSidebar(service.name.toLowerCase().replace(/\s+/g, '-'))}>
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No services available for the selected branch.</p>
                  <p className="text-gray-400 text-sm mt-2">Try selecting "All Branches" or a different location.</p>
                </div>
              )}
            </Carousel>
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary px-8 py-3 text-lg font-semibold">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              🛍️ Premium Products
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              Professional Beauty Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our curated selection of professional-grade grooming products for the ultimate at-home experience
            </p>
          </div>
          <div className="relative">
            <Carousel className="max-w-7xl mx-auto" autoPlay={true} autoPlayInterval={10000} showDots={false}>
              {filteredProducts.length > 0 ? (
                filteredProducts.reduce((slides: any[], product, index) => {
                  if (index % 4 === 0) {
                    slides.push([product]);
                  } else {
                    slides[slides.length - 1].push(product);
                  }
                  return slides;
                }, []).map((slideProducts: any[], slideIndex: number) => (
                  <div key={slideIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {slideProducts.map((product: any, index: number) => (
                      <Card key={product.name} className="text-center hover:shadow-2xl transition-all duration-500 animate-slide-up overflow-hidden bg-white hover:-translate-y-2 border-0 shadow-lg min-h-[400px] flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={`${product.name} product`}
                            className="w-full h-32 object-cover hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="bg-white/90 text-primary font-semibold shadow-lg text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-secondary text-primary font-semibold shadow-lg text-xs">
                              {product.badge}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-primary text-lg font-bold">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 leading-relaxed text-sm">
                            {product.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 flex-grow">
                          <div className="text-lg font-bold text-secondary mb-3">
                            {formatPrice(product.price)}
                          </div>
                          <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary hover:bg-primary hover:text-white transition-all duration-300 font-semibold text-sm py-2" onClick={() => handleAddToCart(product)}>
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products available for the selected branch.</p>
                  <p className="text-gray-400 text-sm mt-2">Try selecting "All Branches" or a different location.</p>
                </div>
              )}
            </Carousel>
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary px-8 py-3 text-lg font-semibold">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      

      {/* Promotions Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-secondary to-accent animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-white/20 text-white font-semibold px-4 py-2 mb-4 border border-white/30">
              🎉 Special Offers
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 animate-slide-up">
              Exclusive Promotions
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Limited-time offers to enhance your grooming experience and save on premium services
            </p>
          </div>
          <div className="relative">
            <Carousel className="max-w-7xl mx-auto" autoPlay={true} autoPlayInterval={10000} showDots={false}>
              {/* Slide 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    title: "First-Time Customer",
                    discount: "20% OFF",
                    description: "Get 20% off your first visit with our premium grooming services",
                    validUntil: "Valid until Dec 31, 2025",
                    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "New Customer",
                    terms: "Valid for first-time customers only. Cannot be combined with other offers. Valid ID required.",
                    couponCode: "WELCOME20",
                    applicableServices: ["Haircut & Styling", "Beard Trim & Shape", "Scalp Treatment", "Eyebrow Shaping"],
                    branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"]
                  },
                  {
                    title: "Student Discount",
                    discount: "15% OFF",
                    description: "Special pricing for students with valid ID - quality grooming at affordable prices",
                    validUntil: "Ongoing promotion",
                    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
                    badge: "Student Special",
                    terms: "Valid student ID required. Limited to full-time students. Cannot be combined with other offers.",
                    couponCode: "STUDENT15",
                    applicableServices: ["Haircut & Styling", "Beard Trim & Shape", "Quick Touch-Up", "Express Haircut"],
                    branches: ["alwahda", "madinat", "marina-mall", "salam-street"]
                  },
                  {
                    title: "Loyalty Program",
                    discount: "Free Service",
                    description: "Earn points for every visit, redeem for free services and exclusive perks",
                    validUntil: "Always available",
                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "VIP Program",
                    terms: "Earn 1 point per $10 spent. Redeem 100 points for free service. Membership required.",
                    couponCode: "LOYALTYVIP",
                    applicableServices: ["Haircut & Styling", "Beard Trim & Shape", "Scalp Treatment", "Neck & Shoulder Massage"],
                    branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"]
                  },
                  {
                    title: "Weekend Special",
                    discount: "25% OFF",
                    description: "Enjoy 25% off all services every Friday, Saturday, and Sunday",
                    validUntil: "Every weekend",
                    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "Weekend Deal",
                    terms: "Valid Friday to Sunday only. Cannot be combined with other offers. Excludes premium packages.",
                    couponCode: "WEEKEND25",
                    applicableServices: ["Haircut & Styling", "Beard Trim & Shape", "Eyebrow Shaping", "Neck & Shoulder Massage"],
                    branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"]
                  },
                ].map((promo, index) => (
                  <Card key={promo.title} className="text-center hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur animate-slide-up hover:-translate-y-2 border-0 shadow-xl overflow-hidden min-h-[400px] flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={promo.image}
                        alt={`${promo.title} promotion`}
                        className="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white font-semibold shadow-lg text-xs">
                          {promo.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-primary font-bold text-sm px-2 py-1 shadow-lg">
                          {promo.discount}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-primary text-lg font-bold">
                        {promo.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed text-sm">
                        {promo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 flex-grow">
                      <div className="text-xs text-gray-500 mb-3 font-medium">
                        {promo.validUntil}
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white hover:bg-secondary hover:text-primary transition-all duration-300 font-semibold text-sm py-2" onClick={() => handleClaimOffer(promo)}>
                        <Gift className="w-3 h-3 mr-1" />
                        Claim Offer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Slide 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    title: "Package Deal",
                    discount: "$50 OFF",
                    description: "Save $50 when you book any premium grooming package",
                    validUntil: "Limited time offer",
                    image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "Package Special",
                    terms: "Valid on packages over $150. Cannot be combined with other offers. Limited time only.",
                    couponCode: "PACKAGE50",
                    applicableServices: ["VIP Hair Treatment", "Premium Hair Coloring", "Luxury Facial Treatment", "Gold Hair Treatment"],
                    branches: ["khalifa", "wtc", "madinat"]
                  },
                  {
                    title: "Referral Bonus",
                    discount: "Free Haircut",
                    description: "Bring a friend and both get a free haircut on their next visit",
                    validUntil: "Ongoing program",
                    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                    badge: "Referral Program",
                    terms: "Both customers must be new. Valid for standard haircuts only. Cannot be combined with other offers.",
                    couponCode: "REFERFRIEND",
                    applicableServices: ["Haircut & Styling", "Express Haircut", "Business Class Haircut"],
                    branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"]
                  },
                  {
                    title: "Senior Discount",
                    discount: "30% OFF",
                    description: "Special 30% discount for seniors 65+ - quality care at great prices",
                    validUntil: "Ongoing promotion",
                    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                    badge: "Senior Special",
                    terms: "Valid for customers 65+. Valid ID required. Cannot be combined with other offers.",
                    couponCode: "SENIOR30",
                    applicableServices: ["Haircut & Styling", "Beard Trim & Shape", "Scalp Treatment", "Neck & Shoulder Massage"],
                    branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"]
                  },
                  {
                    title: "Military Appreciation",
                    discount: "20% OFF",
                    description: "Thank you for your service - 20% off for active and veteran military",
                    validUntil: "Always honored",
                    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "Military Discount",
                    terms: "Valid for active military and veterans. Valid ID required. Cannot be combined with other offers.",
                    couponCode: "MILITARY20",
                    applicableServices: ["Haircut & Styling", "Beard Trim & Shape", "Scalp Treatment", "Neck & Shoulder Massage"],
                    branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"]
                  },
                ].map((promo, index) => (
                  <Card key={promo.title} className="text-center hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur animate-slide-up hover:-translate-y-2 border-0 shadow-xl overflow-hidden min-h-[400px] flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={promo.image}
                        alt={`${promo.title} promotion`}
                        className="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white font-semibold shadow-lg text-xs">
                          {promo.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-primary font-bold text-sm px-2 py-1 shadow-lg">
                          {promo.discount}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-primary text-lg font-bold">
                        {promo.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed text-sm">
                        {promo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 flex-grow">
                      <div className="text-xs text-gray-500 mb-3 font-medium">
                        {promo.validUntil}
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white hover:bg-secondary hover:text-primary transition-all duration-300 font-semibold text-sm py-2" onClick={() => handleClaimOffer(promo)}>
                        <Gift className="w-3 h-3 mr-1" />
                        Claim Offer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Slide 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    title: "Birthday Special",
                    discount: "Free Service",
                    description: "Celebrate your birthday with a complimentary grooming service",
                    validUntil: "Birthday month only",
                    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "Birthday Gift",
                    terms: "Valid during birthday month only. Valid ID required. One complimentary service per customer per year.",
                    couponCode: "BIRTHDAYFREE",
                    applicableServices: ["Haircut & Styling", "Beard Trim & Shape", "Scalp Treatment", "Neck & Shoulder Massage"],
                    branches: ["alwahda", "madinat", "khalifa", "marina-mall", "wtc", "salam-street"]
                  },
                ].map((promo, index) => (
                  <Card key={promo.title} className="text-center hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur animate-slide-up hover:-translate-y-2 border-0 shadow-xl overflow-hidden min-h-[400px] flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={promo.image}
                        alt={`${promo.title} promotion`}
                        className="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white font-semibold shadow-lg text-xs">
                          {promo.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-primary font-bold text-sm px-2 py-1 shadow-lg">
                          {promo.discount}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-primary text-lg font-bold">
                        {promo.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed text-sm">
                        {promo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 flex-grow">
                      <div className="text-xs text-gray-500 mb-3 font-medium">
                        {promo.validUntil}
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white hover:bg-secondary hover:text-primary transition-all duration-300 font-semibold text-sm py-2" onClick={() => handleClaimOffer(promo)}>
                        <Gift className="w-3 h-3 mr-1" />
                        Claim Offer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Promo Codes Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              🎫 Promo Codes
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              Exclusive Discount Codes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Use these special codes at checkout for additional savings on our premium grooming services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                code: "WELCOME20",
                discount: "20% Off First Visit",
                description: "New customers only - perfect for your first experience",
                expiry: "Dec 31, 2025",
                color: "from-blue-500 to-blue-600"
              },
              {
                code: "STUDENT15",
                discount: "15% Off Services",
                description: "Valid student ID required - grooming on a budget",
                expiry: "Ongoing",
                color: "from-green-500 to-green-600"
              },
              {
                code: "LOYALTY10",
                discount: "10% Off Any Service",
                description: "For loyalty program members - rewards for regulars",
                expiry: "Ongoing",
                color: "from-purple-500 to-purple-600"
              },
              {
                code: "FLASH50",
                discount: "$50 Off Packages",
                description: "Premium packages only - luxury at a great price",
                expiry: "Dec 15, 2025",
                color: "from-red-500 to-red-600"
              },
            ].map((promo, index) => (
              <Card key={promo.code} className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg animate-slide-up hover:-translate-y-2 bg-white overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`bg-gradient-to-r ${promo.color} p-6 text-white`}>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
                    <code className="text-2xl font-mono font-bold text-white bg-black/30 px-4 py-2 rounded border border-white/30 shadow-lg">
                      {promo.code}
                    </code>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{promo.discount}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{promo.description}</p>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4 font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    Expires: {promo.expiry}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-semibold"
                    onClick={() => navigator.clipboard.writeText(promo.code)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              * Terms and conditions apply. Cannot be combined with other offers.
            </p>
          </div>
        </div>
      </section>

      
      {/* Our Team Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              👥 Meet Our Experts
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Our Professional Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meet our skilled professionals dedicated to providing exceptional grooming experiences
              {selectedBranch ? ` at our ${selectedBranch.name} location` : ' across all locations'}
            </p>
          </div>

          {/* Branch Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 bg-white rounded-full p-2 shadow-lg border">
              <Button
                variant={!selectedBranch ? "default" : "ghost"}
                size="sm"
                className="rounded-full px-6"
                onClick={() => window.location.href = '/branches'}
              >
                <Settings className="w-4 h-4 mr-2" />
                All Branches ({getTeamMembersByBranch().length})
              </Button>
              {selectedBranch && (
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full px-6"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {selectedBranch.name} ({teamMembers.length})
                </Button>
              )}
            </div>
          </div>

          {/* Team Members Carousel */}
          {teamMembers.length > 0 ? (
            <Carousel className="max-w-7xl mx-auto" autoPlay={true} autoPlayInterval={6000} showDots={false}>
              {/* Group team members into slides of 4 */}
              {Array.from({ length: Math.ceil(teamMembers.length / 4) }, (_, slideIndex) => (
                <div key={slideIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                  {teamMembers.slice(slideIndex * 4, (slideIndex + 1) * 4).map((teamMember) => (
                    <Card key={teamMember.id} className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white hover:-translate-y-2 overflow-hidden group">
                      <div className="relative overflow-hidden">
                        <img
                          src={teamMember.image}
                          alt={teamMember.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-secondary text-primary font-semibold">
                              {teamMember.rating}★
                            </Badge>
                            <Badge className="bg-primary/90 text-white">
                              {teamMember.experience}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-serif font-bold text-primary mb-2">
                          {teamMember.name}
                        </h3>
                        <p className="text-secondary font-semibold text-sm mb-3">
                          {teamMember.specialty}
                        </p>
                        <div className="flex items-center justify-center gap-1">
                          {[...Array(Math.floor(teamMember.rating))].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                          ))}
                          {teamMember.rating % 1 !== 0 && (
                            <Star className="w-4 h-4 fill-secondary/50 text-secondary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No team members found for the selected branch.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.href = '/branches'}
              >
                View All Branches
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              ⭐ Client Reviews
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from our satisfied clients who trust us with their grooming needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John D.",
                rating: 5,
                text: "Best barber in town! Always perfect cuts and exceptional service. The attention to detail is unmatched.",
                role: "Regular Client",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              {
                name: "Mike R.",
                rating: 5,
                text: "Professional service and great atmosphere. The staff is knowledgeable and the products are top-notch.",
                role: "Business Professional",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              {
                name: "Alex T.",
                rating: 5,
                text: "Worth every penny. Highly recommend! The premium experience and quality service keep me coming back.",
                role: "Fashion Designer",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
            ].map((testimonial, index) => (
              <Card key={testimonial.name} className="hover:shadow-2xl transition-all duration-500 animate-slide-up bg-white hover:-translate-y-2 border-0 shadow-lg overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-primary text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 leading-relaxed text-base italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold" onClick={() => openSidebar()}>
              Join Our Happy Clients
            </Button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">Man of Cave</h3>
              <p className="text-gray-300">Luxury grooming for discerning gentlemen.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Haircuts</li>
                <li>Beard Grooming</li>
                <li>Premium Packages</li>
                <li>Consultations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Locations</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Downtown</li>
                <li>Midtown</li>
                <li>Uptown</li>
                <li>Suburbs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@manofcave.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>8 Locations Citywide</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Man of Cave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>

    {/* Promotion Sidebar */}
    <PromotionSidebarWrapper />
    
    {/* Toast Notification */}
    {toast && (
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
        <div className={`p-4 rounded-lg shadow-lg border max-w-sm ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {toast.type === 'success' && toast.message.includes('added to cart') && (
            <div className="mt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7"
                onClick={() => window.location.href = '/cart'}
              >
                View Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    )}
    
    </PromotionProvider>
  );
}
