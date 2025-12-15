'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Plus, Minus, CreditCard, Wallet, Gift, Receipt, Printer, Smartphone,
  DollarSign, Percent, Trash2, Search, User, Clock, CheckCircle,
  AlertCircle, Calculator, Split, Smartphone as MobileIcon
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useServicesStore } from "@/stores/services.store";
import { useCartStore } from "@/stores/cart.store";
import { useCurrencyStore } from "@/stores/currency.store";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";

interface POSItem {
  id: string;
  name: string;
  type: 'service' | 'product';
  price: number;
  quantity: number;
  staff?: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
}

interface PaymentSplit {
  method: 'cash' | 'card' | 'wallet' | 'gift_card';
  amount: number;
  cardLast4?: string;
  walletType?: string;
  giftCardCode?: string;
}

interface GiftCard {
  id: string;
  code: string;
  balance: number;
  issuedTo?: string;
  issuedDate: string;
  expiryDate?: string;
  isActive: boolean;
}

export default function POSPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const { services, packages } = useServicesStore();
  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
  const { formatCurrency } = useCurrencyStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // POS State
  const [posItems, setPosItems] = useState<POSItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [taxRate, setTaxRate] = useState<number>(8); // 8% default tax
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [tipType, setTipType] = useState<'percentage' | 'fixed'>('fixed');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'single' | 'split'>('single');
  const [singlePaymentMethod, setSinglePaymentMethod] = useState<'cash' | 'card' | 'wallet' | 'gift_card'>('cash');
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([]);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVV, setCardCVV] = useState<string>('');
  const [walletType, setWalletType] = useState<string>('');

  // Gift Card State
  const [giftCardCode, setGiftCardCode] = useState<string>('');
  const [giftCardBalance, setGiftCardBalance] = useState<number>(0);
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCard | null>(null);

  // Receipt State
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Dialog States
  const [showCustomerSearch, setShowCustomerSearch] = useState<boolean>(false);
  const [showGiftCardDialog, setShowGiftCardDialog] = useState<boolean>(false);
  const [showSplitPaymentDialog, setShowSplitPaymentDialog] = useState<boolean>(false);

  // Mock data
  const customers = [
    { id: '1', name: 'John Doe', phone: '(555) 123-4567', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', phone: '(555) 234-5678', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', phone: '(555) 345-6789', email: 'bob@example.com' },
  ];

  const staff = [
    { id: '1', name: 'Mike Johnson', role: 'Barber' },
    { id: '2', name: 'Emma Davis', role: 'Stylist' },
    { id: '3', name: 'Alex Chen', role: 'Assistant' },
  ];

  const giftCards: GiftCard[] = [
    { id: '1', code: 'GIFT001', balance: 50, issuedTo: 'John Doe', issuedDate: '2025-01-15', isActive: true },
    { id: '2', code: 'GIFT002', balance: 100, issuedTo: 'Jane Smith', issuedDate: '2025-02-20', isActive: true },
    { id: '3', code: 'GIFT003', balance: 25, issuedTo: 'Bob Johnson', issuedDate: '2025-03-10', isActive: true },
  ];

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add service to POS
  const addServiceToPOS = (service: any, staffMember?: string) => {
    const existingItem = posItems.find(item =>
      item.id === service.id && item.type === 'service' && item.staff === staffMember
    );

    if (existingItem) {
      setPosItems(prev => prev.map(item =>
        item.id === service.id && item.type === 'service' && item.staff === staffMember
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setPosItems(prev => [...prev, {
        id: service.id,
        name: service.name,
        type: 'service',
        price: service.price || 0,
        quantity: 1,
        staff: staffMember,
      }]);
    }
  };

  // Add product to POS
  const addProductToPOS = (product: any) => {
    const existingItem = posItems.find(item =>
      item.id === product.id && item.type === 'product'
    );

    if (existingItem) {
      setPosItems(prev => prev.map(item =>
        item.id === product.id && item.type === 'product'
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setPosItems(prev => [...prev, {
        id: product.id,
        name: product.name,
        type: 'product',
        price: product.price || 0,
        quantity: 1,
      }]);
    }
  };

  // Update item quantity
  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setPosItems(prev => prev.filter(item => item.id !== id));
    } else {
      setPosItems(prev => prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  // Apply discount to item
  const applyItemDiscount = (id: string, discount: number, type: 'percentage' | 'fixed') => {
    setPosItems(prev => prev.map(item =>
      item.id === id ? { ...item, discount, discountType: type } : item
    ));
  };

  // Calculate item total with discount
  const calculateItemTotal = (item: POSItem) => {
    const baseTotal = item.price * item.quantity;
    if (item.discount && item.discountType) {
      if (item.discountType === 'percentage') {
        return baseTotal * (1 - item.discount / 100);
      } else {
        return Math.max(0, baseTotal - item.discount);
      }
    }
    return baseTotal;
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return posItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  // Calculate discount amount
  const calculateDiscountAmount = () => {
    if (discountType === 'percentage') {
      return calculateSubtotal() * (discountAmount / 100);
    }
    return discountAmount;
  };

  // Calculate tip amount
  const calculateTipAmount = () => {
    if (tipType === 'percentage') {
      return (calculateSubtotal() - calculateDiscountAmount()) * (tipAmount / 100);
    }
    return tipAmount;
  };

  // Calculate tax amount
  const calculateTaxAmount = () => {
    return (calculateSubtotal() - calculateDiscountAmount() + calculateTipAmount()) * (taxRate / 100);
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscountAmount() + calculateTipAmount() + calculateTaxAmount();
  };

  // Check gift card balance
  const checkGiftCard = () => {
    const card = giftCards.find(gc => gc.code === giftCardCode && gc.isActive);
    if (card) {
      setGiftCardBalance(card.balance);
      setAppliedGiftCard(card);
    } else {
      setGiftCardBalance(0);
      setAppliedGiftCard(null);
      alert('Invalid or inactive gift card');
    }
  };

  // Apply gift card payment
  const applyGiftCardPayment = (amount: number) => {
    if (!appliedGiftCard || amount > giftCardBalance) {
      alert('Insufficient gift card balance');
      return;
    }

    const split: PaymentSplit = {
      method: 'gift_card',
      amount,
      giftCardCode: appliedGiftCard.code,
    };

    setPaymentSplits(prev => [...prev, split]);
  };

  // Add payment split
  const addPaymentSplit = (method: 'cash' | 'card' | 'wallet', amount: number, details?: any) => {
    const split: PaymentSplit = {
      method,
      amount,
      ...details,
    };

    setPaymentSplits(prev => [...prev, split]);
  };

  // Calculate remaining amount to pay
  const calculateRemainingAmount = () => {
    const totalPaid = paymentSplits.reduce((sum, split) => sum + split.amount, 0);
    return Math.max(0, calculateTotal() - totalPaid);
  };

  // Process payment
  const processPayment = () => {
    const total = calculateTotal();
    let totalPaid = 0;

    if (paymentMethod === 'single') {
      if (singlePaymentMethod === 'cash') {
        totalPaid = total;
      } else if (singlePaymentMethod === 'card') {
        // Mock card processing
        totalPaid = total;
      } else if (singlePaymentMethod === 'wallet') {
        // Mock wallet processing
        totalPaid = total;
      } else if (singlePaymentMethod === 'gift_card') {
        if (appliedGiftCard && total <= giftCardBalance) {
          totalPaid = total;
        } else {
          alert('Insufficient gift card balance');
          return;
        }
      }
    } else {
      totalPaid = paymentSplits.reduce((sum, split) => sum + split.amount, 0);
      if (totalPaid < total) {
        alert('Payment amount is less than total');
        return;
      }
    }

    // Generate receipt
    const receipt = {
      id: `RECEIPT-${Date.now()}`,
      date: new Date().toISOString(),
      customer: selectedCustomer,
      staff: selectedStaff,
      items: posItems,
      subtotal: calculateSubtotal(),
      discount: calculateDiscountAmount(),
      tip: calculateTipAmount(),
      tax: calculateTaxAmount(),
      total: total,
      payments: paymentMethod === 'single'
        ? [{ method: singlePaymentMethod, amount: total }]
        : paymentSplits,
      isOffline,
    };

    setReceiptData(receipt);
    setShowReceipt(true);

    // Clear POS
    setPosItems([]);
    setSelectedCustomer('');
    setSelectedStaff('');
    setDiscountAmount(0);
    setTipAmount(0);
    setPaymentSplits([]);
    setAppliedGiftCard(null);
    setGiftCardCode('');
    setGiftCardBalance(0);
  };

  // Print receipt
  const printReceipt = () => {
    window.print();
  };

  // Mock products for POS
  const products = [
    { id: 'prod1', name: 'Hair Gel', price: 15, category: 'Styling' },
    { id: 'prod2', name: 'Shampoo', price: 25, category: 'Care' },
    { id: 'prod3', name: 'Beard Oil', price: 20, category: 'Grooming' },
    { id: 'prod4', name: 'Hair Clippers', price: 45, category: 'Tools' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <AdminSidebar role="branch_admin" onLogout={handleLogout} />
          <div className="flex-1 lg:ml-0">
            <div className="sticky top-0 z-40 bg-white border-b">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-primary">Point of Sale</h1>
                  {isOffline && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Offline Mode
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CurrencySwitcher />
                  <Button variant="outline" onClick={() => router.back()}>
                    Back
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Items Selection */}
                <div className="lg:col-span-2 space-y-6">
                  <Tabs defaultValue="services" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="products">Products</TabsTrigger>
                    </TabsList>

                    <TabsContent value="services" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                          <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">{service.name}</h3>
                                <span className="text-lg font-bold text-primary">
                                  {formatCurrency(service.price || 0)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                              <div className="flex gap-2">
                                <Select onValueChange={(staffId) => {
                                  const staffMember = staff.find(s => s.id === staffId);
                                  addServiceToPOS(service, staffMember?.name);
                                }}>
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select staff" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {staff.map((member) => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  onClick={() => addServiceToPOS(service)}
                                  className="px-3"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="products" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((product) => (
                          <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">{product.name}</h3>
                                <span className="text-lg font-bold text-primary">
                                  {formatCurrency(product.price)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                              <Button
                                className="w-full"
                                onClick={() => addProductToPOS(product)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Panel - Cart & Checkout */}
                <div className="space-y-6">
                  {/* Customer & Staff Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer & Staff
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Customer</Label>
                        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.name}>
                                {customer.name} - {customer.phone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Staff Member</Label>
                        <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff" />
                          </SelectTrigger>
                          <SelectContent>
                            {staff.map((member) => (
                              <SelectItem key={member.id} value={member.name}>
                                {member.name} - {member.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cart Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        {posItems.length === 0 ? (
                          <p className="text-center text-gray-500 py-8">No items added</p>
                        ) : (
                          <div className="space-y-3">
                            {posItems.map((item) => (
                              <div key={`${item.id}-${item.staff || 'no-staff'}`} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  {item.staff && (
                                    <p className="text-sm text-gray-600">Staff: {item.staff}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-sm font-medium">{item.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatCurrency(calculateItemTotal(item))}</p>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setPosItems(prev => prev.filter(i => i.id !== item.id))}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateSubtotal())}</span>
                      </div>

                      {/* Discount */}
                      <div className="space-y-2">
                        <Label>Discount</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(Number(e.target.value))}
                          />
                          <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">%</SelectItem>
                              <SelectItem value="fixed">$</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {calculateDiscountAmount() > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-{formatCurrency(calculateDiscountAmount())}</span>
                          </div>
                        )}
                      </div>

                      {/* Tip */}
                      <div className="space-y-2">
                        <Label>Tip</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={tipAmount}
                            onChange={(e) => setTipAmount(Number(e.target.value))}
                          />
                          <Select value={tipType} onValueChange={(value: 'percentage' | 'fixed') => setTipType(value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">%</SelectItem>
                              <SelectItem value="fixed">$</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {calculateTipAmount() > 0 && (
                          <div className="flex justify-between">
                            <span>Tip:</span>
                            <span>{formatCurrency(calculateTipAmount())}</span>
                          </div>
                        )}
                      </div>

                      {/* Tax */}
                      <div className="flex justify-between">
                        <span>Tax ({taxRate}%):</span>
                        <span>{formatCurrency(calculateTaxAmount())}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RadioGroup value={paymentMethod} onValueChange={(value: 'single' | 'split') => setPaymentMethod(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">Single Payment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="split" id="split" />
                          <Label htmlFor="split">Split Payment</Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === 'single' ? (
                        <div className="space-y-4">
                          <Select value={singlePaymentMethod} onValueChange={(value: 'cash' | 'card' | 'wallet' | 'gift_card') => setSinglePaymentMethod(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="wallet">Digital Wallet</SelectItem>
                              <SelectItem value="gift_card">Gift Card</SelectItem>
                            </SelectContent>
                          </Select>

                          {singlePaymentMethod === 'card' && (
                            <div className="space-y-3">
                              <Input placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                              <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                                <Input placeholder="CVV" value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} />
                              </div>
                            </div>
                          )}

                          {singlePaymentMethod === 'wallet' && (
                            <Select value={walletType} onValueChange={setWalletType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select wallet" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="apple_pay">Apple Pay</SelectItem>
                                <SelectItem value="google_pay">Google Pay</SelectItem>
                                <SelectItem value="samsung_pay">Samsung Pay</SelectItem>
                              </SelectContent>
                            </Select>
                          )}

                          {singlePaymentMethod === 'gift_card' && (
                            <div className="space-y-2">
                              <Input
                                placeholder="Gift Card Code"
                                value={giftCardCode}
                                onChange={(e) => setGiftCardCode(e.target.value)}
                              />
                              <Button onClick={checkGiftCard} variant="outline" size="sm">
                                Check Balance
                              </Button>
                              {appliedGiftCard && (
                                <p className="text-sm text-green-600">
                                  Balance: {formatCurrency(giftCardBalance)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Split Payments</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowSplitPaymentDialog(true)}
                            >
                              <Split className="w-4 h-4 mr-2" />
                              Add Payment
                            </Button>
                          </div>

                          {paymentSplits.map((split, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border rounded">
                              <div>
                                <span className="font-medium capitalize">{split.method.replace('_', ' ')}</span>
                                {split.cardLast4 && <span className="text-sm text-gray-600"> (****{split.cardLast4})</span>}
                                {split.walletType && <span className="text-sm text-gray-600"> ({split.walletType})</span>}
                                {split.giftCardCode && <span className="text-sm text-gray-600"> ({split.giftCardCode})</span>}
                              </div>
                              <span>{formatCurrency(split.amount)}</span>
                            </div>
                          ))}

                          <div className="flex justify-between font-medium">
                            <span>Remaining:</span>
                            <span>{formatCurrency(calculateRemainingAmount())}</span>
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={processPayment}
                        disabled={posItems.length === 0 || calculateTotal() === 0}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Complete Payment
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Split Payment Dialog */}
        <Dialog open={showSplitPaymentDialog} onOpenChange={setShowSplitPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a payment method to split the total amount.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Payment Method</Label>
                <Select onValueChange={(value: 'cash' | 'card' | 'wallet' | 'gift_card') => {
                  // Handle payment method selection for split
                  if (value === 'cash') {
                    const amount = Math.min(calculateRemainingAmount(), calculateTotal());
                    addPaymentSplit('cash', amount);
                    setShowSplitPaymentDialog(false);
                  } else if (value === 'gift_card' && appliedGiftCard) {
                    const amount = Math.min(calculateRemainingAmount(), giftCardBalance);
                    applyGiftCardPayment(amount);
                    setShowSplitPaymentDialog(false);
                  }
                  // For card and wallet, you would implement the payment processing here
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                    {appliedGiftCard && <SelectItem value="gift_card">Gift Card</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Receipt</span>
                <Button variant="outline" size="sm" onClick={printReceipt}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </DialogTitle>
            </DialogHeader>
            {receiptData && (
              <div className="space-y-4" id="receipt">
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold">Man of Cave</h2>
                  <p className="text-sm text-gray-600">Professional Barber Shop</p>
                  <p className="text-sm">Receipt #{receiptData.id}</p>
                  <p className="text-sm">{new Date(receiptData.date).toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{receiptData.customer || 'Walk-in'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff:</span>
                    <span>{receiptData.staff || 'N/A'}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  {receiptData.items.map((item: POSItem, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(receiptData.subtotal)}</span>
                  </div>
                  {receiptData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(receiptData.discount)}</span>
                    </div>
                  )}
                  {receiptData.tip > 0 && (
                    <div className="flex justify-between">
                      <span>Tip:</span>
                      <span>{formatCurrency(receiptData.tip)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(receiptData.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(receiptData.total)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="font-medium">Payment Methods:</p>
                  {receiptData.payments.map((payment: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                      <span>{formatCurrency(payment.amount)}</span>
                    </div>
                  ))}
                </div>

                {receiptData.isOffline && (
                  <div className="text-center text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    Processed in Offline Mode
                  </div>
                )}

                <div className="text-center text-sm text-gray-600 pt-4 border-t">
                  Thank you for your business!
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}