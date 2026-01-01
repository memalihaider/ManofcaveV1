import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortgage Calculator Dubai | Property Loan Calculator | RAGDOL',
  description: 'Calculate your mortgage payments in Dubai with our advanced mortgage calculator. Get accurate estimates for property loans, interest rates, and monthly payments.',
  keywords: 'mortgage calculator dubai, property loan calculator dubai, home loan calculator uae, mortgage rates dubai, property financing dubai',
  openGraph: {
    title: 'Mortgage Calculator Dubai | Property Loan Calculator',
    description: 'Calculate your mortgage payments in Dubai with our advanced mortgage calculator.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator Dubai | Property Loan Calculator',
    description: 'Calculate your mortgage payments in Dubai with our advanced calculator.',
  },
}

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}