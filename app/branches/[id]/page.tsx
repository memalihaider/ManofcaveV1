import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/Header";
import { MapPin, Star, Clock, Phone, User, Scissors, Award } from "lucide-react";
import { BookingModal } from "@/components/booking/BookingModal";

const branchData = {
  downtown: {
    name: "Downtown Premium",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    rating: 4.9,
    reviewCount: 247,
    description: "Our flagship location in the heart of downtown, featuring state-of-the-art equipment and our most experienced barbers.",
    images: ["/api/placeholder/800/400", "/api/placeholder/800/400", "/api/placeholder/800/400"],
    barbers: [
      { name: "Mike Johnson", role: "Master Barber", rating: 4.9, specialties: ["Fades", "Classic Cuts"], experience: "8 years" },
      { name: "Sarah Chen", role: "Stylist", rating: 4.8, specialties: ["Color", "Styling"], experience: "6 years" },
      { name: "Alex Rodriguez", role: "Barber", rating: 4.7, specialties: ["Beard", "Modern Cuts"], experience: "5 years" },
    ],
    services: [
      { name: "Classic Haircut", price: 35, duration: "30 min", description: "Traditional cut with precision styling" },
      { name: "Premium Package", price: 65, duration: "60 min", description: "Haircut, beard trim, and hot towel service" },
      { name: "Beard Grooming", price: 25, duration: "20 min", description: "Professional beard trimming and shaping" },
    ],
    reviews: [
      { name: "John D.", rating: 5, text: "Best haircut I've ever had. Mike is amazing!", date: "2024-11-25" },
      { name: "Mike R.", rating: 5, text: "Great atmosphere and professional service.", date: "2024-11-20" },
      { name: "Alex T.", rating: 5, text: "Worth every penny. Highly recommend!", date: "2024-11-18" },
    ],
  },
  // Add other branches...
};

export default function BranchPage({ params }: { params: { id: string } }) {
  const branch = branchData[params.id as keyof typeof branchData];

  if (!branch) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Branch Not Found</h1>
          <p className="text-muted-foreground mb-8">The branch you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/branches">View All Branches</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-br from-primary via-primary to-secondary">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center text-white">
              <h1 className="text-5xl font-serif font-bold mb-4">{branch.name}</h1>
              <p className="text-xl mb-6 max-w-2xl mx-auto">{branch.description}</p>
              <div className="flex items-center justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-secondary text-secondary" />
                  <span>{branch.rating} ({branch.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{branch.address}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 relative z-20 mb-12">
            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <h3 className="font-semibold text-primary mb-2">Hours</h3>
              <p className="text-sm text-muted-foreground">Mon-Sat: 9AM-7PM<br />Sun: 10AM-5PM</p>
            </Card>
            <Card className="p-6 text-center">
              <Phone className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <h3 className="font-semibold text-primary mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">{branch.phone}</p>
            </Card>
            <Card className="p-6 text-center">
              <BookingModal>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary">
                  Book Appointment
                </Button>
              </BookingModal>
            </Card>
          </div>

          {/* Gallery */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branch.images.map((image, index) => (
                <div key={index} className="aspect-video bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </section>

          {/* Barbers */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Meet Our Barbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branch.barbers.map((barber) => (
                <Card key={barber.name} className="text-center">
                  <CardHeader>
                    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary">{barber.name}</CardTitle>
                    <CardDescription className="text-secondary font-medium">{barber.role}</CardDescription>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="text-sm">{barber.rating}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Experience:</strong> {barber.experience}</p>
                      <p className="text-sm"><strong>Specialties:</strong> {barber.specialties.join(", ")}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Services & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branch.services.map((service) => (
                <Card key={service.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-secondary">{service.name}</CardTitle>
                    <CardDescription className="text-accent font-semibold text-lg">
                      ${service.price} • {service.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branch.reviews.map((review, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <CardDescription className="text-sm">"{review.text}"</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-primary">- {review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-serif font-bold mb-4">
                  Ready for Your Premium Experience?
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Book your appointment at {branch.name} today
                </p>
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}