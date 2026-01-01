import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dubai Real Estate Market Insights & Trends 2025 | RAGDOL',
  description: 'Comprehensive Dubai real estate market analysis and trends for 2025. Property prices, market insights, investment opportunities, and future predictions.',
  keywords: 'dubai real estate market, property market dubai, real estate trends dubai, market analysis dubai, property prices dubai, investment dubai',
  openGraph: {
    title: 'Dubai Real Estate Market Insights & Trends 2025',
    description: 'Comprehensive Dubai real estate market analysis and trends for 2025.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubai Real Estate Market Insights & Trends 2025',
    description: 'Comprehensive Dubai real estate market analysis and trends.',
  },
}

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}