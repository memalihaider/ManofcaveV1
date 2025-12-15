'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Mock orders data - replace with real API calls
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-12-15',
      status: 'delivered',
      total: 85,
      items: [
        { name: 'Luxury Shampoo', price: 45, quantity: 1 },
        { name: 'Beard Oil', price: 35, quantity: 1 }
      ],
      shippingAddress: '123 Main St, Downtown, NY 10001',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      date: '2025-12-10',
      status: 'shipped',
      total: 28,
      items: [
        { name: 'Styling Wax', price: 28, quantity: 1 }
      ],
      shippingAddress: '456 Oak Ave, Midtown, NY 10002',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-003',
      date: '2025-12-05',
      status: 'processing',
      total: 65,
      items: [
        { name: 'Aftershave Balm', price: 40, quantity: 1 },
        { name: 'Deep Conditioning Treatment', price: 25, quantity: 1 }
      ],
      shippingAddress: '789 Pine St, Uptown, NY 10003',
      trackingNumber: null
    }
  ];

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push('/customer/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'customer') {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/customer/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-primary mb-2">My Orders</h1>
          <p className="text-gray-600">Track your product orders and purchase history</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <CardDescription>Placed on {order.date}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${order.total}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-primary mb-3">Items Ordered</h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                              <p className="font-medium text-primary">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-primary">${item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Shipping Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-primary mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Shipping Address
                      </h3>
                      <p className="text-gray-700 text-sm">{order.shippingAddress}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Order Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Order ID:</span> {order.id}</p>
                        <p><span className="font-medium">Order Date:</span> {order.date}</p>
                        {order.trackingNumber && (
                          <p><span className="font-medium">Tracking:</span> {order.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-6 pt-6 border-t">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {order.trackingNumber && (
                      <Button variant="outline">
                        <Truck className="w-4 h-4 mr-2" />
                        Track Package
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Buy Again
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <Button onClick={() => router.push('/products')}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Statistics */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-sm text-gray-600">Delivered</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">
                  {orders.filter(o => o.status === 'shipped').length}
                </p>
                <p className="text-sm text-gray-600">In Transit</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">
                  {orders.filter(o => o.status === 'processing').length}
                </p>
                <p className="text-sm text-gray-600">Processing</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}