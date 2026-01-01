'use client'

import { useEffect, useState } from 'react'
import i18n from '../../lib/i18n'

interface DynamicHtmlProps {
  children: React.ReactNode
}

export default function DynamicHtml({ children }: DynamicHtmlProps) {
  const [lang, setLang] = useState('en')
  const [dir, setDir] = useState('ltr')

  useEffect(() => {
    // Get saved language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'English'
    const langCode = savedLanguage.toLowerCase().substring(0, 2)

    // Set initial language and direction
    setLang(langCode)
    setDir(langCode === 'ar' ? 'rtl' : 'ltr')

    // Update document attributes
    document.documentElement.lang = langCode
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr'

    // Change i18n language if different
    if (i18n.language !== langCode) {
      i18n.changeLanguage(langCode)
    }

    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      setLang(lng)
      setDir(lng === 'ar' ? 'rtl' : 'ltr')
      document.documentElement.lang = lng
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  return (
    <html lang={lang} dir={dir}>
      {children}
    </html>
  )
}