import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real Estate Services in Dubai | Property Valuation & Investment Advisory | RAGDOL',
  description: 'Comprehensive real estate services in Dubai including property valuation, investment advisory, property management, and legal support. Expert guidance for all your property needs.',
  keywords: 'real estate services dubai, property valuation dubai, investment advisory dubai, property management dubai, real estate legal services dubai',
  openGraph: {
    title: 'Real Estate Services in Dubai | Property Valuation & Investment Advisory',
    description: 'Comprehensive real estate services in Dubai including property valuation, investment advisory, and property management.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Services in Dubai | Property Valuation & Investment Advisory',
    description: 'Comprehensive real estate services in Dubai including property valuation and investment advisory.',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}