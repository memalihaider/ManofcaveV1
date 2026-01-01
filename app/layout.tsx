import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic, Cairo, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import FloatingActionButtons from '@/components/shared/FloatingActionButtons'
import FloatingTools from '@/components/shared/FloatingTools'
import I18nProvider from '@/components/shared/I18nProvider'
import DynamicHtml from '@/components/layouts/DynamicHtml'
import ConditionalLayout from '@/components/layouts/ConditionalLayout'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "RAGDOL - Premium Real Estate in Pakistan",
  description: "Find your dream property in Pakistan. Browse apartments, villas, plots, and commercial properties in Lahore, Karachi, Islamabad, and more.",
  keywords: "real estate pakistan, property for sale, buy house pakistan, apartments lahore, villas karachi",
};

function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <I18nProvider>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </I18nProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DynamicHtml>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} ${cairo.variable} ${amiri.variable} antialiased min-h-screen flex flex-col`}
      >
        <RootContent>{children}</RootContent>
      </body>
    </DynamicHtml>
  )
}
