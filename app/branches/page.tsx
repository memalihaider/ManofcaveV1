import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/Header";
import { MapPin, Star, Clock, Phone } from "lucide-react";
import { BookingModal } from "@/components/booking/BookingModal";

const branches = [
  {
    id: "downtown",
    name: "Downtown Premium",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    rating: 4.9,
    reviews: 247,
    image: "/api/placeholder/400/250",
    services: ["Haircuts", "Beard Grooming", "Premium Packages"],
    hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    features: ["VIP Lounge", "Free WiFi", "Beverages"],
  },
  {
    id: "midtown",
    name: "Midtown Elite",
    address: "456 Oak Avenue, Midtown",
    phone: "(555) 234-5678",
    rating: 4.8,
    reviews: 189,
    image: "/api/placeholder/400/250",
    services: ["Haircuts", "Beard Grooming", "Color Services"],
    hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    features: ["Private Rooms", "Premium Products", "Parking"],
  },
  {
    id: "uptown",
    name: "Uptown Luxury",
    address: "789 Pine Road, Uptown",
    phone: "(555) 345-6789",
    rating: 4.9,
    reviews: 312,
    image: "/api/placeholder/400/250",
    services: ["Haircuts", "Beard Grooming", "Premium Packages", "Color"],
    hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    features: ["Spa Services", "VIP Treatment", "Valet Parking"],
  },
  {
    id: "suburban",
    name: "Suburban Comfort",
    address: "321 Elm Street, Suburbs",
    phone: "(555) 456-7890",
    rating: 4.7,
    reviews: 156,
    image: "/api/placeholder/400/250",
    services: ["Haircuts", "Beard Grooming", "Family Services"],
    hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    features: ["Family Friendly", "Ample Parking", "Quick Service"],
  },
];

export default function Branches() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Our Premium Locations
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience luxury grooming at any of our 8 strategically located branches across the city
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((branch) => (
              <Card key={branch.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-secondary to-accent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-primary">
                      ⭐ {branch.rating} ({branch.reviews})
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{branch.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {branch.address}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {branch.phone}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {branch.hours}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {branch.services.map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {branch.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs bg-secondary/10 text-secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <BookingModal>
                        <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-primary">
                          Book Now
                        </Button>
                      </BookingModal>
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/branches/${branch.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-serif font-bold mb-4">
                  Can't Find a Convenient Location?
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  We're expanding! Contact us to suggest new locations in your area.
                </p>
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}