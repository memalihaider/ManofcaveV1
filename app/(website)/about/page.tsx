import { BuildingOfficeIcon, UsersIcon, TrophyIcon, ShieldCheckIcon, HeartIcon, GlobeAltIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AgentSlider from '@/components/agent/AgentSlider'
import { getTopAgents } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'About RAGDOL | The Pinnacle of Dubai Real Estate',
  description: 'Discover the story of RAGDOL, Dubai\'s premier luxury real estate platform. Redefining property excellence since 2010.',
}

export default function AboutPage() {
  const stats = [
    { label: 'Premium Listings', value: '50,000+', icon: BuildingOfficeIcon },
    { label: 'Elite Clients', value: '25,000+', icon: UsersIcon },
    { label: 'Years of Mastery', value: '15+', icon: TrophyIcon },
    { label: 'Global Reach', value: '50+', icon: GlobeAltIcon },
  ]

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Uncompromising Integrity',
      description: 'In the world of luxury, trust is the ultimate currency. We maintain the highest standards of transparency in every transaction.'
    },
    {
      icon: SparklesIcon,
      title: 'Excellence as Standard',
      description: 'We don\'t just meet expectations; we redefine them. Every property and every interaction is handled with meticulous care.'
    },
    {
      icon: ChartBarIcon,
      title: 'Data-Driven Insights',
      description: 'Our expertise is backed by sophisticated market analysis, ensuring our clients make informed, high-yield decisions.'
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Dubai Skyline"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-secondary"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Our Legacy
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8">
            Redefining <span className="text-primary italic">Luxury</span> Real Estate
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Since 2010, RAGDOL has been the cornerstone of Dubai's most prestigious property transactions, 
            connecting discerning global investors with the city's most iconic addresses.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 -mt-20 relative z-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-serif text-secondary mb-2">{stat.value}</div>
                <div className="text-slate-500 font-medium uppercase tracking-wider text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Agents Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
              Our <span className="text-primary italic">Expert Team</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Meet the professionals who make RAGDOL the premier destination for luxury real estate in Dubai.
            </p>
          </div>
          <AgentSlider agents={getTopAgents(4)} showCount={4} />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1000"
                  alt="Luxury Interior"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary rounded-3xl -z-10 hidden lg:block"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-primary/20 rounded-3xl translate-x-6 translate-y-6 -z-10"></div>
            </div>
            
            <div className="space-y-8">
              <div className="inline-block w-20 h-1 bg-primary"></div>
              <h2 className="text-4xl md:text-5xl font-serif text-secondary leading-tight">
                Our Mission is to <span className="text-primary italic">Elevate</span> Your Lifestyle
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                At RAGDOL, we believe that a home is more than just a structure; it's a masterpiece of personal expression. 
                Our mission is to provide a seamless, sophisticated platform that empowers our clients to acquire 
                not just property, but a legacy.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We combine traditional expertise with cutting-edge technology to ensure that every 
                transaction is as flawless as the properties we represent.
              </p>
              <div className="pt-6">
                <Link href="/properties" className="inline-flex items-center gap-2 text-secondary font-bold group">
                  Explore Our Collection
                  <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">The RAGDOL <span className="text-primary italic">Philosophy</span></h2>
            <p className="text-slate-500 text-lg">
              Our core values are the foundation upon which we build lasting relationships with the world's most discerning property seekers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index} className="relative p-10 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/30 group hover:border-primary/30 transition-all duration-500">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
                  <value.icon className="h-8 w-8 text-white group-hover:text-secondary transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-serif text-secondary mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4"></div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-white">A Decade of <span className="text-primary italic">Excellence</span></h2>
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                <p>
                  Founded in 2010, RAGDOL began with a singular vision: to bring a new level of sophistication 
                  to the Dubai real estate market. What started as a boutique agency has evolved into 
                  the region's most trusted luxury property platform.
                </p>
                <p>
                  Our growth has been fueled by a relentless pursuit of perfection and an intimate 
                  understanding of the luxury lifestyle. We don't just sell properties; we curate 
                  experiences that define the future of living.
                </p>
                <p>
                  Today, RAGDOL stands as a symbol of prestige, representing the most exclusive 
                  developments and serving a global clientele that demands nothing but the best.
                </p>
              </div>
              <div className="pt-4">
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-3xl font-serif text-primary">2010</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Established</div>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div>
                    <div className="text-3xl font-serif text-primary">150+</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Elite Partners</div>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div>
                    <div className="text-3xl font-serif text-primary">$10B+</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Total Sales</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image 
                  src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1000"
                  alt="Dubai Night"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-slate-100">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-serif text-secondary mb-8">Begin Your <span className="text-primary italic">Journey</span></h2>
              <p className="text-xl text-slate-600 mb-12">
                Whether you are looking to acquire a penthouse in the clouds or a villa by the sea, 
                our experts are ready to guide you home.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/properties"
                  className="px-10 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300 shadow-xl shadow-secondary/20"
                >
                  View Exclusive Listings
                </Link>
                <Link
                  href="/contact"
                  className="px-10 py-4 bg-white text-secondary border-2 border-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all duration-300"
                >
                  Speak with an Advisor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
