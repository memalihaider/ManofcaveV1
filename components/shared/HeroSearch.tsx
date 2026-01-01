"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

type Props = {
  initialValue?: string
}

export default function HeroSearch({ initialValue = '' }: Props) {
  const { t } = useTranslation()
  const [term, setTerm] = useState(initialValue)
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy')
  const router = useRouter()

  const runSearch = () => {
    const trimmed = (term || '').trim()
    const params = new URLSearchParams()
    params.set('action', activeTab)
    if (trimmed) params.set('search', trimmed)
    const query = params.toString()
    const url = query ? `/properties?${query}` : '/properties'
    router.push(url)
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      {/* Tabs */}
      <div className="flex space-x-1 mb-1 ml-1">
        <button
          onClick={() => setActiveTab('buy')}
          className={`px-6 py-2.5 rounded-t-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'buy' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'bg-slate-900/40 text-white hover:bg-slate-900/60 backdrop-blur-md'
          }`}
        >
          {t('common.buy').toUpperCase()}
        </button>
        <button
          onClick={() => setActiveTab('rent')}
          className={`px-6 py-2.5 rounded-t-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'rent' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'bg-slate-900/40 text-white hover:bg-slate-900/60 backdrop-blur-md'
          }`}
        >
          {t('common.rent').toUpperCase()}
        </button>
      </div>

      {/* Search Box */}
      <div className="bg-white p-1 md:p-2 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by location, project, or developer..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                runSearch()
              }
            }}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>
        <button
          onClick={runSearch}
          className="w-full md:w-auto btn-primary !py-4 !px-10 !rounded-xl md:!rounded-2xl shadow-xl shadow-primary/20"
        >
          Search
        </button>
      </div>
      
      {/* Quick Links */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-white/80 text-sm font-medium">
        <span className="opacity-60">Popular:</span>
        <button onClick={() => { setTerm('Dubai Marina'); runSearch(); }} className="hover:text-white transition-colors underline underline-offset-4 decoration-primary/40">Dubai Marina</button>
        <button onClick={() => { setTerm('Palm Jumeirah'); runSearch(); }} className="hover:text-white transition-colors underline underline-offset-4 decoration-primary/40">Palm Jumeirah</button>
        <button onClick={() => { setTerm('Downtown Dubai'); runSearch(); }} className="hover:text-white transition-colors underline underline-offset-4 decoration-primary/40">Downtown Dubai</button>
      </div>
    </div>
  )
}
