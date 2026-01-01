'use client'

import { useState } from 'react'
import { ChevronDownIcon, QuestionMarkCircleIcon, MagnifyingGlassIcon, SparklesIcon, ShieldCheckIcon, BanknotesIcon, ScaleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

const faqCategories = [
  {
    title: 'Acquisition & Buying',
    icon: ShieldCheckIcon,
    questions: [
      {
        question: 'What documents are required for a luxury property acquisition?',
        answer: 'For a seamless transaction, we require a passport copy, proof of residence, and proof of funds. For international investors, we also facilitate the process of obtaining a Dubai Golden Visa through property investment.'
      },
      {
        question: 'Can non-residents own 100% of their property in Dubai?',
        answer: 'Absolutely. Dubai offers "Freehold" areas where international investors have 100% ownership rights. RAGDOL specializes exclusively in these high-growth, unrestricted zones.'
      },
      {
        question: 'What are the associated costs beyond the purchase price?',
        answer: 'Standard costs include a 4% Dubai Land Department (DLD) registration fee, a small administrative fee, and our professional brokerage fee. We provide a detailed "Cost of Acquisition" breakdown for every property.'
      }
    ]
  },
  {
    title: 'Investment & Yield',
    icon: BanknotesIcon,
    questions: [
      {
        question: 'What is the average rental yield for luxury properties?',
        answer: 'Dubai remains one of the world\'s highest-yielding markets. Luxury apartments typically yield 6-8% net, while ultra-luxury villas offer 4-6% alongside significant capital appreciation.'
      },
      {
        question: 'Is there any tax on rental income or capital gains?',
        answer: 'One of Dubai\'s greatest advantages is the 0% tax environment. There is no personal income tax on rentals and no capital gains tax on property appreciation.'
      }
    ]
  },
  {
    title: 'Legal & Compliance',
    icon: ScaleIcon,
    questions: [
      {
        question: 'How does RAGDOL ensure transaction security?',
        answer: 'Every transaction is processed through government-regulated escrow accounts. We work closely with the Dubai Land Department to ensure all title deeds are issued instantly upon completion.'
      },
      {
        question: 'What is the process for off-plan investments?',
        answer: 'Off-plan investments involve a structured payment plan linked to construction milestones. We only represent developers with a proven track record of excellence and timely delivery.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop"
            alt="Dubai FAQ"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Knowledge Base
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-8">
            Expert <span className="text-primary italic">Insights</span>
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search for property insights, legal advice, or investment tips..."
              className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Sidebar Categories */}
            <div className="lg:col-span-1 space-y-4">
              <div className="sticky top-32">
                <h2 className="text-2xl font-serif text-secondary mb-8">Categories</h2>
                {faqCategories.map((category, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl hover:bg-slate-50 transition-colors group text-left"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-bold text-secondary">{category.title}</span>
                  </button>
                ))}
                
                <div className="mt-12 p-8 bg-secondary rounded-[2rem] text-white relative overflow-hidden">
                  <SparklesIcon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-serif mb-2">Still have questions?</h3>
                  <p className="text-slate-400 text-sm mb-6">Our advisors are available for a private consultation.</p>
                  <button className="w-full py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-colors">
                    Contact Advisor
                  </button>
                </div>
              </div>
            </div>

            {/* Accordion List */}
            <div className="lg:col-span-2 space-y-12">
              {faqCategories.map((category, catIdx) => (
                <div key={catIdx}>
                  <h3 className="text-2xl font-serif text-secondary mb-8 flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-primary" />
                    {category.title}
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, qIdx) => {
                      const id = `${catIdx}-${qIdx}`
                      const isOpen = openIndex === id
                      return (
                        <div 
                          key={qIdx}
                          className={`border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-xl shadow-slate-200/50 border-primary/20' : 'hover:border-slate-200'}`}
                        >
                          <button
                            onClick={() => toggleAccordion(id)}
                            className="w-full flex items-center justify-between p-6 text-left bg-white"
                          >
                            <span className="font-bold text-secondary pr-8">{faq.question}</span>
                            <ChevronDownIcon className={`h-5 w-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                          >
                            <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-white">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-serif text-secondary mb-6">Ready to <span className="text-primary italic">Invest</span>?</h2>
            <p className="text-slate-500 text-lg mb-10">
              Join thousands of global investors who trust RAGDOL for their Dubai property portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300">
                View Listings
              </button>
              <button className="px-10 py-4 bg-white text-secondary border-2 border-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all duration-300">
                Download Guide
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
