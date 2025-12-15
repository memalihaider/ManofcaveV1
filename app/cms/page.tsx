'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { FileText, Image, Star, Users, Edit, Eye, Save, LogOut, Settings, Palette, MessageSquare, MapPin, Phone, Mail, Clock, Upload, X, Check, Plus, Trash2, Globe, Search, Filter } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface HeroSection {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage: string;
  stats: {
    locations: string;
    clients: string;
    rating: string;
  };
  status: 'published' | 'draft';
}

interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  duration: string;
  branches: string[];
  promotion: string;
  couponCode: string;
  status: 'published' | 'draft';
}

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
  badge: string;
  branches: string[];
  promotion: string;
  couponCode: string;
  status: 'published' | 'draft';
}

interface Promotion {
  id: number;
  title: string;
  discount: string;
  description: string;
  validUntil: string;
  image: string;
  badge: string;
  terms: string;
  couponCode: string;
  applicableServices: string[];
  branches: string[];
  status: 'published' | 'draft';
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  role: string;
  image: string;
  status: 'published' | 'draft';
}

interface TeamMember {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image: string;
  branches: string[];
  status: 'published' | 'draft';
}

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  status: 'published' | 'draft';
}

interface AboutSection {
  title: string;
  content: string;
  mission: string;
  vision: string;
  image: string;
  status: 'published' | 'draft';
}

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
  status: 'published' | 'draft';
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export default function LandingPageCMS() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // State for all CMS sections
  const [heroSection, setHeroSection] = useState<HeroSection>({
    title: "Man of Cave",
    subtitle: "Experience luxury grooming at our 8 locations across the city",
    ctaPrimary: "Book Now",
    ctaSecondary: "Find Location",
    backgroundImage: "/api/placeholder/1920/1080",
    stats: {
      locations: "8+",
      clients: "5000+",
      rating: "4.9★"
    },
    status: "published"
  });

  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Haircut & Styling",
      price: "From $35",
      description: "Professional cuts with modern techniques",
      image: "/api/placeholder/400/300",
      duration: "45 min",
      branches: ["all"],
      promotion: "First visit 20% off",
      couponCode: "FIRSTCUT20",
      status: "published"
    },
    {
      id: 2,
      name: "Beard Grooming",
      price: "From $25",
      description: "Precision beard trimming and styling",
      image: "/api/placeholder/400/300",
      duration: "30 min",
      branches: ["all"],
      promotion: "Beard grooming buy 2 get 1 free",
      couponCode: "BEARD3GET1",
      status: "published"
    },
    {
      id: 3,
      name: "Premium Packages",
      price: "From $65",
      description: "Complete grooming experience",
      image: "/api/placeholder/400/300",
      duration: "90 min",
      branches: ["all"],
      promotion: "Premium package 15% off",
      couponCode: "PREMIUM15",
      status: "published"
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 'luxury-shampoo',
      name: "Luxury Shampoo",
      price: "$45",
      description: "Premium shampoo with rare ingredients",
      category: "Hair Care",
      image: "/api/placeholder/400/300",
      badge: "Luxury",
      branches: ["all"],
      promotion: "Luxury shampoo 25% off",
      couponCode: "LUXURYSHAMPOO25",
      status: "published"
    }
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 1,
      title: "Package Deal",
      discount: "$50 OFF",
      description: "Save $50 when you book any premium grooming package",
      validUntil: "Limited time offer",
      image: "/api/placeholder/400/300",
      badge: "Package Special",
      terms: "Valid on packages over $150. Cannot be combined with other offers.",
      couponCode: "PACKAGE50",
      applicableServices: ["VIP Hair Treatment", "Premium Hair Coloring"],
      branches: ["all"],
      status: "published"
    }
  ]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "John D.",
      rating: 5,
      text: "Best barber in town! Always perfect cuts.",
      role: "Regular Client",
      image: "/api/placeholder/100/100",
      status: "published"
    },
    {
      id: 2,
      name: "Mike R.",
      rating: 5,
      text: "Professional service and great atmosphere.",
      role: "Business Professional",
      image: "/api/placeholder/100/100",
      status: "published"
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Ahmed Hassan",
      specialty: "Master Barber",
      rating: 4.9,
      experience: "8 years",
      image: "/api/placeholder/300/300",
      branches: ["downtown"],
      status: "published"
    }
  ]);

  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 1,
      name: "Downtown Premium",
      address: "123 Main St, Downtown",
      phone: "(555) 123-4567",
      hours: "Mon-Fri: 9AM-7PM, Sat: 8AM-5PM",
      image: "/api/placeholder/400/300",
      status: "published"
    }
  ]);

  const [aboutSection, setAboutSection] = useState<AboutSection>({
    title: "About Man of Cave",
    content: "Founded in 2018, Man of Cave has been providing exceptional grooming services...",
    mission: "To provide every client with an exceptional grooming experience...",
    vision: "To be the premier destination for men's grooming services...",
    image: "/api/placeholder/800/600",
    status: "published"
  });

  const [gallery, setGallery] = useState<GalleryItem[]>([
    {
      id: 1,
      title: "Modern Haircut",
      image: "/api/placeholder/400/300",
      category: "Haircuts",
      status: "published"
    }
  ]);

  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    metaTitle: "Man of Cave - Luxury Barber Shop | Book Online",
    metaDescription: "Experience premium grooming services at Man of Cave...",
    keywords: "barber, haircuts, beard grooming, luxury salon",
    ogImage: "/api/placeholder/1200/630"
  });

  // Helper functions
  const handleSave = (section: string) => {
    // In a real app, this would save to a backend
    alert(`${section} saved successfully!`);
  };

  const handleStatusToggle = (section: string, id: number | string, status: 'published' | 'draft') => {
    // Update status logic would go here
    alert(`${section} status updated to ${status}`);
  };

  const handleDelete = (section: string, id: number | string) => {
    if (confirm(`Are you sure you want to delete this ${section}?`)) {
      alert(`${section} deleted successfully`);
    }
  };

  const handleAddNew = (section: string) => {
    alert(`Add new ${section} functionality would open a modal/form`);
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar
          role="super_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar
                  role="super_admin"
                  onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Landing Page CMS</h1>
                  <p className="text-sm text-gray-600">Manage homepage content and SEO</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                  <TabsTrigger value="hero" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span className="hidden sm:inline">Hero</span>
                  </TabsTrigger>
                  <TabsTrigger value="services" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Services</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Products</span>
                  </TabsTrigger>
                  <TabsTrigger value="promotions" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span className="hidden sm:inline">Promotions</span>
                  </TabsTrigger>
                  <TabsTrigger value="testimonials" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Reviews</span>
                  </TabsTrigger>
                  <TabsTrigger value="team" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Team</span>
                  </TabsTrigger>
                  <TabsTrigger value="about" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">About</span>
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">SEO</span>
                  </TabsTrigger>
                </TabsList>

                {/* Hero Section */}
                <TabsContent value="hero" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Hero Section
                      </CardTitle>
                      <CardDescription>
                        Manage the main hero banner and call-to-action buttons
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="hero-title">Title</Label>
                            <Input
                              id="hero-title"
                              value={heroSection.title}
                              onChange={(e) => setHeroSection(prev => ({ ...prev, title: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="hero-subtitle">Subtitle</Label>
                            <Textarea
                              id="hero-subtitle"
                              value={heroSection.subtitle}
                              onChange={(e) => setHeroSection(prev => ({ ...prev, subtitle: e.target.value }))}
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="hero-cta-primary">Primary CTA</Label>
                              <Input
                                id="hero-cta-primary"
                                value={heroSection.ctaPrimary}
                                onChange={(e) => setHeroSection(prev => ({ ...prev, ctaPrimary: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="hero-cta-secondary">Secondary CTA</Label>
                              <Input
                                id="hero-cta-secondary"
                                value={heroSection.ctaSecondary}
                                onChange={(e) => setHeroSection(prev => ({ ...prev, ctaSecondary: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>Background Image</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Upload hero background image</p>
                              <Input type="file" accept="image/*" className="mt-2" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Locations</Label>
                              <Input
                                value={heroSection.stats.locations}
                                onChange={(e) => setHeroSection(prev => ({
                                  ...prev,
                                  stats: { ...prev.stats, locations: e.target.value }
                                }))}
                              />
                            </div>
                            <div>
                              <Label>Clients</Label>
                              <Input
                                value={heroSection.stats.clients}
                                onChange={(e) => setHeroSection(prev => ({
                                  ...prev,
                                  stats: { ...prev.stats, clients: e.target.value }
                                }))}
                              />
                            </div>
                            <div>
                              <Label>Rating</Label>
                              <Input
                                value={heroSection.stats.rating}
                                onChange={(e) => setHeroSection(prev => ({
                                  ...prev,
                                  stats: { ...prev.stats, rating: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={heroSection.status === 'published'}
                            onCheckedChange={(checked) => setHeroSection(prev => ({
                              ...prev,
                              status: checked ? 'published' : 'draft'
                            }))}
                          />
                          <Label>Published</Label>
                        </div>
                        <Button onClick={() => handleSave('Hero Section')}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Services Section */}
                <TabsContent value="services" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Services Management</h3>
                      <p className="text-sm text-gray-600">Manage grooming services displayed on homepage</p>
                    </div>
                    <Button onClick={() => handleAddNew('Service')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <Card key={service.id} className="hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge className={service.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {service.status}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{service.price}</span>
                            <span className="text-sm text-gray-500">• {service.duration}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle('Service', service.id, service.status === 'published' ? 'draft' : 'published')}
                            >
                              {service.status === 'published' ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('Service', service.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Products Section */}
                <TabsContent value="products" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Products Management</h3>
                      <p className="text-sm text-gray-600">Manage grooming products displayed on homepage</p>
                    </div>
                    <Button onClick={() => handleAddNew('Product')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge className={product.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {product.status}
                            </Badge>
                            <Badge className="bg-primary/10 text-primary">{product.category}</Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{product.price}</span>
                            {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle('Product', product.id, product.status === 'published' ? 'draft' : 'published')}
                            >
                              {product.status === 'published' ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('Product', product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Promotions Section */}
                <TabsContent value="promotions" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Promotions Management</h3>
                      <p className="text-sm text-gray-600">Manage special offers and promotions</p>
                    </div>
                    <Button onClick={() => handleAddNew('Promotion')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Promotion
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promotions.map((promo) => (
                      <Card key={promo.id} className="hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                          <img
                            src={promo.image}
                            alt={promo.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge className={promo.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {promo.status}
                            </Badge>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-secondary text-primary font-bold">
                              {promo.discount}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{promo.title}</CardTitle>
                          <CardDescription>{promo.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-500 mb-2">{promo.validUntil}</div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle('Promotion', promo.id, promo.status === 'published' ? 'draft' : 'published')}
                            >
                              {promo.status === 'published' ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('Promotion', promo.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Testimonials Section */}
                <TabsContent value="testimonials" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Testimonials Management</h3>
                      <p className="text-sm text-gray-600">Manage customer reviews and testimonials</p>
                    </div>
                    <Button onClick={() => handleAddNew('Testimonial')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Testimonial
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                      <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-4 mb-4">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                            />
                            <div>
                              <h4 className="font-bold text-primary">{testimonial.name}</h4>
                              <p className="text-sm text-gray-600">{testimonial.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                            ))}
                          </div>
                          <CardDescription className="text-gray-700 italic">
                            "{testimonial.text}"
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge className={testimonial.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {testimonial.status}
                            </Badge>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusToggle('Testimonial', testimonial.id, testimonial.status === 'published' ? 'draft' : 'published')}
                              >
                                {testimonial.status === 'published' ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete('Testimonial', testimonial.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Team Section */}
                <TabsContent value="team" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Team Management</h3>
                      <p className="text-sm text-gray-600">Manage team members displayed on homepage</p>
                    </div>
                    <Button onClick={() => handleAddNew('Team Member')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member) => (
                      <Card key={member.id} className="hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge className={member.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {member.status}
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-secondary text-primary font-semibold">
                                {member.rating}★
                              </Badge>
                              <Badge className="bg-primary/90 text-white">
                                {member.experience}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-serif font-bold text-primary mb-2">
                            {member.name}
                          </h3>
                          <p className="text-secondary font-semibold text-sm mb-3">
                            {member.specialty}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle('Team Member', member.id, member.status === 'published' ? 'draft' : 'published')}
                            >
                              {member.status === 'published' ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('Team Member', member.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* About Section */}
                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        About Section
                      </CardTitle>
                      <CardDescription>
                        Manage the about section content and company information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="about-title">Title</Label>
                            <Input
                              id="about-title"
                              value={aboutSection.title}
                              onChange={(e) => setAboutSection(prev => ({ ...prev, title: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="about-content">Content</Label>
                            <Textarea
                              id="about-content"
                              value={aboutSection.content}
                              onChange={(e) => setAboutSection(prev => ({ ...prev, content: e.target.value }))}
                              rows={6}
                            />
                          </div>
                          <div>
                            <Label htmlFor="about-mission">Mission</Label>
                            <Textarea
                              id="about-mission"
                              value={aboutSection.mission}
                              onChange={(e) => setAboutSection(prev => ({ ...prev, mission: e.target.value }))}
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="about-vision">Vision</Label>
                            <Textarea
                              id="about-vision"
                              value={aboutSection.vision}
                              onChange={(e) => setAboutSection(prev => ({ ...prev, vision: e.target.value }))}
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>About Image</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Upload about section image</p>
                              <Input type="file" accept="image/*" className="mt-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={aboutSection.status === 'published'}
                            onCheckedChange={(checked) => setAboutSection(prev => ({
                              ...prev,
                              status: checked ? 'published' : 'draft'
                            }))}
                          />
                          <Label>Published</Label>
                        </div>
                        <Button onClick={() => handleSave('About Section')}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SEO Settings */}
                <TabsContent value="seo" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        SEO Settings
                      </CardTitle>
                      <CardDescription>
                        Manage meta tags, descriptions, and search engine optimization
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="meta-title">Meta Title</Label>
                          <Input
                            id="meta-title"
                            value={seoSettings.metaTitle}
                            onChange={(e) => setSeoSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Recommended: 50-60 characters ({seoSettings.metaTitle.length} characters)
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="meta-description">Meta Description</Label>
                          <Textarea
                            id="meta-description"
                            value={seoSettings.metaDescription}
                            onChange={(e) => setSeoSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                            rows={3}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Recommended: 150-160 characters ({seoSettings.metaDescription.length} characters)
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="keywords">Keywords</Label>
                          <Input
                            id="keywords"
                            value={seoSettings.keywords}
                            onChange={(e) => setSeoSettings(prev => ({ ...prev, keywords: e.target.value }))}
                            placeholder="barber, haircuts, grooming, luxury salon"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Separate keywords with commas
                          </p>
                        </div>
                        <div>
                          <Label>Open Graph Image</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Upload OG image (1200x630 recommended)</p>
                            <Input type="file" accept="image/*" className="mt-2" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => handleSave('SEO Settings')}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
