import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers at RAGDOL | Real Estate Jobs in Dubai',
  description: 'Join RAGDOL\'s growing team in Dubai. Explore exciting career opportunities in real estate sales, property management, marketing, and technology. Competitive salaries and growth prospects.',
  keywords: 'careers ragdol, real estate jobs dubai, property jobs dubai, real estate careers dubai, jobs in dubai real estate, property management jobs dubai',
  openGraph: {
    title: 'Careers at RAGDOL | Real Estate Jobs in Dubai',
    description: 'Join RAGDOL\'s growing team in Dubai. Explore exciting career opportunities in real estate.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at RAGDOL | Real Estate Jobs in Dubai',
    description: 'Join RAGDOL\'s growing team in Dubai for exciting real estate careers.',
  },
}

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}