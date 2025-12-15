'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Mail,
  MessageSquare,
  Phone,
  Send,
  Users,
  Calendar,
  Gift,
  TrendingUp,
  Plus,
  Edit,
  MoreVertical,
  Search,
  Filter,
  Upload,
  X,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Share2,
  Target,
  Zap,
  Clock,
  Award,
  BarChart3,
  Settings,
  Package,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Heart,
  MessageCircle,
  Smartphone,
  Globe,
  Crown,
  Gem,
  Sparkles,
  Scissors,
  Building,
  FileText,
  CreditCard,
  Percent,
  DollarSign
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useCurrencyStore } from "@/stores/currency.store";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledDate?: string;
  createdDate: string;
  targetAudience: string[];
}

interface FollowUpCampaign {
  id: string;
  name: string;
  trigger: 'no_visit_days' | 'booking_cancelled' | 'service_completed' | 'birthday_approaching';
  triggerValue: number;
  message: string;
  channels: ('email' | 'sms' | 'whatsapp')[];
  isActive: boolean;
  sentCount: number;
  conversionCount: number;
}

interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  referrerReward: {
    type: 'points' | 'discount' | 'free_service';
    value: number;
    description: string;
  };
  refereeReward: {
    type: 'points' | 'discount' | 'free_service';
    value: number;
    description: string;
  };
  isActive: boolean;
  totalReferrals: number;
  successfulReferrals: number;
  expiryDate?: string;
}

interface ReviewAutomation {
  id: string;
  platform: 'google' | 'facebook' | 'yelp' | 'custom';
  isEnabled: boolean;
  autoRequestDelay: number; // hours after service
  template: string;
  requestCount: number;
  responseCount: number;
  averageRating: number;
}

interface BirthdayAutomation {
  id: string;
  name: string;
  triggerDays: number; // days before birthday
  message: string;
  offer: {
    type: 'discount' | 'free_service' | 'points';
    value: number;
    description: string;
  };
  channels: ('email' | 'sms' | 'whatsapp')[];
  isActive: boolean;
  sentCount: number;
}

interface MarketingPackage {
  id: string;
  name: string;
  description: string;
  category: 'service_bundle' | 'membership' | 'loyalty_reward' | 'seasonal_offer' | 'birthday_special';
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  services: string[];
  duration: number; // days
  isActive: boolean;
  isFeatured: boolean;
  bookingsCount: number;
  revenue: number;
  imageUrl?: string;
  targetAudience: string[];
  validFrom: string;
  validUntil?: string;
  terms: string;
}

interface PackageAnalytics {
  totalPackages: number;
  activePackages: number;
  totalBookings: number;
  totalRevenue: number;
  averageConversion: number;
  topPerformingPackage: string;
}

export default function AdminMarketing() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getCurrencySymbol } = useCurrencyStore();

  // Email Campaigns State
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: 'Holiday Special Offer',
      subject: 'Exclusive Holiday Discounts - Book Now!',
      content: 'Dear valued customer, enjoy 20% off all services this holiday season...',
      recipients: 500,
      sent: 450,
      opened: 180,
      clicked: 45,
      status: 'sent',
      createdDate: '2025-11-15',
      targetAudience: ['all_customers', 'inactive_30_days']
    },
    {
      id: '2',
      name: 'New Service Launch',
      subject: 'Introducing Our New Premium Hair Treatment',
      content: 'We\'re excited to announce our new premium hair treatment service...',
      recipients: 300,
      sent: 0,
      opened: 0,
      clicked: 0,
      status: 'scheduled',
      scheduledDate: '2025-12-20',
      createdDate: '2025-12-10',
      targetAudience: ['loyal_customers', 'premium_members']
    }
  ]);

  // Follow-up Campaigns State
  const [followUpCampaigns, setFollowUpCampaigns] = useState<FollowUpCampaign[]>([
    {
      id: '1',
      name: 'Inactive Customer Follow-up',
      trigger: 'no_visit_days',
      triggerValue: 30,
      message: 'We miss you! Come back for 15% off your next visit.',
      channels: ['email', 'sms'],
      isActive: true,
      sentCount: 125,
      conversionCount: 18
    },
    {
      id: '2',
      name: 'Post-Service Feedback',
      trigger: 'service_completed',
      triggerValue: 24, // hours
      message: 'How was your experience? Please leave us a review!',
      channels: ['email'],
      isActive: true,
      sentCount: 89,
      conversionCount: 34
    }
  ]);

  // Referral Programs State
  const [referralPrograms, setReferralPrograms] = useState<ReferralProgram[]>([
    {
      id: '1',
      name: 'Friends & Family Program',
      description: 'Refer a friend and both get rewarded!',
      referrerReward: {
        type: 'discount',
        value: 20,
        description: '20% off next service'
      },
      refereeReward: {
        type: 'discount',
        value: 15,
        description: '15% off first service'
      },
      isActive: true,
      totalReferrals: 45,
      successfulReferrals: 32
    }
  ]);

  // Review Automation State
  const [reviewAutomations, setReviewAutomations] = useState<ReviewAutomation[]>([
    {
      id: '1',
      platform: 'google',
      isEnabled: true,
      autoRequestDelay: 24,
      template: 'Thank you for choosing us! Please take a moment to share your experience on Google.',
      requestCount: 156,
      responseCount: 67,
      averageRating: 4.6
    },
    {
      id: '2',
      platform: 'facebook',
      isEnabled: false,
      autoRequestDelay: 48,
      template: 'We hope you loved your visit! Share your experience on Facebook.',
      requestCount: 0,
      responseCount: 0,
      averageRating: 0
    }
  ]);

  // Birthday Automation State
  const [birthdayAutomations, setBirthdayAutomations] = useState<BirthdayAutomation[]>([
    {
      id: '1',
      name: 'Birthday Surprise',
      triggerDays: 3,
      message: 'Happy Birthday! Enjoy 25% off any service as our gift to you!',
      offer: {
        type: 'discount',
        value: 25,
        description: '25% off any service'
      },
      channels: ['email', 'sms'],
      isActive: true,
      sentCount: 23
    }
  ]);

  // UI State
  const [activeTab, setActiveTab] = useState('email');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states for different sections
  const [emailForm, setEmailForm] = useState({
    name: '',
    subject: '',
    content: '',
    targetAudience: [] as string[]
  });

  const [followUpForm, setFollowUpForm] = useState({
    name: '',
    trigger: 'no_visit_days' as const,
    triggerValue: 30,
    message: '',
    channels: [] as ('email' | 'sms' | 'whatsapp')[]
  });

  const [referralForm, setReferralForm] = useState({
    name: '',
    description: '',
    referrerReward: { type: 'discount' as const, value: 20, description: '' },
    refereeReward: { type: 'discount' as const, value: 15, description: '' }
  });

  const [reviewForm, setReviewForm] = useState({
    platform: 'google' as const,
    autoRequestDelay: 24,
    template: ''
  });

  const [birthdayForm, setBirthdayForm] = useState({
    name: '',
    triggerDays: 3,
    message: '',
    offer: { type: 'discount' as const, value: 25, description: '' },
    channels: [] as ('email' | 'sms' | 'whatsapp')[]
  });

  // Package Marketing State
  const [packages, setPackages] = useState<MarketingPackage[]>([
    {
      id: '1',
      name: 'Premium Hair Care Package',
      description: 'Complete hair transformation with premium services',
      category: 'service_bundle',
      price: 150,
      originalPrice: 200,
      discountPercentage: 25,
      services: ['Hair Cut & Style', 'Hair Treatment', 'Scalp Massage'],
      duration: 30,
      isActive: true,
      isFeatured: true,
      bookingsCount: 45,
      revenue: 6750,
      targetAudience: ['new_customers', 'premium_clients'],
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      terms: 'Valid for 30 days from purchase. Cannot be combined with other offers.'
    },
    {
      id: '2',
      name: 'VIP Membership - Annual',
      description: 'Exclusive benefits for our most valued customers',
      category: 'membership',
      price: 299,
      services: ['Priority Booking', 'Monthly Free Service', 'Exclusive Discounts', 'Birthday Special'],
      duration: 365,
      isActive: true,
      isFeatured: true,
      bookingsCount: 23,
      revenue: 6877,
      targetAudience: ['loyal_customers', 'high_spenders'],
      validFrom: '2025-01-01',
      terms: 'Annual membership with automatic renewal. 30-day cancellation notice required.'
    },
    {
      id: '3',
      name: 'Loyalty Rewards Bundle',
      description: 'Special package for our loyal customers',
      category: 'loyalty_reward',
      price: 0,
      services: ['Free Hair Wash', 'Complimentary Styling', 'Priority Service'],
      duration: 7,
      isActive: true,
      isFeatured: false,
      bookingsCount: 156,
      revenue: 0,
      targetAudience: ['loyalty_members'],
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      terms: 'Available to customers with 500+ loyalty points. One-time redemption.'
    },
    {
      id: '4',
      name: 'Holiday Glow Package',
      description: 'Get ready for the holidays with our special treatment',
      category: 'seasonal_offer',
      price: 120,
      originalPrice: 160,
      discountPercentage: 25,
      services: ['Deep Conditioning Treatment', 'Holiday Hair Style', 'Makeup Application'],
      duration: 14,
      isActive: true,
      isFeatured: true,
      bookingsCount: 78,
      revenue: 9360,
      targetAudience: ['all_customers'],
      validFrom: '2025-11-01',
      validUntil: '2025-12-31',
      terms: 'Holiday special offer. Limited time only.'
    },
    {
      id: '5',
      name: 'Birthday Bliss Package',
      description: 'Celebrate your special day with us',
      category: 'birthday_special',
      price: 89,
      services: ['Birthday Hair Style', 'Complimentary Cake', 'Photo Session'],
      duration: 1,
      isActive: true,
      isFeatured: false,
      bookingsCount: 34,
      revenue: 3026,
      targetAudience: ['birthday_customers'],
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      terms: 'Available only on customer\'s birthday month. Advance booking required.'
    }
  ]);

  const [packageAnalytics, setPackageAnalytics] = useState<PackageAnalytics>({
    totalPackages: 5,
    activePackages: 5,
    totalBookings: 336,
    totalRevenue: 26013,
    averageConversion: 68.5,
    topPerformingPackage: 'Premium Hair Care Package'
  });

  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    category: 'service_bundle' as MarketingPackage['category'],
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    services: [] as string[],
    duration: 30,
    isActive: true,
    isFeatured: false,
    targetAudience: [] as string[],
    validFrom: '',
    validUntil: '',
    terms: ''
  });

  const [editingPackage, setEditingPackage] = useState<MarketingPackage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleCreateEmailCampaign = () => {
    const newCampaign: EmailCampaign = {
      id: Date.now().toString(),
      name: emailForm.name,
      subject: emailForm.subject,
      content: emailForm.content,
      recipients: 0,
      sent: 0,
      opened: 0,
      clicked: 0,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      targetAudience: emailForm.targetAudience
    };
    setEmailCampaigns([...emailCampaigns, newCampaign]);
    setEmailForm({ name: '', subject: '', content: '', targetAudience: [] });
    setShowCreateDialog(false);
  };

  const handleCreateFollowUp = () => {
    const newFollowUp: FollowUpCampaign = {
      id: Date.now().toString(),
      name: followUpForm.name,
      trigger: followUpForm.trigger,
      triggerValue: followUpForm.triggerValue,
      message: followUpForm.message,
      channels: followUpForm.channels,
      isActive: true,
      sentCount: 0,
      conversionCount: 0
    };
    setFollowUpCampaigns([...followUpCampaigns, newFollowUp]);
    setFollowUpForm({
      name: '',
      trigger: 'no_visit_days',
      triggerValue: 30,
      message: '',
      channels: []
    });
    setShowCreateDialog(false);
  };

  const handleCreateReferral = () => {
    const newReferral: ReferralProgram = {
      id: Date.now().toString(),
      name: referralForm.name,
      description: referralForm.description,
      referrerReward: referralForm.referrerReward,
      refereeReward: referralForm.refereeReward,
      isActive: true,
      totalReferrals: 0,
      successfulReferrals: 0
    };
    setReferralPrograms([...referralPrograms, newReferral]);
    setReferralForm({
      name: '',
      description: '',
      referrerReward: { type: 'discount', value: 20, description: '' },
      refereeReward: { type: 'discount', value: 15, description: '' }
    });
    setShowCreateDialog(false);
  };

  const handleCreateReviewAutomation = () => {
    const newReview: ReviewAutomation = {
      id: Date.now().toString(),
      platform: reviewForm.platform,
      isEnabled: true,
      autoRequestDelay: reviewForm.autoRequestDelay,
      template: reviewForm.template,
      requestCount: 0,
      responseCount: 0,
      averageRating: 0
    };
    setReviewAutomations([...reviewAutomations, newReview]);
    setReviewForm({
      platform: 'google',
      autoRequestDelay: 24,
      template: ''
    });
    setShowCreateDialog(false);
  };

  const handleCreateBirthdayAutomation = () => {
    const newBirthday: BirthdayAutomation = {
      id: Date.now().toString(),
      name: birthdayForm.name,
      triggerDays: birthdayForm.triggerDays,
      message: birthdayForm.message,
      offer: birthdayForm.offer,
      channels: birthdayForm.channels,
      isActive: true,
      sentCount: 0
    };
    setBirthdayAutomations([...birthdayAutomations, newBirthday]);
    setBirthdayForm({
      name: '',
      triggerDays: 3,
      message: '',
      offer: { type: 'discount', value: 25, description: '' },
      channels: []
    });
    setShowCreateDialog(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary' as const,
      scheduled: 'outline' as const,
      sending: 'default' as const,
      sent: 'default' as const,
      failed: 'destructive' as const
    };
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  // Package handlers
  const handleCreatePackage = () => {
    const newPackage: MarketingPackage = {
      id: Date.now().toString(),
      name: packageForm.name,
      description: packageForm.description,
      category: packageForm.category,
      price: packageForm.price,
      originalPrice: packageForm.originalPrice || undefined,
      discountPercentage: packageForm.discountPercentage || undefined,
      services: packageForm.services,
      duration: packageForm.duration,
      isActive: packageForm.isActive,
      isFeatured: packageForm.isFeatured,
      bookingsCount: 0,
      revenue: 0,
      targetAudience: packageForm.targetAudience,
      validFrom: packageForm.validFrom,
      validUntil: packageForm.validUntil || undefined,
      terms: packageForm.terms
    };
    setPackages([...packages, newPackage]);
    resetPackageForm();
    setShowCreateDialog(false);
  };

  const handleEditPackage = (pkg: MarketingPackage) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      description: pkg.description,
      category: pkg.category,
      price: pkg.price,
      originalPrice: pkg.originalPrice || 0,
      discountPercentage: pkg.discountPercentage || 0,
      services: pkg.services,
      duration: pkg.duration,
      isActive: pkg.isActive,
      isFeatured: pkg.isFeatured,
      targetAudience: pkg.targetAudience,
      validFrom: pkg.validFrom,
      validUntil: pkg.validUntil || '',
      terms: pkg.terms
    });
    setShowCreateDialog(true);
  };

  const handleUpdatePackage = () => {
    if (!editingPackage) return;

    const updatedPackage: MarketingPackage = {
      ...editingPackage,
      name: packageForm.name,
      description: packageForm.description,
      category: packageForm.category,
      price: packageForm.price,
      originalPrice: packageForm.originalPrice || undefined,
      discountPercentage: packageForm.discountPercentage || undefined,
      services: packageForm.services,
      duration: packageForm.duration,
      isActive: packageForm.isActive,
      isFeatured: packageForm.isFeatured,
      targetAudience: packageForm.targetAudience,
      validFrom: packageForm.validFrom,
      validUntil: packageForm.validUntil || undefined,
      terms: packageForm.terms
    };

    setPackages(packages.map(pkg => pkg.id === editingPackage.id ? updatedPackage : pkg));
    setEditingPackage(null);
    resetPackageForm();
    setShowCreateDialog(false);
  };

  const resetPackageForm = () => {
    setPackageForm({
      name: '',
      description: '',
      category: 'service_bundle',
      price: 0,
      originalPrice: 0,
      discountPercentage: 0,
      services: [],
      duration: 30,
      isActive: true,
      isFeatured: false,
      targetAudience: [],
      validFrom: '',
      validUntil: '',
      terms: ''
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'service_bundle': return <Package className="w-4 h-4" />;
      case 'membership': return <Crown className="w-4 h-4" />;
      case 'loyalty_reward': return <Award className="w-4 h-4" />;
      case 'seasonal_offer': return <Calendar className="w-4 h-4" />;
      case 'birthday_special': return <Gift className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'service_bundle': return 'Service Bundle';
      case 'membership': return 'Membership';
      case 'loyalty_reward': return 'Loyalty Reward';
      case 'seasonal_offer': return 'Seasonal Offer';
      case 'birthday_special': return 'Birthday Special';
      default: return category;
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar role="branch_admin" onLogout={logout} />
        <AdminMobileSidebar
          role="branch_admin"
          onLogout={logout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketing & Retention</h1>
                <p className="text-gray-600">Manage campaigns, automation, and customer engagement</p>
              </div>
              <div className="flex items-center gap-4">
                <CurrencySwitcher />
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Campaign
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="bg-white border-b px-4 py-2">
                <TabsList className="grid w-full grid-cols-7 max-w-5xl">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Campaigns
                  </TabsTrigger>
                  <TabsTrigger value="packages" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Packages
                  </TabsTrigger>
                  <TabsTrigger value="followup" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Follow-ups
                  </TabsTrigger>
                  <TabsTrigger value="referral" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Referrals
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Reviews
                  </TabsTrigger>
                  <TabsTrigger value="birthday" className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Birthdays
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Email Campaigns Tab */}
              <TabsContent value="email" className="flex-1 m-0 overflow-hidden">
                <div className="h-full overflow-auto p-6">
                  <div className="grid gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold">2</p>
                              <p className="text-sm text-gray-600">Active Campaigns</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Send className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold">450</p>
                              <p className="text-sm text-gray-600">Emails Sent</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Eye className="w-8 h-8 text-purple-600" />
                            <div>
                              <p className="text-2xl font-bold">36%</p>
                              <p className="text-sm text-gray-600">Open Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Target className="w-8 h-8 text-orange-600" />
                            <div>
                              <p className="text-2xl font-bold">10%</p>
                              <p className="text-sm text-gray-600">Click Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Campaigns Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Campaigns</CardTitle>
                        <CardDescription>Manage your email marketing campaigns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Campaign Name</TableHead>
                              <TableHead>Subject</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Sent</TableHead>
                              <TableHead>Open Rate</TableHead>
                              <TableHead>Click Rate</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {emailCampaigns.map((campaign) => (
                              <TableRow key={campaign.id}>
                                <TableCell className="font-medium">{campaign.name}</TableCell>
                                <TableCell>{campaign.subject}</TableCell>
                                <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                                <TableCell>{campaign.sent}/{campaign.recipients}</TableCell>
                                <TableCell>{campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%</TableCell>
                                <TableCell>{campaign.sent > 0 ? Math.round((campaign.clicked / campaign.sent) * 100) : 0}%</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Packages Tab */}
              <TabsContent value="packages" className="flex-1 m-0 overflow-hidden">
                <div className="h-full overflow-auto p-6">
                  <div className="grid gap-6">
                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold">{packageAnalytics.totalPackages}</p>
                              <p className="text-sm text-gray-600">Total Packages</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Check className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold">{packageAnalytics.activePackages}</p>
                              <p className="text-sm text-gray-600">Active Packages</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-8 h-8 text-purple-600" />
                            <div>
                              <p className="text-2xl font-bold">{packageAnalytics.totalBookings}</p>
                              <p className="text-sm text-gray-600">Total Bookings</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-8 h-8 text-orange-600" />
                            <div>
                              <p className="text-2xl font-bold">{getCurrencySymbol()}{packageAnalytics.totalRevenue.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Total Revenue</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Package Management Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Package Management</h2>
                        <p className="text-gray-600">Create and manage promotional packages and special offers</p>
                      </div>
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Package
                      </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Search packages..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full md:w-48">
                              <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="service_bundle">Service Bundle</SelectItem>
                              <SelectItem value="membership">Membership</SelectItem>
                              <SelectItem value="loyalty_reward">Loyalty Reward</SelectItem>
                              <SelectItem value="seasonal_offer">Seasonal Offer</SelectItem>
                              <SelectItem value="birthday_special">Birthday Special</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Packages Grid */}
                    <div className="grid gap-4">
                      {filteredPackages.map((pkg) => (
                        <Card key={pkg.id} className={cn("transition-all hover:shadow-md", pkg.isFeatured && "ring-2 ring-blue-500")}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  {getCategoryIcon(pkg.category)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                    {pkg.isFeatured && (
                                      <Badge variant="default" className="bg-blue-500">
                                        <Star className="w-3 h-3 mr-1" />
                                        Featured
                                      </Badge>
                                    )}
                                    <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                                      {pkg.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                  <CardDescription>{pkg.description}</CardDescription>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{getCategoryLabel(pkg.category)}</Badge>
                                    <span className="text-sm text-gray-600">
                                      {pkg.duration} days validity
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-2">
                                  {pkg.originalPrice && pkg.originalPrice > pkg.price ? (
                                    <>
                                      <span className="text-lg font-bold text-green-600">
                                        {getCurrencySymbol()}{pkg.price}
                                      </span>
                                      <span className="text-sm text-gray-500 line-through">
                                        {getCurrencySymbol()}{pkg.originalPrice}
                                      </span>
                                      <Badge variant="destructive" className="text-xs">
                                        -{pkg.discountPercentage}%
                                      </Badge>
                                    </>
                                  ) : (
                                    <span className="text-lg font-bold">
                                      {pkg.price === 0 ? 'Free' : `${getCurrencySymbol()}${pkg.price}`}
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <p>{pkg.bookingsCount} bookings</p>
                                  <p>{getCurrencySymbol()}{pkg.revenue.toLocaleString()} revenue</p>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm font-medium">Included Services:</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {pkg.services.map((service, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Target Audience:</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {pkg.targetAudience.map((audience, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {audience.replace('_', ' ')}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2">
                                <div className="text-sm text-gray-600">
                                  <p>Valid from: {new Date(pkg.validFrom).toLocaleDateString()}</p>
                                  {pkg.validUntil && (
                                    <p>Valid until: {new Date(pkg.validUntil).toLocaleDateString()}</p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem onClick={() => handleEditPackage(pkg)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Package
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Target className="w-4 h-4 mr-2" />
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Follow-ups Tab */}
              <TabsContent value="followup" className="flex-1 m-0 overflow-hidden">
                <div className="h-full overflow-auto p-6">
                  <div className="grid gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold">2</p>
                              <p className="text-sm text-gray-600">Active Campaigns</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Send className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold">214</p>
                              <p className="text-sm text-gray-600">Messages Sent</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                            <div>
                              <p className="text-2xl font-bold">24%</p>
                              <p className="text-sm text-gray-600">Conversion Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Follow-up Campaigns */}
                    <div className="grid gap-4">
                      {followUpCampaigns.map((campaign) => (
                        <Card key={campaign.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {campaign.name}
                                  <Badge variant={campaign.isActive ? 'default' : 'secondary'}>
                                    {campaign.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </CardTitle>
                                <CardDescription>
                                  Trigger: {campaign.trigger.replace('_', ' ')} - {campaign.triggerValue} {campaign.trigger === 'no_visit_days' ? 'days' : 'hours'}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <p className="text-sm font-medium">Sent: {campaign.sentCount}</p>
                                  <p className="text-sm text-gray-600">Converted: {campaign.conversionCount}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm"><strong>Message:</strong> {campaign.message}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Channels:</span>
                                {campaign.channels.map((channel) => (
                                  <Badge key={channel} variant="outline" className="text-xs">
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Referral Programs Tab */}
              <TabsContent value="referral" className="flex-1 m-0 overflow-hidden">
                <div className="h-full overflow-auto p-6">
                  <div className="grid gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Share2 className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold">1</p>
                              <p className="text-sm text-gray-600">Active Programs</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold">45</p>
                              <p className="text-sm text-gray-600">Total Referrals</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Award className="w-8 h-8 text-purple-600" />
                            <div>
                              <p className="text-2xl font-bold">71%</p>
                              <p className="text-sm text-gray-600">Success Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Referral Programs */}
                    <div className="grid gap-4">
                      {referralPrograms.map((program) => (
                        <Card key={program.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {program.name}
                                  <Badge variant={program.isActive ? 'default' : 'secondary'}>
                                    {program.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </CardTitle>
                                <CardDescription>{program.description}</CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <p className="text-sm font-medium">Referrals: {program.totalReferrals}</p>
                                  <p className="text-sm text-gray-600">Successful: {program.successfulReferrals}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium text-green-700">Referrer Reward</h4>
                                <p className="text-sm">{program.referrerReward.description}</p>
                                <Badge variant="outline">{program.referrerReward.type}</Badge>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium text-blue-700">Referee Reward</h4>
                                <p className="text-sm">{program.refereeReward.description}</p>
                                <Badge variant="outline">{program.refereeReward.type}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="flex-1 m-0 overflow-hidden">
                <div className="h-full overflow-auto p-6">
                  <div className="grid gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold">2</p>
                              <p className="text-sm text-gray-600">Platforms</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold">156</p>
                              <p className="text-sm text-gray-600">Requests Sent</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Heart className="w-8 h-8 text-purple-600" />
                            <div>
                              <p className="text-2xl font-bold">67</p>
                              <p className="text-sm text-gray-600">Reviews Received</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-8 h-8 text-orange-600" />
                            <div>
                              <p className="text-2xl font-bold">4.6</p>
                              <p className="text-sm text-gray-600">Avg Rating</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Review Automations */}
                    <div className="grid gap-4">
                      {reviewAutomations.map((automation) => (
                        <Card key={automation.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {automation.platform.charAt(0).toUpperCase() + automation.platform.slice(1)} Reviews
                                  <Badge variant={automation.isEnabled ? 'default' : 'secondary'}>
                                    {automation.isEnabled ? 'Enabled' : 'Disabled'}
                                  </Badge>
                                </CardTitle>
                                <CardDescription>
                                  Auto-request {automation.autoRequestDelay} hours after service
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <p className="text-sm font-medium">Requests: {automation.requestCount}</p>
                                  <p className="text-sm text-gray-600">Reviews: {automation.responseCount}</p>
                                  <p className="text-sm text-gray-600">Rating: {automation.averageRating.toFixed(1)} ⭐</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <Settings className="w-4 h-4 mr-2" />
                                      Configure
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm"><strong>Template:</strong> {automation.template}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Birthday Automation Tab */}
              <TabsContent value="birthday" className="flex-1 m-0 overflow-hidden">
                <div className="h-full overflow-auto p-6">
                  <div className="grid gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Gift className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold">1</p>
                              <p className="text-sm text-gray-600">Active Automations</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold">23</p>
                              <p className="text-sm text-gray-600">Messages Sent</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Heart className="w-8 h-8 text-purple-600" />
                            <div>
                              <p className="text-2xl font-bold">85%</p>
                              <p className="text-sm text-gray-600">Redemption Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Birthday Automations */}
                    <div className="grid gap-4">
                      {birthdayAutomations.map((automation) => (
                        <Card key={automation.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {automation.name}
                                  <Badge variant={automation.isActive ? 'default' : 'secondary'}>
                                    {automation.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </CardTitle>
                                <CardDescription>
                                  Trigger {automation.triggerDays} days before birthday
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <p className="text-sm font-medium">Sent: {automation.sentCount}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm"><strong>Message:</strong> {automation.message}</p>
                              <div className="flex items-center gap-4">
                                <div>
                                  <span className="text-sm font-medium">Offer:</span>
                                  <p className="text-sm">{automation.offer.description}</p>
                                  <Badge variant="outline" className="mt-1">{automation.offer.type}</Badge>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Channels:</span>
                                  <div className="flex gap-1 mt-1">
                                    {automation.channels.map((channel) => (
                                      <Badge key={channel} variant="outline" className="text-xs">
                                        {channel}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="flex-1 m-0 overflow-hidden">
                <div className="h-full overflow-auto p-6">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Marketing Analytics Overview</CardTitle>
                        <CardDescription>Performance metrics across all marketing channels</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold">36%</p>
                            <p className="text-sm text-gray-600">Email Open Rate</p>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold">43%</p>
                            <p className="text-sm text-gray-600">SMS Response Rate</p>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <Share2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold">71%</p>
                            <p className="text-sm text-gray-600">Referral Success</p>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold">4.6</p>
                            <p className="text-sm text-gray-600">Avg Review Rating</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Impact</CardTitle>
                        <CardDescription>How marketing efforts contribute to revenue</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Email Campaigns</span>
                            <span className="font-semibold">$2,450</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Referral Program</span>
                            <span className="font-semibold">$1,890</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Birthday Offers</span>
                            <span className="font-semibold">$780</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Follow-up Campaigns</span>
                            <span className="font-semibold">$1,230</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                          </div>
                          <p className="text-sm text-gray-600">Total Marketing ROI: 245%</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Choose the type of marketing campaign you want to create.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="followup">Follow-up</TabsTrigger>
              <TabsTrigger value="referral">Referral</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="birthday">Birthday</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="email-name">Campaign Name</Label>
                  <Input
                    id="email-name"
                    value={emailForm.name}
                    onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject">Subject Line</Label>
                  <Input
                    id="email-subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="email-content">Content</Label>
                  <Textarea
                    id="email-content"
                    value={emailForm.content}
                    onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
                    placeholder="Enter email content"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Target Audience</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['all_customers', 'inactive_30_days', 'loyal_customers', 'new_customers'].map((audience) => (
                      <Badge
                        key={audience}
                        variant={emailForm.targetAudience.includes(audience) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          const newAudience = emailForm.targetAudience.includes(audience)
                            ? emailForm.targetAudience.filter(a => a !== audience)
                            : [...emailForm.targetAudience, audience];
                          setEmailForm({...emailForm, targetAudience: newAudience});
                        }}
                      >
                        {audience.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateEmailCampaign} className="w-full">
                Create Email Campaign
              </Button>
            </TabsContent>

            <TabsContent value="followup" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="followup-name">Campaign Name</Label>
                  <Input
                    id="followup-name"
                    value={followUpForm.name}
                    onChange={(e) => setFollowUpForm({...followUpForm, name: e.target.value})}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="followup-trigger">Trigger Type</Label>
                    <Select value={followUpForm.trigger} onValueChange={(value: any) => setFollowUpForm({...followUpForm, trigger: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_visit_days">Days Since Last Visit</SelectItem>
                        <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                        <SelectItem value="service_completed">Service Completed</SelectItem>
                        <SelectItem value="birthday_approaching">Birthday Approaching</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="followup-value">Trigger Value</Label>
                    <Input
                      id="followup-value"
                      type="number"
                      value={followUpForm.triggerValue}
                      onChange={(e) => setFollowUpForm({...followUpForm, triggerValue: parseInt(e.target.value)})}
                      placeholder="Enter value"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="followup-message">Message</Label>
                  <Textarea
                    id="followup-message"
                    value={followUpForm.message}
                    onChange={(e) => setFollowUpForm({...followUpForm, message: e.target.value})}
                    placeholder="Enter follow-up message"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Channels</Label>
                  <div className="flex gap-4 mt-2">
                    {['email', 'sms', 'whatsapp'].map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={`followup-${channel}`}
                          checked={followUpForm.channels.includes(channel as any)}
                          onCheckedChange={(checked) => {
                            const newChannels = checked
                              ? [...followUpForm.channels, channel as any]
                              : followUpForm.channels.filter(c => c !== channel);
                            setFollowUpForm({...followUpForm, channels: newChannels});
                          }}
                        />
                        <Label htmlFor={`followup-${channel}`} className="capitalize">{channel}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateFollowUp} className="w-full">
                Create Follow-up Campaign
              </Button>
            </TabsContent>

            <TabsContent value="referral" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="referral-name">Program Name</Label>
                  <Input
                    id="referral-name"
                    value={referralForm.name}
                    onChange={(e) => setReferralForm({...referralForm, name: e.target.value})}
                    placeholder="Enter program name"
                  />
                </div>
                <div>
                  <Label htmlFor="referral-description">Description</Label>
                  <Textarea
                    id="referral-description"
                    value={referralForm.description}
                    onChange={(e) => setReferralForm({...referralForm, description: e.target.value})}
                    placeholder="Describe the referral program"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Referrer Reward</Label>
                    <Select value={referralForm.referrerReward.type} onValueChange={(value: any) => setReferralForm({
                      ...referralForm,
                      referrerReward: {...referralForm.referrerReward, type: value}
                    })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="points">Loyalty Points</SelectItem>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="free_service">Free Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={referralForm.referrerReward.value}
                      onChange={(e) => setReferralForm({
                        ...referralForm,
                        referrerReward: {...referralForm.referrerReward, value: parseInt(e.target.value)}
                      })}
                      placeholder="Value"
                      type="number"
                    />
                    <Input
                      value={referralForm.referrerReward.description}
                      onChange={(e) => setReferralForm({
                        ...referralForm,
                        referrerReward: {...referralForm.referrerReward, description: e.target.value}
                      })}
                      placeholder="Description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Referee Reward</Label>
                    <Select value={referralForm.refereeReward.type} onValueChange={(value: any) => setReferralForm({
                      ...referralForm,
                      refereeReward: {...referralForm.refereeReward, type: value}
                    })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="points">Loyalty Points</SelectItem>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="free_service">Free Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={referralForm.refereeReward.value}
                      onChange={(e) => setReferralForm({
                        ...referralForm,
                        refereeReward: {...referralForm.refereeReward, value: parseInt(e.target.value)}
                      })}
                      placeholder="Value"
                      type="number"
                    />
                    <Input
                      value={referralForm.refereeReward.description}
                      onChange={(e) => setReferralForm({
                        ...referralForm,
                        refereeReward: {...referralForm.refereeReward, description: e.target.value}
                      })}
                      placeholder="Description"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateReferral} className="w-full">
                Create Referral Program
              </Button>
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="review-platform">Platform</Label>
                  <Select value={reviewForm.platform} onValueChange={(value: any) => setReviewForm({...reviewForm, platform: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="yelp">Yelp</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="review-delay">Auto-request Delay (hours)</Label>
                  <Input
                    id="review-delay"
                    type="number"
                    value={reviewForm.autoRequestDelay}
                    onChange={(e) => setReviewForm({...reviewForm, autoRequestDelay: parseInt(e.target.value)})}
                    placeholder="24"
                  />
                </div>
                <div>
                  <Label htmlFor="review-template">Request Template</Label>
                  <Textarea
                    id="review-template"
                    value={reviewForm.template}
                    onChange={(e) => setReviewForm({...reviewForm, template: e.target.value})}
                    placeholder="Enter review request message"
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleCreateReviewAutomation} className="w-full">
                Create Review Automation
              </Button>
            </TabsContent>

            <TabsContent value="birthday" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="birthday-name">Automation Name</Label>
                  <Input
                    id="birthday-name"
                    value={birthdayForm.name}
                    onChange={(e) => setBirthdayForm({...birthdayForm, name: e.target.value})}
                    placeholder="Enter automation name"
                  />
                </div>
                <div>
                  <Label htmlFor="birthday-trigger">Days Before Birthday</Label>
                  <Input
                    id="birthday-trigger"
                    type="number"
                    value={birthdayForm.triggerDays}
                    onChange={(e) => setBirthdayForm({...birthdayForm, triggerDays: parseInt(e.target.value)})}
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label htmlFor="birthday-message">Message</Label>
                  <Textarea
                    id="birthday-message"
                    value={birthdayForm.message}
                    onChange={(e) => setBirthdayForm({...birthdayForm, message: e.target.value})}
                    placeholder="Enter birthday message"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Offer Type</Label>
                    <Select value={birthdayForm.offer.type} onValueChange={(value: any) => setBirthdayForm({
                      ...birthdayForm,
                      offer: {...birthdayForm.offer, type: value}
                    })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="free_service">Free Service</SelectItem>
                        <SelectItem value="points">Loyalty Points</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={birthdayForm.offer.value}
                      onChange={(e) => setBirthdayForm({
                        ...birthdayForm,
                        offer: {...birthdayForm.offer, value: parseInt(e.target.value)}
                      })}
                      placeholder="Value"
                      type="number"
                    />
                    <Input
                      value={birthdayForm.offer.description}
                      onChange={(e) => setBirthdayForm({
                        ...birthdayForm,
                        offer: {...birthdayForm.offer, description: e.target.value}
                      })}
                      placeholder="Description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Channels</Label>
                    <div className="flex flex-col gap-2 mt-2">
                      {['email', 'sms', 'whatsapp'].map((channel) => (
                        <div key={channel} className="flex items-center space-x-2">
                          <Checkbox
                            id={`birthday-${channel}`}
                            checked={birthdayForm.channels.includes(channel as any)}
                            onCheckedChange={(checked) => {
                              const newChannels = checked
                                ? [...birthdayForm.channels, channel as any]
                                : birthdayForm.channels.filter(c => c !== channel);
                              setBirthdayForm({...birthdayForm, channels: newChannels});
                            }}
                          />
                          <Label htmlFor={`birthday-${channel}`} className="capitalize">{channel}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateBirthdayAutomation} className="w-full">
                Create Birthday Automation
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Package Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? 'Edit Package' : 'Create New Marketing Package'}</DialogTitle>
            <DialogDescription>
              {editingPackage ? 'Update the package details' : 'Create a new marketing package or special offer'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="package-name">Package Name</Label>
                <Input
                  id="package-name"
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                  placeholder="Enter package name"
                />
              </div>
              <div>
                <Label htmlFor="package-category">Category</Label>
                <Select value={packageForm.category} onValueChange={(value: any) => setPackageForm({...packageForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service_bundle">Service Bundle</SelectItem>
                    <SelectItem value="membership">Membership</SelectItem>
                    <SelectItem value="loyalty_reward">Loyalty Reward</SelectItem>
                    <SelectItem value="seasonal_offer">Seasonal Offer</SelectItem>
                    <SelectItem value="birthday_special">Birthday Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="package-description">Description</Label>
              <Textarea
                id="package-description"
                value={packageForm.description}
                onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                placeholder="Describe the package"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="package-price">Price ({getCurrencySymbol()})</Label>
                <Input
                  id="package-price"
                  type="number"
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({...packageForm, price: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="package-original-price">Original Price ({getCurrencySymbol()})</Label>
                <Input
                  id="package-original-price"
                  type="number"
                  value={packageForm.originalPrice}
                  onChange={(e) => setPackageForm({...packageForm, originalPrice: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="package-discount">Discount (%)</Label>
                <Input
                  id="package-discount"
                  type="number"
                  value={packageForm.discountPercentage}
                  onChange={(e) => setPackageForm({...packageForm, discountPercentage: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label>Services Included</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Hair Cut & Style', 'Hair Treatment', 'Scalp Massage', 'Hair Wash', 'Styling', 'Color Service', 'Deep Conditioning', 'Hair Extensions', 'Makeup', 'Nails'].map((service) => (
                  <Badge
                    key={service}
                    variant={packageForm.services.includes(service) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newServices = packageForm.services.includes(service)
                        ? packageForm.services.filter(s => s !== service)
                        : [...packageForm.services, service];
                      setPackageForm({...packageForm, services: newServices});
                    }}
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="package-duration">Validity Period (days)</Label>
                <Input
                  id="package-duration"
                  type="number"
                  value={packageForm.duration}
                  onChange={(e) => setPackageForm({...packageForm, duration: parseInt(e.target.value) || 30})}
                  placeholder="30"
                />
              </div>
              <div>
                <Label>Target Audience</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['all_customers', 'new_customers', 'loyal_customers', 'premium_clients', 'birthday_customers', 'loyalty_members', 'high_spenders'].map((audience) => (
                    <Badge
                      key={audience}
                      variant={packageForm.targetAudience.includes(audience) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const newAudience = packageForm.targetAudience.includes(audience)
                          ? packageForm.targetAudience.filter(a => a !== audience)
                          : [...packageForm.targetAudience, audience];
                        setPackageForm({...packageForm, targetAudience: newAudience});
                      }}
                    >
                      {audience.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valid-from">Valid From</Label>
                <Input
                  id="valid-from"
                  type="date"
                  value={packageForm.validFrom}
                  onChange={(e) => setPackageForm({...packageForm, validFrom: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="valid-until">Valid Until (Optional)</Label>
                <Input
                  id="valid-until"
                  type="date"
                  value={packageForm.validUntil}
                  onChange={(e) => setPackageForm({...packageForm, validUntil: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="package-terms">Terms & Conditions</Label>
              <Textarea
                id="package-terms"
                value={packageForm.terms}
                onChange={(e) => setPackageForm({...packageForm, terms: e.target.value})}
                placeholder="Enter terms and conditions"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="package-active"
                  checked={packageForm.isActive}
                  onCheckedChange={(checked) => setPackageForm({...packageForm, isActive: !!checked})}
                />
                <Label htmlFor="package-active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="package-featured"
                  checked={packageForm.isFeatured}
                  onCheckedChange={(checked) => setPackageForm({...packageForm, isFeatured: !!checked})}
                />
                <Label htmlFor="package-featured">Featured</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={editingPackage ? handleUpdatePackage : handleCreatePackage}
                className="flex-1"
              >
                {editingPackage ? 'Update Package' : 'Create Package'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingPackage(null);
                  resetPackageForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}