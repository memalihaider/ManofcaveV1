import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dubai Property Guides | Area Guides & Buying Tips | RAGDOL',
  description: 'Comprehensive guides to Dubai neighborhoods and property buying. Area guides for Dubai Marina, Palm Jumeirah, Downtown Dubai, and expert tips for property investment.',
  keywords: 'dubai property guides, area guides dubai, property buying tips dubai, dubai neighborhoods, real estate guides dubai, investment guides dubai',
  openGraph: {
    title: 'Dubai Property Guides | Area Guides & Buying Tips',
    description: 'Comprehensive guides to Dubai neighborhoods and property buying tips.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubai Property Guides | Area Guides & Buying Tips',
    description: 'Comprehensive guides to Dubai neighborhoods and property buying.',
  },
}

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}