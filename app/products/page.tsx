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

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, getItemCount } = useCartStore();

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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Premium Products
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Professional-grade grooming products for the modern gentleman
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Category" />
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
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price Range" />
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={`${product.name} product`}
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  {!product.inStock && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      Out of Stock
                    </Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="secondary" className="absolute top-2 left-2 bg-primary text-white">
                      Sale
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {categories.find(cat => cat.id === product.category)?.name}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-3 h-3 fill-secondary text-secondary" />
                    {product.rating}
                  </div>
                </div>
                <CardTitle className="text-lg text-primary mb-2">{product.name}</CardTitle>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-secondary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                </div>
                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary"
                  disabled={!product.inStock}
                  onClick={() => product.inStock && addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
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
        <div className="text-center mt-8">
          <Link href="/cart">
            <Button variant="outline" size="lg" className="bg-secondary/10 hover:bg-secondary/20">
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart ({getItemCount()} items)
            </Button>
          </Link>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Visit Our Salon</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Experience our products in person and discover the Premium Cuts difference
          </p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary">
            <Link href="/branches">Find a Location</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}