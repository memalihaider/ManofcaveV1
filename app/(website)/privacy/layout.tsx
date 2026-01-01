import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Data Protection & User Rights | RAGDOL',
  description: 'RAGDOL\'s privacy policy explains how we collect, use, and protect your personal information. Learn about your data rights and our commitment to privacy.',
  keywords: 'privacy policy ragdol, data protection dubai, user privacy, data rights, privacy statement, personal information protection',
  openGraph: {
    title: 'Privacy Policy | Data Protection & User Rights',
    description: 'RAGDOL\'s privacy policy explains how we collect, use, and protect your personal information.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Data Protection & User Rights',
    description: 'Learn about RAGDOL\'s privacy policy and data protection practices.',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}