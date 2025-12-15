import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/Header";
import { MapPin, Star, Clock, Phone, Mail, Car, Wifi, Coffee, Users, Award } from "lucide-react";

const branches = [
  {
    id: "alwahda",
    name: "Al Wahda Mall",
    address: "Al Wahda Mall, Abu Dhabi, UAE",
    phone: "+971 2 410 9999",
    email: "alwahda@manofcave.com",
    rating: 4.9,
    reviews: 247,
    coordinates: { lat: 24.4139, lng: 54.5454 },
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    services: ["Haircuts", "Beard Grooming", "Premium Packages", "Hair Color"],
    hours: "Sat-Thu: 10AM-10PM, Fri: 2PM-10PM",
    features: ["VIP Lounge", "Free WiFi", "Complimentary Beverages", "Valet Parking"],
    manager: "Ahmed Al-Rashid",
    established: "2019",
    capacity: "12 stations",
    specialties: ["Traditional Cuts", "Modern Styling", "Luxury Treatments"]
  },
  {
    id: "madinat",
    name: "Madinat Zayed",
    address: "Madinat Zayed Shopping Center, Abu Dhabi, UAE",
    phone: "+971 2 410 8888",
    email: "madinat@manofcave.com",
    rating: 4.8,
    reviews: 189,
    coordinates: { lat: 24.4322, lng: 54.6081 },
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    services: ["Haircuts", "Beard Grooming", "Color Services", "Scalp Treatments"],
    hours: "Sat-Thu: 9AM-9PM, Fri: 4PM-10PM",
    features: ["Private Rooms", "Premium Products", "Ample Parking", "Express Service"],
    manager: "Mohammed Al-Farsi",
    established: "2020",
    capacity: "8 stations",
    specialties: ["Executive Cuts", "Beard Sculpting", "Color Correction"]
  },
  {
    id: "khalifa",
    name: "Khalifa City",
    address: "Khalifa City A, Abu Dhabi, UAE",
    phone: "+971 2 410 7777",
    email: "khalifa@manofcave.com",
    rating: 4.9,
    reviews: 312,
    coordinates: { lat: 24.4181, lng: 54.6031 },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    services: ["Haircuts", "Beard Grooming", "Premium Packages", "Color", "Spa Services"],
    hours: "Sat-Thu: 10AM-10PM, Fri: 2PM-10PM",
    features: ["Spa Services", "VIP Treatment", "Valet Parking", "Lounge Area"],
    manager: "Omar Al-Mansoori",
    established: "2018",
    capacity: "15 stations",
    specialties: ["Luxury Grooming", "Spa Treatments", "VIP Experience"]
  },
  {
    id: "marina-mall",
    name: "Marina Mall",
    address: "Marina Mall, Abu Dhabi, UAE",
    phone: "+971 2 410 6666",
    email: "marina@manofcave.com",
    rating: 4.7,
    reviews: 156,
    coordinates: { lat: 24.4958, lng: 54.3853 },
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
    services: ["Haircuts", "Beard Grooming", "Family Services", "Quick Cuts"],
    hours: "Sat-Thu: 10AM-10PM, Fri: 2PM-10PM",
    features: ["Family Friendly", "Ample Parking", "Quick Service", "Kids Area"],
    manager: "Fatima Al-Zahra",
    established: "2021",
    capacity: "10 stations",
    specialties: ["Family Grooming", "Quick Service", "Traditional Cuts"]
  },
  {
    id: "wtc",
    name: "World Trade Center",
    address: "World Trade Center Mall, Abu Dhabi, UAE",
    phone: "+971 2 410 5555",
    email: "wtc@manofcave.com",
    rating: 4.8,
    reviews: 203,
    coordinates: { lat: 24.4945, lng: 54.3574 },
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    services: ["Haircuts", "Beard Grooming", "Business Packages", "Color Services"],
    hours: "Sat-Thu: 8AM-8PM, Fri: 2PM-8PM",
    features: ["Business Hours", "Express Service", "Meeting Rooms", "Corporate Discounts"],
    manager: "Sultan Al-Hamad",
    established: "2019",
    capacity: "12 stations",
    specialties: ["Business Cuts", "Executive Styling", "Corporate Packages"]
  },
  {
    id: "salam-street",
    name: "Salam Street",
    address: "Salam Street, Abu Dhabi, UAE",
    phone: "+971 2 410 4444",
    email: "salam@manofcave.com",
    rating: 4.6,
    reviews: 134,
    coordinates: { lat: 24.4667, lng: 54.3667 },
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    services: ["Haircuts", "Beard Grooming", "Traditional Services", "Scalp Massage"],
    hours: "Sat-Thu: 9AM-9PM, Fri: 5PM-11PM",
    features: ["Traditional Atmosphere", "Cultural Experience", "Late Hours", "Authentic Service"],
    manager: "Rashid Al-Khalifa",
    established: "2022",
    capacity: "6 stations",
    specialties: ["Traditional Grooming", "Cultural Experience", "Authentic Techniques"]
  }
];

export default function BranchesPage() {
  return (
    <div className="min-h bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative  flex items-center justify-center overflow-hidden">
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
              🗺️ Our Locations
            </Badge>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
              Premium Locations
            </h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          </div>

          

          {/* Stats */}
          
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary font-semibold px-4 py-2 mb-4">
              🏪 Our Branches
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 animate-slide-up">
              Premium Locations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience world-class grooming services at any of our premium locations across Abu Dhabi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch, index) => (
              <Card key={branch.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg animate-slide-up overflow-hidden bg-white hover:-translate-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-secondary/90 text-primary font-semibold shadow-lg backdrop-blur-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {branch.rating}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{branch.name}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {branch.address}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-primary" />
                        {branch.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-primary" />
                        {branch.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        {branch.hours}
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Services</h4>
                      <div className="flex flex-wrap gap-1">
                        {branch.services.slice(0, 3).map((service) => (
                          <Badge key={service} variant="outline" className="text-xs border-primary/20 text-primary">
                            {service}
                          </Badge>
                        ))}
                        {branch.services.length > 3 && (
                          <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                            +{branch.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {branch.features.slice(0, 4).map((feature) => (
                          <div key={feature} className="flex items-center text-xs text-gray-600">
                            {feature === "VIP Lounge" && <Award className="w-3 h-3 mr-1 text-secondary" />}
                            {feature === "Free WiFi" && <Wifi className="w-3 h-3 mr-1 text-primary" />}
                            {feature === "Complimentary Beverages" && <Coffee className="w-3 h-3 mr-1 text-accent" />}
                            {feature === "Valet Parking" && <Car className="w-3 h-3 mr-1 text-green-500" />}
                            {feature === "Private Rooms" && <Users className="w-3 h-3 mr-1 text-purple-500" />}
                            {feature === "Premium Products" && <Award className="w-3 h-3 mr-1 text-secondary" />}
                            {feature === "Ample Parking" && <Car className="w-3 h-3 mr-1 text-green-500" />}
                            {feature === "Express Service" && <Clock className="w-3 h-3 mr-1 text-red-500" />}
                            {feature === "Spa Services" && <Award className="w-3 h-3 mr-1 text-secondary" />}
                            {feature === "VIP Treatment" && <Award className="w-3 h-3 mr-1 text-secondary" />}
                            {feature === "Family Friendly" && <Users className="w-3 h-3 mr-1 text-purple-500" />}
                            {feature === "Quick Service" && <Clock className="w-3 h-3 mr-1 text-red-500" />}
                            {feature === "Business Hours" && <Clock className="w-3 h-3 mr-1 text-red-500" />}
                            {feature === "Meeting Rooms" && <Users className="w-3 h-3 mr-1 text-purple-500" />}
                            {feature === "Corporate Discounts" && <Award className="w-3 h-3 mr-1 text-secondary" />}
                            {feature === "Traditional Atmosphere" && <Award className="w-3 h-3 mr-1 text-secondary" />}
                            {feature === "Cultural Experience" && <Users className="w-3 h-3 mr-1 text-purple-500" />}
                            {feature === "Late Hours" && <Clock className="w-3 h-3 mr-1 text-red-500" />}
                            {feature === "Authentic Service" && <Award className="w-3 h-3 mr-1 text-secondary" />}
                            {feature === "Lounge Area" && <Users className="w-3 h-3 mr-1 text-purple-500" />}
                            {feature === "Kids Area" && <Users className="w-3 h-3 mr-1 text-purple-500" />}
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(branch.rating)
                                  ? "fill-secondary text-secondary"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {branch.rating} ({branch.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Link href={`tel:${branch.phone}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Now
                        </Button>
                      </Link>
                      <Link 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
                          <MapPin className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-secondary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Visit Your Nearest Branch
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience premium grooming services at any of our locations. Our expert barbers are ready to serve you with exceptional care.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="tel:+97124109999">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now: +971 2 410 9999
              </Button>
            </Link>
            <Link href="/booking">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 text-lg backdrop-blur-sm bg-white/10 shadow-2xl transition-all duration-300"
              >
                Book Online
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}