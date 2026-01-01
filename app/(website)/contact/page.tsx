'use client'

import { useState } from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import AgentSlider from '@/components/agent/AgentSlider'
import { getTopAgents } from '@/lib/mock-data'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    }, 2000)
  }

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Direct Line',
      details: ['+971 50 123 4567', '+971 55 765 4321'],
      description: 'Available 24/7 for VIP clients'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Inquiry',
      details: ['concierge@ragdol.com', 'invest@ragdol.com'],
      description: 'Priority response within 2 hours'
    },
    {
      icon: MapPinIcon,
      title: 'Global Headquarters',
      details: ['Level 45, Burj Daman', 'DIFC, Dubai, UAE'],
      description: 'Private consultations by appointment'
    },
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 p-12 border border-slate-100">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <PaperAirplaneIcon className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-serif text-secondary mb-4">Inquiry Received</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Thank you for reaching out to RAGDOL. One of our senior property advisors will contact you shortly to discuss your requirements.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-secondary hover:bg-primary text-white hover:text-secondary font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-secondary/20"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Dubai Contact"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Connect with <span className="text-primary italic">Excellence</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you're looking to invest, sell, or find your dream home, our elite team is here to provide bespoke guidance.
          </p>
        </div>
      </section>

      {/* Top Agents Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
              Meet Your <span className="text-primary italic">Personal Agent</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Our expert agents are ready to provide personalized guidance for all your real estate needs in Dubai.
            </p>
          </div>
          <AgentSlider agents={getTopAgents(4)} showCount={4} />
        </div>
      </section>

      <section className="py-24 -mt-24 relative z-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-primary/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <info.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif text-secondary mb-4">{info.title}</h3>
                  <div className="space-y-2 mb-4">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-slate-600 font-medium">{detail}</p>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400 italic">{info.description}</p>
                </div>
              ))}

              {/* Social/Live Chat Card */}
              <div className="bg-secondary p-8 rounded-3xl shadow-xl shadow-secondary/20 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <ChatBubbleLeftRightIcon className="h-10 w-10 text-primary mb-6" />
                <h3 className="text-2xl font-serif mb-4">Live Concierge</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Need immediate assistance? Our digital concierge is available for instant property queries.
                </p>
                <button className="px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-colors">
                  Start Live Chat
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
                <div className="flex items-center gap-3 mb-10">
                  <SparklesIcon className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-serif text-secondary">Send a Private Inquiry</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-wider ml-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-wider ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-wider ml-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+971 50 000 0000"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-wider ml-1">Inquiry Type</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all text-slate-600"
                      >
                        <option value="">Select Interest</option>
                        <option value="buying">Buying Property</option>
                        <option value="selling">Selling Property</option>
                        <option value="investment">Investment Advice</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary uppercase tracking-wider ml-1">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Tell us about your property requirements..."
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-300 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-secondary text-white font-bold rounded-2xl hover:bg-primary hover:text-secondary transition-all duration-500 shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5" />
                        Submit Inquiry
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[500px] relative border-8 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m1!1s0x3e5f682826185c6d:0x5629ef87a1744e1!2zQnVyaiBEYW1hbiAtIERpZmMgLSBEdWJhaSAtINCf0L7RgdC10LvQvtC6INCU0L7QvNCw0L0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682826185c6d%3A0x5629ef87a1744e1!2sBurj%20Daman!5e0!3m2!1sen!2sae!4v1710345678901!5m2!1sen!2sae" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale contrast-125"
            ></iframe>
            <div className="absolute bottom-10 left-10 bg-white p-8 rounded-3xl shadow-2xl max-w-xs hidden md:block">
              <h4 className="text-xl font-serif text-secondary mb-2">Visit Our Office</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Burj Daman, Level 45<br />
                DIFC, Dubai, UAE
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
                <MapPinIcon className="h-4 w-4" />
                Get Directions
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
