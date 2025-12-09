'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { Scissors, MapPin, Star, Clock, Phone, Mail, Gift, Copy, ChevronDown } from "lucide-react";
import { Header } from "@/components/shared/Header";
import Link from "next/link";
import { BookingModal } from "@/components/booking/BookingModal";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury barber shop interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="mb-6">
            <Badge className="bg-secondary/90 text-primary font-semibold px-4 py-2 mb-4 backdrop-blur-sm">
              ✨ Premium Grooming Experience
            </Badge>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
              Premium
              <span className="block text-secondary">Cuts</span>
            </h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          </div>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Experience luxury grooming at our 8 locations across the city.
            Where tradition meets innovation in the art of gentlemen's grooming.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-10 py-4 text-lg shadow-2xl hover:shadow-secondary/25 transition-all duration-300 transform hover:scale-105">
              <Scissors className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 text-lg backdrop-blur-sm bg-white/10 shadow-2xl transition-all duration-300">
              <MapPin className="w-5 h-5 mr-2" />
              Find Location
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">8+</div>
              <div className="text-sm md:text-base opacity-90">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">5000+</div>
              <div className="text-sm md:text-base opacity-90">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">4.9★</div>
              <div className="text-sm md:text-base opacity-90">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Region Selection */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              🗺️ Our Locations
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Choose Your Location
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our premium grooming locations strategically placed across the city for your convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Downtown",
                branches: 2,
                image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
                description: "Heart of the city"
              },
              {
                name: "Midtown",
                branches: 2,
                image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                description: "Business district"
              },
              {
                name: "Uptown",
                branches: 2,
                image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                description: "Luxury district"
              },
              {
                name: "Suburbs",
                branches: 2,
                image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
                description: "Residential areas"
              },
            ].map((region, index) => (
              <Card key={region.name} className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:-translate-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden">
                  <img
                    src={region.image}
                    alt={`${region.name} barber shop`}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-primary font-semibold shadow-lg">
                      {region.branches} Branches
                    </Badge>
                  </div>
                </div>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-primary text-xl font-bold group-hover:text-secondary transition-colors duration-300">
                    {region.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {region.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Locations
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              ✨ Featured Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              Premium Grooming Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience world-class grooming services tailored to perfection, delivered by our expert stylists
            </p>
          </div>
          <div className="relative">
            <Carousel className="max-w-7xl mx-auto" autoPlay={true} autoPlayInterval={4000} showDots={false}>
              {/* Slide 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    name: "Haircut & Styling",
                    price: "From $35",
                    description: "Professional cuts with modern techniques",
                    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    duration: "30-45 min"
                  },
                  {
                    name: "Beard Grooming",
                    price: "From $25",
                    description: "Precision beard trimming and styling",
                    image: "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    duration: "20-30 min"
                  },
                  {
                    name: "Premium Packages",
                    price: "From $65",
                    description: "Complete grooming experience",
                    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
                    duration: "60-90 min"
                  },
                  {
                    name: "Hair Coloring",
                    price: "From $45",
                    description: "Professional coloring and highlighting",
                    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                    duration: "60 min"
                  },
                ].map((service, index) => (
                  <Card key={service.name} className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg animate-slide-up overflow-hidden bg-white hover:-translate-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={`${service.name} service`}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-primary font-semibold shadow-lg text-xs">
                          {service.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-secondary text-lg font-bold group-hover:text-primary transition-colors duration-300">
                        {service.name}
                      </CardTitle>
                      <CardDescription className="text-accent font-semibold text-base">
                        {service.price}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-3 leading-relaxed text-sm">{service.description}</p>
                      <BookingModal serviceId={service.name.toLowerCase().replace(/\s+/g, '-')} serviceName={service.name}>
                        <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 text-sm py-2">
                          Book Now
                        </Button>
                      </BookingModal>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Slide 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    name: "Facial Treatment",
                    price: "From $35",
                    description: "Relaxing facial treatments for healthy skin",
                    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    duration: "45 min"
                  },
                  {
                    name: "Hot Towel Shave",
                    price: "From $30",
                    description: "Traditional straight razor shave experience",
                    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
                    duration: "40 min"
                  },
                  {
                    name: "Hair Styling",
                    price: "From $15",
                    description: "Modern styling with premium products",
                    image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    duration: "20 min"
                  },
                  {
                    name: "Scalp Treatment",
                    price: "From $40",
                    description: "Therapeutic scalp massage and treatment",
                    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
                    duration: "30 min"
                  },
                ].map((service, index) => (
                  <Card key={service.name} className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg animate-slide-up overflow-hidden bg-white hover:-translate-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={`${service.name} service`}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-primary font-semibold shadow-lg text-xs">
                          {service.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-secondary text-lg font-bold group-hover:text-primary transition-colors duration-300">
                        {service.name}
                      </CardTitle>
                      <CardDescription className="text-accent font-semibold text-base">
                        {service.price}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-3 leading-relaxed text-sm">{service.description}</p>
                      <BookingModal serviceId={service.name.toLowerCase().replace(/\s+/g, '-')} serviceName={service.name}>
                        <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 text-sm py-2">
                          Book Now
                        </Button>
                      </BookingModal>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Slide 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    name: "Eyebrow Shaping",
                    price: "From $20",
                    description: "Professional eyebrow grooming and shaping",
                    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    duration: "15 min"
                  },
                  {
                    name: "Neck & Shoulder Massage",
                    price: "From $25",
                    description: "Relaxing massage for neck and shoulders",
                    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    duration: "25 min"
                  },
                  {
                    name: "Deep Conditioning",
                    price: "From $30",
                    description: "Intensive hair conditioning treatment",
                    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                    duration: "35 min"
                  },
                  {
                    name: "Express Service",
                    price: "From $20",
                    description: "Quick grooming service for busy schedules",
                    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    duration: "15 min"
                  },
                ].map((service, index) => (
                  <Card key={service.name} className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg animate-slide-up overflow-hidden bg-white hover:-translate-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={`${service.name} service`}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-primary font-semibold shadow-lg text-xs">
                          {service.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-secondary text-lg font-bold group-hover:text-primary transition-colors duration-300">
                        {service.name}
                      </CardTitle>
                      <CardDescription className="text-accent font-semibold text-base">
                        {service.price}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-3 leading-relaxed text-sm">{service.description}</p>
                      <BookingModal serviceId={service.name.toLowerCase().replace(/\s+/g, '-')} serviceName={service.name}>
                        <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 text-sm py-2">
                          Book Now
                        </Button>
                      </BookingModal>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Carousel>
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary px-8 py-3 text-lg font-semibold">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-secondary to-accent animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-white/20 text-white font-semibold px-4 py-2 mb-4 border border-white/30">
              🎉 Special Offers
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 animate-slide-up">
              Exclusive Promotions
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Limited-time offers to enhance your grooming experience and save on premium services
            </p>
          </div>
          <div className="relative">
            <Carousel className="max-w-7xl mx-auto" autoPlay={true} autoPlayInterval={5000} showDots={false}>
              {/* Slide 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    title: "First-Time Customer",
                    discount: "20% OFF",
                    description: "Get 20% off your first visit with our premium grooming services",
                    validUntil: "Valid until Dec 31, 2025",
                    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "New Customer"
                  },
                  {
                    title: "Student Discount",
                    discount: "15% OFF",
                    description: "Special pricing for students with valid ID - quality grooming at affordable prices",
                    validUntil: "Ongoing promotion",
                    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
                    badge: "Student Special"
                  },
                  {
                    title: "Loyalty Program",
                    discount: "Free Service",
                    description: "Earn points for every visit, redeem for free services and exclusive perks",
                    validUntil: "Always available",
                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "VIP Program"
                  },
                  {
                    title: "Weekend Special",
                    discount: "25% OFF",
                    description: "Enjoy 25% off all services every Friday, Saturday, and Sunday",
                    validUntil: "Every weekend",
                    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "Weekend Deal"
                  },
                ].map((promo, index) => (
                  <Card key={promo.title} className="text-center hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur animate-slide-up hover:-translate-y-2 border-0 shadow-xl overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={promo.image}
                        alt={`${promo.title} promotion`}
                        className="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white font-semibold shadow-lg text-xs">
                          {promo.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-primary font-bold text-sm px-2 py-1 shadow-lg">
                          {promo.discount}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-primary text-lg font-bold">
                        {promo.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed text-sm">
                        {promo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-gray-500 mb-3 font-medium">
                        {promo.validUntil}
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white hover:bg-secondary hover:text-primary transition-all duration-300 font-semibold text-sm py-2">
                        <Gift className="w-3 h-3 mr-1" />
                        Claim Offer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Slide 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    title: "Package Deal",
                    discount: "$50 OFF",
                    description: "Save $50 when you book any premium grooming package",
                    validUntil: "Limited time offer",
                    image: "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "Package Special"
                  },
                  {
                    title: "Referral Bonus",
                    discount: "Free Haircut",
                    description: "Bring a friend and both get a free haircut on their next visit",
                    validUntil: "Ongoing program",
                    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                    badge: "Referral Program"
                  },
                  {
                    title: "Senior Discount",
                    discount: "30% OFF",
                    description: "Special 30% discount for seniors 65+ - quality care at great prices",
                    validUntil: "Ongoing promotion",
                    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                    badge: "Senior Special"
                  },
                  {
                    title: "Military Appreciation",
                    discount: "20% OFF",
                    description: "Thank you for your service - 20% off for active and veteran military",
                    validUntil: "Always honored",
                    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "Military Discount"
                  },
                ].map((promo, index) => (
                  <Card key={promo.title} className="text-center hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur animate-slide-up hover:-translate-y-2 border-0 shadow-xl overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={promo.image}
                        alt={`${promo.title} promotion`}
                        className="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white font-semibold shadow-lg text-xs">
                          {promo.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-primary font-bold text-sm px-2 py-1 shadow-lg">
                          {promo.discount}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-primary text-lg font-bold">
                        {promo.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed text-sm">
                        {promo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-gray-500 mb-3 font-medium">
                        {promo.validUntil}
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white hover:bg-secondary hover:text-primary transition-all duration-300 font-semibold text-sm py-2">
                        <Gift className="w-3 h-3 mr-1" />
                        Claim Offer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Slide 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  {
                    title: "Birthday Special",
                    discount: "Free Service",
                    description: "Celebrate your birthday with a complimentary grooming service",
                    validUntil: "Birthday month only",
                    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    badge: "Birthday Gift"
                  },
                ].map((promo, index) => (
                  <Card key={promo.title} className="text-center hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur animate-slide-up hover:-translate-y-2 border-0 shadow-xl overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <img
                        src={promo.image}
                        alt={`${promo.title} promotion`}
                        className="w-full h-40 object-cover hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white font-semibold shadow-lg text-xs">
                          {promo.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-primary font-bold text-sm px-2 py-1 shadow-lg">
                          {promo.discount}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-primary text-lg font-bold">
                        {promo.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed text-sm">
                        {promo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-gray-500 mb-3 font-medium">
                        {promo.validUntil}
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white hover:bg-secondary hover:text-primary transition-all duration-300 font-semibold text-sm py-2">
                        <Gift className="w-3 h-3 mr-1" />
                        Claim Offer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Promo Codes Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              🎫 Promo Codes
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              Exclusive Discount Codes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Use these special codes at checkout for additional savings on our premium grooming services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                code: "WELCOME20",
                discount: "20% Off First Visit",
                description: "New customers only - perfect for your first experience",
                expiry: "Dec 31, 2025",
                color: "from-blue-500 to-blue-600"
              },
              {
                code: "STUDENT15",
                discount: "15% Off Services",
                description: "Valid student ID required - grooming on a budget",
                expiry: "Ongoing",
                color: "from-green-500 to-green-600"
              },
              {
                code: "LOYALTY10",
                discount: "10% Off Any Service",
                description: "For loyalty program members - rewards for regulars",
                expiry: "Ongoing",
                color: "from-purple-500 to-purple-600"
              },
              {
                code: "FLASH50",
                discount: "$50 Off Packages",
                description: "Premium packages only - luxury at a great price",
                expiry: "Dec 15, 2025",
                color: "from-red-500 to-red-600"
              },
            ].map((promo, index) => (
              <Card key={promo.code} className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg animate-slide-up hover:-translate-y-2 bg-white overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`bg-gradient-to-r ${promo.color} p-6 text-white`}>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
                    <code className="text-2xl font-mono font-bold text-white bg-black/30 px-4 py-2 rounded border border-white/30 shadow-lg">
                      {promo.code}
                    </code>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{promo.discount}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{promo.description}</p>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4 font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    Expires: {promo.expiry}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-semibold"
                    onClick={() => navigator.clipboard.writeText(promo.code)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              * Terms and conditions apply. Cannot be combined with other offers.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              🛍️ Premium Products
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              Professional Beauty Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our curated selection of professional-grade grooming products for the ultimate at-home experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {[
              {
                name: "Luxury Shampoo",
                price: "$45",
                description: "Organic ingredients for healthy, voluminous hair with professional salon results",
                category: "Hair Care",
                image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                badge: "Bestseller"
              },
              {
                name: "Beard Oil",
                price: "$35",
                description: "Nourishing blend of natural oils for soft, manageable beard care",
                category: "Beard Care",
                image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
                badge: "Professional"
              },
              {
                name: "Styling Wax",
                price: "$28",
                description: "Professional hold and natural shine for all hair types and styles",
                category: "Styling",
                image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                badge: "Trending"
              },
              {
                name: "Aftershave Balm",
                price: "$40",
                description: "Soothing and moisturizing balm that calms skin after shaving",
                category: "Skin Care",
                image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                badge: "New Arrival"
              },
            ].map((product, index) => (
              <Card key={product.name} className="text-center hover:shadow-2xl transition-all duration-500 animate-slide-up overflow-hidden bg-white hover:-translate-y-2 border-0 shadow-lg" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={`${product.name} product`}
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-primary font-semibold shadow-lg">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-secondary text-primary font-semibold shadow-lg">
                      {product.badge}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-primary text-lg font-bold group-hover:text-secondary transition-colors duration-300">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-secondary font-bold text-lg">
                    {product.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.description}</p>
                  <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-semibold">
                    <Link href="/products">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary px-8 py-3 text-lg font-semibold">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              ⭐ Client Reviews
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from our satisfied clients who trust us with their grooming needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John D.",
                rating: 5,
                text: "Best barber in town! Always perfect cuts and exceptional service. The attention to detail is unmatched.",
                role: "Regular Client",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              {
                name: "Mike R.",
                rating: 5,
                text: "Professional service and great atmosphere. The staff is knowledgeable and the products are top-notch.",
                role: "Business Professional",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              {
                name: "Alex T.",
                rating: 5,
                text: "Worth every penny. Highly recommend! The premium experience and quality service keep me coming back.",
                role: "Fashion Designer",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
            ].map((testimonial, index) => (
              <Card key={testimonial.name} className="hover:shadow-2xl transition-all duration-500 animate-slide-up bg-white hover:-translate-y-2 border-0 shadow-lg overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-primary text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 leading-relaxed text-base italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
            <BookingModal>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold">
                Join Our Happy Clients
              </Button>
            </BookingModal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">Premium Cuts</h3>
              <p className="text-gray-300">Luxury grooming for discerning gentlemen.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Haircuts</li>
                <li>Beard Grooming</li>
                <li>Premium Packages</li>
                <li>Consultations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Locations</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Downtown</li>
                <li>Midtown</li>
                <li>Uptown</li>
                <li>Suburbs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@premiumcuts.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>8 Locations Citywide</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Premium Cuts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
