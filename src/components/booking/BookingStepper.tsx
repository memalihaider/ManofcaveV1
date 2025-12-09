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

  // Pre-select service if provided
  useEffect(() => {
    if (selectedServiceId && !bookingData.service) {
      updateBookingData("service", selectedServiceId);
    }
  }, [selectedServiceId, bookingData.service, updateBookingData]);

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

  const steps = [
    { id: 1, title: "Service", icon: Scissors },
    { id: 2, title: "Barber", icon: User },
    { id: 3, title: "Schedule", icon: Calendar },
    { id: 4, title: "Details", icon: CheckCircle },
    { id: 5, title: "Payment", icon: CreditCard },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
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

      {/* Step Content */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Choose the service you need"}
            {currentStep === 2 && "Select your preferred barber"}
            {currentStep === 3 && "Pick your preferred date and time"}
            {currentStep === 4 && "Enter your contact information"}
            {currentStep === 5 && "Choose your payment method"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all ${
                    bookingData.service === service.id
                      ? "border-secondary bg-secondary/5"
                      : "hover:border-secondary/50"
                  }`}
                  onClick={() => updateBookingData("service", service.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>${service.price} • {service.duration}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Step 2: Barber Selection */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {barbers.map((barber) => (
                <Card
                  key={barber.id}
                  className={`cursor-pointer transition-all ${
                    bookingData.barber === barber.id
                      ? "border-secondary bg-secondary/5"
                      : "hover:border-secondary/50"
                  }`}
                  onClick={() => updateBookingData("barber", barber.id)}
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-3">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{barber.name}</CardTitle>
                    <CardDescription>⭐ {barber.rating} • {barber.specialties.join(", ")}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Step 3: Schedule Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => updateBookingData("date", e.target.value)}
                  className="mt-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>Available Times</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
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
          )}

          {/* Step 4: Customer Information */}
          {currentStep === 4 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="font-semibold text-primary mb-4 text-center">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={bookingData.name}
                      onChange={(e) => updateBookingData("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => updateBookingData("email", e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => updateBookingData("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests</Label>
                    <Input
                      id="notes"
                      value={bookingData.notes}
                      onChange={(e) => updateBookingData("notes", e.target.value)}
                      placeholder="Any special requests"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary">Service Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Service:</span> {services.find(s => s.id === bookingData.service)?.name}</p>
                        <p><span className="font-medium">Barber:</span> {barbers.find(b => b.id === bookingData.barber)?.name}</p>
                        <p><span className="font-medium">Date:</span> {bookingData.date}</p>
                        <p><span className="font-medium">Time:</span> {bookingData.time}</p>
                        <p><span className="font-medium">Duration:</span> {services.find(s => s.id === bookingData.service)?.duration}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary">Customer Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {bookingData.name}</p>
                        <p><span className="font-medium">Email:</span> {bookingData.email}</p>
                        <p><span className="font-medium">Phone:</span> {bookingData.phone}</p>
                        {bookingData.notes && <p><span className="font-medium">Notes:</span> {bookingData.notes}</p>}
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-secondary">
                      ${services.find(s => s.id === bookingData.service)?.price}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay for your booking</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={bookingData.paymentMethod}
                    onValueChange={(value) => updateBookingData("paymentMethod", value)}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="cod" id="cod-booking" />
                      <Label htmlFor="cod-booking" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs">💵</span>
                        </div>
                        <div>
                          <div className="font-medium">Cash on Arrival</div>
                          <div className="text-sm text-gray-500">Pay cash when you arrive at the salon</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="card" id="card-booking" />
                      <Label htmlFor="card-booking" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs">💳</span>
                        </div>
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-gray-500">Pay with card at the salon</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Processing */}
              {bookingData.paymentMethod === 'cod' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💵</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-600">Cash on Arrival Selected</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          You can pay cash when you arrive at the salon for your appointment.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {bookingData.paymentMethod === 'card' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-600">Card Payment at Salon</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          You can pay with credit/debit card when you arrive at the salon.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={currentStep === 5 ? handleBookingSubmit : nextStep}
          disabled={
            isSubmitting ||
            (currentStep === 1 && !bookingData.service) ||
            (currentStep === 2 && !bookingData.barber) ||
            (currentStep === 3 && (!bookingData.date || !bookingData.time)) ||
            (currentStep === 4 && (!bookingData.name || !bookingData.email || !bookingData.phone)) ||
            (currentStep === 5 && !bookingData.paymentMethod)
          }
          className="bg-secondary hover:bg-secondary/90 text-primary"
        >
          {isSubmitting ? "Processing..." : currentStep === 5 ? "Complete Booking" : "Next"}
        </Button>
      </div>
    </div>
  );
}