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
import {
  Smartphone,
  Bell,
  BarChart3,
  Settings,
  Upload,
  Download,
  Send,
  Users,
  Star,
  TrendingUp,
  MessageSquare,
  Eye,
  Edit,
  Save,
  Plus,
  Trash2,
  LogOut,
  Apple,
  Play,
  Target,
  Calendar,
  Clock,
  Activity,
  Zap,
  Shield,
  Globe,
  FileText,
  Image,
  Video,
  Music,
  Gift,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  User,
  BookOpen
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface AppStoreListing {
  platform: 'ios' | 'android';
  appName: string;
  description: string;
  shortDescription: string;
  keywords: string[];
  screenshots: string[];
  icon: string;
  version: string;
  category: string;
  price: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  lastUpdated: string;
  downloadUrl?: string;
}

interface PushNotification {
  id: number;
  title: string;
  message: string;
  targetAudience: 'all' | 'active_users' | 'inactive_users' | 'new_users' | 'specific_segment';
  scheduledDate?: string;
  sentDate?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  openRate?: number;
  clickRate?: number;
  recipientCount: number;
  image?: string;
}

interface AppFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'published' | 'draft' | 'disabled';
  category: string;
  priority: 'high' | 'medium' | 'low';
  version: string;
  lastUpdated: string;
}

interface AppVersion {
  id: number;
  version: string;
  platform: 'ios' | 'android' | 'both';
  releaseDate: string;
  status: 'beta' | 'live' | 'deprecated';
  features: string[];
  downloads: number;
  crashRate: number;
  avgRating: number;
  forceUpdate: boolean;
}

interface AppUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  lastActive: string;
  totalBookings: number;
  totalSpent: number;
  appVersion: string;
  deviceType: 'ios' | 'android';
  status: 'active' | 'inactive' | 'banned';
  pushEnabled: boolean;
}

interface AppAnalytics {
  totalDownloads: number;
  activeUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: number;
  retentionRate: number;
  crashRate: number;
  avgRating: number;
  totalRevenue: number;
  conversionRate: number;
}

interface BannerPromotion {
  id: number;
  title: string;
  description: string;
  image: string;
  type: 'banner' | 'promo' | 'featured';
  targetScreen: string;
  targetAudience: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'scheduled' | 'expired' | 'draft';
  impressions: number;
  clicks: number;
  conversionRate: number;
  ctaText?: string;
  ctaAction?: string;
}

interface OnboardingContent {
  id: number;
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  content: string;
  image?: string;
  video?: string;
  type: 'welcome' | 'tutorial' | 'feature_intro';
  targetUserType: 'new_users' | 'returning_users' | 'all';
  status: 'published' | 'draft' | 'archived';
  completionRate: number;
  skipRate: number;
}

interface PushTemplate {
  id: number;
  name: string;
  title: string;
  message: string;
  category: 'booking' | 'reminder' | 'promotion' | 'update' | 'loyalty';
  image?: string;
  actionButtons?: { text: string; action: string }[];
  personalizationTags: string[];
  status: 'active' | 'draft' | 'archived';
  usageCount: number;
  successRate: number;
}

interface InAppMessage {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'promotion';
  trigger: 'app_open' | 'booking_complete' | 'payment_success' | 'inactivity' | 'custom_event';
  targetAudience: string;
  displayDuration: number; // seconds
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'scheduled' | 'expired';
  displayCount: number;
  interactionRate: number;
  dismissRate: number;
}

interface TutorialContent {
  id: number;
  title: string;
  description: string;
  category: 'booking' | 'payment' | 'loyalty' | 'navigation' | 'features';
  steps: {
    id: number;
    title: string;
    content: string;
    image?: string;
    action?: string;
  }[];
  targetAudience: 'new_users' | 'all_users' | 'specific_segment';
  status: 'published' | 'draft' | 'archived';
  completionRate: number;
  averageTime: number; // minutes
  helpfulnessRating: number;
}

interface FeaturedContent {
  id: number;
  title: string;
  description: string;
  type: 'service' | 'product' | 'promotion' | 'location' | 'staff';
  image: string;
  badge?: string;
  priority: number;
  targetScreen: string;
  status: 'featured' | 'normal' | 'archived';
  views: number;
  engagement: number;
  featuredUntil?: string;
}

interface SeasonalCampaign {
  id: number;
  name: string;
  theme: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  targetAudience: string;
  budget?: number;
  goals: string[];
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
  assets: {
    banners: string[];
    messages: string[];
    promotions: string[];
  };
}

export default function MobileAppManagement() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // State for all mobile app management sections
  const [appStoreListings, setAppStoreListings] = useState<AppStoreListing[]>([
    {
      platform: 'ios',
      appName: 'Man of Cave',
      description: 'Experience luxury grooming services at your fingertips. Book appointments, manage loyalty rewards, and discover premium grooming products.',
      shortDescription: 'Luxury barber shop booking and grooming services',
      keywords: ['barber', 'grooming', 'haircut', 'luxury', 'booking'],
      screenshots: ['/api/placeholder/300/600', '/api/placeholder/300/600'],
      icon: '/api/placeholder/512/512',
      version: '2.1.0',
      category: 'Lifestyle',
      price: 'Free',
      status: 'approved',
      lastUpdated: '2025-12-01',
      downloadUrl: 'https://apps.apple.com/app/man-of-cave'
    },
    {
      platform: 'android',
      appName: 'Man of Cave',
      description: 'Experience luxury grooming services at your fingertips. Book appointments, manage loyalty rewards, and discover premium grooming products.',
      shortDescription: 'Luxury barber shop booking and grooming services',
      keywords: ['barber', 'grooming', 'haircut', 'luxury', 'booking'],
      screenshots: ['/api/placeholder/300/600', '/api/placeholder/300/600'],
      icon: '/api/placeholder/512/512',
      version: '2.1.0',
      category: 'Lifestyle',
      price: 'Free',
      status: 'approved',
      lastUpdated: '2025-12-01',
      downloadUrl: 'https://play.google.com/store/apps/details?id=com.manofcave'
    }
  ]);

  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>([
    {
      id: 1,
      title: 'New Service Available!',
      message: 'Try our new premium scalp treatment - 20% off today only!',
      targetAudience: 'active_users',
      sentDate: '2025-12-10',
      status: 'sent',
      openRate: 34.5,
      clickRate: 12.3,
      recipientCount: 5230
    },
    {
      id: 2,
      title: 'Appointment Reminder',
      message: 'Your appointment with Ahmed is tomorrow at 2:00 PM',
      targetAudience: 'specific_segment',
      scheduledDate: '2025-12-16',
      status: 'scheduled',
      recipientCount: 150
    }
  ]);

  const [appFeatures, setAppFeatures] = useState<AppFeature[]>([
    {
      id: 1,
      title: 'Easy Booking',
      description: 'Book appointments with your favorite barber in seconds',
      icon: '📅',
      status: 'published',
      category: 'Core Features',
      priority: 'high',
      version: '1.0.0',
      lastUpdated: '2025-01-15'
    },
    {
      id: 2,
      title: 'Real-time Updates',
      description: 'Get notified when your appointment is confirmed or rescheduled',
      icon: '🔔',
      status: 'published',
      category: 'Notifications',
      priority: 'high',
      version: '1.2.0',
      lastUpdated: '2025-03-20'
    },
    {
      id: 3,
      title: 'Virtual Queue',
      description: 'Join virtual queue and get notified when it\'s your turn',
      icon: '📱',
      status: 'draft',
      category: 'Advanced Features',
      priority: 'medium',
      version: '2.2.0',
      lastUpdated: '2025-12-01'
    }
  ]);

  const [appVersions, setAppVersions] = useState<AppVersion[]>([
    {
      id: 1,
      version: '2.1.0',
      platform: 'both',
      releaseDate: '2025-12-01',
      status: 'live',
      features: ['Virtual Queue', 'Enhanced Booking', 'Bug Fixes'],
      downloads: 2340,
      crashRate: 0.5,
      avgRating: 4.8,
      forceUpdate: false
    },
    {
      id: 2,
      version: '2.2.0',
      platform: 'both',
      releaseDate: '2025-12-15',
      status: 'beta',
      features: ['AI Recommendations', 'Voice Commands', 'Offline Mode'],
      downloads: 456,
      crashRate: 1.2,
      avgRating: 4.6,
      forceUpdate: false
    }
  ]);

  const [appUsers, setAppUsers] = useState<AppUser[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+971501234567',
      joinDate: '2025-01-15',
      lastActive: '2025-12-14',
      totalBookings: 12,
      totalSpent: 450,
      appVersion: '2.1.0',
      deviceType: 'ios',
      status: 'active',
      pushEnabled: true
    },
    {
      id: 2,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      joinDate: '2025-03-20',
      lastActive: '2025-12-10',
      totalBookings: 8,
      totalSpent: 320,
      appVersion: '2.0.5',
      deviceType: 'android',
      status: 'active',
      pushEnabled: false
    }
  ]);

  const [appAnalytics, setAppAnalytics] = useState<AppAnalytics>({
    totalDownloads: 15420,
    activeUsers: 8920,
    monthlyActiveUsers: 6230,
    avgSessionDuration: 8.5,
    retentionRate: 78.5,
    crashRate: 0.8,
    avgRating: 4.7,
    totalRevenue: 125000,
    conversionRate: 15.3
  });

  const [bannerPromotions, setBannerPromotions] = useState<BannerPromotion[]>([
    {
      id: 1,
      title: 'Holiday Special',
      description: 'Book your holiday haircut now and save 25%',
      image: '/api/placeholder/800/400',
      type: 'banner',
      targetScreen: 'home',
      targetAudience: 'all',
      startDate: '2025-12-01',
      endDate: '2025-12-31',
      status: 'active',
      impressions: 15420,
      clicks: 2340,
      conversionRate: 15.2,
      ctaText: 'Book Now',
      ctaAction: 'navigate_to_booking'
    },
    {
      id: 2,
      title: 'New VIP Membership',
      description: 'Join our VIP program for exclusive benefits',
      image: '/api/placeholder/800/400',
      type: 'promo',
      targetScreen: 'services',
      targetAudience: 'active_users',
      startDate: '2025-12-15',
      status: 'scheduled',
      impressions: 0,
      clicks: 0,
      conversionRate: 0,
      ctaText: 'Learn More',
      ctaAction: 'navigate_to_membership'
    }
  ]);

  const [onboardingContent, setOnboardingContent] = useState<OnboardingContent[]>([
    {
      id: 1,
      title: 'Welcome to Man of Cave',
      description: 'Your premium grooming experience starts here',
      step: 1,
      totalSteps: 4,
      content: 'Discover our world-class barber services tailored just for you.',
      image: '/api/placeholder/400/300',
      type: 'welcome',
      targetUserType: 'new_users',
      status: 'published',
      completionRate: 89.5,
      skipRate: 10.5
    },
    {
      id: 2,
      title: 'Easy Booking Process',
      description: 'Learn how to book your appointments in seconds',
      step: 2,
      totalSteps: 4,
      content: 'Simply select your preferred barber, choose a service, and pick a time that works for you.',
      video: '/api/placeholder/video',
      type: 'tutorial',
      targetUserType: 'new_users',
      status: 'published',
      completionRate: 76.8,
      skipRate: 23.2
    }
  ]);

  const [pushTemplates, setPushTemplates] = useState<PushTemplate[]>([
    {
      id: 1,
      name: 'Appointment Reminder',
      title: 'Your appointment is tomorrow!',
      message: 'Don\'t forget your booking with {barber_name} at {time}',
      category: 'reminder',
      personalizationTags: ['barber_name', 'time', 'service'],
      status: 'active',
      usageCount: 1250,
      successRate: 78.5
    },
    {
      id: 2,
      name: 'Booking Confirmation',
      title: 'Booking Confirmed! 🎉',
      message: 'Your appointment with {barber_name} is confirmed for {date} at {time}',
      category: 'booking',
      personalizationTags: ['barber_name', 'date', 'time', 'service'],
      status: 'active',
      usageCount: 890,
      successRate: 92.3
    },
    {
      id: 3,
      name: 'Loyalty Reward',
      title: 'You earned a reward! ⭐',
      message: 'Congratulations! You\'ve earned {points} points. Redeem them for exclusive discounts.',
      category: 'loyalty',
      personalizationTags: ['points', 'next_reward'],
      status: 'active',
      usageCount: 456,
      successRate: 85.7
    }
  ]);

  const [inAppMessages, setInAppMessages] = useState<InAppMessage[]>([
    {
      id: 1,
      title: 'Booking Successful',
      message: 'Your appointment has been confirmed. We\'ll see you soon!',
      type: 'success',
      trigger: 'booking_complete',
      targetAudience: 'all',
      displayDuration: 5,
      priority: 'medium',
      status: 'active',
      displayCount: 2340,
      interactionRate: 45.6,
      dismissRate: 54.4
    },
    {
      id: 2,
      title: 'Payment Reminder',
      message: 'Complete your payment to secure your booking slot.',
      type: 'warning',
      trigger: 'inactivity',
      targetAudience: 'users_with_pending_payments',
      displayDuration: 10,
      priority: 'high',
      status: 'active',
      displayCount: 890,
      interactionRate: 67.8,
      dismissRate: 32.2
    }
  ]);

  const [tutorialContent, setTutorialContent] = useState<TutorialContent[]>([
    {
      id: 1,
      title: 'How to Book an Appointment',
      description: 'Step-by-step guide to booking your perfect haircut',
      category: 'booking',
      steps: [
        {
          id: 1,
          title: 'Choose Your Service',
          content: 'Select from our range of premium grooming services',
          image: '/api/placeholder/300/200'
        },
        {
          id: 2,
          title: 'Pick Your Barber',
          content: 'Browse our expert barbers and read their reviews',
          image: '/api/placeholder/300/200'
        },
        {
          id: 3,
          title: 'Select Date & Time',
          content: 'Choose a convenient date and time for your appointment',
          image: '/api/placeholder/300/200'
        }
      ],
      targetAudience: 'new_users',
      status: 'published',
      completionRate: 68.9,
      averageTime: 3.2,
      helpfulnessRating: 4.6
    }
  ]);

  const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([
    {
      id: 1,
      title: 'Premium Haircut Package',
      description: 'Complete grooming experience with hot towel shave',
      type: 'service',
      image: '/api/placeholder/400/300',
      badge: 'Popular',
      priority: 1,
      targetScreen: 'services',
      status: 'featured',
      views: 5420,
      engagement: 23.4,
      featuredUntil: '2025-12-31'
    },
    {
      id: 2,
      title: 'Meet Ahmed - Master Barber',
      description: '15+ years of experience in traditional and modern cuts',
      type: 'staff',
      image: '/api/placeholder/400/300',
      badge: 'Expert',
      priority: 2,
      targetScreen: 'barbers',
      status: 'featured',
      views: 3210,
      engagement: 18.7
    }
  ]);

  const [seasonalCampaigns, setSeasonalCampaigns] = useState<SeasonalCampaign[]>([
    {
      id: 1,
      name: 'Holiday Season 2025',
      theme: 'Festive Grooming',
      description: 'Special holiday packages and festive grooming offers',
      startDate: '2025-12-01',
      endDate: '2025-12-31',
      status: 'active',
      targetAudience: 'all_users',
      budget: 5000,
      goals: ['Increase bookings by 30%', 'Boost membership signups', 'Improve customer satisfaction'],
      performance: {
        reach: 15420,
        engagement: 23.4,
        conversions: 890,
        roi: 2.8
      },
      assets: {
        banners: ['/api/placeholder/banner1', '/api/placeholder/banner2'],
        messages: ['Holiday promotion push', 'Festive booking reminder'],
        promotions: ['20% off holiday packages', 'Free beard trim with haircut']
      }
    }
  ]);

  const [appSettings, setAppSettings] = useState({
    maintenanceMode: false,
    forceUpdate: false,
    pushNotifications: true,
    analyticsEnabled: true,
    crashReporting: true,
    locationServices: true,
    cameraAccess: true,
    notificationSound: true,
    darkMode: false,
    biometricAuth: true
  });

  // Helper functions
  const handleSave = (section: string) => {
    alert(`${section} saved successfully!`);
  };

  const handleStatusToggle = (section: string, id: number | string, status: string) => {
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

  const handleSendNotification = (notificationId: number) => {
    alert(`Push notification sent successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
      case 'live':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'disabled':
      case 'deprecated':
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-0" : "lg:ml-0"}`}>
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
                  <h1 className="text-2xl font-bold text-gray-900">Mobile App Management</h1>
                  <p className="text-sm text-gray-600">Man of Cave Mobile App Console</p>
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
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="store" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">App Store</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span className="hidden sm:inline">Push</span>
                  </TabsTrigger>
                  <TabsTrigger value="features" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Features</span>
                  </TabsTrigger>
                  <TabsTrigger value="versions" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Versions</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Content</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Analytics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{appAnalytics.totalDownloads.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">+12.5%</span> from last month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{appAnalytics.activeUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">+8.2%</span> from last month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{appAnalytics.avgRating}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">+0.3</span> from last month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${appAnalytics.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">+15.3%</span> from last month
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Latest app events and user interactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: 'New user registration', user: 'Sarah Johnson', time: '2 minutes ago', type: 'user' },
                          { action: 'App update downloaded', user: 'Version 2.1.0', time: '15 minutes ago', type: 'update' },
                          { action: 'Push notification sent', user: 'Holiday promotion', time: '1 hour ago', type: 'notification' },
                          { action: 'Booking completed', user: 'Mike Chen', time: '2 hours ago', type: 'booking' },
                          { action: 'App crash reported', user: 'iOS 2.1.0', time: '3 hours ago', type: 'error' },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                            <div className="w-2 h-2 rounded-full ${
                              activity.type === 'user' ? 'bg-green-500' :
                              activity.type === 'update' ? 'bg-blue-500' :
                              activity.type === 'notification' ? 'bg-purple-500' :
                              activity.type === 'booking' ? 'bg-orange-500' :
                              'bg-red-500'
                            }" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-gray-600">{activity.user}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* App Store Tab */}
                <TabsContent value="store" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">App Store Management</h3>
                      <p className="text-sm text-gray-600">Manage iOS and Android app store listings</p>
                    </div>
                    <Button onClick={() => handleAddNew('App Store Listing')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Update Listing
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {appStoreListings.map((listing) => (
                      <Card key={listing.platform}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {listing.platform === 'ios' ? (
                                <Apple className="w-8 h-8 text-black" />
                              ) : (
                                <Play className="w-8 h-8 text-green-600" />
                              )}
                              <div>
                                <CardTitle>{listing.appName}</CardTitle>
                                <CardDescription>{listing.platform.toUpperCase()} App Store</CardDescription>
                              </div>
                            </div>
                            <Badge className={getStatusColor(listing.status)}>
                              {listing.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Version:</span>
                              <p className="font-medium">{listing.version}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Category:</span>
                              <p className="font-medium">{listing.category}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <p className="font-medium">{listing.price}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Last Updated:</span>
                              <p className="font-medium">{listing.lastUpdated}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Short Description</Label>
                            <p className="text-sm text-gray-600 mt-1">{listing.shortDescription}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit Listing
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {listing.downloadUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={listing.downloadUrl} target="_blank" rel="noopener noreferrer">
                                  View Store
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Push Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Push Notifications</h3>
                      <p className="text-sm text-gray-600">Manage and send push notifications to app users</p>
                    </div>
                    <Button onClick={() => handleAddNew('Push Notification')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Notification
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pushNotifications.map((notification) => (
                      <Card key={notification.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{notification.title}</CardTitle>
                            <Badge className={getStatusColor(notification.status)}>
                              {notification.status}
                            </Badge>
                          </div>
                          <CardDescription>{notification.message}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Target:</span>
                              <p className="font-medium capitalize">{notification.targetAudience.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Recipients:</span>
                              <p className="font-medium">{notification.recipientCount.toLocaleString()}</p>
                            </div>
                            {notification.sentDate && (
                              <div>
                                <span className="text-gray-500">Sent:</span>
                                <p className="font-medium">{notification.sentDate}</p>
                              </div>
                            )}
                            {notification.scheduledDate && (
                              <div>
                                <span className="text-gray-500">Scheduled:</span>
                                <p className="font-medium">{notification.scheduledDate}</p>
                              </div>
                            )}
                          </div>

                          {notification.openRate && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Open Rate:</span>
                                <p className="font-medium">{notification.openRate}%</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Click Rate:</span>
                                <p className="font-medium">{notification.clickRate}%</p>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            {notification.status === 'draft' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendNotification(notification.id)}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Send Now
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('Notification', notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">App Features</h3>
                      <p className="text-sm text-gray-600">Manage app features and functionality</p>
                    </div>
                    <Button onClick={() => handleAddNew('App Feature')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appFeatures.map((feature) => (
                      <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{feature.icon}</span>
                              <div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                  {feature.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={getStatusColor(feature.status)}>
                              {feature.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-gray-500">Priority:</span>
                              <p className="font-medium capitalize">{feature.priority}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Version:</span>
                              <p className="font-medium">{feature.version}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle('Feature', feature.id, feature.status === 'published' ? 'draft' : 'published')}
                            >
                              {feature.status === 'published' ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('Feature', feature.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Versions Tab */}
                <TabsContent value="versions" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">App Versions</h3>
                      <p className="text-sm text-gray-600">Manage app versions and releases</p>
                    </div>
                    <Button onClick={() => handleAddNew('App Version')}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Version
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {appVersions.map((version) => (
                      <Card key={version.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <CardTitle className="text-xl">v{version.version}</CardTitle>
                                <CardDescription>
                                  Released on {version.releaseDate} • {version.platform}
                                </CardDescription>
                              </div>
                              <Badge className={getStatusColor(version.status)}>
                                {version.status}
                              </Badge>
                            </div>
                            {version.forceUpdate && (
                              <Badge variant="destructive">Force Update</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{version.downloads.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Downloads</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{version.avgRating}</div>
                              <div className="text-sm text-gray-600">Avg Rating</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{version.crashRate}%</div>
                              <div className="text-sm text-gray-600">Crash Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {version.features.length}
                              </div>
                              <div className="text-sm text-gray-600">Features</div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Label className="text-sm font-medium">New Features</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {version.features.map((feature, index) => (
                                <Badge key={index} variant="outline">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit Version
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="w-4 h-4 mr-1" />
                              View Analytics
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('Version', version.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">App Users</h3>
                      <p className="text-sm text-gray-600">Manage mobile app users and their data</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Users
                      </Button>
                      <Button onClick={() => handleAddNew('User Management')}>
                        <Settings className="w-4 h-4 mr-2" />
                        User Settings
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {appUsers.map((user) => (
                      <Card key={user.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{user.name}</CardTitle>
                              <CardDescription>{user.email}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                              {user.deviceType === 'ios' ? (
                                <Apple className="w-5 h-5 text-gray-600" />
                              ) : (
                                <Play className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-gray-500">Joined:</span>
                              <p className="font-medium">{user.joinDate}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Last Active:</span>
                              <p className="font-medium">{user.lastActive}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Bookings:</span>
                              <p className="font-medium">{user.totalBookings}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Total Spent:</span>
                              <p className="font-medium">${user.totalSpent}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Push Notifications:</span>
                              <Switch checked={user.pushEnabled} />
                            </div>
                            <Badge variant="outline">
                              v{user.appVersion}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Send Message
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle('User', user.id, user.status === 'active' ? 'banned' : 'active')}
                            >
                              {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Content Management</h3>
                      <p className="text-sm text-gray-600">Manage all types of mobile app content</p>
                    </div>
                  </div>

                  <Tabs defaultValue="banners" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
                      <TabsTrigger value="banners" className="text-xs lg:text-sm">
                        <Image className="w-4 h-4 mr-1" />
                        Banners
                      </TabsTrigger>
                      <TabsTrigger value="onboarding" className="text-xs lg:text-sm">
                        <User className="w-4 h-4 mr-1" />
                        Onboarding
                      </TabsTrigger>
                      <TabsTrigger value="templates" className="text-xs lg:text-sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Templates
                      </TabsTrigger>
                      <TabsTrigger value="messages" className="text-xs lg:text-sm">
                        <Bell className="w-4 h-4 mr-1" />
                        Messages
                      </TabsTrigger>
                      <TabsTrigger value="tutorials" className="text-xs lg:text-sm">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Tutorials
                      </TabsTrigger>
                      <TabsTrigger value="featured" className="text-xs lg:text-sm">
                        <Star className="w-4 h-4 mr-1" />
                        Featured
                      </TabsTrigger>
                      <TabsTrigger value="campaigns" className="text-xs lg:text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Campaigns
                      </TabsTrigger>
                    </TabsList>

                    {/* Banners & Promotions */}
                    <TabsContent value="banners" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-semibold">Banners & Promotions</h4>
                          <p className="text-sm text-gray-600">Manage promotional banners and featured content</p>
                        </div>
                        <Button onClick={() => handleAddNew('Banner/Promotion')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Banner
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bannerPromotions.map((banner) => (
                          <Card key={banner.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">{banner.title}</CardTitle>
                                  <CardDescription>
                                    {banner.type} • {banner.targetScreen}
                                  </CardDescription>
                                </div>
                                <Badge className={getStatusColor(banner.status)}>
                                  {banner.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="mb-4">
                                <img
                                  src={banner.image}
                                  alt={banner.title}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>

                              <p className="text-sm text-gray-600 mb-4">{banner.description}</p>

                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="text-gray-500">Target:</span>
                                  <p className="font-medium capitalize">{banner.targetAudience.replace('_', ' ')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Start Date:</span>
                                  <p className="font-medium">{banner.startDate}</p>
                                </div>
                                {banner.endDate && (
                                  <>
                                    <div>
                                      <span className="text-gray-500">End Date:</span>
                                      <p className="font-medium">{banner.endDate}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Conversion:</span>
                                      <p className="font-medium">{banner.conversionRate}%</p>
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                                <div>
                                  <div className="text-xl font-bold text-blue-600">{banner.impressions.toLocaleString()}</div>
                                  <div className="text-xs text-gray-600">Impressions</div>
                                </div>
                                <div>
                                  <div className="text-xl font-bold text-green-600">{banner.clicks.toLocaleString()}</div>
                                  <div className="text-xs text-gray-600">Clicks</div>
                                </div>
                                <div>
                                  <div className="text-xl font-bold text-purple-600">{banner.conversionRate}%</div>
                                  <div className="text-xs text-gray-600">CTR</div>
                                </div>
                              </div>

                              {banner.ctaText && (
                                <div className="mb-4">
                                  <span className="text-sm text-gray-500">CTA:</span>
                                  <Badge variant="outline" className="ml-2">{banner.ctaText}</Badge>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  Analytics
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete('Banner', banner.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Onboarding Content */}
                    <TabsContent value="onboarding" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-semibold">Onboarding Content</h4>
                          <p className="text-sm text-gray-600">Manage user onboarding and welcome flows</p>
                        </div>
                        <Button onClick={() => handleAddNew('Onboarding Content')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Step
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {onboardingContent.map((content) => (
                          <Card key={content.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">{content.title}</CardTitle>
                                  <CardDescription>
                                    Step {content.step} of {content.totalSteps} • {content.type}
                                  </CardDescription>
                                </div>
                                <Badge className={getStatusColor(content.status)}>
                                  {content.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {content.image && (
                                <div className="mb-4">
                                  <img
                                    src={content.image}
                                    alt={content.title}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                </div>
                              )}

                              <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                              <p className="text-sm mb-4">{content.content}</p>

                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="text-gray-500">Target Users:</span>
                                  <p className="font-medium capitalize">{content.targetUserType.replace('_', ' ')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Completion Rate:</span>
                                  <p className="font-medium">{content.completionRate}%</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Skip Rate:</span>
                                  <p className="font-medium">{content.skipRate}%</p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  Analytics
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete('Onboarding Content', content.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Push Templates */}
                    <TabsContent value="templates" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-semibold">Push Notification Templates</h4>
                          <p className="text-sm text-gray-600">Manage reusable push notification templates</p>
                        </div>
                        <Button onClick={() => handleAddNew('Push Template')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Template
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pushTemplates.map((template) => (
                          <Card key={template.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">{template.name}</CardTitle>
                                  <CardDescription>
                                    <Badge variant="secondary" className="text-xs">
                                      {template.category}
                                    </Badge>
                                  </CardDescription>
                                </div>
                                <Badge className={getStatusColor(template.status)}>
                                  {template.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="mb-4">
                                <Label className="text-sm font-medium">Title:</Label>
                                <p className="text-sm text-gray-600">{template.title}</p>
                              </div>

                              <div className="mb-4">
                                <Label className="text-sm font-medium">Message:</Label>
                                <p className="text-sm text-gray-600">{template.message}</p>
                              </div>

                              {template.personalizationTags.length > 0 && (
                                <div className="mb-4">
                                  <Label className="text-sm font-medium">Personalization Tags:</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {template.personalizationTags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="text-gray-500">Usage Count:</span>
                                  <p className="font-medium">{template.usageCount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Success Rate:</span>
                                  <p className="font-medium">{template.successRate}%</p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Send className="w-4 h-4 mr-1" />
                                  Use Template
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete('Template', template.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* In-App Messages */}
                    <TabsContent value="messages" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-semibold">In-App Messages</h4>
                          <p className="text-sm text-gray-600">Manage contextual messages and notifications</p>
                        </div>
                        <Button onClick={() => handleAddNew('In-App Message')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Message
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {inAppMessages.map((message) => (
                          <Card key={message.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">{message.title}</CardTitle>
                                  <CardDescription>
                                    <Badge variant="secondary" className="text-xs mr-2">
                                      {message.type}
                                    </Badge>
                                    Trigger: {message.trigger.replace('_', ' ')}
                                  </CardDescription>
                                </div>
                                <Badge className={getStatusColor(message.status)}>
                                  {message.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-4">{message.message}</p>

                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="text-gray-500">Target:</span>
                                  <p className="font-medium capitalize">{message.targetAudience.replace('_', ' ')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Duration:</span>
                                  <p className="font-medium">{message.displayDuration}s</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Priority:</span>
                                  <p className="font-medium capitalize">{message.priority}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Displays:</span>
                                  <p className="font-medium">{message.displayCount.toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                                <div>
                                  <div className="text-xl font-bold text-green-600">{message.interactionRate}%</div>
                                  <div className="text-xs text-gray-600">Interaction Rate</div>
                                </div>
                                <div>
                                  <div className="text-xl font-bold text-red-600">{message.dismissRate}%</div>
                                  <div className="text-xs text-gray-600">Dismiss Rate</div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  Analytics
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete('Message', message.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Tutorial Content */}
                    <TabsContent value="tutorials" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-semibold">Tutorial Content</h4>
                          <p className="text-sm text-gray-600">Manage interactive tutorials and guides</p>
                        </div>
                        <Button onClick={() => handleAddNew('Tutorial')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Tutorial
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {tutorialContent.map((tutorial) => (
                          <Card key={tutorial.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                                  <CardDescription>
                                    <Badge variant="secondary" className="text-xs mr-2">
                                      {tutorial.category}
                                    </Badge>
                                    {tutorial.steps.length} steps
                                  </CardDescription>
                                </div>
                                <Badge className={getStatusColor(tutorial.status)}>
                                  {tutorial.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-4">{tutorial.description}</p>

                              <div className="mb-4">
                                <Label className="text-sm font-medium">Steps:</Label>
                                <div className="space-y-2 mt-2">
                                  {tutorial.steps.slice(0, 3).map((step, index) => (
                                    <div key={step.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                        {index + 1}
                                      </span>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{step.title}</p>
                                        <p className="text-xs text-gray-600">{step.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                  {tutorial.steps.length > 3 && (
                                    <p className="text-xs text-gray-500 text-center">
                                      +{tutorial.steps.length - 3} more steps
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="text-gray-500">Target:</span>
                                  <p className="font-medium capitalize">{tutorial.targetAudience.replace('_', ' ')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Completion:</span>
                                  <p className="font-medium">{tutorial.completionRate}%</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Avg Time:</span>
                                  <p className="font-medium">{tutorial.averageTime} min</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Rating:</span>
                                  <p className="font-medium">{tutorial.helpfulnessRating}/5</p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  Analytics
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete('Tutorial', tutorial.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Featured Content */}
                    <TabsContent value="featured" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-semibold">Featured Content</h4>
                          <p className="text-sm text-gray-600">Manage highlighted content and recommendations</p>
                        </div>
                        <Button onClick={() => handleAddNew('Featured Content')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Featured
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {featuredContent.map((content) => (
                          <Card key={content.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">{content.title}</CardTitle>
                                  <CardDescription>
                                    <Badge variant="secondary" className="text-xs mr-2">
                                      {content.type}
                                    </Badge>
                                    Priority: {content.priority}
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  {content.badge && (
                                    <Badge variant="outline">{content.badge}</Badge>
                                  )}
                                  <Badge className={getStatusColor(content.status)}>
                                    {content.status}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="mb-4">
                                <img
                                  src={content.image}
                                  alt={content.title}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>

                              <p className="text-sm text-gray-600 mb-4">{content.description}</p>

                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="text-gray-500">Target Screen:</span>
                                  <p className="font-medium">{content.targetScreen}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Views:</span>
                                  <p className="font-medium">{content.views.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Engagement:</span>
                                  <p className="font-medium">{content.engagement}%</p>
                                </div>
                                {content.featuredUntil && (
                                  <div>
                                    <span className="text-gray-500">Featured Until:</span>
                                    <p className="font-medium">{content.featuredUntil}</p>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  Analytics
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete('Featured Content', content.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Seasonal Campaigns */}
                    <TabsContent value="campaigns" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-semibold">Seasonal Campaigns</h4>
                          <p className="text-sm text-gray-600">Manage seasonal marketing campaigns and promotions</p>
                        </div>
                        <Button onClick={() => handleAddNew('Seasonal Campaign')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Campaign
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {seasonalCampaigns.map((campaign) => (
                          <Card key={campaign.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-xl">{campaign.name}</CardTitle>
                                  <CardDescription>
                                    {campaign.theme} • {campaign.startDate} to {campaign.endDate}
                                  </CardDescription>
                                </div>
                                <Badge className={getStatusColor(campaign.status)}>
                                  {campaign.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-6">{campaign.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                  <Label className="text-sm font-medium">Performance</Label>
                                  <div className="space-y-2 mt-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Reach:</span>
                                      <span className="font-medium">{campaign.performance.reach.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Engagement:</span>
                                      <span className="font-medium">{campaign.performance.engagement}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Conversions:</span>
                                      <span className="font-medium">{campaign.performance.conversions.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>ROI:</span>
                                      <span className="font-medium">{campaign.performance.roi}x</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Goals</Label>
                                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                    {campaign.goals.map((goal, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        {goal}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Assets</Label>
                                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                                    <div>Banners: {campaign.assets.banners.length}</div>
                                    <div>Messages: {campaign.assets.messages.length}</div>
                                    <div>Promotions: {campaign.assets.promotions.length}</div>
                                    {campaign.budget && (
                                      <div>Budget: ${campaign.budget.toLocaleString()}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit Campaign
                                </Button>
                                <Button variant="outline" size="sm">
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  Detailed Analytics
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-1" />
                                  Export Report
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete('Campaign', campaign.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        App Settings
                      </CardTitle>
                      <CardDescription>
                        Configure global app settings and features
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Maintenance Mode</Label>
                              <p className="text-sm text-gray-600">Temporarily disable app access</p>
                            </div>
                            <Switch
                              checked={appSettings.maintenanceMode}
                              onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Force Update</Label>
                              <p className="text-sm text-gray-600">Require users to update app</p>
                            </div>
                            <Switch
                              checked={appSettings.forceUpdate}
                              onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, forceUpdate: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Push Notifications</Label>
                              <p className="text-sm text-gray-600">Enable push notification system</p>
                            </div>
                            <Switch
                              checked={appSettings.pushNotifications}
                              onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, pushNotifications: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Analytics</Label>
                              <p className="text-sm text-gray-600">Track user behavior and app usage</p>
                            </div>
                            <Switch
                              checked={appSettings.analyticsEnabled}
                              onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, analyticsEnabled: checked }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Crash Reporting</Label>
                              <p className="text-sm text-gray-600">Automatically report app crashes</p>
                            </div>
                            <Switch
                              checked={appSettings.crashReporting}
                              onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, crashReporting: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Location Services</Label>
                              <p className="text-sm text-gray-600">Access user location for features</p>
                            </div>
                            <Switch
                              checked={appSettings.locationServices}
                              onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, locationServices: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Camera Access</Label>
                              <p className="text-sm text-gray-600">Allow camera access for features</p>
                            </div>
                            <Switch
                              checked={appSettings.cameraAccess}
                              onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, cameraAccess: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Biometric Auth</Label>
                              <p className="text-sm text-gray-600">Enable fingerprint/face unlock</p>
                            </div>
                            <Switch
                              checked={appSettings.biometricAuth}
                              onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, biometricAuth: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => handleSave('App Settings')}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Settings
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
