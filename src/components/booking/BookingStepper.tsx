"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Scissors, User, Calendar, CheckCircle, CreditCard } from "lucide-react";
import { useBookingStore } from "@/stores/booking.store";

const services = [
  { id: "haircut-&-styling", name: "Haircut & Styling", price: 35, duration: "30-45 min" },
  { id: "beard-grooming", name: "Beard Grooming", price: 25, duration: "20-30 min" },
  { id: "premium-packages", name: "Premium Packages", price: 65, duration: "60-90 min" },
  { id: "hair-coloring", name: "Hair Coloring", price: 45, duration: "60 min" },
  { id: "facial-treatment", name: "Facial Treatment", price: 35, duration: "45 min" },
  { id: "hot-towel-shave", name: "Hot Towel Shave", price: 30, duration: "40 min" },
  { id: "hair-styling", name: "Hair Styling", price: 15, duration: "20 min" },
  { id: "scalp-treatment", name: "Scalp Treatment", price: 40, duration: "30 min" },
  { id: "eyebrow-shaping", name: "Eyebrow Shaping", price: 20, duration: "15 min" },
  { id: "neck-&-shoulder-massage", name: "Neck & Shoulder Massage", price: 25, duration: "25 min" },
  { id: "deep-conditioning", name: "Deep Conditioning", price: 30, duration: "35 min" },
  { id: "express-service", name: "Express Service", price: 20, duration: "15 min" },
];

const products = [
  { id: "premium-hair-pomade", name: "Premium Hair Pomade", price: 18, category: "Styling", description: "Professional-grade styling product for all hair types" },
  { id: "beard-oil-balm-kit", name: "Beard Oil & Balm Kit", price: 32, category: "Beard Care", description: "Complete beard care set with natural oils" },
  { id: "after-shave-soother", name: "After Shave Soother", price: 22, category: "Skincare", description: "Calming lotion for sensitive skin after shaving" },
  { id: "hair-growth-serum", name: "Hair Growth Serum", price: 45, category: "Treatment", description: "Advanced formula to promote healthy hair growth" },
  { id: "scalp-scrub", name: "Scalp Scrub", price: 28, category: "Treatment", description: "Exfoliating treatment for healthy scalp" },
  { id: "styling-wax", name: "Professional Styling Wax", price: 16, category: "Styling", description: "Strong hold wax for textured styles" },
  { id: "beard-trimmer", name: "Precision Beard Trimmer", price: 35, category: "Tools", description: "Professional trimmer with multiple guards" },
  { id: "shaving-cream", name: "Luxury Shaving Cream", price: 24, category: "Skincare", description: "Rich, moisturizing shaving cream" },
];

const barbers = [
  { id: "any", name: "Any Available Barber", rating: 4.8, specialties: ["All Services"] },
  { id: "mike", name: "Mike Johnson", rating: 4.9, specialties: ["Haircuts", "Fades"] },
  { id: "alex", name: "Alex Rodriguez", rating: 4.7, specialties: ["Beard", "Styling"] },
  { id: "david", name: "David Chen", rating: 4.8, specialties: ["Premium", "Color"] },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
];

export function BookingStepper({ selectedServiceId }: { selectedServiceId?: string }) {
  const {
    bookingData,
    currentStep,
    updateBookingData,
    nextStep,
    prevStep,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Pre-select service if provided and skip to barber selection
  useEffect(() => {
    if (selectedServiceId && !bookingData.service) {
      updateBookingData("service", selectedServiceId);
      updateBookingData("bookingType", "services");
      // Skip to barber selection if service is pre-selected
      if (currentStep === 1) {
        nextStep();
      }
    }
  }, [selectedServiceId, bookingData.service, updateBookingData, currentStep, nextStep]);

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        setBookingResult(result);
        alert(`Booking confirmed! Your booking ID is: ${result.bookingId}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isServicePreSelected = !!selectedServiceId;

  // Dynamic steps based on booking type
  const getSteps = () => {
    const baseSteps = [];

    if (!isServicePreSelected) {
      baseSteps.push({ id: 1, title: "Type", icon: Scissors });
    }

    if (bookingData.bookingType === 'services' || bookingData.bookingType === 'both') {
      if (!isServicePreSelected) {
        baseSteps.push({ id: baseSteps.length + 1, title: "Service", icon: Scissors });
      }
      baseSteps.push({ id: baseSteps.length + 1, title: "Barber", icon: User });
      baseSteps.push({ id: baseSteps.length + 1, title: "Schedule", icon: Calendar });
    }

    if (bookingData.bookingType === 'products' || bookingData.bookingType === 'both') {
      baseSteps.push({ id: baseSteps.length + 1, title: "Products", icon: Scissors });
    }

    baseSteps.push({ id: baseSteps.length + 1, title: "Details", icon: CheckCircle });
    baseSteps.push({ id: baseSteps.length + 1, title: "Payment", icon: CreditCard });

    return baseSteps;
  };

  const steps = getSteps();

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8 flex-shrink-0">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
              currentStep >= step.id
                ? "bg-secondary text-primary"
                : "bg-gray-200 text-gray-400"
            }`}>
              <step.icon className="w-6 h-6" />
            </div>
            <span className={`text-sm font-medium ${
              currentStep >= step.id ? "text-primary" : "text-gray-400"
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content - Scrollable */}
      <div className="flex-1 overflow-y-auto mb-8">
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {(() => {
                const currentStepTitle = steps[currentStep - 1]?.title;
                switch (currentStepTitle) {
                  case "Type":
                    return "Choose what you'd like to book";
                  case "Service":
                    return "Select the service you need";
                  case "Barber":
                    return "Choose your preferred barber";
                  case "Schedule":
                    return "Pick your preferred date and time";
                  case "Products":
                    return "Select products to purchase";
                  case "Details":
                    return "Enter your contact information";
                  case "Payment":
                    return "Choose your payment method";
                  default:
                    return "";
                }
              })()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const currentStepTitle = steps[currentStep - 1]?.title;
              switch (currentStepTitle) {
                case "Type":
                  return (
                    <div className="space-y-6">
                      <RadioGroup
                        value={bookingData.bookingType || ""}
                        onValueChange={(value) => updateBookingData("bookingType", value)}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="services" id="services" />
                          <Label htmlFor="services" className="flex-1 cursor-pointer">
                            <div className="p-4 border rounded-lg hover:bg-gray-50">
                              <h3 className="font-semibold">Services Only</h3>
                              <p className="text-sm text-gray-600">Book a barber service appointment</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="products" id="products" />
                          <Label htmlFor="products" className="flex-1 cursor-pointer">
                            <div className="p-4 border rounded-lg hover:bg-gray-50">
                              <h3 className="font-semibold">Products Only</h3>
                              <p className="text-sm text-gray-600">Purchase grooming products</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both" className="flex-1 cursor-pointer">
                            <div className="p-4 border rounded-lg hover:bg-gray-50">
                              <h3 className="font-semibold">Services & Products</h3>
                              <p className="text-sm text-gray-600">Book a service and purchase products together</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  );
                case "Service":
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              bookingData.service === service.id
                                ? "border-secondary bg-secondary/10"
                                : "border-gray-200 hover:border-secondary"
                            }`}
                            onClick={() => updateBookingData("service", service.id)}
                          >
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.duration}</p>
                            <p className="text-lg font-bold text-secondary">${service.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                case "Barber":
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {barbers.map((barber) => (
                          <div
                            key={barber.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              bookingData.barber === barber.id
                                ? "border-secondary bg-secondary/10"
                                : "border-gray-200 hover:border-secondary"
                            }`}
                            onClick={() => updateBookingData("barber", barber.id)}
                          >
                            <h3 className="font-semibold">{barber.name}</h3>
                            <p className="text-sm text-gray-600">⭐ {barber.rating}</p>
                            <p className="text-sm text-gray-500">{barber.specialties.join(", ")}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                case "Schedule":
                  return (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="date">Select Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date || ""}
                          onChange={(e) => updateBookingData("date", e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Select Time</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={bookingData.time === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateBookingData("time", time)}
                              className={bookingData.time === time ? "bg-secondary text-primary" : ""}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                case "Products":
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              bookingData.products?.includes(product.id)
                                ? "border-secondary bg-secondary/10"
                                : "border-gray-200 hover:border-secondary"
                            }`}
                            onClick={() => {
                              const currentProducts = bookingData.products || [];
                              const newProducts = currentProducts.includes(product.id)
                                ? currentProducts.filter(id => id !== product.id)
                                : [...currentProducts, product.id];
                              updateBookingData("products", newProducts);
                            }}
                          >
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.category}</p>
                            <p className="text-sm text-gray-500">{product.description}</p>
                            <p className="text-lg font-bold text-secondary">${product.price}</p>
                          </div>
                        ))}
                      </div>
                      {bookingData.products && bookingData.products.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Selected Products:</h4>
                          <ul className="space-y-1">
                            {bookingData.products.map(productId => {
                              const product = products.find(p => p.id === productId);
                              return product ? (
                                <li key={productId} className="text-sm">
                                  {product.name} - ${product.price}
                                </li>
                              ) : null;
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                case "Details":
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={bookingData.name || ""}
                            onChange={(e) => updateBookingData("name", e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={bookingData.email || ""}
                            onChange={(e) => updateBookingData("email", e.target.value)}
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={bookingData.phone || ""}
                            onChange={(e) => updateBookingData("phone", e.target.value)}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>
                  );
                case "Payment":
                  return (
                    <div className="space-y-6">
                      <RadioGroup
                        value={bookingData.paymentMethod || ""}
                        onValueChange={(value) => updateBookingData("paymentMethod", value)}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">
                            <div className="p-4 border rounded-lg hover:bg-gray-50">
                              <h3 className="font-semibold">Credit/Debit Card</h3>
                              <p className="text-sm text-gray-600">Pay securely with your card</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex-1 cursor-pointer">
                            <div className="p-4 border rounded-lg hover:bg-gray-50">
                              <h3 className="font-semibold">Cash</h3>
                              <p className="text-sm text-gray-600">Pay in person at the salon</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                      {bookingData.bookingType && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-4">Booking Summary</h4>
                          <div className="space-y-2">
                            {bookingData.bookingType === 'services' || bookingData.bookingType === 'both' ? (
                              <>
                                <p><strong>Service:</strong> {services.find(s => s.id === bookingData.service)?.name}</p>
                                <p><strong>Barber:</strong> {barbers.find(b => b.id === bookingData.barber)?.name}</p>
                                <p><strong>Date:</strong> {bookingData.date}</p>
                                <p><strong>Time:</strong> {bookingData.time}</p>
                              </>
                            ) : null}
                            {bookingData.bookingType === 'products' || bookingData.bookingType === 'both' ? (
                              <div>
                                <p><strong>Products:</strong></p>
                                <ul className="ml-4">
                                  {bookingData.products?.map(productId => {
                                    const product = products.find(p => p.id === productId);
                                    return product ? (
                                      <li key={productId}>{product.name} - ${product.price}</li>
                                    ) : null;
                                  })}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                default:
                  return <div>Step content not available</div>;
              }
            })()}
          </CardContent>
      </Card>
      </div>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="flex justify-between mt-8 flex-shrink-0">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={currentStep === steps.length ? handleBookingSubmit : nextStep}
          disabled={isSubmitting || (() => {
            const currentStepTitle = steps[currentStep - 1]?.title;
            switch (currentStepTitle) {
              case "Type":
                return !bookingData.bookingType;
              case "Service":
                return !bookingData.service;
              case "Barber":
                return !bookingData.barber;
              case "Schedule":
                return !bookingData.date || !bookingData.time;
              case "Products":
                return bookingData.bookingType === 'products' && bookingData.products.length === 0;
              case "Details":
                return !bookingData.name || !bookingData.email || !bookingData.phone;
              case "Payment":
                return !bookingData.paymentMethod;
              default:
                return false;
            }
          })()}
          className="bg-secondary hover:bg-secondary/90 text-primary"
        >
          {isSubmitting ? "Processing..." : currentStep === steps.length ? "Complete Booking" : "Next"}
        </Button>
      </div>
    </div>
  );
}
