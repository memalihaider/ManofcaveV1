import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Properties for Sale in Dubai | Luxury Homes & Apartments | RAGDOL',
  description: 'Browse thousands of properties for sale in Dubai. Find luxury apartments, villas, penthouses, and commercial properties. Advanced search and filters available.',
  keywords: 'properties dubai, real estate dubai, apartments dubai, villas dubai, penthouses dubai, commercial properties dubai, property for sale dubai',
  openGraph: {
    title: 'Properties for Sale in Dubai | Luxury Homes & Apartments',
    description: 'Browse thousands of properties for sale in Dubai. Find luxury apartments, villas, penthouses, and commercial properties.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Properties for Sale in Dubai | Luxury Homes & Apartments',
    description: 'Browse thousands of properties for sale in Dubai. Find luxury apartments, villas, penthouses, and commercial properties.',
  },
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}