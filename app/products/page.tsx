'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Star, Package, Search, Filter } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useCurrencyStore } from '@/stores/currency.store';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, getItemCount } = useCartStore();
  const { convertPrice, getCurrencySymbol } = useCurrencyStore();

  // Helper function to format prices with currency conversion
  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    const symbol = getCurrencySymbol();
    return `${symbol}${convertedPrice}`;
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'hair-care', name: 'Hair Care' },
    { id: 'beard-care', name: 'Beard Care' },
    { id: 'skin-care', name: 'Skin Care' },
    { id: 'styling', name: 'Styling Products' },
    { id: 'grooming', name: 'Grooming Kits' },
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-25', name: 'Under $25' },
    { id: '25-50', name: '$25 - $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: '100+', name: 'Over $100' },
  ];

  const products = [
    {
      id: 1,
      name: "Luxury Shampoo",
      category: "hair-care",
      price: 45,
      originalPrice: 55,
      description: "Organic ingredients for healthy, voluminous hair",
      rating: 4.8,
      reviews: 156,
      inStock: true,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tags: ["Organic", "Sulfate-Free"]
    },
    {
      id: 2,
      name: "Beard Oil",
      category: "beard-care",
      price: 35,
      description: "Nourishing blend for soft, manageable beard",
      rating: 4.7,
      reviews: 203,
      inStock: true,
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      tags: ["Natural", "Non-Greasy"]
    },
    {
      id: 3,
      name: "Styling Wax",
      category: "styling",
      price: 28,
      description: "Professional hold and shine for all hair types",
      rating: 4.6,
      reviews: 89,
      inStock: true,
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      tags: ["Water-Based", "Strong Hold"]
    },
    {
      id: 4,
      name: "Aftershave Balm",
      category: "skin-care",
      price: 40,
      description: "Soothing and moisturizing aftershave treatment",
      rating: 4.9,
      reviews: 124,
      inStock: true,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tags: ["Alcohol-Free", "Hydrating"]
    },
    {
      id: 5,
      name: "Complete Grooming Kit",
      category: "grooming",
      price: 120,
      originalPrice: 150,
      description: "Essential grooming tools and products bundle",
      rating: 4.8,
      reviews: 67,
      inStock: true,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      tags: ["Bundle", "Professional"]
    },
    {
      id: 6,
      name: "Hair Treatment Mask",
      category: "hair-care",
      price: 65,
      description: "Deep conditioning treatment for damaged hair",
      rating: 4.7,
      reviews: 98,
      inStock: false,
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      tags: ["Deep Conditioning", "Repair"]
    },
    {
      id: 7,
      name: "Beard Balm",
      category: "beard-care",
      price: 32,
      description: "Styling balm for beard shaping and conditioning",
      rating: 4.5,
      reviews: 145,
      inStock: true,
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tags: ["Medium Hold", "Conditioning"]
    },
    {
      id: 8,
      name: "Face Wash",
      category: "skin-care",
      price: 25,
      description: "Gentle cleansing for men's skin",
      rating: 4.4,
      reviews: 76,
      inStock: true,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tags: ["Gentle", "Daily Use"]
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = priceRange === 'all' || (
      priceRange === '0-25' && product.price < 25 ||
      priceRange === '25-50' && product.price >= 25 && product.price <= 50 ||
      priceRange === '50-100' && product.price >= 50 && product.price <= 100 ||
      priceRange === '100+' && product.price > 100
    );
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-8 px-4 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Premium Grooming Products
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Professional-grade grooming products crafted for the modern gentleman
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-white/80">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">4.7★</div>
              <div className="text-sm text-white/80">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/80">Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12 border-gray-200 focus:border-primary focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-48 h-12 border-gray-200 focus:border-primary focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="All Prices" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || priceRange !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {priceRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {priceRanges.find(r => r.id === priceRange)?.name}
                  <button
                    onClick={() => setPriceRange('all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 h-full flex flex-col bg-white border-0 shadow-md hover:shadow-primary/10">
              {/* Image Section */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={product.image}
                  alt={`${product.name} product`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                {/* Badges */}
                {!product.inStock && (
                  <Badge variant="destructive" className="absolute top-3 right-3 shadow-lg">
                    Out of Stock
                  </Badge>
                )}
                {product.originalPrice && (
                  <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white shadow-lg">
                    Sale
                  </Badge>
                )}

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-white/95 text-primary font-semibold shadow-lg text-xs px-3 py-1 backdrop-blur-sm">
                    {categories.find(cat => cat.id === product.category)?.name}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
                {/* Rating and Title */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-gray-500">({product.reviews})</span>
                  </div>
                </div>

                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 mb-2 leading-tight">
                  {product.name}
                </CardTitle>

                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2 flex-grow">
                  {product.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-secondary">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <Badge variant="destructive" className="text-xs">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold py-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!product.inStock}
                  onClick={() => product.inStock && addItem({
                    id: product.id,
                    name: product.name,
                    price: convertPrice(product.price),
                    image: product.image
                  })}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Cart Link */}
        {getItemCount() > 0 && (
          <div className="text-center mb-8">
            <Link href="/cart">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Cart ({getItemCount()} items)
              </Button>
            </Link>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                We couldn't find any products matching your criteria. Try adjusting your filters or search query.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </Button>
                <Button
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Browse All Products
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary via-primary to-secondary text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-4 leading-tight">
              Experience Premium Grooming In-Person
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Visit our salons to experience our premium products and discover personalized grooming recommendations
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-50 font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/branches">
                  Find a Location
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 text-base"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Browse Products
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">Premium</div>
                <div className="text-sm text-white/80">Quality Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">Expert</div>
                <div className="text-sm text-white/80">Recommendations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">Personal</div>
                <div className="text-sm text-white/80">Styling Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}