'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';

interface CartModalProps {
  children: React.ReactNode;
}

export function CartModal({ children }: CartModalProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const total = getTotal();

  const handleCheckout = () => {
    // Here you would integrate with a payment processor
    alert(`Checkout functionality would be implemented here. Total: $${total.toFixed(2)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Shopping Cart ({items.length} items)
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500">Add some products to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-primary">{item.name}</h4>
                  <p className="text-secondary font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-0 h-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-secondary">${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1"
              >
                Clear Cart
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-primary"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}