import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export function Loading({ text }) {
  const { t } = useLanguage()
  const loadingText = text || t('common.loading')

  return (
    <div className="fixed inset-0 bg-[#0f172a]/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e2b4a] p-6 rounded-2xl flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-white/80 font-medium">{loadingText}</p>
      </div>
    </div>
  )
}

export function ContentLoading({ className = '' }) {
  const { t } = useLanguage()
  
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-white/60 mt-4">{t('common.loading')}</p>
    </div>
  )
} 