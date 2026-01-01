import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell Your Property in Dubai | List Property for Sale | RAGDOL',
  description: 'Sell your property in Dubai with RAGDOL. Free property valuation, professional photography, and expert marketing to get the best price for your home.',
  keywords: 'sell property dubai, list property dubai, property valuation dubai, sell house dubai, property marketing dubai, real estate agent dubai',
  openGraph: {
    title: 'Sell Your Property in Dubai | List Property for Sale',
    description: 'Sell your property in Dubai with RAGDOL. Free property valuation and expert marketing.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your Property in Dubai | List Property for Sale',
    description: 'Sell your property in Dubai with RAGDOL. Free property valuation.',
  },
}

export default function SellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}