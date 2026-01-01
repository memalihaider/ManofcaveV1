'use client'

import { useState, useRef } from 'react'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BriefcaseIcon, 
  DocumentArrowUpIcon, 
  LinkIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '1-3',
    linkedin: '',
    portfolio: '',
    message: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Application submitted successfully!')
      setIsSubmitted(true)
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif text-secondary mb-4">Application Received</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Thank you for your interest in joining RAGDOL. Our talent acquisition team will review your profile and get back to you within 48 hours.
          </p>
          <Link 
            href="/"
            className="inline-block w-full py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/careers"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Careers
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4">
              Join the <span className="text-primary italic">Elite</span>
            </h1>
            <p className="text-slate-500 text-lg">
              Complete the form below to start your journey with Dubai's most prestigious real estate collective.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                {/* Personal Info */}
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-secondary flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input 
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                      <input 
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+971 XX XXX XXXX"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Position Applied For</label>
                      <select 
                        required
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                      >
                        <option value="">Select Position</option>
                        <option value="sales">Senior Luxury Property Advisor</option>
                        <option value="analyst">Portfolio Investment Analyst</option>
                        <option value="marketing">Head of Digital Marketing</option>
                        <option value="concierge">VIP Client Concierge</option>
                        <option value="other">Other / General Application</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-6 pt-8 border-t border-slate-100">
                  <h3 className="text-xl font-serif text-secondary flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-primary" />
                    Professional Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Years of Experience</label>
                      <select 
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                      >
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1 - 3 years</option>
                        <option value="3-5">3 - 5 years</option>
                        <option value="5-10">5 - 10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">LinkedIn Profile</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input 
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Resume / CV (PDF, Max 5MB)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-6 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all group"
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <DocumentArrowUpIcon className="h-10 w-10 text-slate-300 group-hover:text-primary transition-colors" />
                      <span className="text-slate-500 font-medium">
                        {fileName || 'Click to upload or drag and drop'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Why RAGDOL? (Cover Letter)</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Tell us about your ambitions and how you can contribute to our vision..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-5 bg-secondary text-white font-bold rounded-2xl hover:bg-primary hover:text-secondary transition-all duration-300 shadow-2xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Application...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <SparklesIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              <div className="bg-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif mb-6">Application <span className="text-primary italic">Process</span></h3>
                  <div className="space-y-8">
                    {[
                      { step: '01', title: 'Review', desc: 'Our team reviews your portfolio and experience.' },
                      { step: '02', title: 'Interview', desc: 'A deep-dive into your vision and skills.' },
                      { step: '03', title: 'Onboarding', desc: 'Welcome to the elite RAGDOL collective.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-primary font-serif text-xl">{item.step}</span>
                        <div>
                          <h4 className="font-bold mb-1">{item.title}</h4>
                          <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-serif text-secondary mb-6">Need Help?</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  If you encounter any issues with your application, please contact our support team.
                </p>
                <Link 
                  href="/contact"
                  className="text-primary font-bold hover:underline"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
