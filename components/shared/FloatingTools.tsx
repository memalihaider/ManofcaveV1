'use client'

import { useState, useEffect } from 'react'
import { Cog6ToothIcon, XMarkIcon, GlobeAltIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

export default function FloatingTools() {
  const { t, i18n } = useTranslation()
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState('All Areas')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedCurrency, setSelectedCurrency] = useState('AED')

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedArea = localStorage.getItem('selectedArea')
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'English'
    const savedCurrency = localStorage.getItem('selectedCurrency')

    if (savedArea) setSelectedArea(savedArea)
    setSelectedLanguage(savedLanguage)

    // Set initial language
    const langCode = savedLanguage.toLowerCase().substring(0, 2)
    if (i18n.language !== langCode) {
      i18n.changeLanguage(langCode)
    }

    if (savedCurrency) setSelectedCurrency(savedCurrency)
  }, []) // Remove i18n dependency to prevent re-running

  const areas = [
    'All Areas',
    'Dubai Marina',
    'Palm Jumeirah',
    'Jumeirah Beach Residence',
    'Dubai Hills Estate',
    'Emirates Hills',
    'Business Bay',
    'Downtown Dubai',
    'Dubai Silicon Oasis',
    'Dubai Festival City'
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' }
  ]

  const currencies = [
    { code: 'AED', name: 'AED', symbol: 'د.إ' },
    { code: 'USD', name: 'USD', symbol: '$' },
    { code: 'PKR', name: 'PKR', symbol: '₨' },
    { code: 'EUR', name: 'EUR', symbol: '€' },
    { code: 'GBP', name: 'GBP', symbol: '£' },
    { code: 'INR', name: 'INR', symbol: '₹' }
  ]

  const handleAreaChange = (area: string) => {
    setSelectedArea(area)
    // Here you would typically update the global state or context
    // For now, we'll just store it locally
    localStorage.setItem('selectedArea', area)
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    const langCode = language.toLowerCase().substring(0, 2)
    i18n.changeLanguage(langCode)
    localStorage.setItem('selectedLanguage', language)
    // Note: HTML lang and dir attributes are handled by DynamicHtml component
  }

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency)
    // Here you would typically update the global currency state
    localStorage.setItem('selectedCurrency', currency)
  }

  return (
    <>
      {/* Floating Tools Button */}
      <div className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2">
        <button
          onClick={() => setIsToolsOpen(true)}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group relative"
          aria-label="Open tools and settings"
        >
          <Cog6ToothIcon className="w-5 h-5" />
          {/* Tooltip */}
          <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Tools
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-3 border-b-3 border-r-3 border-transparent border-r-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Tools Modal */}
      {isToolsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5" />
                {t('tools.title')}
              </h3>
              <button
                onClick={() => setIsToolsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Area Selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPinIcon className="w-4 h-4" />
                  <h4 className="text-base font-semibold">{t('tools.areaFilter')}</h4>
                </div>
                <select
                  value={selectedArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Switcher */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <GlobeAltIcon className="w-4 h-4" />
                  <h4 className="text-base font-semibold">{t('tools.language')}</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                        selectedLanguage === lang.name
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {selectedLanguage === lang.name && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Switcher */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  <h4 className="text-base font-semibold">{t('tools.currency')}</h4>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencyChange(currency.code)}
                      className={`flex items-center gap-1 px-2 py-2 rounded-lg border text-xs transition-all ${
                        selectedCurrency === currency.code
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="font-medium">{currency.symbol}</span>
                      <span>{currency.name}</span>
                      {selectedCurrency === currency.code && (
                        <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Reset to defaults
                    setSelectedArea('All Areas')
                    setSelectedLanguage('English')
                    setSelectedCurrency('AED')
                    i18n.changeLanguage('en')
                    document.documentElement.lang = 'en'
                    document.documentElement.dir = 'ltr'
                    localStorage.removeItem('selectedArea')
                    localStorage.removeItem('selectedLanguage')
                    localStorage.removeItem('selectedCurrency')
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('tools.reset')}
                </button>
                <button
                  onClick={() => setIsToolsOpen(false)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('tools.apply')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}