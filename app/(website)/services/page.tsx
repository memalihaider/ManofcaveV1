'use client'

import { CheckIcon, SparklesIcon, ChartBarIcon, ShieldCheckIcon, DocumentTextIcon, BanknotesIcon, PaintBrushIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import AgentSlider from '@/components/agent/AgentSlider'
import { getTopAgents } from '@/lib/mock-data'

const services = [
  {
    id: '1',
    title: 'Elite Property Valuation',
    description: 'Precision market valuation for high-value residential and commercial assets using proprietary data models.',
    features: ['Algorithmic Market Analysis', 'Comparative Asset Study', 'Certified Valuation Reports', 'Expert On-site Assessment'],
    icon: ChartBarIcon,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Investment Advisory',
    description: 'Bespoke investment strategies designed for global institutional investors and high-net-worth individuals.',
    features: ['Portfolio Diversification', 'Yield Optimization', 'Risk Mitigation Strategies', 'Off-market Opportunities'],
    icon: SparklesIcon,
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Asset Management',
    description: 'Comprehensive management of luxury portfolios, ensuring seamless operations and maximum asset preservation.',
    features: ['VIP Tenant Relations', 'Preventative Maintenance', 'Financial Reporting', 'Legal Compliance'],
    icon: ShieldCheckIcon,
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    title: 'Legal & Conveyancing',
    description: 'Expert handling of complex real estate legalities, ensuring every transaction is secure and transparent.',
    features: ['SPA Preparation', 'Title Deed Registration', 'DLD Liaison', 'Escrow Management'],
    icon: DocumentTextIcon,
    image: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    title: 'Structured Finance',
    description: 'Tailored mortgage and financing solutions through our network of premier global banking partners.',
    features: ['Non-resident Mortgages', 'Equity Release', 'Commercial Financing', 'Preferential Rates'],
    icon: BanknotesIcon,
    image: 'https://images.pexels.com/photos/2121287/pexels-photo-2121287.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '6',
    title: 'Interior Curation',
    description: 'Transforming spaces into masterpieces through our award-winning interior design and renovation partners.',
    features: ['Concept Design', 'Bespoke Furnishing', 'Project Management', 'Turnkey Solutions'],
    icon: PaintBrushIcon,
    image: 'https://images.pexels.com/photos/4819372/pexels-photo-4819372.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Luxury Services"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Our Expertise
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Bespoke <span className="text-primary italic">Solutions</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A comprehensive ecosystem of professional services designed to elevate every aspect of your real estate journey.
          </p>
        </div>
      </section>

      {/* Top Agents Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
              Our <span className="text-primary italic">Service Experts</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Connect with our specialized professionals who deliver exceptional results across all our premium services.
            </p>
          </div>
          <AgentSlider agents={getTopAgents(4)} showCount={4} />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 -mt-24 relative z-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-500 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                      <service.icon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8 md:p-10">
                  <h3 className="text-2xl font-serif text-secondary mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckIcon className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-slate-600 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href="/contact"
                    className="inline-flex items-center gap-2 text-secondary font-bold text-sm group/link"
                  >
                    Inquire Now
                    <ArrowRightIcon className="h-4 w-4 group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1000"
                  alt="Dubai Excellence"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-secondary leading-tight">
                The RAGDOL <span className="text-primary italic">Standard</span> of Service
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We don't just provide services; we curate experiences. Our approach is rooted in the belief that luxury is defined by the details and the quality of the relationship.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="text-3xl font-serif text-primary">24/7</div>
                  <div className="text-sm font-bold text-secondary uppercase tracking-widest">Concierge Support</div>
                  <p className="text-xs text-slate-400">Always available for our global clientele.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-serif text-primary">100%</div>
                  <div className="text-sm font-bold text-secondary uppercase tracking-widest">Transparency</div>
                  <p className="text-xs text-slate-400">Full disclosure in every transaction.</p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/about" className="px-10 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300 shadow-xl shadow-secondary/20">
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="bg-secondary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Ready to Experience <span className="text-primary italic">Excellence</span>?</h2>
              <p className="text-xl text-slate-300 mb-12">
                Contact our specialist team today for a confidential consultation regarding your property requirements.
              </p>
              <Link
                href="/contact"
                className="px-12 py-5 bg-primary text-secondary font-bold rounded-2xl hover:bg-white transition-all duration-300 shadow-2xl shadow-primary/20"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
