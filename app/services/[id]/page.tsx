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
import { Scissors, Star, ArrowLeft, Heart, Share2, Clock, MapPin, Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock service data - in real app, this would come from API/database
  const services = [
    {
      id: 1,
      name: "Classic Haircut",
      category: "haircut",
      price: 35,
      duration: "30 min",
      description: "Traditional cut with precision styling",
      longDescription: "Experience our signature Classic Haircut, where traditional barbering meets modern precision. Our skilled stylists use professional techniques to create the perfect cut tailored to your face shape, hair type, and personal style. This timeless service includes a thorough consultation, expert cutting, and finishing touches for a polished look.",
      rating: 4.8,
      reviews: 124,
      branches: ["downtown", "midtown", "uptown", "suburban"],
      images: [
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
      ],
      benefits: ["Precision cutting", "Face shape consultation", "Professional styling", "Long-lasting results"],
      includes: ["Hair consultation", "Professional haircut", "Precision styling", "Finishing touches"],
      preparation: ["Arrive with clean, dry hair", "Bring reference photos if desired", "Wear comfortable clothing"]
    },
    {
      id: 2,
      name: "Premium Haircut & Style",
      category: "haircut",
      price: 55,
      duration: "45 min",
      description: "Advanced styling with premium products",
      longDescription: "Elevate your look with our Premium Haircut & Style service. This comprehensive treatment combines expert cutting techniques with advanced styling using professional-grade products. Perfect for those seeking a sophisticated, modern look with lasting hold and natural movement.",
      rating: 4.9,
      reviews: 89,
      branches: ["downtown", "uptown"],
      images: [
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      ],
      benefits: ["Advanced styling techniques", "Premium product application", "Long-lasting hold", "Natural movement"],
      includes: ["Detailed consultation", "Precision haircut", "Professional styling", "Premium product application"],
      preparation: ["Come with clean hair", "Bring inspiration photos", "Discuss desired style beforehand"]
    },
    {
      id: 3,
      name: "Beard Trim & Shape",
      category: "beard",
      price: 25,
      duration: "20 min",
      description: "Precision beard trimming and shaping",
      longDescription: "Maintain your facial hair with professional precision. Our Beard Trim & Shape service ensures clean lines, balanced proportions, and a well-groomed appearance. Using professional tools and techniques, we create the perfect beard shape for your face.",
      rating: 4.7,
      reviews: 156,
      branches: ["downtown", "midtown", "uptown", "suburban"],
      images: [
        "https://images.unsplash.com/photo-1622296089863-9a4bf8bb63df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ],
      benefits: ["Precision trimming", "Professional shaping", "Clean lines", "Balanced proportions"],
      includes: ["Beard consultation", "Precision trimming", "Professional shaping", "Finishing touches"],
      preparation: ["Grow beard to desired length", "Arrive with clean face", "Communicate preferred style"]
    },
    {
      id: 4,
      name: "Hot Towel Shave",
      category: "beard",
      price: 45,
      duration: "30 min",
      description: "Traditional straight razor shave with hot towel",
      longDescription: "Indulge in the ultimate grooming experience with our traditional Hot Towel Shave. This luxurious service combines the art of straight razor shaving with soothing hot towel treatments for the closest, most comfortable shave possible.",
      rating: 4.9,
      reviews: 78,
      branches: ["downtown", "uptown"],
      images: [
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      ],
      benefits: ["Closest shave possible", "Luxurious experience", "Skin soothing", "Traditional technique"],
      includes: ["Hot towel treatment", "Pre-shave oil application", "Straight razor shave", "After-shave care"],
      preparation: ["Arrive with stubble (not too long)", "Clean face", "Relax and enjoy the experience"]
    },
    {
      id: 5,
      name: "Facial Treatment",
      category: "facial",
      price: 65,
      duration: "45 min",
      description: "Deep cleansing facial with premium products",
      longDescription: "Revitalize your skin with our comprehensive Facial Treatment. This professional service includes deep cleansing, exfoliation, extraction, and nourishing masks to leave your skin glowing, refreshed, and healthy.",
      rating: 4.8,
      reviews: 92,
      branches: ["midtown", "uptown"],
      images: [
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ],
      benefits: ["Deep cleansing", "Skin revitalization", "Professional extraction", "Nourishing treatment"],
      includes: ["Skin consultation", "Deep cleansing", "Exfoliation", "Extraction", "Nourishing mask"],
      preparation: ["Arrive with clean face", "Remove makeup if applicable", "Discuss skin concerns"]
    },
    {
      id: 6,
      name: "Scalp Massage",
      category: "massage",
      price: 40,
      duration: "25 min",
      description: "Relaxing scalp and neck massage",
      longDescription: "Unwind with our therapeutic Scalp Massage service. This relaxing treatment combines traditional massage techniques with modern pressure point therapy to relieve tension, improve circulation, and promote healthy hair growth.",
      rating: 4.6,
      reviews: 67,
      branches: ["downtown", "midtown", "uptown"],
      images: [
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ],
      benefits: ["Stress relief", "Improved circulation", "Tension reduction", "Relaxation"],
      includes: ["Scalp massage", "Neck and shoulder massage", "Pressure point therapy", "Relaxing atmosphere"],
      preparation: ["Arrive relaxed", "Communicate pressure preferences", "Remove jewelry if desired"]
    },
    {
      id: 7,
      name: "Complete Grooming Package",
      category: "packages",
      price: 85,
      duration: "90 min",
      description: "Haircut, beard trim, and facial treatment",
      longDescription: "Experience the ultimate grooming transformation with our Complete Grooming Package. This comprehensive service combines our most popular treatments for a full head-to-toe refresh that leaves you looking and feeling your absolute best.",
      rating: 4.9,
      reviews: 134,
      branches: ["downtown", "uptown"],
      images: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ],
      benefits: ["Complete transformation", "Multiple treatments", "Professional results", "Time-saving"],
      includes: ["Haircut", "Beard trim", "Facial treatment", "Hot towel refresh"],
      preparation: ["Arrive with clean hair and face", "Wear comfortable clothing", "Discuss all desired services"]
    },
    {
      id: 8,
      name: "Executive Package",
      category: "packages",
      price: 120,
      duration: "120 min",
      description: "Complete grooming experience with massage",
      longDescription: "Indulge in our most luxurious grooming experience with the Executive Package. This premium service combines all our signature treatments with additional massage therapy for the ultimate relaxation and transformation experience.",
      rating: 5.0,
      reviews: 45,
      branches: ["uptown"],
      images: [
        "https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      ],
      benefits: ["Ultimate luxury experience", "Complete relaxation", "Premium treatments", "Executive-level service"],
      includes: ["All grooming services", "Scalp massage", "Hot towel treatments", "Premium refreshments"],
      preparation: ["Schedule ample time", "Arrive relaxed", "Communicate all preferences"]
    },
  ];

  const service = services.find(s => s.id.toString() === params.id);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
            <Link href="/services">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-primary">Services</Link>
            <span>/</span>
            <span className="text-primary font-medium">{service.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={service.images[currentImageIndex]}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              {service.images.length > 1 && (
                <>
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
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {service.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {service.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${service.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">{service.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(service.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {service.rating} ({service.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  ${service.price}
                </Badge>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {service.duration}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">About This Service</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{service.longDescription}</p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Benefits</h3>
              <div className="grid grid-cols-2 gap-2">
                {service.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="text-xl font-semibold mb-3">What's Included</h3>
              <ul className="space-y-2">
                {service.includes.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <Scissors className="w-4 h-4 mr-2 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Preparation</h3>
              <ul className="space-y-2">
                {service.preparation.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <User className="w-4 h-4 mr-2 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Available Branches */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Available at</h3>
              <div className="flex flex-wrap gap-2">
                {service.branches.map((branch) => (
                  <Badge key={branch} variant="outline" className="capitalize">
                    <MapPin className="w-3 h-3 mr-1" />
                    {branch}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button size="lg" className="flex-1">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="w-5 h-5 mr-2" />
                Save
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-primary mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services
              .filter(s => s.id !== service.id && s.category === service.category)
              .slice(0, 3)
              .map((relatedService) => (
                <Card key={relatedService.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={relatedService.images[0]}
                      alt={relatedService.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {relatedService.name}
                    </CardTitle>
                    <CardDescription>{relatedService.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">${relatedService.price}</Badge>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {relatedService.duration}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{relatedService.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}