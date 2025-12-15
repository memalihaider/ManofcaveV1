'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingModal } from '@/components/booking/BookingModal';
import { Scissors, Star, Clock, MapPin, Search, Filter } from 'lucide-react';
import { useCurrencyStore } from '@/stores/currency.store';

export default function ServicesPage() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { convertPrice, getCurrencySymbol } = useCurrencyStore();

  // Helper function to format prices with currency conversion
  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    const symbol = getCurrencySymbol();
    return `${symbol}${convertedPrice}`;
  };

  // Mock data - in real app, this would come from API
  const branches = [
    { id: 'all', name: 'All Branches' },
    { id: 'downtown', name: 'Downtown Premium' },
    { id: 'midtown', name: 'Midtown Elite' },
    { id: 'uptown', name: 'Uptown Luxury' },
    { id: 'suburban', name: 'Suburban Comfort' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'haircut', name: 'Haircuts & Styling' },
    { id: 'beard', name: 'Beard Care' },
    { id: 'facial', name: 'Facial Treatments' },
    { id: 'massage', name: 'Massage & Spa' },
    { id: 'packages', name: 'Premium Packages' },
  ];

  const services = [
    {
      id: 1,
      name: "Classic Haircut",
      category: "haircut",
      price: 35,
      duration: "30 min",
      description: "Traditional cut with precision styling",
      branches: ["downtown", "midtown", "uptown", "suburban"],
      rating: 4.8,
      reviews: 124,
      icon: Scissors,
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      images: [
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
      ]
    },
    {
      id: 2,
      name: "Premium Haircut & Style",
      category: "haircut",
      price: 55,
      duration: "45 min",
      description: "Advanced styling with premium products",
      branches: ["downtown", "uptown"],
      rating: 4.9,
      reviews: 89,
      icon: Scissors,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      images: [
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      ]
    },
    {
      id: 3,
      name: "Beard Trim & Shape",
      category: "beard",
      price: 25,
      duration: "20 min",
      description: "Precision beard trimming and shaping",
      branches: ["downtown", "midtown", "uptown", "suburban"],
      rating: 4.7,
      reviews: 156,
      icon: Star,
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      images: [
        "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    },
    {
      id: 4,
      name: "Hot Towel Shave",
      category: "beard",
      price: 45,
      duration: "30 min",
      description: "Traditional straight razor shave with hot towel",
      branches: ["downtown", "uptown"],
      rating: 4.9,
      reviews: 78,
      icon: Star,
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      images: [
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      ]
    },
    {
      id: 5,
      name: "Facial Treatment",
      category: "facial",
      price: 65,
      duration: "45 min",
      description: "Deep cleansing facial with premium products",
      branches: ["midtown", "uptown"],
      rating: 4.8,
      reviews: 92,
      icon: Clock,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      images: [
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    },
    {
      id: 6,
      name: "Scalp Massage",
      category: "massage",
      price: 40,
      duration: "25 min",
      description: "Relaxing scalp and neck massage",
      branches: ["downtown", "midtown", "uptown"],
      rating: 4.6,
      reviews: 67,
      icon: Clock,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      images: [
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    },
    {
      id: 7,
      name: "Complete Grooming Package",
      category: "packages",
      price: 85,
      duration: "90 min",
      description: "Haircut, beard trim, and facial treatment",
      branches: ["downtown", "uptown"],
      rating: 4.9,
      reviews: 134,
      icon: Scissors,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      images: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    },
    {
      id: 8,
      name: "Executive Package",
      category: "packages",
      price: 120,
      duration: "120 min",
      description: "Complete grooming experience with massage",
      branches: ["uptown"],
      rating: 5.0,
      reviews: 45,
      icon: Star,
      image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      images: [
        "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      ]
    },
  ];

  const filteredServices = services.filter(service => {
    const matchesBranch = selectedBranch === 'all' || service.branches.includes(selectedBranch);
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-8 px-4 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Our Premium Services
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover our complete range of professional grooming services tailored for the modern gentleman
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-white/80">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">4.8</div>
              <div className="text-sm text-white/80">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-white/80">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">5</div>
              <div className="text-sm text-white/80">Locations</div>
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
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-full sm:w-48 h-12 border-gray-200 focus:border-primary focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="All Branches" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12 border-gray-200 focus:border-primary focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
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
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedBranch !== 'all' || selectedCategory !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              {selectedBranch !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {branches.find(b => b.id === selectedBranch)?.name}
                  <button
                    onClick={() => setSelectedBranch('all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {filteredServices.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 h-full flex flex-col bg-white border-0 shadow-md hover:shadow-primary/10">
                {/* Image Section */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={service.image}
                    alt={`${service.name} service`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/95 text-primary font-semibold shadow-lg text-xs px-3 py-1 backdrop-blur-sm">
                      {categories.find(cat => cat.id === service.category)?.name}
                    </Badge>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {service.rating}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <CardHeader className="pb-3 flex-grow space-y-3">
                  {/* Service Icon and Title */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 font-medium">
                        {service.reviews} reviews
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 leading-tight">
                      {service.name}
                    </CardTitle>

                    {/* Duration and Price Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">{service.duration}</span>
                      </div>
                      <div className="text-xl font-bold text-secondary">
                        {formatPrice(service.price)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 mt-auto">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{service.branches.length} location{service.branches.length !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-primary font-medium group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                We couldn't find any services matching your criteria. Try adjusting your filters or search query.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedBranch('all');
                    setSelectedCategory('all');
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
                  <Search className="w-4 h-4" />
                  Browse All Services
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary via-primary to-secondary text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-4 leading-tight">
              Ready to Experience Premium Grooming?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book your appointment today and discover why thousands of gentlemen trust us with their grooming needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <BookingModal>
                <Button size="lg" className="bg-white text-primary hover:bg-gray-50 font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300">
                  Book Your Appointment
                </Button>
              </BookingModal>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 text-base"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Browse Services
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">4.8★</div>
                <div className="text-sm text-white/80">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">10K+</div>
                <div className="text-sm text-white/80">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">5</div>
                <div className="text-sm text-white/80">Premium Locations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}