import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/lib/database.types'
import { 
  StarIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/solid'
import PropertyCard from '@/components/property/PropertyCard'
import { PropertyCardProperty } from '@/components/property/PropertyCard'

// Mock agents data for fallback
const mockAgents = [
  {
    id: 'agent-1',
    title: 'Senior Real Estate Agent',
    bio: 'Specializing in luxury properties',
    experience_years: 8,
    rating: 4.8,
    review_count: 89,
    total_sales: 450000000,
    profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    office: 'Dubai Downtown',
    license_no: '123456789',
    approved: true,
    social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
    brokerage: 'RAGDOL',
    certifications: ['RERA', 'Certified'],
    commission_rate: 2.5,
    languages: ['English', 'Arabic'],
    areas: ['Downtown', 'Marina'],
    verified: true,
    user_id: 'user-1',
    whatsapp: '+971501234567',
    linkedin_url: 'https://linkedin.com',
    instagram_handle: '@agent',
    website_url: 'https://agent.ragdol.ae',
    location: 'Dubai',
    profile_images: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80'],
    specializations: ['Luxury Properties', 'Investment'],
    telegram: null,
    profiles: {
      id: 'user-1',
      full_name: 'Sarah Ahmed',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
      phone: '+971501234567',
      role: 'agent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      phone_verified: true,
      last_login: new Date().toISOString(),
      login_count: 245,
      location: 'Dubai',
      bio: 'Real estate agent',
      preferences: { notifications: true, language: 'en' },
      social_links: { linkedin: 'https://linkedin.com' }
    }
  },
  {
    id: 'agent-2',
    title: 'Luxury Property Specialist',
    bio: 'Expert in Palm Jumeirah',
    experience_years: 10,
    rating: 4.9,
    review_count: 120,
    total_sales: 625000000,
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    office: 'Palm Jumeirah',
    license_no: '987654321',
    approved: true,
    social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
    brokerage: 'RAGDOL',
    certifications: ['RERA', 'Certified'],
    commission_rate: 2.75,
    languages: ['English', 'Arabic', 'French'],
    areas: ['Palm', 'Emirates Hills'],
    verified: true,
    user_id: 'user-2',
    whatsapp: '+971501234568',
    linkedin_url: 'https://linkedin.com',
    instagram_handle: '@agent',
    website_url: 'https://agent2.ragdol.ae',
    location: 'Dubai',
    profile_images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'],
    specializations: ['Luxury Villas', 'Waterfront'],
    telegram: null,
    profiles: {
      id: 'user-2',
      full_name: 'Ahmed Hassan',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      phone: '+971502345678',
      role: 'agent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      phone_verified: true,
      last_login: new Date().toISOString(),
      login_count: 312,
      location: 'Dubai',
      bio: 'Luxury specialist',
      preferences: { notifications: true, language: 'en' },
      social_links: { linkedin: 'https://linkedin.com' }
    }
  },
  {
    id: 'agent-3',
    title: 'Commercial Broker',
    bio: 'Commercial spaces specialist',
    experience_years: 9,
    rating: 4.7,
    review_count: 76,
    total_sales: 380000000,
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    office: 'Business Bay',
    license_no: '456789123',
    approved: true,
    social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
    brokerage: 'RAGDOL',
    certifications: ['RERA', 'Certified'],
    commission_rate: 3.0,
    languages: ['English', 'Arabic', 'Urdu'],
    areas: ['Business Bay', 'Marina'],
    verified: true,
    user_id: 'user-3',
    whatsapp: '+971501234569',
    linkedin_url: 'https://linkedin.com',
    instagram_handle: '@agent',
    website_url: 'https://agent3.ragdol.ae',
    location: 'Dubai',
    profile_images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'],
    specializations: ['Commercial', 'Investment'],
    telegram: null,
    profiles: {
      id: 'user-3',
      full_name: 'Fatima Khan',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      phone: '+971503456789',
      role: 'agent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      phone_verified: true,
      last_login: new Date().toISOString(),
      login_count: 198,
      location: 'Dubai',
      bio: 'Commercial broker',
      preferences: { notifications: true, language: 'en' },
      social_links: { linkedin: 'https://linkedin.com' }
    }
  },
  {
    id: 'agent-4',
    title: 'Investment Advisor',
    bio: 'Property investment specialist',
    experience_years: 7,
    rating: 4.6,
    review_count: 95,
    total_sales: 320000000,
    profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    office: 'Jumeirah Village Circle',
    license_no: '789123456',
    approved: true,
    social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
    brokerage: 'RAGDOL',
    certifications: ['RERA', 'Certified'],
    commission_rate: 2.25,
    languages: ['English', 'Arabic', 'Hindi'],
    areas: ['JVC', 'Dubai Silicon Oasis'],
    verified: true,
    user_id: 'user-4',
    whatsapp: '+971501234570',
    linkedin_url: 'https://linkedin.com',
    instagram_handle: '@agent',
    website_url: 'https://agent4.ragdol.ae',
    location: 'Dubai',
    profile_images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80'],
    specializations: ['Investment', 'Residential'],
    telegram: null,
    profiles: {
      id: 'user-4',
      full_name: 'Maria Rodriguez',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      phone: '+971504567890',
      role: 'agent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      phone_verified: true,
      last_login: new Date().toISOString(),
      login_count: 167,
      location: 'Dubai',
      bio: 'Investment advisor',
      preferences: { notifications: true, language: 'en' },
      social_links: { linkedin: 'https://linkedin.com' }
    }
  },
  {
    id: 'agent-5',
    title: 'Off-Plan Specialist',
    bio: 'New developments expert',
    experience_years: 6,
    rating: 4.8,
    review_count: 82,
    total_sales: 280000000,
    profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    office: 'Dubai Festival City',
    license_no: '321654987',
    approved: true,
    social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
    brokerage: 'RAGDOL',
    certifications: ['RERA', 'Certified'],
    commission_rate: 2.5,
    languages: ['English', 'Arabic'],
    areas: ['Festival City', 'Al Barsha'],
    verified: true,
    user_id: 'user-5',
    whatsapp: '+971501234571',
    linkedin_url: 'https://linkedin.com',
    instagram_handle: '@agent',
    website_url: 'https://agent5.ragdol.ae',
    location: 'Dubai',
    profile_images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'],
    specializations: ['Off-Plan', 'New Developments'],
    telegram: null,
    profiles: {
      id: 'user-5',
      full_name: 'David Chen',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      phone: '+971505678901',
      role: 'agent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      phone_verified: true,
      last_login: new Date().toISOString(),
      login_count: 134,
      location: 'Dubai',
      bio: 'Off-plan specialist',
      preferences: { notifications: true, language: 'en' },
      social_links: { linkedin: 'https://linkedin.com' }
    }
  },
  {
    id: 'agent-6',
    title: 'Rental Specialist',
    bio: 'Long-term rental expert',
    experience_years: 11,
    rating: 4.9,
    review_count: 156,
    total_sales: 420000000,
    profile_image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    office: 'Dubai Marina',
    license_no: '654987321',
    approved: true,
    social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
    brokerage: 'RAGDOL',
    certifications: ['RERA', 'Certified'],
    commission_rate: 1.5,
    languages: ['English', 'Arabic', 'Russian'],
    areas: ['Marina', 'JBR'],
    verified: true,
    user_id: 'user-6',
    whatsapp: '+971501234572',
    linkedin_url: 'https://linkedin.com',
    instagram_handle: '@agent',
    website_url: 'https://agent6.ragdol.ae',
    location: 'Dubai',
    profile_images: ['https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80'],
    specializations: ['Rentals', 'Long-term'],
    telegram: null,
    profiles: {
      id: 'user-6',
      full_name: 'Elena Petrova',
      avatar_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
      phone: '+971506789012',
      role: 'agent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      phone_verified: true,
      last_login: new Date().toISOString(),
      login_count: 289,
      location: 'Dubai',
      bio: 'Rental specialist',
      preferences: { notifications: true, language: 'en' },
      social_links: { linkedin: 'https://linkedin.com' }
    }
  },
  {
    id: 'agent-7',
    title: 'Luxury Villa Specialist',
    bio: 'Exclusive villa properties expert',
    experience_years: 12,
    rating: 4.9,
    review_count: 178,
    total_sales: 890000000,
    profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    office: 'Emirates Hills',
    license_no: '987321654',
    approved: true,
    social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
    brokerage: 'RAGDOL',
    certifications: ['RERA', 'Certified', 'Luxury Specialist'],
    commission_rate: 3.0,
    languages: ['English', 'Arabic', 'French', 'Italian'],
    areas: ['Emirates Hills', 'Palm', 'Jumeirah'],
    verified: true,
    user_id: 'user-7',
    whatsapp: '+971501234573',
    linkedin_url: 'https://linkedin.com',
    instagram_handle: '@agent',
    website_url: 'https://agent7.ragdol.ae',
    location: 'Dubai',
    profile_images: ['https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'],
    specializations: ['Luxury Villas', 'Exclusive Properties'],
    telegram: null,
    profiles: {
      id: 'user-7',
      full_name: 'Isabella Rossi',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      phone: '+971507890123',
      role: 'agent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      phone_verified: true,
      last_login: new Date().toISOString(),
      login_count: 345,
      location: 'Dubai',
      bio: 'Luxury villa specialist',
      preferences: { notifications: true, language: 'en' },
      social_links: { linkedin: 'https://linkedin.com' }
    }
  },
  {
    id: 'agent-8',
    title: 'Commercial Property Broker',
    bio: 'Office and retail space specialist',
    experience_years: 9,
    rating: 4.7,
    review_count: 134,
    total_sales: 560000000,
    profile_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    office: 'Business Bay',
    license_no: '456123789',
    approved: true,
    social: { linkedin: 'https://linkedin.com', instagram: '@agent' },
    brokerage: 'RAGDOL',
    certifications: ['RERA', 'Certified', 'Commercial Broker'],
    commission_rate: 2.75,
    languages: ['English', 'Arabic', 'Urdu'],
    areas: ['Business Bay', 'DIFC', 'Dubai Media City'],
    verified: true,
    user_id: 'user-8',
    whatsapp: '+971501234574',
    linkedin_url: 'https://linkedin.com',
    instagram_handle: '@agent',
    website_url: 'https://agent8.ragdol.ae',
    location: 'Dubai',
    profile_images: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'],
    specializations: ['Commercial', 'Office Spaces', 'Retail'],
    telegram: null,
    profiles: {
      id: 'user-8',
      full_name: 'Ahmed Al-Mansoori',
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      phone: '+971508901234',
      role: 'agent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      phone_verified: true,
      last_login: new Date().toISOString(),
      login_count: 223,
      location: 'Dubai',
      bio: 'Commercial property broker',
      preferences: { notifications: true, language: 'en' },
      social_links: { linkedin: 'https://linkedin.com' }
    }
  }
]

type Agent = Database['public']['Tables']['agents']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']
type AgentWithProfile = Agent & { profiles?: Profile | null }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  // Use mock data
  const mockAgent = mockAgents.find(a => a.id === resolvedParams.id)
  const title = mockAgent?.profiles?.full_name || 'Agent Profile'
  return {
    title: `${title} | RAGDOL Elite Agents`,
    description: `Connect with ${title}, a premier real estate specialist at RAGDOL.`,
  }
}

export default async function AgentDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const agentId = resolvedParams.id

  // Use mock data
  const mockAgent = mockAgents.find(a => a.id === agentId)
  let agent: AgentWithProfile | null = mockAgent as AgentWithProfile || null
  let profile: Profile | null = mockAgent?.profiles || null

  // Mock properties for this agent
  const mockProperties = [
    {
      id: 'prop-1',
      title: 'Luxury Penthouse in Downtown Dubai',
      price: 12500000,
      priceLabel: 'total',
      images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'],
      image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Downtown Dubai, Dubai',
      beds: 4,
      baths: 5,
      sqft: 4200,
      type: 'Penthouse',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Downtown Dubai',
      city: 'Dubai',
      agent_id: agentId,
      created_at: new Date().toISOString()
    },
    {
      id: 'prop-2',
      title: 'Modern Villa with Private Beach',
      price: 8900000,
      priceLabel: 'total',
      images: ['https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=800'],
      image_url: 'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Palm Jumeirah, Dubai',
      beds: 5,
      baths: 6,
      sqft: 5500,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Palm Jumeirah',
      city: 'Dubai',
      agent_id: agentId,
      created_at: new Date().toISOString()
    }
  ]

  // Transform properties to include image field for PropertyCard
  const transformedProperties: PropertyCardProperty[] = mockProperties.map(property => ({
    ...property,
    image: (property.images && Array.isArray(property.images) && property.images[0]) 
      ? property.images[0] 
      : property.image_url || '/api/placeholder/400/300',
    location: property.location || undefined,
    beds: property.beds || undefined,
    baths: property.baths || undefined,
    sqft: property.sqft || undefined,
    type: property.type || undefined,
    featured: property.featured || false,
    currency: property.currency || undefined,
    status: property.status || undefined,
    area: property.area || undefined,
    city: property.city || undefined,
  })) || []

  const propertiesCount = Array.isArray(mockProperties) ? mockProperties.length : 0

  if (!agent && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BriefcaseIcon className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-3xl font-serif text-secondary mb-4">Agent Not Found</h2>
          <p className="text-slate-500 mb-8">The agent profile you are looking for might have been moved or is no longer active.</p>
          <Link href="/agents" className="inline-block px-8 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-primary-light transition-all">
            Back to Agents
          </Link>
        </div>
      </div>
    )
  }

  const name = profile?.full_name || 'Agent'
  const title = agent?.title || 'Real Estate Agent'
  const image = agent?.profile_image || profile?.avatar_url || '/api/placeholder/400/400'

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="relative pt-32 pb-48 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="container-custom relative z-10">
          <Link href="/agents" className="inline-flex items-center text-slate-400 hover:text-primary transition-colors mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back to All Agents
          </Link>
        </div>
      </section>

      <div className="container-custom -mt-32 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 sticky top-24">
              <div className="relative h-96">
                <Image src={image} alt={name} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-secondary/90 to-transparent">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <CheckBadgeIcon className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Verified Expert</span>
                  </div>
                  <h1 className="text-3xl font-serif text-white">{name}</h1>
                  <p className="text-slate-300">{title}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <StarIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-secondary">{agent?.rating || '5.0'} Rating</div>
                      <div className="text-xs text-slate-400">{agent?.review_count || '0'} Reviews</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <BriefcaseIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-secondary">{agent?.experience_years || '5'}+ Years</div>
                      <div className="text-xs text-slate-400">Experience</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-secondary uppercase tracking-wider">Contact Details</h4>
                  <div className="space-y-3">
                    <a href={`tel:${profile?.phone || ''}`} className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors">
                      <PhoneIcon className="w-5 h-5 text-slate-400" />
                      <span>{profile?.phone || '+971 50 000 0000'}</span>
                    </a>
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPinIcon className="w-5 h-5 text-slate-400" />
                      <span>Dubai, United Arab Emirates</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button className="w-full py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all flex items-center justify-center gap-2">
                    <PhoneIcon className="w-5 h-5" />
                    Call Now
                  </button>
                  <button className="w-full py-4 border-2 border-secondary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-3xl font-serif text-secondary mb-6">About <span className="text-primary">{name.split(' ')[0]}</span></h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>{agent?.bio || profile?.bio || `${name} is a dedicated real estate professional at RAGDOL, specializing in the Dubai luxury market. With a deep understanding of local trends and a commitment to excellence, ${name} helps clients find their dream homes and high-yield investment opportunities.`}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-slate-100">
                <div>
                  <h4 className="flex items-center gap-2 text-secondary font-bold mb-4">
                    <AcademicCapIcon className="w-5 h-5 text-primary" />
                    Specializations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {((agent?.specializations ?? []) as string[]).length > 0 ? (
                      ((agent?.specializations ?? []) as string[]).map((s, idx) => (
                        <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 text-sm rounded-lg border border-slate-100">
                          {s}
                        </span>
                      ))
                    ) : (
                      ['Luxury Villas', 'Off-Plan Projects', 'Investment Strategy'].map((s, idx) => (
                        <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 text-sm rounded-lg border border-slate-100">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-secondary font-bold mb-4">
                    <GlobeAltIcon className="w-5 h-5 text-primary" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'Arabic', 'French'].map((lang, idx) => (
                      <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 text-sm rounded-lg border border-slate-100">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Listings */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif text-secondary">Active <span className="text-primary">Listings</span></h2>
                <span className="px-4 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full">
                  {propertiesCount} Properties
                </span>
              </div>

              {propertiesCount > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {transformedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
                  <p className="text-slate-500">No active listings at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
