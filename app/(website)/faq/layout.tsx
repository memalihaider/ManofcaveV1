import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real Estate FAQ Dubai | Property Buying Guide | RAGDOL',
  description: 'Frequently asked questions about buying, selling, and investing in Dubai real estate. Comprehensive guide covering property laws, taxes, mortgages, and investment opportunities.',
  keywords: 'real estate faq dubai, property buying guide dubai, real estate questions dubai, property investment dubai, dubai property laws, mortgage dubai',
  openGraph: {
    title: 'Real Estate FAQ Dubai | Property Buying Guide',
    description: 'Frequently asked questions about buying, selling, and investing in Dubai real estate.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate FAQ Dubai | Property Buying Guide',
    description: 'Frequently asked questions about Dubai real estate and property investment.',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}