'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scissors } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";

export function Header() {
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="w-8 h-8 text-primary" />
          <span className="text-2xl font-serif font-bold text-primary">Man of Cave</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
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
          <Link href="/cart">
            <Button variant="outline" className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13l1.1-5m8.9 5L17 18m2-5H9m0 0l-.4-2M9 18l.4-2" />
              </svg>
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-secondary text-primary text-xs min-w-[20px] h-5 flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}