import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | User Agreement & Conditions | RAGDOL',
  description: 'Read RAGDOL\'s terms of service and user agreement. Understand your rights and responsibilities when using our real estate platform in Dubai.',
  keywords: 'terms of service ragdol, user agreement dubai, terms and conditions, user rights, service agreement, legal terms',
  openGraph: {
    title: 'Terms of Service | User Agreement & Conditions',
    description: 'Read RAGDOL\'s terms of service and understand your rights and responsibilities.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | User Agreement & Conditions',
    description: 'Read RAGDOL\'s terms of service and user agreement.',
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}