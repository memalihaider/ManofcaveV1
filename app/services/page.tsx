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

export default function ServicesPage() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
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
      image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
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
      image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover our complete range of professional grooming services
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
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Branch" />
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
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 min-h-[400px] flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={`${service.name} service`}
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/90 text-primary font-semibold shadow-lg text-xs">
                    {categories.find(cat => cat.id === service.category)?.name}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3 flex-grow">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    {service.rating}
                  </div>
                </div>
                <CardTitle className="text-lg text-primary font-bold">{service.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </div>
                  <div className="text-sm text-gray-500">
                    ({service.reviews} reviews)
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 mt-auto">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-secondary">${service.price}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {service.branches.length} branches
                  </div>
                </div>
                <BookingModal serviceId={service.id.toString()} serviceName={service.name}>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary">
                    Book Now
                  </Button>
                </BookingModal>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Scissors className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Ready to Book?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Experience our premium grooming services at any of our locations
          </p>
          <BookingModal>
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary">
              Book Your Appointment
            </Button>
          </BookingModal>
        </div>
      </div>
    </div>
  );
}