import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact RAGDOL - Real Estate Experts in Dubai',
  description: 'Get in touch with RAGDOL\'s real estate experts in Dubai. Contact us for property inquiries, investment advice, and professional property services.',
  keywords: 'contact ragdol, real estate dubai contact, property inquiry dubai, real estate agents dubai, property consultation dubai',
  openGraph: {
    title: 'Contact RAGDOL - Real Estate Experts in Dubai',
    description: 'Get in touch with RAGDOL\'s real estate experts in Dubai for property inquiries and investment advice.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact RAGDOL - Real Estate Experts in Dubai',
    description: 'Get in touch with RAGDOL\'s real estate experts in Dubai for property inquiries.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}