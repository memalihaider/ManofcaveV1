'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Carousel } from '@/components/ui/carousel';
import { ShoppingCart, Star, ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useCurrencyStore } from '@/stores/currency.store';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { convertPrice, getCurrencySymbol } = useCurrencyStore();

  // Helper function to format prices with currency conversion
  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    const symbol = getCurrencySymbol();
    return `${symbol}${convertedPrice}`;
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Mock product data - in real app, this would come from API/database
  const products = [
    {
      id: 'luxury-shampoo',
      name: "Luxury Shampoo",
      category: "hair-care",
      price: 45,
      originalPrice: 55,
      description: "Organic ingredients for healthy, voluminous hair with professional salon results. This premium shampoo is formulated with natural extracts and essential oils to nourish your scalp and strengthen hair follicles.",
      longDescription: "Experience the ultimate in hair care with our Luxury Shampoo. Crafted with organic ingredients including aloe vera, argan oil, and keratin, this sulfate-free formula gently cleanses while providing deep nourishment. Perfect for all hair types, it promotes healthy growth, adds volume, and leaves your hair silky smooth and manageable.",
      rating: 4.8,
      reviews: 156,
      inStock: true,
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ],
      tags: ["Organic", "Sulfate-Free", "Paraben-Free"],
      benefits: ["Deep nourishment", "Volume enhancement", "Scalp health", "Natural shine"],
      ingredients: ["Aloe Vera", "Argan Oil", "Keratin", "Essential Oils", "Vitamin E"],
      usage: "Apply to wet hair, massage gently, rinse thoroughly. Use 2-3 times per week."
    },
    {
      id: 'beard-oil',
      name: "Beard Oil",
      category: "beard-care",
      price: 35,
      description: "Nourishing blend of natural oils for soft, manageable beard care",
      longDescription: "Transform your beard with our premium Beard Oil. This carefully crafted blend of natural oils penetrates deep into the beard hair and skin, providing essential moisture and nutrients. Say goodbye to dry, itchy beard and hello to soft, healthy, manageable facial hair.",
      rating: 4.7,
      reviews: 203,
      inStock: true,
      images: [
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ],
      tags: ["Natural", "Non-Greasy", "Long-Lasting"],
      benefits: ["Softens beard hair", "Moisturizes skin", "Reduces itchiness", "Enhances growth"],
      ingredients: ["Jojoba Oil", "Argan Oil", "Vitamin E", "Essential Oils"],
      usage: "Apply 2-3 drops to damp beard, massage thoroughly, style as desired."
    },
    {
      id: 'styling-wax',
      name: "Styling Wax",
      category: "styling",
      price: 28,
      description: "Professional hold and natural shine for all hair types and styles",
      longDescription: "Achieve professional styling results with our premium Styling Wax. This water-based formula provides strong hold while maintaining natural movement and shine. Perfect for creating textured looks, spikes, or sleek finishes.",
      rating: 4.6,
      reviews: 89,
      inStock: true,
      images: [
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
        "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      ],
      tags: ["Water-Based", "Strong Hold", "Natural Shine"],
      benefits: ["Strong hold", "Natural shine", "Flexible styling", "Easy to wash out"],
      ingredients: ["Beeswax", "Carnauba Wax", "Essential Oils", "Vitamin E"],
      usage: "Warm small amount between fingers, apply to dry hair, style as desired."
    },
    {
      id: 'aftershave-balm',
      name: "Aftershave Balm",
      category: "skin-care",
      price: 40,
      description: "Soothing and moisturizing balm that calms skin after shaving",
      longDescription: "Experience instant relief and deep hydration with our Aftershave Balm. This alcohol-free formula soothes irritated skin, reduces razor burn, and provides long-lasting moisture. Perfect for sensitive skin and daily use.",
      rating: 4.9,
      reviews: 124,
      inStock: true,
      images: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
      ],
      tags: ["Alcohol-Free", "Hydrating", "Soothing"],
      benefits: ["Reduces irritation", "Deep hydration", "Calms razor burn", "Long-lasting moisture"],
      ingredients: ["Aloe Vera", "Vitamin E", "Chamomile Extract", "Panthenol"],
      usage: "Apply generously to shaved area, massage gently until absorbed."
    }
  ];

  const product = products.find(p => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: convertPrice(product.price),
        image: product.images[0],
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-0 h-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category.replace('-', ' ').toUpperCase()}
                </Badge>
                {product.originalPrice && (
                  <Badge variant="destructive" className="text-xs">
                    SAVE {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">{product.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-semibold py-3"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart - {formatPrice(product.price * quantity)}
                    </Button>
                    <Button variant="outline" size="icon" className="p-3">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="p-3">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Free Shipping</h3>
                  <p className="text-xs text-gray-600">On orders over $50</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Secure Payment</h3>
                  <p className="text-xs text-gray-600">100% secure checkout</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <RotateCcw className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Easy Returns</h3>
                  <p className="text-xs text-gray-600">30-day return policy</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">How to Use</h3>
                <p className="text-gray-700 leading-relaxed">{product.usage}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}