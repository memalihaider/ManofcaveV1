'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Scissors,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function CustomerAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock appointments data - replace with real API calls
  const appointments = {
    upcoming: [
      {
        id: '1',
        service: 'Classic Haircut',
        date: '2025-12-20',
        time: '10:00 AM',
        duration: '30 min',
        branch: 'Downtown Premium',
        staff: 'Mike Johnson',
        status: 'confirmed',
        price: 35,
        notes: 'Regular trim and style'
      },
      {
        id: '2',
        service: 'Beard Trim & Shape',
        date: '2025-12-25',
        time: '2:00 PM',
        duration: '20 min',
        branch: 'Midtown Elite',
        staff: 'Alex Rodriguez',
        status: 'confirmed',
        price: 25,
        notes: 'Clean up and shape'
      }
    ],
    past: [
      {
        id: '3',
        service: 'Premium Haircut & Style',
        date: '2025-12-10',
        time: '11:00 AM',
        duration: '45 min',
        branch: 'Downtown Premium',
        staff: 'Mike Johnson',
        status: 'completed',
        price: 55,
        rating: 5,
        review: 'Excellent service as always!'
      },
      {
        id: '4',
        service: 'Hot Towel Shave',
        date: '2025-12-05',
        time: '3:00 PM',
        duration: '30 min',
        branch: 'Uptown Luxury',
        staff: 'David Chen',
        status: 'completed',
        price: 45,
        rating: 5,
        review: 'Very relaxing experience'
      },
      {
        id: '5',
        service: 'Facial Treatment',
        date: '2025-11-28',
        time: '1:00 PM',
        duration: '45 min',
        branch: 'Midtown Elite',
        staff: 'Sarah Chen',
        status: 'cancelled',
        price: 65,
        notes: 'Had to reschedule due to emergency'
      }
    ]
  };

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push('/customer/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'customer') {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const AppointmentCard = ({ appointment, isPast = false }: { appointment: any, isPast?: boolean }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">{appointment.service}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {appointment.date} at {appointment.time}
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {appointment.duration}
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              {appointment.branch}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              {appointment.staff}
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">${appointment.price}</p>
          </div>
        </div>

        {appointment.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Notes:</strong> {appointment.notes}
            </p>
          </div>
        )}

        {isPast && appointment.rating && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Rating:</span>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${i < appointment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            {appointment.review && (
              <p className="text-sm text-gray-600 italic">"{appointment.review}"</p>
            )}
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex space-x-3">
          {!isPast && appointment.status === 'confirmed' && (
            <>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call Branch
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
              <Button variant="destructive" size="sm">
                Cancel
              </Button>
            </>
          )}
          {isPast && appointment.status === 'completed' && (
            <Button variant="outline" size="sm">
              Book Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/customer/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-primary mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your service bookings and appointment history</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming ({appointments.upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past Appointments ({appointments.past.length})</TabsTrigger>
          </TabsList>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming" className="space-y-6">
            {appointments.upcoming.length > 0 ? (
              <div className="space-y-4">
                {appointments.upcoming.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-600 mb-6">You don't have any upcoming appointments scheduled.</p>
                  <Link href="/services">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Book an Appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Past Appointments */}
          <TabsContent value="past" className="space-y-6">
            {appointments.past.length > 0 ? (
              <div className="space-y-4">
                {appointments.past.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} isPast={true} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">No Past Appointments</h3>
                  <p className="text-gray-600 mb-6">Your appointment history will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common appointment-related tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/services">
                  <Button className="w-full h-16 flex flex-col items-center justify-center">
                    <Plus className="w-5 h-5 mb-2" />
                    Book New Appointment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Phone className="w-5 h-5 mb-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <MessageSquare className="w-5 h-5 mb-2" />
                  Leave Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}