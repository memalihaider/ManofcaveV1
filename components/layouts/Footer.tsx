'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  const footerLinks = {
    company: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('footer.careers'), href: '/careers' },
      { label: t('footer.contact'), href: '/contact' },
      { label: t('footer.services'), href: '/services' },
    ],
    discover: [
      { label: t('footer.buyProperty'), href: '/properties?status=sale' },
      { label: t('footer.newProjects'), href: '/projects' },
      { label: t('footer.eliteAgents'), href: '/agents' },
      { label: t('footer.marketInsights'), href: '/market' },
    ],
    legal: [
      { label: t('footer.termsOfService'), href: '/terms' },
      { label: t('footer.privacyPolicy'), href: '/privacy' },
      { label: t('footer.cookiePolicy'), href: '/cookies' },
      { label: t('footer.faq'), href: '/faq' },
    ],
  }

  return (
    <footer className="bg-secondary text-slate-300 pt-24 pb-12 border-t border-white/5">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <SparklesIcon className="h-7 w-7 text-secondary" />
              </div>
              <span className="text-3xl font-serif text-white tracking-tighter">RAGDOLL</span>
            </Link>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-md">
              Redefining luxury real estate in Dubai. We provide bespoke property solutions for the world's most discerning investors.
            </p>
            
            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm">{t('footer.subscribeToEliteList')}</h4>
              <form className="flex gap-2 max-w-md">
                <input 
                  type="email" 
                  placeholder={t('footer.emailAddress')} 
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all text-white"
                />
                <button className="px-6 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all">
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">{t('footer.company')}</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-primary transition-all group-hover:w-4"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">{t('footer.discover')}</h4>
            <ul className="space-y-4">
              {footerLinks.discover.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-primary transition-all group-hover:w-4"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">{t('footer.contact')}</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPinIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-sm leading-relaxed">Level 42, Emirates Towers, Sheikh Zayed Road, Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-4">
                <PhoneIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-sm">+971 4 123 4567</span>
              </li>
              <li className="flex items-center gap-4">
                <EnvelopeIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-sm">concierge@ragdol.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm text-slate-500">
            © {currentYear} RAGDOL Premium Real Estate. All rights reserved.
          </div>
          <div className="flex gap-8">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs uppercase tracking-widest hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-6">
            {/* Social Icons */}
            {['fb', 'ig', 'tw', 'li'].map((social) => (
              <div key={social} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-secondary transition-all cursor-pointer">
                <span className="text-xs font-bold uppercase">{social}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
